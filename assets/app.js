/* تیک‌ها را در همین مرورگر ذخیره می‌کند تا با بستن صفحه پاک نشوند */

(function () {
  var page = location.pathname.split("/").slice(-2).join("/");

  var boxes = Array.prototype.slice.call(
    document.querySelectorAll('.checklist input[type="checkbox"]')
  );

  // کلید هر تیک از روی متن خودش ساخته می‌شود، نه از روی جایش در صفحه.
  // این‌طور اگر بعداً کاری وسط فهرست اضافه شود، تیک‌های قبلی جابه‌جا نمی‌شوند.
  var seen = {};
  boxes.forEach(function (box) {
    var label = box.closest("label");
    var text = label ? label.textContent.replace(/\s+/g, " ").trim() : "";
    var h = hash(text);
    seen[h] = (seen[h] || 0) + 1;
    box.dataset.key = "vb:" + page + ":" + h + (seen[h] > 1 ? "#" + seen[h] : "");

    if (localStorage.getItem(box.dataset.key) === "1") box.checked = true;
    box.addEventListener("change", function () {
      try {
        localStorage.setItem(box.dataset.key, box.checked ? "1" : "0");
      } catch (e) {
        /* حالت مرور خصوصی — تیک می‌خورد ولی ذخیره نمی‌شود */
      }
      refresh();
    });
  });

  function hash(s) {
    var h = 5381;
    for (var i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
    return (h >>> 0).toString(36);
  }

  function refresh() {
    // هر کارت مرحله، وقتی همه‌ی تیک‌هایش خورد سبز می‌شود
    Array.prototype.forEach.call(document.querySelectorAll(".day"), function (day) {
      var inner = day.querySelectorAll('input[type="checkbox"]');
      var all = inner.length > 0;
      Array.prototype.forEach.call(inner, function (b) { if (!b.checked) all = false; });
      day.classList.toggle("done", all);
    });

    var bar = document.querySelector(".progress-bar");
    if (!bar) return;
    var tracked = document.querySelectorAll('[data-track] input[type="checkbox"]');
    var list = tracked.length ? tracked : boxes;
    var done = 0;
    Array.prototype.forEach.call(list, function (b) { if (b.checked) done++; });
    var total = list.length || 1;
    bar.querySelector(".fill").style.width = (done / total) * 100 + "%";
    bar.querySelector(".count").textContent = toFa(done) + " از " + toFa(total);
  }

  function toFa(n) {
    return String(n).replace(/[0-9]/g, function (d) { return "۰۱۲۳۴۵۶۷۸۹"[d]; });
  }

  var reset = document.querySelector(".reset");
  if (reset) {
    reset.addEventListener("click", function () {
      if (!confirm("همه‌ی تیک‌های این صفحه پاک شوند؟")) return;
      boxes.forEach(function (b) {
        b.checked = false;
        try { localStorage.setItem(b.dataset.key, "0"); } catch (e) {}
      });
      refresh();
    });
  }

  refresh();
})();
