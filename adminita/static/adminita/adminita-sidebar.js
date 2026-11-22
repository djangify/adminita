// Collapsible sidebar sections. The markup works without JavaScript (the section
// holding the current page is rendered open); this adds remembering your choices,
// opening the section for sub-pages (change forms, etc.) and Expand/Collapse all.
(function () {
  var KEY = "adminita-sidebar";

  function init() {
    var groups = Array.prototype.slice.call(
      document.querySelectorAll("#sidebar details.sb-group")
    );
    if (!groups.length) return;

    var saved = {};
    try {
      saved = JSON.parse(localStorage.getItem(KEY) || "{}") || {};
    } catch (e) {}

    function store() {
      try {
        localStorage.setItem(KEY, JSON.stringify(saved));
      } catch (e) {}
    }

    function holdsCurrentPage(d) {
      if (d.hasAttribute("data-active")) return true;
      var path = window.location.pathname;
      return Array.prototype.some.call(d.querySelectorAll("a[href]"), function (a) {
        var href = a.getAttribute("href");
        return href && href.charAt(0) === "/" && path.indexOf(href) === 0;
      });
    }

    groups.forEach(function (d) {
      var g = d.getAttribute("data-group");
      var active = holdsCurrentPage(d);
      if (active) d.setAttribute("data-active", "1");
      // The section you are on is always open; the rest follow your last choice.
      d.open = active || saved[g] === true;
      // Remember only your own clicks, not the opening done above.
      d.querySelector("summary").addEventListener("click", function () {
        saved[g] = !d.open; // the browser flips it after this handler runs
        store();
      });
    });

    var controls = document.querySelector("#sidebar .adminita-sb-controls");
    if (controls) {
      controls.hidden = false;
      controls.addEventListener("click", function (e) {
        var btn = e.target.closest("[data-sb-action]");
        if (!btn) return;
        var expand = btn.getAttribute("data-sb-action") === "expand";
        groups.forEach(function (d) {
          d.open = expand || d.hasAttribute("data-active");
          saved[d.getAttribute("data-group")] = expand;
        });
        store();
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
