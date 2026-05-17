// ======================================================
// Zero Waste AI Scanner V2
// - AI Camera and Events are separated into 2 tabs
// - AI Camera supports multi-object result
// - Events supports upcoming / future / past / cancelled
// ======================================================

// ใส่ URL Apps Script ของตัวเองตรงนี้
const AI_API_URL = 
"https://script.google.com/macros/s/AKfycbyCRU2h_NDYNYzMNtESHn2hWAV18Umo5P1pkyeQkT2DzAimk2gcSm8SAxlDu1YguLoc/exec";
const EVENTS_API_URL =
"https://script.google.com/macros/s/AKfycbxDCJLIqEhEr07NW_Zp2ZBvvT9MZlP1MpE5ffn3DAbSNA-6iLVvNj0mLNc_sh3KKJdY/exec";

let capturedImageBase64 = "";
let currentAIResult = null;
let stream = null;
let currentEventFilter = "upcoming";

// ======================================================
// Waste Database: 30 Classes
// ======================================================

const wasteDatabase = {
    food_waste:{
      name:"เศษอาหาร",
      binColor:"เขียว",
      binClass:"bin-green",
      binType:"ขยะอินทรีย์",
      icon:"🍛",
      guide:[
        "แยกออกจากบรรจุภัณฑ์",
        "เทของเหลวส่วนเกินออก",
        "สามารถนำไปทำปุ๋ยได้"
      ]
    },

    liquid:{
      name:"ของเหลว",
      binColor:"เขียว",
      binClass:"bin-green",
      binType:"ขยะอินทรีย์ / ของเหลว",
      icon:"💧",
      guide:[
        "เทออกก่อนทิ้ง",
        "หลีกเลี่ยงการปนเปื้อนรีไซเคิล",
        "แยกภาชนะตามประเภทวัสดุ"
      ]
    },

    bottle:{
      name:"ขวดรีไซเคิล",
      binColor:"เหลือง",
      binClass:"bin-yellow",
      binType:"ขยะรีไซเคิล",
      icon:"🧴",
      guide:[
        "เทของเหลวออกก่อน",
        "บีบให้เล็กลงถ้าทำได้",
        "แยกฝาจะช่วยรีไซเคิลได้ง่ายขึ้น"
      ]
    },

    cup:{
      name:"แก้วพลาสติก",
      binColor:"เหลือง",
      binClass:"bin-yellow",
      binType:"ขยะรีไซเคิล",
      icon:"🥤",
      guide:[
        "เทเครื่องดื่มและน้ำแข็งออก",
        "แยกฝาและหลอดออกก่อน",
        "ลดคราบเครื่องดื่มก่อนทิ้งจะดีที่สุด"
      ]
    },

    lid:{
      name:"ฝา",
      binColor:"เหลือง",
      binClass:"bin-yellow",
      binType:"ขยะรีไซเคิล",
      icon:"⭕",
      guide:[
        "แยกออกจากขวดหรือแก้ว",
        "ทำความสะอาดเบื้องต้นถ้าทำได้",
        "ชิ้นเล็กสามารถรวบรวมก่อนทิ้งได้"
      ]
    },

    can:{
      name:"กระป๋อง",
      binColor:"เหลือง",
      binClass:"bin-yellow",
      binType:"ขยะรีไซเคิล",
      icon:"🥫",
      guide:[
        "เทของเหลวหรือเศษอาหารออก",
        "ล้างด้านในถ้าทำได้",
        "บีบให้แบนเพื่อลดพื้นที่"
      ]
    },

    paper:{
      name:"กระดาษ",
      binColor:"เหลือง",
      binClass:"bin-yellow",
      binType:"ขยะรีไซเคิล",
      icon:"📄",
      guide:[
        "เอาลวดหรือคลิปออกก่อน",
        "หลีกเลี่ยงกระดาษเปียกหรือมีคราบอาหาร",
        "พับหรือรวบรวมให้เรียบร้อย"
      ]
    },

    box:{
      name:"กล่องกระดาษ",
      binColor:"เหลือง",
      binClass:"bin-yellow",
      binType:"ขยะรีไซเคิล",
      icon:"📦",
      guide:[
        "แกะเทปหรือสติ๊กเกอร์ออกถ้าทำได้",
        "พับให้แบนเพื่อลดพื้นที่",
        "แยกจากกล่องที่เปียกหรือเปื้อน"
      ]
    },

    plastic:{
      name:"พลาสติกสะอาด",
      binColor:"เหลือง",
      binClass:"bin-yellow",
      binType:"ขยะรีไซเคิล",
      icon:"🛍️",
      guide:[
        "นำเศษอาหารออกก่อน",
        "พลาสติกสะอาดรีไซเคิลได้ง่ายกว่า",
        "รวบรวมเป็นชิ้นเดียวกันได้"
      ]
    },

    glass:{
      name:"แก้ว / ขวดแก้ว",
      binColor:"เหลือง",
      binClass:"bin-yellow",
      binType:"ขยะรีไซเคิล",
      icon:"🍾",
      guide:[
        "เทของเหลวออกก่อน",
        "ล้างให้สะอาดถ้าทำได้",
        "หากแตกควรห่อก่อนทิ้ง"
      ]
    },

    oil:{
      name:"น้ำมันใช้แล้ว",
      binColor:"เหลือง",
      binClass:"bin-yellow",
      binType:"ขยะรีไซเคิลเฉพาะจุด",
      icon:"🛢️",
      guide:[
        "ปล่อยให้น้ำมันเย็นก่อน",
        "เก็บในภาชนะปิดสนิท",
        "สามารถนำไปรีไซเคิลได้"
      ]
    },

    sachet:{
      name:"ซอง / ฟอยล์",
      binColor:"ขาว",
      binClass:"bin-white",
      binType:"ขยะพลังงาน",
      icon:"🍫",
      guide:[
        "เทเศษอาหารออกก่อน",
        "พับหรือรวบให้เล็กลง",
        "รีไซเคิลได้ค่อนข้างยาก"
      ]
    },

    foam:{
      name:"โฟม",
      binColor:"ขาว",
      binClass:"bin-white",
      binType:"ขยะพลังงาน",
      icon:"🍱",
      guide:[
        "แยกเศษอาหารออกก่อน",
        "หลีกเลี่ยงปะปนกับรีไซเคิล",
        "ลดการใช้ได้จะดีที่สุด"
      ]
    },

    straw:{
      name:"หลอด",
      binColor:"ขาว",
      binClass:"bin-white",
      binType:"ขยะพลังงาน",
      icon:"🥤",
      guide:[
        "แยกออกจากแก้วก่อน",
        "ชิ้นเล็กควรรวบรวมก่อนทิ้ง",
        "ลดการใช้ช่วยลดขยะได้มาก"
      ]
    },

    mask:{
      name:"หน้ากาก / ATK / แผงยา",
      binColor:"ขาว",
      binClass:"bin-white",
      binType:"ขยะพลังงาน",
      icon:"😷",
      guide:[
        "แยกจากรีไซเคิลเสมอ",
        "พับหรือห่อก่อนทิ้ง",
        "หลีกเลี่ยงการสัมผัสโดยตรง"
      ]
    },

    paper_cup:{
      name:"แก้วกระดาษ",
      binColor:"ขาว",
      binClass:"bin-white",
      binType:"ขยะพลังงาน",
      icon:"☕",
      guide:[
        "เทเครื่องดื่มออกก่อน",
        "แยกฝาพลาสติกถ้ามี",
        "คราบเครื่องดื่มทำให้รีไซเคิลยากขึ้น"
      ]
    },

    cutlery:{
      name:"ช้อนส้อมใช้แล้ว",
      binColor:"ขาว",
      binClass:"bin-white",
      binType:"ขยะพลังงาน",
      icon:"🍴",
      guide:[
        "นำเศษอาหารออกก่อน",
        "รวบรวมหลายชิ้นเข้าด้วยกันได้",
        "แบบใช้ซ้ำช่วยลดขยะได้มาก"
      ]
    },

    snack_wrapper:{
      name:"พลาสติกห่อขนม",
      binColor:"ขาว",
      binClass:"bin-white",
      binType:"ขยะพลังงาน",
      icon:"🍬",
      guide:[
        "เทเศษอาหารออกก่อน",
        "พับให้เล็กลงได้",
        "รีไซเคิลได้ค่อนข้างยาก"
      ]
    },

    contaminated:{
      name:"ขยะเผาได้ปนเปื้อน",
      binColor:"ขาว",
      binClass:"bin-white",
      binType:"ขยะพลังงาน",
      icon:"🔥",
      guide:[
        "แยกจากรีไซเคิลสะอาด",
        "ลดการปนเปื้อนจะช่วยได้มาก",
        "ควรรวบรวมให้เรียบร้อย"
      ]
    },

    dirty:{
      name:"ขยะเลอะจัด",
      binColor:"น้ำเงิน",
      binClass:"bin-blue",
      binType:"ขยะทั่วไป",
      icon:"🗑️",
      guide:[
        "หลีกเลี่ยงปะปนกับรีไซเคิล",
        "ห่อก่อนทิ้งจะดีที่สุด",
        "ลดกลิ่นและการรั่วซึมได้"
      ]
    },

    tissue:{
      name:"ทิชชู่",
      binColor:"น้ำเงิน",
      binClass:"bin-blue",
      binType:"ขยะทั่วไป",
      icon:"🧻",
      guide:[
        "ไม่สามารถรีไซเคิลได้",
        "หลีกเลี่ยงปะปนกับกระดาษสะอาด",
        "รวบรวมก่อนทิ้งได้"
      ]
    },

    adhesive:{
      name:"เทป / สติ๊กเกอร์",
      binColor:"น้ำเงิน",
      binClass:"bin-blue",
      binType:"ขยะทั่วไป",
      icon:"🏷️",
      guide:[
        "ลอกออกจากกล่องถ้าทำได้",
        "รีไซเคิลได้ค่อนข้างยาก",
        "ชิ้นเล็กควรรวบรวมก่อนทิ้ง"
      ]
    },

    ceramic:{
      name:"เซรามิก",
      binColor:"น้ำเงิน",
      binClass:"bin-blue",
      binType:"ขยะทั่วไป",
      icon:"🍽️",
      guide:[
        "หากแตกควรห่อก่อน",
        "หลีกเลี่ยงการปะปนกับแก้วรีไซเคิล",
        "ระวังของมีคม"
      ]
    },

    textile:{
      name:"ผ้า / เสื้อผ้า",
      binColor:"น้ำเงิน",
      binClass:"bin-blue",
      binType:"ขยะทั่วไป",
      icon:"👕",
      guide:[
        "เสื้อผ้าสภาพดีสามารถบริจาคได้",
        "แยกผ้าเปียกออกก่อน",
        "การใช้ซ้ำช่วยลดขยะได้มาก"
      ]
    },

    rubber:{
      name:"ยาง",
      binColor:"น้ำเงิน",
      binClass:"bin-blue",
      binType:"ขยะทั่วไป",
      icon:"🩴",
      guide:[
        "แยกออกจากรีไซเคิลทั่วไป",
        "บางชิ้นมีวัสดุหลายประเภท",
        "หลีกเลี่ยงการเผา"
      ]
    },

    toy:{
      name:"ของเล่น",
      binColor:"น้ำเงิน",
      binClass:"bin-blue",
      binType:"ขยะทั่วไป",
      icon:"🧸",
      guide:[
        "ของเล่นสภาพดีสามารถส่งต่อได้",
        "ถอดแบตเตอรี่ออกก่อนถ้ามี",
        "แยกชิ้นส่วนได้จะดีกว่า"
      ]
    },

    battery:{
      name:"ถ่าน / แบตเตอรี่",
      binColor:"แดง",
      binClass:"bin-red",
      binType:"ขยะอันตราย",
      icon:"🔋",
      guide:[
        "แยกออกจากขยะทั่วไปเสมอ",
        "หลีกเลี่ยงความร้อนหรือความชื้น",
        "เก็บรวมไว้ส่งจุดรับเฉพาะ"
      ]
    },

    electronic:{
      name:"E-Waste",
      binColor:"แดง",
      binClass:"bin-red",
      binType:"ขยะอันตราย",
      icon:"🔌",
      guide:[
        "ถอดแบตเตอรี่ออกถ้ามี",
        "เก็บให้แห้งก่อนส่งต่อ",
        "อุปกรณ์หลายชิ้นสามารถรีไซเคิลได้"
      ]
    },

    chemical:{
      name:"สารเคมี",
      binColor:"แดง",
      binClass:"bin-red",
      binType:"ขยะอันตราย",
      icon:"⚠️",
      guide:[
        "ปิดฝาให้แน่น",
        "หลีกเลี่ยงการรั่วซึม",
        "ควรจัดการแยกเฉพาะ"
      ]
    },

    light:{
      name:"หลอดไฟ",
      binColor:"แดง",
      binClass:"bin-red",
      binType:"ขยะอันตราย",
      icon:"💡",
      guide:[
        "ห่อก่อนทิ้งถ้าแตกง่าย",
        "หลีกเลี่ยงแรงกระแทก",
        "ควรส่งจุดรับเฉพาะ"
      ]
    },

    unknown:{
      name:"ไม่แน่ใจ",
      binColor:"น้ำเงิน",
      binClass:"bin-blue",
      binType:"อื่นๆ",
      icon:"❓",
      guide:[
        "ตรวจสอบประเภทก่อนทิ้ง",
        "หลีกเลี่ยงปะปนกับรีไซเคิล",
        "แยกไว้ก่อนจะดีที่สุด"
      ]
    }
}

