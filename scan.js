// ======================================================
// Camera
// ======================================================

async function startCamera(){
  try{
    stream = await navigator.mediaDevices.getUserMedia({
      video:{ facingMode:"environment" },
      audio:false
    });

    const video = document.getElementById("video");
    video.srcObject = stream;

    await video.play();

    video.style.display = "block";
    document.getElementById("frozenImage").style.display = "none";
    document.getElementById("cameraText").classList.add("hidden");

    // 🟢 เมื่อกล้องทำงานสำเร็จ: ซ่อนปุ่มเปิดกล้อง
    if(document.getElementById("btnStartCamera")) {
      document.getElementById("btnStartCamera").style.display = "none";
    }
    
    // 🟢 ปรับปุ่มถ่ายรูปให้ยืดเต็มแถว และเปลี่ยนจากปุ่มสีอ่อน (.secondary) เป็นปุ่มสีเขียวหลักเด่นๆ
    const btnCapture = document.getElementById("btnCapture");
    if(btnCapture) {
      btnCapture.style.gridColumn = "span 2";
      btnCapture.classList.remove("secondary"); 
    }

  }catch(error){
    console.error(error);
    alert("ไม่สามารถเปิดกล้องได้ กรุณาอนุญาตกล้อง และเปิดผ่าน HTTPS");
  }
}

function captureImage(){
  const video = document.getElementById("video");
  const canvas = document.getElementById("canvas");
  const frozenImage = document.getElementById("frozenImage");

  if(!video.videoWidth){
    alert("กรุณาเปิดกล้องก่อนถ่ายรูป");
    return;
  }

  const MAX_WIDTH = 800;
  let width = video.videoWidth;
  let height = video.videoHeight;

  if(width > MAX_WIDTH){
    height = Math.round((height * MAX_WIDTH) / width);
    width = MAX_WIDTH;
  }

  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0, width, height);

  capturedImageBase64 = canvas.toDataURL("image/jpeg", 0.7);

  frozenImage.src = capturedImageBase64;
  frozenImage.style.display = "block";
  video.style.display = "none";

  // ซ่อนปุ่มเปิดกล้อง + ถ่ายรูป
  document.getElementById("btnStartCamera")?.classList.add("hidden");
  document.getElementById("btnCapture")?.classList.add("hidden");
  document.getElementById("cameraButtons")?.classList.add("hidden");

  // โชว์ปุ่ม Scan / ถ่ายใหม่
  document.getElementById("afterCaptureButtons")?.classList.remove("hidden");

  document.getElementById("resultCard")?.classList.add("hidden");
  document.getElementById("guideCard")?.classList.add("hidden");
  document.getElementById("confirmSection")?.classList.add("hidden");
  document.getElementById("manualSelect")?.classList.add("hidden");
}

function retakePhoto(){
  capturedImageBase64 = "";
  currentAIResult = null;

  document.getElementById("video").style.display = "block";
  document.getElementById("frozenImage").style.display = "none";

  // โชว์ปุ่มถ่ายรูปกลับมา
  document.getElementById("btnStartCamera")?.classList.add("hidden");
  document.getElementById("btnCapture")?.classList.remove("hidden");
  document.getElementById("cameraButtons")?.classList.remove("hidden");

  // ซ่อนปุ่ม Scan / ถ่ายใหม่
  document.getElementById("afterCaptureButtons")?.classList.add("hidden");
  document.getElementById("resultCard")?.classList.add("hidden");
  document.getElementById("guideCard")?.classList.add("hidden");
  document.getElementById("confirmSection")?.classList.add("hidden");
  document.getElementById("manualSelect")?.classList.add("hidden");
  document.getElementById("detectedItemsSection")?.classList.add("hidden");
}

function resetScan(){
  retakePhoto();
}

// ======================================================
// AI Analysis
// ======================================================

