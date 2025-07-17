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

const toggle = document.getElementById("theme-toggle");
const buttons = toggle.querySelectorAll(".mode-btn");

// apply initial active state from data-theme
function syncActive() {
  const current = document.documentElement.dataset.theme || "dark";
  buttons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.mode === current);
  });
}

// when a mode‐button is clicked
buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const desired = btn.dataset.mode;
    const current = document.documentElement.dataset.theme;
    // if it’s already active, do nothing
    if (desired === current) return;
    // switch theme
    document.documentElement.dataset.theme = desired;
    syncActive();
  });
});

// initialize
syncActive();

watchForHover();

window.addEventListener("DOMContentLoaded", loadConfigAndInit);