const binImageDatabase = {
  compostable: {
    label: "ขยะอินทรีย์",
    color: "เขียว",
    image: "images/compostable.png"
  },
  energy: {
    label: "ขยะพลังงาน",
    color: "ขาว",
    image: "images/energy.png"
  },
  ewaste: {
    label: "ขยะอิเล็กทรอนิกส์",
    color: "แดง",
    image: "images/ewaste.png"
  },
  general: {
    label: "ขยะทั่วไป",
    color: "น้ำเงิน",
    image: "images/general.png"
  },
  hazard: {
    label: "ขยะอันตราย",
    color: "แดง",
    image: "images/hazard.png"
  },
  recycle: {
    label: "ขยะรีไซเคิล",
    color: "เหลือง",
    image: "images/recycle.png"
  }
};

function getBinKeyByWasteType(type){
  if(["food_waste", "liquid"].includes(type)){
    return "compostable";
  }

  if([
    "sachet",
    "foam",
    "straw",
    "mask",
    "paper_cup",
    "cutlery",
    "snack_wrapper",
    "contaminated"
  ].includes(type)){
    return "energy";
  }

  if(["electronic"].includes(type)){
    return "ewaste";
  }

  if(["battery", "chemical", "light"].includes(type)){
    return "hazard";
  }

  if([
    "bottle",
    "cup",
    "lid",
    "can",
    "paper",
    "box",
    "plastic",
    "glass",
    "oil"
  ].includes(type)){
    return "recycle";
  }

  return "general";
}

