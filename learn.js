// =========================
// MATCH GAME FULL FUNCTION
// =========================

const matchGameItems = [
  { name:"ขวดน้ำพลาสติก", icon:"🧴", answer:"recycle", difficulty:"easy", tip:"เทน้ำออก แยกฝา แล้วบีบขวดก่อนทิ้ง" },
  { name:"กระดาษสะอาด", icon:"📄", answer:"recycle", difficulty:"easy", tip:"กระดาษสะอาดและแห้งสามารถรีไซเคิลได้" },
  { name:"กระป๋อง", icon:"🥫", answer:"recycle", difficulty:"easy", tip:"เทของเหลวออกก่อน แล้วบีบให้แบนได้" },
  { name:"เศษอาหาร", icon:"🍌", answer:"organic", difficulty:"easy", tip:"แยกออกจากบรรจุภัณฑ์ก่อนทิ้ง" },
  { name:"กล่องลัง", icon:"📦", answer:"recycle", difficulty:"easy", tip:"แกะเทปออกและพับให้แบนก่อนทิ้ง" },

  { name:"โฟมใส่อาหาร", icon:"🍱", answer:"energy", difficulty:"easy", tip:"โฟมเปื้อนอาหารรีไซเคิลยาก ควรแยกเป็นขยะพลังงาน" },
  { name:"แบตเตอรี่", icon:"🔋", answer:"hazard", difficulty:"easy", tip:"ต้องแยกเป็นขยะอันตรายเสมอ" },
  { name:"หลอดไฟ", icon:"💡", answer:"hazard", difficulty:"easy", tip:"ควรห่อก่อนทิ้งและส่งจุดรับเฉพาะ" },
  { name:"แก้วพลาสติก", icon:"🥤", answer:"recycle", difficulty:"easy", tip:"เทน้ำแข็งและเครื่องดื่มออกก่อน" },
  { name:"ถุงพลาสติกสะอาด", icon:"🛍️", answer:"recycle", difficulty:"easy", tip:"ถ้าสะอาดสามารถเข้าสู่กลุ่มรีไซเคิลได้" },

  { name:"กล่องพิซซ่าเปื้อนน้ำมัน", icon:"🍕", answer:"energy", difficulty:"medium", tip:"คราบน้ำมันทำให้รีไซเคิลยาก" },
  { name:"แก้วกาแฟกระดาษ", icon:"☕", answer:"energy", difficulty:"medium", tip:"ส่วนใหญ่มีเคลือบด้านในและมีคราบเครื่องดื่ม" },
  { name:"ซองขนมฟอยล์", icon:"🍫", answer:"energy", difficulty:"medium", tip:"เป็นวัสดุหลายชั้น รีไซเคิลยาก" },
  { name:"หลอดพลาสติก", icon:"🥤", answer:"energy", difficulty:"medium", tip:"ชิ้นเล็กและรีไซเคิลยาก ควรรวบก่อนทิ้ง" },
  { name:"ทิชชู่ใช้แล้ว", icon:"🧻", answer:"energy", difficulty:"medium", tip:"ไม่ควรปนกับกระดาษสะอาด" },

  { name:"แผงยา", icon:"💊", answer:"energy", difficulty:"medium", tip:"เป็นวัสดุผสม รีไซเคิลยาก" },
  { name:"ซองกาแฟ", icon:"☕", answer:"energy", difficulty:"medium", tip:"ซองแบบหลายชั้นควรแยกเป็นขยะพลังงาน" },
  { name:"หน้ากากอนามัย", icon:"😷", answer:"energy", difficulty:"medium", tip:"ควรพับหรือห่อก่อนทิ้ง" },
  { name:"กล่องนม", icon:"🥛", answer:"recycle", difficulty:"medium", tip:"ล้าง พับ แห้ง แล้วค่อยส่งรีไซเคิล" },
  { name:"ถุงซิปล็อกเปื้อนอาหาร", icon:"🥡", answer:"general", difficulty:"medium", tip:"ถ้าเปื้อนมากควรแยกจากรีไซเคิล" },

  { name:"ใบเสร็จ", icon:"🧾", answer:"general", difficulty:"hard", tip:"หลายชนิดเป็นกระดาษความร้อน ไม่เหมาะกับรีไซเคิล" },
  { name:"ฟิล์มห่ออาหาร", icon:"🧻", answer:"general", difficulty:"hard", tip:"มักเปื้อนและรีไซเคิลยาก" },
  { name:"ATK ใช้แล้ว", icon:"🧪", answer:"energy", difficulty:"hard", tip:"ควรห่อก่อนทิ้ง และแยกจากรีไซเคิล" },
  { name:"Power Bank", icon:"🔌", answer:"hazard", difficulty:"hard", tip:"มีแบตเตอรี่ในตัว ต้องส่งจุดรับเฉพาะ" },
  { name:"น้ำมันใช้แล้ว", icon:"🛢️", answer:"recycle", difficulty:"hard", tip:"เก็บใส่ภาชนะปิดสนิท ส่งจุดรับเฉพาะ" }
];

