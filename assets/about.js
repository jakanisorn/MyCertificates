/* "About me" card — opens when the star in front of the name is clicked.
   Text comes from data/config.js (the "about" block); your links and email are kept in data/profile.js,
   which you can edit right here on your own computer with "Edit links". */
(function () {
  "use strict";
  var CFG = window.SITE_CONFIG || {}, A = window.CertApp, AB = CFG.about || {};
  var btn = document.getElementById("aboutBtn");
  if (!A || !btn) return;

  /* the editor is for the site owner only (same rule as "Add certificate") */
  var admin = CFG.showAddButton;
  if (admin === undefined || admin === "auto") {
    var hn = location.hostname;
    admin = location.protocol === "file:" || hn === "localhost" || hn === "127.0.0.1" || /[?&]admin\b/.test(location.search);
  }
  var HAS_FS = typeof window.showDirectoryPicker === "function";

  var TX = {
    en: {
      title: "About me", close: "Close", certs: "Certificates", hours: "Learning hours", cats: "Subjects", since: "Learning since", email: "Email me", links: "Find me online", open: "Open About me",
      editLinks: "✎ Edit links", noLinks: "No links yet. Add your LinkedIn, GitHub or any other page.", eTitle: "Edit links", eHelp: "Add the pages you want people to find you on. Paste the address and the type is picked for you.",
      type: "Type", url: "Address (link)", label: "Name shown (optional)", auto: "Auto-detect", add: "+ Add a link", remove: "Remove", up: "Move up", down: "Move down", emailLabel: "Email (optional)", emailHelp: "Adds an “Email me” button.",
      cancel: "Cancel", save: "Save", saveChoose: "Choose folder and save", saving: "Saving…", badUrl: function (n) { return "Link " + n + " does not look like a web address."; }, badEmail: "That email address does not look right.",
      folderBad: "That folder does not look like your website folder (it should contain index.html and a data folder).", folderDenied: "Permission to use the folder was not given.",
      savedFolder: "Saved in your website folder. To show it online, commit and push in GitHub Desktop.", savedDl: "profile.js was downloaded. Put it in your website’s data folder (replace the old one) to keep the change.", errSave: function (m) { return "Could not save: " + m; }
    },
    th: {
      title: "เกี่ยวกับฉัน", close: "ปิด", certs: "ใบประกาศนียบัตร", hours: "ชั่วโมงเรียน", cats: "หมวดหมู่", since: "เริ่มเรียนรู้ตั้งแต่", email: "ส่งอีเมลหาฉัน", links: "ติดตามฉันได้ที่", open: "เปิดข้อมูลเกี่ยวกับฉัน",
      editLinks: "✎ แก้ไขลิงก์", noLinks: "ยังไม่มีลิงก์ เพิ่ม LinkedIn, GitHub หรือหน้าอื่น ๆ ของคุณได้เลย", eTitle: "แก้ไขลิงก์", eHelp: "เพิ่มหน้าที่ต้องการให้คนเจอคุณ วางที่อยู่ลิงก์แล้วระบบจะเลือกประเภทให้",
      type: "ประเภท", url: "ที่อยู่ลิงก์", label: "ชื่อที่แสดง (ไม่บังคับ)", auto: "ตรวจอัตโนมัติ", add: "+ เพิ่มลิงก์", remove: "ลบ", up: "เลื่อนขึ้น", down: "เลื่อนลง", emailLabel: "อีเมล (ไม่บังคับ)", emailHelp: "จะแสดงปุ่ม “ส่งอีเมลหาฉัน”",
      cancel: "ยกเลิก", save: "บันทึก", saveChoose: "เลือกโฟลเดอร์และบันทึก", saving: "กำลังบันทึก…", badUrl: function (n) { return "ลิงก์ที่ " + n + " ไม่เหมือนที่อยู่เว็บ"; }, badEmail: "อีเมลนี้ดูไม่ถูกต้อง",
      folderBad: "โฟลเดอร์นี้ดูไม่ใช่โฟลเดอร์เว็บไซต์ของคุณ (ต้องมี index.html และโฟลเดอร์ data)", folderDenied: "ไม่ได้รับอนุญาตให้ใช้โฟลเดอร์",
      savedFolder: "บันทึกในโฟลเดอร์เว็บไซต์แล้ว หากต้องการให้แสดงออนไลน์ ให้ commit และ push ใน GitHub Desktop", savedDl: "ดาวน์โหลด profile.js แล้ว นำไปวางในโฟลเดอร์ data ของเว็บไซต์ (แทนที่ไฟล์เดิม) เพื่อเก็บการเปลี่ยนแปลง", errSave: function (m) { return "บันทึกไม่สำเร็จ: " + m; }
    }
  };
  function T(k) { return TX[A.lang()][k]; }
  function pick(v) { if (v == null) return ""; if (typeof v === "string") return v; return v[A.lang()] || v.en || v.th || ""; }
  function el(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }
  function safeUrl(u) { u = String(u || "").trim(); return /^(https?:\/\/|mailto:)/i.test(u) ? u : ""; }
  function initials(name) {
    var w = String(name || "").replace(/[^A-Za-z฀-๿\s-]/g, "").split(/\s+/).filter(Boolean);
    return ((w[0] || "").charAt(0) + (w.length > 1 ? w[w.length - 1].charAt(0) : "")).toUpperCase() || "★";
  }

  /* ---- what is shown ---- */
  var TYPES = [["linkedin", "LinkedIn"], ["github", "GitHub"], ["facebook", "Facebook"], ["instagram", "Instagram"], ["x", "X"], ["youtube", "YouTube"], ["tiktok", "TikTok"], ["line", "LINE"], ["medium", "Medium"], ["website", "Website"]];
  var BADGE = { linkedin: ["in", "LinkedIn"], github: ["GH", "GitHub"], facebook: ["f", "Facebook"], instagram: ["IG", "Instagram"], x: ["X", "X"], twitter: ["X", "X"], youtube: ["▶", "YouTube"], tiktok: ["TT", "TikTok"], line: ["L", "LINE"], medium: ["M", "Medium"], email: [null, "Email"], website: [null, "Website"] };
  var SVG = {
    email: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="M4 7l8 6 8-6"/></svg>',
    website: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.2 3 14.8 0 18M12 3c-3 3.2-3 14.8 0 18"/></svg>'
  };
  function profile() { return window.PROFILE && typeof window.PROFILE === "object" ? window.PROFILE : {}; }
  function getLinks() {
    var P = profile();
    var src = (P.links && P.links.length) ? P.links : ((AB.links && AB.links.length) ? AB.links : (CFG.links || []));
    return src.filter(function (l) { return l && safeUrl(l.url); });
  }
  function getEmail() { var P = profile(); return String(P.email || AB.email || "").replace(/^mailto:/i, "").trim(); }

  var modal, closeBtn, lastFocus, view = "card", note = "";

  function build() {
    modal = el("div", "modal"); modal.id = "aboutModal"; modal.hidden = true;
    modal.setAttribute("role", "dialog"); modal.setAttribute("aria-modal", "true"); modal.setAttribute("aria-labelledby", "aboutName");
    modal.innerHTML = '<div class="modal-box about-box"><button type="button" class="icon about-x" id="aboutX">✕</button><div class="about-body" id="aboutBody"></div></div>';
    document.body.appendChild(modal);
    closeBtn = modal.querySelector("#aboutX");
    closeBtn.addEventListener("click", close);
    modal.addEventListener("click", function (e) { if (e.target === modal) close(); });
    document.addEventListener("keydown", function (e) {
      if (modal.hidden) return;
      if (e.key === "Escape") { e.preventDefault(); if (view === "edit" && !busy) { view = "card"; render(); } else if (!busy) close(); return; }
      if (e.key === "Tab") {
        var f = Array.prototype.slice.call(modal.querySelectorAll("button, a[href], input, select")).filter(function (n) { return !n.disabled && n.offsetParent !== null; });
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  function stats() {
    var d = A.data(), hrs = 0, yrs = [], cc = {};
    d.forEach(function (c) { hrs += c.hours || 0; yrs.push(+String(c.date).slice(0, 4)); cc[c.cat] = 1; });
    return { n: d.length, hrs: Math.round(hrs), cats: Object.keys(cc).length, since: yrs.length ? Math.min.apply(null, yrs) : null };
  }

  /* ---------- card ---------- */
  function renderCard(body) {
    var th = A.lang() === "th", name = (th && CFG.ownerTh) ? CFG.ownerTh : (CFG.owner || "");
    var av = el("div", "about-av");
    var photo = safeUrl(AB.photo) || (AB.photo && /^[\w./-]+\.(jpe?g|png|webp|gif|svg)$/i.test(AB.photo) ? AB.photo : "");
    if (photo) {
      var im = el("img"); im.alt = ""; im.src = photo; im.addEventListener("error", function () { av.textContent = initials(CFG.owner || name); im.remove(); });
      av.appendChild(im);
    } else av.textContent = initials(CFG.owner || name);
    body.appendChild(av);

    var h = el("h2", "about-name", name); h.id = "aboutName"; body.appendChild(h);
    var head = pick(AB.headline); if (head) body.appendChild(el("p", "about-head", head));
    var meta = pick(AB.location); if (meta) body.appendChild(el("p", "about-meta muted", "📍 " + meta));
    var bio = pick(AB.bio) || pick(CFG.tagline); if (bio) body.appendChild(el("p", "about-bio", bio));

    var s = stats(), grid = el("div", "about-stats");
    [[s.n, T("certs")], [s.hrs ? s.hrs + (th ? " ชม." : "h") : "–", T("hours")], [s.cats, T("cats")], [s.since ? (th ? s.since + 543 : s.since) : "–", T("since")]].forEach(function (x) {
      var d = el("div", "about-stat"); d.appendChild(el("b", null, String(x[0]))); d.appendChild(el("span", null, x[1])); grid.appendChild(d);
    });
    body.appendChild(grid);

    var mail = getEmail() ? safeUrl("mailto:" + getEmail()) : "";
    if (mail) {
      var acts = el("div", "about-acts"), m = el("a", "pill"); m.href = mail; m.innerHTML = SVG.email + " "; m.appendChild(document.createTextNode(T("email"))); acts.appendChild(m); body.appendChild(acts);
    }

    var links = getLinks();
    if (links.length || admin) {
      body.appendChild(el("h3", "about-h", T("links")));
      if (links.length) {
        var box = el("div", "about-links");
        links.forEach(function (l) {
          var key = String(l.type || "").toLowerCase(), b = BADGE[key] || BADGE.website;
          var a = el("a", "about-link"); a.href = safeUrl(l.url); a.target = "_blank"; a.rel = "noopener noreferrer";
          var ic = el("span", "about-ic"); if (b[0]) ic.textContent = b[0]; else ic.innerHTML = SVG[key === "email" ? "email" : "website"];
          a.appendChild(ic); a.appendChild(el("span", null, l.label || b[1])); box.appendChild(a);
        });
        body.appendChild(box);
      } else body.appendChild(el("p", "muted small", T("noLinks")));
      if (admin) {
        var eb = el("button", "pill about-edit", T("editLinks")); eb.type = "button";
        eb.addEventListener("click", function () { view = "edit"; note = ""; render(); });
        body.appendChild(eb);
      }
    }
    if (note) body.appendChild(el("p", "about-note small", note));
  }

  /* ---------- editor ---------- */
  var busy = false;
  var HOSTS = [["linkedin", /(^|\.)linkedin\.com$/], ["github", /(^|\.)github\.com$/], ["facebook", /(^|\.)(facebook\.com|fb\.com|fb\.me)$/], ["instagram", /(^|\.)instagram\.com$/], ["x", /(^|\.)(x\.com|twitter\.com)$/], ["youtube", /(^|\.)(youtube\.com|youtu\.be)$/], ["tiktok", /(^|\.)tiktok\.com$/], ["line", /(^|\.)(line\.me|lin\.ee)$/], ["medium", /(^|\.)medium\.com$/]];
  function normUrl(u) {
    u = String(u || "").trim(); if (!u) return "";
    if (/^mailto:/i.test(u)) return u;
    if (!/^https?:\/\//i.test(u)) u = "https://" + u.replace(/^\/+/, "");
    return u;
  }
  function validUrl(u) { try { var x = new URL(u); return /^https?:$/.test(x.protocol) && x.hostname.indexOf(".") > 0; } catch (e) { return false; } }
  function detect(u) {
    try { var h = new URL(u).hostname.toLowerCase(); for (var i = 0; i < HOSTS.length; i++) if (HOSTS[i][1].test(h)) return HOSTS[i][0]; } catch (e) {}
    return "website";
  }

  function rowEl(l) {
    var r = el("div", "ae-row");
    var sel = el("select"); sel.setAttribute("aria-label", T("type"));
    var o0 = el("option", null, T("auto")); o0.value = ""; sel.appendChild(o0);
    TYPES.forEach(function (t) { var o = el("option", null, t[1]); o.value = t[0]; sel.appendChild(o); });
    sel.value = (l && l.type && TYPES.some(function (t) { return t[0] === l.type; }) && detect(l.url || "") !== l.type) ? l.type : "";
    var url = el("input"); url.type = "text"; url.placeholder = "https://…"; url.setAttribute("aria-label", T("url")); url.value = (l && l.url) || ""; url.autocomplete = "off"; url.spellcheck = false;
    var lab = el("input"); lab.type = "text"; lab.placeholder = T("label"); lab.setAttribute("aria-label", T("label")); lab.value = (l && l.label) || ""; lab.autocomplete = "off";
    var tools = el("div", "ae-tools");
    function tb(txt, label, fn) { var b = el("button", "icon ae-b", txt); b.type = "button"; b.setAttribute("aria-label", label); b.title = label; b.addEventListener("click", fn); tools.appendChild(b); return b; }
    tb("▲", T("up"), function () { var p = r.previousElementSibling; if (p) r.parentNode.insertBefore(r, p); });
    tb("▼", T("down"), function () { var n = r.nextElementSibling; if (n) r.parentNode.insertBefore(n, r); });
    tb("✕", T("remove"), function () { r.remove(); });
    var top = el("div", "ae-top"); top.appendChild(sel); top.appendChild(url); top.appendChild(tools);
    r.appendChild(top); r.appendChild(lab); r.err = el("p", "ae-err small"); r.err.hidden = true; r.appendChild(r.err);
    url.addEventListener("input", function () { r.err.hidden = true; });
    return r;
  }

  function renderEdit(body) {
    body.appendChild(el("h2", "about-name", T("eTitle"))).id = "aboutName";
    body.appendChild(el("p", "muted small about-ehelp", T("eHelp")));
    var rows = el("div", "ae-rows"); rows.id = "aeRows"; body.appendChild(rows);
    var cur = getLinks(); (cur.length ? cur : [null]).forEach(function (l) { rows.appendChild(rowEl(l)); });
    var add = el("button", "pill", T("add")); add.type = "button";
    add.addEventListener("click", function () { var r = rowEl(null); rows.appendChild(r); r.querySelector("input").focus(); });
    body.appendChild(add);

    var f = el("div", "ae-email"), lb = el("label", null, T("emailLabel")); lb.htmlFor = "aeEmail";
    var em = el("input"); em.id = "aeEmail"; em.type = "email"; em.value = getEmail(); em.autocomplete = "off"; em.spellcheck = false;
    f.appendChild(lb); f.appendChild(em); f.appendChild(el("small", "muted", T("emailHelp"))); var ee = el("p", "ae-err small"); ee.id = "aeEmailErr"; ee.hidden = true; f.appendChild(ee);
    body.appendChild(f);
    var warn = el("p", "warn"); warn.id = "aeWarn"; warn.hidden = true; warn.setAttribute("role", "alert"); body.appendChild(warn);
    var foot = el("div", "add-foot");
    var cn = el("button", "pill", T("cancel")); cn.type = "button"; cn.addEventListener("click", function () { if (!busy) { view = "card"; render(); } });
    var sv = el("button", "pill primary", needFolder() ? T("saveChoose") : T("save")); sv.type = "button"; sv.id = "aeSave"; sv.addEventListener("click", saveProfile);
    foot.appendChild(cn); foot.appendChild(sv); body.appendChild(foot);
    var first = rows.querySelector("input"); if (first) first.focus();
  }

  /* ---------- saving ---------- */
  var dirHandle = null;
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
  var restoreP = HAS_FS && admin ? idb("readonly", function (s) { return s.get("dir"); }).then(function (h) { if (h && !dirHandle) dirHandle = h; }) : null;
  function needFolder() { return HAS_FS && !dirHandle; }
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
  function showWarn(m) { var w = document.getElementById("aeWarn"); if (w) { w.textContent = m; w.hidden = false; } }

  function collect() {
    var ok = true, out = [], n = 0;
    Array.prototype.forEach.call(document.querySelectorAll("#aeRows .ae-row"), function (r) {
      var sel = r.querySelector("select"), inputs = r.querySelectorAll("input"), raw = inputs[0].value.trim(), label = inputs[1].value.trim();
      r.err.hidden = true; if (!raw) return; n++;
      var u = normUrl(raw);
      if (!validUrl(u)) { r.err.textContent = T("badUrl")(n); r.err.hidden = false; ok = false; return; }
      var item = { type: sel.value || detect(u), url: u }; if (label) item.label = label; out.push(item);
    });
    var email = document.getElementById("aeEmail").value.trim(), ee = document.getElementById("aeEmailErr"); ee.hidden = true;
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { ee.textContent = T("badEmail"); ee.hidden = false; ok = false; }
    return ok ? { email: email, links: out } : null;
  }
  async function saveProfile() {
    if (busy) return;
    var data = collect(); if (!data) return;
    var text = "window.PROFILE = " + JSON.stringify(data, null, 1) + ";\n", sv = document.getElementById("aeSave");
    try {
      var saved = false;
      if (HAS_FS) {
        if (!dirHandle && restoreP) await restoreP;
        if (!dirHandle) {
          var h = await window.showDirectoryPicker({ mode: "readwrite", id: "certsite" });
          var site = await siteDir(h);
          if (!site) { showWarn(T("folderBad")); return; }
          dirHandle = site; idb("readwrite", function (s) { return s.put(site, "dir"); });
          var same = false; try { same = await site.isSameEntry(h); } catch (e) { same = true; }
          if (!same) idb("readwrite", function (s) { return s.put(h, "orig"); });
        }
        if (!(await permit(dirHandle))) { showWarn(T("folderDenied")); return; }
        busy = true; sv.disabled = true; sv.textContent = T("saving");
        var dd = await dirHandle.getDirectoryHandle("data"), fh = await dd.getFileHandle("profile.js", { create: true }), w = await fh.createWritable();
        await w.write(new Blob([text], { type: "text/javascript" })); await w.close(); saved = true;
      } else {
        var a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([text], { type: "text/javascript" })); a.download = "profile.js";
        document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
      }
      window.PROFILE = data; busy = false; view = "card"; note = saved ? T("savedFolder") : T("savedDl"); render();
    } catch (e) {
      busy = false; if (sv) { sv.disabled = false; sv.textContent = needFolder() ? T("saveChoose") : T("save"); }
      if (e && e.name === "AbortError") return;
      showWarn(T("errSave")(e && e.message ? e.message : String(e)));
    }
  }

  /* ---------- open / close ---------- */
  function render() {
    closeBtn.setAttribute("aria-label", T("close"));
    var body = modal.querySelector("#aboutBody"); body.innerHTML = "";
    if (view === "edit") renderEdit(body); else renderCard(body);
    modal.querySelector(".about-box").scrollTop = 0;
  }
  function open() {
    if (!modal) build();
    lastFocus = document.activeElement; view = "card"; note = ""; render(); modal.hidden = false; document.body.style.overflow = "hidden"; btn.setAttribute("aria-expanded", "true"); closeBtn.focus();
  }
  function close() {
    if (!modal || modal.hidden || busy) return;
    modal.hidden = true; document.body.style.overflow = ""; btn.setAttribute("aria-expanded", "false");
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function paintBtn() { btn.setAttribute("aria-label", T("open")); btn.setAttribute("title", T("title")); }
  paintBtn();
  btn.setAttribute("aria-haspopup", "dialog"); btn.setAttribute("aria-expanded", "false");
  btn.addEventListener("click", open);
  document.getElementById("langBtn").addEventListener("click", function () { setTimeout(function () { paintBtn(); if (modal && !modal.hidden && view === "card") render(); }, 0); });
})();