function getRecommendedBins(items, maxBins = 3){
  const score = {};
  const examples = {};

  items.forEach(item => {
    const binKey = getBinKeyByWasteType(item.type);
    const db = wasteDatabase[item.type] || wasteDatabase.unknown;

    score[binKey] = (score[binKey] || 0) + 1;

    if(!examples[binKey]){
      examples[binKey] = [];
    }

    examples[binKey].push(db.name);
  });

  return Object.keys(score)
    .sort((a, b) => score[b] - score[a])
    .slice(0, maxBins)
    .map(binKey => ({
      key: binKey,
      ...binImageDatabase[binKey],
      count: score[binKey],
      examples: examples[binKey]
    }));
}

// ======================================================
// Event Database
// ======================================================

let eventDatabase = [];

// ======================================================
// Tabs
// ======================================================

function showTab(tab){

  document.getElementById("aiPage")
    .classList.toggle("active", tab === "ai");

  document.getElementById("eventsPage")
    .classList.toggle("active", tab === "events");

  document.getElementById("aiTabBtn")
    .classList.toggle("active", tab === "ai");

  document.getElementById("eventTabBtn")
    .classList.toggle("active", tab === "events");

  if(tab === "events"){
    loadEventsFromSheet();
  }

}

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

  }catch(error){
    console.error(error);
    alert("ไม่สามารถเปิดกล้องได้ กรุณาอนุญาตกล้อง และเปิดผ่าน HTTPS");
  }
}

