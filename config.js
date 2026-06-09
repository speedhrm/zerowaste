// ใส่ URL Apps Script ของตัวเองตรงนี้
const APP_CONFIG = {
  useMockAI: false,          // true = ไม่ยิง AI API
  mockAutoShowGuide: true, // false = ยังให้ user กด ถูกต้อง/ไม่ถูกต้อง
  debugMode: true // true = เปิด Mode debug สำหรับ Mockup
};

const AI_API_URL = 
"https://script.google.com/macros/s/AKfycbx22rQzhnLWh2e4Um-Ghc48z-gJjS1mLbUmMZ0CFWcIz1ygOUQZs3pCFDcEoj6ng5aI/exec";
const EVENTS_API_URL =
"https://script.google.com/macros/s/AKfycbxDCJLIqEhEr07NW_Zp2ZBvvT9MZlP1MpE5ffn3DAbSNA-6iLVvNj0mLNc_sh3KKJdY/exec";