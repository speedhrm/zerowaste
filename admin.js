// ======================================================
// ZERO WASTE ADMIN
// Event Selection + QR Scanner + User Verification
// + Transaction Submission
// ======================================================

console.log("admin.js loaded");

// ------------------------------------------------------
// Application State
// ------------------------------------------------------

let adminEvents = [];
let selectedEvent = null;

let scannedToken = "";
let scannedUser = null;

let qrScanner = null;
let isScanning = false;
let isProcessingScan = false;

const MOCK_ADMIN_ID = "ADMIN001";

const QR_LIBRARY_URL =
  "https:" +
  "//unpkg.com/" +
  "html5-qrcode@2.3.8/" +
  "html5-qrcode.min.js";


function loadQrScannerLibrary() {
  return new Promise(function (resolve, reject) {
    if (typeof Html5Qrcode !== "undefined") {
      resolve();
      return;
    }

    const existingScript =
      document.getElementById(
        "html5QrCodeLibrary"
      );

    if (existingScript) {
      existingScript.addEventListener(
        "load",
        resolve,
        { once: true }
      );

      existingScript.addEventListener(
        "error",
        function () {
          reject(
            new Error(
              "โหลด QR Scanner Library ไม่สำเร็จ"
            )
          );
        },
        { once: true }
      );

      return;
    }

    const script =
      document.createElement("script");

    script.id =
      "html5QrCodeLibrary";

    script.src =
      QR_LIBRARY_URL;

    script.async = true;

    script.onload = function () {
      console.log(
        "QR Scanner Library loaded"
      );

      resolve();
    };

    script.onerror = function () {
      reject(
        new Error(
          "โหลด QR Scanner Library ไม่สำเร็จ กรุณาตรวจสอบอินเทอร์เน็ต"
        )
      );
    };

    document.head.appendChild(script);
  });
}

// ======================================================
// INITIALIZE
// ======================================================

document.addEventListener(
  "DOMContentLoaded",
  function () {
    console.log("Admin page ready");

    console.log(
      "EVENTS_API_URL:",
      typeof EVENTS_API_URL !== "undefined"
        ? EVENTS_API_URL
        : "undefined"
    );

    console.log(
      "USER_API_URL:",
      typeof USER_API_URL !== "undefined"
        ? USER_API_URL
        : "undefined"
    );

    bindAdminEvents();
    resetAdminState();
    loadAdminEvents();
    updateProgress(1);
  }
);


// ======================================================
// BIND HTML EVENTS
// ======================================================

function bindAdminEvents() {
  const eventSelect =
    document.getElementById("eventSelect");

  const startScannerButton =
    document.getElementById("startScannerButton");

  const stopScannerButton =
    document.getElementById("stopScannerButton");

  const confirmTransactionButton =
    document.getElementById("confirmTransactionButton");

  const resetTransactionButton =
    document.getElementById("resetTransactionButton");


  eventSelect?.addEventListener(
    "change",
    handleEventSelection
  );

  startScannerButton?.addEventListener(
    "click",
    startScanner
  );

  stopScannerButton?.addEventListener(
    "click",
    stopScanner
  );

  confirmTransactionButton?.addEventListener(
    "click",
    submitTransaction
  );

  resetTransactionButton?.addEventListener(
    "click",
    resetTransaction
  );
}


// ======================================================
// RESET INITIAL STATE
// ======================================================

function resetAdminState() {
  selectedEvent = null;
  scannedToken = "";
  scannedUser = null;
  isProcessingScan = false;

  hideResultCards();
  hideSystemMessage();
  hideTransactionMessage();

  const startButton =
    document.getElementById("startScannerButton");

  if (startButton) {
    startButton.disabled = true;
  }

  updateScannerPlaceholder();
}


// ======================================================
// LOAD EVENTS
// Events API ใช้ POST และ action: getEvents
// ======================================================

