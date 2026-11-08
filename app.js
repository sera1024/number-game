import { getHint, calculateScore, randomAnswer } from './game.js';

const $ = (id) => document.getElementById(id);
const RECORD_KEY = 'number-game.records.v1';
let records = { classic: 0, attack: 0 };
let storageAvailable = true;
try {
  const saved = JSON.parse(localStorage.getItem(RECORD_KEY));
  for (const mode of ['classic', 'attack']) {
    if (Number.isSafeInteger(saved?.[mode]) && saved[mode] >= 0) records[mode] = saved[mode];
  }
} catch { storageAvailable = false; }
let answer, startedAt, interval, nextRound, mode = 'classic';
let finished = true, transitioning = false, attempts = 0, solved = 0;
const tiles = [];
const elapsed = () => (performance.now() - startedAt) / 1000;
const remaining = () => Math.max(0, 60 - elapsed());

function showRecords() {
  $('best-home').textContent = `나의 최고기록 · 클래식 ${records.classic.toLocaleString('ko-KR')}점 / 타임 어택 ${records.attack}개`;
  $('best-game').textContent = `최고기록 ${records.attack}개`;
}
function saveRecord(value) {
  const improved = value > records[mode];
  records[mode] = Math.max(records[mode], value);
  try { localStorage.setItem(RECORD_KEY, JSON.stringify(records)); storageAvailable = true; }
  catch { storageAvailable = false; }
  showRecords();
  $('record-status').textContent = `${improved ? '새로운 최고기록! ' : ''}최고기록 ${records[mode].toLocaleString('ko-KR')}${mode === 'attack' ? '개' : '점'}${storageAvailable ? ' · 이 브라우저에 저장했어요.' : ' · 브라우저 저장이 차단되어 이번 방문에만 유지돼요.'}`;
}
function updateTimer() {
  const tenths = Math.floor((mode === 'attack' ? remaining() : elapsed()) * 10);
  $('timer').textContent = `${String(Math.floor(tenths / 600)).padStart(2, '0')}:${String(Math.floor(tenths / 10) % 60).padStart(2, '0')}.${tenths % 10}`;
  $('timer').classList.toggle('urgent', mode === 'attack' && remaining() <= 10);
}
function finish(seconds = elapsed()) {
  finished = true;
  transitioning = false;
  clearInterval(interval);
  clearTimeout(nextRound);
  updateTimer();
  for (const tile of tiles) tile.disabled = true;
  $('hint-card').hidden = true;
  $('result').hidden = false;
  $('result-title').textContent = mode === 'attack' ? '60초 도전 완료! 🎉' : '정답을 찾았어요 🎉';
  const score = mode === 'attack' ? solved : calculateScore(seconds);
  $('score').innerHTML = `${score.toLocaleString('ko-KR')}<small>${mode === 'attack' ? '개' : '점'}</small>`;
  $('result-detail').textContent = mode === 'attack' ? `60초 동안 ${solved}개 정답 · ${attempts}회 선택` : `정답 ${answer} · ${seconds.toFixed(1)}초 · ${attempts}회 선택`;
  saveRecord(score);
  $('again').focus({ preventScroll: true });
}
function tick() {
  if (finished) return;
  if (mode === 'attack' && remaining() <= 0) finish();
  else updateTimer();
}
function newBoard() {
  answer = randomAnswer();
  transitioning = false;
  $('hint-title').textContent = '숨어 있는 숫자를 찾아보세요';
  $('hint-icon').textContent = '?';
  $('hint').textContent = '마음에 드는 숫자를 골라주세요.\n정답이 기다리고 있어요.';
  for (const tile of tiles) {
    tile.className = 'tile';
    tile.disabled = false;
    tile.setAttribute('aria-label', `${tile.dataset.number} 선택`);
  }
  tiles[0].focus({ preventScroll: true });
}
function startGame() {
  clearInterval(interval);
  clearTimeout(nextRound);
  mode = document.querySelector('input[name="mode"]:checked').value;
  attempts = 0;
  solved = 0;
  finished = false;
  $('welcome').hidden = true;
  $('game').hidden = false;
  $('result').hidden = true;
  $('hint-card').hidden = false;
  $('attempts').innerHTML = '0<small>회</small>';
  $('solved').textContent = '0개';
  $('time-label').textContent = mode === 'attack' ? '남은 시간' : '플레이 시간';
  $('attack-progress').hidden = mode !== 'attack';
  $('score-note').hidden = mode === 'attack';
  document.querySelector('.game-heading h1').textContent = mode === 'attack' ? '60초, 몇 개나 찾을 수 있을까요?' : '어떤 숫자가 숨어 있을까요?';
  document.querySelector('.game-heading p').textContent = mode === 'attack' ? '정답을 맞히면 새 숫자로 이어져요. 전환 중에도 시간은 흘러요.' : '하나를 골라보세요. 힌트가 길을 알려줄 거예요.';
  newBoard();
  startedAt = performance.now();
  updateTimer();
  interval = setInterval(tick, 100);
}
function choose(tile, number) {
  if (finished) return;
  // Check the deadline on input too, even if a background tab delayed the timer.
  if (mode === 'attack' && remaining() <= 0) { finish(); return; }
  if (transitioning || tile.disabled) return;
  attempts += 1;
  $('attempts').innerHTML = `${attempts}<small>회</small>`;
  if (number === answer) {
    tile.classList.add('correct');
    tile.setAttribute('aria-label', `${number}, 정답!`);
    if (mode === 'classic') { finish(); return; }
    solved += 1;
    $('solved').textContent = `${solved}개`;
    // Persist immediately so leaving or reloading does not lose a new best.
    saveRecord(solved);
    transitioning = true;
    for (const item of tiles) item.disabled = true;
    $('hint-icon').textContent = '✓';
    $('hint-title').textContent = '정답! 다음 숫자로';
    $('hint').textContent = `${number}이(가) 정답이에요.\n잠시 후 새 보드가 열려요!`;
    nextRound = setTimeout(() => {
      if (finished) return;
      if (remaining() <= 0) finish();
      else newBoard();
    }, 350);
    return;
  }
  const { sameRow, sameColumn } = getHint(number, answer);
  tile.classList.add('miss');
  tile.disabled = true;
  tile.setAttribute('aria-label', `${number}, 오답`);
  $('hint-icon').textContent = sameRow ? '↔' : sameColumn ? '↕' : '↗';
  $('hint-title').textContent = sameRow ? '같은 행에 있어요!' : sameColumn ? '같은 열에 있어요!' : '다른 곳에 숨어 있어요';
  $('hint').textContent = `${number}은(는) 정답이 아니에요.\n같은 행: ${sameRow ? '맞아요 ✓' : '아니에요'} · 같은 열: ${sameColumn ? '맞아요 ✓' : '아니에요'}`;
}
for (let number = 1; number <= 100; number++) {
  const tile = document.createElement('button');
  tile.type = 'button';
  tile.className = 'tile';
  tile.textContent = number;
  tile.dataset.number = number;
  tile.addEventListener('click', () => choose(tile, number));
  tiles.push(tile);
  $('board').append(tile);
}
$('start').addEventListener('click', startGame);
$('restart').addEventListener('click', startGame);
$('again').addEventListener('click', startGame);
$('home').addEventListener('click', () => {
  finished = true;
  clearInterval(interval);
  clearTimeout(nextRound);
  $('game').hidden = true;
  $('welcome').hidden = false;
  $('start').focus({ preventScroll: true });
});
document.addEventListener('visibilitychange', () => { if (!document.hidden) tick(); });
showRecords();
