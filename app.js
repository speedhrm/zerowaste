// ======================================================
// Zero Waste AI Scanner
// ======================================================

const LOGIN_STORAGE_KEY =
  "zeroWasteLoggedInUser";

let loggedInUser = null;

async function loginUser() {
  const input =
    document.getElementById("loginEmployeeId");

  const button =
    document.getElementById("loginButton");

  const employeeId =
    String(input?.value || "").trim();

  if (!/^\d{6}$/.test(employeeId)) {
    showLoginError(
      "กรุณากรอกรหัสพนักงาน 6 หลัก"
    );
    return;
  }

  try {
    button.disabled = true;
    button.textContent = "กำลังตรวจสอบ...";

    const requestUrl =
      `${USER_API_URL}` +
      `?action=getPassport` +
      `&employeeId=${encodeURIComponent(employeeId)}`;

    console.log("User API:", requestUrl);

    const response = await fetch(requestUrl);
    const result = await response.json();

    console.log("Login result:", result);

    if (!result.success || !result.user) {
      throw new Error(
        result.message || "ไม่พบรหัสพนักงาน"
      );
    }

    loggedInUser = result.user;

    sessionStorage.setItem(
      LOGIN_STORAGE_KEY,
      JSON.stringify(loggedInUser)
    );

    showApplication();
    renderLoggedInUser();

  } catch (error) {
    console.error("Login error:", error);

    showLoginError(
      error.message || "เข้าสู่ระบบไม่สำเร็จ"
    );

  } finally {
    button.disabled = false;
    button.textContent = "เข้าสู่ระบบ";
  }
}


function showApplication() {
  document
    .getElementById("loginPage")
    ?.classList.add("hidden");

  document
    .getElementById("appContainer")
    ?.classList.remove("hidden");

  showTab("home");
}


function showLoginPage() {
  document
    .getElementById("appContainer")
    ?.classList.add("hidden");

  document
    .getElementById("loginPage")
    ?.classList.remove("hidden");
}


function showLoginError(message) {
  const errorElement =
    document.getElementById("loginError");

  if (!errorElement) {
    return;
  }

  errorElement.textContent = message;
  errorElement.classList.remove("hidden");
}


function hideLoginError() {
  const errorElement =
    document.getElementById("loginError");

  if (!errorElement) {
    return;
  }

  errorElement.textContent = "";
  errorElement.classList.add("hidden");
}


function logoutUser() {
  loggedInUser = null;

  sessionStorage.removeItem(LOGIN_STORAGE_KEY);

  closeGreenPassport();
  showLoginPage();

  const input =
    document.getElementById("loginEmployeeId");

  if (input) {
    input.value = "";
    input.focus();
  }
}

function showTab(tab) {
  const pageMap = {
    home: "homePage",
    ai: "aiPage",
    learn: "learnPage",
    events: "eventsPage",
    profile: "profilePage"
  };

  const activeBtnMap = {
    home: "homeTabBtn",
    ai: "scanTabBtn",
    learn: "knowledgeTabBtn",
    events: "eventTabBtn",
    profile: "profileTabBtn"
  };

  document.querySelectorAll(".tab-page").forEach((page) => {
    page.classList.remove("active");
  });

  const selectedPage = document.getElementById(pageMap[tab]);

  if (selectedPage) {
    selectedPage.classList.add("active");
  }

  document
    .querySelectorAll(".green-menu-btn, .green-menu-scan")
    .forEach((button) => {
      button.classList.remove("active");
    });

  const selectedButton =
    document.getElementById(activeBtnMap[tab]);

  if (selectedButton) {
    selectedButton.classList.add("active");
  }

  // ปิด Passport ทุกครั้งเมื่อเปลี่ยนหน้า
  closeGreenPassport();

  if (
    tab === "events" &&
    typeof loadEventsFromSheet === "function"
  ) {
    loadEventsFromSheet();
  }

  if (window.lucide) {
    lucide.createIcons();
  }
}


// ======================================================
// Init
// ======================================================

