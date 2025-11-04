// =========================
// Configuration (edit here if needed)
// =========================
const START_HOUR = 23;      // 11:00 PM
const START_MIN = 0;
const DURATION_MIN = 40;    // 40 minutes (ends at 11:40 PM)

// =========================
// Time setup
// =========================
function makeDateAt(hour, minute, shiftDay = 0){
  const d = new Date();
  if(shiftDay !== 0) d.setDate(d.getDate() + shiftDay);
  d.setHours(hour, minute, 0, 0);
  return d;
}

// compute start & end. handle midnight boundary correctly:
let startTime = makeDateAt(START_HOUR, START_MIN);
let endTime = new Date(startTime.getTime() + DURATION_MIN * 60 * 1000);

// If startTime already passed today but user wants next-day behavior, we keep same-day semantics.
// (This uses machine local time — that's expected.)
const clockEl = document.getElementById('clock');
const statusEl = document.getElementById('time-status');
const quizArea = document.getElementById('quiz-area');
const closedArea = document.getElementById('closed-area');
const resultArea = document.getElementById('result-area');

const topicNameEl = document.getElementById('topic-name');
const qIndexEl = document.getElementById('q-index');
const qTotalEl = document.getElementById('q-total');
const questionTextEl = document.getElementById('question-text');
const optionsEl = document.getElementById('options');
const feedbackEl = document.getElementById('feedback');
const nextBtn = document.getElementById('next-btn');
const endBtn = document.getElementById('end-btn');
const finalScoreEl = document.getElementById('final-score');
const breakdownEl = document.getElementById('breakdown');