async function loadAdminEvents() {
  const eventSelect =
    document.getElementById("eventSelect");

  if (!eventSelect) {
    console.error("ไม่พบ element #eventSelect");
    return;
  }

  eventSelect.innerHTML =
    '<option value="">กำลังโหลดกิจกรรม...</option>';

  try {
    if (
      typeof EVENTS_API_URL === "undefined" ||
      !EVENTS_API_URL
    ) {
      throw new Error(
        "ไม่พบ EVENTS_API_URL กรุณาตรวจสอบ config.js"
      );
    }

    console.log(
      "Loading Events API:",
      EVENTS_API_URL
    );

    const response =
      await fetch(EVENTS_API_URL, {
        method: "POST",

        headers: {
          "Content-Type":
            "text/plain;charset=utf-8"
        },

        body: JSON.stringify({
          action: "getEvents"
        })
      });

    const rawText =
      await response.text();

    console.log(
      "Events HTTP Status:",
      response.status
    );

    console.log(
      "Events Raw Response:",
      rawText
    );

    if (!response.ok) {
      throw new Error(
        `Events API ตอบกลับ HTTP ${response.status}`
      );
    }

    let result;

    try {
      result = JSON.parse(rawText);
    } catch (parseError) {
      console.error(
        "Events JSON Parse Error:",
        parseError
      );

      throw new Error(
        "Events API ไม่ได้ส่งข้อมูลกลับมาเป็น JSON"
      );
    }

    console.log(
      "Events Parsed Result:",
      result
    );

    if (
      result.error === true ||
      result.success === false
    ) {
      throw new Error(
        result.message ||
        result.reason ||
        "Events API แจ้งว่าโหลดกิจกรรมไม่สำเร็จ"
      );
    }

    const allEvents =
      extractEventArray(result);

    console.log(
      "All Events:",
      allEvents
    );

    adminEvents =
      allEvents.filter(function (event) {
        const status =
          normalizeEventStatus(
            event.status
          );

        return (
          status === "upcoming" ||
          status === "future"
        );
      });

    adminEvents.sort(sortEventsByDate);

    console.log(
      "Upcoming and Future Events:",
      adminEvents
    );

    renderEventOptions();

  } catch (error) {
    console.error(
      "Load Events Error:",
      error
    );

    eventSelect.innerHTML =
      '<option value="">โหลดกิจกรรมไม่สำเร็จ</option>';

    showSystemMessage(
      error.message ||
      "ไม่สามารถโหลดรายการกิจกรรมได้",
      "error"
    );
  }
}


// ======================================================
// EXTRACT EVENT ARRAY
// รองรับรูปแบบผลลัพธ์จาก API หลายแบบ
// ======================================================

function extractEventArray(result) {
  if (Array.isArray(result)) {
    return result;
  }

  if (
    result &&
    Array.isArray(result.events)
  ) {
    return result.events;
  }

  if (
    result &&
    Array.isArray(result.data)
  ) {
    return result.data;
  }

  if (
    result &&
    Array.isArray(result.result)
  ) {
    return result.result;
  }

  if (
    result &&
    Array.isArray(result.items)
  ) {
    return result.items;
  }

  if (
    result &&
    result.data &&
    Array.isArray(result.data.events)
  ) {
    return result.data.events;
  }

  console.warn(
    "ไม่พบ Array กิจกรรมใน API Result:",
    result
  );

  return [];
}


function normalizeEventStatus(status) {
  return String(status || "")
    .trim()
    .toLowerCase();
}


function sortEventsByDate(eventA, eventB) {
  const dateA =
    createEventDate(eventA);

  const dateB =
    createEventDate(eventB);

  return dateA.getTime() - dateB.getTime();
}


function createEventDate(event) {
  const dateValue =
    event?.date ||
    event?.startDate ||
    "";

  const timeValue =
    event?.startTime ||
    "00:00";

  const combinedValue =
    `${dateValue}T${timeValue}:00`;

  const combinedDate =
    new Date(combinedValue);

  if (!Number.isNaN(combinedDate.getTime())) {
    return combinedDate;
  }

  const normalDate =
    new Date(dateValue);

  if (!Number.isNaN(normalDate.getTime())) {
    return normalDate;
  }

  return new Date(8640000000000000);
}


// ======================================================
// RENDER EVENT OPTIONS
// ======================================================

function renderEventOptions() {
  const eventSelect =
    document.getElementById("eventSelect");

  if (!eventSelect) {
    return;
  }

  eventSelect.innerHTML =
    '<option value="">เลือกกิจกรรม</option>';

  adminEvents.forEach(function (event) {
    const option =
      document.createElement("option");

    const eventId =
      getEventId(event);

    option.value =
      eventId;

    option.textContent =
      createEventOptionText(event);

    eventSelect.appendChild(option);
  });

  if (adminEvents.length === 0) {
    eventSelect.innerHTML =
      '<option value="">ไม่พบกิจกรรม Upcoming หรือ Future</option>';

    showSystemMessage(
      "โหลดกิจกรรมสำเร็จ แต่ไม่พบกิจกรรมสถานะ Upcoming หรือ Future",
      "info"
    );

    return;
  }

  hideSystemMessage();
}


