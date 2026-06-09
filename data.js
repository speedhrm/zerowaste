// ======================================================
// Waste Database: 31 Classes
// ======================================================

const wasteDatabase = {
    tumbler: {
      name: "แก้วน้ำเก็บความเย็น / สแตนเลส",
      binColor: "เหลือง", // หรือ เหลือง ตามนโยบายการแยกโลหะ
      binClass:"bin-yellow",
      binType:"ขยะรีไซเคิล",
      icon: "🥤",
      guide: [
        "แยกฝาพลาสติกและยางรองออก",
        "เทน้ำออกให้หมด",
        "แต่ส่วนใหญ่เอาไปล้างแล้วใช้ต่อได้"
      ]
    },
   
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
      binColor:"เทา",
      binClass:"bin-gray",
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
      binColor:"เทา",
      binClass:"bin-gray",
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
      binColor:"เทา",
      binClass:"bin-gray",
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
      binColor:"เทา",
      binClass:"bin-gray",
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
      binColor:"เทา",
      binClass:"bin-gray",
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
      binColor:"เทา",
      binClass:"bin-gray",
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
      binColor:"เทา",
      binClass:"bin-gray",
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
      binColor:"เทา",
      binClass:"bin-gray",
      binType:"ขยะพลังงาน",
      icon:"🔥",
      guide:[
        "แยกจากรีไซเคิลสะอาด",
        "ลดการปนเปื้อนจะช่วยได้มาก",
        "ควรรวบรวมให้เรียบร้อย"
      ]
    },

    dirty:{
      name:"ขยะเลอะ",
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
      binColor:"เทา",
      binClass:"bin-gray",
      binType:"ขยะพลังงาน",
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
    color: "เทา",
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

const speedThemes = {
  yellow: {
    title: "SYNERGY",
    color: "#F5C400",
    icon: "🤝",
    messages: [
      "สุดยอด Synergy! Action เล็กๆ วันนี้ช่วยโลกได้มาก 🌍",
      "ขอบคุณที่ร่วมสร้าง Synergy ให้โลกน่าอยู่ขึ้น 💚",
      "พลัง Synergy ของคุณวันนี้ น่ารักมาก 👭"
    ]
  },

  red: {
    title: "PROACTIVE APPROACH",
    color: "#F21643",
    icon: "⚡",
    messages: [
      "Proactive มาก! เช็กก่อนทิ้งแบบนี้โลกยิ้มเลย 😎",
      "เท่สุดๆ ใส่ใจสิ่งแวดล้อมทุกขั้นตอน 🏆",
      "การแยกขยะวันนี้ ช่วยโลกได้ทันที 🌍"
    ]
  },

  green: {
    title: "EMPATHY",
    color: "#00A859",
    icon: "❤️",
    messages: [
      "Empathy เต็มร้อย! โลกคงดีใจที่มีคุณ 🌸",
      "ขอบคุณที่ส่งต่อความใส่ใจดีๆ ให้โลก 💝",
      "แค่แยกขยะดีๆ ก็ช่วยโลกได้เยอะ 🌟"
    ]
  },

  purple: {
    title: "ENTREPRENEURSHIP",
    color: "#7030A0",
    icon: "💡",
    messages: [
      "Entrepreneurship mindset มาเต็ม 🏡",
      "คุณกำลังเพิ่มคุณค่าให้สิ่งของรอบตัว 🛠️",
      "คิดเป็นระบบ แยกเป็นขั้นตอน มือโปรเลย 📦"
    ]
  },

  blue: {
    title: "DIGITALIZATION",
    color: "#0B53A5",
    icon: "📱",
    messages: [
      "Digitalization สุดคูล! ใช้เทคโนโลยีช่วยโลก 📲",
      "รักษ์โลกแบบสมาร์ทๆ เห็นแล้วใจฟู 💻",
      "สมาร์ทฮีโร่มาแล้ว 🌍"
    ]
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
    "contaminated",
    "tissue"
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
    "oil",
    "tumbler"
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

const ecoTips = {

  hot: [
    "อากาศร้อนวันนี้ พกกระบอกน้ำส่วนตัว ลดการซื้อขวดพลาสติกแบบใช้ครั้งเดียว",
    "เติมน้ำใส่ขวดส่วนตัวก่อนออกจากโต๊ะ ช่วยลดขยะจากเครื่องดื่มบรรจุขวด",
    "ซื้อเครื่องดื่มครั้งหน้า ลองใช้แก้วส่วนตัวแทนแก้วพลาสติก",
    "อากาศร้อนแบบนี้ อย่าลืมเติมน้ำใส่แก้วส่วนตัวแทนการซื้อขวดใหม่",
    "การพกแก้วน้ำส่วนตัวทุกวัน ช่วยลดขยะพลาสติกได้มากกว่าที่คิด"
  ],

  cool: [
    "อากาศเย็นวันนี้ ลองพกแก้วส่วนตัวสำหรับกาแฟหรือชาอุ่น ๆ",
    "เครื่องดื่มร้อนในแก้วส่วนตัว ช่วยลดการใช้แก้วกระดาษแบบใช้ครั้งเดียว",
    "อากาศกำลังดี ลองเดินไปประชุมใกล้ ๆ เพื่อลดการใช้พลังงาน",
    "วันนี้เหมาะกับการออกไปทำกิจกรรมสีเขียวร่วมกับเพื่อนร่วมงาน",
    "จิบกาแฟแก้วโปรดจากแก้วส่วนตัว ช่วยลดขยะได้ทุกวัน"
  ],

  rainy: [
    "ฝนตกวันนี้ พกร่มที่ใช้ซ้ำได้ ลดการใช้เสื้อกันฝนพลาสติกแบบใช้ครั้งเดียว",
    "อย่าลืมแยกขยะเปียกออกจากขยะรีไซเคิลก่อนทิ้ง",
    "พกถุงผ้าใบเล็กสำหรับใส่ของเปียก แทนการรับถุงพลาสติกเพิ่ม",
    "ช่วงฝนตก ขยะรีไซเคิลควรเก็บให้แห้งก่อนนำไปทิ้ง",
    "ขวดน้ำและแก้วที่สะอาดช่วยให้รีไซเคิลง่ายขึ้น แม้ในวันที่ฝนตก"
  ],

  cloudy: [
    "อากาศกำลังสบาย เหมาะกับการพกแก้วส่วนตัวสำหรับเครื่องดื่มระหว่างวัน",
    "ก่อนทิ้งบรรจุภัณฑ์ อย่าลืมเทของเหลวออกก่อนทุกครั้ง",
    "ล้างแก้วก่อนทิ้ง ช่วยเพิ่มโอกาสในการรีไซเคิล",
    "วันนี้ลองชวนเพื่อนร่วมงานแยกขยะให้ถูกประเภทไปด้วยกัน",
    "งดรับหลอดเมื่อไม่จำเป็น ช่วยลดขยะชิ้นเล็กที่จัดการยาก"
  ],

  badAir: [
    "คุณภาพอากาศไม่ดี ควรลดกิจกรรมกลางแจ้งและสวมหน้ากาก",
    "AQI สูงวันนี้ ลองประชุมออนไลน์แทนการเดินทางระยะสั้น",
    "หลีกเลี่ยงการเผาขยะทุกประเภท ช่วยลดมลพิษทางอากาศ",
    "คุณภาพอากาศที่ดีเริ่มต้นจากพฤติกรรมเล็ก ๆ ของพวกเราทุกคน",
    "ร่วมกันลดการปล่อยคาร์บอนผ่านการใช้ทรัพยากรอย่างคุ้มค่า"
  ]

};