let currentGameItem = null;
let gameScore = 0;
let gameCombo = 0;
let gameTimeLeft = 60;
let gameStarted = false;
let gameTimerInterval = null;
let countdownInterval = null;
let currentGamePool = [];
let usedGameItems = [];

function buildGamePool(){

  currentGamePool = [...getGameDifficultyPool()];

  shuffleArray(currentGamePool);
}

function shuffleArray(array){

  for(let i = array.length - 1; i > 0; i--){

    const j = Math.floor(Math.random() * (i + 1));

    [array[i], array[j]] =
      [array[j], array[i]];
  }

  return array;
}


function openMatchGamePage(){
  document.getElementById("learnMenuView")?.classList.add("hidden");
  document.getElementById("matchResultPage")?.classList.add("hidden");
  document.getElementById("matchGamePage")?.classList.remove("hidden");

  resetMatchGameUI();
  document.getElementById("gameBinWrapper")?.classList.add("hidden");
  document.getElementById("gameBinChoices")?.classList.add("hidden");
  document.getElementById("startGameBtn")?.classList.remove("hidden");
}

function backToLearnMenu(){
  stopAllGameTimers();

  document.getElementById("matchGamePage")?.classList.add("hidden");
  document.getElementById("matchResultPage")?.classList.add("hidden");
  document.getElementById("learnMenuView")?.classList.remove("hidden");
  document.getElementById("miniQuizPage")?.classList.add("hidden");
  document.getElementById("miniQuizResultPage")?.classList.add("hidden");
  document.getElementById("speedFlashCardPage")?.classList.add("hidden");

  gameStarted = false;
}

function restartMatchGame(){
  document.getElementById("matchResultPage")?.classList.add("hidden");
  document.getElementById("matchGamePage")?.classList.remove("hidden");
  document.getElementById("learnMenuView")?.classList.add("hidden");

  startMatchGame();
  document.getElementById("gameBinGrid")?.classList.add("hidden");
  document.getElementById("startGameBtn")?.classList.add("hidden");
}

function stopAllGameTimers(){
  clearInterval(gameTimerInterval);
  clearInterval(countdownInterval);

  gameTimerInterval = null;
  countdownInterval = null;
}

function resetMatchGameUI(){
  stopAllGameTimers();

  currentGameItem = null;
  gameScore = 0;
  gameCombo = 0;
  gameTimeLeft = 60;
  gameStarted = false;
  previousGameItemId = null;

  document.getElementById("gameScore").innerText = "0";
  document.getElementById("gameCombo").innerText = "0";
  document.getElementById("gameTimer").innerText = "60";
  document.getElementById("startGameBtn").innerText = "Start Game";

  document.getElementById("gameFeedback")?.classList.add("hidden");

  document.getElementById("gameQuestionCard").innerHTML = `
    <div class="game-emoji">🎲</div>
    <div class="game-item-name">พร้อมเล่นหรือยัง?</div>
    <div class="game-hint">กด Start แล้วนับถอยหลัง 3 วิ ก่อนเริ่มเกม</div>
  `;
}

function startMatchGame(){
  stopAllGameTimers();
  buildGamePool();
  gameScore = 0;
  gameCombo = 0;
  gameTimeLeft = 60;
  gameStarted = false;

  document.getElementById("gameScore").innerText = "0";
  document.getElementById("gameCombo").innerText = "0";
  document.getElementById("gameTimer").innerText = "60";
  document.getElementById("startGameBtn").innerText = "กำลังเริ่ม...";
  document.getElementById("startGameBtn").disabled = true;

  document.getElementById("gameFeedback")?.classList.add("hidden");

  startPreGameCountdown();
}

function startPreGameCountdown(){
  let count = 3;

  renderCountdownCard(count);

  countdownInterval = setInterval(()=>{
    count--;

    if(count > 0){
      renderCountdownCard(count);
      return;
    }

    if(count === 0){
      renderCountdownCard("GO!");
      return;
    }

    clearInterval(countdownInterval);
    countdownInterval = null;

    beginMatchGame();
  }, 1000);
}

function renderCountdownCard(value){
  document.getElementById("gameQuestionCard").innerHTML = `
    <div class="game-emoji countdown-emoji">⏳</div>
    <div class="game-countdown-number">${value}</div>
    <div class="game-hint">เตรียมเลือกถังให้ไวที่สุด!</div>
  `;
}

function beginMatchGame(){
  gameStarted = true;

  document.getElementById("startGameBtn").classList.add("hidden");

  // ✅ เพิ่มตรงนี้
  document.getElementById("gameBinWrapper")?.classList.remove("hidden");
  document.getElementById("gameBinChoices")?.classList.remove("hidden");

  nextGameQuestion();

  gameTimerInterval = setInterval(()=>{
    gameTimeLeft--;

    document.getElementById("gameTimer").innerText = gameTimeLeft;

    if(gameTimeLeft <= 0){
      endMatchGame();
    }
  }, 1000);
}

function getGameDifficultyPool(){
  if(gameScore < 50){
    return matchGameItems.filter(item => item.difficulty === "easy");
  }

  if(gameScore < 120){
    return matchGameItems.filter(item => item.difficulty !== "hard");
  }

  return matchGameItems;
}