function getEventId(event) {
  return String(
    event?.id ||
    event?.eventId ||
    ""
  ).trim();
}


function getEventTitle(event) {
  return String(
    event?.title ||
    event?.eventName ||
    event?.name ||
    "ไม่มีชื่อกิจกรรม"
  ).trim();
}


function createEventOptionText(event) {
  const eventId =
    getEventId(event) || "-";

  const eventTitle =
    getEventTitle(event);

  const eventDate =
    formatEventDate(
      event.date ||
      event.startDate
    );

  const eventStatus =
    String(event.status || "-");

  return (
    `#${eventId} ${eventTitle} | ` +
    `${eventDate} | ${eventStatus}`
  );
}


// ======================================================
// EVENT SELECTION
// ======================================================

function handleEventSelection() {
  const eventSelect =
    document.getElementById("eventSelect");

  const selectedId =
    String(eventSelect?.value || "")
      .trim();

  selectedEvent =
    adminEvents.find(function (event) {
      return (
        getEventId(event) === selectedId
      );
    }) || null;

  scannedToken = "";
  scannedUser = null;
  isProcessingScan = false;

  hideResultCards();
  hideTransactionMessage();

  renderSelectedEvent();
  updateScannerPlaceholder();

  const startButton =
    document.getElementById(
      "startScannerButton"
    );

  if (startButton) {
    startButton.disabled =
      !selectedEvent;
  }

  if (selectedEvent) {
    updateProgress(2);

    showSystemMessage(
      "เลือกกิจกรรมแล้ว พร้อมสแกน Green Passport",
      "info"
    );
  } else {
    updateProgress(1);
    hideSystemMessage();
  }
}


function renderSelectedEvent() {
  const eventDetail =
    document.getElementById("eventDetail");

  if (!eventDetail) {
    return;
  }

  if (!selectedEvent) {
    eventDetail.textContent =
      "เลือกกิจกรรมเพื่อดูรายละเอียด";

    return;
  }

  const title =
    getEventTitle(selectedEvent);

  const date =
    selectedEvent.date ||
    selectedEvent.startDate;

  const startTime =
    selectedEvent.startTime || "-";

  const endTime =
    selectedEvent.endTime || "-";

  const location =
    selectedEvent.location || "-";

  const status =
    selectedEvent.status || "-";

  eventDetail.innerHTML = `
    <strong>${escapeHtml(title)}</strong>

    <span>
      📅 วันที่ ${formatEventDate(date)}
    </span>

    <span>
      🕒 เวลา
      ${escapeHtml(startTime)}
      ถึง
      ${escapeHtml(endTime)}
    </span>

    <span>
      📍 สถานที่
      ${escapeHtml(location)}
    </span>

    <span class="event-status">
      ${escapeHtml(status)}
    </span>
  `;
}


// ======================================================
// SCANNER PLACEHOLDER
// ======================================================

function updateScannerPlaceholder() {
  const placeholder =
    document.getElementById(
      "scannerPlaceholder"
    );

  if (!placeholder) {
    return;
  }

  if (selectedEvent) {
    placeholder.innerHTML = `
      <div class="scanner-visual">▣</div>

      <strong>พร้อมสแกน QR</strong>

      <span>
        กดปุ่มเปิดกล้อง แล้วนำ Green Passport
        ให้อยู่ภายในกรอบ
      </span>
    `;

    return;
  }

  placeholder.innerHTML = `
    <div class="scanner-visual">▣</div>

    <strong>ยังไม่เปิดกล้อง</strong>

    <span>
      กรุณาเลือกกิจกรรมก่อนเปิดกล้อง
    </span>
  `;
}


// ======================================================
// START QR SCANNER
// ======================================================

