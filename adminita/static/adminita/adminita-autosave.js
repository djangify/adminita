/*
 * Adminita form autosave.
 *
 * Keeps unsaved edits on admin change/add forms so they survive an accidental
 * refresh or closed tab, without silently writing stale data back:
 *
 * - Only fields the user actually changed are stored, together with the value
 *   the server rendered for them at the time.
 * - Nothing is restored automatically. A banner offers "Restore" or "Discard".
 * - A stored field is only offered for restore if the server value is still
 *   the same as when it was edited, so changes made by someone else in the
 *   meantime are never overwritten.
 * - Entries expire after a week and are removed on submit and on logout.
 */
(function () {
  "use strict";

  var PREFIX = "adminita-autosave:";
  var LEGACY_PREFIX = "adminFormData_"; // Written by earlier Adminita versions.
  var MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;
  var SAVE_DELAY_MS = 500;

  function t(text) {
    return typeof window.gettext === "function" ? window.gettext(text) : text;
  }

  function getStorage() {
    try {
      var s = window.localStorage;
      s.getItem(PREFIX);
      return s;
    } catch (e) {
      return null;
    }
  }

  function readEntry(store, key) {
    try {
      var entry = JSON.parse(store.getItem(key));
      if (entry && typeof entry.savedAt === "number" && entry.fields) {
        return entry;
      }
    } catch (e) {}
    return null;
  }

  // Remove legacy entries, expired entries, or (when `all` is true) everything.
  function purge(store, all) {
    if (!store) return;
    var now = Date.now();
    for (var i = store.length - 1; i >= 0; i--) {
      var key = store.key(i);
      if (!key) continue;
      if (key.indexOf(LEGACY_PREFIX) === 0) {
        store.removeItem(key);
      } else if (key.indexOf(PREFIX) === 0) {
        var entry = all ? null : readEntry(store, key);
        if (!entry || now - entry.savedAt > MAX_AGE_MS) {
          store.removeItem(key);
        }
      }
    }
  }

  // Used by logged_out.html so nothing is left behind on shared computers.
  window.adminitaClearAutosave = function () {
    try {
      purge(getStorage(), true);
    } catch (e) {}
  };

  function tinymceEditor(field) {
    if (!field.id || !window.tinymce || typeof window.tinymce.get !== "function") {
      return null;
    }
    var editor = window.tinymce.get(field.id);
    return editor && editor.initialized ? editor : null;
  }

  function isTracked(field) {
    if (!field.name || field.disabled || field.name === "csrfmiddlewaretoken") {
      return false;
    }
    var tag = field.tagName;
    if (tag === "TEXTAREA") return true;
    if (tag === "SELECT") {
      // SelectFilter (filter_horizontal/vertical) manages its own selects.
      return !field.classList.contains("filtered");
    }
    if (tag !== "INPUT") return false;
    var skip = ["hidden", "file", "password", "checkbox", "radio", "submit", "button", "reset", "image"];
    return skip.indexOf(field.type) === -1;
  }

  // The value the server rendered for this field.
  function originalValue(field) {
    if (field.tagName === "SELECT") {
      var selected = [];
      for (var i = 0; i < field.options.length; i++) {
        if (field.options[i].defaultSelected) selected.push(field.options[i].value);
      }
      if (!field.multiple && !selected.length && field.options.length) {
        selected.push(field.options[0].value);
      }
      return field.multiple ? selected : selected[0] || "";
    }
    return field.defaultValue;
  }

  function currentValue(field) {
    if (field.tagName === "SELECT" && field.multiple) {
      var selected = [];
      for (var i = 0; i < field.options.length; i++) {
        if (field.options[i].selected) selected.push(field.options[i].value);
      }
      return selected;
    }
    var editor = tinymceEditor(field);
    return editor ? editor.getContent() : field.value;
  }

  function same(a, b) {
    return JSON.stringify(a) === JSON.stringify(b);
  }

  // Returns false if the value could not be applied (e.g. option not present).
  function applyValue(field, value) {
    if (field.tagName === "SELECT") {
      var wanted = field.multiple ? value : [value];
      var found = 0;
      for (var i = 0; i < field.options.length; i++) {
        var match = wanted.indexOf(field.options[i].value) !== -1;
        if (match) found++;
        if (field.multiple) field.options[i].selected = match;
      }
      if (found !== wanted.length) return false;
      if (!field.multiple) field.value = value;
    } else {
      field.value = value;
      var editor = tinymceEditor(field);
      if (editor) editor.setContent(value);
    }
    field.dispatchEvent(new Event("change", { bubbles: true }));
    return true;
  }

  function init() {
    var store = getStorage();
    if (!store) return;
    purge(store, false);

    // Never autosave inside a related-object popup.
    if (document.body.classList.contains("is-popup")) return;

    var form = document.querySelector('form[method="post"][id$="_form"]');
    if (!form) return;

    var key = PREFIX + window.location.pathname;
    var saveTimer = null;
    var submitted = false;
    // TinyMCE normalises HTML, so compare editors against their own initial content.
    var editorBaseline = {};

    function fieldsByName() {
      var map = {};
      Array.prototype.forEach.call(form.elements, function (field) {
        if (isTracked(field) && !map[field.name]) map[field.name] = field;
      });
      return map;
    }

    function save() {
      saveTimer = null;
      if (submitted) return;
      var changed = {};
      var count = 0;
      var fields = fieldsByName();
      Object.keys(fields).forEach(function (name) {
        var field = fields[name];
        var original = originalValue(field);
        var value = currentValue(field);
        var editor = tinymceEditor(field);
        if (editor && editorBaseline[field.id] === value) return;
        if (!same(original, value)) {
          changed[name] = { original: original, value: value };
          count++;
        }
      });
      try {
        if (count) {
          store.setItem(key, JSON.stringify({ savedAt: Date.now(), fields: changed }));
        } else {
          store.removeItem(key);
        }
      } catch (e) {}
    }

    function scheduleSave() {
      if (saveTimer) clearTimeout(saveTimer);
      saveTimer = setTimeout(save, SAVE_DELAY_MS);
    }

    function flush() {
      if (saveTimer) {
        clearTimeout(saveTimer);
        save();
      }
    }

    form.addEventListener("input", scheduleSave);
    form.addEventListener("change", scheduleSave);
    window.addEventListener("pagehide", flush);
    form.addEventListener("submit", function () {
      submitted = true;
      if (saveTimer) clearTimeout(saveTimer);
      try {
        store.removeItem(key);
      } catch (e) {}
    });

    // Rich text editors don't fire input events on the form itself.
    if (window.tinymce && typeof window.tinymce.on === "function") {
      var hook = function (editor) {
        var recordBaseline = function () {
          editorBaseline[editor.id] = editor.getContent();
        };
        if (editor.initialized) recordBaseline();
        else editor.on("init", recordBaseline);
        editor.on("input change undo redo", scheduleSave);
      };
      (window.tinymce.get() || []).forEach(hook);
      window.tinymce.on("AddEditor", function (e) {
        hook(e.editor);
      });
    }

    offerRestore();

    function offerRestore() {
      var entry = readEntry(store, key);
      if (!entry) return;
      var fields = fieldsByName();
      var restorable = Object.keys(entry.fields).filter(function (name) {
        var field = fields[name];
        var saved = entry.fields[name];
        return (
          field &&
          same(originalValue(field), saved.original) &&
          !same(currentValue(field), saved.value)
        );
      });
      if (!restorable.length) {
        store.removeItem(key);
        return;
      }

      var banner = document.createElement("div");
      banner.className =
        "adminita-autosave-banner mb-6 rounded-lg p-4 flex flex-wrap items-center justify-between gap-3 " +
        "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200";
      banner.setAttribute("role", "status");

      var message = document.createElement("span");
      message.className = "text-sm";
      message.textContent =
        t("You have unsaved changes to this form from") + " " +
        new Date(entry.savedAt).toLocaleString() + ".";

      var actions = document.createElement("div");
      actions.className = "flex items-center gap-2";

      var restore = document.createElement("button");
      restore.type = "button";
      restore.className =
        "px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors";
      restore.textContent = t("Restore");

      var discard = document.createElement("button");
      discard.type = "button";
      discard.className =
        "px-3 py-1.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 " +
        "hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium text-sm transition-colors";
      discard.textContent = t("Discard");

      restore.addEventListener("click", function () {
        restorable.forEach(function (name) {
          applyValue(fields[name], entry.fields[name].value);
        });
        banner.remove();
        save();
      });
      discard.addEventListener("click", function () {
        store.removeItem(key);
        banner.remove();
      });

      actions.appendChild(restore);
      actions.appendChild(discard);
      banner.appendChild(message);
      banner.appendChild(actions);
      form.insertBefore(banner, form.firstChild);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
