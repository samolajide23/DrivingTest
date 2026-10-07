import './style.css';
import { createIcons, Route, SquarePlay, BookOpen, CarFront, Files, ChevronRight, TriangleAlert, HardDrive, Layers, CircleCheck, RotateCcw, ChartNoAxesCombined, ListFilter, Flag, ArrowRight, Signpost, MessageCircle, Check, X, Bookmark, Eye, Shuffle, ArrowUpRight, Info, Search, ChevronDown, Expand, Trash2 } from 'lucide';
import { questions, signs, controls, technical, signTips } from './data.js';
import { optionsFor, recordAnswer, selectQuestions, studyPlan, improvementSummary, retryQuestion } from './practice.js';

const icons = { Route, SquarePlay, BookOpen, CarFront, Files, ChevronRight, TriangleAlert, HardDrive, Layers, CircleCheck, RotateCcw, ChartNoAxesCombined, ListFilter, Flag, ArrowRight, Signpost, MessageCircle, Check, X, Bookmark, Eye, Shuffle, ArrowUpRight, Info, Search, ChevronDown, Expand, Trash2 };
const app = document.querySelector('#app');
const storageKey = 'road-ready-v1';
const readSaved = () => {
  try {
    const value = JSON.parse(localStorage.getItem(storageKey) || '{}');
    return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  } catch { return {}; }
};
const saved = readSaved();
let progress = Object.fromEntries(Object.entries(saved.progress || {}).filter(([id, value]) => questions.some(question => question.id === id) && value && Number.isFinite(value.attempts) && Number.isFinite(value.streak) && Number.isFinite(value.correct)));
let checks = saved.checks && typeof saved.checks === 'object' ? saved.checks : {};
let view = 'practice';
let category = 'all';
let mode = 'all';
let queue = [];
let position = 0;
let revealed = false;
let answered = false;
let chosen = '';
let options = [];
let sessionCorrect = 0;
let sessionAttempts = 0;
let search = '';
let storageError = false;
let guideOpen = false;
let sessionActive = false;
let sessionMissed = new Set();
let retryScheduled = false;

function save() {
  try { localStorage.setItem(storageKey, JSON.stringify({ progress, checks })); storageError = false; }
  catch { storageError = true; }
}
const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const icon = (name, size = '') => `<i data-lucide="${name}" ${size ? `class="${size}"` : ''}></i>`;
const filtered = () => questions.filter(question => category === 'all' || question.type === category);
const learnedCount = () => questions.filter(question => question.id !== 'sign-9' && progress[question.id]?.streak >= 2).length;
const reviewCount = () => selectQuestions(questions, 'review', progress).length;

function prepare() {
  revealed = false;
  answered = false;
  chosen = '';
  retryScheduled = false;
  options = queue[position]?.type === 'sign' ? optionsFor(queue[position], signs) : [];
}
function start() {
  queue = studyPlan(questions, progress);
  position = 0;
  sessionCorrect = 0;
  sessionAttempts = 0;
  sessionMissed = new Set();
  prepare();
}

function sidebar() {
  const learned = learnedCount();
  return `<aside class="sidebar">
    <a class="brand" href="#" data-action="home"><span class="brand-symbol">${icon('route')}</span><span>road ready<span class="brand-caption">IRELAND / DRIVING PRACTICE</span></span></a>
    <div class="nav-label">YOUR WORKSPACE</div>
    <nav aria-label="Main navigation">${[['practice', 'square-play', 'Study'], ['library', 'book-open', 'Reference']].map(([id, symbol, label]) => `<button class="nav-item ${view === id ? 'active' : ''}" data-view="${id}">${icon(symbol)}<span>${label}</span>${id === 'practice' ? icon('chevron-right') : ''}</button>`).join('')}</nav>
    <div class="sidebar-progress"><span class="nav-label">THE ROAD TO READY</span><div class="progress-number">${learned}<span> / ${questions.length - 1}</span></div><p>Questions learned</p><div class="meter"><span style="width:${learned / (questions.length - 1) * 100}%"></span></div><small>Two correct answers in a row. One disputed source entry is unscored.</small></div>
    <div class="sidebar-bottom"><span class="ireland"><span></span><span></span><span></span></span><span>Irish driving test<br><small>2026 study collection</small></span></div>
  </aside>`;
}

