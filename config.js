// ใส่ URL Apps Script ของตัวเองตรงนี้
const APP_CONFIG = {
  useMockAI: true,          // true = ไม่ยิง AI API
  mockAutoShowGuide: false, // false = ยังให้ user กด ถูกต้อง/ไม่ถูกต้อง
  debugMode: true // true = เปิด Mode debug สำหรับ Mockup
};

const AI_API_URL = 
"https://script.google.com/macros/s/AKfycbybdC5W3t_LiHheHmP7uY2AkZOqQb2kCAsab8MJClmjAkrcVQFDGy3XXHrWR7Vr13w6/exec";
const EVENTS_API_URL =
"https://script.google.com/macros/s/AKfycbxDCJLIqEhEr07NW_Zp2ZBvvT9MZlP1MpE5ffn3DAbSNA-6iLVvNj0mLNc_sh3KKJdY/exec";