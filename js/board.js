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

    if (hasFree && i === center) {
      cell.classList.add("free");
    }

    const txtWrap = document.createElement("div");
    txtWrap.className = "cell-text";
    // free spot gets a blank, or picks.shift() otherwise
    txtWrap.textContent =
      hasFree && i === Math.floor(total / 2) ? "" : picks.shift();
    cell.append(txtWrap);

    cell.addEventListener("click", () => cell.classList.toggle("marked"));

    container.append(cell);
  }
  requestAnimationFrame(() => {
    container.querySelectorAll(".cell").forEach(fitText);
  });
}
function fitText(cell) {
  // cell must be a real HTMLElement (i think free space was giving issues)
  if (!(cell instanceof Element)) return;

  // find the inner text node
  const txt = cell.querySelector(".cell-text");
  if (!(txt instanceof Element)) return;

  const style = getComputedStyle(txt);
  const cellStyle = getComputedStyle(cell);
  let fontSize = parseFloat(style.fontSize); // px
  let letterSpacing = parseFloat(style.letterSpacing) || 0; // px

  // calculate padding to subtract from available space
  const paddingLeft = parseFloat(cellStyle.paddingLeft) || 0;
  const paddingRight = parseFloat(cellStyle.paddingRight) || 0;
  const paddingTop = parseFloat(cellStyle.paddingTop) || 0;
  const paddingBottom = parseFloat(cellStyle.paddingBottom) || 0;

  // figure out the available size (excluding padding)
  const availWidth = cell.clientWidth - paddingLeft - paddingRight;
  const availHeight = cell.clientHeight - paddingTop - paddingBottom;

  /*
  // temp force single-line to tighten kerning
  txt.style.whiteSpace = "nowrap";

  // tighten letterSpacing in 0.5px steps
  const minLS = -0.02 * fontSize;
  while (txt.scrollWidth > availWidth && letterSpacing > minLS) {
    letterSpacing -= 0.5;
    txt.style.letterSpacing = letterSpacing + "px";
  }
    */

  // Check if text still overflows
  const stillOverflows = txt.scrollWidth > availWidth;

  // allow wrapping again
  txt.style.whiteSpace = "";

  // shrink fontSize if text still overflows OR if height is too big
  const minFS = fontSize * 0.5;
  while (
    (stillOverflows || txt.scrollHeight > availHeight) &&
    fontSize > minFS
  ) {
    fontSize -= 1;
    txt.style.fontSize = fontSize + "px";
    fontSize = parseFloat(getComputedStyle(txt).fontSize);

    // check height after font size change
    if (txt.scrollHeight <= availHeight) {
      break;
    }
  }

  // allow wrapping again
  txt.style.whiteSpace = "";
}