function getRandomGameItem(){
  // ถ้า pool หมด → rebuild ใหม่
  if(currentGamePool.length === 0){

    buildGamePool();
  }
  const item = currentGamePool.shift();
  usedGameItems.push(item);
  return item;
}

function nextGameQuestion(){
  currentGameItem = getRandomGameItem();

  document.getElementById("gameQuestionCard").innerHTML = `
    <div class="game-emoji">${currentGameItem.icon}</div>
    <div class="game-item-name">${currentGameItem.name}</div>
    <div class="game-hint">ควรทิ้งถังไหน?</div>
  `;
}

function answerGame(selected){
  if(!gameStarted || !currentGameItem){
    return;
  }

  const feedback = document.getElementById("gameFeedback");

  feedback.classList.remove("hidden");

  if(selected === currentGameItem.answer){
    gameCombo++;

    const comboBonus = gameCombo >= 3 ? 5 : 0;
    const point = 10 + comboBonus;

    gameScore += point;

    feedback.className = "game-feedback correct";
    feedback.innerHTML = `
      ถูกต้อง! +${point} ⭐
      <br>
      <small>${currentGameItem.tip}</small>
    `;
  }else{
    gameCombo = 0;
    gameScore = Math.max(0, gameScore - 3);

    feedback.className = "game-feedback wrong";
    feedback.innerHTML = `
      ยังไม่ถูกน้า -3
      <br>
      <small>${currentGameItem.tip}</small>
    `;
  }

  document.getElementById("gameScore").innerText = gameScore;
  document.getElementById("gameCombo").innerText = gameCombo;

  setTimeout(()=>{
    if(!gameStarted) return;

    feedback.classList.add("hidden");
    nextGameQuestion();
  }, 650);
}

function endMatchGame(){
  stopAllGameTimers();

  gameStarted = false;

  document.getElementById("startGameBtn").disabled = false;
  document.getElementById("startGameBtn").innerText = "Start Game";

  saveLeaderboardScore(gameScore);

  document.getElementById("matchGamePage")?.classList.add("hidden");
  document.getElementById("matchResultPage")?.classList.remove("hidden");

  document.getElementById("finalGameScore").innerText = gameScore;

  renderLeaderboard();

  if(typeof updateLearnProgress === "function"){
    updateLearnProgress();
  }
}

function saveLeaderboardScore(score){
  const leaderboard = JSON.parse(
    localStorage.getItem("matchLeaderboard") || "[]"
  );

  leaderboard.push({
    name: "You",
    score,
    playedAt: new Date().toISOString()
  });

  leaderboard.sort((a,b) => b.score - a.score);

  localStorage.setItem(
    "matchLeaderboard",
    JSON.stringify(leaderboard.slice(0, 5))
  );
}

function renderLeaderboard(){
  const leaderboard = JSON.parse(
    localStorage.getItem("matchLeaderboard") || "[]"
  );

  const list = document.getElementById("leaderboardList");

  if(!list) return;

  list.innerHTML = "";

  if(leaderboard.length === 0){
    list.innerHTML = `<p class="small">ยังไม่มีคะแนน</p>`;
    return;
  }

  leaderboard.forEach((item, index)=>{
    const div = document.createElement("div");
    div.className = "leaderboard-row";

    const medal =
      index === 0 ? "🥇" :
      index === 1 ? "🥈" :
      index === 2 ? "🥉" :
      `#${index + 1}`;

    div.innerHTML = `
      <div class="rank-badge">${medal}</div>
      <div class="leader-name">${item.name}</div>
      <strong>${item.score}</strong>
    `;

    list.appendChild(div);
  });
}

// =========================
// MINI QUIZ
// =========================

