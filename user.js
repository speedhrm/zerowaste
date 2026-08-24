// ======================================================
// User Profile และ Learning Progress
// ======================================================

const USER_PROFILE_STORAGE_PREFIX =
  "zeroWasteUserProfile_";

let currentUser = {
  userId: "",
  employeeId: "",
  name: "",
  department: "",
  division: "",
  position: "",

  level: 1,
  greenScore: 0,
  wasteSorted: 0,
  co2ReducedKg: 0,
  aiScanCount: 0,
  qrToken: "",

  completedModules: {
    matchGame: false,
    miniQuiz: false,
    speedFlashCard: false,
    resources: false,
    aiScan: false
  }
};


// ======================================================
// Storage Key แยกตามพนักงาน
// ======================================================

function getUserProfileStorageKey() {
  const employeeId =
    currentUser.employeeId ||
    currentUser.userId ||
    "guest";

  return (
    USER_PROFILE_STORAGE_PREFIX +
    employeeId
  );
}


// ======================================================
// รับข้อมูลจากผู้ที่ Login
// ======================================================

function setCurrentUserFromLogin(user) {
  if (!user) {
    return;
  }

  const aiScanCount =
    Number(user.aiScanCount ?? user.aiScan) || 0;

  currentUser = {
    ...currentUser,

    userId:
      String(user.employeeId || user.userId || ""),

    employeeId:
      String(user.employeeId || ""),

    name:
      String(user.name || ""),

    department:
      String(user.department || ""),

    division:
      String(user.division || ""),

    position:
      String(user.position || ""),

    level:
      Number(user.level) || 1,

    greenScore:
      Number(user.greenScore) || 0,

    wasteSorted:
      Number(user.wasteSorted) || 0,

    co2ReducedKg:
      Number(user.co2ReducedKg) || 0,

    aiScanCount,

    qrToken:
      String(user.qrToken || ""),

    completedModules: {
      matchGame:
        toUserBoolean(user.matchGame),

      miniQuiz:
        toUserBoolean(user.miniQuiz),

      speedFlashCard:
        toUserBoolean(user.speedFlashCard),

      resources:
        toUserBoolean(user.resources),

      aiScan:
        aiScanCount > 0
    }
  };

  loadUserProfile();
  saveUserProfile();
  updateLearningProgress();
}


// ======================================================
// Save User Profile
// ======================================================

function saveUserProfile() {
  const storageKey =
    getUserProfileStorageKey();

  localStorage.setItem(
    storageKey,
    JSON.stringify(currentUser)
  );
}


// ======================================================
// Load User Profile
// ======================================================

function loadUserProfile() {
  const storageKey =
    getUserProfileStorageKey();

  const saved =
    localStorage.getItem(storageKey);

  if (!saved) {
    return;
  }

  try {
    const savedUser =
      JSON.parse(saved);

    currentUser = {
      ...currentUser,
      ...savedUser,

      completedModules: {
        ...currentUser.completedModules,
        ...(savedUser.completedModules || {})
      }
    };

  } catch (error) {
    console.error(
      "โหลด User Profile ไม่สำเร็จ:",
      error
    );
  }
}


// ======================================================
// Mark Module Completed
// ======================================================

function markModuleCompleted(moduleName) {
  if (
    !Object.prototype.hasOwnProperty.call(
      currentUser.completedModules,
      moduleName
    )
  ) {
    console.warn(
      `ไม่พบ Module ชื่อ ${moduleName}`
    );

    return;
  }

  currentUser.completedModules[moduleName] =
    true;

  saveUserProfile();
  updateLearningProgress();
}


// ======================================================
// AI Scan Count
// ======================================================

function addAiScanCount() {
  currentUser.aiScanCount += 1;

  currentUser.completedModules.aiScan =
    currentUser.aiScanCount > 0;

  saveUserProfile();
  updateLearningProgress();
}


// ======================================================
// Learning Progress
// ======================================================

function getCompletedModuleCount() {
  return Object
    .values(currentUser.completedModules)
    .filter(Boolean)
    .length;
}


function updateLearningProgress() {
  const completed =
    getCompletedModuleCount();

  const total =
    Object.keys(
      currentUser.completedModules
    ).length;

  const percent =
    total > 0
      ? Math.round(
          (completed / total) * 100
        )
      : 0;

  const completedText =
    document.getElementById(
      "learningCompletedText"
    );

  const progressFill =
    document.getElementById(
      "learningProgressFill"
    );

  const percentText =
    document.getElementById(
      "learningPercentText"
    );

  if (completedText) {
    completedText.textContent =
      `${completed} / ${total}`;
  }

  if (progressFill) {
    progressFill.style.width =
      `${percent}%`;
  }

  if (percentText) {
    percentText.textContent =
      `${percent}%`;
  }
}


// ======================================================
// Utility
// ======================================================

function toUserBoolean(value) {
  return (
    value === true ||
    String(value)
      .trim()
      .toUpperCase() === "TRUE"
  );
}