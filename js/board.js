// js/board.js
export function generateBoard(cfg) {
  const N = cfg.boardSize;
  const total = N * N;
  const hasFree = cfg.freeSpot && N % 2 === 1;
  const cellsNeeded = total - (hasFree ? 1 : 0);

  // helper fns
  const shuffle = (arr) => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  };
  const pickOne = (groups) =>
    groups.map((g) => g[Math.floor(Math.random() * g.length)]);
  // check config
  if (typeof cfg.items.any === "undefined") {
    cfg.items.any = [];
  }
  if (typeof cfg.items.singles_can === "undefined") {
    cfg.items.singles_can = [];
  }
  if (typeof cfg.items.singles_must === "undefined") {
    cfg.items.singles_must = [];
  }
  // build picks
  let picks = [];
  picks.push(...pickOne(cfg.items.singles_must));

  const canCandidates = pickOne(cfg.items.singles_can);
  const pool = [...cfg.items.any, ...canCandidates];

  while (picks.length < cellsNeeded) {
    const current_idx = Math.floor(Math.random() * pool.length);
    picks.push(pool[current_idx]);
    pool.splice(current_idx, 1);

    if (pool.length === 0 && picks.length < cellsNeeded) {
      throw new Error(
        `Not enough unique items to fill ${cellsNeeded} cells, pool exhausted.`
      );
    }
  }
  shuffle(picks);

  // render
  const container = document.getElementById("bingo");
  container.style.setProperty("--n", cfg.boardSize);
  container.innerHTML = "";

  for (let i = 0; i < total; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    // place free in center if applicable
    const center = Math.floor(total / 2);
    cell.textContent = hasFree && i === center ? " " : picks.shift();

    if (hasFree && i === center) {
      cell.classList.add("free");
    }
    cell.addEventListener("click", () => cell.classList.toggle("marked"));

    container.append(cell);
  }
}
