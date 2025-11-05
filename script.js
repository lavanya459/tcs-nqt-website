// ================= TEST TIMINGS =================
const openTime = new Date();
openTime.setHours(23, 0, 0); // 11:00 PM
const closeTime = new Date();
closeTime.setHours(24, 0, 0); // 12:00 AM (1 hr duration)

const timerEl = document.getElementById("timer");
const quiz = document.getElementById("quiz-section");
const statusEl = document.getElementById("time-status");

// ================= QUESTION BANK =================
const questions = [
  // Time & Work
  {q:"A can do a work in 15 days. He works alone for 5 days and then B, who is 50% more efficient than A, finishes the rest in 6 days. How many days would B alone take to finish the entire work?", opt:["9","10","12","15"], ans:"10"},
  {q:"A and B together can do a piece of work in 12 days, B and C can do it in 18 days, A and C can do it in 15 days. How many days will all three together take?", opt:["7.2","8","9","10"], ans:"8"},
  {q:"Pipes A and B can fill a tank in 10 and 15 hours respectively. A pipe C empties it in 20 hours. If all three are open, how many hours to fill the tank?", opt:["6","6.67","7","8"], ans:"6.67"},
  // Speed & Distance
  {q:"A train travels from A to B at 90 km/h and returns from B to A at 60 km/h. What is the average speed for the round trip?", opt:["72 km/h","75 km/h","77.5 km/h","80 km/h"], ans:"72 km/h"},
  {q:"A car covers 240 km in the first 3 hours and 160 km in the next 2 hours. What is its average speed for entire journey?", opt:["70 km/h","72 km/h","75 km/h","80 km/h"], ans:"72 km/h"},
  // Problems on Trains
  {q:"A 200-m train travelling at 72 km/h passes a platform in 30 s. What is the length of the platform?", opt:["100 m","150 m","200 m","250 m"], ans:"150 m"},
  {q:"Two trains of lengths 120 m and 180 m travel in opposite directions at 54 km/h and 36 km/h. How long will they take to cross each other?", opt:["8 s","9 s","10 s","12 s"], ans:"8 s"},
  // Blood Relations
  {q:"X says to Y: “Your mother’s brother is my father’s son.” How is Y related to X?", opt:["Nephew","Niece","Cousin","Grandchild"], ans:"Niece"},
  {q:"A is the only daughter of B, who is the father of C. D is the husband of C. How is B related to D?", opt:["Father-in-law","Grandfather","Father","Brother"], ans:"Grandfather"},
  // Tense / Error Detection
  {q:"Find error: ‘No sooner had he entered the shop than the thief disappeared.’", opt:["No","sooner","had","shop"], ans:"sooner"},
  {q:"Find error: ‘He is working here since five years.’", opt:["is","working","since","five"], ans:"is"},
  // Sentence Completion
  {q:"She studied hard ____ she was successful.", opt:["so that","therefore","but","so"], ans:"so that"},
  {q:"I would rather you ____ earlier tomorrow.", opt:["come","came","will come","had come"], ans:"came"},
  // Synonyms
  {q:"Choose synonym of ‘Assiduous’.", opt:["Diligent","Lazy","Superficial","Indifferent"], ans:"Diligent"},
  {q:"Choose synonym of ‘Intransigent’.", opt:["Flexible","Stubborn","Cooperative","Yielding"], ans:"Stubborn"},
  // Antonyms
  {q:"Choose antonym of ‘Obviate’.", opt:["Facilitate","Prevent","Reduce","Eliminate"], ans:"Facilitate"},
  {q:"Choose antonym of ‘Pernicious’.", opt:["Beneficial","Harmful","Dangerous","Lethal"], ans:"Beneficial"},
  // Arrange Order
  {q:"Arrange: (P) He completed his work, (Q) went for a walk, (R) after that, (S) he felt very relaxed.", opt:["P Q R S","P R Q S","Q P R S","R P Q S"], ans:"P R Q S"},
  {q:"Arrange: (P) We reached early, (Q) the park was empty, (R) we sat quietly, (S) no one else came.", opt:["P Q R S","Q P S R","P R Q S","S Q P R"], ans:"P Q R S"}
];

// ================= HTML HOOKS =================
const qEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const feedbackEl = document.getElementById("feedback");
const nextBtn = document.getElementById("next");
const resultEl = document.getElementById("result");

let index = 0;
let score = 0;

// ================= TIMER =================
function examTimer(){
  const now = new Date();
  if(now < openTime){
    quiz.style.display = "none";
    statusEl.textContent = "⏳ Exam will open at 11:00 PM";
  } else if(now >= openTime && now <= closeTime){
    quiz.style.display = "block";
    const rem = Math.floor((closeTime - now)/1000);
    const m = Math.floor(rem/60), s = rem % 60;
    timerEl.textContent = `Time Left: ${m}m ${s}s`;
    if(rem <= 0) endTest();
  } else {
    endTest();
  }
}
setInterval(examTimer,1000);

// ================= LOAD QUESTION =================
function load(){
  const q = questions[index];
  qEl.textContent = `${index+1}. ${q.q}`;
  feedbackEl.textContent = "";
  nextBtn.style.display = "none";
  optionsEl.innerHTML = "";

  q.opt.forEach(o =>{
    const btn = document.createElement("button");
    btn.textContent = o;
    btn.onclick = ()=>checkAnswer(btn, q.ans);
    optionsEl.appendChild(btn);
  });
}

// ================= CHECK ANSWER =================
function checkAnswer(btn, correct){
  [...optionsEl.children].forEach(b => b.disabled = true);
  if(btn.textContent === correct){
    btn.classList.add("correct");
    feedbackEl.textContent = "✅ Correct";
    score++;
  } else {
    btn.classList.add("wrong");
    feedbackEl.textContent = `❌ Wrong — Correct: ${correct}`;
  }
  nextBtn.style.display = "inline-block";
}

// ================= NEXT =================
nextBtn.onclick = () => {
  index++;
  if(index < questions.length){
    load();
  } else {
    endTest();
  }
};

// ================= END TEST =================
function endTest(){
  quiz.style.display = "none";
  timerEl.style.display = "none";
  resultEl.textContent = `🎯 Test Ended | Score = ${score} / ${questions.length}`;
}

// ================= START =================
load();