function captureImage(){
  const video = document.getElementById("video");
  const canvas = document.getElementById("canvas");
  const frozenImage = document.getElementById("frozenImage");

  if(!video.srcObject){
    alert("กรุณาเปิดกล้องก่อน");
    return;
  }

  if(video.videoWidth === 0 || video.videoHeight === 0){
    alert("กล้องยังโหลดไม่เสร็จ กรุณารอสักครู่แล้วกดถ่ายรูปอีกครั้ง");
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

  document.getElementById("cameraButtons").classList.add("hidden");
  document.getElementById("afterCaptureButtons").classList.remove("hidden");
}

function retakePhoto(){
  capturedImageBase64 = "";
  currentAIResult = null;

  document.getElementById("video").style.display = "block";
  document.getElementById("frozenImage").style.display = "none";

  document.getElementById("cameraButtons").classList.remove("hidden");
  document.getElementById("afterCaptureButtons").classList.add("hidden");
  document.getElementById("resultCard").classList.add("hidden");
  document.getElementById("guideCard").classList.add("hidden");
  document.getElementById("manualSelect").classList.add("hidden");
  document.getElementById("detectedItemsSection").classList.add("hidden");
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

    logStep("2: Check AI_API_URL", AI_API_URL);

    if(!AI_API_URL){
      throw new Error("AI_API_URL is missing");
    }

    logStep("3: Check capturedImageBase64", {
      exists: !!capturedImageBase64,
      length: capturedImageBase64 ? capturedImageBase64.length : 0,
      preview: capturedImageBase64 ? capturedImageBase64.slice(0, 50) : null
    });

    document.getElementById("confirmSection").classList.add("hidden");
    document.getElementById("manualSelect").classList.add("hidden");
    document.getElementById("detectedItemsSection").classList.add("hidden");

    if(!capturedImageBase64){
      alert("กรุณาถ่ายรูปก่อน");
      return;
    }

    logStep("4: Update loading UI");

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

    logStep("5: Payload prepared", {
      action: payload.action,
      mode: payload.mode,
      imageBase64Length: payload.imageBase64.length
    });

    logStep("6: Start fetch");

    // 🟢 แก้ไขปรับปรุงบล็อก fetch ฝั่งหน้าบ้านให้ระบุโหมดเข้มงวด
    const response = await fetch(AI_API_URL, {
      method: "POST",
      // เพิ่มโหมดเหล่านี้เพื่อบังคับบราวเซอร์ให้ส่ง POST ตามคำสั่งเดิมแม้จะโดน Google Redirect
      mode: "cors", 
      redirect: "follow",
      headers: {
        "Content-Type": "text/plain; charset=utf-8"
      },
      body: JSON.stringify(payload)
    });

    logStep("7: Fetch completed", {
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
      url: response.url
    });

    const rawText = await response.text();

    logStep("8: Raw response received", rawText);

    let result;

    try{
      result = JSON.parse(rawText);
    }catch(parseError){
      failStep("9: JSON.parse", parseError);
      throw new Error("API response ไม่ใช่ JSON: " + rawText.slice(0, 200));
    }

    logStep("9: JSON parsed", result);

    if(result.error){
      failStep("10: API returned error", result);
      throw new Error(result.reason || result.message || result.error || "AI error");
    }

    logStep("11: Before normalizeAIResult");

    currentAIResult = normalizeAIResult(result);

    logStep("12: After normalizeAIResult", currentAIResult);

    logStep("13: Before renderAIResult");

    renderAIResult(currentAIResult);

    logStep("14: Completed successfully");

  }catch(error){
    failStep("CATCH BLOCK", error);

    document.getElementById("wasteName").classList.remove("loading");
    document.getElementById("wasteName").innerText = "AI วิเคราะห์ไม่สำเร็จ";
    document.getElementById("confidenceText").innerText = "กรุณาเลือกประเภทเอง";
    document.getElementById("reasonText").innerText = error.message;

    showManualSelect();

  }finally{
    console.groupEnd();
  }
}

