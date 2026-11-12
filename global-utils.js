document.addEventListener("DOMContentLoaded", () => {
  initChronographTheme();
  if (localStorage.getItem("extreme_lightweight") === "true") {
    applyLightweightUIAdjustments();
  } else {
    injectCustomContextMenuShell();
    injectHardwareProfilerHUD();
  }
});

function initChronographTheme() {
  const btn = document.getElementById("themeToggleBtn");
  const activeTheme = localStorage.getItem("system_theme_mode") || "dark";
  
  if (activeTheme === "light") {
    document.body.classList.add("light-theme-profile");
    if (btn) btn.innerText = "Light Mode";
  } else {
    document.body.classList.remove("light-theme-profile");
    if (btn) btn.innerText = "Dark Mode";
  }
}

function toggleTheme() {
  const currentTheme = localStorage.getItem("system_theme_mode") || "dark";
  const nextTheme = currentTheme === "dark" ? "light" : "dark";
  localStorage.setItem("system_theme_mode", nextTheme);
  initChronographTheme();
}

function toggleLightweightEngine() {
  const currentSetting = localStorage.getItem("extreme_lightweight") === "true";
  localStorage.setItem("extreme_lightweight", !currentSetting);
  window.location.reload();
}

function applyLightweightUIAdjustments() {
  document.body.classList.add("hb-lightweight");
  document.body.dataset.glass = "false";
  document.body.dataset.motion = "reduced";
  const b = document.getElementById("lightweightToggleBtn");
  if (b) b.innerText = "Lightweight Active";
}