window.addEventListener("DOMContentLoaded", () => {
  const savedUser =
    sessionStorage.getItem(LOGIN_STORAGE_KEY);

  if (savedUser) {
    try {
      loggedInUser = JSON.parse(savedUser);
      showApplication();
      renderLoggedInUser();

    } catch (error) {
      sessionStorage.removeItem(LOGIN_STORAGE_KEY);
      showLoginPage();
    }
  } else {
    showLoginPage();
  }

  if (typeof renderManualOptions === "function") {
    renderManualOptions();
  }

  if (typeof loadWeatherDefault === "function") {
    loadWeatherDefault();
  }

  if (typeof initResourceCarousel === "function") {
    initResourceCarousel();
  }

  renderOrgLeaderboard();

  if (window.lucide) {
    lucide.createIcons();
  }
});


// ======================================================
// Mock Organization Leaderboard
// ======================================================

const mockOrgLeaderboard = [
  {
    name: "ฝ่ายทรัพยากรบุคคล",
    score: 1280,
    wasteSorted: 340
  },
  {
    name: "ฝ่ายระบบสารสนเทศ",
    score: 1120,
    wasteSorted: 290
  },
  {
    name: "ฝ่ายสื่อสารองค์การ",
    score: 980,
    wasteSorted: 250
  },
  {
    name: "ฝ่ายจัดซื้อและพัสดุ",
    score: 760,
    wasteSorted: 210
  },
  {
    name: "ฝ่ายอาคารและสถานที่",
    score: 640,
    wasteSorted: 180
  }
];


function renderOrgLeaderboard() {
  const list =
    document.getElementById("orgLeaderboardList");

  if (!list) {
    return;
  }

  list.innerHTML = "";

  mockOrgLeaderboard.forEach((item, index) => {
    const row = document.createElement("div");
    const rank = index + 1;

    row.className = "org-leaderboard-row";

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
// Green Passport QR Code
// ======================================================

function generatePassportQRCode(token) {
  const qrBox =
    document.getElementById("passportQRCode");

  if (!qrBox) {
    console.error("ไม่พบกล่อง passportQRCode");
    return;
  }

  if (!token) {
    console.error("ไม่พบ QR Token");
    return;
  }

  // ล้าง QR เดิมก่อน เพื่อป้องกันรูปซ้อนกัน
  qrBox.innerHTML = "";

  const qrImage = document.createElement("img");

  qrImage.src =
    "https://api.qrserver.com/v1/create-qr-code/" +
    "?size=180x180" +
    "&data=" +
    encodeURIComponent(token);

  qrImage.alt = "My Green Passport QR Code";
  qrImage.width = 180;
  qrImage.height = 180;

  qrImage.style.display = "block";
  qrImage.style.maxWidth = "100%";
  qrImage.style.margin = "0 auto";

  qrImage.onerror = function () {
    qrBox.innerHTML =
      "<p>ไม่สามารถสร้าง QR Code ได้</p>";
  };

  qrBox.appendChild(qrImage);
}


function openGreenPassport() {
  const modal =
    document.getElementById("greenPassportModal");

  if (!modal) {
    console.error("ไม่พบ Green Passport Modal");
    return;
  }

  if (!loggedInUser) {
    showLoginPage();
    return;
  }

  const qrToken =
    String(loggedInUser.qrToken || "").trim();

  if (!qrToken) {
    alert("ไม่พบ QR Token ของผู้ใช้นี้");
    return;
  }

  modal.classList.remove("hidden");

  generatePassportQRCode(qrToken);
}

function closeGreenPassport() {
  const modal =
    document.getElementById("greenPassportModal");

  if (modal) {
    modal.classList.add("hidden");
  }
}


function renderLoggedInUser() {
  if (!loggedInUser) {
    return;
  }

  /*
   * ส่งข้อมูลผู้ Login เข้า user.js
   */
  if (
    typeof setCurrentUserFromLogin === "function"
  ) {
    setCurrentUserFromLogin(loggedInUser);
  }

  const displayName =
    loggedInUser.name || "-";

  const displayDivision =
    loggedInUser.division ||
    loggedInUser.department ||
    "-";

  const level =
    Number(loggedInUser.level) || 1;

  const greenScore =
    Number(loggedInUser.greenScore) || 0;

  const wasteSorted =
    Number(loggedInUser.wasteSorted) || 0;

  const co2Reduced =
    Number(loggedInUser.co2ReducedKg) || 0;

  const aiScanCount =
    Number(
      loggedInUser.aiScanCount ??
      loggedInUser.aiScan
    ) || 0;


  // หน้า Home
  setElementText(
    "homeUserName",
    displayName
  );


  // หน้า Profile
  setElementText(
    "profileUserName",
    displayName
  );

  setElementText(
    "profileUserDivision",
    displayDivision
  );

  setElementText(
    "profileUserLevel",
    getGreenLevelName(level)
  );

  setElementText(
    "profileUserScore",
    greenScore.toLocaleString("th-TH")
  );

  setElementText(
    "profileWasteSorted",
    wasteSorted.toLocaleString("th-TH")
  );

  setElementText(
    "profileCo2Reduced",
    co2Reduced.toLocaleString("th-TH")
  );

  setElementText(
    "profileAiScanCount",
    aiScanCount.toLocaleString("th-TH")
  );


  // Green Passport Modal
  setElementText(
    "passportUserName",
    displayName
  );

  setElementText(
    "passportUserDivision",
    displayDivision
  );

  setElementText(
    "passportUserScore",
    greenScore.toLocaleString("th-TH")
  );

  setElementText(
    "passportUserCode",
    loggedInUser.employeeId
      ? `EGAT-GREEN-${loggedInUser.employeeId}`
      : "-"
  );
}

function setElementText(elementId, value) {
  const element =
    document.getElementById(elementId);

  if (element) {
    element.textContent =
      value === null ||
      value === undefined ||
      value === ""
        ? "-"
        : value;
  }
}


function getGreenLevelName(level) {
  const levelMap = {
    1: "Seed",
    2: "Sprout",
    3: "Sapling",
    4: "Green Hero",
    5: "Earth Guardian"
  };

  return levelMap[Number(level)] || "Seed";
}


function setElementText(elementId, value) {
  const element =
    document.getElementById(elementId);

  if (element) {
    element.textContent = value;
  }
}



// กดปุ่ม Escape เพื่อปิด Passport
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeGreenPassport();
  }
});


