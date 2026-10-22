// Edit this file to personalise the site. Everything is plain text.
window.SITE_CONFIG = {
  owner: "Kanisorn Jinta-Achariya",
  ownerTh: "คณิศร จินตอัจฉริยะ",
  tagline: {
    en: "A living record of everything I have studied and completed.",
    th: "บันทึกการเรียนรู้และใบประกาศนียบัตรทั้งหมดที่ฉันสะสมมา"
  },
  // Badges (digital credentials, marked  "type": "badge"  in data/certificates.js) are shown apart from certificates.
  // true  = separate "Certificates | Badges" switch, own count and badge grid.
  // false = go back to the old look: everything in one list, nothing else changes.
  badges: true,
  // The "About me" card that opens when you click the star in front of your name.
  // Everything here is optional. Anything left empty is simply not shown.
  // Your certificate numbers (count, hours, subjects, start year) are filled in automatically.
  about: {
    photo: "",                       // e.g. "assets/profile.jpg" (put the picture in the assets folder). Empty = your initials.
    headline: { en: "", th: "" },    // e.g. { en: "Lifelong learner · Data & AI", th: "นักเรียนรู้ตลอดชีวิต · ข้อมูลและเอไอ" }
    location: { en: "", th: "" },    // e.g. { en: "Bangkok, Thailand", th: "กรุงเทพฯ ประเทศไทย" }
    bio: { en: "", th: "" },         // a few sentences about you. Empty = the tagline above is used.
    email: "",                       // e.g. "you@example.com"  (shows an "Email me" button)
    links: [
      // type can be: linkedin, github, facebook, instagram, x, youtube, tiktok, line, medium, website
      // { type: "linkedin", url: "https://www.linkedin.com/in/your-name" },
      // { type: "github", url: "https://github.com/your-name" }
    ]
  },
  // Optional links shown in the header. Leave the list empty ([]) to hide them.
  links: [
    // { label: "GitHub", url: "https://github.com/your-name" },
    // { label: "LinkedIn", url: "https://www.linkedin.com/in/your-name" }
  ]
};