async function analyzeWaste(){
  console.clear();
  console.group("🧪 DEBUG analyzeWaste");

  function logStep(step, data){
    console.log(`✅ STEP ${step}`, data || "");
  }

  function failStep(step, error){
    console.error(`❌ FAILED AT STEP ${step}`);
    console.error(error);
    console.trace("📍 Trace location");
  }

  try{
  logStep("1: Function started");

  function debugLog(label, data){
    if(APP_CONFIG.debugMode){
      console.log(`[DEBUG] ${label}`, data || "");
    }
  }

  resetAnalyzeUI();

  // =========================
  // MOCK AI MODE
  // =========================
  if(APP_CONFIG.useMockAI){

    logStep("MOCK: Start");

    debugLog("Getting mock result");

    const mockResult = getMockAIResult();

    debugLog("Mock raw result", mockResult);

    currentAIResult = normalizeAIResult(mockResult);

    debugLog("Normalized result", currentAIResult);

    renderAIResult(currentAIResult);

    // ซ่อนปุ่ม scan หลังสแกนเสร็จ
    document.getElementById("afterCaptureButtons")
      .classList.add("hidden");

    // แสดง flow ถูกต้อง/ไม่ถูกต้อง
    if(APP_CONFIG.mockAutoShowGuide){
      showGuide(currentAIResult);
    }else{
      showConfirmSection();
    }

    logStep("MOCK: Render completed", currentAIResult);

    return;
  }

    logStep("2: Check AI_API_URL", AI_API_URL);

    if(!AI_API_URL){
      throw new Error("AI_API_URL is missing");
    }

    if(!capturedImageBase64){
      alert("กรุณาถ่ายรูปก่อน");
      return;
    }

    logStep("3: Update loading UI");

    document.getElementById("resultCard").classList.remove("hidden");
    document.getElementById("guideCard").classList.add("hidden");

    document.getElementById("wasteName").innerText = "กำลังตรวจสอบ...";
    document.getElementById("wasteName").classList.add("loading");
    document.getElementById("confidenceText").innerText = "AI is analyzing...";
    document.getElementById("reasonText").innerText = "";

    const payload = {
      action: "analyzeWaste",
      imageBase64: capturedImageBase64,
      mode: "multi-object-v2"
    };

    logStep("4: Start fetch");

    const response = await fetch(AI_API_URL, {
      method: "POST",
      mode: "cors",
      redirect: "follow",
      headers: {
        "Content-Type": "text/plain; charset=utf-8"
      },
      body: JSON.stringify(payload)
    });

    const rawText = await response.text();

    logStep("5: Raw response received", rawText);

    let result;

    try{
      result = JSON.parse(rawText);
    }catch(parseError){
      failStep("JSON.parse", parseError);
      throw new Error("API response ไม่ใช่ JSON: " + rawText.slice(0, 200));
    }

    if(result.error){
      throw new Error(result.reason || result.message || result.error || "AI error");
    }

    currentAIResult = normalizeAIResult(result);

    renderAIResult(currentAIResult);
    showConfirmSection();

    logStep("6: Completed successfully", currentAIResult);

  }catch(error){
    failStep("CATCH BLOCK", error);

    document.getElementById("resultCard").classList.remove("hidden");
    document.getElementById("wasteName").classList.remove("loading");
    document.getElementById("wasteName").innerText = "AI วิเคราะห์ไม่สำเร็จ";
    document.getElementById("confidenceText").innerText = "กรุณาเลือกประเภทเอง";
    document.getElementById("reasonText").innerText = error.message;

    showManualSelect();

  }finally{
    console.groupEnd();
  }
}

function resetAnalyzeUI(){
  document.getElementById("resultCard").classList.remove("hidden");
  document.getElementById("guideCard").classList.add("hidden");

  document.getElementById("confirmSection").classList.add("hidden");
  document.getElementById("manualSelect").classList.add("hidden");
  document.getElementById("detectedItemsSection").classList.add("hidden");
  document.getElementById("afterCaptureButtons").classList.add("hidden");

  const speedContainer = document.getElementById("speedMessageContainer");
  if(speedContainer){
    speedContainer.innerHTML = "";
  }
}


function showConfirmSection(){
  const confirmSection = document.getElementById("confirmSection");
  confirmSection.classList.remove("hidden");
  confirmSection.style.display = "block";
}

function getMockAIResult(){
  const mockList = [
    {
      confidence: 88,
      items: [
        { type: "cup" },
        { type: "lid" },
        { type: "straw" }
      ],
      reason: "เห็นแก้วน้ำพร้อมฝาและหลอด ลองแยกชิ้นส่วนก่อนทิ้งน้า"
    },
    {
      confidence: 94,
      items: [
        { type: "paper" }
      ],
      reason: "เห็นกระดาษสะอาด แยกไว้รีไซเคิลได้เลยน้า"
    },
    {
      confidence: 91,
      items: [
        { type: "foam" },
        { type: "food_waste" }
      ],
      reason: "เห็นกล่องโฟมกับเศษอาหาร แยกเศษอาหารออกก่อนทิ้งน้า"
    },
    {
      confidence: 86,
      items: [
        { type: "battery" }
      ],
      reason: "เห็นถ่านหรือแบตเตอรี่ ควรแยกไว้จัดการเฉพาะนะ"
    }
  ];

  return mockList[Math.floor(Math.random() * mockList.length)];
}

function normalizeAIResult(result){
  // รองรับทั้ง response ใหม่ items[] และ response เก่า type เดี่ยว
  if(Array.isArray(result.items) && result.items.length > 0){
    const normalizedItems = result.items.map(item => {
      const type = wasteDatabase[item.type] ? item.type : "unknown";
      const db = wasteDatabase[type];

      return {
        type,
        name:item.name || db.name,
        bin:item.bin || db.binColor,
        action:item.action || db.guide[0],
        binClass:db.binClass,
        icon:db.icon
      };
    });

    return {
      mainObject: result.mainObject || normalizedItems[0].type,
      confidence: result.confidence || 0,
      summary: result.reason || result.summary || "AI ตรวจพบขยะหลายชิ้นในภาพ",
      items: normalizedItems,
      steps: Array.isArray(result.steps) && result.steps.length > 0
        ? result.steps
        : buildStepsFromItems(normalizedItems)
    };
  }

  const type = wasteDatabase[result.type] ? result.type : "unknown";
  const db = wasteDatabase[type];

  return { mainObject:type, confidence:result.confidence || 0, summary: result.reason || result.summary || `พบ${db.name}`,
    items:[{
      type,
      name:db.name,
      bin:db.binColor,
      action:db.guide[0],
      binClass:db.binClass,
      icon:db.icon
    }],
    steps:db.guide
  };
}

