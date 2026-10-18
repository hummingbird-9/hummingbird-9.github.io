/**
 * Humming[bird]Tech Engineering System Kernel - Part 1
 * Multi-Engine Architecture for Advanced ChromeOS Performance Benchmarking
 */

document.addEventListener("DOMContentLoaded", () => {
  initChronographTheme();
  injectCustomContextMenuShell();
  injectHardwareProfilerHUD();
  
  // Checks persistent storage state configurations cleanly on window launch loops
  if (localStorage.getItem("extreme_lightweight") === "true") {
    applyLightweightUIAdjustments();
  } else {
    loadErudaDevToolsEngine(false);
  }
});

// --- Fixed Inactive Theme Loop Buttons Configuration ---
function initChronographTheme() {
  const btn = document.getElementById("themeToggleBtn");
  if (btn) btn.innerText = "Theme Locked";
}

function toggleTheme() {
  console.log("Style attributes locked via infrastructure performance optimization profiles.");
}

// --- Toggle Performance Engine Matrix Profiles ---
function toggleLightweightEngine() {
  const currentSetting = localStorage.getItem("extreme_lightweight") === "true";
  localStorage.setItem("extreme_lightweight", !currentSetting);
  window.location.reload(); // Refresh viewport pipeline environment
}

function applyLightweightUIAdjustments() {
  const b = document.getElementById("lightweightToggleBtn");
  if (b) {
    b.style.background = "#ff3b30";
    b.innerText = "Lightweight Active";
  }
}

// --- Eruda Development Tools Core Injection Pipeline ---
function loadErudaDevToolsEngine(triggerImmediately) {
  if (window.eruda) {
    if (triggerImmediately) window.eruda.show();
    return;
  }
  
  const script = document.createElement("script");
  script.src = "https://jsdelivr.net";
  script.async = true;
  script.onload = () => {
    eruda.init({
      theme: 'dark',
      defaults: { displaySize: 42, transparency: 95 }
    });
    const erudaButton = document.querySelector(".eruda-entry-btn");
    if (erudaButton) erudaButton.style.display = "none";
    if (triggerImmediately) eruda.show();
  };
  document.head.appendChild(script);
}

// --- Custom Right-Click Context Menu Shell ---
function injectCustomContextMenuShell() {
  const menuHTML = `
    <div id="customContextMenu" class="custom-context-menu">
      <div class="context-item" onclick="window.history.back()">Back</div>
      <div class="context-item" onclick="window.history.forward()">Forward</div>
      <div class="context-item" onclick="window.location.reload()">Reload</div>
      <div class="context-divider"></div>
      <div class="context-item" onclick="window.print()">Print...</div>
      <div class="context-item" onclick="triggerPageSaveAsOperation()">Save As...</div>
      <div class="context-item" onclick="triggerGoogleSearchQuery()">Search with Google</div>
      <div class="context-divider"></div>
      <div class="context-item context-accent" onclick="loadErudaDevToolsEngine(true)">Inspect Element (Eruda)</div>
    </div>
  `;
  document.body.insertAdjacentHTML("beforeend", menuHTML);
  
  const menu = document.getElementById("customContextMenu");
  
  document.oncontextmenu = function(e) {
    e.preventDefault();
    menu.style.top = `${e.clientY}px`;
    menu.style.left = `${e.clientX}px`;
    menu.style.display = "block";
    return false; 
  };
  
  window.addEventListener("click", () => {
    menu.style.display = "none";
  });
}