function header() {
  const labels = { practice: ['Your next step', 'A short session, chosen from your progress.'], library: ['Reference', 'Your questions, sign guide and vehicle preparation.'] };
  return `<header class="page-header"><div><div class="eyebrow">LEARNER WORKSPACE <span>/</span> ${view.toUpperCase()}</div><h1>${labels[view][0]}</h1><p>${labels[view][1]}</p></div><div class="save-status">${icon(storageError ? 'triangle-alert' : 'hard-drive')}<span>${storageError ? 'Progress not saved' : 'Progress saved on this device'}</span></div></header>`;
}

function coaching() {
  const areas = improvementSummary(questions, progress);
  const focus = areas.find(area => area.review);
  return `<section class="study-focus" aria-label="Study recommendation"><div><span class="eyebrow">${focus ? 'FOCUS FOR THIS SESSION' : learnedCount() >= 167 ? 'KEEP IT FRESH' : 'BUILD YOUR FOUNDATION'}</span><h2>${focus ? `${focus.label}: ${focus.review} to strengthen` : learnedCount() >= 167 ? 'Revisit what you know' : 'Learn a little, then recall it'}</h2><p>${focus ? 'Your missed answers come first. New questions follow, with a later retry for mistakes.' : 'A balanced mix of signs and oral answers. Two correct recalls in a row mark an answer learned.'}</p></div><div class="area-progress">${areas.map(area => `<div><span>${area.label}</span><strong>${area.learned} / ${area.total} learned</strong><progress value="${area.learned}" max="${area.total}" aria-label="${area.label} learned"></progress></div>`).join('')}</div></section>`;
}

function signGuide() {
  return `<section class="sign-guide" aria-label="Road sign recognition tips"><div class="guide-heading"><h2>${icon('signpost')}Read the sign family</h2><span>REPUBLIC OF IRELAND</span></div><p class="guide-rule">Shape + colour give a clue. The symbol, wording and any plate give the exact meaning. Red does not always mean stop.</p><div class="guide-overview"><span><img src="/media/sign-5.png" alt="Red circle with a prohibited turn" />Red circle: restriction</span><span><img src="/media/sign-132.png" alt="Blue circle with a straight-ahead arrow" />Blue circle: instruction</span><span><img src="/media/sign-70.png" alt="Yellow diamond with a sharp corner" />Yellow diamond: warning</span><span><img src="/media/sign-30.png" alt="Blue hospital information panel" />Rectangle: read the details</span></div><details class="guide-details"><summary>Colours, shapes and common clues ${icon('chevron-down')}</summary><div class="guide-grid">${signTips.map(tip => `<article class="guide-tip"><div class="guide-examples">${tip.examples.map(number => `<img src="/media/sign-${number}.png" alt="Example from source sign ${number}" loading="lazy" />`).join('')}</div><h3>${escape(tip.title)}</h3><strong>${escape(tip.cue)}</strong><p>${escape(tip.text)}</p></article>`).join('')}</div><p class="guide-sources">Study shortcuts, not substitutes for the rules. <a href="https://www.rsa.ie/services/learner-drivers/resources/rules-of-the-road" target="_blank" rel="noopener noreferrer">RSA Rules of the Road</a> &middot; <a href="https://www.gov.ie/en/department-of-transport/publications/traffic-signs-manual/" target="_blank" rel="noopener noreferrer">Department of Transport Traffic Signs Manual</a></p></details></section>`;
}

function filters() {
  return `<div class="practice-toolbar"><div class="tabs" role="group" aria-label="Reference category">${[['all', 'All questions'], ['oral', 'Oral answers'], ['sign', 'Road signs']].map(([id, label]) => `<button data-category="${id}" class="${category === id ? 'selected' : ''}" aria-pressed="${category === id}">${label}</button>`).join('')}</div></div>`;
}

