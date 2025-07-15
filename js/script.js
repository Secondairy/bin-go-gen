// js/script.js
import { generateBoard } from "./board.js";

async function loadConfigAndInit() {
  try {
    const resp = await fetch("/config.json");
    if (!resp.ok) throw new Error(`Config fetch failed: ${resp.status}`);
    const config = await resp.json();
    console.log("Config loaded:", config);
    generateBoard(config);
  } catch (err) {
    console.error("Error initializing bingo:", err);
  }
}

function watchForHover() {
  // makes hover/click not look like shit on touch screens
  let lastTouchTime = 0;

  function enableHover() {
    if (new Date() - lastTouchTime < 500) return;
    document.body.classList.add("hasHover");
  }

  function disableHover() {
    document.body.classList.remove("hasHover");
  }

  function updateLastTouchTime() {
    lastTouchTime = new Date();
  }

  document.addEventListener("touchstart", updateLastTouchTime, true);
  document.addEventListener("touchstart", disableHover, true);
  document.addEventListener("mousemove", enableHover, true);

  enableHover();
}

watchForHover();

window.addEventListener("DOMContentLoaded", loadConfigAndInit);
