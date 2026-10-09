// Tests for adminita/static/adminita/adminita-autosave.js (run with `npm test`).
const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { JSDOM } = require("jsdom");

const SCRIPT = fs.readFileSync(
  path.join(__dirname, "../../adminita/static/adminita/adminita-autosave.js"),
  "utf8"
);
const URL = "http://localhost/admin/app/model/1/change/";
const KEY = "adminita-autosave:/admin/app/model/1/change/";

async function load({ storage = {}, bodyClass = "", html } = {}) {
  const dom = new JSDOM(
    `<!doctype html><body class="${bodyClass}">${
      html ||
      `<form method="post" id="model_form">
         <input type="hidden" name="csrfmiddlewaretoken" value="x">
         <input type="text" name="title" value="Original">
         <input type="password" name="pw" value="">
         <textarea name="body">Hello</textarea>
         <select name="kind"><option value="a" selected>A</option><option value="b">B</option></select>
       </form>`
    }</body>`,
    { url: URL, runScripts: "outside-only" }
  );
  const { window } = dom;
  for (const [k, v] of Object.entries(storage)) window.localStorage.setItem(k, v);
  window.eval(SCRIPT);
  // jsdom parses asynchronously; wait until the script's init() has run.
  if (window.document.readyState === "loading") {
    await new Promise((r) => window.document.addEventListener("DOMContentLoaded", r));
  }
  return window;
}

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

function type(window, name, value) {
  const field = window.document.querySelector(`[name=${name}]`);
  field.value = value;
  field.dispatchEvent(new window.Event("input", { bubbles: true }));
}

const entry = (fields, savedAt = Date.now()) => JSON.stringify({ savedAt, fields });

test("saves only changed fields, never passwords or the CSRF token", async () => {
  const window = await load();
  type(window, "title", "Edited");
  type(window, "pw", "secret");
  await wait(600);
  const saved = JSON.parse(window.localStorage.getItem(KEY));
  assert.deepEqual(Object.keys(saved.fields), ["title"]);
  assert.equal(saved.fields.title.original, "Original");
  assert.equal(saved.fields.title.value, "Edited");
});

test("removes the stored entry when the user reverts to the original value", async () => {
  const window = await load();
  type(window, "title", "Edited");
  await wait(600);
  assert.ok(window.localStorage.getItem(KEY));
  type(window, "title", "Original");
  await wait(600);
  assert.equal(window.localStorage.getItem(KEY), null);
});

test("offers Restore/Discard and does not restore automatically", async () => {
  const window = await load({
    storage: { [KEY]: entry({ title: { original: "Original", value: "Draft" } }) },
  });
  assert.ok(window.document.querySelector(".adminita-autosave-banner"));
  assert.equal(window.document.querySelector("[name=title]").value, "Original");
});

test("Restore applies the saved value and removes the banner", async () => {
  const window = await load({
    storage: { [KEY]: entry({ title: { original: "Original", value: "Draft" } }) },
  });
  window.document.querySelector(".adminita-autosave-banner button").click();
  assert.equal(window.document.querySelector("[name=title]").value, "Draft");
  assert.equal(window.document.querySelector(".adminita-autosave-banner"), null);
});

test("Discard clears storage and leaves the form untouched", async () => {
  const window = await load({
    storage: { [KEY]: entry({ title: { original: "Original", value: "Draft" } }) },
  });
  window.document.querySelectorAll(".adminita-autosave-banner button")[1].click();
  assert.equal(window.localStorage.getItem(KEY), null);
  assert.equal(window.document.querySelector("[name=title]").value, "Original");
});

test("does not offer a restore if the server value changed since the edit", async () => {
  const window = await load({
    storage: { [KEY]: entry({ title: { original: "Older server value", value: "Draft" } }) },
  });
  assert.equal(window.document.querySelector(".adminita-autosave-banner"), null);
  assert.equal(window.localStorage.getItem(KEY), null);
});

test("expired entries (older than a week) are purged and not offered", async () => {
  const old = Date.now() - 8 * 24 * 60 * 60 * 1000;
  const window = await load({
    storage: { [KEY]: entry({ title: { original: "Original", value: "Draft" } }, old) },
  });
  assert.equal(window.document.querySelector(".adminita-autosave-banner"), null);
  assert.equal(window.localStorage.getItem(KEY), null);
});

test("legacy adminFormData_ entries are removed", async () => {
  const window = await load({ storage: { adminFormData_old: "{}" } });
  assert.equal(window.localStorage.getItem("adminFormData_old"), null);
});

test("submitting the form clears the stored entry and stops saving", async () => {
  const window = await load();
  type(window, "title", "Edited");
  await wait(600);
  assert.ok(window.localStorage.getItem(KEY));
  window.document.querySelector("form").dispatchEvent(new window.Event("submit", { cancelable: true }));
  assert.equal(window.localStorage.getItem(KEY), null);
  type(window, "title", "Edited again");
  await wait(600);
  assert.equal(window.localStorage.getItem(KEY), null);
});

test("does nothing inside related-object popups", async () => {
  const window = await load({ bodyClass: "is-popup" });
  type(window, "title", "Edited");
  await wait(600);
  assert.equal(window.localStorage.getItem(KEY), null);
});

test("adminitaClearAutosave removes all autosave entries", async () => {
  const window = await load({
    storage: { [KEY]: entry({ title: { original: "Original", value: "Draft" } }), other: "keep" },
  });
  window.adminitaClearAutosave();
  assert.equal(window.localStorage.getItem(KEY), null);
  assert.equal(window.localStorage.getItem("other"), "keep");
});