function practiceCard() {
  const question = queue[position];
  if (!sessionActive) return `<section class="question-panel study-start"><img src="/media/sign-70.png" alt="Sharp-corner warning sign" /><div><span class="eyebrow">YOUR NEXT STUDY SESSION</span><h2>${reviewCount() ? 'Strengthen, then move forward' : 'Start with ten questions'}</h2><p>${queue.length} questions selected for you. Say oral answers aloud before revealing them. Missed answers return once later in the session.</p><button class="primary" data-action="begin">${icon('square-play')}Start session</button></div></section>`;
  if (!question) return `<section class="question-panel completion"><span class="completion-icon">${icon('flag')}</span><div class="eyebrow">SESSION COMPLETE</div><h2>${sessionMissed.size ? 'Here is what to revisit' : 'A clear next step'}</h2><p>${sessionCorrect} of ${sessionAttempts} attempts correct, including retries. ${reviewCount()} answers still need strengthening.</p>${sessionMissed.size ? `<ul class="session-recap">${[...sessionMissed].map(id => { const item = questions.find(entry => entry.id === id); return `<li>${item.type === 'sign' ? `<img src="${item.image}" alt="Sign ${item.number}" />` : icon('message-circle')}<span><strong>${item.type === 'sign' ? 'Sign' : 'Oral question'} ${item.number}</strong>${escape(item.type === 'sign' ? item.answer : item.question)}<small>${progress[id]?.streak >= 2 ? 'Learned after retry' : 'Included in your upcoming review'}</small></span></li>`; }).join('')}</ul>` : ''}<p>The next session is planned from your latest results. Take a break when you need one.</p><button class="primary" data-action="restart">Next study session${icon('arrow-right')}</button></section>`;
  const isSign = question.type === 'sign';
  const issue = question.id === 'sign-9';
  return `<section class="question-panel" aria-label="Current question"><div class="question-top"><span class="pill">${icon(isSign ? 'signpost' : 'message-circle')} ${isSign ? 'ROAD SIGNS' : 'ORAL QUESTION'}</span><span class="question-index">${position + 1} <span>/ ${queue.length}</span></span></div><div class="session-meter"><span style="width:${position / queue.length * 100}%"></span></div>
    <div class="question-body ${isSign ? 'sign-question' : ''}"><span class="eyebrow">${isSign ? `SIGN ${question.number} / SOURCE COLLECTION` : `QUESTION ${String(question.number).padStart(2, '0')} / ORAL COLLECTION`}</span><h2>${escape(question.question)}</h2>
    ${isSign ? `<div class="sign-stage"><img src="${question.image}" alt="Road sign ${question.number} to identify" /></div>` : ''}
    ${isSign && !issue ? `<div class="answers">${options.map((answer, index) => `<button class="answer-choice ${answered && answer === question.answer ? 'correct' : ''} ${answered && chosen === answer && chosen !== question.answer ? 'incorrect' : ''}" data-choice="${index}" ${answered ? 'disabled' : ''}><span class="choice-letter">${String.fromCharCode(65 + index)}</span><span>${escape(answer)}</span>${answered && answer === question.answer ? icon('check') : answered && chosen === answer ? icon('x') : ''}</button>`).join('')}</div>`
      : revealed ? `<div class="revealed-answer"><span class="eyebrow">SUPPLIED ANSWER</span><p>${escape(question.answer)}</p></div>` : `<div class="recall-space"><span class="recall-icon">${icon('message-circle')}</span><span>${issue ? 'Source answer needs verification' : 'Recall your answer'}</span></div>`}
    ${question.note && (revealed || answered || issue) ? `<div class="source-note">${icon('triangle-alert')}<p>${escape(question.note)}</p></div>` : ''}
    <div class="feedback" role="status">${answered ? `${icon(progress[question.id]?.lastCorrect ? 'circle-check' : 'rotate-ccw')}<span>${progress[question.id]?.lastCorrect ? progress[question.id].streak >= 2 ? 'Learned: two correct recalls in a row.' : 'Correct. One more correct recall will mark this learned.' : `Read the correct answer, then recall it without looking. ${retryScheduled ? 'You will retry this later in this session.' : 'This stays in your next review.'}`}</span>` : ''}</div>
    ${answered && !progress[question.id]?.lastCorrect && isSign ? (() => { const tip = signTips.find(entry => entry.examples.includes(question.number)); return tip ? `<div class="targeted-tip"><strong>${escape(tip.title)}</strong><p>${escape(tip.text)}</p></div>` : ''; })() : ''}
    </div><footer class="question-footer"><span>${icon('bookmark')} ${progress[question.id]?.streak >= 2 ? 'Learned' : progress[question.id]?.attempts ? 'In progress' : 'Not practised yet'}</span><div class="footer-actions">${answered || (issue && revealed) ? `<button class="primary" data-action="next">${position === queue.length - 1 ? 'Finish session' : 'Next question'}${icon('arrow-right')}</button>` : !isSign || issue ? revealed ? `<button class="secondary" data-rate="miss">${icon('rotate-ccw')}Needs practice</button><button class="primary" data-rate="correct">${icon('check')}Got it right</button>` : `<button class="primary" data-action="reveal">${icon('eye')}Reveal answer</button>` : `<span class="footer-hint">Choose an answer above</span>`}</div></footer></section>`;
}