const miniQuizQuestions = [
  {
    question: "1. ปัจจัยสำคัญที่ทำให้ปัญหาขยะก่อให้เกิดภาวะโลกรวน (Global Warming) ข้อใดถูกต้อง",
    choices: {
      a: "การกำจัดขยะโดยการนำมาเทกองรวมกัน เผา และฝังกลบ จนเกิดก๊าซเรือนกระจก (CH4 และ CO2)",
      b: "การทิ้งขยะอันตรายลงในแหล่งน้ำตามธรรมชาติ จนมีโลหะหนักตกค้างในน้ำ",
      c: "การคัดแยกขยะแล้วนำไปจัดการอย่างเหมาะสม",
      d: "ถูกทั้งข้อ a. และ b."
    },
    answer: "a",
    explain: "การเทกอง เผา และฝังกลบทำให้เกิดก๊าซเรือนกระจก เช่น CH4 และ CO2"
  },
  {
    question: "2. ปัญหาขยะที่เกิดขึ้นส่งผลกระทบต่อสิ่งใดบ้าง",
    choices: {
      a: "ผลผลิตทางการเกษตรตกต่ำ",
      b: "สูญเสียความหลากหลายทางชีวภาพ",
      c: "พบไมโครพลาสติกในร่างกายมนุษย์ และเกิดโรคภัยระบาดได้ง่ายขึ้น",
      d: "ถูกทั้งข้อ a. b. และ c."
    },
    answer: "d",
    explain: "ปัญหาขยะกระทบทั้งสิ่งแวดล้อม สุขภาพ และระบบนิเวศ"
  },
  {
    question: "3. ข้อใด ไม่ใช่ แนวทางการแก้ไขปัญหาขยะอย่างยั่งยืน",
    choices: {
      a: "นำกล่องข้าวมาใส่อาหารแทนการใช้ถุงพลาสติก",
      b: "ทิ้งขยะรวมลงถังส่วนตัว แล้วให้แม่บ้านคัดแยกภายหลัง",
      c: "รวบรวมกล่องนม UHT แล้วส่งโครงการรับบริจาค",
      d: "ใช้เครื่องย่อยเศษอาหารเป็นปุ๋ย และแยกขยะขาย"
    },
    answer: "b",
    explain: "การแยกขยะควรทำตั้งแต่ต้นทาง ไม่ใช่ทิ้งรวมแล้วให้ผู้อื่นคัดแยก"
  },
  {
    question: "4. ข้อใด คือ ขยะรีไซเคิล (Recyclable Waste)",
    choices: {
      a: "วัสดุที่ไม่ได้ทำความสะอาด แต่นำมาใช้เป็นพลังงานได้",
      b: "วัสดุสะอาดที่นำกลับมาใช้ซ้ำได้ โดยไม่ผ่านกระบวนการผลิต",
      c: "วัสดุสะอาดที่นำกลับมาแปรรูปเป็นวัตถุดิบในกระบวนการผลิต",
      d: "ถูกทั้งข้อ a. b. และ c."
    },
    answer: "c",
    explain: "ขยะรีไซเคิลคือวัสดุสะอาดที่นำกลับไปแปรรูปเป็นวัตถุดิบได้"
  },
  {
    question: "5. ข้อใดเป็นขยะอันตราย (Hazardous Waste) ทั้งหมด",
    choices: {
      a: "โทรศัพท์มือถือเก่า หลอดไฟ ตะปูขึ้นสนิม หูฟัง",
      b: "หลอดไฟ สายชาร์จโทรศัพท์ แบตเตอรี่ ขวดแก้วแตก",
      c: "ขวดน้ำยาล้างห้องน้ำ กระดาษซับน้ำมันอาหาร นาฬิกาดิจิตอล ถ่านไฟฉาย",
      d: "ขวดน้ำยาทาเล็บ พาวเวอร์แบงก์ ถ่านไฟฉาย กระป๋องสเปรย์"
    },
    answer: "d",
    explain: "ทั้งหมดเป็นของที่ควรแยกจัดการแบบขยะอันตรายหรือส่งจุดรับเฉพาะ"
  },
  {
    question: "6. ข้อใดคือขยะที่รีไซเคิลไม่ได้หรือไม่คุ้มค่า แต่นำมาใช้เป็นขยะพลังงานได้",
    choices: {
      a: "ซองใส่ขนม หลอดน้ำพลาสติก โฟม",
      b: "หลอดน้ำพลาสติก ถุงมือยาง กระป๋องเครื่องดื่ม",
      c: "ขวดแก้ว ซองใส่ขนม กระดาษลัง",
      d: "กระดาษลัง กระป๋องสเปรย์ โฟม"
    },
    answer: "a",
    explain: "ซองขนม หลอด และโฟมมักรีไซเคิลยาก จึงเหมาะกับกลุ่มขยะพลังงาน"
  },
  {
    question: "7. ข้อใดเป็นการแยกขยะรีไซเคิลภายในอาคารสำนักงานตั้งแต่ต้นทาง",
    choices: {
      a: "ดื่มช็อกโกแลตเย็นจนหมด แล้วทิ้งลงถังสีเหลือง",
      b: "ดื่มสตรอว์เบอร์รีปั่น แล้วล้างแก้วจนสะอาด ผึ่งแห้ง และทิ้งลงถังสีเหลือง",
      c: "เก็บห่อข้าวพร้อมเศษอาหารใส่ถุง แล้วทิ้งลงถังสีเหลือง",
      d: "ล้างถุงใส่หมูปิ้งให้พอสะอาด แล้วทิ้งลงถังสีเหลือง"
    },
    answer: "b",
    explain: "ขยะรีไซเคิลควรสะอาดและแห้งก่อนทิ้งลงถังสีเหลือง"
  },
  {
    question: "8. ข้อใดปฏิบัติตามแนวทางแยกทิ้งเป็นขยะพลังงาน",
    choices: {
      a: "ดื่มช็อกโกแลตเย็นจนหมด แล้วทิ้งลงถังสีเทา",
      b: "ล้างแก้วจนสะอาด ผึ่งแห้ง และทิ้งลงถังสีเทา",
      c: "เก็บห่อข้าวพร้อมเศษอาหารใส่ถุง แล้วทิ้งลงถังสีเทา",
      d: "ล้างถุงใส่หมูปิ้งพอสะอาด สะบัดหมาด/ผึ่งพอแห้ง แล้วทิ้งลงถังสีเทา"
    },
    answer: "d",
    explain: "ขยะพลังงานควรลดเศษอาหาร/ความเปียกก่อนทิ้ง"
  },
  {
    question: "9. จุดให้บริการโครงการรับบริจาคขยะประเภทต่าง ๆ ภายใน สนญ. กฟผ. มีทั้งหมดกี่จุด",
    choices: {
      a: "3 จุด ได้แก่ อาคารพักขยะ ต.041, Circular Station ลาน ENGY และตึกจอดรถชั้น 4 ต.090",
      b: "3 จุด ได้แก่ อาคารพักขยะ ต.041, Circular Station ลาน ENGY และตึกจอดรถชั้น 4 ต.089",
      c: "3 จุด ได้แก่ อาคารพักขยะรีไซเคิล ท.103, Circular Station ลาน ENGY และตึกจอดรถชั้น 4 ต.090",
      d: "3 จุด ได้แก่ อาคารพักขยะรีไซเคิล ท.103, Circular Station ลาน ENGY และตึกจอดรถชั้น 4 ต.089"
    },
    answer: "c",
    explain: "ข้อนี้ควรตรวจยืนยันกับข้อมูลสถานที่จริงของ สนญ. กฟผ. อีกครั้ง"
  },
  {
    question: "10. “นี่คือถังสีเหลือง เอา........................มาใส่ เอามารวบรวมไว้ ส่งไปรีไซเคิล” ข้อใดถูกต้อง",
    choices: {
      a: "ขวดพลาสติก",
      b: "ซองวิบวับ",
      c: "ขยะสิ้นคิด",
      d: "ถูกทั้งข้อ a. b. และ c."
    },
    answer: "a",
    explain: "ถังสีเหลืองใช้สำหรับขยะรีไซเคิล เช่น ขวดพลาสติกสะอาด"
  }
];