// =========================
// QUESTION BANK (9 topics × 5 each) — advanced medium→hard TCS-NQT style
// Each entry: {topic:"", q:"", opt:[...], ans:""}
const bank = [
  // Time & Work (5) — tricky ratios, mid-job, pipelines
  {topic:"Time & Work", q:"A, B and C together can finish a job in 12 days. B is twice as efficient as C and A is twice as efficient as B. How many days will A alone take?", opt:["16","18","20","24"], ans:"16"},
  {topic:"Time & Work", q:"A can do a work in 18 days and B in 24 days. They start together but B leaves after 6 days; A completes the rest. Total days taken?", opt:["14","15","16","17"], ans:"16"},
  {topic:"Time & Work", q:"A completes half a job in 10 days. B alone completes the remaining half in 15 days. How long would both take working together to finish the whole job?", opt:["16","15","14","12"], ans:"16"},
  {topic:"Time & Work", q:"A and B can do a job in 8 and 12 days respectively. They work on alternate days starting with A. In how many days will job finish?", opt:["5","6","5.5","6.5"], ans:"5.5"},
  {topic:"Time & Work", q:"Two taps A & B together fill a tank in 10 hours. A alone takes 15 hours. C is an outlet empties in 20 hours. If all open together, net time?", opt:["12","18","30","20"], ans:"12"},

  // Speed & Distance (5) — avg speed with breaks, mixed segments
  {topic:"Speed & Distance", q:"A travels total 300 km: first 120 km at 40 km/h, remaining at 60 km/h. What is the overall average speed (km/h)?", opt:["48","50","52","54"], ans:"50"},
  {topic:"Speed & Distance", q:"A runner runs 10 km at speed v and returns at speed (v-2). If total time is 1h 48m and v>2, find v.", opt:["8","9","10","12"], ans:"10"},
  {topic:"Speed & Distance", q:"A boat covers 24 km downstream in 2h and returns upstream in 3h. Find speed of stream (km/h).", opt:["1","1.5","2","2.5"], ans:"1.5"},
  {topic:"Speed & Distance", q:"A car covers 150 km with occasional stops (total stop time 30 min). Moving speed is 75 km/h. Time for trip (hours)?", opt:["2","2.5","3","3.5"], ans:"2.5"},
  {topic:"Speed & Distance", q:"If speed increases by 25%, time for journey reduces by how much percent (approx)?", opt:["20%","25%","18%","22%"], ans:"20%"},

  // Problems on Trains (5) — relative speed, platform, coach counts
  {topic:"Problems on Trains", q:"A 200 m train crosses a platform in 30s at constant speed. If it crosses the same platform in 20s after increasing speed by 50%, find platform length (m).", opt:["100","150","200","250"], ans:"150"},
  {topic:"Problems on Trains", q:"Two trains 150 m and 250 m moving opposite at 54 km/h and 36 km/h cross in 10s. Confirm their combined length. (m)", opt:["320","360","400","420"], ans:"360"},
  {topic:"Problems on Trains", q:"A train 160 m long overtakes another moving in same direction in 20s. Relative speed is 18 km/h. Find length of second train (m).", opt:["120","140","160","180"], ans:"140"},
  {topic:"Problems on Trains", q:"A train passes a man walking at 6 km/h in 9s and passes a 200 m platform in 36s. Find train length (m).", opt:["120","160","180","200"], ans:"160"},
  {topic:"Problems on Trains", q:"A train running at 72 km/h crosses a platform in 45s. If platform is twice the length of train, find train length (m).", opt:["150","180","200","240"], ans:"200"},

  // Blood Relations (5) — multi-generation, gender flips
  {topic:"Blood Relations", q:"A says: 'B is the only son of the father of my wife.' How is A related to B?", opt:["Father","Son-in-law","Brother-in-law","Uncle"], ans:"Father"},
  {topic:"Blood Relations", q:"P is brother of Q. R is son of Q. S is daughter of P. Relationship between R and S?", opt:["Cousins","Siblings","Uncle-Nephew","Aunt-Niece"], ans:"Cousins"},
  {topic:"Blood Relations", q:"A's mother is B's sister. C is B's son. How is C related to A?", opt:["Brother","Nephew","Cousin","Uncle"], ans:"Cousin"},
  {topic:"Blood Relations", q:"M is father of N. O is daughter of N. P is sister of O. How is P related to M?", opt:["Grand-daughter","Grand-daughter","Grand-daughter","Grand-daughter"], ans:"Grand-daughter"},
  {topic:"Blood Relations", q:"X is son of Y. Z is father of Y. W is daughter of Z. Relation between X and W?", opt:["Brother","Uncle","Nephew","Cousin"], ans:"Nephew"},

  // Tense / Error Detection (5) — subtle aspect and perfect usages
  {topic:"Tense / Error Detection", q:"Find error: 'He has finished his homework yesterday.'", opt:["He","has","finished","yesterday"], ans:"has"},
  {topic:"Tense / Error Detection", q:"Find error: 'She had gone to market yesterday.' (context: action happened yesterday only)", opt:["She","had","gone","yesterday"], ans:"had"},
  {topic:"Tense / Error Detection", q:"Find error: 'I am knowing the answer.'", opt:["I","am","knowing","answer"], ans:"knowing"},
  {topic:"Tense / Error Detection", q:"Find error: 'They will have left by the time you arrive last night.'", opt:["will","have","left","last"], ans:"will"},
  {topic:"Tense / Error Detection", q:"Find error: 'He didn’t went to school.'", opt:["didn’t","went","to","school"], ans:"went"},

  // Sentence Completion (5) — collocation & idiom traps
  {topic:"Sentence Completion", q:"She was so exhausted that she ___ fall asleep instantly.", opt:["could","can","may","would"], ans:"could"},
  {topic:"Sentence Completion", q:"He is keen ___ improving his skills.", opt:["on","in","for","to"], ans:"on"},
  {topic:"Sentence Completion", q:"They insisted that he ___ present at the meeting.", opt:["be","is","was","are"], ans:"be"},
  {topic:"Sentence Completion", q:"I prefer tea ___ coffee in the morning.", opt:["to","than","over","against"], ans:"to"},
  {topic:"Sentence Completion", q:"She is responsible ___ the final report.", opt:["for","to","of","with"], ans:"for"},

  // Synonyms (5) — higher-level choices
  {topic:"Synonyms", q:"Choose the closest synonym of 'Obdurate'.", opt:["Stubborn","Pleasing","Flexible","Timid"], ans:"Stubborn"},
  {topic:"Synonyms", q:"Closest synonym of 'Impetuous'?", opt:["Impulsive","Cautious","Lazy","Mild"], ans:"Impulsive"},
  {topic:"Synonyms", q:"Synonym of 'Abate' in context 'storm will abate'", opt:["Subside","Increase","Endure","Delay"], ans:"Subside"},
  {topic:"Synonyms", q:"Synonym of 'Lethargic'?", opt:["Sluggish","Energetic","Agile","Rapid"], ans:"Sluggish"},
  {topic:"Synonyms", q:"Synonym for 'Esoteric'?", opt:["Obscure","Common","Open","Simple"], ans:"Obscure"},

  // Antonyms (5) — tricky near synonyms present
  {topic:"Antonyms", q:"Antonym of 'Prolific'?", opt:["Barren","Productive","Fertile","Lush"], ans:"Barren"},
  {topic:"Antonyms", q:"Antonym of 'Transient'?", opt:["Temporary","Fleeting","Permanent","Brief"], ans:"Permanent"},
  {topic:"Antonyms", q:"Antonym of 'Amiable'?", opt:["Friendly","Hostile","Welcoming","Affable"], ans:"Hostile"},
  {topic:"Antonyms", q:"Antonym of 'Obsolete'?", opt:["Outdated","Modern","Old","Ancient"], ans:"Modern"},
  {topic:"Antonyms", q:"Antonym of 'Voracious'?", opt:["Gluttonous","Satiated","Ravenous","Hungry"], ans:"Satiated"},

  // Arrange Order / Para-jumbles (5) — subtle connectors & logic
  {topic:"Arrange Order", q:"Arrange into logical order: (P) He forgot to set alarm (Q) He overslept (R) He reached late to office (S) His boss warned him", opt:["P Q R S","Q P R S","P R Q S","P Q S R"], ans:"P Q R S"},
  {topic:"Arrange Order", q:"Arrange: (P) She studied hard (Q) She topped the class (R) Her parents were proud (S) She got a scholarship", opt:["P S Q R","P Q S R","P Q R S","Q P R S"], ans:"P Q R S"},
  {topic:"Arrange Order", q:"Arrange: (P) The rain started (Q) The picnic was cancelled (R) Everyone rushed home (S) The sky turned dark", opt:["S P Q R","P S Q R","P Q R S","S Q P R"], ans:"P S Q R"},
  {topic:"Arrange Order", q:"Arrange: (P) He practiced daily (Q) He won the competition (R) He improved his skill (S) He joined the club", opt:["P R S Q","P S R Q","P R Q S","S P Q R"], ans:"P R S Q"},
  {topic:"Arrange Order", q:"Arrange: (P) The lights went out (Q) People lit candles (R) The storm grew worse (S) Streets were empty", opt:["R P Q S","P Q R S","P R Q S","R Q P S"], ans:"P R Q S"}
];

