(function () {
  "use strict";
  var DATA = (window.CERTIFICATES || []).slice();
  var CFG = window.SITE_CONFIG || {};

  /* ---------- i18n ---------- */
  var UI = {
    en: {
      skip: "Skip to content", tabDash: "Dashboard", tabCerts: "Certificates",
      byCategory: "Certificates by category", clickHint: "Click a category to browse its certificates.",
      topIssuers: "Top providers", issuerHint: "Platforms and institutions where the certificates came from.",
      timeline: "Learning timeline", timelineHint: "What you studied and when, and how busy each month was.",
      tlWhat: "What you studied, and when — one row per category", tlSize: "Certificates in a month:", tlBusiest: "Busiest month", tlActive: "Active months", tlOf: function (a, b) { return a + " of " + b; }, tlTotal: "total", tlAdded: function (n) { return "+" + n + (n === 1 ? " certificate" : " certificates"); }, tlFewer: "Fewer", tlMore: "More", tlTable: "Show as table", tlHeat: "Certificates per month (click a month to see them)", tlGrowth: "Running total", tlMonth: "Month", tlCount: "Certificates", tlCum: "Total so far", tlMore2: function (n) { return "+" + n + " more"; }, tlHours: "Hours", tlCats: "Categories", tlCsv: "Download CSV", tlSeeAll: "See these in Certificates", tlExp: "Show certificates", tlNum: function (n) { return n + (n === 1 ? " certificate" : " certificates"); }, tlSum: "Total", tlRows: function (n) { return n + (n === 1 ? " month" : " months"); }, tlNoHrs: "No duration stated", tlTitles: "Titles",
      hoursByCat: "Learning hours by category", hoursHint: "Only counts certificates that state their duration.",
      latest: "Latest certificates", latestHint: "The 20 most recent. Click one to open it.", search: "Search", provider: "Provider", year: "Year", sort: "Sort",
      searchPh: "Search title, provider…", allProviders: "All providers", allYears: "All years", allCats: "All",
      sortNew: "Newest first", sortOld: "Oldest first", sortAZ: "Title A–Z", sortHours: "Longest first",
      noMatch: "No certificates match your filters.", reset: "Reset filters",
      footer: "Certificates are shown as issued by their providers. Click any card to view the original PDF.",
      open: "Open", download: "Download", close: "Close", prev: "Previous", next: "Next",
      kTotal: "Certificates", kCats: "Categories", kProv: "Providers", kHours: "Learning hours", kSpan: "Years active", kLast: "Latest",
      showing: function (n, t) { return "Showing " + n + " of " + t + " certificates"; },
      hrs: "h", min: "m", viewGrid: "List view", viewList: "Grid view", certs: "certificates",
      pdfFallback: "Your browser can't preview PDFs here.", noHours: "n/a", perMonth: function (m, n) { return m + ": " + n + (n === 1 ? " certificate" : " certificates"); },
      inYear: function (y) { return "Show " + y; }
    },
    th: {
      skip: "ข้ามไปยังเนื้อหา", tabDash: "แดชบอร์ด", tabCerts: "ใบประกาศนียบัตร",
      byCategory: "ใบประกาศนียบัตรแยกตามหมวดหมู่", clickHint: "คลิกหมวดหมู่เพื่อดูใบประกาศนียบัตรในหมวดนั้น",
      topIssuers: "แหล่งที่มาหลัก", issuerHint: "แพลตฟอร์มและสถาบันที่ออกใบประกาศนียบัตร",
      timeline: "ไทม์ไลน์การเรียนรู้", timelineHint: "เรียนอะไรบ้าง เมื่อไร และแต่ละเดือนเรียนหนักแค่ไหน",
      tlWhat: "เรียนอะไรบ้าง และเมื่อไร — หนึ่งแถวต่อหนึ่งหมวดหมู่", tlSize: "จำนวนใบในหนึ่งเดือน:", tlBusiest: "เดือนที่เรียนมากที่สุด", tlActive: "เดือนที่มีการเรียน", tlOf: function (a, b) { return a + " จาก " + b; }, tlTotal: "รวม", tlAdded: function (n) { return "+" + n + " ใบ"; }, tlFewer: "น้อย", tlMore: "มาก", tlTable: "แสดงเป็นตาราง", tlHeat: "จำนวนใบต่อเดือน (คลิกเดือนเพื่อดูรายการ)", tlGrowth: "จำนวนสะสม", tlMonth: "เดือน", tlCount: "จำนวนใบ", tlCum: "สะสมถึงตอนนี้", tlMore2: function (n) { return "และอีก " + n + " ใบ"; }, tlHours: "ชั่วโมง", tlCats: "หมวดหมู่", tlCsv: "ดาวน์โหลด CSV", tlSeeAll: "ดูรายการเหล่านี้ในหน้าใบประกาศนียบัตร", tlExp: "แสดงรายการใบประกาศนียบัตร", tlNum: function (n) { return n + " ใบ"; }, tlSum: "รวม", tlRows: function (n) { return n + " เดือน"; }, tlNoHrs: "ไม่ระบุระยะเวลา", tlTitles: "รายชื่อ",
      hoursByCat: "ชั่วโมงเรียนแยกตามหมวดหมู่", hoursHint: "นับเฉพาะใบประกาศนียบัตรที่ระบุจำนวนชั่วโมง",
      latest: "ใบประกาศนียบัตรล่าสุด", latestHint: "ล่าสุด 20 ใบ คลิกเพื่อเปิดดู", search: "ค้นหา", provider: "แหล่งที่มา", year: "ปี", sort: "เรียงลำดับ",
      searchPh: "ค้นหาชื่อหลักสูตร หรือแหล่งที่มา…", allProviders: "ทุกแหล่งที่มา", allYears: "ทุกปี", allCats: "ทั้งหมด",
      sortNew: "ใหม่สุดก่อน", sortOld: "เก่าสุดก่อน", sortAZ: "ชื่อ A–Z", sortHours: "ชั่วโมงมากสุดก่อน",
      noMatch: "ไม่พบใบประกาศนียบัตรที่ตรงกับตัวกรอง", reset: "ล้างตัวกรอง",
      footer: "ใบประกาศนียบัตรแสดงตามที่ผู้ให้บริการออกให้ คลิกที่การ์ดเพื่อดูไฟล์ PDF ต้นฉบับ",
      open: "เปิด", download: "ดาวน์โหลด", close: "ปิด", prev: "ก่อนหน้า", next: "ถัดไป",
      kTotal: "ใบประกาศนียบัตร", kCats: "หมวดหมู่", kProv: "แหล่งที่มา", kHours: "ชั่วโมงเรียน", kSpan: "ปีที่เรียน", kLast: "ล่าสุด",
      showing: function (n, t) { return "แสดง " + n + " จาก " + t + " ใบ"; },
      hrs: " ชม.", min: " นาที", viewGrid: "มุมมองรายการ", viewList: "มุมมองตาราง", certs: "ใบ",
      pdfFallback: "เบราว์เซอร์นี้ไม่รองรับการแสดง PDF ในหน้านี้", noHours: "-", perMonth: function (m, n) { return m + ": " + n + " ใบ"; },
      inYear: function (y) { return "ดูปี " + y; }
    }
  };
  var CATS = [
    ["AI & Machine Learning", "AI และ Machine Learning"],
    ["Data & Analytics", "ข้อมูลและการวิเคราะห์"],
    ["Programming & Software", "การเขียนโปรแกรมและซอฟต์แวร์"],
    ["IT, Cloud & Cybersecurity", "ไอที คลาวด์ และความปลอดภัยไซเบอร์"],
    ["Business & Entrepreneurship", "ธุรกิจและผู้ประกอบการ"],
    ["Marketing & Branding", "การตลาดและแบรนด์"],
    ["Finance & Accounting", "การเงินและการบัญชี"],
    ["Languages & Academic Skills", "ภาษาและทักษะวิชาการ"],
    ["Communication & Presentation", "การสื่อสารและการนำเสนอ"],
    ["Leadership & Personal Growth", "ภาวะผู้นำและการพัฒนาตนเอง"],
    ["Science, Energy & Environment", "วิทยาศาสตร์ พลังงาน และสิ่งแวดล้อม"],
    ["Health & Society", "สุขภาพและสังคม"]
  ];
  var CAT_COLOR = {}; var CAT_TH = {};
  CATS.forEach(function (c, i) { CAT_COLOR[c[0]] = "var(--c" + i + ")"; CAT_TH[c[0]] = c[1]; });

  var lang = "en";
  try { lang = localStorage.getItem("lang") || ((navigator.language || "").toLowerCase().indexOf("th") === 0 ? "th" : "en"); } catch (e) {}
  var view = "grid";
  try { view = localStorage.getItem("view") || "grid"; } catch (e) {}
  function t(k) { return UI[lang][k]; }
  function catName(c) { return lang === "th" ? (CAT_TH[c] || c) : c; }

  /* ---------- helpers ---------- */
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function el(tag, attrs, html) {
    var n = document.createElement(tag);
    if (attrs) for (var k in attrs) { if (k === "class") n.className = attrs[k]; else n.setAttribute(k, attrs[k]); }
    if (html != null) n.innerHTML = html;
    return n;
  }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function pd(s) { var p = s.split("-"); return new Date(+p[0], +p[1] - 1, +p[2] || 1); }
  function fmtDate(s) {
    try { return new Intl.DateTimeFormat(lang === "th" ? "th-TH" : "en-GB", { month: "short", year: "numeric" }).format(pd(s)); }
    catch (e) { return s.slice(0, 7); }
  }
  function fmtMonth(y, m) {
    try { return new Intl.DateTimeFormat(lang === "th" ? "th-TH" : "en-GB", { month: "short", year: "numeric" }).format(new Date(y, m, 1)); }
    catch (e) { return y + "-" + (m + 1); }
  }
  function fmtHours(h) {
    if (h == null) return "";
    var mins = Math.round(h * 60), H = Math.floor(mins / 60), M = mins % 60;
    if (H && M) return H + t("hrs") + " " + M + t("min").replace(/^ /, "");
    if (H) return H + t("hrs");
    return M + t("min");
  }
  function shortIssuer(s) { return s || ""; }
  function title(c) { return c.en; }
  function subtitle(c) { return c.th && c.th !== c.en ? c.th : ""; }
  function searchText(c) { return (c.en + " " + (c.th || "") + " " + (c.issuer || "") + " " + (c.platform || "") + " " + c.cat + " " + (CAT_TH[c.cat] || "")).toLowerCase(); }
  function prep(c) { c._s = searchText(c); c._y = c.date.slice(0, 4); c._d = pd(c.date).getTime(); return c; }
  var NOTHUMB = "data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 368"><rect width="520" height="368" fill="#e7e9f3"/><path d="M260 120l22 45 50 7-36 35 8 50-44-24-44 24 8-50-36-35 50-7z" fill="#b4b9d3"/></svg>');
  function thumbSrc(c) { return c.thumb || NOTHUMB; }
  DATA.forEach(prep);

  /* ---------- state ---------- */
  var S = { cat: "", q: "", issuer: "", year: "", sort: "new" };
  var filtered = [];

  /* ---------- static text ---------- */
  function applyI18n() {
    document.documentElement.lang = lang;
    $$("[data-i18n]").forEach(function (n) { var v = t(n.getAttribute("data-i18n")); if (typeof v === "string") n.textContent = v; });
    $("#q").placeholder = t("searchPh");
    $("#langBtn").textContent = lang === "th" ? "EN" : "TH";
    $("#ownerName").textContent = (lang === "th" && CFG.ownerTh) ? CFG.ownerTh : (CFG.owner || "Certificates");
    document.title = (lang === "th" && CFG.ownerTh ? CFG.ownerTh : (CFG.owner || "")) + " · " + (lang === "th" ? "ใบประกาศนียบัตร" : "Certificates");
    $("#tagline").textContent = (CFG.tagline && CFG.tagline[lang]) || "";
    $("#mPrev").setAttribute("aria-label", t("prev")); $("#mNext").setAttribute("aria-label", t("next")); $("#mClose").setAttribute("aria-label", t("close"));
  }
  function renderLinks() {
    var box = $("#extraLinks"); box.innerHTML = "";
    (CFG.links || []).forEach(function (l) {
      var a = el("a", { href: l.url, target: "_blank", rel: "noopener" }); a.textContent = l.label; box.appendChild(a);
    });
  }

  /* ---------- dashboard ---------- */
  function countBy(arr, fn) { var m = {}; arr.forEach(function (x) { var k = fn(x); m[k] = (m[k] || 0) + 1; }); return m; }
  function barRow(name, val, max, color, onClick, label) {
    var li = el("li");
    var b = el(onClick ? "button" : "div", { class: "bar", type: onClick ? "button" : null });
    if (!onClick) b.removeAttribute("type");
    b.innerHTML = '<span class="name"><i style="background:' + color + '"></i><span title="' + esc(name) + '">' + esc(name) + '</span></span><span class="val">' + esc(label != null ? label : val) + '</span><span class="track"><span class="fill" style="display:block;width:' + Math.max(2, (val / max) * 100) + '%;background:' + color + '"></span></span>';
    if (onClick) b.addEventListener("click", onClick);
    li.appendChild(b); return li;
  }
  function renderDash() {
    var total = DATA.length;
    var byCat = countBy(DATA, function (c) { return c.cat; });
    var catList = CATS.map(function (c) { return [c[0], byCat[c[0]] || 0]; }).filter(function (x) { return x[1] > 0; }).sort(function (a, b) { return b[1] - a[1]; });
    var issuers = countBy(DATA, function (c) { return c.platform; });
    var hours = DATA.reduce(function (s, c) { return s + (c.hours || 0); }, 0);
    var years = Object.keys(countBy(DATA, function (c) { return c._y; })).sort();
    var latest = DATA.slice().sort(function (a, b) { return b._d - a._d; });

    var k = $("#kpis"); k.innerHTML = "";
    [[total, t("kTotal"), true], [catList.length, t("kCats")], [Object.keys(issuers).length, t("kProv")],
     [Math.round(hours), t("kHours")], [years.length ? (years[0] === years[years.length - 1] ? years[0] : years[0] + "–" + years[years.length - 1]) : "-", t("kSpan")],
     [latest[0] ? fmtDate(latest[0].date) : "-", t("kLast")]].forEach(function (x) {
      var d = el("div", { class: "kpi" + (x[2] ? " accent" : "") }); d.innerHTML = "<b>" + esc(x[0]) + "</b><span>" + esc(x[1]) + "</span>"; k.appendChild(d);
    });

    // donut
    var acc = 0, stops = [];
    catList.forEach(function (x) { var p = x[1] / total * 100; stops.push(CAT_COLOR[x[0]] + " " + acc + "% " + (acc + p) + "%"); acc += p; });
    var dn = $("#donut"); dn.style.background = "conic-gradient(" + stops.join(",") + ")"; dn.setAttribute("data-total", total);
    var cb = $("#catBars"); cb.innerHTML = "";
    catList.forEach(function (x) { cb.appendChild(barRow(catName(x[0]), x[1], catList[0][1], CAT_COLOR[x[0]], function () { goCategory(x[0]); })); });

    // issuers
    var ib = $("#issuerBars"); ib.innerHTML = "";
    var il = Object.keys(issuers).map(function (n) { return [n, issuers[n]]; }).sort(function (a, b) { return b[1] - a[1] || a[0].localeCompare(b[0]); }).slice(0, 10);
    il.forEach(function (x, i) { ib.appendChild(barRow(x[0], x[1], il[0][1], "var(--c" + (i % 12) + ")", function () { goIssuer(x[0]); })); });

    // hours by category
    var hb = $("#hourBars"); hb.innerHTML = "";
    var hc = {}; DATA.forEach(function (c) { if (c.hours) hc[c.cat] = (hc[c.cat] || 0) + c.hours; });
    var hl = Object.keys(hc).map(function (n) { return [n, hc[n]]; }).sort(function (a, b) { return b[1] - a[1]; });
    hl.forEach(function (x) { hb.appendChild(barRow(catName(x[0]), x[1], hl[0][1], CAT_COLOR[x[0]], null, fmtHours(x[1]))); });

    renderTimeline();
    var yc = $("#yearChips"); yc.innerHTML = "";
    var yCount = countBy(DATA, function (c) { return c._y; });
    Object.keys(yCount).sort().forEach(function (y) {
      var b = el("button", { class: "ychip", type: "button", "aria-label": t("inYear")(lang === "th" ? +y + 543 : y) });
      b.innerHTML = (lang === "th" ? +y + 543 : y) + "<b>" + yCount[y] + "</b>";
      b.addEventListener("click", function () { S = { cat: "", q: "", issuer: "", year: y, sort: "new" }; showTab("certificates"); syncControls(); applyFilters(); });
      yc.appendChild(b);
    });

    // latest
    var lt = $("#latest"); lt.innerHTML = "";
    latest.slice(0, 20).forEach(function (c) {
      var li = el("li"); var b = el("button", { type: "button" });
      b.title = title(c) + " — " + (c.issuer || c.platform || "") + " · " + fmtDate(c.date); b.setAttribute("aria-label", b.title);
      b.innerHTML = '<img loading="lazy" alt="" src="' + esc(thumbSrc(c)) + '">';
      b.addEventListener("click", function () { openModal(c.id, latest.slice(0, 20)); });
      li.appendChild(b); lt.appendChild(li);
    });
  }

  /* ---------- timeline ---------- */
  var tip = null;
  function showTip(html, x, y) {
    if (!tip) { tip = el("div", { class: "tl-tip", role: "tooltip" }); document.body.appendChild(tip); }
    tip.innerHTML = html; tip.hidden = false; tip.style.left = "0px"; tip.style.top = "0px";
    var w = tip.offsetWidth, h = tip.offsetHeight;
    var L = Math.min(Math.max(8, x - w / 2), window.innerWidth - w - 8), T = y - h - 12; if (T < 8) T = y + 18;
    tip.style.left = L + "px"; tip.style.top = T + "px";
  }
  function hideTip() { if (tip) tip.hidden = true; }
  function monthTipHtml(key, cum) {
    var p = key.split("-"), items = DATA.filter(function (c) { return c.date.slice(0, 7) === key; });
    var h = "<b>" + esc(fmtMonth(+p[0], +p[1] - 1)) + "</b><div class='tl-add'>" + esc(t("tlAdded")(items.length)) + (cum != null ? " · " + esc(cum) + " " + esc(t("tlTotal")) : "") + "</div>";
    h += "<ul>" + items.slice(0, 3).map(function (c) { return "<li>" + esc(title(c)) + "</li>"; }).join("") + (items.length > 3 ? "<li class='more'>" + esc(t("tlMore2")(items.length - 3)) + "</li>" : "") + "</ul>";
    return h;
  }
  function goCell(cat, key) { S = { cat: cat, q: "", issuer: "", year: "", sort: "new", month: key }; showTab("certificates"); syncControls(); applyFilters(); window.scrollTo(0, 0); }
  function goMonth(key) { S = { cat: "", q: "", issuer: "", year: "", sort: "new", month: key }; showTab("certificates"); syncControls(); applyFilters(); window.scrollTo(0, 0); }

  function renderTimeline() {
    var box = $("#timeline"); box.innerHTML = "";
    if (!DATA.length) return;
    var mCount = countBy(DATA, function (c) { return c.date.slice(0, 7); });
    var keys = Object.keys(mCount).sort();
    var f = keys[0].split("-"), l = keys[keys.length - 1].split("-");
    var y0 = +f[0], m0 = +f[1] - 1, y1 = +l[0], m1 = +l[1] - 1;
    var span = (y1 - y0) * 12 + (m1 - m0) + 1;
    function idx(k) { var p = k.split("-"); return (+p[0] - y0) * 12 + (+p[1] - 1 - m0); }
    var busiest = keys.reduce(function (b, k) { return mCount[k] > mCount[b] ? k : b; }, keys[0]);
    var bp = busiest.split("-");

    // quick facts
    var facts = el("div", { class: "tl-facts" });
    [[mCount[busiest], t("tlBusiest") + " · " + fmtMonth(+bp[0], +bp[1] - 1)], [t("tlOf")(keys.length, span), t("tlActive")], [DATA.length, t("tlGrowth")]].forEach(function (x) {
      facts.appendChild(el("div", { class: "tl-fact" }, "<b>" + esc(x[0]) + "</b><span>" + esc(x[1]) + "</span>"));
    });
    box.appendChild(facts);

    // category x time bubble chart: what was studied, and when
    var SHORT = lang === "th"
      ? ["AI และ ML", "ข้อมูล", "โปรแกรมมิ่ง", "ไอทีและคลาวด์", "ธุรกิจ", "การตลาด", "การเงิน", "ภาษา", "การสื่อสาร", "ภาวะผู้นำ", "วิทยาศาสตร์", "สุขภาพและสังคม"]
      : ["AI & ML", "Data", "Programming", "IT & Cloud", "Business", "Marketing", "Finance", "Languages", "Communication", "Leadership", "Science", "Health & Society"];
    var narrow = (box.clientWidth || 640) < 520;
    if (narrow && lang === "th") SHORT[11] = "สุขภาพ";
    if (narrow && lang !== "th") SHORT = ["AI & ML", "Data", "Coding", "IT & Cloud", "Business", "Marketing", "Finance", "Language", "Comms", "Leadership", "Science", "Health"];
    var cell = {}, maxCell = 1;
    DATA.forEach(function (c) { var k = c.cat + "|" + c.date.slice(0, 7); cell[k] = (cell[k] || 0) + 1; if (cell[k] > maxCell) maxCell = cell[k]; });
    var W = Math.max(300, box.clientWidth || 640), LW = narrow ? (lang === "th" ? 92 : 74) : 112, RP = 12, TP = 6, BP = 28, RH = 28, H = TP + CATS.length * RH + BP;
    var step = (W - LW - RP) / span, rMax = Math.min(12, Math.max(6, step * 0.85));
    function X(i) { return LW + (i + 0.5) * step; }
    function R(n) { return 3 + (rMax - 3) * Math.sqrt(n / maxCell); }
    var svg = '<svg class="tl-svg" width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + " " + H + '" role="group" aria-label="' + esc(t("tlWhat")) + '">';
    // alternating year bands + year labels
    for (var yy = y0; yy <= y1; yy++) {
      var i0 = Math.max(0, (yy - y0) * 12 - m0), i1 = Math.min(span, (yy - y0) * 12 - m0 + 12);
      var bx = LW + i0 * step, bw = (i1 - i0) * step;
      if ((yy - y0) % 2 === 0) svg += '<rect class="tl-band" x="' + bx.toFixed(1) + '" y="' + TP + '" width="' + bw.toFixed(1) + '" height="' + (CATS.length * RH) + '"/>';
      svg += '<text class="tl-ax" x="' + (bx + bw / 2).toFixed(1) + '" y="' + (H - 9) + '" text-anchor="middle">' + (lang === "th" ? yy + 543 : yy) + "</text>";
    }
    CATS.forEach(function (c, ri) {
      var cy = TP + ri * RH + RH / 2;
      svg += '<line class="tl-grid" x1="' + LW + '" x2="' + (W - RP) + '" y1="' + cy + '" y2="' + cy + '"/>';
      svg += '<text class="tl-row" data-cat="' + esc(c[0]) + '" tabindex="0" x="' + (LW - 8) + '" y="' + (cy + 4) + '" text-anchor="end">' + esc(SHORT[ri]) + "</text>";
    });
    var dots = [];
    Object.keys(cell).forEach(function (k) {
      var pr = k.split("|"), ri = CATS.map(function (c) { return c[0]; }).indexOf(pr[0]); if (ri < 0) return;
      dots.push({ cat: pr[0], key: pr[1], n: cell[k], x: X(idx(pr[1])), y: TP + ri * RH + RH / 2, ri: ri });
    });
    dots.sort(function (a, b) { return b.n - a.n; }); // big first so small ones stay visible on top
    dots.forEach(function (d) {
      svg += '<circle class="tl-bub" tabindex="0" data-cat="' + esc(d.cat) + '" data-k="' + d.key + '" cx="' + d.x.toFixed(1) + '" cy="' + d.y + '" r="' + R(d.n).toFixed(1) + '" style="fill:' + CAT_COLOR[d.cat] + '" aria-label="' + esc(catName(d.cat) + ", " + fmtDate(d.key + "-01") + ": " + t("tlAdded")(d.n)) + '"/>';
    });
    dots.slice(0, 3).forEach(function (d) { // label only the biggest few
      var right = d.x < W - 60;
      svg += '<text class="tl-note" x="' + (d.x + (right ? 1 : -1) * (R(d.n) + 5)).toFixed(1) + '" y="' + (d.y + 4) + '" text-anchor="' + (right ? "start" : "end") + '">' + d.n + "</text>";
    });
    svg += "</svg>";
    var wrap = el("div", { class: "tl-chart" }); wrap.appendChild(el("p", { class: "muted small tl-cap" }, esc(t("tlWhat")))); wrap.insertAdjacentHTML("beforeend", svg);
    var lgs = [1, Math.max(2, Math.round(maxCell / 2)), maxCell].filter(function (v, i, a) { return a.indexOf(v) === i; });
    var sizeLg = el("div", { class: "tl-size muted small" }, "<span>" + esc(t("tlSize")) + "</span>" + lgs.map(function (v) { var r = R(v); return '<i style="width:' + (r * 2).toFixed(0) + "px;height:" + (r * 2).toFixed(0) + 'px"></i><b>' + v + "</b>"; }).join(""));
    wrap.appendChild(sizeLg); box.appendChild(wrap);
    function cellTip(cat, key) {
      var p = key.split("-"), items = DATA.filter(function (c) { return c.cat === cat && c.date.slice(0, 7) === key; });
      return "<b>" + esc(catName(cat)) + "</b><div class='tl-add'>" + esc(fmtMonth(+p[0], +p[1] - 1)) + " · " + esc(t("tlAdded")(items.length)) + "</div><ul>" + items.slice(0, 3).map(function (c) { return "<li>" + esc(title(c)) + "</li>"; }).join("") + (items.length > 3 ? "<li class='more'>" + esc(t("tlMore2")(items.length - 3)) + "</li>" : "") + "</ul>";
    }
    $$(".tl-bub", wrap).forEach(function (c) {
      function show() { var r = c.getBoundingClientRect(); showTip(cellTip(c.getAttribute("data-cat"), c.getAttribute("data-k")), r.left + r.width / 2, r.top); }
      function go() { hideTip(); goCell(c.getAttribute("data-cat"), c.getAttribute("data-k")); }
      c.addEventListener("mouseenter", show); c.addEventListener("focus", show); c.addEventListener("mouseleave", hideTip); c.addEventListener("blur", hideTip);
      c.addEventListener("click", go); c.addEventListener("keydown", function (e) { if (e.key === "Enter") go(); });
    });
    $$(".tl-row", wrap).forEach(function (r) {
      function go() { goCategory(r.getAttribute("data-cat")); }
      r.addEventListener("click", go); r.addEventListener("keydown", function (e) { if (e.key === "Enter") go(); });
    });

    // month heat-grid
    var max = 0; keys.forEach(function (k) { max = Math.max(max, mCount[k]); });
    function level(n) { if (!n) return 0; var r = n / max; return r > 0.6 ? 4 : r > 0.3 ? 3 : r > 0.12 ? 2 : 1; }
    var heat = el("div", { class: "tl-heat" });
    heat.appendChild(el("p", { class: "muted small tl-cap" }, esc(t("tlHeat"))));
    var grid = el("div", { class: "hm", role: "grid" });
    var head = '<span class="hm-y"></span>';
    for (var m = 0; m < 12; m++) head += '<span class="hm-h">' + esc(new Intl.DateTimeFormat(lang === "th" ? "th-TH" : "en-GB", { month: "narrow" }).format(new Date(2024, m, 1))) + "</span>";
    grid.innerHTML = head;
    for (var y = y0; y <= y1; y++) {
      grid.appendChild(el("span", { class: "hm-y" }, String(lang === "th" ? y + 543 : y)));
      for (var mo = 0; mo < 12; mo++) {
        var key = y + "-" + ("0" + (mo + 1)).slice(-2), n = mCount[key] || 0, outside = (y === y0 && mo < m0) || (y === y1 && mo > m1);
        var cell = el(n ? "button" : "span", { class: "hm-c l" + level(n) + (outside ? " out" : ""), "data-k": key });
        if (n) { cell.setAttribute("type", "button"); cell.setAttribute("aria-label", fmtMonth(y, mo) + ": " + t("tlAdded")(n)); cell.textContent = n; }
        grid.appendChild(cell);
      }
    }
    heat.appendChild(grid);
    var lg = el("div", { class: "hm-legend muted small" }, "<span>" + esc(t("tlFewer")) + '</span><i class="hm-c l1"></i><i class="hm-c l2"></i><i class="hm-c l3"></i><i class="hm-c l4"></i><span>' + esc(t("tlMore")) + "</span>");
    heat.appendChild(lg); box.appendChild(heat);
    $$("button.hm-c", grid).forEach(function (c) {
      function show(e) { var r = c.getBoundingClientRect(); showTip(monthTipHtml(c.getAttribute("data-k")), r.left + r.width / 2, r.top); }
      c.addEventListener("mouseenter", show); c.addEventListener("focus", show);
      c.addEventListener("mouseleave", hideTip); c.addEventListener("blur", hideTip);
      c.addEventListener("click", function () { hideTip(); goMonth(c.getAttribute("data-k")); });
    });

    // table view
    buildTable(box, keys);
  }
  /* ---------- timeline table ---------- */
  var TT = { open: false, sort: "month", dir: "desc", exp: {} };
  function buildTable(box, keys) {
    var run = 0, maxN = 0;
    var rows = keys.map(function (k) {
      var items = DATA.filter(function (c) { return c.date.slice(0, 7) === k; }).sort(function (a, b) { return b._d - a._d; });
      run += items.length; if (items.length > maxN) maxN = items.length;
      var cc = countBy(items, function (c) { return c.cat; });
      return { k: k, y: k.slice(0, 4), label: fmtMonth(+k.slice(0, 4), +k.slice(5, 7) - 1), n: items.length, hrs: items.reduce(function (s, c) { return s + (c.hours || 0); }, 0), cum: run, items: items,
        cats: Object.keys(cc).sort(function (a, b) { return cc[b] - cc[a]; }).map(function (n) { return [n, cc[n]]; }) };
    });
    var yearSum = {}; rows.forEach(function (r) { var y = yearSum[r.y] = yearSum[r.y] || { n: 0, h: 0 }; y.n += r.n; y.h += r.hrs; });
    var totN = rows.reduce(function (s, r) { return s + r.n; }, 0), totH = rows.reduce(function (s, r) { return s + r.hrs; }, 0);
    var yl = function (y) { return String(lang === "th" ? +y + 543 : y); };

    var det = el("details", { class: "tl-table" }); det.open = TT.open;
    det.addEventListener("toggle", function () { TT.open = det.open; });

    function th(key, label, cls) {
      var on = TT.sort === key, arrow = on ? (TT.dir === "asc" ? " ▲" : " ▼") : "";
      return '<th scope="col" class="' + (cls || "") + '"' + (on ? ' aria-sort="' + (TT.dir === "asc" ? "ascending" : "descending") + '"' : "") + '><button type="button" class="tt-sort" data-sort="' + key + '">' + esc(label) + arrow + "</button></th>";
    }
    function catDots(r) {
      return r.cats.map(function (c) { return '<span class="tt-cat" title="' + esc(catName(c[0]) + " · " + c[1]) + '"><i style="background:' + (CAT_COLOR[c[0]] || "var(--muted)") + '"></i>' + c[1] + "</span>"; }).join("");
    }
    function paint() {
      var list = rows.slice(), dir = TT.dir === "asc" ? 1 : -1;
      list.sort(function (a, b) {
        var d = TT.sort === "n" ? a.n - b.n : TT.sort === "h" ? a.hrs - b.hrs : (a.k < b.k ? -1 : a.k > b.k ? 1 : 0);
        return (d || (a.k < b.k ? -1 : 1)) * dir;
      });
      var h = '<summary>' + esc(t("tlTable")) + ' <span class="tt-n">· ' + esc(t("tlRows")(rows.length)) + '</span></summary>' +
        '<div class="tt-bar"><button type="button" class="pill tt-csv" data-csv="1">⬇ ' + esc(t("tlCsv")) + '</button></div>' +
        '<div class="tt-wrap"><table class="tt"><thead><tr><th class="x"><span class="sr">' + esc(t("tlExp")) + "</span></th>" +
        th("month", t("tlMonth")) + th("n", t("tlCount"), "num") + th("h", t("tlHours"), "num") + '<th scope="col">' + esc(t("tlCats")) + '</th><th scope="col" class="num">' + esc(t("tlCum")) + "</th></tr></thead><tbody>";
      var lastY = null;
      list.forEach(function (r) {
        if (TT.sort === "month" && r.y !== lastY) {
          lastY = r.y; var ys = yearSum[r.y];
          h += '<tr class="yr"><th colspan="6" scope="colgroup">' + esc(yl(r.y)) + ' <span>· ' + esc(t("tlNum")(ys.n)) + (ys.h ? " · " + esc(fmtHours(ys.h)) : "") + "</span></th></tr>";
        }
        var open = !!TT.exp[r.k];
        h += '<tr class="mr' + (open ? " is-open" : "") + '"><td class="x"><button type="button" class="tt-x" data-exp="' + r.k + '" aria-expanded="' + open + '" aria-label="' + esc(t("tlExp") + ": " + r.label) + '">▸</button></td>' +
          '<td><button type="button" class="tt-lk" data-month="' + r.k + '">' + esc(r.label) + "</button></td>" +
          '<td class="num"><span class="tt-b" style="--w:' + (r.n / maxN).toFixed(3) + '"></span><b>' + r.n + "</b></td>" +
          '<td class="num">' + (r.hrs ? esc(fmtHours(r.hrs)) : '<span class="muted" title="' + esc(t("tlNoHrs")) + '">–</span>') + "</td>" +
          '<td class="cats">' + catDots(r) + '</td><td class="num muted">' + r.cum + "</td></tr>";
        if (open) {
          h += '<tr class="ex"><td></td><td colspan="5"><ul>' + r.items.map(function (c) {
            return '<li><button type="button" class="tt-cert" data-open="' + c.id + '" data-month="' + r.k + '"><i style="background:' + (CAT_COLOR[c.cat] || "var(--muted)") + '"></i>' + esc(title(c)) + '</button><span class="muted">' + esc([c.issuer || c.platform, c.hours ? fmtHours(c.hours) : ""].filter(Boolean).join(" · ")) + "</span></li>";
          }).join("") + '</ul><button type="button" class="link" data-month="' + r.k + '" data-go="1">' + esc(t("tlSeeAll")) + " →</button></td></tr>";
        }
      });
      h += '</tbody><tfoot><tr><th></th><th scope="row">' + esc(t("tlSum")) + '</th><td class="num"><b>' + totN + '</b></td><td class="num">' + (totH ? esc(fmtHours(totH)) : "") + "</td><td></td><td></td></tr></tfoot></table></div>";
      det.innerHTML = h;
    }
    det.addEventListener("click", function (e) {
      var x = e.target.closest("button"); if (!x) return;
      if (x.hasAttribute("data-sort")) {
        var k = x.getAttribute("data-sort");
        if (TT.sort === k) TT.dir = TT.dir === "asc" ? "desc" : "asc"; else { TT.sort = k; TT.dir = "desc"; }
        paint(); var nb = det.querySelector('[data-sort="' + k + '"]'); if (nb) nb.focus();
      } else if (x.hasAttribute("data-exp")) {
        var m = x.getAttribute("data-exp"); TT.exp[m] = !TT.exp[m]; paint(); var nx = det.querySelector('[data-exp="' + m + '"]'); if (nx) nx.focus();
      } else if (x.hasAttribute("data-open")) {
        var mk = x.getAttribute("data-month"), r = rows.filter(function (q) { return q.k === mk; })[0]; openModal(+x.getAttribute("data-open"), r ? r.items : null);
      } else if (x.hasAttribute("data-month")) {
        goMonth(x.getAttribute("data-month"));
      } else if (x.hasAttribute("data-csv")) {
        var q = function (v) { v = String(v == null ? "" : v); return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; };
        var lines = [[t("tlMonth"), t("tlCount"), t("tlHours"), t("tlCats"), t("tlTitles")].map(q).join(",")];
        rows.forEach(function (r) { lines.push([r.k, r.n, r.hrs ? +r.hrs.toFixed(2) : "", r.cats.map(function (c) { return c[0] + " (" + c[1] + ")"; }).join("; "), r.items.map(title).join("; ")].map(q).join(",")); });
        var a = document.createElement("a"); a.href = URL.createObjectURL(new Blob(["﻿" + lines.join("\r\n")], { type: "text/csv;charset=utf-8" })); a.download = "certificates-by-month.csv";
        document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
      }
    });
    paint(); box.appendChild(det);
  }
  var rzT, lastW = 0;
  window.addEventListener("resize", function () { clearTimeout(rzT); rzT = setTimeout(function () { var b = $("#timeline"); if (b && b.clientWidth && Math.abs(b.clientWidth - lastW) > 8) { lastW = b.clientWidth; hideTip(); renderTimeline(); } }, 150); });

  /* ---------- gallery ---------- */
  function buildFilters() {
    var si = $("#fIssuer"), sy = $("#fYear"), ss = $("#fSort");
    var iss = countBy(DATA, function (c) { return c.issuer || c.platform; });
    si.innerHTML = '<option value="">' + esc(t("allProviders")) + "</option>" +
      Object.keys(iss).sort(function (a, b) { return iss[b] - iss[a] || a.localeCompare(b); }).map(function (n) { return '<option value="' + esc(n) + '">' + esc(n) + " (" + iss[n] + ")</option>"; }).join("");
    var ys = Object.keys(countBy(DATA, function (c) { return c._y; })).sort().reverse();
    sy.innerHTML = '<option value="">' + esc(t("allYears")) + "</option>" + ys.map(function (y) { return '<option value="' + y + '">' + (lang === "th" ? +y + 543 : y) + "</option>"; }).join("");
    ss.innerHTML = [["new", "sortNew"], ["old", "sortOld"], ["az", "sortAZ"], ["hours", "sortHours"]].map(function (x) { return '<option value="' + x[0] + '">' + esc(t(x[1])) + "</option>"; }).join("");
    $("#viewBtn").textContent = view === "grid" ? t("viewGrid") : t("viewList");
  }
  function buildChips() {
    var box = $("#chips"); box.innerHTML = "";
    var byCat = countBy(DATA, function (c) { return c.cat; });
    var all = el("button", { class: "chip", type: "button", "aria-pressed": S.cat === "" ? "true" : "false" });
    all.innerHTML = esc(t("allCats")) + " <em>" + DATA.length + "</em>";
    all.addEventListener("click", function () { S.cat = ""; applyFilters(); }); box.appendChild(all);
    CATS.forEach(function (c) {
      if (!byCat[c[0]]) return;
      var b = el("button", { class: "chip", type: "button", "aria-pressed": S.cat === c[0] ? "true" : "false" });
      b.innerHTML = '<i style="background:' + CAT_COLOR[c[0]] + '"></i>' + esc(catName(c[0])) + " <em>" + byCat[c[0]] + "</em>";
      b.addEventListener("click", function () { S.cat = S.cat === c[0] ? "" : c[0]; applyFilters(); }); box.appendChild(b);
    });
  }
  function syncControls() { $("#q").value = S.q; $("#fIssuer").value = S.issuer; $("#fYear").value = S.year; $("#fSort").value = S.sort; }
  function applyFilters() {
    var q = S.q.trim().toLowerCase().split(/\s+/).filter(Boolean);
    filtered = DATA.filter(function (c) {
      if (S.cat && c.cat !== S.cat) return false;
      if (S.issuer && (c.issuer || c.platform) !== S.issuer) return false;
      if (S.year && c._y !== S.year) return false;
      if (S.month && c.date.slice(0, 7) !== S.month) return false;
      for (var i = 0; i < q.length; i++) if (c._s.indexOf(q[i]) < 0) return false;
      return true;
    });
    var s = S.sort;
    filtered.sort(function (a, b) {
      if (s === "old") return a._d - b._d || a.id - b.id;
      if (s === "az") return a.en.localeCompare(b.en);
      if (s === "hours") return (b.hours || 0) - (a.hours || 0) || b._d - a._d;
      return b._d - a._d || a.id - b.id;
    });
    buildChips(); renderList();
  }
  function renderList() {
    var box = $("#list"); box.innerHTML = ""; box.className = "cards" + (view === "list" ? " list" : "");
    var cnt = $("#count"); cnt.textContent = t("showing")(filtered.length, DATA.length);
    if (S.month) { var mp = S.month.split("-"), mb = el("button", { class: "mchip", type: "button" }); mb.textContent = fmtMonth(+mp[0], +mp[1] - 1) + " ✕"; mb.addEventListener("click", function () { S.month = ""; applyFilters(); }); cnt.appendChild(document.createTextNode(" ")); cnt.appendChild(mb); }
    $("#empty").hidden = filtered.length > 0;
    var frag = document.createDocumentFragment();
    filtered.forEach(function (c) {
      var b = el("button", { class: "cert", type: "button", style: "--cc:" + CAT_COLOR[c.cat], "aria-label": title(c) });
      var sub = subtitle(c);
      b.innerHTML = '<div class="thumb"><img loading="lazy" decoding="async" alt="" src="' + esc(thumbSrc(c)) + '"></div>' +
        '<div class="body"><span class="tag">' + esc(catName(c.cat)) + "</span><div><h3>" + esc(title(c)) + "</h3>" + (sub ? '<div class="th">' + esc(sub) + "</div>" : "") + "</div>" +
        '<div class="meta"><span class="iss" title="' + esc(c.issuer || c.platform) + '">' + esc(c.issuer || c.platform) + "</span><span>" + esc(fmtDate(c.date)) + (c.hours ? " · " + esc(fmtHours(c.hours)) : "") + "</span></div></div>";
      b.addEventListener("click", function () { openModal(c.id, filtered); });
      frag.appendChild(b);
    });
    box.appendChild(frag);
  }
  function goCategory(cat) { S = { cat: cat, q: "", issuer: "", year: "", sort: "new" }; showTab("certificates"); syncControls(); applyFilters(); window.scrollTo(0, 0); }
  function goIssuer(name) {
    var match = DATA.filter(function (c) { return c.platform === name; })[0];
    S = { cat: "", q: "", issuer: match ? (match.issuer || match.platform) : "", year: "", sort: "new" };
    if (match) { var same = DATA.filter(function (c) { return c.platform === name; }); var iss = {}; same.forEach(function (c) { iss[c.issuer || c.platform] = 1; }); if (Object.keys(iss).length > 1) { S.issuer = ""; S.q = name; } }
    showTab("certificates"); syncControls(); applyFilters(); window.scrollTo(0, 0);
  }

  /* ---------- modal ---------- */
  var modalList = [], modalIdx = 0, lastFocus = null;
  function openModal(id, list) {
    modalList = list && list.length ? list : DATA;
    modalIdx = Math.max(0, modalList.findIndex(function (c) { return c.id === id; }));
    lastFocus = document.activeElement; $("#modal").hidden = false; document.body.style.overflow = "hidden";
    renderModal(); $("#mClose").focus();
    try { history.replaceState(null, "", "#cert=" + id); } catch (e) {}
  }
  function renderModal() {
    var c = modalList[modalIdx]; if (!c) return;
    $("#mTitle").textContent = title(c);
    $("#mSub").textContent = [subtitle(c), c.issuer || c.platform, fmtDate(c.date), c.hours ? fmtHours(c.hours) : "", catName(c.cat)].filter(Boolean).join(" · ");
    $("#mOpen").href = c.file; $("#mDl").href = c.file; $("#mDl").setAttribute("download", (title(c).replace(/[\\\/:*?"<>|]+/g, "").trim() || "certificate") + ".pdf");
    var body = $("#mBody"); body.innerHTML = "";
    var obj = el("object", { data: c.file + "#view=FitH", type: "application/pdf", "aria-label": title(c) });
    var fb = el("div", { class: "fallback" });
    fb.innerHTML = '<img alt="' + esc(title(c)) + '" src="' + esc(thumbSrc(c)) + '"><p class="muted">' + esc(t("pdfFallback")) + '</p><a class="pill" target="_blank" rel="noopener" href="' + esc(c.file) + '">' + esc(t("open")) + "</a>";
    obj.appendChild(fb); body.appendChild(obj);
    $("#mPrev").disabled = modalIdx <= 0; $("#mNext").disabled = modalIdx >= modalList.length - 1;
    try { history.replaceState(null, "", "#cert=" + c.id); } catch (e) {}
  }
  function closeModal() {
    $("#modal").hidden = true; $("#mBody").innerHTML = ""; document.body.style.overflow = "";
    try { history.replaceState(null, "", location.pathname + location.search + (currentTab === "certificates" ? "#certificates" : "")); } catch (e) {}
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function step(d) { var n = modalIdx + d; if (n >= 0 && n < modalList.length) { modalIdx = n; renderModal(); } }

  /* ---------- tabs ---------- */
  var currentTab = "dashboard";
  function showTab(name) {
    currentTab = name;
    $("#view-dashboard").hidden = name !== "dashboard"; $("#view-certificates").hidden = name !== "certificates";
    $$(".tabs button").forEach(function (b) { b.setAttribute("aria-selected", b.getAttribute("data-tab") === name ? "true" : "false"); });
    try { history.replaceState(null, "", name === "certificates" ? "#certificates" : location.pathname + location.search); } catch (e) {}
  }

  /* ---------- wiring ---------- */
  function renderAll() { applyI18n(); renderLinks(); renderDash(); buildFilters(); syncControls(); applyFilters(); }
  var timer;
  $("#q").addEventListener("input", function (e) { clearTimeout(timer); var v = e.target.value; timer = setTimeout(function () { S.q = v; applyFilters(); }, 120); });
  $("#fIssuer").addEventListener("change", function (e) { S.issuer = e.target.value; applyFilters(); });
  $("#fYear").addEventListener("change", function (e) { S.year = e.target.value; applyFilters(); });
  $("#fSort").addEventListener("change", function (e) { S.sort = e.target.value; applyFilters(); });
  $("#viewBtn").addEventListener("click", function () { view = view === "grid" ? "list" : "grid"; try { localStorage.setItem("view", view); } catch (e) {} $("#viewBtn").textContent = view === "grid" ? t("viewGrid") : t("viewList"); renderList(); });
  $("#resetBtn").addEventListener("click", function () { S = { cat: "", q: "", issuer: "", year: "", sort: "new" }; syncControls(); applyFilters(); });
  $("#langBtn").addEventListener("click", function () { lang = lang === "th" ? "en" : "th"; try { localStorage.setItem("lang", lang); } catch (e) {} renderAll(); if (!$("#modal").hidden) renderModal(); });
  $$(".tabs button").forEach(function (b) { b.addEventListener("click", function () { showTab(b.getAttribute("data-tab")); window.scrollTo(0, 0); }); });
  $("#mClose").addEventListener("click", closeModal);
  $("#mPrev").addEventListener("click", function () { step(-1); });
  $("#mNext").addEventListener("click", function () { step(1); });
  $("#modal").addEventListener("click", function (e) { if (e.target === this) closeModal(); });
  document.addEventListener("keydown", function (e) {
    if ($("#modal").hidden) return;
    var am = document.getElementById("addModal"); if (am && !am.hidden) return;
    if (e.key === "Escape") closeModal(); else if (e.key === "ArrowLeft") step(-1); else if (e.key === "ArrowRight") step(1);
    else if (e.key === "Tab") { // simple focus trap
      var f = $$("#modal button:not(:disabled), #modal a[href]"); if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* hook used by assets/add.js */
  window.CertApp = {
    data: function () { return DATA; },
    cats: CATS,
    lang: function () { return lang; },
    add: function (rec) { DATA.push(prep(rec)); renderAll(); },
    current: function () { return modalList[modalIdx] || null; },
    update: function (id, patch) {
      var c = DATA.filter(function (x) { return x.id === id; })[0]; if (!c) return;
      for (var k in patch) c[k] = patch[k];
      prep(c); renderAll(); if (!$("#modal").hidden) renderModal();
    },
    remove: function (id) {
      var i = DATA.findIndex(function (x) { return x.id === id; }); if (i < 0) return;
      DATA.splice(i, 1);
      if (!$("#modal").hidden) closeModal();
      renderAll();
    },
    open: function (id) { showTab("certificates"); S = { cat: "", q: "", issuer: "", year: "", sort: "new" }; syncControls(); applyFilters(); openModal(id, filtered); }
  };

  renderAll();
  var h = location.hash;
  var m = /^#cert=(\d+)/.exec(h);
  if (m) { showTab("certificates"); openModal(+m[1], filtered); }
  else if (h === "#certificates") showTab("certificates");
})();