function loadErudaDevToolsEngine(triggerImmediately) {
  if (window.eruda) {
    if (triggerImmediately) window.eruda.show();
    return;
  }
  
  const script = document.createElement("script");
  script.src = "https://cdn.jsdelivr.net/npm/eruda";
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
  script.onerror = () => {
    console.log("Eruda network path blocked.");
  };
  document.head.appendChild(script);
}

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
  window.open(`https://google.com${encodeURIComponent(text)}`, "_blank");
}

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
  const targetEndpoint = "https://html.spec.whatwg.org";
  const startTime = performance.now();
  
  try {
    await fetch(`${targetEndpoint}?ping_probe=${startTime}`, { method: 'HEAD', mode: 'no-cors', cache: 'no-store' });
    currentNetworkPing = `${Math.round(performance.now() - startTime)} ms`;
  } catch (error) {
    currentNetworkPing = "Offline / Proxied Gateway";
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



(() => {
  const KEY = "hummingbird_site_preferences_v1";
  const defaults = {
    theme: "normal", background: "original", customBackground: "#102719",
    accent: "#76e6a0", fontScale: "100", compact: false, motion: false, glass: true, lightweight: false
  };
  let prefs = { ...defaults };
  try {
    const stored = JSON.parse(localStorage.getItem(KEY) || "{}");
    prefs = { ...defaults, ...stored };
    if (!Object.prototype.hasOwnProperty.call(stored, "lightweight")) {
      prefs.lightweight = localStorage.getItem("extreme_lightweight") === "true";
    }
  } catch (_) {
    prefs.lightweight = localStorage.getItem("extreme_lightweight") === "true";
  }

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(prefs)); } catch (_) {}
  }
  function apply() {
    document.body.classList.toggle("light-theme-profile", prefs.theme === "light");
    document.body.classList.toggle("dark-theme-profile", prefs.theme === "dark");
    document.body.dataset.background = prefs.background;
    document.body.dataset.compact = String(!!prefs.compact);
    document.body.dataset.motion = prefs.motion ? "reduced" : "normal";
    document.body.dataset.glass = String(!!prefs.glass && !prefs.lightweight);
    document.body.classList.toggle("hb-lightweight", !!prefs.lightweight);
    try { localStorage.setItem("extreme_lightweight", String(!!prefs.lightweight)); } catch (_) {}
    document.body.style.setProperty("--hb-custom-background", prefs.customBackground);
    document.body.style.setProperty("--hb-accent", prefs.accent);
    document.body.style.setProperty("--hb-accent-contrast", contrastColor(prefs.accent));
    document.body.style.setProperty("--hb-font-scale", String(Number(prefs.fontScale) / 100));
    localStorage.setItem("system_theme_mode", prefs.theme === "light" ? "light" : "dark");
  }
  function contrastColor(hex) {
    const value = String(hex).replace("#", "");
    if (!/^[0-9a-f]{6}$/i.test(value)) return "#092012";
    const n = parseInt(value, 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    return (r * .299 + g * .587 + b * .114) > 155 ? "#102016" : "#ffffff";
  }
  function element(tag, attrs, text) {
    const node = document.createElement(tag);
    Object.entries(attrs || {}).forEach(([k, v]) => {
      if (k === "class") node.className = v;
      else if (k === "checked") node.checked = !!v;
      else if (k === "value") node.value = v;
      else node.setAttribute(k, v);
    });
    if (text !== undefined) node.textContent = text;
    return node;
  }
  function makeSelect(id, options, value) {
    const select = element("select", { id });
    options.forEach(([v, label]) => {
      const option = element("option", { value: v }, label);
      select.appendChild(option);
    });
    select.value = value;
    return select;
  }
  function group(title, description, control) {
    const wrap = element("section", { class: "hb-setting-group" });
    const h = element("h3", {}, title);
    const p = element("p", {}, description);
    const row = element("div", { class: "hb-setting-row" });
    row.appendChild(control);
    wrap.append(h, p, row);
    return wrap;
  }
  function rowLabel(text) { return element("label", {}, text); }
  function toggleControl(id, label, checked, onChange) {
    const wrap = element("label", { class: "hb-setting-toggle" });
    const input = element("input", { type: "checkbox", id, checked });
    input.addEventListener("change", () => onChange(input.checked));
    wrap.append(input, document.createTextNode(label));
    return wrap;
  }
  function init() {
    apply();
    initPointerTrail();
    if (document.getElementById("hbSettingsDialog")) return;

    const launcher = element("button", {
      type: "button", class: "utility-btn hb-settings-launcher",
      "aria-haspopup": "dialog", "aria-controls": "hbSettingsDialog"
    }, "⚙ Settings");
    launcher.addEventListener("click", () => dialog.showModal());
    document.body.appendChild(launcher);

    const dialog = element("dialog", { id: "hbSettingsDialog", class: "hb-settings-dialog", "aria-labelledby": "hbSettingsTitle" });
    const head = element("div", { class: "hb-settings-head" });
    const titleWrap = element("div");
    titleWrap.append(element("h2", { id: "hbSettingsTitle" }, "Settings"),
      element("p", {}, "Preferences are saved on this device."));
    const close = element("button", { type: "button", class: "utility-btn hb-settings-close" }, "✕");
    close.addEventListener("click", () => dialog.close());
    head.append(titleWrap, close);

    const tabs = element("div", { class: "hb-settings-tabs", role: "tablist", "aria-label": "Settings categories" });
    const content = element("div", { class: "hb-settings-content" });
    const panels = {};
    const tabNames = [["appearance", "Appearance"], ["background", "Background"], ["interface", "Interface"]];
    function showTab(name) {
      Object.entries(panels).forEach(([key, panel]) => panel.hidden = key !== name);
      [...tabs.children].forEach(btn => btn.setAttribute("aria-selected", String(btn.dataset.tab === name)));
    }
    tabNames.forEach(([id, label]) => {
      const btn = element("button", { type: "button", class: "utility-btn hb-settings-tab", role: "tab", "aria-selected": "false" }, label);
      btn.dataset.tab = id;
      btn.addEventListener("click", () => showTab(id));
      tabs.appendChild(btn);
      panels[id] = element("div", { role: "tabpanel" });
      content.appendChild(panels[id]);
    });

    // Appearance
    const themeSelect = makeSelect("hbTheme", [["normal", "Normal"], ["dark", "Dark"], ["light", "Light"]], prefs.theme);
    themeSelect.addEventListener("change", () => { prefs.theme = themeSelect.value; save(); apply(); });
    const themeRow = element("div", { class: "hb-setting-row" }); themeRow.append(rowLabel("Color theme"), themeSelect);
    panels.appearance.appendChild(group("Theme", "Changes interface surfaces and text without changing the page background.", themeRow));

    const accent = element("input", { type: "color", id: "hbAccent", value: prefs.accent, "aria-label": "Accent color" });
    accent.addEventListener("input", () => { prefs.accent = accent.value; save(); apply(); });
    const accentRow = element("div", { class: "hb-setting-row" }); accentRow.append(rowLabel("Accent color"), accent);
    panels.appearance.appendChild(group("Accent color", "Change highlights, focus rings, and active controls.", accentRow));

    const font = makeSelect("hbFontScale", [["90", "Small"], ["100", "Default"], ["110", "Large"], ["120", "Extra large"]], prefs.fontScale);
    font.addEventListener("change", () => { prefs.fontScale = font.value; save(); apply(); });
    const fontRow = element("div", { class: "hb-setting-row" }); fontRow.append(rowLabel("Text size"), font);
    panels.appearance.appendChild(group("Text size", "Adjust interface text size.", fontRow));

    // Background
    const bg = makeSelect("hbBackground", [
      ["original", "Original green gradient"], ["forest", "Deep forest"], ["midnight", "Midnight blue"],
      ["slate", "Graphite slate"], ["sunrise", "Warm dusk"], ["custom", "Custom solid color"]
    ], prefs.background);
    bg.addEventListener("change", () => { prefs.background = bg.value; save(); apply(); });
    const bgRow = element("div", { class: "hb-setting-row" }); bgRow.append(rowLabel("Background style"), bg);
    panels.background.appendChild(group("Background", "Choose a page background independently of the color theme.", bgRow));

    const custom = element("input", { type: "color", id: "hbCustomBackground", value: prefs.customBackground, "aria-label": "Custom background color" });
    custom.addEventListener("input", () => { prefs.customBackground = custom.value; prefs.background = "custom"; bg.value = "custom"; save(); apply(); });
    const customRow = element("div", { class: "hb-setting-row" }); customRow.append(rowLabel("Custom background"), custom);
    panels.background.appendChild(group("Your own color", "Pick any background color. Select “Custom solid color” to use it.", customRow));

    // Interface
    panels.interface.appendChild(group("Compact layout", "Tighten spacing and card padding to fit more on screen.",
      toggleControl("hbCompact", "Use compact spacing", prefs.compact, v => { prefs.compact = v; save(); apply(); })));
    panels.interface.appendChild(group("Reduced motion", "Reduce animations and transitions for a calmer experience.",
      toggleControl("hbMotion", "Reduce motion", prefs.motion, v => { prefs.motion = v; save(); apply(); })));
    panels.interface.appendChild(group("Glass effects", "Control translucent surfaces and blur.",
      toggleControl("hbGlass", "Enable glass effects", prefs.glass, v => { prefs.glass = v; save(); apply(); })));
    panels.interface.appendChild(group("Extreme lightweight mode", "Disables the cursor trail, blur, decorative motion, diagnostics polling, and nonessential effects to reduce CPU and GPU work.",
      toggleControl("hbLightweight", "Enable extreme lightweight mode", prefs.lightweight, v => { prefs.lightweight = v; save(); apply(); location.reload(); })));

    const footer = element("div", { class: "hb-settings-actions" });
    const reset = element("button", { type: "button", class: "utility-btn" }, "Reset settings");
    reset.addEventListener("click", () => {
      prefs = { ...defaults }; save();
      dialog.close(); dialog.remove();
      init();
      document.getElementById("hbSettingsDialog").showModal();
    });
    const note = element("span", { class: "hb-settings-note" }, "Saved automatically");
    const done = element("button", { type: "button", class: "utility-btn" }, "Done");
    done.addEventListener("click", () => dialog.close());
    footer.append(reset, note, done);
    dialog.append(head, tabs, content, footer);
    document.body.appendChild(dialog);
    showTab("appearance");
    dialog.addEventListener("click", event => { if (event.target === dialog) dialog.close(); });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();

function initPointerTrail() {
  if (localStorage.getItem("extreme_lightweight") === "true" || document.querySelector(".hb-pointer-trail")) return;
  const canvas = document.createElement("canvas");
  canvas.className = "hb-pointer-trail";
  canvas.setAttribute("aria-hidden", "true");
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) { canvas.remove(); return; }
  let width = 0, height = 0, dpr = 1, points = [], frame = 0, last = null;
  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  const draw = () => {
    ctx.globalCompositeOperation = "destination-out";
    ctx.fillStyle = "rgba(0,0,0,.105)";
    ctx.fillRect(0, 0, width, height);
    ctx.globalCompositeOperation = "source-over";
    if (points.length > 1) {
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = 2.2;
      ctx.strokeStyle = "rgba(142,255,190,.68)";
      ctx.shadowColor = "rgba(90,255,160,.55)";
      ctx.shadowBlur = 9;
      ctx.beginPath();
      points.forEach((p, i) => i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y));
      ctx.stroke();
      ctx.shadowBlur = 0;
    }
    points = points.filter(p => performance.now() - p.t < 520);
    if (points.length) frame = requestAnimationFrame(draw);
    else { frame = 0; ctx.clearRect(0, 0, width, height); }
  };
  window.addEventListener("resize", resize, { passive: true });
  window.addEventListener("pointermove", e => {
    if (e.pointerType === "touch") return;
    const now = performance.now();
    if (last) {
      const dx = e.clientX - last.x, dy = e.clientY - last.y;
      const length = Math.hypot(dx, dy);
      if (length > 2) {
        const offset = Math.min(8, length * .12);
        const nx = -dy / length, ny = dx / length;
        const side = points.length % 2 ? -1 : 1;
        points.push({ x: e.clientX + nx * offset * side, y: e.clientY + ny * offset * side, t: now });
        points.push({ x: e.clientX, y: e.clientY, t: now });
      }
    }
    last = { x: e.clientX, y: e.clientY };
    if (!frame && points.length) frame = requestAnimationFrame(draw);
  }, { passive: true });
  window.addEventListener("blur", () => { last = null; points = []; if (frame) cancelAnimationFrame(frame); frame = 0; ctx.clearRect(0, 0, width, height); });
  resize();
}
