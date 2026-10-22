/* "Providers" popup — opens when the Providers tile on the dashboard is clicked.
   Lists every provider (platform) with how many certificates/badges and hours it gave you.
   Click a row to see that provider's items in the Credentials tab. */
(function () {
  "use strict";
  var A = window.CertApp;
  if (!A) return;
  var TX = {
    en: {
      title: "Providers", kCert: "Certificates", kBadge: "Badges", site: "Website", find: "Search", siteTip: function (n) { return "Open the website of " + n; }, findTip: function (n) { return "Search the web for " + n; }, close: "Close", edit: "✎ Edit links", eHelp: "Paste each provider’s website. Leave one empty to show a Search button instead.", urlPh: "https://…", save: "Save", saveChoose: "Choose folder and save", saving: "Saving…", cancel: "Cancel", badUrl: function (n) { return "The link for “" + n + "” does not look like a web address."; }, folderBad: "That folder does not look like your website folder (it should contain index.html and a data folder).", folderDenied: "Permission to use the folder was not given.", savedFolder: "Saved in your website folder. To show it online, commit and push in GitHub Desktop.", savedDl: "providers.js was downloaded. Put it in your website’s data folder (replace the old one) to keep the change.", errSave: function (m) { return "Could not save: " + m; }, search: "Search providers…", sAz: "A–Z", sHours: "Most hours",
      cnt: function (n, b) { return [n ? n + (n === 1 ? " certificate" : " certificates") : "", b ? b + (b === 1 ? " badge" : " badges") : ""].filter(Boolean).join(" · "); },
      none: "No provider matches your search.", since: "since", hint: "Click a provider to see them.", sMost: "Most credentials"
    },
    th: {
      title: "แหล่งที่มา", kCert: "ใบประกาศนียบัตร", kBadge: "แบดจ์", site: "เว็บไซต์", find: "ค้นหา", siteTip: function (n) { return "เปิดเว็บไซต์ของ " + n; }, findTip: function (n) { return "ค้นหา " + n + " บนเว็บ"; }, close: "ปิด", edit: "✎ แก้ไขลิงก์", eHelp: "วางเว็บไซต์ของแต่ละแหล่งที่มา หากเว้นว่างไว้ จะแสดงปุ่มค้นหาแทน", urlPh: "https://…", save: "บันทึก", saveChoose: "เลือกโฟลเดอร์และบันทึก", saving: "กำลังบันทึก…", cancel: "ยกเลิก", badUrl: function (n) { return "ลิงก์ของ “" + n + "” ไม่เหมือนที่อยู่เว็บ"; }, folderBad: "โฟลเดอร์นี้ดูไม่ใช่โฟลเดอร์เว็บไซต์ของคุณ (ต้องมี index.html และโฟลเดอร์ data)", folderDenied: "ไม่ได้รับอนุญาตให้ใช้โฟลเดอร์", savedFolder: "บันทึกในโฟลเดอร์เว็บไซต์แล้ว หากต้องการให้แสดงออนไลน์ ให้ commit และ push ใน GitHub Desktop", savedDl: "ดาวน์โหลด providers.js แล้ว นำไปวางในโฟลเดอร์ data ของเว็บไซต์ (แทนที่ไฟล์เดิม) เพื่อเก็บการเปลี่ยนแปลง", errSave: function (m) { return "บันทึกไม่สำเร็จ: " + m; }, search: "ค้นหาแหล่งที่มา…", sAz: "ก–ฮ / A–Z", sHours: "ชั่วโมงมากสุด",
      cnt: function (n, b) { return [n ? n + " ใบ" : "", b ? "แบดจ์ " + b : ""].filter(Boolean).join(" · "); },
      none: "ไม่พบแหล่งที่มาที่ตรงกับคำค้น", since: "ตั้งแต่", hint: "คลิกแหล่งที่มาเพื่อดูรายการของแหล่งนั้น", sMost: "จำนวนมากสุด"
    }
  };
  function T(k) { return TX[A.lang()][k]; }
  function el(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }
  function fmtHours(h) {
    if (!h) return "";
    var m = Math.round(h * 60), H = Math.floor(m / 60), M = m % 60, th = A.lang() === "th";
    return (H ? H + (th ? " ชม." : "h") : "") + (H && M ? " " : "") + (M ? M + (th ? " นาที" : "m") : "");
  }
  function yr(y) { return A.lang() === "th" ? +y + 543 : y; }

  /* the editor is for the site owner only (same rule as "Add" and the About editor) */
  var CFG = window.SITE_CONFIG || {}, admin = CFG.showAddButton;
  if (admin === undefined || admin === "auto") {
    var hn = location.hostname;
    admin = location.protocol === "file:" || hn === "localhost" || hn === "127.0.0.1" || /[?&]admin\b/.test(location.search);
  }
  var HAS_FS = typeof window.showDirectoryPicker === "function";
  function idb(mode, fn) {
    return new Promise(function (res) {
      try {
        var rq = indexedDB.open("certsite", 1);
        rq.onupgradeneeded = function () { rq.result.createObjectStore("kv"); };
        rq.onerror = function () { res(null); };
        rq.onsuccess = function () {
          try { var tx = rq.result.transaction("kv", mode), st = tx.objectStore("kv"), r = fn(st); tx.oncomplete = function () { res(r && r.result !== undefined ? r.result : null); }; tx.onerror = function () { res(null); }; }
          catch (e) { res(null); }
        };
      } catch (e) { res(null); }
    });
  }
  async function siteDir(dir) {
    async function ok(d) { try { await d.getFileHandle("index.html"); var dd = await d.getDirectoryHandle("data"); await dd.getFileHandle("certificates.js"); return true; } catch (e) { return false; } }
    if (await ok(dir)) return dir;
    try { var sub = await dir.getDirectoryHandle("website"); if (await ok(sub)) return sub; } catch (e) {}
    return null;
  }
  async function permit(h) {
    if (!h.queryPermission) return true;
    if ((await h.queryPermission({ mode: "readwrite" })) === "granted") return true;
    return (await h.requestPermission({ mode: "readwrite" })) === "granted";
  }
  var dirHandle = null, restoreP = null, editing = false, draft = {}, note = "", busy = false;
  if (admin && HAS_FS) restoreP = idb("readonly", function (s) { return s.get("dir"); }).then(function (h) { if (h && !dirHandle) dirHandle = h; });
  function normUrl(u) { u = String(u || "").trim(); if (!u) return ""; if (!/^[a-z][a-z0-9+.-]*:/i.test(u)) u = "https://" + u; return u; }
  function validUrl(u) { return /^https?:\/\/[^\s\/.]+\.[^\s]+$/i.test(u); }
  function links() { return window.PROVIDER_LINKS && typeof window.PROVIDER_LINKS === "object" ? window.PROVIDER_LINKS : {}; }

  function badgesOn() { return (window.SITE_CONFIG || {}).badges !== false; }
  function isB(c) { return badgesOn() && c.type === "badge"; }
  function groups() {
    var m = {};
    A.data().forEach(function (c) {
      var k = c.platform || c.issuer || "—", g = m[k] || (m[k] = { name: k, n: 0, b: 0, t: 0, h: 0, iss: {}, y: [] });
      if (isB(c)) g.b++; else g.n++; g.t++;
      g.h += c.hours || 0; if (c.issuer && c.issuer !== k) g.iss[c.issuer] = 1; g.y.push(+String(c.date).slice(0, 4));
    });
    return Object.keys(m).map(function (k) { var g = m[k]; g.y.sort(); g.first = g.y[0]; return g; });
  }

  var modal, list, sortSel, q, sum, lastFocus, sortKey = "n";
  function build() {
    modal = el("div", "modal"); modal.id = "provModal"; modal.hidden = true;
    modal.setAttribute("role", "dialog"); modal.setAttribute("aria-modal", "true"); modal.setAttribute("aria-labelledby", "provTitle");
    modal.innerHTML = '<div class="modal-box prov-box"><div class="prov-head"><div><h3 id="provTitle"></h3><p class="muted small" id="provSum"></p></div><button type="button" class="icon" id="provX">✕</button></div>' +
      '<div class="prov-tools"><input type="search" id="provQ" autocomplete="off"><button type="button" class="pill" id="provEdit" hidden></button><select id="provSort" aria-label="Sort"></select></div>' +
      '<p class="about-note prov-note" id="provNote" role="status" hidden></p><ul class="prov-list" id="provList"></ul>' +
      '<div class="prov-foot" id="provFoot" hidden><p class="warn" id="provWarn" role="alert" hidden></p><div class="prov-foot-btns"><button type="button" class="pill" id="provCancel"></button><button type="button" class="pill primary" id="provSave"></button></div></div></div>';
    document.body.appendChild(modal);
    list = modal.querySelector("#provList"); sortSel = modal.querySelector("#provSort"); q = modal.querySelector("#provQ"); sum = modal.querySelector("#provSum");
    modal.querySelector("#provX").addEventListener("click", close);
    modal.querySelector("#provEdit").addEventListener("click", startEdit);
    modal.querySelector("#provCancel").addEventListener("click", function () { if (!busy) endEdit(); });
    modal.querySelector("#provSave").addEventListener("click", saveLinks);
    modal.addEventListener("click", function (e) { if (e.target === modal) close(); });
    q.addEventListener("input", paint);
    sortSel.addEventListener("change", function () { sortKey = sortSel.value; paint(); });
    document.addEventListener("keydown", function (e) {
      if (modal.hidden) return;
      if (e.key === "Escape") { e.preventDefault(); if (editing) { if (!busy) endEdit(); } else close(); return; }
      if (e.key === "Tab") {
        var f = Array.prototype.slice.call(modal.querySelectorAll("button, input, select, a[href]")).filter(function (n) { return !n.disabled && n.offsetParent !== null; });
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    var lb = document.getElementById("langBtn"); if (lb) lb.addEventListener("click", function () { if (!modal.hidden) setTimeout(render, 0); });
  }
  function render() {
    modal.querySelector("#provTitle").textContent = T("title");
    modal.querySelector("#provX").setAttribute("aria-label", T("close"));
    q.placeholder = T("search");
    sortSel.innerHTML = [["n", "sMost"], ["az", "sAz"], ["h", "sHours"]].map(function (x) { return '<option value="' + x[0] + '">' + T(x[1]) + "</option>"; }).join("");
    sortSel.value = sortKey;
    var eb = modal.querySelector("#provEdit"); eb.textContent = T("edit"); eb.hidden = !admin || editing; sortSel.hidden = editing;
    modal.querySelector("#provCancel").textContent = T("cancel"); modal.querySelector("#provSave").textContent = needFolder() ? T("saveChoose") : T("save");
    modal.querySelector("#provFoot").hidden = !editing;
    var nt = modal.querySelector("#provNote"); nt.textContent = note; nt.hidden = !note || editing;
    paint();
  }
  function needFolder() { return HAS_FS && !dirHandle; }
  function startEdit() { editing = true; note = ""; draft = {}; var L = links(); Object.keys(L).forEach(function (k) { draft[k] = L[k]; }); showWarn(""); render(); q.focus(); }
  function endEdit() { editing = false; render(); }
  function showWarn(m) { var w = modal.querySelector("#provWarn"); w.textContent = m || ""; w.hidden = !m; }
  function paintEdit(all) {
    sum.textContent = T("eHelp");
    var term = q.value.trim().toLowerCase();
    var rows = all.filter(function (g) { return !term || (g.name + " " + Object.keys(g.iss).join(" ")).toLowerCase().indexOf(term) >= 0; }).sort(function (a, b) { return b.t - a.t || a.name.localeCompare(b.name); });
    list.innerHTML = "";
    if (!rows.length) { list.appendChild(el("li", "prov-none muted", T("none"))); return; }
    rows.forEach(function (g, i) {
      var li = el("li", "prov-erow"), lab = el("label", "prov-elab"), nm = el("span", "prov-name", g.name), inp = el("input"), id = "provU" + i;
      inp.type = "url"; inp.id = id; inp.autocomplete = "off"; inp.placeholder = T("urlPh"); inp.value = draft[g.name] || ""; inp.setAttribute("inputmode", "url");
      lab.setAttribute("for", id); lab.appendChild(nm);
      inp.addEventListener("input", function () { draft[g.name] = inp.value; });
      li.appendChild(lab); li.appendChild(inp); list.appendChild(li);
    });
  }
  async function saveLinks() {
    if (busy) return;
    var out = {}, bad = "";
    Object.keys(draft).forEach(function (k) {
      var v = normUrl(draft[k]); if (!v) return;
      if (!validUrl(v)) { if (!bad) bad = k; return; }
      out[k] = v;
    });
    if (bad) { showWarn(T("badUrl")(bad)); return; }
    showWarn("");
    var keys = Object.keys(out).sort(function (a, b) { return a.localeCompare(b); }), sorted = {}; keys.forEach(function (k) { sorted[k] = out[k]; });
    var text = "// Website of each provider, shown as a \"Website\" button in the Providers popup.\n// You can edit these with the \"Edit links\" button in the popup, or by hand here.\n// The name on the left must match the \"platform\" of your certificates exactly.\n// A provider that is not listed gets a \"Search\" button instead (a web search for its name).\nwindow.PROVIDER_LINKS = " + JSON.stringify(sorted, null, 2) + ";\n";
    var sv = modal.querySelector("#provSave");
    try {
      var saved = false;
      if (HAS_FS) {
        if (!dirHandle && restoreP) await restoreP;
        if (!dirHandle) {
          var h = await window.showDirectoryPicker({ mode: "readwrite", id: "certsite" });
          var site = await siteDir(h);
          if (!site) { showWarn(T("folderBad")); return; }
          dirHandle = site; idb("readwrite", function (st) { return st.put(site, "dir"); });
          var same = false; try { same = await site.isSameEntry(h); } catch (e) { same = true; }
          if (!same) idb("readwrite", function (st) { return st.put(h, "orig"); });
        }
        if (!(await permit(dirHandle))) { showWarn(T("folderDenied")); return; }
        busy = true; sv.disabled = true; sv.textContent = T("saving");
        var dd = await dirHandle.getDirectoryHandle("data"), fh = await dd.getFileHandle("providers.js", { create: true }), w = await fh.createWritable();
        await w.write(new Blob([text], { type: "text/javascript" })); await w.close(); saved = true;
      } else {
        var a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([text], { type: "text/javascript" })); a.download = "providers.js";
        document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
      }
      window.PROVIDER_LINKS = sorted; busy = false; sv.disabled = false; editing = false; note = saved ? T("savedFolder") : T("savedDl"); render();
    } catch (e) {
      busy = false; sv.disabled = false; sv.textContent = needFolder() ? T("saveChoose") : T("save");
      if (e && e.name === "AbortError") return;
      showWarn(T("errSave")(e && e.message ? e.message : String(e)));
    }
  }
  function paint() {
    var all = groups(), tn = all.reduce(function (s, g) { return s + g.n; }, 0), tb = all.reduce(function (s, g) { return s + g.b; }, 0);
    sum.textContent = all.length + (A.lang() === "th" ? " แหล่งที่มา · " : (all.length === 1 ? " provider · " : " providers · ")) + T("cnt")(tn, tb) + " · " + T("hint");
    if (editing) { paintEdit(all); return; }
    var term = q.value.trim().toLowerCase();
    var rows = all.filter(function (g) { return !term || (g.name + " " + Object.keys(g.iss).join(" ")).toLowerCase().indexOf(term) >= 0; });
    rows.sort(function (a, b) {
      if (sortKey === "az") return a.name.localeCompare(b.name);
      if (sortKey === "h") return b.h - a.h || b.t - a.t || a.name.localeCompare(b.name);
      return b.t - a.t || a.name.localeCompare(b.name);
    });
    var max = rows.reduce(function (m, g) { return Math.max(m, g.t); }, 1);
    list.innerHTML = "";
    if (!rows.length) { var li = el("li", "prov-none muted", T("none")); list.appendChild(li); return; }
    rows.forEach(function (g, i) {
      var li = el("li", "prov-item"), b = el("button", "prov-row"); b.type = "button";
      var iss = Object.keys(g.iss).sort(), sub = [iss.length ? iss.slice(0, 2).join(", ") + (iss.length > 2 ? " +" + (iss.length - 2) : "") : "", g.first ? T("since") + " " + yr(g.first) : ""].filter(Boolean).join(" · ");
      var right = T("cnt")(g.n, g.b);
      b.innerHTML = '<span class="prov-top"><span class="prov-name"></span><span class="prov-val"></span></span><span class="prov-sub muted small"></span><span class="prov-track"><span class="prov-fill"></span></span>';
      b.querySelector(".prov-name").textContent = g.name;
      b.querySelector(".prov-val").textContent = right + (g.h ? " · " + fmtHours(g.h) : "");
      b.querySelector(".prov-sub").textContent = sub; if (!sub) b.querySelector(".prov-sub").hidden = true;
      var f = b.querySelector(".prov-fill"); f.style.width = Math.max(3, g.t / max * 100) + "%"; f.style.background = "var(--c" + (i % 12) + ")";
      b.addEventListener("click", function () { close(true); A.goProvider(g.name); });
      li.appendChild(b);
      var link = links()[g.name], safe = /^https?:\/\//i.test(link || ""), a = el("a", "prov-go", T(safe ? "site" : "find") + " ↗");
      a.href = safe ? link : "https://www.google.com/search?q=" + encodeURIComponent(g.name + " official website");
      a.target = "_blank"; a.rel = "noopener noreferrer"; a.title = T(safe ? "siteTip" : "findTip")(g.name); a.setAttribute("aria-label", a.title);
      if (!safe) a.className += " prov-find";
      li.appendChild(a); list.appendChild(li);
    });
  }
  function open() {
    if (!modal) build();
    lastFocus = document.activeElement; q.value = ""; sortKey = "n"; editing = false; note = ""; render();
    modal.hidden = false; document.body.style.overflow = "hidden"; q.focus();
  }
  function close(skipFocus) {
    if (!modal || modal.hidden) return;
    modal.hidden = true; document.body.style.overflow = "";
    if (skipFocus !== true && lastFocus && lastFocus.focus) lastFocus.focus();
  }
  window.CertProviders = { open: open, close: close };
})();
