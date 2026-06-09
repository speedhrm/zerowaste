// ======================================================
// Zero Waste AI Scanner
// ======================================================

function showTab(tab){
  const pageMap = {
    home: "homePage",
    ai: "aiPage",
    learn: "learnPage",
    events: "eventsPage",
    profile: "profilePage"
  };

  document.querySelectorAll(".tab-page").forEach(page=>{
    page.classList.remove("active");
  });

  document.getElementById(pageMap[tab])?.classList.add("active");

  document.querySelectorAll(".green-menu-btn, .green-menu-scan").forEach(btn=>{
    btn.classList.remove("active");
  });

  const activeBtnMap = {
    home: "homeTabBtn",
    ai: "scanTabBtn",
    learn: "knowledgeTabBtn",
    events: "eventTabBtn",
    profile: "profileTabBtn"
  };

  document.getElementById(activeBtnMap[tab])?.classList.add("active");

  if(tab === "events"){
    if(typeof loadEventsFromSheet === "function"){
      loadEventsFromSheet();
    }
  }

  if(window.lucide){
    lucide.createIcons();
  }
}

// ======================================================
// Init
// ======================================================

window.addEventListener("DOMContentLoaded", ()=>{
  if(typeof renderManualOptions === "function"){
    renderManualOptions();
  }

  // ใช้ location default ก่อน ไม่ขอ location จาก browser อัตโนมัติ
  if(typeof loadWeatherDefault === "function"){
    loadWeatherDefault();
  }

  if(typeof initResourceCarousel === "function"){
    initResourceCarousel();
  }

  if(typeof renderOrgLeaderboard === "function"){
    renderOrgLeaderboard();
  }

  if(window.lucide){
    lucide.createIcons();
  }
});

// ======================================================
// Mock Organization Leaderboard
// ======================================================

const mockOrgLeaderboard = [
  { name:"ฝ่ายทรัพยากรบุคคล", score:1280, wasteSorted:340 },
  { name:"ฝ่ายระบบสารสนเทศ", score:1120, wasteSorted:290 },
  { name:"ฝ่ายสื่อสารองค์การ", score:980, wasteSorted:250 },
  { name:"ฝ่ายจัดซื้อและพัสดุ", score:760, wasteSorted:210 },
  { name:"ฝ่ายอาคารและสถานที่", score:640, wasteSorted:180 }
];

function renderOrgLeaderboard(){
  const list = document.getElementById("orgLeaderboardList");
  if(!list) return;

  list.innerHTML = "";

  mockOrgLeaderboard.forEach((item, index)=>{
    const row = document.createElement("div");
    row.className = "org-leaderboard-row";

    const rank = index + 1;

    row.innerHTML = `
      <div class="org-rank rank-${rank}">
        ${rank}
      </div>

      <div class="org-info">
        <strong>${item.name}</strong>
        <span>${item.wasteSorted} items sorted</span>
      </div>

      <div class="org-score">
        <strong>${item.score}</strong>
        <span>pts</span>
      </div>
    `;

    list.appendChild(row);
  });
}

// ======================================================
// Countdown Update Only
// ======================================================

setInterval(()=>{
  if(
    document.getElementById("eventsPage")?.classList.contains("active") &&
    typeof updateEventCountdowns === "function"
  ){
    updateEventCountdowns();
  }
},1000);