// async function analyzeWaste(){
//   document.getElementById("confirmSection").classList.add("hidden");
//   document.getElementById("manualSelect").classList.add("hidden");
//   document.getElementById("detectedItemsSection").classList.add("hidden");

//   if(!capturedImageBase64){
//     alert("กรุณาถ่ายรูปก่อน");
//     return;
//   }

//   document.getElementById("resultCard").classList.remove("hidden");
//   document.getElementById("guideCard").classList.add("hidden");

//   document.getElementById("wasteName").innerText = "กำลังตรวจสอบ...";
//   document.getElementById("wasteName").classList.add("loading");
//   document.getElementById("confidenceText").innerText = "AI is analyzing...";
//   document.getElementById("reasonText").innerText = "";

//   try{
//     const response = await fetch(AI_API_URL,{
//       method:"POST",
//       body:JSON.stringify({
//         action:"analyzeWaste",
//         imageBase64:capturedImageBase64,
//         mode:"multi-object-v2"
//       })
//     });

//     const result = await response.json();

//     if(result.error){
//       throw new Error(result.reason || result.message || result.error || "AI error");
//     }

//     currentAIResult = normalizeAIResult(result);
//     renderAIResult(currentAIResult);

//   }catch(error){
//     console.error(error);

//     document.getElementById("wasteName").classList.remove("loading");
//     document.getElementById("wasteName").innerText = "AI วิเคราะห์ไม่สำเร็จ";
//     document.getElementById("confidenceText").innerText = "กรุณาเลือกประเภทเอง";
//     document.getElementById("reasonText").innerText = error.message;