function practiceAside() {
  return `<aside class="practice-aside"><div class="session-info"><div class="eyebrow">THIS SESSION</div><h3>${mode === 'review' ? 'A second look' : 'One question at a time'}</h3><div class="session-row"><span>Answered</span><strong>${sessionAttempts}</strong></div><div class="session-row"><span>Correct</span><strong>${sessionCorrect}</strong></div><div class="session-row"><span>Remaining</span><strong>${Math.max(0, queue.length - position - Number(answered))}</strong></div><button class="text-button" data-action="restart">${icon('shuffle')}Shuffle and restart</button></div><div class="collection-preview"><img src="/media/signs-image1.png" alt="Original numbered Irish road-sign study sheet" /><div><span class="eyebrow">YOUR STUDY COLLECTION</span><h3>Every sign. Every question.</h3><p>28 oral questions and 140 signs &amp; markings from your sheets.</p><button class="text-button" data-view="sources">Open study sheets ${icon('arrow-up-right')}</button></div></div><div class="source-reminder">${icon('info')}<p>Based on your supplied sample sheets. Check current <a href="https://www.rsa.ie/services/learner-drivers/resources/rules-of-the-road" target="_blank" rel="noopener noreferrer">RSA guidance</a> for official rules.</p></div></aside>`;
}

function library() {
  const matches = filtered().filter(question => `${question.question} ${question.answer} ${question.number}`.toLowerCase().includes(search.toLowerCase()));
  return `${filters()}<div class="library-tools"><label class="search">${icon('search')}<input id="search" type="search" placeholder="Search questions and signs" value="${escape(search)}" /></label><span>${matches.length} entries</span></div><div class="library-list">${matches.map(question => `<details class="library-item"><summary>${question.type === 'sign' ? `<img src="${question.image}" alt="Sign ${question.number}" />` : `<span class="library-number">${String(question.number).padStart(2, '0')}</span>`}<span><small>${question.type === 'sign' ? 'SIGN' : 'ORAL'} ${question.number}</small>${escape(question.type === 'sign' ? question.answer : question.question)}</span>${icon('chevron-down')}</summary><div class="library-detail"><p>${escape(question.answer)}</p>${question.note ? `<div class="source-note">${icon('triangle-alert')}<p>${escape(question.note)}</p></div>` : ''}<button class="text-button" data-practice="${question.id}">Practise this question ${icon('arrow-right')}</button></div></details>`).join('') || '<p class="empty">No matching questions.</p>'}</div>`;
}

function checksPage() {
  return `<div class="checks-layout"><div>${[['Secondary controls', controls, 'control'], ['Technical checks', technical, 'technical']].map(([title, items, prefix]) => `<section class="check-section"><div class="eyebrow">VEHICLE PREPARATION</div><h2>${title}</h2>${items.map((item, index) => `<label class="check-row"><input type="checkbox" data-check="${prefix}-${index}" ${checks[`${prefix}-${index}`] ? 'checked' : ''} /><span>${escape(item)}</span></label>`).join('')}</section>`).join('')}</div><aside class="technical-image"><h3>Under the bonnet</h3><img src="/media/checks-image2.jpeg" alt="Original technical-check illustration from your driving-test document" /><p>Use your own vehicle handbook and instructor's advice. Layouts and checks vary between cars.</p></aside></div>`;
}

