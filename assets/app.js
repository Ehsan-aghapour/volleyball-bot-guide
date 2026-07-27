/* تیک‌ها را در همین مرورگر ذخیره می‌کند تا با بستن صفحه پاک نشوند */

(function () {
  var key = "mohammad:" + location.pathname.split("/").slice(-2).join("/");
  var boxes = Array.prototype.slice.call(
    document.querySelectorAll('.checklist input[type="checkbox"]')
  );

  boxes.forEach(function (box, i) {
    box.id = box.id || key + ":" + i;
    if (localStorage.getItem(box.id) === "1") box.checked = true;
    box.addEventListener("change", function () {
      localStorage.setItem(box.id, box.checked ? "1" : "0");
      refresh();
    });
  });

  function refresh() {
    // هر کارت روز، وقتی همه‌ی تیک‌هایش خورد سبز می‌شود
    document.querySelectorAll(".day").forEach(function (day) {
      var inner = day.querySelectorAll('input[type="checkbox"]');
      var all = inner.length > 0;
      inner.forEach(function (b) { if (!b.checked) all = false; });
      day.classList.toggle("done", all);
    });

    // نوار پیشرفت بالای صفحه
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
    return String(n).replace(/[0-9]/g, function (d) {
      return "۰۱۲۳۴۵۶۷۸۹"[d];
    });
  }

  var reset = document.querySelector(".reset");
  if (reset) {
    reset.addEventListener("click", function () {
      if (!confirm("همه‌ی تیک‌های این صفحه پاک شوند؟")) return;
      boxes.forEach(function (b) {
        b.checked = false;
        localStorage.setItem(b.id, "0");
      });
      refresh();
    });
  }

  refresh();
})();