// =========================
// Build lists
// =========================
const topics = [...new Set(bank.map(b=>b.topic))]; // preserve insertion order
const totalQuestions = bank.length;

// track progress & scores per topic
let currentIndex = 0;
let score = 0;
const topicScores = {};
topics.forEach(t => topicScores[t] = 0);
const topicTotals = {};
topics.forEach(t => topicTotals[t] = bank.filter(b=>b.topic===t).length);

// UI init
qTotalEl.textContent = totalQuestions;

// Helper: format time hh:mm:ss
function fmt(ms){
  const s = Math.max(0, Math.floor(ms/1000));
  const mm = Math.floor(s/60);
  const ss = s%60;
  return `${String(mm).padStart(2,'0')}:${String(ss).padStart(2,'0')}`;
}

// Clock & exam state updater
let examEnded = false;
function tick(){
  const now = new Date();
  clockEl.textContent = now.toLocaleString();
  if(now < startTime){
    // before start
    closedArea.classList.remove('hidden');
    quizArea.classList.add('hidden');
    resultArea.classList.add('hidden');
    statusEl.textContent = `⏳ Test will open at ${startTime.toLocaleTimeString()}.`;
  } else if(now >= startTime && now <= endTime && !examEnded){
    // during test
    closedArea.classList.add('hidden');
    quizArea.classList.remove('hidden');
    resultArea.classList.add('hidden');
    const left = endTime - now;
    statusEl.textContent = `🕒 Time left ${fmt(left)} (ends at ${endTime.toLocaleTimeString()})`;
    // if first second of opening, ensure question loads
    if(currentIndex === 0 && questionTextEl.textContent === '') loadQuestion();
  } else {
    // after end
    if(!examEnded) endTest();
  }
}
setInterval(tick, 500);
tick();