function triggerPageSaveAsOperation() {
  const blob = new Blob([document.documentElement.outerHTML], { type: "text/html" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "page_source.html";
  a.click();
}

function triggerGoogleSearchQuery() {
  const text = window.getSelection().toString() || "HummingbirdTech";
  window.open(`https://google.com{encodeURIComponent(text)}`, "_blank");
}
// --- Humming[bird]Tech Engineering System Kernel - Part 2 ---

let fpsTicks = 0, lastFpsUpdate = performance.now(), currentComputedFps = 60;
let observedErrorsCount = 0, lastErrorMessage = "None";
let hardwareStressWorkers = [];
let isStressTestActive = false;
let currentNetworkPing = "Calculating...";

window.addEventListener("error", (e) => {
  observedErrorsCount++;
  lastErrorMessage = e.message;
  updateProfilerDisplayData();
});

function calculateRunningFps() {
  fpsTicks++;
  const now = performance.now();
  if (now >= lastFpsUpdate + 1000) {
    currentComputedFps = Math.round((fpsTicks * 1000) / (now - lastFpsUpdate));
    fpsTicks = 0;
    lastFpsUpdate = now;
    updateProfilerDisplayData();
  }
  requestAnimationFrame(calculateRunningFps);
}

async function measureNetworkLatency() {
  const targetEndpoint = "https://jsdelivr.net";
  const startTime = performance.now();
  
  try {
    await fetch(`${targetEndpoint}?cache_buster=${startTime}`, { method: 'HEAD', cache: 'no-store' });
    currentNetworkPing = `${Math.round(performance.now() - startTime)} ms`;
  } catch (error) {
    currentNetworkPing = "Offline / Blocked";
  }
  updateProfilerDisplayData();
}

function toggleHardwareStressTest() {
  const btn = document.getElementById("stressTestBtn");
  if (!isStressTestActive) {
    isStressTestActive = true;
    btn.innerText = "Halt Stress Test";
    btn.classList.add("active");
    
    const threads = navigator.hardwareConcurrency || 4;
    for (let i = 0; i < threads; i++) {
      const workerBlob = new Blob([`
        onmessage = function() {
          while(true) { Math.sqrt(Math.random() * Math.random()); }
        };
      `], { type: "text/javascript" });
      
      const worker = new Worker(URL.createObjectURL(workerBlob));
      worker.postMessage("start");
      hardwareStressWorkers.push(worker);
    }
  } else {
    isStressTestActive = false;
    btn.innerText = "Trigger Stress Test";
    btn.classList.remove("active");
    
    hardwareStressWorkers.forEach(w => w.terminate());
    hardwareStressWorkers = [];
  }
}

function injectHardwareProfilerHUD() {
  const hudHTML = `
    <div id="hardwareProfilerHUD" class="hardware-profiler-hud">
      <div class="profiler-header">
        <span>Hardware Diagnostics</span>
        <span style="cursor:pointer;color:#ff5f56;" onclick="toggleHardwareProfilerOverlay()">[X]</span>
      </div>
      
      <div class="stress-btn-container">
        <button id="stressTestBtn" class="stress-trigger-btn" onclick="toggleHardwareStressTest()">Trigger Stress Test</button>
      </div>

      <div id="metricCpu" class="profiler-metric-row">CPU Cores: Loading...</div>
      <div id="metricRam" class="profiler-metric-row">Memory Heap: Loading...</div>
      <div id="metricFps" class="profiler-metric-row">Performance: Loading...</div>
      <div id="metricDom" class="profiler-metric-row">DOM Elements: Loading...</div>
      <div id="metricPing" class="profiler-metric-row">Network Ping: Loading...</div>
      <div id="metricErrors" class="profiler-metric-row" style="color:#ff5f56;">Errors: 0</div>
      
      <div class="profiler-selector-box">
        <span style="font-size:0.75rem;font-weight:bold;display:block;margin-bottom:4px;">Filter HUD Views:</span>
        <label><input type="checkbox" id="chkCpu" checked onclick="filterHudRows()"> Virtual CPU Cores</label>
        <label><input type="checkbox" id="chkRam" checked onclick="filterHudRows()"> Memory Allocation</label>
        <label><input type="checkbox" id="chkFps" checked onclick="filterHudRows()"> Frame Rate (FPS)</label>
        <label><input type="checkbox" id="chkDom" checked onclick="filterHudRows()"> DOM Structural Load</label>
        <label><input type="checkbox" id="chkPing" checked onclick="filterHudRows()"> Network Latency</label>
        <label><input type="checkbox" id="chkErrors" checked onclick="filterHudRows()"> Error Telemetry</label>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML("beforeend", hudHTML);
  requestAnimationFrame(calculateRunningFps);
  
  setInterval(updateProfilerDisplayData, 2000);
  setInterval(measureNetworkLatency, 5000);
  measureNetworkLatency(); 
}

function toggleHardwareProfilerOverlay() {
  const hud = document.getElementById("hardwareProfilerHUD");
  hud.style.display = (hud.style.display === "block") ? "none" : "block";
  updateProfilerDisplayData();
}

function filterHudRows() {
  document.getElementById("metricCpu").style.display = document.getElementById("chkCpu").checked ? "block" : "none";
  document.getElementById("metricRam").style.display = document.getElementById("chkRam").checked ? "block" : "none";
  document.getElementById("metricFps").style.display = document.getElementById("chkFps").checked ? "block" : "none";
  document.getElementById("metricDom").style.display = document.getElementById("chkDom").checked ? "block" : "none";
  document.getElementById("metricPing").style.display = document.getElementById("chkPing").checked ? "block" : "none";
  document.getElementById("metricErrors").style.display = document.getElementById("chkErrors").checked ? "block" : "none";
}

function updateProfilerDisplayData() {
  const cores = navigator.hardwareConcurrency || "Unsupported Architecture";
  document.getElementById("metricCpu").innerText = `CPU Cores: ${cores} Logical Nodes`;

  if (performance.memory) {
    const memoryUsed = Math.round(performance.memory.usedJSHeapSize / (1024 * 1024));
    const memoryTotal = Math.round(performance.memory.jsHeapSizeLimit / (1024 * 1024));
    document.getElementById("metricRam").innerText = `Memory Heap: ${memoryUsed}MB / ${memoryTotal}MB`;
  } else {
    document.getElementById("metricRam").innerText = `Memory Heap: API Locked (Chrome/ChromeOS Exclusive)`;
  }

  document.getElementById("metricFps").innerText = `Performance: ${currentComputedFps} FPS`;
  const totalElements = document.getElementsByTagName("*").length;
  document.getElementById("metricDom").innerText = `DOM Elements: ${totalElements} Nodes Loaded`;
  document.getElementById("metricPing").innerText = `Network Ping: ${currentNetworkPing}`;
  
  const errRow = document.getElementById("metricErrors");
  errRow.innerText = `Errors: ${observedErrorsCount} (${lastErrorMessage})`;
  errRow.style.color = observedErrorsCount > 0 ? "#ff5f56" : "#00ff66";
}
