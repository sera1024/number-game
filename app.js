import { getHint, calculateScore, randomAnswer } from './game.js';

const $ = (id) => document.getElementById(id);
let answer, startedAt, interval, finished = true, attempts = 0;
const tiles = [];

function elapsed() { return (performance.now() - startedAt) / 1000; }
function updateTimer() {
  const tenths = Math.floor(elapsed() * 10);
  $('timer').textContent = `${String(Math.floor(tenths / 600)).padStart(2, '0')}:${String(Math.floor(tenths / 10) % 60).padStart(2, '0')}.${tenths % 10}`;
}

function startGame() {
  clearInterval(interval);
  answer = randomAnswer();
  attempts = 0;
  finished = false;
  $('welcome').hidden = true;
  $('game').hidden = false;
  $('result').hidden = true;
  $('hint-card').hidden = false;
  $('attempts').innerHTML = '0<small>회</small>';
  $('hint-title').textContent = '첫 번째 숫자는?';
  $('hint-icon').textContent = '?';
  $('hint').textContent = '마음에 드는 숫자를 골라주세요.\n정답이 기다리고 있어요.';
  for (const tile of tiles) {
    tile.className = 'tile';
    tile.disabled = false;
    tile.setAttribute('aria-label', `${tile.dataset.number} 선택`);
  }
  startedAt = performance.now();
  updateTimer();
  interval = setInterval(updateTimer, 100);
  tiles[0].focus({ preventScroll: true });
}

function choose(tile, number) {
  if (finished || tile.disabled) return;
  attempts += 1;
  $('attempts').innerHTML = `${attempts}<small>회</small>`;
  if (number === answer) {
    finished = true;
    clearInterval(interval);
    const seconds = elapsed();
    updateTimer();
    tile.classList.add('correct');
    tile.setAttribute('aria-label', `${number}, 정답!`);
    for (const item of tiles) item.disabled = true;
    $('hint-card').hidden = true;
    $('result').hidden = false;
    $('score').innerHTML = `${calculateScore(seconds).toLocaleString('ko-KR')}<small>점</small>`;
    $('result-detail').textContent = `정답 ${answer} · ${seconds.toFixed(1)}초 · ${attempts}회 선택`;
    $('hint').textContent = `정답은 ${answer}입니다!`;
    $('again').focus({ preventScroll: true });
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