// =========================
// Load a question (by currentIndex)
// =========================
function loadQuestion(){
  if(currentIndex >= totalQuestions){ endTest(); return; }
  const cur = bank[currentIndex];
  topicNameEl.textContent = `${cur.topic}`;
  qIndexEl.textContent = (currentIndex+1);
  qTotalEl.textContent = totalQuestions;
  questionTextEl.textContent = cur.q;
  feedbackEl.textContent = '';
  nextBtn.classList.add('hidden');
  optionsEl.innerHTML = '';

  // create option buttons
  cur.opt.forEach(o => {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = o;
    b.onclick = ()=>handleAnswer(b, cur);
    optionsEl.appendChild(b);
  });
}

// =========================
// Handle answer selection
// =========================
function handleAnswer(button, curQ){
  // disable all options
  [...optionsEl.children].forEach(b => b.disabled = true);
  const chosen = button.textContent;
  const correct = curQ.ans;

  if(chosen === correct){
    button.classList.add('correct');
    feedbackEl.textContent = '✅ Correct';
    score++;
    topicScores[curQ.topic] += 1;
  } else {
    button.classList.add('wrong');
    feedbackEl.textContent = `❌ Wrong — Correct: ${correct}`;
    // highlight correct option visually
    [...optionsEl.children].forEach(b=>{
      if(b.textContent === correct) b.classList.add('correct');
    });
  }
  nextBtn.classList.remove('hidden');
}

// =========================
// Next button & End button
// =========================
nextBtn.onclick = ()=>{
  currentIndex++;
  if(currentIndex < totalQuestions) loadQuestion();
  else endTest();
};

endBtn.onclick = ()=>{
  if(confirm('Are you sure you want to end the test now?')) endTest();
};

// =========================
// End test: show summary, lock interactions
// =========================
function endTest(){
  examEnded = true;
  quizArea.classList.add('hidden');
  closedArea.classList.add('hidden');
  resultArea.classList.remove('hidden');
  finalScoreEl.textContent = `Final Score: ${score} / ${totalQuestions}`;
  breakdownEl.innerHTML = '';
  // topic-wise breakdown
  topics.forEach(t=>{
    const s = topicScores[t] || 0;
    const tot = topicTotals[t] || 0;
    const div = document.createElement('div');
    div.textContent = `${t}: ${s} / ${tot}`;
    breakdownEl.appendChild(div);
  });
  statusEl.textContent = '⏹ Test ended';
}

// restart local: resets all (note: times unchanged)
document.getElementById('restart').onclick = ()=>{
  if(!confirm('Restart test locally? This resets scores but does not change scheduled times.')) return;
  currentIndex = 0; score = 0; examEnded = false;
  Object.keys(topicScores).forEach(k=>topicScores[k]=0);
  questionTextEl.textContent = '';
  loadQuestion();
  resultArea.classList.add('hidden');
  quizArea.classList.remove('hidden');
};

// initial load placeholder
questionTextEl.textContent = '';