// ======================================================
// Countdown Update Only
// ======================================================

setInterval(() => {
  const eventsPage =
    document.getElementById("eventsPage");

  if (
    eventsPage?.classList.contains("active") &&
    typeof updateEventCountdowns === "function"
  ) {
    updateEventCountdowns();
  }
}, 1000);


// ======================================================
// Count Mission
// ======================================================

let personalScanCount = 0;
let teamScanCount = 0;

const personalTarget = 2;
const teamTarget = 30;


function updateMissionCards() {
  updateMission({
    count: personalScanCount,
    target: personalTarget,
    countId: "personalScanCount",
    progressId: "personalScanProgress",
    statusId: "personalMissionStatus",
    doneText: "สำเร็จแล้ว! รับ +5 คะแนนวันนี้ 🎉",
    remainText: (remain) =>
      `อีก ${remain} ครั้ง รับคะแนนวันนี้ 🌱`
  });

  updateMission({
    count: teamScanCount,
    target: teamTarget,
    countId: "teamScanCount",
    progressId: "teamScanProgress",
    statusId: "teamMissionStatus",
    doneText:
      "ทีมสำเร็จแล้ว! สมาชิกทุกคนรับ +20 pts 🎉",
    remainText: (remain) =>
      `อีก ${remain} ครั้ง สมาชิกทุกคนรับ +20 pts 🤝`
  });
}


function updateMission(config) {
  const countElement =
    document.getElementById(config.countId);

  const progressElement =
    document.getElementById(config.progressId);

  const statusElement =
    document.getElementById(config.statusId);

  if (!countElement || !progressElement || !statusElement) {
    return;
  }

  const progress = Math.min(
    (config.count / config.target) * 100,
    100
  );

  const remain = Math.max(
    config.target - config.count,
    0
  );

  countElement.textContent = config.count;
  progressElement.style.width = `${progress}%`;

  statusElement.textContent =
    remain === 0
      ? config.doneText
      : config.remainText(remain);
}

function addScanMissionCount() {
  personalScanCount++;
  teamScanCount++;
  updateMissionCards();
}