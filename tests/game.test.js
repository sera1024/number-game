import test from 'node:test';
import assert from 'node:assert/strict';
import { getHint, calculateScore, randomAnswer } from '../game.js';

test('행과 열 힌트: 첫 행, 마지막 행, 10과 11 경계', () => {
  assert.deepEqual(getHint(1, 10), { sameRow: true, sameColumn: false });
  assert.deepEqual(getHint(1, 91), { sameRow: false, sameColumn: true });
  assert.deepEqual(getHint(10, 11), { sameRow: false, sameColumn: false });
  assert.deepEqual(getHint(91, 100), { sameRow: true, sameColumn: false });
  assert.deepEqual(getHint(10, 100), { sameRow: false, sameColumn: true });
});
test('빠를수록 높은 점수, 0초와 긴 소요 시간 처리', () => {
  assert.equal(calculateScore(0), 10000);
  assert.equal(calculateScore(10), 5000);
  assert.ok(calculateScore(20) < calculateScore(10));
  assert.ok(calculateScore(3600) >= 0);
});
test('무작위 정답은 1부터 100까지 정수', () => {
  for (let i = 0; i < 1000; i++) {
    const answer = randomAnswer();
    assert.ok(Number.isInteger(answer) && answer >= 1 && answer <= 100);
  }
});
