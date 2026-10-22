/* "Add certificate" form.
   - Pick a PDF -> preview image, date, hours, provider and category are suggested automatically.
   - Save writes the PDF, the preview and data/certificates.js straight into your website folder
     (Chrome / Edge). Other browsers download the three files instead. */
(function () {
  "use strict";
  var A = window.CertApp;
  if (!A) return;
  var CFG = window.SITE_CONFIG || {};

  /* The button is for the site owner: shown when opened from a file/localhost, or with ?admin in the URL.
     Set showAddButton: true / false in data/config.js to force it. */
  var show = CFG.showAddButton;
  if (show === undefined || show === "auto") {
    var h = location.hostname;
    show = location.protocol === "file:" || h === "localhost" || h === "127.0.0.1" || /[?&]admin\b/.test(location.search);
  }
  if (!show) return;

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function el(tag, attrs, html) {
    var n = document.createElement(tag);
    if (attrs) for (var k in attrs) { if (k === "class") n.className = attrs[k]; else n.setAttribute(k, attrs[k]); }
    if (html != null) n.innerHTML = html;
    return n;
  }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function pad(n, w) { n = String(n); while (n.length < w) n = "0" + n; return n; }

  /* ---------- text ---------- */
  var TX = {
    en: {
      btn: "+ Add", title: "Add a certificate",
      folderTitle: "1. Where should it be saved?",
      folderOk: function (n) { return "Saving into the folder “" + n + "”."; },
      folderNone: "Choose your Certificate4Fun folder once (the one that contains the website folder). New certificates will then be saved to both the website and your original folder.",
      origOk: function (n) { return "Also saving a copy of each PDF in your original folder “" + n + "”."; },
      origNone: "Original folder not set. New PDFs are saved only in the website folder.", origPick: "Choose original folder",
      origSame: "That is the website folder. Please choose the folder that holds your original PDFs (the one that contains the website folder).",
      doneOrig: function (n) { return "A copy of the PDF was also saved in your original folder as “" + n + "”."; }, doneOrigHad: "The PDF was already in your original folder, so nothing was copied there.", doneOrigFail: "The PDF could not be copied to your original folder. Use “Choose original folder” and try again.",
      folderPick: "Choose folder", folderChange: "Change",
      folderNoApi: "This browser can’t update your folder automatically. Open this page in Chrome or Edge on your computer and it will. Until then, saving downloads three files that you place in the folder by hand.",
      folderBad: "That folder doesn’t contain index.html and data/certificates.js. Please choose the website folder.",
      folderDenied: "Permission to save in that folder was not given.",
      fileTitle: "2. Choose the certificate (PDF or image)",
      drop: "Drop a PDF or image here, or click to choose", dropSub: "A PDF, or one or more images (JPG, PNG, WebP) that are turned into a PDF for you. Details below are filled in automatically where possible — please check them.",
      converted: function (n) { return "converted from " + n + (n === 1 ? " image" : " images"); }, imgFail: "This image couldn’t be read. Use JPG, PNG or WebP (iPhone HEIC photos need to be exported as JPG first).", mixed: "Choose either one PDF or one or more images — not both.",
      reading: "Reading the PDF…", pages: function (n) { return n + (n === 1 ? " page" : " pages"); },
      noPdfjs: "Couldn’t read inside this PDF (no automatic preview). You can still add it — fill in the details yourself and, if you like, choose a preview image.",
      notPdf: "Please choose a PDF or an image (JPG, PNG, WebP).",
      detailsTitle: "3. Details",
      fTitle: "Title (English)", fTitleHelp: "The course or certificate name as you want it shown.", fTitleTh: "Title (Thai) — optional",
      fCat: "Category", fCatSuggest: "Suggested from the title", fPlatform: "Platform / provider", fPlatformHelp: "Where you studied, e.g. Coursera, Thai MOOC, SET e-Learning.",
      fIssuer: "Issued by — optional", fIssuerHelp: "University or company named on the certificate. Leave empty if it is the same as the platform.",
      fDate: "Date earned", fDateGuess: "Taken from the file’s date — please check it.", fDateFound: "Found in the PDF — please check it.",
      fType: "Type", fTypeHelp: "A badge is a digital credential (often with a verify link). Everything else is a certificate.", fTypeCert: "Certificate", fTypeBadge: "Badge", fVerify: "Verify link — optional", fVerifyHelp: "The public page where anyone can check the badge (https://…).", badVerify: "Enter a full link starting with https://",
      fHours: "Learning hours — optional", fHoursHelp: "Only if the certificate states it. Decimals are fine (1.5).",
      suggestions: "Lines found in the PDF — click one to use it as the title:",
      thumbOwn: "Use a different preview image", thumbNone: "No preview image",
      willSave: "Will be saved as",
      req: "Required.", badDate: "Choose a valid date.", badHours: "Enter a number, or leave empty.",
      dup: "A certificate with the same title and date is already on the site. Click again to add it anyway.",
      cancel: "Cancel", save: "Save certificate", translating: "Translating…", autoTh: "Translated to Thai automatically — please check it.", saveChoose: "Choose folder and save", saveChanges: "Save changes", editBtn: "Edit", editTitle: "Edit certificate", editNote: "Only the details change. The PDF itself stays as it is.", thumbSet: "New preview image selected.", editNotFound: function (id) { return "Certificate #" + id + " was not found in data/certificates.js."; }, doneEditTitle: "Changes saved", doneEditFolder: "The details were updated in your website folder and on this page.", doneEditDl: "Updated on this page for now. To keep the change, put the downloaded certificates.js into your website’s data folder (replace the old one).", saveAnyway: "Save anyway", saving: "Saving…",
      delBtn: "Delete", delAsk: "Delete this certificate?", delWhat: "It will be removed from the website. Its PDF and preview image will be deleted from your website folder. The original PDF in your own folder is not touched.", delWhatDl: "It will be removed from this page. Because this browser can’t change your folder, you will need to delete its files by hand afterwards.", delKeep: "Keep it", delYes: "Yes, delete", deleting: "Deleting…", doneDelTitle: "Certificate deleted", doneDelFolder: "Removed from your website folder and from this page. The previous list was saved as data/certificates.backup.js.", doneDelDl: "Removed from this page for now. To keep the change, put the downloaded certificates.js into your website’s data folder (replace the old one).", doneDelLeft: "Delete these files by hand:", doneDelKept: "These files could not be deleted automatically:", doneDelGit: "If the site is already online, open GitHub Desktop, commit and push to remove it there too.",
      doneTitle: "Certificate added", doneFolder: "Saved to your website folder. It is already on the page.", doneFiles: "Files written:",
      doneDownload: "It is on this page for now, but to keep it, place the three downloaded files in your website folder:",
      doneDl1: function (id) { return "<b>" + id + ".pdf</b> → the <b>certificates</b> folder"; },
      doneDl2: function (id) { return "<b>" + id + ".jpg</b> → the <b>thumbs</b> folder"; },
      doneDl3: "<b>certificates.js</b> → the <b>data</b> folder (replace the old one)",
      doneOnline: "If your site is already online, upload the website folder again to publish it.",
      view: "View it", another: "Add another", close: "Close",
      errSave: function (m) { return "Couldn’t save: " + m; }
    },
    th: {
      btn: "+ เพิ่ม", title: "เพิ่มใบประกาศนียบัตร",
      folderTitle: "1. จะบันทึกไว้ที่ไหน",
      folderOk: function (n) { return "จะบันทึกลงในโฟลเดอร์ “" + n + "”"; },
      folderNone: "เลือกโฟลเดอร์ Certificate4Fun ของคุณหนึ่งครั้ง (โฟลเดอร์ที่มีโฟลเดอร์ website อยู่ข้างใน) ใบประกาศนียบัตรใหม่จะถูกบันทึกทั้งในเว็บไซต์และโฟลเดอร์ต้นฉบับ",
      origOk: function (n) { return "และจะบันทึกสำเนา PDF ลงในโฟลเดอร์ต้นฉบับ “" + n + "” ด้วย"; },
      origNone: "ยังไม่ได้ตั้งโฟลเดอร์ต้นฉบับ PDF ใหม่จะถูกบันทึกในโฟลเดอร์เว็บไซต์เท่านั้น", origPick: "เลือกโฟลเดอร์ต้นฉบับ",
      origSame: "นี่คือโฟลเดอร์เว็บไซต์ กรุณาเลือกโฟลเดอร์ที่เก็บ PDF ต้นฉบับ (โฟลเดอร์ที่มีโฟลเดอร์ website อยู่ข้างใน)",
      doneOrig: function (n) { return "บันทึกสำเนา PDF ลงในโฟลเดอร์ต้นฉบับเป็น “" + n + "” แล้ว"; }, doneOrigHad: "PDF นี้อยู่ในโฟลเดอร์ต้นฉบับอยู่แล้ว จึงไม่ได้คัดลอกซ้ำ", doneOrigFail: "คัดลอก PDF ไปยังโฟลเดอร์ต้นฉบับไม่สำเร็จ กด “เลือกโฟลเดอร์ต้นฉบับ” แล้วลองอีกครั้ง",
      folderPick: "เลือกโฟลเดอร์", folderChange: "เปลี่ยน",
      folderNoApi: "เบราว์เซอร์นี้อัปเดตโฟลเดอร์ให้อัตโนมัติไม่ได้ ให้เปิดหน้านี้ด้วย Chrome หรือ Edge บนคอมพิวเตอร์ ระหว่างนี้การบันทึกจะดาวน์โหลดไฟล์ 3 ไฟล์ให้ไปวางในโฟลเดอร์เอง",
      folderBad: "โฟลเดอร์นี้ไม่มี index.html และ data/certificates.js กรุณาเลือกโฟลเดอร์เว็บไซต์",
      folderDenied: "ไม่ได้รับอนุญาตให้บันทึกในโฟลเดอร์นั้น",
      fileTitle: "2. เลือกใบประกาศนียบัตร (PDF หรือรูปภาพ)",
      drop: "วางไฟล์ PDF หรือรูปภาพที่นี่ หรือคลิกเพื่อเลือก", dropSub: "ไฟล์ PDF หรือรูปภาพตั้งแต่หนึ่งรูปขึ้นไป (JPG, PNG, WebP) ซึ่งจะถูกแปลงเป็น PDF ให้อัตโนมัติ รายละเอียดด้านล่างจะถูกกรอกให้เท่าที่ทำได้ — โปรดตรวจสอบอีกครั้ง",
      converted: function (n) { return "แปลงจากรูปภาพ " + n + " รูป"; }, imgFail: "อ่านรูปภาพนี้ไม่ได้ ใช้ไฟล์ JPG, PNG หรือ WebP (รูป HEIC จาก iPhone ต้องส่งออกเป็น JPG ก่อน)", mixed: "เลือกไฟล์ PDF หนึ่งไฟล์ หรือรูปภาพหนึ่งรูปขึ้นไป — ไม่ใช่ทั้งสองอย่าง",
      reading: "กำลังอ่านไฟล์ PDF…", pages: function (n) { return n + " หน้า"; },
      noPdfjs: "อ่านข้อมูลในไฟล์ PDF นี้ไม่ได้ (ไม่มีภาพตัวอย่างอัตโนมัติ) ยังเพิ่มได้ตามปกติ — กรอกรายละเอียดเอง และเลือกภาพตัวอย่างได้ถ้าต้องการ",
      notPdf: "กรุณาเลือกไฟล์ PDF หรือรูปภาพ (JPG, PNG, WebP)",
      detailsTitle: "3. รายละเอียด",
      fTitle: "ชื่อหลักสูตร (อังกฤษ)", fTitleHelp: "ชื่อหลักสูตรหรือใบประกาศนียบัตรตามที่ต้องการให้แสดง", fTitleTh: "ชื่อหลักสูตร (ไทย) — ไม่บังคับ",
      fCat: "หมวดหมู่", fCatSuggest: "แนะนำจากชื่อหลักสูตร", fPlatform: "แพลตฟอร์ม / แหล่งที่มา", fPlatformHelp: "ที่ที่คุณเรียน เช่น Coursera, Thai MOOC, SET e-Learning",
      fIssuer: "หน่วยงานที่ออกให้ — ไม่บังคับ", fIssuerHelp: "มหาวิทยาลัยหรือบริษัทที่ระบุในใบประกาศ เว้นว่างได้ถ้าเหมือนกับแพลตฟอร์ม",
      fDate: "วันที่ได้รับ", fDateGuess: "ใช้วันที่ของไฟล์ — โปรดตรวจสอบ", fDateFound: "พบในไฟล์ PDF — โปรดตรวจสอบ",
      fType: "ประเภท", fTypeHelp: "แบดจ์คือเหรียญดิจิทัล (มักมีลิงก์ตรวจสอบ) ที่เหลือคือใบประกาศนียบัตร", fTypeCert: "ใบประกาศนียบัตร", fTypeBadge: "แบดจ์", fVerify: "ลิงก์ตรวจสอบ — ไม่บังคับ", fVerifyHelp: "หน้าสาธารณะที่ใช้ตรวจสอบแบดจ์ (https://…)", badVerify: "กรอกลิงก์เต็มที่ขึ้นต้นด้วย https://",
      fHours: "ชั่วโมงเรียน — ไม่บังคับ", fHoursHelp: "กรอกเฉพาะเมื่อใบประกาศระบุไว้ ใส่ทศนิยมได้ (1.5)",
      suggestions: "ข้อความที่พบในไฟล์ PDF — คลิกเพื่อใช้เป็นชื่อหลักสูตร:",
      thumbOwn: "ใช้ภาพตัวอย่างอื่น", thumbNone: "ไม่มีภาพตัวอย่าง",
      willSave: "จะบันทึกเป็น",
      req: "จำเป็นต้องกรอก", badDate: "เลือกวันที่ให้ถูกต้อง", badHours: "กรอกตัวเลข หรือเว้นว่าง",
      dup: "มีใบประกาศนียบัตรที่ชื่อและวันที่เดียวกันอยู่แล้ว คลิกอีกครั้งเพื่อเพิ่มต่อไป",
      cancel: "ยกเลิก", save: "บันทึกใบประกาศนียบัตร", translating: "กำลังแปล…", autoTh: "แปลเป็นภาษาไทยอัตโนมัติ — โปรดตรวจสอบ", saveChoose: "เลือกโฟลเดอร์และบันทึก", saveChanges: "บันทึกการแก้ไข", editBtn: "แก้ไข", editTitle: "แก้ไขใบประกาศนียบัตร", editNote: "แก้ไขเฉพาะรายละเอียด ไฟล์ PDF จะไม่เปลี่ยน", thumbSet: "เลือกภาพตัวอย่างใหม่แล้ว", editNotFound: function (id) { return "ไม่พบใบประกาศนียบัตรหมายเลข " + id + " ใน data/certificates.js"; }, doneEditTitle: "บันทึกการแก้ไขแล้ว", doneEditFolder: "อัปเดตรายละเอียดในโฟลเดอร์เว็บไซต์และในหน้านี้แล้ว", doneEditDl: "อัปเดตในหน้านี้ชั่วคราว หากต้องการเก็บการแก้ไข ให้นำไฟล์ certificates.js ที่ดาวน์โหลดไปวางในโฟลเดอร์ data ของเว็บไซต์ (แทนที่ไฟล์เดิม)", saveAnyway: "บันทึกต่อไป", saving: "กำลังบันทึก…",
      delBtn: "ลบ", delAsk: "ลบใบประกาศนียบัตรนี้?", delWhat: "จะถูกนำออกจากเว็บไซต์ และไฟล์ PDF กับภาพตัวอย่างจะถูกลบออกจากโฟลเดอร์เว็บไซต์ ส่วนไฟล์ PDF ต้นฉบับในโฟลเดอร์ของคุณจะไม่ถูกแตะต้อง", delWhatDl: "จะถูกนำออกจากหน้านี้ เนื่องจากเบราว์เซอร์นี้แก้ไขโฟลเดอร์ของคุณไม่ได้ คุณต้องลบไฟล์ของมันด้วยตัวเองภายหลัง", delKeep: "เก็บไว้", delYes: "ยืนยัน ลบ", deleting: "กำลังลบ…", doneDelTitle: "ลบใบประกาศนียบัตรแล้ว", doneDelFolder: "นำออกจากโฟลเดอร์เว็บไซต์และหน้านี้แล้ว รายการก่อนหน้าถูกบันทึกไว้ที่ data/certificates.backup.js", doneDelDl: "นำออกจากหน้านี้ชั่วคราว หากต้องการเก็บการเปลี่ยนแปลง ให้นำไฟล์ certificates.js ที่ดาวน์โหลดไปวางในโฟลเดอร์ data ของเว็บไซต์ (แทนที่ไฟล์เดิม)", doneDelLeft: "ลบไฟล์เหล่านี้ด้วยตัวเอง:", doneDelKept: "ลบไฟล์เหล่านี้โดยอัตโนมัติไม่ได้:", doneDelGit: "หากเว็บไซต์ออนไลน์อยู่แล้ว ให้เปิด GitHub Desktop แล้ว commit และ push เพื่อนำออกจากที่นั่นด้วย",
      doneTitle: "เพิ่มใบประกาศนียบัตรแล้ว", doneFolder: "บันทึกลงโฟลเดอร์เว็บไซต์แล้ว และแสดงในหน้านี้เรียบร้อย", doneFiles: "ไฟล์ที่เขียนลงโฟลเดอร์:",
      doneDownload: "ตอนนี้แสดงในหน้านี้ชั่วคราว หากต้องการเก็บไว้ ให้นำไฟล์ 3 ไฟล์ที่ดาวน์โหลดไปวางในโฟลเดอร์เว็บไซต์:",
      doneDl1: function (id) { return "<b>" + id + ".pdf</b> → โฟลเดอร์ <b>certificates</b>"; },
      doneDl2: function (id) { return "<b>" + id + ".jpg</b> → โฟลเดอร์ <b>thumbs</b>"; },
      doneDl3: "<b>certificates.js</b> → โฟลเดอร์ <b>data</b> (แทนที่ไฟล์เดิม)",
      doneOnline: "หากเว็บไซต์ออนไลน์อยู่แล้ว ให้อัปโหลดโฟลเดอร์เว็บไซต์อีกครั้งเพื่อเผยแพร่",
      view: "ดูใบประกาศนี้", another: "เพิ่มอีกใบ", close: "ปิด",
      errSave: function (m) { return "บันทึกไม่สำเร็จ: " + m; }
    }
  };
  function T(k) { return TX[A.lang()][k]; }

  /* ---------- suggestions ---------- */
  var RULES = [
    ["AI & Machine Learning", /\b(ai|a\.i\.|artificial intelligence|machine learning|deep learning|generative|genai|chatgpt|llm|prompt|neural|copilot|gemini)\b|เอไอ|ปัญญาประดิษฐ์/gi],
    ["Data & Analytics", /\b(data|analytics?|analysis|statistics?|statistical|excel|power ?bi|tableau|sql|dashboard)\b|ข้อมูล|สถิติ/gi],
    ["Programming & Software", /\b(python|java|javascript|typescript|programming|coding|software|web development|html|css|github|git|api|react|developer|app development)\b|โปรแกรม|เขียนโค้ด/gi],
    ["IT, Cloud & Cybersecurity", /\b(cloud|aws|azure|cyber ?security|security|network(ing)?|linux|devops|it support|infrastructure)\b|ไซเบอร์|ไอที/gi],
    ["Business & Entrepreneurship", /\b(business|entrepreneur\w*|startup|management|project|strategy|innovation|product)\b|ธุรกิจ|ผู้ประกอบการ/gi],
    ["Marketing & Branding", /\b(marketing|brand(ing)?|seo|social media|content|advertis\w*|sales)\b|การตลาด|แบรนด์/gi],
    ["Finance & Accounting", /\b(financ\w*|account\w*|invest\w*|stock|budget\w*|tax|bank\w*|money|fintech)\b|การเงิน|การลงทุน|บัญชี|ภาษี/gi],
    ["Languages & Academic Skills", /\b(english|language|ielts|toefl|academic|writing|research|reading|thesis)\b|ภาษา|วิจัย/gi],
    ["Communication & Presentation", /\b(communicat\w*|presentation|public speaking|negotiat\w*|storytelling|speaking)\b|สื่อสาร|นำเสนอ|พูด/gi],
    ["Leadership & Personal Growth", /\b(leadership|leader|growth|mindset|productivity|soft skills?|problem solving|critical thinking|career|creativity|teamwork)\b|ภาวะผู้นำ|พัฒนาตนเอง|ทักษะ/gi],
    ["Science, Energy & Environment", /\b(science|energy|environment\w*|climate|sustainab\w*|physics|chemistry|biology|carbon|solar|engineering)\b|พลังงาน|สิ่งแวดล้อม|วิทยาศาสตร์/gi],
    ["Health & Society", /\b(health\w*|medical|nutrition|mental|well-?being|safety|society|social|community|citizen\w*)\b|สุขภาพ|สังคม|ชุมชน/gi]
  ];
  function suggestCat(text) {
    var best = null, bestN = 0;
    RULES.forEach(function (r) { r[1].lastIndex = 0; var m = String(text).match(r[1]); var n = m ? m.length : 0; if (n > bestN) { bestN = n; best = r[0]; } });
    return best;
  }
  var MONTHS = { jan: 1, january: 1, feb: 2, february: 2, mar: 3, march: 3, apr: 4, april: 4, may: 5, jun: 6, june: 6, jul: 7, july: 7, aug: 8, august: 8, sep: 9, sept: 9, september: 9, oct: 10, october: 10, nov: 11, november: 11, dec: 12, december: 12 };
  var TH_MONTHS = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
  function ymd(y, m, d) {
    y = +y; m = +m; d = +d; if (y > 2400) y -= 543;
    if (y < 2000 || y > 2100 || m < 1 || m > 12 || d < 1 || d > 31) return null;
    var dt = new Date(y, m - 1, d); if (dt.getMonth() !== m - 1) return null;
    if (dt.getTime() > Date.now() + 864e5) return null;
    return y + "-" + pad(m, 2) + "-" + pad(d, 2);
  }
  function findDate(text) {
    var found = [], m, re;
    var mon = "(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|june?|july?|aug(?:ust)?|sept?(?:ember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)";
    re = new RegExp("\\b(\\d{1,2})(?:st|nd|rd|th)?\\s+" + mon + "\\.?,?\\s+(\\d{4})\\b", "gi");
    while ((m = re.exec(text))) found.push(ymd(m[3], MONTHS[m[2].toLowerCase()], m[1]));
    re = new RegExp("\\b" + mon + "\\.?\\s+(\\d{1,2})(?:st|nd|rd|th)?,?\\s+(\\d{4})\\b", "gi");
    while ((m = re.exec(text))) found.push(ymd(m[3], MONTHS[m[1].toLowerCase()], m[2]));
    re = /\b(20\d\d)[-\/.](\d{1,2})[-\/.](\d{1,2})\b/g;
    while ((m = re.exec(text))) found.push(ymd(m[1], m[2], m[3]));
    re = /\b(\d{1,2})[-\/.](\d{1,2})[-\/.](20\d\d|25\d\d)\b/g;
    while ((m = re.exec(text))) found.push(ymd(m[3], m[2], m[1]));
    re = new RegExp("(\\d{1,2})\\s*(" + TH_MONTHS.join("|") + ")\\s*(25\\d\\d|20\\d\\d)", "g");
    while ((m = re.exec(text))) found.push(ymd(m[3], TH_MONTHS.indexOf(m[2]) + 1, m[1]));
    found = found.filter(Boolean).sort();
    return found.length ? found[found.length - 1] : null;
  }
  function findHours(text) {
    var m = /(\d+(?:\.\d+)?)\s*(?:hours?|hrs?\.?|ชั่วโมง|ชม\.)/i.exec(text);
    if (!m) return null; var v = parseFloat(m[1]); return v > 0 && v < 2000 ? v : null;
  }

  /* ---------- pdf.js (local copy, loaded on first use) ---------- */
  var pdfjsP = null;
  function loadPdfjs() {
    if (window.pdfjsLib) return Promise.resolve(window.pdfjsLib);
    if (pdfjsP) return pdfjsP;
    pdfjsP = new Promise(function (res, rej) {
      var s = document.createElement("script"); s.src = "assets/vendor/pdf.min.js";
      s.onload = function () {
        if (!window.pdfjsLib) return rej(new Error("pdf.js missing"));
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = "assets/vendor/pdf.worker.min.js"; res(window.pdfjsLib);
      };
      s.onerror = function () { rej(new Error("pdf.js failed to load")); };
      document.head.appendChild(s);
    });
    return pdfjsP;
  }
  function canvasBlob(canvas) { return new Promise(function (res) { canvas.toBlob(res, "image/jpeg", 0.82); }); }
  async function analysePdf(buf) {
    var lib = await loadPdfjs();
    var pdf = await lib.getDocument({ data: new Uint8Array(buf.slice(0)) }).promise;
    var out = { pages: pdf.numPages, text: "", lines: [], thumb: null };
    var p1 = await pdf.getPage(1);
    var vp = p1.getViewport({ scale: 1 }), scale = 520 / vp.width;
    var viewport = p1.getViewport({ scale: scale });
    var canvas = document.createElement("canvas"); canvas.width = Math.round(viewport.width); canvas.height = Math.round(viewport.height);
    var ctx = canvas.getContext("2d"); ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, canvas.width, canvas.height);
    await p1.render({ canvasContext: ctx, viewport: viewport }).promise;
    out.thumb = await canvasBlob(canvas);
    for (var i = 1; i <= Math.min(2, pdf.numPages); i++) {
      var pg = i === 1 ? p1 : await pdf.getPage(i);
      var tc = await pg.getTextContent();
      var rows = {};
      tc.items.forEach(function (it) { if (!it.str || !it.str.trim()) return; var y = Math.round(it.transform[5] / 4); (rows[y] = rows[y] || []).push(it); });
      Object.keys(rows).map(Number).sort(function (a, b) { return b - a; }).forEach(function (y) {
        var line = rows[y].sort(function (a, b) { return a.transform[4] - b.transform[4]; }).map(function (it) { return it.str; }).join(" ").replace(/\s+/g, " ").trim();
        out.text += line + "\n"; if (i === 1) out.lines.push(line);
      });
    }
    return out;
  }
  async function imageToThumb(file) {
    var bmp = await createImageBitmap(file);
    var w = 520, h = Math.round(bmp.height * (w / bmp.width));
    var c = document.createElement("canvas"); c.width = w; c.height = h;
    var x = c.getContext("2d"); x.fillStyle = "#fff"; x.fillRect(0, 0, w, h); x.drawImage(bmp, 0, 0, w, h);
    return canvasBlob(c);
  }

  /* ---------- folder access ---------- */
  var HAS_FS = typeof window.showDirectoryPicker === "function";
  var dirHandle = null, origHandle = null, restoreP = null;
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
  async function resolveSiteDir(dir) {
    async function ok(d) {
      try { await d.getFileHandle("index.html"); var dd = await d.getDirectoryHandle("data"); await dd.getFileHandle("certificates.js"); return true; } catch (e) { return false; }
    }
    if (await ok(dir)) return dir;
    try { var sub = await dir.getDirectoryHandle("website"); if (await ok(sub)) return sub; } catch (e) {}
    return null;
  }
  async function ensurePermission(h) {
    if (!h.queryPermission) return true;
    if ((await h.queryPermission({ mode: "readwrite" })) === "granted") return true;
    return (await h.requestPermission({ mode: "readwrite" })) === "granted";
  }
  async function writeTo(dir, parts, blob) {
    for (var i = 0; i < parts.length - 1; i++) dir = await dir.getDirectoryHandle(parts[i], { create: true });
    var fh = await dir.getFileHandle(parts[parts.length - 1], { create: true });
    var w = await fh.createWritable(); await w.write(blob); await w.close();
  }
  async function readData(dir) {
    var dd = await dir.getDirectoryHandle("data"), fh = await dd.getFileHandle("certificates.js");
    var text = await (await fh.getFile()).text();
    var json = text.replace(/^\s*window\.CERTIFICATES\s*=\s*/, "").replace(/;\s*$/, "");
    var arr = JSON.parse(json);
    if (!Array.isArray(arr)) throw new Error("certificates.js has an unexpected format");
    return { text: text, arr: arr };
  }
  function BADGES_ON() { return (window.SITE_CONFIG || {}).badges !== false; }
  function serialise(arr) { return "window.CERTIFICATES = " + JSON.stringify(arr, null, 1) + ";\n"; }
  function cleanRec(c) { var o = {}; Object.keys(c).forEach(function (k) { if (k.charAt(0) !== "_") o[k] = c[k]; }); return o; }
  function download(blob, name) {
    var a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
  }

  /* ---------- UI ---------- */
  var modal, st; // st = state of the current form
  function saveLabel() { var need = HAS_FS && !dirHandle; return need ? T("saveChoose") : T(st.editing ? "saveChanges" : "save"); }
  function resetState() { st = { thAuto: false, editing: null, converted: 0, file: null, buf: null, info: null, thumb: null, ownThumb: false, dupAck: false, busy: false, dateSrc: "", catSug: null }; }
  resetState();

  function build() {
    modal = el("div", { class: "modal", id: "addModal", hidden: "", role: "dialog", "aria-modal": "true", "aria-labelledby": "addTitle" });
    modal.innerHTML =
      '<div class="modal-box add-box">' +
      '<div class="modal-head"><h3 id="addTitle"></h3><button type="button" class="icon" id="addX" aria-label="Close">✕</button></div>' +
      '<div class="add-body" id="addBody"></div></div>';
    document.body.appendChild(modal);
    $("#addX").addEventListener("click", close);
    modal.addEventListener("click", function (e) { if (e.target === modal) close(); });
    document.addEventListener("keydown", function (e) { if (!modal.hidden && e.key === "Escape") close(); });
  }
  function close() { if (st.busy) return; modal.hidden = true; document.body.style.overflow = ""; }
  function open() {
    if (!modal) build();
    resetState(); render(); modal.hidden = false; document.body.style.overflow = "hidden";
    var d = $("#addDrop"); if (d) d.focus();
    if (HAS_FS && !dirHandle) restoreP = Promise.all([idb("readonly", function (s) { return s.get("dir"); }), idb("readonly", function (s) { return s.get("orig"); })]).then(function (r) { if (r[0] && !dirHandle) dirHandle = r[0]; if (r[1] && !origHandle) origHandle = r[1]; paintFolder(); });
  }

  function catOptions(sel) {
    return '<option value="">—</option>' + A.cats.map(function (c) {
      return '<option value="' + esc(c[0]) + '"' + (c[0] === sel ? " selected" : "") + ">" + esc(A.lang() === "th" ? c[1] : c[0]) + "</option>";
    }).join("");
  }
  function uniq(key) {
    var m = {}; A.data().forEach(function (c) { if (c[key]) m[c[key]] = (m[c[key]] || 0) + 1; });
    return Object.keys(m).sort(function (a, b) { return m[b] - m[a]; });
  }

  /* ---------- delete ---------- */
  function askDelete() {
    var rec = st.editing; if (!rec || st.busy) return;
    var box = $("#addDelBox"), direct = HAS_FS;
    box.innerHTML = '<h5 id="addDelAsk">' + esc(T("delAsk")) + '</h5><p><b>' + esc(rec.en || "") + '</b></p><p class="muted small">' + esc(direct ? T("delWhat") : T("delWhatDl")) + '</p>' +
      '<div class="add-foot"><button type="button" class="pill" id="addDelKeep">' + esc(T("delKeep")) + '</button><button type="button" class="pill danger solid" id="addDelYes">' + esc(T("delYes")) + '</button></div>';
    box.hidden = false; $("#addFoot").hidden = true; $("#addWarn").hidden = true;
    $("#addDelKeep").addEventListener("click", function () { box.hidden = true; $("#addFoot").hidden = false; $("#addDelete").focus(); });
    $("#addDelYes").addEventListener("click", deleteCert);
    $("#addDelKeep").focus();
  }
  async function removeSiteFile(dir, path) {
    if (!/^(certificates|thumbs)\/[^\/\\]+$/.test(path)) return false;
    var parts = path.split("/"), d = await dir.getDirectoryHandle(parts[0]);
    await d.removeEntry(parts[1]); return true;
  }
  async function deleteCert() {
    var rec0 = st.editing; if (!rec0 || st.busy) return;
    if (HAS_FS) {
      if (!dirHandle && restoreP) await restoreP;
      if (!dirHandle) { await pickFolder(); if (!dirHandle) return; }
    }
    st.busy = true; var yes = $("#addDelYes"), keep = $("#addDelKeep"); yes.disabled = true; keep.disabled = true; yes.textContent = T("deleting");
    try {
      var id = rec0.id, direct = HAS_FS && dirHandle, gone = [], left = [];
      if (direct) {
        if (!(await ensurePermission(dirHandle))) throw new Error(T("folderDenied"));
        var cur = await readData(dirHandle), rec = cur.arr.filter(function (c) { return c.id === id; })[0];
        if (!rec) throw new Error(T("editNotFound")(id));
        try { await writeTo(dirHandle, ["data", "certificates.backup.js"], new Blob([cur.text], { type: "text/javascript" })); } catch (e) {}
        var rest = cur.arr.filter(function (c) { return c.id !== id; });
        await writeTo(dirHandle, ["data", "certificates.js"], new Blob([serialise(rest)], { type: "text/javascript" }));
        var paths = [rec.file, rec.thumb].filter(Boolean);
        for (var i = 0; i < paths.length; i++) {
          var p = paths[i];
          if (rest.some(function (c) { return c.file === p || c.thumb === p; })) continue; // still used by another record
          try { if (await removeSiteFile(dirHandle, p)) gone.push(p); }
          catch (e) { if (!e || e.name !== "NotFoundError") left.push(p); }
        }
      } else {
        var all = A.data().map(cleanRec).filter(function (c) { return c.id !== id; });
        download(new Blob([serialise(all)], { type: "text/javascript" }), "certificates.js");
        left = [rec0.file, rec0.thumb].filter(Boolean).map(function (p) { return p.split("?")[0]; });
      }
      A.remove(id);
      st.busy = false;
      $("#addForm").hidden = true; $("#addFolder").parentNode.hidden = true;
      var d = $("#addDone"); d.hidden = false;
      var list = function (arr) { return "<ul class='steps'>" + arr.map(function (x) { return "<li><code>" + esc(x) + "</code></li>"; }).join("") + "</ul>"; };
      d.innerHTML = '<div class="done"><div class="tick">✓</div><h4>' + esc(T("doneDelTitle")) + "</h4><p><b>" + esc(rec0.en || "") + "</b></p><p class='muted'>" + esc(direct ? T("doneDelFolder") : T("doneDelDl")) + "</p>" +
        (left.length ? "<p class='muted small'>" + esc(direct ? T("doneDelKept") : T("doneDelLeft")) + "</p>" + list(left) : "") +
        "<p class='muted small'>" + esc(T("doneDelGit")) + '</p><div class="add-foot"><button type="button" class="pill primary" id="addEditClose">' + esc(T("close")) + "</button></div></div>";
      $("#addEditClose").addEventListener("click", close); $("#addEditClose").focus();
    } catch (e) {
      st.busy = false; var box = $("#addDelBox");
      box.hidden = true; $("#addFoot").hidden = false;
      var w = $("#addWarn"); w.textContent = T("errSave")(e && e.message ? e.message : e); w.hidden = false;
    }
  }

  function openEdit(rec) {
    if (!modal) build();
    resetState(); st.editing = rec; render();
    $("#addDrop").parentNode.hidden = true; $("#addForm").hidden = false;
    $("#fEn").value = rec.en || ""; $("#fTh").value = rec.th || ""; $("#fCat").value = rec.cat || "";
    $("#fDate").value = rec.date || ""; $("#fPlat").value = rec.platform || "";
    $("#fIss").value = rec.issuer && rec.issuer !== rec.platform ? rec.issuer : "";
    $("#fHrs").value = rec.hours != null ? rec.hours : "";
    if ($("#fType")) { $("#fType").value = rec.type === "badge" ? "badge" : ""; $("#fVer").value = rec.verify || ""; $("#fVerWrap").hidden = rec.type !== "badge"; }
    $("#addDelete").hidden = false; $("#addWill").textContent = T("editNote"); $("#hThumb").textContent = rec.thumb ? "" : T("thumbNone");
    modal.hidden = false; document.body.style.overflow = "hidden"; $("#fEn").focus();
    if (HAS_FS && !dirHandle) restoreP = Promise.all([idb("readonly", function (s) { return s.get("dir"); }), idb("readonly", function (s) { return s.get("orig"); })]).then(function (r) { if (r[0] && !dirHandle) dirHandle = r[0]; if (r[1] && !origHandle) origHandle = r[1]; paintFolder(); });
  }
  async function saveEdit() {
    var v = collect(); if (!v) return;
    if (HAS_FS) {
      if (!dirHandle && restoreP) await restoreP;
      if (!dirHandle) { await pickFolder(); if (!dirHandle) return; }
    }
    st.busy = true; var btn = $("#addSave"); btn.disabled = true; btn.textContent = T("saving");
    try {
      if (!v.th && autoTr) { btn.textContent = T("translating"); v.th = (await translateTh(v.en)) || ""; btn.textContent = T("saving"); }
      var id = st.editing.id, p = pad(id, 3), direct = HAS_FS && dirHandle;
      var patch = { en: v.en, th: v.th || null, cat: v.cat, issuer: v.issuer || v.platform, platform: v.platform, date: v.date, hours: v.hours };
      if ($("#fType")) { patch.type = v.type || undefined; patch.verify = v.verify || undefined; }
      var live = {}; Object.keys(patch).forEach(function (k) { live[k] = patch[k]; });
      var thumbPath = "thumbs/" + p + ".jpg", newThumb = st.ownThumb && st.thumb;
      if (newThumb) patch.thumb = thumbPath;
      if (direct) {
        if (!(await ensurePermission(dirHandle))) throw new Error(T("folderDenied"));
        var cur = await readData(dirHandle), rec = cur.arr.filter(function (c) { return c.id === id; })[0];
        if (!rec) throw new Error(T("editNotFound")(id));
        if (newThumb) await writeTo(dirHandle, ["thumbs", p + ".jpg"], st.thumb);
        try { await writeTo(dirHandle, ["data", "certificates.backup.js"], new Blob([cur.text], { type: "text/javascript" })); } catch (e) {}
        Object.keys(patch).forEach(function (k) { rec[k] = patch[k]; });
        await writeTo(dirHandle, ["data", "certificates.js"], new Blob([serialise(cur.arr)], { type: "text/javascript" }));
        if (newThumb) live.thumb = thumbPath + "?v=" + Date.now();
      } else {
        var all = A.data().map(cleanRec), r2 = all.filter(function (c) { return c.id === id; })[0];
        Object.keys(patch).forEach(function (k) { r2[k] = patch[k]; });
        if (newThumb) { download(st.thumb, p + ".jpg"); live.thumb = URL.createObjectURL(st.thumb); }
        download(new Blob([serialise(all)], { type: "text/javascript" }), "certificates.js");
      }
      A.update(id, live);
      st.busy = false;
      $("#addForm").hidden = true; $("#addFolder").parentNode.hidden = true;
      var d = $("#addDone"); d.hidden = false;
      d.innerHTML = '<div class="done"><div class="tick">✓</div><h4>' + esc(T("doneEditTitle")) + "</h4><p><b>" + esc(v.en) + "</b></p><p class='muted'>" + esc(direct ? T("doneEditFolder") : T("doneEditDl")) + '</p><div class="add-foot"><button type="button" class="pill primary" id="addEditClose">' + esc(T("close")) + "</button></div></div>";
      $("#addEditClose").addEventListener("click", close); $("#addEditClose").focus();
    } catch (e) {
      st.busy = false; btn.disabled = false; btn.textContent = saveLabel();
      var w = $("#addWarn"); w.textContent = T("errSave")(e && e.message ? e.message : e); w.hidden = false;
    }
  }

  function render() {
    $("#addTitle").textContent = T(st.editing ? "editTitle" : "title");
    $("#addX").setAttribute("aria-label", T("close"));
    var b = $("#addBody");
    b.innerHTML =
      '<section class="add-sec"><h4>' + esc(T("folderTitle")) + '</h4><div id="addFolder"></div></section>' +
      '<section class="add-sec"><h4>' + esc(T("fileTitle")) + '</h4>' +
      '<label class="drop" id="addDrop" tabindex="0"><input type="file" id="addFile" accept="application/pdf,.pdf,image/*" multiple class="sr">' +
      '<span class="drop-in" id="addDropIn"><b>' + esc(T("drop")) + '</b><span class="muted small">' + esc(T("dropSub")) + '</span></span></label></section>' +
      '<form id="addForm" class="add-sec" novalidate hidden><h4>' + esc(T("detailsTitle")) + '</h4>' +
      '<div class="fgrid">' +
      '<div class="field wide"><label for="fEn">' + esc(T("fTitle")) + ' <i class="rq">*</i></label><input id="fEn" type="text" autocomplete="off" required><small class="help">' + esc(T("fTitleHelp")) + '</small><div id="fSug" class="sugs" hidden></div><small class="err" id="eEn" hidden></small></div>' +
      '<div class="field wide"><label for="fTh">' + esc(T("fTitleTh")) + '</label><input id="fTh" type="text" autocomplete="off"><small class="help" id="hTh" hidden></small></div>' +
      '<div class="field"><label for="fCat">' + esc(T("fCat")) + ' <i class="rq">*</i></label><select id="fCat" required>' + catOptions("") + '</select><small class="help" id="hCat" hidden>' + esc(T("fCatSuggest")) + '</small><small class="err" id="eCat" hidden></small></div>' +
      '<div class="field"><label for="fDate">' + esc(T("fDate")) + ' <i class="rq">*</i></label><input id="fDate" type="date" required max="' + new Date().toISOString().slice(0, 10) + '"><small class="help" id="hDate" hidden></small><small class="err" id="eDate" hidden></small></div>' +
      '<div class="field"><label for="fPlat">' + esc(T("fPlatform")) + ' <i class="rq">*</i></label><input id="fPlat" type="text" list="dlPlat" autocomplete="off" required><datalist id="dlPlat">' + uniq("platform").map(function (x) { return '<option value="' + esc(x) + '">'; }).join("") + '</datalist><small class="help">' + esc(T("fPlatformHelp")) + '</small><small class="err" id="ePlat" hidden></small></div>' +
      '<div class="field"><label for="fIss">' + esc(T("fIssuer")) + '</label><input id="fIss" type="text" list="dlIss" autocomplete="off"><datalist id="dlIss">' + uniq("issuer").map(function (x) { return '<option value="' + esc(x) + '">'; }).join("") + '</datalist><small class="help">' + esc(T("fIssuerHelp")) + '</small></div>' +
      '<div class="field"><label for="fHrs">' + esc(T("fHours")) + '</label><input id="fHrs" type="number" min="0" step="0.25" inputmode="decimal"><small class="help">' + esc(T("fHoursHelp")) + '</small><small class="err" id="eHrs" hidden></small></div>' +
      (BADGES_ON() ? '<div class="field"><label for="fType">' + esc(T("fType")) + '</label><select id="fType"><option value="">' + esc(T("fTypeCert")) + '</option><option value="badge">' + esc(T("fTypeBadge")) + '</option></select><small class="help">' + esc(T("fTypeHelp")) + '</small></div>' +
        '<div class="field" id="fVerWrap" hidden><label for="fVer">' + esc(T("fVerify")) + '</label><input id="fVer" type="url" inputmode="url" autocomplete="off" placeholder="https://"><small class="help">' + esc(T("fVerifyHelp")) + '</small><small class="err" id="eVer" hidden></small></div>' : '') +
      '<div class="field"><label for="fThumb">' + esc(T("thumbOwn")) + '</label><input id="fThumb" type="file" accept="image/*"><small class="help" id="hThumb"></small></div>' +
      '</div>' +
      '<p class="muted small" id="addWill"></p><p class="warn" id="addWarn" role="alert" hidden></p>' +
      '<div class="del-box" id="addDelBox" role="alertdialog" aria-labelledby="addDelAsk" hidden></div>' +
      '<div class="add-foot" id="addFoot"><button type="button" class="pill danger" id="addDelete" hidden>' + esc(T("delBtn")) + '</button><button type="button" class="pill" id="addCancel">' + esc(T("cancel")) + '</button><button type="submit" class="pill primary" id="addSave">' + esc(saveLabel()) + '</button></div></form>' +
      '<div id="addDone" hidden></div>';
    paintFolder();
    $("#addFile").addEventListener("change", function (e) { if (e.target.files.length) pickFiles(e.target.files); });
    var drop = $("#addDrop");
    ["dragenter", "dragover"].forEach(function (n) { drop.addEventListener(n, function (e) { e.preventDefault(); drop.classList.add("over"); }); });
    ["dragleave", "drop"].forEach(function (n) { drop.addEventListener(n, function (e) { e.preventDefault(); drop.classList.remove("over"); }); });
    drop.addEventListener("drop", function (e) { var fl = e.dataTransfer && e.dataTransfer.files; if (fl && fl.length) pickFiles(fl); });
    drop.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); $("#addFile").click(); } });
    if ($("#fType")) $("#fType").addEventListener("change", function () { $("#fVerWrap").hidden = this.value !== "badge"; });
    $("#addCancel").addEventListener("click", close);
    $("#addDelete").addEventListener("click", askDelete);
    $("#addForm").addEventListener("submit", function (e) { e.preventDefault(); save(); });
    $("#fEn").addEventListener("change", maybeTranslate);
    $("#fTh").addEventListener("input", function () { st.thAuto = false; $("#hTh").hidden = true; });
    $("#fThumb").addEventListener("change", async function (e) {
      var f = e.target.files[0]; if (!f) return;
      try { st.thumb = await imageToThumb(f); st.ownThumb = true; paintDrop(); if (st.editing) $("#hThumb").textContent = T("thumbSet"); } catch (er) {}
    });
    var ERR = { fEn: "eEn", fCat: "eCat", fDate: "eDate", fPlat: "ePlat", fHrs: "eHrs" };
    ["fEn", "fCat", "fDate", "fPlat", "fHrs"].forEach(function (id) { $("#" + id).addEventListener("input", function () { fieldErr(ERR[id], ""); st.dupAck = false; $("#addWarn").hidden = true; $("#addSave").textContent = saveLabel(); updateWill(); }); });
  }

  function paintFolder() {
    var box = $("#addFolder"); if (!box) return;
    if (!HAS_FS) { box.innerHTML = '<p class="warn" style="margin:0">' + esc(T("folderNoApi")) + "</p>"; return; }
    var h = "";
    if (dirHandle) {
      h += '<p class="ok-line">✓ ' + esc(T("folderOk")(dirHandle.name)) + ' <button type="button" class="link" id="addPick">' + esc(T("folderChange")) + "</button></p>";
      if (origHandle) h += '<p class="ok-line">✓ ' + esc(T("origOk")(origHandle.name)) + ' <button type="button" class="link" id="addPickOrig">' + esc(T("folderChange")) + "</button></p>";
      else h += '<p class="muted small" style="margin-top:8px">' + esc(T("origNone")) + '</p><button type="button" class="pill" id="addPickOrig">' + esc(T("origPick")) + "</button>";
    } else {
      h = '<p class="muted small">' + esc(T("folderNone")) + '</p><button type="button" class="pill" id="addPick">' + esc(T("folderPick")) + "</button>";
    }
    box.innerHTML = h;
    $("#addPick") && $("#addPick").addEventListener("click", pickFolder);
    $("#addPickOrig") && $("#addPickOrig").addEventListener("click", pickOriginal);
    var sv = $("#addSave"); if (sv && !st.dupAck && !st.busy) sv.textContent = saveLabel();
  }
  async function pickFolder() {
    try {
      var h = await window.showDirectoryPicker({ mode: "readwrite", id: "certsite" });
      var site = await resolveSiteDir(h);
      if (!site) { showWarn(T("folderBad")); return; }
      if (!(await ensurePermission(site))) { showWarn(T("folderDenied")); return; }
      dirHandle = site; $("#addWarn").hidden = true; idb("readwrite", function (s) { return s.put(site, "dir"); });
      // picked the folder that contains "website": that is the original folder too
      var same = false; try { same = await site.isSameEntry(h); } catch (e) { same = true; }
      if (!same) { origHandle = h; idb("readwrite", function (s) { return s.put(h, "orig"); }); }
      paintFolder();
    } catch (e) { if (e && e.name !== "AbortError") showWarn(String(e.message || e)); }
  }
  async function pickOriginal() {
    try {
      var h = await window.showDirectoryPicker({ mode: "readwrite", id: "certorig" });
      var same = false; try { same = dirHandle ? await dirHandle.isSameEntry(h) : false; } catch (e) {}
      if (same) { showWarn(T("origSame")); return; }
      if (!(await ensurePermission(h))) { showWarn(T("folderDenied")); return; }
      origHandle = h; $("#addWarn").hidden = true; idb("readwrite", function (s) { return s.put(h, "orig"); }); paintFolder();
    } catch (e) { if (e && e.name !== "AbortError") showWarn(String(e.message || e)); }
  }
  async function copyToOriginal(blob, name) {
    var safe = name.replace(/[\\\/:*?"<>|]+/g, "_");
    try { var f = await (await origHandle.getFileHandle(safe)).getFile(); if (f.size === blob.size) return { had: true }; } catch (e) {}
    var base = safe.replace(/\.pdf$/i, ""), n = safe, i = 2;
    while (true) { try { await origHandle.getFileHandle(n); n = base + " (" + i + ").pdf"; i++; } catch (e) { break; } }
    await writeTo(origHandle, [n], blob); return { name: n };
  }
  function showWarn(msg) {
    var w = $("#addWarn"); if (!w) return; w.textContent = msg; w.hidden = false;
    var f = $("#addForm"); if (f && f.hidden) { var s = $("#addFolder"); s.appendChild(el("p", { class: "warn" }, esc(msg))); w.hidden = true; }
  }
  function paintDrop() {
    var inn = $("#addDropIn"); if (!st.file) return;
    var kb = st.file.size > 1048576 ? (st.file.size / 1048576).toFixed(1) + " MB" : Math.max(1, Math.round(st.file.size / 1024)) + " KB";
    var img = st.thumb ? '<img alt="" src="' + URL.createObjectURL(st.thumb) + '">' : '<span class="nothumb">PDF</span>';
    inn.innerHTML = '<span class="picked">' + img + '<span><b>' + esc(st.file.name) + '</b><span class="muted small">' + kb + (st.info ? " · " + esc(T("pages")(st.info.pages)) : "") + (st.converted ? " · " + esc(T("converted")(st.converted)) : "") + "</span></span></span>";
    $("#hThumb").textContent = st.thumb ? "" : T("thumbNone");
  }
  function nextId() { return A.data().reduce(function (m, c) { return Math.max(m, c.id); }, 0) + 1; }
  function updateWill() {
    var w = $("#addWill"); if (!w) return; var id = nextId(), p = pad(id, 3);
    w.innerHTML = esc(T("willSave")) + " <code>certificates/" + p + ".pdf</code>" + (st.thumb ? " · <code>thumbs/" + p + ".jpg</code>" : "") + " · <code>data/certificates.js</code>";
  }

  /* ---------- automatic Thai title ---------- */
  var autoTr = CFG.autoTranslate !== false, trCache = {}, trTool = null, trSkip = false;
  async function translateTh(text) {
    if (trCache[text]) return trCache[text];
    var out = null;
    function limit(pr, ms) { return Promise.race([pr, new Promise(function (_, rej) { setTimeout(function () { rej(new Error("timeout")); }, ms); })]); }
    try { // 1) Chrome's on-device translator (private, works offline once its language pack is installed)
      if (!trSkip && window.Translator && window.Translator.create) {
        var o = { sourceLanguage: "en", targetLanguage: "th" };
        var av = await limit(window.Translator.availability(o), 2000);
        if (av === "available") { trTool = trTool || await limit(window.Translator.create(o), 4000); out = await limit(trTool.translate(text), 6000); }
        else trSkip = true;
      }
    } catch (e) { out = null; trSkip = true; }
    if (!out) { // 2) free online service
      var timer;
      try {
        var ctl = new AbortController(); timer = setTimeout(function () { ctl.abort(); }, 8000);
        var r = await fetch("https://api.mymemory.translated.net/get?q=" + encodeURIComponent(text) + "&langpair=en|th", { signal: ctl.signal });
        var j = await r.json(), tt = j && j.responseData && j.responseData.translatedText;
        if (tt && Number(j.responseStatus) === 200 && !/MYMEMORY WARNING|QUERY LENGTH LIMIT|INVALID/i.test(tt)) { var ta = document.createElement("textarea"); ta.innerHTML = tt; out = ta.value; }
      } catch (e) { out = null; } finally { clearTimeout(timer); }
    }
    if (out && /[\u0E00-\u0E7F]/.test(out)) { trCache[text] = out.trim(); return trCache[text]; }
    return null;
  }
  async function maybeTranslate() {
    if (!autoTr) return;
    var en = $("#fEn").value.trim(), th = $("#fTh"), h = $("#hTh");
    if (!en || (th.value.trim() && !st.thAuto)) return;
    h.textContent = T("translating"); h.hidden = false;
    var tr = await translateTh(en);
    if (en !== $("#fEn").value.trim()) return;
    if (th.value.trim() && !st.thAuto) { h.hidden = true; return; }
    if (tr) { th.value = tr; st.thAuto = true; h.textContent = T("autoTh"); } else h.hidden = true;
  }

  /* ---------- images -> PDF (done in the browser, nothing is uploaded) ---------- */
  function jpegBlob(canvas) { return new Promise(function (res) { canvas.toBlob(res, "image/jpeg", 0.92); }); }
  async function imageToJpeg(file) {
    var bmp = await createImageBitmap(file);
    var big = Math.max(bmp.width, bmp.height), k = big > 2600 ? 2600 / big : 1;
    var w = Math.round(bmp.width * k), h = Math.round(bmp.height * k);
    var c = document.createElement("canvas"); c.width = w; c.height = h;
    var x = c.getContext("2d"); x.fillStyle = "#fff"; x.fillRect(0, 0, w, h); x.drawImage(bmp, 0, 0, w, h);
    var blob = await jpegBlob(c);
    return { w: w, h: h, bytes: new Uint8Array(await blob.arrayBuffer()) };
  }
  function buildPdf(imgs) {
    var enc = new TextEncoder(), parts = [], offs = [], len = 0;
    function push(x) { var b = typeof x === "string" ? enc.encode(x) : x; parts.push(b); len += b.length; }
    function obj(n, fn) { offs[n] = len; push(n + " 0 obj\n"); fn(); push("\nendobj\n"); }
    push("%PDF-1.4\n%âãÏÓ\n");
    var n = imgs.length, kids = [];
    for (var i = 0; i < n; i++) kids.push((3 + i * 3) + " 0 R");
    obj(1, function () { push("<< /Type /Catalog /Pages 2 0 R >>"); });
    obj(2, function () { push("<< /Type /Pages /Kids [" + kids.join(" ") + "] /Count " + n + " >>"); });
    imgs.forEach(function (im, i) {
      var pg = 3 + i * 3, ct = pg + 1, ig = pg + 2, sc = 842 / Math.max(im.w, im.h), W = (im.w * sc).toFixed(2), H = (im.h * sc).toFixed(2);
      var cs = "q " + W + " 0 0 " + H + " 0 0 cm /Im0 Do Q";
      obj(pg, function () { push("<< /Type /Page /Parent 2 0 R /MediaBox [0 0 " + W + " " + H + "] /Resources << /XObject << /Im0 " + ig + " 0 R >> >> /Contents " + ct + " 0 R >>"); });
      obj(ct, function () { push("<< /Length " + cs.length + " >>\nstream\n" + cs + "\nendstream"); });
      obj(ig, function () { push("<< /Type /XObject /Subtype /Image /Width " + im.w + " /Height " + im.h + " /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length " + im.bytes.length + " >>\nstream\n"); push(im.bytes); push("\nendstream"); });
    });
    var total = 3 + n * 3, xref = len;
    push("xref\n0 " + total + "\n0000000000 65535 f \n");
    for (var k = 1; k < total; k++) push(pad(offs[k], 10) + " 00000 n \n");
    push("trailer\n<< /Size " + total + " /Root 1 0 R >>\nstartxref\n" + xref + "\n%%EOF\n");
    return new Blob(parts, { type: "application/pdf" });
  }
  async function pickFiles(list) {
    var files = Array.prototype.slice.call(list || []); if (!files.length) return;
    var isPdf = function (f) { return f.type === "application/pdf" || /\.pdf$/i.test(f.name); };
    var isImg = function (f) { return /^image\//.test(f.type) || /\.(jpe?g|png|webp|gif|bmp)$/i.test(f.name); };
    var drop = $("#addDropIn");
    if (files.length === 1 && isPdf(files[0])) { st.converted = 0; return pickFile(files[0]); }
    if (files.every(isImg)) {
      drop.innerHTML = "<b>" + esc(T("reading")) + "</b>";
      try {
        var imgs = []; for (var i = 0; i < files.length; i++) imgs.push(await imageToJpeg(files[i]));
        var pf = new File([buildPdf(imgs)], files[0].name.replace(/\.[^.]+$/, "") + ".pdf", { type: "application/pdf", lastModified: files[0].lastModified });
        st.converted = files.length; return pickFile(pf);
      } catch (e) { drop.innerHTML = '<b class="errtxt">' + esc(T("imgFail")) + "</b>"; return; }
    }
    drop.innerHTML = '<b class="errtxt">' + esc(files.some(isPdf) && files.some(isImg) ? T("mixed") : T("notPdf")) + "</b>";
  }

  async function pickFile(f) {
    var isPdf = f.type === "application/pdf" || /\.pdf$/i.test(f.name);
    var drop = $("#addDropIn");
    if (!isPdf) { drop.innerHTML = '<b class="errtxt">' + esc(T("notPdf")) + "</b>"; return; }
    st.file = f; st.info = null; st.thumb = null; st.ownThumb = false;
    drop.innerHTML = '<b>' + esc(T("reading")) + "</b>";
    st.buf = await f.arrayBuffer();
    var form = $("#addForm"); form.hidden = false;
    var note = null, sugs = [];
    try {
      st.info = await analysePdf(st.buf); st.thumb = st.info.thumb;
    } catch (e) { note = T("noPdfjs"); }
    paintDrop();
    if (note) { $("#hThumb").textContent = note; }
    // prefill
    var text = st.info ? st.info.text : "";
    var base = f.name.replace(/\.pdf$/i, "").replace(/[_]+/g, " ").replace(/\s+/g, " ").trim();
    if (!$("#fEn").value) $("#fEn").value = base;
    sugs = (st.info ? st.info.lines : []).filter(function (l) { return l.length >= 6 && l.length <= 110 && !/^\d+$/.test(l); }).slice(0, 8);
    var box = $("#fSug");
    if (sugs.length) {
      box.hidden = false; box.innerHTML = '<span class="muted small">' + esc(T("suggestions")) + "</span>";
      sugs.forEach(function (l) { var b = el("button", { type: "button", class: "sug" }); b.textContent = l; b.addEventListener("click", function () { $("#fEn").value = l; updateCat(); updateWill(); maybeTranslate(); }); box.appendChild(b); });
    } else box.hidden = true;
    var d = findDate(text), hd = $("#hDate");
    if (d) { $("#fDate").value = d; hd.textContent = T("fDateFound"); }
    else { var lm = new Date(f.lastModified || Date.now()); $("#fDate").value = lm.getFullYear() + "-" + pad(lm.getMonth() + 1, 2) + "-" + pad(lm.getDate(), 2); hd.textContent = T("fDateGuess"); }
    hd.hidden = false;
    var hrs = findHours(text); if (hrs != null) $("#fHrs").value = hrs;
    // known provider mentioned in the PDF
    var low = (text + " " + base).toLowerCase(), hit = null;
    A.data().some(function (c) { var p = c.platform; if (p && p.length > 3 && low.indexOf(p.toLowerCase()) >= 0) { hit = c; return true; } return false; });
    if (hit) { if (!$("#fPlat").value) $("#fPlat").value = hit.platform; if (!$("#fIss").value && hit.issuer && hit.issuer !== hit.platform) $("#fIss").value = hit.issuer; }
    st.catText = text; updateCat(); updateWill();
    $("#fEn").focus(); $("#fEn").select();
  }
  function updateCat() {
    var cat = suggestCat($("#fEn").value + " " + (st.catText || "")), sel = $("#fCat");
    if (cat && (!sel.value || sel.value === st.catSug)) { sel.value = cat; st.catSug = cat; $("#hCat").hidden = false; }
    else if (!cat && sel.value === st.catSug) { sel.value = ""; st.catSug = null; $("#hCat").hidden = true; }
  }

  function fieldErr(id, msg) { var e = $("#" + id); e.textContent = msg || ""; e.hidden = !msg; }
  function collect() {
    var v = { en: $("#fEn").value.trim(), th: $("#fTh").value.trim(), cat: $("#fCat").value, date: $("#fDate").value, platform: $("#fPlat").value.trim(), issuer: $("#fIss").value.trim(), hours: $("#fHrs").value.trim() };
    var ok = true;
    v.type = $("#fType") && $("#fType").value === "badge" ? "badge" : ""; v.verify = v.type ? ($("#fVer").value.trim()) : "";
    if (v.verify && !/^https?:\/\/\S+$/i.test(v.verify)) { fieldErr("eVer", T("badVerify")); ok = false; } else if ($("#eVer")) fieldErr("eVer", "");
    fieldErr("eEn", v.en ? "" : T("req")); if (!v.en) ok = false;
    fieldErr("eCat", v.cat ? "" : T("req")); if (!v.cat) ok = false;
    fieldErr("ePlat", v.platform ? "" : T("req")); if (!v.platform) ok = false;
    var dOk = /^\d{4}-\d{2}-\d{2}$/.test(v.date) && !isNaN(new Date(v.date).getTime());
    fieldErr("eDate", v.date ? (dOk ? "" : T("badDate")) : T("req")); if (!dOk) ok = false;
    var hrs = null;
    if (v.hours !== "") { hrs = Number(v.hours); if (!isFinite(hrs) || hrs < 0) { fieldErr("eHrs", T("badHours")); ok = false; } else fieldErr("eHrs", ""); } else fieldErr("eHrs", "");
    if (!st.file && !st.editing) ok = false;
    v.hours = hrs === 0 ? null : hrs;
    return ok ? v : null;
  }

  async function save() {
    if (st.busy) return;
    if (st.editing) return saveEdit();
    var v = collect(); if (!v) { var first = $(".err:not([hidden])"); if (first) first.previousElementSibling && first.parentNode.querySelector("input,select").focus(); return; }
    var dup = A.data().some(function (c) { return c.en.toLowerCase() === v.en.toLowerCase() && c.date === v.date; });
    if (dup && !st.dupAck) { st.dupAck = true; var w = $("#addWarn"); w.textContent = T("dup"); w.hidden = false; $("#addSave").textContent = T("saveAnyway"); return; }
    if (HAS_FS) {
      if (!dirHandle && restoreP) await restoreP;
      if (!dirHandle) { await pickFolder(); if (!dirHandle) return; }
    }
    st.busy = true; var btn = $("#addSave"); btn.disabled = true; btn.textContent = T("saving");
    try {
      if (!v.th && autoTr) { btn.textContent = T("translating"); v.th = (await translateTh(v.en)) || ""; btn.textContent = T("saving"); }
      var direct = HAS_FS && dirHandle;
      if (direct && !(await ensurePermission(dirHandle))) throw new Error(T("folderDenied"));
      var origReady = false;
      if (direct && origHandle) { try { origReady = await ensurePermission(origHandle); } catch (e) {} }
      var id, list, origRes = null;
      if (direct) {
        var cur = await readData(dirHandle); list = cur.arr;
        id = Math.max(nextId(), list.reduce(function (m, c) { return Math.max(m, c.id || 0); }, 0) + 1);
      } else { id = nextId(); }
      var p = pad(id, 3);
      var rec = { id: id, file: "certificates/" + p + ".pdf", thumb: st.thumb ? "thumbs/" + p + ".jpg" : null, en: v.en, th: v.th || null, cat: v.cat, issuer: v.issuer || v.platform, platform: v.platform, date: v.date, hours: v.hours };
      if (v.type) { rec.type = v.type; if (v.verify) rec.verify = v.verify; }
      var pdfBlob = new Blob([st.buf], { type: "application/pdf" });
      if (direct) {
        await writeTo(dirHandle, ["certificates", p + ".pdf"], pdfBlob);
        if (st.thumb) await writeTo(dirHandle, ["thumbs", p + ".jpg"], st.thumb);
        try { await writeTo(dirHandle, ["data", "certificates.backup.js"], new Blob([cur.text], { type: "text/javascript" })); } catch (e) {}
        list.push(rec);
        await writeTo(dirHandle, ["data", "certificates.js"], new Blob([serialise(list)], { type: "text/javascript" }));
        if (origHandle) { try { if (!origReady) throw new Error("no permission"); origRes = await copyToOriginal(pdfBlob, st.file.name); } catch (e) { origRes = { fail: true }; } }
      } else {
        var all = A.data().map(cleanRec); all.push(rec);
        download(pdfBlob, p + ".pdf");
        if (st.thumb) download(st.thumb, p + ".jpg");
        download(new Blob([serialise(all)], { type: "text/javascript" }), "certificates.js");
      }
      // show it on the page right away, using the temporary copies for the preview and PDF
      var live = cleanRec(rec);
      if (!direct) { live.file = URL.createObjectURL(pdfBlob); if (st.thumb) live.thumb = URL.createObjectURL(st.thumb); }
      A.add(live);
      done(rec, direct, origRes);
    } catch (e) {
      st.busy = false; btn.disabled = false; btn.textContent = saveLabel();
      var w2 = $("#addWarn"); w2.textContent = T("errSave")(e && e.message ? e.message : e); w2.hidden = false;
    }
  }
  function done(rec, direct, origRes) {
    st.busy = false;
    var p = pad(rec.id, 3), d = $("#addDone");
    $("#addForm").hidden = true; $("#addDrop").parentNode.hidden = true; $("#addFolder").parentNode.hidden = true;
    d.hidden = false;
    d.innerHTML = '<div class="done"><div class="tick">✓</div><h4>' + esc(T("doneTitle")) + "</h4><p><b>" + esc(rec.en) + "</b></p>" +
      (direct ? "<p class='muted'>" + esc(T("doneFolder")) + "</p><p class='muted small'>" + esc(T("doneFiles")) + " <code>" + esc(rec.file) + "</code>" + (rec.thumb ? " · <code>" + esc(rec.thumb) + "</code>" : "") + " · <code>data/certificates.js</code></p>" + (origRes ? "<p class='muted small'>" + esc(origRes.fail ? T("doneOrigFail") : origRes.had ? T("doneOrigHad") : T("doneOrig")(origRes.name)) + "</p>" : "") :
        "<p class='muted'>" + esc(T("doneDownload")) + "</p><ul class='steps'><li>" + T("doneDl1")(p) + "</li>" + (rec.thumb ? "<li>" + T("doneDl2")(p) + "</li>" : "") + "<li>" + T("doneDl3") + "</li></ul>") +
      "<p class='muted small'>" + esc(T("doneOnline")) + '</p><div class="add-foot"><button type="button" class="pill" id="addAgain">' + esc(T("another")) + '</button><button type="button" class="pill primary" id="addView">' + esc(T("view")) + "</button></div></div>";
    $("#addAgain").addEventListener("click", function () { resetState(); render(); });
    $("#addView").addEventListener("click", function () { var id = rec.id; close(); A.open(id); });
    $("#addView").focus();
  }

  /* ---------- header button ---------- */
  var btn = el("button", { type: "button", class: "pill add", id: "addBtn" });
  var eb = null;
  function paintBtn() { btn.textContent = T("btn"); if (eb) eb.textContent = T("editBtn"); }
  paintBtn();
  btn.addEventListener("click", open);
  var mo = $("#mOpen");
  if (mo) { eb = el("button", { type: "button", class: "pill", id: "mEdit" }); eb.textContent = T("editBtn"); mo.parentNode.insertBefore(eb, mo); eb.addEventListener("click", function () { var c = A.current(); if (c) openEdit(c); }); }
  var lb = $("#langBtn"); lb.parentNode.insertBefore(btn, lb);
  lb.addEventListener("click", function () { setTimeout(function () { paintBtn(); if (modal && !modal.hidden && !st.busy && !st.file && !st.editing) render(); }, 0); });
})();
