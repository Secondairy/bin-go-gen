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

async function captureAndShare() {
  const shareBtn = document.getElementById("share-btn");
  const originalContent = shareBtn.innerHTML;

  // show loading state
  shareBtn.innerHTML = "<span>Capturing...</span>";
  shareBtn.style.pointerEvents = "none";
  shareBtn.style.opacity = "0.7";

  try {
    // hide footer
    const footer = document.querySelector("footer");

    // keep original visibility value
    const originalFooterVisibility = footer ? footer.style.visibility : "";

    // hide using visibility to maintain layout
    if (footer) footer.style.visibility = "hidden";

    // wait to settle esp for svg shit
    await new Promise((resolve) => setTimeout(resolve, 200));

    // capture image
    const blob = await htmlToImage.toBlob(document.body, {
      quality: 1,
      pixelRatio: 2,
      backgroundColor: getComputedStyle(document.documentElement)
        .getPropertyValue("--body-bg")
        .trim(),
    });

    // restore footer visibility
    if (footer) footer.style.visibility = originalFooterVisibility;

    // reset button state
    shareBtn.innerHTML = originalContent;
    shareBtn.style.pointerEvents = "";
    shareBtn.style.opacity = "";

    // handle the captured blob
    handleImageBlob(blob);
  } catch (error) {
    console.error("Error capturing screenshot:", error);

    // make sure to restore everything
    const footer = document.querySelector("footer");
    if (footer) footer.style.visibility = originalFooterVisibility || "";

    shareBtn.innerHTML = originalContent;
    shareBtn.style.pointerEvents = "";
    shareBtn.style.opacity = "";
    showShareFeedback("Error capturing screenshot", "error");
  }
}

function handleImageBlob(blob) {
  // try copy image to clipboard first
  if (navigator.clipboard && window.ClipboardItem) {
    try {
      const clipboardItem = new ClipboardItem({
        "image/png": blob,
      });

      navigator.clipboard
        .write([clipboardItem])
        .then(() => {
          showShareFeedback("Image copied to clipboard");
        })
        .catch((clipboardError) => {
          console.log("Clipboard image copy failed, trying fallback...");
          handleBlobFallback(blob);
        });
    } catch (error) {
      console.log("ClipboardItem failed, using fallback...");
      handleBlobFallback(blob);
    }
  } else {
    // some browsers don't support clipboard API for images, just download then
    downloadImageFromBlob(blob);
  }
}

function downloadImageFromBlob(blob) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.download = `bingo-board-${new Date().toISOString().slice(0, 10)}.png`;
  link.href = url;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  showShareFeedback("Image downloaded");
}

function showShareFeedback(message, type = "success") {
  const shareBtn = document.getElementById("share-btn");
  if (!shareBtn) return;

  // store the original button content
  const originalContent = shareBtn.innerHTML;
  const originalStyles = shareBtn.style.cssText;

  // create the checkmark SVG with currentColor
  const checkmarkSVG = `
    <svg width="25" height="18" viewBox="0 0 25 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clip-path="url(#clip0_124_511)">
        <path d="M1.29248 8.19841L9.03588 15.8969L23.6849 1.29004" stroke="currentColor" stroke-width="2" stroke-miterlimit="10"/>
      </g>
      <defs>
        <clipPath id="clip0_124_511">
          <rect width="24" height="17" fill="white" transform="translate(0.5 0.5)"/>
        </clipPath>
      </defs>
    </svg>
  `;

  // update button content and styles
  if (type === "success") {
    shareBtn.innerHTML = `
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        ${checkmarkSVG}
        <span>${message}</span>
      </div>
    `;

    // apply success styles
    shareBtn.style.cssText = `
      ${originalStyles}
      background: var(--active-bg);
      color: var(--active-color);
      border-color: var(--active-color);
      cursor: default;
      pointer-events: none;
    `;
  } else {
    shareBtn.innerHTML = `<span>${message}</span>`;
    shareBtn.style.cssText = `
      ${originalStyles}
      background: #dc3545;
      color: white;
      border-color: #dc3545;
      cursor: default;
      pointer-events: none;
    `;
  }

  // restore original button after 5 seconds
  setTimeout(() => {
    shareBtn.innerHTML = originalContent;
    shareBtn.style.cssText = originalStyles;
  }, 5000);
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

// event listener for the share button
document.addEventListener("DOMContentLoaded", () => {
  const shareBtn = document.getElementById("share-btn");
  if (shareBtn) {
    shareBtn.addEventListener("click", captureAndShare);
  }
});

window.addEventListener("DOMContentLoaded", loadConfigAndInit);