async function startScanner() {
  if (!selectedEvent) {
    showSystemMessage(
      "กรุณาเลือกกิจกรรมก่อนเปิดกล้อง",
      "error"
    );
    return;
  }

  try {
    showSystemMessage(
        "กำลังเตรียมระบบกล้อง...",
        "info"
    );

    await loadQrScannerLibrary();

    } catch (error) {
    console.error(
        "QR Library Error:",
        error
    );

    showSystemMessage(
        error.message ||
        "เตรียมระบบกล้องไม่สำเร็จ",
        "error"
    );

    return;
  }

  if (isScanning) {
    return;
  }

  scannedToken = "";
  scannedUser = null;
  isProcessingScan = false;

  hideResultCards();
  hideTransactionMessage();
  hideSystemMessage();

  document
    .getElementById("scannerPlaceholder")
    ?.classList.add("hidden");

  document
    .getElementById("startScannerButton")
    ?.classList.add("hidden");

  document
    .getElementById("stopScannerButton")
    ?.classList.remove("hidden");

  qrScanner = new Html5Qrcode("qrReader");

  try {
    const cameras =
      await Html5Qrcode.getCameras();

    if (!cameras || cameras.length === 0) {
      throw new Error("ไม่พบกล้องในอุปกรณ์");
    }

    const backCamera =
      cameras.find((camera) => {
        const label =
          String(camera.label || "")
            .toLowerCase();

        return (
          label.includes("back") ||
          label.includes("rear") ||
          label.includes("environment")
        );
      }) || cameras[cameras.length - 1];

    await qrScanner.start(
      backCamera.id,
      {
        fps: 10,
        qrbox: {
          width: 230,
          height: 230
        },
        aspectRatio: 1
      },
      handleScanSuccess,
      function () {
        // ยังไม่พบ QR เป็นสถานะปกติ
      }
    );

    isScanning = true;

    showSystemMessage(
      "เปิดกล้องแล้ว นำ QR Green Passport มาไว้ในกรอบ",
      "info"
    );

  } catch (error) {
    console.error("Start Scanner Error:", error);

    showSystemMessage(
      error.message ||
      "เปิดกล้องไม่สำเร็จ กรุณาอนุญาตสิทธิ์กล้อง",
      "error"
    );

    await stopScanner();
  }
}


// ======================================================
// STOP QR SCANNER
// ======================================================

async function stopScanner() {
  if (qrScanner) {
    try {
      if (isScanning) {
        await qrScanner.stop();
      }

      await qrScanner.clear();

    } catch (error) {
      console.warn(
        "Stop Scanner Warning:",
        error
      );
    }
  }

  qrScanner = null;
  isScanning = false;

  document
    .getElementById("scannerPlaceholder")
    ?.classList.remove("hidden");

  document
    .getElementById("startScannerButton")
    ?.classList.remove("hidden");

  document
    .getElementById("stopScannerButton")
    ?.classList.add("hidden");

  updateScannerPlaceholder();
}


// ======================================================
// QR SCAN SUCCESS
// ======================================================

async function handleScanSuccess(
  decodedText
) {
  if (isProcessingScan) {
    return;
  }

  isProcessingScan = true;

  console.log(
    "QR Decoded Text:",
    decodedText
  );

  scannedToken =
    extractTokenFromQr(decodedText);

  await stopScanner();

  if (!scannedToken) {
    isProcessingScan = false;

    showSystemMessage(
      "ไม่พบ Token ใน QR Code",
      "error"
    );

    return;
  }

  showSystemMessage(
    "อ่าน QR สำเร็จ กำลังตรวจสอบข้อมูลพนักงาน...",
    "info"
  );

  await verifyScannedUser();
}


// ======================================================
// EXTRACT QR TOKEN
// รองรับ QR ที่เก็บ Token หรือ URL ที่มี ?token=
// ======================================================

function extractTokenFromQr(decodedText) {
  const rawValue =
    String(decodedText || "")
      .trim();

  if (!rawValue) {
    return "";
  }

  try {
    const qrUrl =
      new URL(rawValue);

    const token =
      qrUrl.searchParams.get("token");

    if (token) {
      return token.trim();
    }

  } catch (error) {
    // QR อาจเก็บ Token ตรง ๆ
  }

  return rawValue;
}


// ======================================================
// VERIFY USER FROM QR TOKEN
// User API ใช้ GET action=verify
// ======================================================

async function verifyScannedUser() {
  try {
    if (
      typeof USER_API_URL === "undefined" ||
      !USER_API_URL
    ) {
      throw new Error(
        "ไม่พบ USER_API_URL กรุณาตรวจสอบ config.js"
      );
    }

    const requestUrl =
      `${USER_API_URL}` +
      `?action=verify` +
      `&token=${encodeURIComponent(scannedToken)}`;

    console.log(
      "Verify User URL:",
      requestUrl
    );

    const response =
      await fetch(requestUrl);

    const rawText =
      await response.text();

    console.log(
      "Verify User HTTP Status:",
      response.status
    );

    console.log(
      "Verify User Raw Response:",
      rawText
    );

    if (!response.ok) {
      throw new Error(
        `User API ตอบกลับ HTTP ${response.status}`
      );
    }

    let result;

    try {
      result =
        JSON.parse(rawText);
    } catch (parseError) {
      throw new Error(
        "User API ไม่ได้ส่งข้อมูลกลับมาเป็น JSON"
      );
    }

    if (
      !result.success ||
      !result.valid ||
      !result.passport
    ) {
      throw new Error(
        result.message ||
        "ไม่พบข้อมูลพนักงานจาก QR Code"
      );
    }

    scannedUser =
      result.passport;

    renderScannedUser();

    showSystemMessage(
      "ตรวจสอบ Green Passport สำเร็จ",
      "success"
    );

  } catch (error) {
    console.error(
      "Verify User Error:",
      error
    );

    scannedToken = "";
    scannedUser = null;

    showSystemMessage(
      error.message ||
      "ตรวจสอบ Green Passport ไม่สำเร็จ",
      "error"
    );

  } finally {
    isProcessingScan = false;
  }
}


