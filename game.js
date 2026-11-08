export function getHint(guess, answer) {
  const sameRow = Math.floor((guess - 1) / 10) === Math.floor((answer - 1) / 10);
  const sameColumn = (guess - 1) % 10 === (answer - 1) % 10;
  return { sameRow, sameColumn };
}

export function calculateScore(seconds) {
  return Math.round(10000 / (1 + Math.max(0, seconds) / 10));
}

export function randomAnswer() {
  // Rejection sampling gives every number the same chance.
  const values = new Uint32Array(1);
  do { crypto.getRandomValues(values); } while (values[0] >= 4294967200);
  return values[0] % 100 + 1;
}