function buildStepsFromItems(items){
  const steps = [];
  const seen = {};

  items.forEach(item => {
    const db = wasteDatabase[item.type] || wasteDatabase.unknown;
    const guideList = db.guide || [];

    guideList.forEach(guide => {
      if(!seen[guide] && steps.length < 5){
        seen[guide] = true;
        steps.push(guide);
      }
    });
  });

  return steps;
}

function renderAIResult(result){
  const mainDb = wasteDatabase[result.mainObject] || wasteDatabase.unknown;

  document.getElementById("wasteName").classList.remove("loading");
  document.getElementById("wasteName").innerText = mainDb.name;
  document.getElementById("confidenceText").innerText = `Confidence: ${result.confidence}%`;
  document.getElementById("reasonText").innerText = result.summary || "กรุณาตรวจสอบความถูกต้องก่อนยืนยัน";

  renderDetectedItems(result.items);

  document.getElementById("confirmSection").classList.remove("hidden");
}

function renderDetectedItems(items){
  const wrapper = document.getElementById("detectedItemsList");
  wrapper.innerHTML = "";

  items.forEach(item=>{
    const db = wasteDatabase[item.type] || wasteDatabase.unknown;

    const div = document.createElement("div");
    div.className = "detected-item";
    div.innerHTML = `
      <div class="detected-icon">${db.icon}</div>
      <div>
        <div class="detected-name">${item.name}</div>
        <div class="detected-action">${item.action}</div>
      </div>
      <div class="bin-pill ${db.binClass}">ถัง${item.bin}</div>
    `;
    wrapper.appendChild(div);
  });

  document.getElementById("detectedItemsSection").classList.remove("hidden");
}

function renderSpeedMessage(){
  const speedKeys = Object.keys(speedThemes);
  const randomKey = speedKeys[Math.floor(Math.random() * speedKeys.length)];
  const selectedTheme = speedThemes[randomKey];

  const randomMessage =
    selectedTheme.messages[
      Math.floor(Math.random() * selectedTheme.messages.length)
    ];

  const speedContainer = document.getElementById("speedMessageContainer");

  if(!speedContainer){
    return;
  }

  speedContainer.innerHTML = `
    <div 
      class="speed-message-full"
      style="background:${selectedTheme.color}"
    >
      <div class="speed-full-header">
        <div class="speed-full-badge" style="background:${selectedTheme.color}">
          ${selectedTheme.icon}
        </div>

        <div>
          <div class="speed-full-title">
            <span class="speed-first-letter">
              ${selectedTheme.title}
          </div>

          <div class="speed-full-text">
            ${randomMessage}
          </div>
        </div>
      </div>
    </div>
  `;
}

function confirmAIResult(){
  if(!currentAIResult){
    alert("ยังไม่มีผลจาก AI");
    return;
  }

  showGuide(currentAIResult);
}

function showManualSelect(){
  document.getElementById("manualSelect").classList.remove("hidden");
}

function showGuide(result){
  document.getElementById("afterCaptureButtons").classList.add("hidden");
  document.getElementById("confirmSection").classList.add("hidden");
  document.getElementById("manualSelect").classList.add("hidden");

  const stepList = document.getElementById("stepList");
  const binSummaryList = document.getElementById("binSummaryList");

  stepList.innerHTML = "";
  binSummaryList.innerHTML = "";

  result.steps.forEach(step=>{
    const li = document.createElement("li");
    li.textContent = String(step).replace(/^\d+\.\s*/, "");
    stepList.appendChild(li);
  });

  const recommendedBins = getRecommendedBins(result.items, 3);

  recommendedBins.forEach(bin=>{
    const div = document.createElement("div");
    div.className = "bin-summary-card bin-image-card";

    div.innerHTML = `
      <img class="bin-summary-img" src="${bin.image}" alt="${bin.label}">

      <div class="bin-summary-info text-${bin.color}">
        <strong>${bin.label}</strong>
        <span>ถังสี${bin.color}</span>
        <small>${bin.examples.join(", ")}</small>
      </div>
    `;

    binSummaryList.appendChild(div);
  });

  renderSpeedMessage();

  document.getElementById("guideCard").classList.remove("hidden");

  addScanMissionCount();
}
  
// ======================================================
// Manual Options
// ======================================================

function renderManualOptions(){
  const select = document.getElementById("manualWaste");
  select.innerHTML = `<option value="">เลือกประเภทขยะเอง</option>`;

  Object.keys(wasteDatabase).forEach(key=>{
    const option = document.createElement("option");
    option.value = key;
    option.textContent = `${wasteDatabase[key].name}`;
    select.appendChild(option);
  });
}