//     showManualSelect();
//   }
// }

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

function useManualResult(){
  const selected = document.getElementById("manualWaste").value;

  if(!selected){
    alert("กรุณาเลือกประเภทขยะ");
    return;
  }

  const db = wasteDatabase[selected];

  currentAIResult = {
    mainObject:selected,
    confidence:100,
    summary:"ผู้ใช้งานเลือกประเภทขยะเอง",
    items:[{
      type:selected,
      name:db.name,
      bin:db.binColor,
      action:db.guide[0],
      binClass:db.binClass,
      icon:db.icon
    }],
    steps:db.guide
  };

  renderAIResult(currentAIResult);
  showGuide(currentAIResult);
}

function showGuide(result){
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
  
  document.getElementById("guideCard").classList.remove("hidden");
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

async function loadEventsFromSheet(){
  const list = document.getElementById("eventList");

  list.innerHTML = `<p class="small">กำลังโหลดกิจกรรม...</p>`;

  try{
    const response = await fetch(EVENTS_API_URL,{
      method:"POST",
      body:JSON.stringify({
        action:"getEvents"
      })
    });

    const result = await response.json();

    if(result.error){
      throw new Error(result.message || "โหลดกิจกรรมไม่สำเร็จ");
    }

    eventDatabase = result.events || [];
    renderEvents();

  }catch(error){
    console.error(error);

    list.innerHTML =
      `<p class="small">โหลดกิจกรรมไม่สำเร็จ: ${error.message}</p>`;
  }
}

// ======================================================
// Events
// ======================================================

function setEventFilter(filter, index){
  currentEventFilter = filter;

  document.querySelectorAll(".filter-btn").forEach(btn=>{
    btn.classList.remove("active");
  });

  const buttons = document.querySelectorAll(".filter-btn");
  buttons[index]?.classList.add("active");

  const indicator = document.getElementById("filterIndicator");
  indicator.style.transform = `translateX(${index * 100}%)`;

  renderEvents();
}

function getEventComputedStatus(event){
  return event.status || "future";
}

function convertMs(ms){
  const secondsTotal = Math.max(0, Math.floor(ms / 1000));

  return {
    days:Math.floor(secondsTotal / 86400),
    hours:Math.floor((secondsTotal % 86400) / 3600),
    minutes:Math.floor((secondsTotal % 3600) / 60),
    seconds:secondsTotal % 60
  };
}

function getEventTiming(event){
  const now = new Date();
  const start = new Date(`${event.date}T${event.startTime || "00:00"}:00`);
  const end = new Date(`${event.date}T${event.endTime || "23:59"}:00`);

  if(now < start){
    return {
      state:"before",
      ...convertMs(start - now)
    };
  }

  if(now >= start && now <= end){
    return {
      state:"live",
      ...convertMs(end - now)
    };
  }

  return {
    state:"ended",
    days:0,
    hours:0,
    minutes:0,
    seconds:0
  };
}

function renderCountdown(event){
  const timing = getEventTiming(event);

  if(timing.state === "live"){
    return `
      <div class="live-banner">
        🟢 กำลังจัดกิจกรรมอยู่ตอนนี้
        <span>
          เหลือเวลา ${timing.hours} ชม.
          ${timing.minutes} นาที
          ${timing.seconds} วิ
        </span>
      </div>
    `;
  }

  if(timing.state === "ended"){
    return `
      <div class="ended-banner">
        ✅ กิจกรรมสิ้นสุดแล้ว
      </div>
    `;
  }

  return `
    <div class="countdown">
      <div class="countdown-box">
        <div class="countdown-value">${timing.days}</div>
        <div class="countdown-label">วัน</div>
      </div>

      <div class="countdown-box">
        <div class="countdown-value">${timing.hours}</div>
        <div class="countdown-label">ชั่วโมง</div>
      </div>

      <div class="countdown-box">
        <div class="countdown-value">${timing.minutes}</div>
        <div class="countdown-label">นาที</div>
      </div>

      <div class="countdown-box">
        <div class="countdown-value">${timing.seconds}</div>
        <div class="countdown-label">วินาที</div>
      </div>
    </div>
  `;
}

function formatThaiDate(dateString){
  const date = new Date(dateString);

  return date.toLocaleDateString("th-TH", {
    day:"numeric",
    month:"short",
    year:"numeric"
  });
}

function renderEvents(){
  const list = document.getElementById("eventList");
  list.innerHTML = "";

  let events = eventDatabase
  .map(event => ({
    ...event,
    computedStatus:getEventComputedStatus(event)
  }))
  .filter(event => event.computedStatus === currentEventFilter);

if(currentEventFilter === "past"){
  // ใหม่สุดขึ้นก่อน
  events.sort((a,b)=>
    new Date(b.date) - new Date(a.date)
  );
}else{
  // Upcoming/Future เรียงใกล้สุดก่อน
  events.sort((a,b)=>
    new Date(a.date) - new Date(b.date)
  );
}

  if(events.length === 0){
    list.innerHTML = `<p class="small">ยังไม่มีกิจกรรมในหมวดนี้</p>`;
    return;
  }

  events.forEach(event=>{
    const card = document.createElement("div");
    card.className = "event-card";

    if(event.computedStatus === "past"){
      card.innerHTML = renderPastEvent(event);
    }else{
      card.innerHTML = renderActiveEvent(event);
    }

    list.appendChild(card);
  });
}

function renderActiveEvent(event){
  const statusText = {
    upcoming:"Upcoming",
    future:"Future",
    cancelled:"Cancelled"
  }[event.computedStatus] || "Future";

  const countdownHtml =
    event.computedStatus === "cancelled"
      ? ""
      : renderCountdown(event);

  const mapButton =
  event.computedStatus !== "cancelled" && event.mapUrl
    ? `
      <a class="map-btn"
         href="${event.mapUrl}"
         target="_blank">

        📍 เปิด Google Maps

      </a>
    `
    : "";
    
  return `
    <div class="event-top">
      <div>
        <div class="event-title">${event.title}</div>
        <div class="event-meta">
          ${formatThaiDate(event.date)} | ${event.startTime} - ${event.endTime}
        </div>
        <div class="event-meta">📍 ${event.location}</div>
      </div>

      <span class="status-pill status-${event.computedStatus}">
        ${statusText}
      </span>
    </div>

    ${countdownHtml}

    ${mapButton}

    <div class="event-note">${event.detail}</div>
  `;
}

function renderPastEvent(event){
  return `
    <div class="event-top">
      <div>
        <div class="event-title">✅ ${event.title}</div>
        <div class="event-meta">${formatThaiDate(event.date)} | ${event.location}</div>
      </div>

      <span class="status-pill status-past">Past</span>
    </div>

    <div class="impact-row">
      <div class="impact-card impact-recycle">
        <div class="impact-icon">♻️</div>
        <div class="impact-value">${event.wasteCollectedKg || 0}</div>
        <div class="impact-unit">Kg.</div>
        <div class="impact-label">ขยะที่ส่งไปรีไซเคิล</div>
      </div>

      <div class="impact-card impact-carbon">
        <div class="impact-icon">🌍</div>
        <div class="impact-value">${event.co2ReducedKg || 0}</div>
        <div class="impact-unit">Kg.CO₂eq</div>
        <div class="impact-label">คาร์บอนที่ลดได้</div>
      </div>

      <div class="impact-card impact-tree">
        <div class="impact-icon">🌳</div>
        <div class="impact-value">${event.treeEquivalent || 0}</div>
        <div class="impact-unit">ต้น</div>
        <div class="impact-label">เทียบเท่าการปลูกต้นไม้</div>
      </div>
    </div>

    <div class="event-note">${event.detail}</div>
  `;
}

// ======================================================
// Init
// ======================================================

renderManualOptions();
loadEventsFromSheet();

setInterval(()=>{
  if(document.getElementById("eventsPage")?.classList.contains("active")){
    renderEvents();
  }
},1000);