// Tests for adminita/static/adminita/adminita-sidebar.js (run with `npm test`).
const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { JSDOM } = require("jsdom");

const SCRIPT = fs.readFileSync(
  path.join(__dirname, "../../adminita/static/adminita/adminita-sidebar.js"),
  "utf8"
);
const KEY = "adminita-sidebar";

const HTML = `<aside id="sidebar"><nav>
  <div class="adminita-sb-controls" hidden>
    <button type="button" data-sb-action="expand">Expand all</button>
    <button type="button" data-sb-action="collapse">Collapse all</button>
  </div>
  <details class="sb-group" data-group="shop"><summary>Shop</summary><a href="/admin/shop/product/">Products</a></details>
  <details class="sb-group" data-group="blog"><summary>Blog</summary><a href="/admin/blog/post/">Posts</a></details>
  <details class="sb-group" data-group="auth"><summary>Users</summary><a href="/admin/auth/user/">Users</a></details>
</nav></aside>`;

async function load({ url = "http://localhost/admin/", storage = {} } = {}) {
  const dom = new JSDOM(`<!doctype html><body>${HTML}</body>`, {
    url,
    runScripts: "outside-only",
  });
  const { window } = dom;
  for (const [k, v] of Object.entries(storage)) window.localStorage.setItem(k, v);
  window.eval(SCRIPT);
  if (window.document.readyState === "loading") {
    await new Promise((r) => window.document.addEventListener("DOMContentLoaded", r));
  }
  return window;
}
const openGroups = (w) =>
  [...w.document.querySelectorAll("details")].filter((d) => d.open).map((d) => d.dataset.group);

test("first visit on the index: everything is closed", async () => {
  assert.deepEqual(openGroups(await load()), []);
});

test("section holding a sub-page (change form) opens and is marked active", async () => {
  const w = await load({ url: "http://localhost/admin/blog/post/5/change/" });
  assert.deepEqual(openGroups(w), ["blog"]);
  assert.equal(w.document.querySelector('[data-group="blog"]').hasAttribute("data-active"), true);
});

test("remembered sections are restored", async () => {
  const w = await load({ storage: { [KEY]: JSON.stringify({ shop: true }) } });
  assert.deepEqual(openGroups(w), ["shop"]);
});

test("a click on a heading is remembered", async () => {
  const w = await load();
  w.document.querySelector('[data-group="auth"] summary').click();
  assert.equal(JSON.parse(w.localStorage.getItem(KEY)).auth, true);
});

test("expand all opens everything and remembers it", async () => {
  const w = await load();
  w.document.querySelector('[data-sb-action="expand"]').click();
  assert.deepEqual(openGroups(w), ["shop", "blog", "auth"]);
  assert.equal(JSON.parse(w.localStorage.getItem(KEY)).blog, true);
});

test("collapse all closes everything except the current section", async () => {
  const w = await load({
    url: "http://localhost/admin/shop/product/",
    storage: { [KEY]: JSON.stringify({ blog: true, auth: true }) },
  });
  w.document.querySelector('[data-sb-action="collapse"]').click();
  assert.deepEqual(openGroups(w), ["shop"]);
});

test("the script reveals the expand/collapse controls", async () => {
  assert.equal((await load()).document.querySelector(".adminita-sb-controls").hidden, false);
});

test("corrupt saved data does not break the sidebar", async () => {
  const w = await load({ storage: { [KEY]: "{not json" } });
  assert.deepEqual(openGroups(w), []);
});