let currentQuizIndex = 0;
let quizScore = 0;
let quizAnswered = false;

function openMiniQuizPage(){
  document.getElementById("learnMenuView")?.classList.add("hidden");
  document.getElementById("matchGamePage")?.classList.add("hidden");
  document.getElementById("matchResultPage")?.classList.add("hidden");
  document.getElementById("miniQuizResultPage")?.classList.add("hidden");
  document.getElementById("miniQuizPage")?.classList.remove("hidden");

  startMiniQuiz();
}

function startMiniQuiz(){
  currentQuizIndex = 0;
  quizScore = 0;
  quizAnswered = false;

  document.getElementById("quizScoreText").innerText = "0";

  renderQuizQuestion();
}

function renderQuizQuestion(){
  const q = miniQuizQuestions[currentQuizIndex];
  quizAnswered = false;

  document.getElementById("quizQuestionText").innerText = q.question;
  document.getElementById("quizFeedback").classList.add("hidden");
  document.getElementById("quizNextBtn").classList.add("hidden");

  const choices = document.getElementById("quizChoices");
  choices.innerHTML = "";

  Object.keys(q.choices).forEach(key=>{
    const btn = document.createElement("button");
    btn.className = "quiz-choice-btn";
    btn.innerHTML = `<strong>${key.toUpperCase()}.</strong> ${q.choices[key]}`;
    btn.onclick = () => answerMiniQuiz(key);
    choices.appendChild(btn);
  });

  updateQuizProgress();
}

function answerMiniQuiz(selected){
  if(quizAnswered) return;

  quizAnswered = true;

  const q = miniQuizQuestions[currentQuizIndex];
  const isCorrect = selected === q.answer;

  if(isCorrect){
    quizScore++;
  }

  document.getElementById("quizScoreText").innerText = quizScore;

  document.querySelectorAll(".quiz-choice-btn").forEach(btn=>{
    btn.disabled = true;
  });

  const selectedBtn = [...document.querySelectorAll(".quiz-choice-btn")]
    .find(btn => btn.innerText.trim().startsWith(selected.toUpperCase()));

  const correctBtn = [...document.querySelectorAll(".quiz-choice-btn")]
    .find(btn => btn.innerText.trim().startsWith(q.answer.toUpperCase()));

  if(selectedBtn){
    selectedBtn.classList.add(isCorrect ? "correct" : "wrong");
  }

  if(correctBtn){
    correctBtn.classList.add("correct");
  }

  const feedback = document.getElementById("quizFeedback");
  feedback.className = isCorrect
    ? "quiz-feedback correct"
    : "quiz-feedback wrong";

  feedback.innerHTML = `
    ${isCorrect ? "✅ ถูกต้อง!" : "❌ ยังไม่ถูกน้า"}
    <br>
    <small>${q.explain}</small>
  `;

  document.getElementById("quizNextBtn").classList.remove("hidden");
}

function nextQuizQuestion(){
  currentQuizIndex++;

  if(currentQuizIndex >= miniQuizQuestions.length){
    endMiniQuiz();
    return;
  }

  renderQuizQuestion();
}

function updateQuizProgress(){
  const total = miniQuizQuestions.length;
  const current = currentQuizIndex + 1;
  const percent = Math.round((current / total) * 100);

  document.getElementById("quizProgressText").innerText =
    `Question ${current} / ${total}`;

  document.getElementById("quizPercentText").innerText =
    `${percent}%`;

  document.getElementById("quizProgressFill").style.width =
    `${percent}%`;
}

