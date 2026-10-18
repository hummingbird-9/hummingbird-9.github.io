/**
 * Humming[bird]Tech Infrastructure Utility Suite
 * Safe, Optimized Dynamic Workspace Handling
 */

document.addEventListener("DOMContentLoaded", () => {
  initThemeEngine();
  injectErudaConsole();
});

// --- Theme Management System ---
function initThemeEngine() {
  const currentTheme = localStorage.getItem("theme") || "dark";
  document.documentElement.setAttribute("data-theme", currentTheme);
  updateThemeButtonText(currentTheme);
}

function toggleTheme() {
  const targetTheme = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", targetTheme);
  localStorage.setItem("theme", targetTheme);
  updateThemeButtonText(targetTheme);
}

function updateThemeButtonText(theme) {
  const btn = document.getElementById("themeToggleBtn");
  if (btn) {
    btn.innerText = theme === "dark" ? "Light Mode" : "Dark Mode";
  }
}

// --- Production Eruda Engine Integration ---
function injectErudaConsole() {
  // Pulls standard development tool emulation environment
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/eruda@3.4.3/eruda.min.js';
  script.onload = function () {
    eruda.init({
      theme: document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark",
      defaults: {
        displaySize: 45,
        transparency: 95,
        theme: 'Monokai'
      }
    });
    // Remove the default floating cog button to keep your custom navigation clean
    const erudaEntry = document.querySelector('.eruda-entry-btn');
    if (erudaEntry) erudaEntry.style.display = 'none';
  };
  document.head.appendChild(script);
}

function toggleDevConsole() {
  if (typeof eruda !== 'undefined') {
    eruda.show();
  } else {
    console.warn("DevTools engine still preparing runtime modules.");
  }
}