function sourcesPage() {
  return `<div class="source-intro">${icon('files')}<p>Original sheets from the two documents you supplied. All numbered entries are included; the source skips number 69. Source answer wording is retained with minor spacing corrections.</p></div><div class="sheets">${[1, 2, 3, 4].map((number, index) => `<section><div class="sheet-heading"><h3>${['Signs & markings 1-68', 'Answer key 1-68', 'Signs 70-141', 'Answer key 70-141'][index]}</h3><a href="/media/signs-image${number}.png" target="_blank" rel="noopener" aria-label="Open sheet ${number} full size">${icon('expand')}</a></div><a href="/media/signs-image${number}.png" target="_blank" rel="noopener"><img src="/media/signs-image${number}.png" alt="${['Original road signs 1 through 68', 'Original answers 1 through 68', 'Original road signs 70 through 141', 'Original answers 70 through 141'][index]}" /></a></section>`).join('')}</div>`;
}

function render() {
  const guide = app.querySelector('.guide-details');
  if (guide) guideOpen = guide.open;
  app.innerHTML = `${sidebar()}<main>${header()}${view === 'practice' ? `${coaching()}${practiceCard()}` : `${library()}<details class="reference-section"><summary>Sign recognition guide ${icon('chevron-down')}</summary>${signGuide()}</details><details class="reference-section"><summary>Vehicle preparation ${icon('chevron-down')}</summary>${checksPage()}</details><details class="reference-section"><summary>Original study sheets ${icon('chevron-down')}</summary>${sourcesPage()}</details>`}<footer class="page-footer"><span>Practice results are not a test-readiness assessment. <a href="https://www.rsa.ie/services/learner-drivers/resources/rules-of-the-road" target="_blank" rel="noopener noreferrer">RSA rules</a></span><details><summary>Progress settings</summary><button class="text-button" data-action="reset">${icon('trash-2')}Reset progress</button></details></footer></main>`;
  const renderedGuide = app.querySelector('.guide-details');
  if (renderedGuide) renderedGuide.open = guideOpen;
  createIcons({ icons });
}

app.addEventListener('click', event => {
  const button = event.target.closest('[data-action], [data-view], [data-category], [data-choice], [data-rate], [data-practice]');
  if (!button) return;
  if (button.dataset.view) { view = button.dataset.view; render(); return; }
  if (button.dataset.category) { category = button.dataset.category; render(); return; }
  if (button.dataset.practice) {
    view = 'practice'; queue = [questions.find(question => question.id === button.dataset.practice)]; sessionActive = true; sessionMissed = new Set(); position = 0; sessionAttempts = 0; sessionCorrect = 0; prepare(); render(); return;
  }
  const question = queue[position];
  if (button.dataset.choice !== undefined && question && !answered) {
    chosen = options[Number(button.dataset.choice)];
    score(chosen === question.answer);
  } else if (button.dataset.rate && question && !answered) { score(button.dataset.rate === 'correct'); }
  else if (button.dataset.action === 'reveal') revealed = true;
  else if (button.dataset.action === 'next') { position++; prepare(); }
  else if (button.dataset.action === 'begin') { start(); sessionActive = true; }
  else if (button.dataset.action === 'restart') { start(); sessionActive = true; }
  else if (button.dataset.action === 'home') { event.preventDefault(); view = 'practice'; }
  else if (button.dataset.action === 'reset') {
    if (!confirm('Reset all saved question progress and vehicle checklists on this device?')) return;
    progress = {}; checks = {}; sessionActive = false; save(); start();
  }
  render();
});
function score(correct) {
  const question = queue[position];
  if (question.id === 'sign-9') return;
  progress = recordAnswer(progress, question.id, correct);
  const updatedQueue = retryQuestion(queue, position, correct);
  retryScheduled = updatedQueue.length > queue.length;
  queue = updatedQueue;
  if (!correct) sessionMissed.add(question.id);
  answered = true;
  sessionAttempts++;
  sessionCorrect += Number(correct);
  save();
}
app.addEventListener('change', event => {
  if (event.target.id === 'mode') { mode = event.target.value; start(); render(); }
  if (event.target.dataset.check) { checks[event.target.dataset.check] = event.target.checked; save(); }
});
app.addEventListener('input', event => {
  if (event.target.id !== 'search') return;
  search = event.target.value;
  const caret = event.target.selectionStart;
  render();
  const input = document.querySelector('#search');
  input.focus();
  if (input.type !== 'search') input.setSelectionRange(caret, caret);
});
start();
render();