function endMiniQuiz(){
  document.getElementById("miniQuizPage")?.classList.add("hidden");
  document.getElementById("miniQuizResultPage")?.classList.remove("hidden");

  const total = miniQuizQuestions.length;
  const percent = Math.round((quizScore / total) * 100);

  document.getElementById("finalQuizScore").innerText =
    `${quizScore} / ${total}`;

  document.getElementById("finalQuizPercent").innerText =
    `${percent}%`;

  localStorage.setItem("lastMiniQuizScore", quizScore);
}

function restartMiniQuiz(){
  document.getElementById("miniQuizResultPage")?.classList.add("hidden");
  document.getElementById("miniQuizPage")?.classList.remove("hidden");

  startMiniQuiz();
}

// ======================================================
// SPEED x ZERO WASTE FLASH CARD
// ======================================================

const speedFlashCards = [
  {
    id:1,
    behavior:"ล้างแก้วกาแฟก่อนแยกลงถัง",
    speed:"P",
    title:"PROACTIVE APPROACH",
    icon:"⚡",
    color:"#F21643",
    explanation:"ลงมือทำก่อน ลดปัญหาขยะปนเปื้อน และช่วยให้รีไซเคิลได้ง่ายขึ้น"
  },
  {
    id:2,
    behavior:"ใช้ Teams แทนการพิมพ์เอกสารประชุม",
    speed:"D",
    title:"DIGITALIZATION",
    icon:"💻",
    color:"#0B53A5",
    explanation:"ใช้เทคโนโลยีลดการใช้กระดาษและทรัพยากร"
  },
  {
    id:3,
    behavior:"ช่วยเพื่อนร่วมงานแยกขยะให้ถูกประเภท",
    speed:"E",
    title:"EMPATHY",
    icon:"💚",
    color:"#00A859",
    explanation:"ใส่ใจและช่วยเหลือผู้อื่นให้ทำสิ่งที่ถูกต้องได้ง่ายขึ้น"
  },
  {
    id:4,
    behavior:"รวบรวมขวดพลาสติกทั้งแผนกไปส่งรีไซเคิล",
    speed:"S",
    title:"SYNERGY",
    icon:"🤝",
    color:"#F5C400",
    explanation:"ร่วมมือกันสร้างผลลัพธ์ที่ดีกว่าการทำคนเดียว"
  },
  {
    id:5,
    behavior:"นำแบนเนอร์เก่ามาทำกระเป๋าผ้า",
    speed:"E",
    title:"ENTREPRENEURSHIP",
    icon:"💡",
    color:"#7030A0",
    explanation:"สร้างคุณค่าใหม่จากของเหลือใช้"
  },
  {
    id:6,
    behavior:"พกแก้วส่วนตัวแทนการรับแก้วใหม่ทุกวัน",
    speed:"P",
    title:"PROACTIVE APPROACH",
    icon:"⚡",
    color:"#F21643",
    explanation:"ลดขยะตั้งแต่ต้นทางโดยไม่ต้องรอให้มีคนเตือน"
  },
  {
    id:7,
    behavior:"สร้าง QR Code แทนการแจกคู่มือกระดาษ",
    speed:"D",
    title:"DIGITALIZATION",
    icon:"💻",
    color:"#0B53A5",
    explanation:"ใช้เครื่องมือดิจิทัลช่วยลดการใช้กระดาษ"
  },
  {
    id:8,
    behavior:"เก็บขยะที่พบในพื้นที่ส่วนกลางแม้ไม่ใช่ของตน",
    speed:"E",
    title:"EMPATHY",
    icon:"💚",
    color:"#00A859",
    explanation:"คำนึงถึงส่วนรวมและสภาพแวดล้อมของทุกคน"
  },
  {
    id:9,
    behavior:"ชวนเพื่อนร่วมทีมเข้าร่วมกิจกรรม Zero Waste",
    speed:"S",
    title:"SYNERGY",
    icon:"🤝",
    color:"#F5C400",
    explanation:"สร้างพลังร่วมเพื่อเป้าหมายเดียวกัน"
  },
  {
    id:10,
    behavior:"คิดระบบสะสมแต้มจากการแยกขยะ",
    speed:"E",
    title:"ENTREPRENEURSHIP",
    icon:"💡",
    color:"#7030A0",
    explanation:"สร้างแนวคิดใหม่เพื่อเปลี่ยนพฤติกรรมในองค์กร"
  },
  {
    id:11,
    behavior:"แยกฝาขวดออกจากขวดก่อนทิ้ง",
    speed:"P",
    title:"PROACTIVE APPROACH",
    icon:"⚡",
    color:"#F21643",
    explanation:"เตรียมขยะให้พร้อมก่อนทิ้ง ช่วยให้จัดการต่อได้ง่ายขึ้น"
  },
  {
    id:12,
    behavior:"รายงานจุดวางถังขยะที่ไม่เหมาะสม",
    speed:"P",
    title:"PROACTIVE APPROACH",
    icon:"⚡",
    color:"#F21643",
    explanation:"เห็นปัญหาแล้วรีบแจ้งเพื่อป้องกันการแยกขยะผิด"
  },
  {
    id:13,
    behavior:"แชร์ Infographic การแยกขยะผ่าน LINE Group",
    speed:"D",
    title:"DIGITALIZATION",
    icon:"💻",
    color:"#0B53A5",
    explanation:"ใช้ช่องทางดิจิทัลส่งต่อความรู้ได้รวดเร็ว"
  },
  {
    id:14,
    behavior:"ช่วยอธิบายการแยกขยะให้พนักงานใหม่",
    speed:"E",
    title:"EMPATHY",
    icon:"💚",
    color:"#00A859",
    explanation:"ช่วยให้คนใหม่เข้าใจและเริ่มทำได้อย่างมั่นใจ"
  },
  {
    id:15,
    behavior:"ร่วมกันออกแบบ Green Office ของแผนก",
    speed:"S",
    title:"SYNERGY",
    icon:"🤝",
    color:"#F5C400",
    explanation:"ใช้ความร่วมมือของทีมสร้างสภาพแวดล้อมที่ดีขึ้น"
  },
  {
    id:16,
    behavior:"นำเศษวัสดุเหลือใช้มาทำของที่ระลึก",
    speed:"E",
    title:"ENTREPRENEURSHIP",
    icon:"💡",
    color:"#7030A0",
    explanation:"มองเห็นโอกาสและเพิ่มมูลค่าให้ทรัพยากรเดิม"
  },
  {
    id:17,
    behavior:"ปิดไฟและเครื่องใช้ไฟฟ้าก่อนออกจากห้อง",
    speed:"P",
    title:"PROACTIVE APPROACH",
    icon:"⚡",
    color:"#F21643",
    explanation:"ลงมือช่วยประหยัดพลังงานก่อนเกิดความสูญเปล่า"
  },
  {
    id:18,
    behavior:"ใช้ระบบ e-Form แทนเอกสารกระดาษ",
    speed:"D",
    title:"DIGITALIZATION",
    icon:"💻",
    color:"#0B53A5",
    explanation:"เปลี่ยนกระบวนการทำงานให้เป็นดิจิทัลและลดกระดาษ"
  },
  {
    id:19,
    behavior:"แบ่งปันความรู้เรื่อง Circular Economy ให้ทีม",
    speed:"E",
    title:"EMPATHY",
    icon:"💚",
    color:"#00A859",
    explanation:"ส่งต่อความรู้เพื่อให้คนอื่นพัฒนาไปด้วยกัน"
  },
  {
    id:20,
    behavior:"จัดกิจกรรมเก็บขยะร่วมกันในพื้นที่ทำงาน",
    speed:"S",
    title:"SYNERGY",
    icon:"🤝",
    color:"#F5C400",
    explanation:"ร่วมแรงร่วมใจทำให้พื้นที่ทำงานดีขึ้น"
  },
  {
    id:21,
    behavior:"คิดโครงการเปลี่ยนขยะเป็นของรางวัล",
    speed:"E",
    title:"ENTREPRENEURSHIP",
    icon:"💡",
    color:"#7030A0",
    explanation:"สร้างแรงจูงใจใหม่จากสิ่งที่เคยถูกมองว่าไร้ค่า"
  },
  {
    id:22,
    behavior:"ลดการรับช้อนส้อมพลาสติกเมื่อไม่จำเป็น",
    speed:"P",
    title:"PROACTIVE APPROACH",
    icon:"⚡",
    color:"#F21643",
    explanation:"ลดขยะใช้ครั้งเดียวตั้งแต่ก่อนเกิดขยะ"
  },
  {
    id:23,
    behavior:"ใช้ Dashboard ติดตามผลการลดขยะ",
    speed:"D",
    title:"DIGITALIZATION",
    icon:"💻",
    color:"#0B53A5",
    explanation:"ใช้ข้อมูลช่วยติดตามและพัฒนาการจัดการขยะ"
  },
  {
    id:24,
    behavior:"ช่วยเพื่อนแยกขยะผิดถังโดยไม่ตำหนิ",
    speed:"E",
    title:"EMPATHY",
    icon:"💚",
    color:"#00A859",
    explanation:"ช่วยเหลือด้วยความเข้าใจ ทำให้คนกล้าเรียนรู้"
  },
  {
    id:25,
    behavior:"รวมหลายหน่วยงานจัดกิจกรรม Zero Waste Day",
    speed:"S",
    title:"SYNERGY",
    icon:"🤝",
    color:"#F5C400",
    explanation:"ความร่วมมือข้ามทีมช่วยสร้างผลกระทบที่ใหญ่ขึ้น"
  }
];