// ======================================================
// RENDER SCANNED USER
// ======================================================

function renderScannedUser() {
  if (!scannedUser) {
    return;
  }

  const userResultCard =
    document.getElementById(
      "userResultCard"
    );

  const transactionCard =
    document.getElementById(
      "transactionCard"
    );

  userResultCard?.classList.remove(
    "hidden"
  );

  transactionCard?.classList.remove(
    "hidden"
  );

  setText(
    "scannedUserName",
    scannedUser.name || "-"
  );

  setText(
    "scannedEmployeeId",
    scannedUser.employeeId || "-"
  );

  setText(
    "scannedDivision",
    scannedUser.division ||
    scannedUser.department ||
    "-"
  );

  setText(
    "scannedGreenScore",
    formatNumber(
      scannedUser.greenScore
    )
  );

  updateProgress(4);

  userResultCard?.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}


// ======================================================
// TRANSACTION SUBMISSION
// ต้องมี doPost action=addTransaction ใน User API
// ======================================================

async function submitTransaction() {
  hideTransactionMessage();

  if (!selectedEvent) {
    showTransactionMessage(
      "กรุณาเลือกกิจกรรม",
      "error"
    );

    return;
  }

  if (
    !scannedToken ||
    !scannedUser
  ) {
    showTransactionMessage(
      "กรุณาสแกน Green Passport ก่อน",
      "error"
    );

    return;
  }

  const payload =
    createTransactionPayload();

  if (payload.points <= 0) {
    showTransactionMessage(
      "กรุณาระบุคะแนนมากกว่า 0",
      "error"
    );

    document
      .getElementById("checkinPoints")
      ?.focus();

    return;
  }

  const confirmButton =
    document.getElementById(
      "confirmTransactionButton"
    );

  try {
    if (
      typeof USER_API_URL === "undefined" ||
      !USER_API_URL
    ) {
      throw new Error(
        "ไม่พบ USER_API_URL กรุณาตรวจสอบ config.js"
      );
    }

    if (confirmButton) {
      confirmButton.disabled = true;
      confirmButton.textContent =
        "กำลังบันทึก...";
    }

    console.log(
      "Transaction Payload:",
      payload
    );

    const response =
      await fetch(USER_API_URL, {
        method: "POST",

        headers: {
          "Content-Type":
            "text/plain;charset=utf-8"
        },

        body:
          JSON.stringify(payload)
      });

    const rawText =
      await response.text();

    console.log(
      "Transaction HTTP Status:",
      response.status
    );

    console.log(
      "Transaction Raw Response:",
      rawText
    );

    if (!response.ok) {
      throw new Error(
        `User API ตอบกลับ HTTP ${response.status}`
      );
    }

    let result;

    try {
      result =
        JSON.parse(rawText);
    } catch (parseError) {
      throw new Error(
        "User API ไม่ได้ส่งผลการบันทึกกลับมาเป็น JSON"
      );
    }

    if (!result.success) {
      throw new Error(
        result.message ||
        "ไม่สามารถบันทึกรายการได้"
      );
    }

    if (
      result.newGreenScore !== undefined
    ) {
      scannedUser.greenScore =
        Number(result.newGreenScore) || 0;

      setText(
        "scannedGreenScore",
        formatNumber(
          scannedUser.greenScore
        )
      );
    }

    showTransactionMessage(
      createSuccessMessage(result),
      "success"
    );

    clearTransactionForm();

  } catch (error) {
    console.error(
      "Submit Transaction Error:",
      error
    );

    showTransactionMessage(
      error.message ||
      "บันทึกรายการไม่สำเร็จ",
      "error"
    );

  } finally {
    if (confirmButton) {
      confirmButton.disabled = false;
      confirmButton.textContent =
        "ยืนยันและเพิ่มคะแนน";
    }
  }
}


