const USER_STORAGE_KEY = "zeroWasteUserProfile";

let currentUser = {
  userId: "demo-user",
  name: "XXXXX",
  level: 1,
  greenScore: 0,
  wasteSorted: 0,
  co2ReducedKg: 0,
  completedModules: {
    matchGame: false,
    miniQuiz: false,
    speedFlashCard: false,
    resources: false,
    aiScan: false
  }
};

function saveUserProfile(){
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(currentUser));
}

function loadUserProfile(){
  const saved = localStorage.getItem(USER_STORAGE_KEY);

  if(saved){
    currentUser = {
      ...currentUser,
      ...JSON.parse(saved)
    };
  }
}

function markModuleCompleted(moduleName){
  currentUser.completedModules[moduleName] = true;
  saveUserProfile();
  updateLearningProgress();
}

function getCompletedModuleCount(){
  return Object.values(currentUser.completedModules).filter(Boolean).length;
}

function updateLearningProgress(){
  const completed = getCompletedModuleCount();
  const total = Object.keys(currentUser.completedModules).length;
  const percent = Math.round((completed / total) * 100);

  const completedText = document.getElementById("learningCompletedText");
  const progressFill = document.getElementById("learningProgressFill");
  const percentText = document.getElementById("learningPercentText");

  if(completedText) completedText.innerText = `${completed} / ${total}`;
  if(progressFill) progressFill.style.width = `${percent}%`;
  if(percentText) percentText.innerText = `${percent}%`;
}