let currentFlashCardIndex = 0;
let flashCardFlipped = false;

function openSpeedFlashCardPage(){
  document.getElementById("learnMenuView")?.classList.add("hidden");
  document.getElementById("matchGamePage")?.classList.add("hidden");
  document.getElementById("matchResultPage")?.classList.add("hidden");
  document.getElementById("miniQuizPage")?.classList.add("hidden");
  document.getElementById("miniQuizResultPage")?.classList.add("hidden");
  document.getElementById("speedFlashCardPage")?.classList.remove("hidden");

  currentFlashCardIndex = 0;
  flashCardFlipped = false;

  renderSpeedFlashCard();
}

function renderSpeedFlashCard(){
  const card = speedFlashCards[currentFlashCardIndex];

  const flashCard = document.getElementById("flashCard");
  const progressFill = document.getElementById("flashProgressFill");

  const cardIcon = document.getElementById("flashCardIcon");
  const behavior = document.getElementById("flashCardBehavior");

  const answerIcon = document.getElementById("flashAnswerIcon");
  const answerTitle = document.getElementById("flashAnswerTitle");
  const answerDescription = document.getElementById("flashAnswerDescription");

  flashCardFlipped = false;
  flashCard?.classList.remove("flipped");

  if(progressFill){
    const percent = ((currentFlashCardIndex + 1) / speedFlashCards.length) * 100;
    progressFill.style.width = `${percent}%`;
  }

  if(cardIcon){
    cardIcon.innerText = "♻️";
  }

  if(behavior){
    behavior.innerText = card.behavior;
  }

  if(answerIcon){
    answerIcon.innerText = card.icon;
  }

  if(answerTitle){
    answerTitle.innerText = card.title.toUpperCase();
  }

  if(answerDescription){
    answerDescription.innerText = card.explanation;
  }

  const backCard = document.querySelector(".flash-card-back");

  if (backCard) {
    // 1. สร้างคลังคู่สีเอาไว้
    const colorMap = {
      'S': '#F4C400',
      'P': '#F51446',
      'E': '#08AF5C', // ถ้า E มีสองสี อาจจะต้องเช็กเงื่อนไขเพิ่ม แต่อันนี้ยึดตามตัวหลังสุดนะคราับ
      'E2': '#76329D', // สมมติว่าถ้าเป็น E อีกตัวให้ใช้ชื่ออื่น หรือถ้าเหมือนกันระบบจะทับเป็นอันล่าสุด
      'D': '#1156A8'
    };

    // 2. ดึงสีตามตัวอักษรของ card (สมมติว่าตัวแปรชื่อ card.letter หรือ card.type นะครับ)
    // ถ้าหาตัวอักษรไม่เจอ จะใช้สีเริ่มต้นเป็น card.color
    backCard.style.background = colorMap[card.letter] || card.color; 
  }

  updateFlashNavButtons();
}