function createTransactionPayload() {
  return {
    action: "addTransaction",

    eventId:
      getEventId(selectedEvent),

    eventTitle:
      getEventTitle(selectedEvent),

    qrToken:
      scannedToken,

    wasteType:
      String(
        document
          .getElementById("wasteType")
          ?.value || ""
      ).trim(),

    weightKg:
      getNumberInputValue("weightKg"),

    amountBaht:
      getNumberInputValue("amountBaht"),

    points:
      getNumberInputValue("checkinPoints"),

    adminId:
      MOCK_ADMIN_ID,

    note:
      String(
        document
          .getElementById("transactionNote")
          ?.value || ""
      ).trim()
  };
}


function createSuccessMessage(result) {
  const points =
    Number(
      result.pointsAdded || 0
    );

  const newScore =
    Number(
      result.newGreenScore || 0
    );

  return (
    `บันทึกสำเร็จ เพิ่ม ${formatNumber(points)} คะแนน ` +
    `คะแนนรวมใหม่ ${formatNumber(newScore)} คะแนน`
  );
}


// ======================================================
// RESET TRANSACTION
// ======================================================

async function resetTransaction() {
  await stopScanner();

  scannedToken = "";
  scannedUser = null;
  isProcessingScan = false;

  hideResultCards();
  clearTransactionForm();

  hideSystemMessage();
  hideTransactionMessage();

  updateProgress(
    selectedEvent ? 2 : 1
  );

  updateScannerPlaceholder();

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


function clearTransactionForm() {
  setValue("wasteType", "");
  setValue("weightKg", "");
  setValue("amountBaht", "");
  setValue("checkinPoints", "");
  setValue("transactionNote", "");
}


function hideResultCards() {
  document
    .getElementById("userResultCard")
    ?.classList.add("hidden");

  document
    .getElementById("transactionCard")
    ?.classList.add("hidden");
}


// ======================================================
// PROGRESS INDICATOR
// ======================================================

function updateProgress(step) {
  const progressIds = [
    "progressEvent",
    "progressScan",
    "progressUser",
    "progressTransaction"
  ];

  progressIds.forEach(
    function (elementId, index) {
      const element =
        document.getElementById(
          elementId
        );

      if (!element) {
        return;
      }

      element.classList.toggle(
        "active",
        index + 1 <= step
      );
    }
  );
}


// ======================================================
// SYSTEM MESSAGES
// ======================================================

function showSystemMessage(
  message,
  type
) {
  const element =
    document.getElementById(
      "systemMessage"
    );

  if (!element) {
    console.log(
      "System Message:",
      message
    );

    return;
  }

  element.textContent = message;

  element.className =
    `system-message ${type}`;
}


function hideSystemMessage() {
  const element =
    document.getElementById(
      "systemMessage"
    );

  if (!element) {
    return;
  }

  element.textContent = "";
  element.className =
    "system-message hidden";
}


function showTransactionMessage(
  message,
  type
) {
  const element =
    document.getElementById(
      "transactionMessage"
    );

  if (!element) {
    console.log(
      "Transaction Message:",
      message
    );

    return;
  }

  element.textContent = message;

  element.className =
    `system-message ${type}`;
}


function hideTransactionMessage() {
  const element =
    document.getElementById(
      "transactionMessage"
    );

  if (!element) {
    return;
  }

  element.textContent = "";
  element.className =
    "system-message hidden";
}


// ======================================================
// UTILITIES
// ======================================================

function setText(elementId, value) {
  const element =
    document.getElementById(elementId);

  if (!element) {
    return;
  }

  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    element.textContent = "-";
    return;
  }

  element.textContent =
    String(value);
}


function setValue(elementId, value) {
  const element =
    document.getElementById(elementId);

  if (element) {
    element.value = value;
  }
}


function getNumberInputValue(elementId) {
  const value =
    document
      .getElementById(elementId)
      ?.value;

  const numberValue =
    Number(value);

  return Number.isFinite(numberValue)
    ? numberValue
    : 0;
}


function formatNumber(value) {
  const numberValue =
    Number(value) || 0;

  return numberValue.toLocaleString(
    "th-TH",
    {
      maximumFractionDigits: 2
    }
  );
}


function formatEventDate(value) {
  if (!value) {
    return "-";
  }

  const date =
    new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleDateString(
    "th-TH",
    {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }
  );
}


function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}