function updateFlashNavButtons(){
  const prevBtn = document.getElementById("flashPrevBtn");
  const nextBtn = document.getElementById("flashNextBtn");

  if(prevBtn){
    prevBtn.disabled = currentFlashCardIndex === 0;
  }

  if(nextBtn){
    const isLastCard = currentFlashCardIndex === speedFlashCards.length - 1;

    nextBtn.disabled = isLastCard;
    nextBtn.innerText = isLastCard ? "ครบแล้ว 🌱" : "ถัดไป ▶";
  }
}

function flipSpeedFlashCard(){
  const flashCard = document.getElementById("flashCard");

  if(!flashCard) return;

  flashCardFlipped = !flashCardFlipped;
  flashCard.classList.toggle("flipped", flashCardFlipped);
}

function nextFlashCard(){
  if(currentFlashCardIndex >= speedFlashCards.length - 1){
    return;
  }

  resetFlashFlip();

  setTimeout(()=>{
    currentFlashCardIndex++;
    renderSpeedFlashCard();
  }, 180);
}

function previousFlashCard(){
  if(currentFlashCardIndex <= 0){
    return;
  }

  resetFlashFlip();

  setTimeout(()=>{
    currentFlashCardIndex--;
    renderSpeedFlashCard();
  }, 180);
}

function resetFlashFlip(){
  const flashCard = document.getElementById("flashCard");

  flashCardFlipped = false;

  if(flashCard){
    flashCard.classList.remove("flipped");
  }
}

// ======================================================
// ZERO WASTE RESOURCE CAROUSEL
// ======================================================

function initResourceCarousel(){
  const row = document.getElementById("resourceScrollRow");
  const dots = document.getElementById("resourceDots");
  const counter = document.getElementById("resourceCounter");

  if(!row || !dots) return;

  const items = row.querySelectorAll(".resource-item");

  if(items.length === 0) return;

  dots.innerHTML = "";

  items.forEach((_, index)=>{
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = index === 0
      ? "resource-dot active"
      : "resource-dot";

    dot.onclick = ()=>{
      row.scrollTo({
        left: items[index].offsetLeft - row.offsetLeft,
        behavior: "smooth"
      });
    };

    dots.appendChild(dot);
  });

  function updateResourceState(){
    let activeIndex = 0;
    let nearestDistance = Infinity;

    items.forEach((item, index)=>{
      const distance = Math.abs(row.scrollLeft - item.offsetLeft);

      if(distance < nearestDistance){
        nearestDistance = distance;
        activeIndex = index;
      }
    });

    dots.querySelectorAll(".resource-dot").forEach((dot, index)=>{
      dot.classList.toggle("active", index === activeIndex);
    });

    if(counter){
      counter.innerText = `${activeIndex + 1} / ${items.length}`;
    }
  }

  row.addEventListener("scroll", ()=>{
    window.requestAnimationFrame(updateResourceState);
  });

  updateResourceState();
}