(() => {
  'use strict';

  // Keep the preference key used by the latest published site version so existing settings migrate cleanly.
  const SETTINGS_KEY = 'hummingbird_site_preferences_v1';
  const LEGACY_SETTINGS_KEY = 'hummingbird-site-settings-v2';
  const LOGO_URL = 'https://uploads.onecompiler.io/447kr4gf2/44f9wbztv/humming%5Bbird%5DTech%20logo%20(4).png';
  const DEFAULTS = {
    brightness: 'normal',
    background: 'gradient',
    customBackground: '#ffffff',
    cornerRadius: 16,
    glassOpacity: 14,
    glassBlur: 10,
    liquidGlass: true,
    accent: 'green',
    customAccent: '#76e6a0',
    fontScale: 100,
    lightweight: false,
    customContextMenu: true,
    reducedMotion: false,
    compactCards: false
  };

  let settings = readSettings();
  let contextMenuElement = null;
  let contextImage = null;

  function readSettings() {
    let stored = {};
    let legacy = {};
    try { stored = JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}') || {}; } catch (_) {}
    try { legacy = JSON.parse(localStorage.getItem(LEGACY_SETTINGS_KEY) || '{}') || {}; } catch (_) {}

    // Settings from the prior v1 UI used different property names and hex accents.
    const source = { ...legacy, ...stored };
    const brightness = source.brightness || source.theme || localStorage.getItem('system_theme_mode') || DEFAULTS.brightness;
    let background = source.background || DEFAULTS.background;
    if (background === 'original') background = 'gradient';
    if (!['gradient', 'forest', 'midnight', 'slate', 'sunrise', 'custom', 'plain'].includes(background)) background = DEFAULTS.background;

    let accent = source.accent ?? DEFAULTS.accent;
    let customAccent = source.customAccent || DEFAULTS.customAccent;
    if (typeof accent === 'string' && /^#[0-9a-f]{6}$/i.test(accent)) {
      customAccent = accent;
      accent = 'custom';
    }
    if (!['green', 'blue', 'violet', 'amber', 'slate', 'custom'].includes(accent)) accent = DEFAULTS.accent;

    return {
      ...DEFAULTS,
      brightness: ['normal', 'dark', 'light'].includes(brightness) ? brightness : DEFAULTS.brightness,
      background,
      customBackground: /^#[0-9a-f]{6}$/i.test(source.customBackground || '') ? source.customBackground : DEFAULTS.customBackground,
      cornerRadius: source.cornerRadius ?? DEFAULTS.cornerRadius,
      glassOpacity: source.glassOpacity ?? DEFAULTS.glassOpacity,
      glassBlur: source.glassBlur ?? DEFAULTS.glassBlur,
      liquidGlass: source.liquidGlass ?? source.glass ?? DEFAULTS.liquidGlass,
      accent,
      customAccent,
      fontScale: source.fontScale ?? DEFAULTS.fontScale,
      lightweight: source.lightweight ?? (localStorage.getItem('extreme_lightweight') === 'true'),
      customContextMenu: source.customContextMenu ?? DEFAULTS.customContextMenu,
      reducedMotion: source.reducedMotion ?? source.motion ?? DEFAULTS.reducedMotion,
      compactCards: source.compactCards ?? source.compact ?? DEFAULTS.compactCards
    };
  }

  function saveSettings() {
    try {
      const compatible = {
        ...settings,
        theme: settings.brightness,
        background: settings.background === 'gradient' ? 'original' : settings.background,
        accent: settings.accent === 'custom' ? settings.customAccent : settings.accent,
        fontScale: String(settings.fontScale),
        compact: Boolean(settings.compactCards),
        motion: Boolean(settings.reducedMotion),
        glass: Boolean(settings.liquidGlass)
      };
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(compatible));
      localStorage.setItem('system_theme_mode', settings.brightness);
      localStorage.setItem('extreme_lightweight', String(Boolean(settings.lightweight)));
    } catch (error) {
      console.warn('Could not save Hummingbird settings:', error);
    }
  }

  function initialize() {
    applySettings();
    injectSiteHeader();
    injectSettingsDialog();
    injectContextMenu();
    bindGlobalKeys();
  }

  function applySettings() {
    const body = document.body;
    body.classList.remove('theme-normal', 'theme-dark', 'theme-light', 'plain-background', 'background-forest', 'background-midnight', 'background-slate', 'background-sunrise', 'custom-background', 'lightweight-mode', 'no-glass', 'reduced-motion', 'compact-cards');
    body.classList.add(`theme-${['normal', 'dark', 'light'].includes(settings.brightness) ? settings.brightness : 'normal'}`);
    if (settings.background === 'plain') body.classList.add('plain-background');
    else if (['forest', 'midnight', 'slate', 'sunrise'].includes(settings.background)) body.classList.add(`background-${settings.background}`);
    else if (settings.background === 'custom') body.classList.add('custom-background');
    if (settings.lightweight) body.classList.add('lightweight-mode');
    if (!settings.liquidGlass) body.classList.add('no-glass');
    if (settings.reducedMotion) body.classList.add('reduced-motion');
    if (settings.compactCards) body.classList.add('compact-cards');

    body.style.setProperty('--corner-radius', `${clamp(settings.cornerRadius, 0, 32)}px`);
    body.style.setProperty('--glass-opacity', `${clamp(settings.glassOpacity, 0, 40) / 100}`);
    body.style.setProperty('--glass-blur', `${clamp(settings.glassBlur, 0, 24)}px`);
    body.style.setProperty('--accent', accentColor(settings.accent));
    body.style.setProperty('--custom-page-background', settings.customBackground);
    body.style.setProperty('--font-scale', String(clamp(settings.fontScale, 85, 130) / 100));
    updateHeaderLabels();
  }

  function clamp(value, min, max) {
    const number = Number(value);
    return Number.isFinite(number) ? Math.min(max, Math.max(min, number)) : min;
  }

  function accentColor(name) {
    return ({
      green: '#48b982',
      blue: '#4b9ee8',
      violet: '#9270d5',
      amber: '#d59a3b',
      slate: '#718096'
    })[name] || (name === 'custom' && /^#[0-9a-f]{6}$/i.test(settings.customAccent) ? settings.customAccent : '#48b982');
  }

  function injectSiteHeader() {
    if (document.getElementById('siteHeader')) return;
    const header = document.createElement('header');
    header.id = 'siteHeader';
    header.className = 'site-header';
    const isHome = document.body.classList.contains('home-page');
    header.innerHTML = `
      ${isHome ? '' : `<a class="site-brand" href="index.html" aria-label="HummingbirdTech home"><img src="${LOGO_URL}" alt="" width="38" height="38"><span>humming[bird]Tech</span></a>`}
      <nav class="site-header-actions" aria-label="Site controls">
        <button class="site-control-btn" id="brightnessToggleBtn" type="button" title="Cycle normal, dark, and light brightness modes">Brightness: Normal</button>
        <button class="site-control-btn" id="lightweightToggleBtn" type="button" aria-pressed="false">Lightweight: Off</button>
        <button class="site-control-btn site-settings-btn" id="settingsOpenBtn" type="button">Settings</button>
      </nav>`;
    document.body.prepend(header);
    document.getElementById('brightnessToggleBtn').addEventListener('click', cycleBrightness);
    document.getElementById('lightweightToggleBtn').addEventListener('click', toggleLightweightEngine);
    document.getElementById('settingsOpenBtn').addEventListener('click', openSettings);
  }

  function updateHeaderLabels() {
    const brightness = document.getElementById('brightnessToggleBtn');
    const lightweight = document.getElementById('lightweightToggleBtn');
    if (brightness) brightness.textContent = `Brightness: ${capitalize(settings.brightness)}`;
    if (lightweight) {
      lightweight.textContent = `Lightweight: ${settings.lightweight ? 'On' : 'Off'}`;
      lightweight.setAttribute('aria-pressed', settings.lightweight ? 'true' : 'false');
      lightweight.classList.toggle('is-active', settings.lightweight);
    }
  }

  function capitalize(value) {
    return String(value).charAt(0).toUpperCase() + String(value).slice(1);
  }

  function cycleBrightness() {
    const modes = ['normal', 'dark', 'light'];
    const current = modes.indexOf(settings.brightness);
    settings.brightness = modes[(current + 1) % modes.length];
    saveSettings();
    applySettings();
    syncSettingsControls();
  }

  function toggleLightweightEngine() {
    settings.lightweight = !settings.lightweight;
    saveSettings();
    applySettings();
    syncSettingsControls();
  }

  function injectSettingsDialog() {
    if (document.getElementById('siteSettingsDialog')) return;
    const dialog = document.createElement('dialog');
    dialog.id = 'siteSettingsDialog';
    dialog.className = 'site-settings-dialog';
    dialog.innerHTML = `
      <form method="dialog" class="settings-shell">
        <div class="settings-heading">
          <div><span class="settings-eyebrow">PERSONALIZE</span><h2>Settings</h2><p>Adjust the look and behavior of the site.</p></div>
          <button class="settings-close" type="submit" aria-label="Close settings">×</button>
        </div>
        <section class="settings-section">
          <h3>Appearance</h3>
          <label class="settings-field"><span>Brightness mode</span>
            <select id="settingBrightness"><option value="normal">Normal</option><option value="dark">Dark</option><option value="light">Light</option></select>
          </label>
          <label class="settings-field"><span>Background style</span>
            <select id="settingBackground"><option value="gradient">Original gradient</option><option value="forest">Deep forest</option><option value="midnight">Midnight blue</option><option value="slate">Graphite slate</option><option value="sunrise">Warm dusk</option><option value="plain">Plain white</option><option value="custom">Custom solid color</option></select>
          </label>
          <label class="settings-field"><span>Custom background color</span><input id="settingCustomBackground" type="color" aria-label="Custom background color"></label>
          <label class="settings-field"><span>Accent color</span>
            <select id="settingAccent"><option value="green">Green</option><option value="blue">Blue</option><option value="violet">Violet</option><option value="amber">Amber</option><option value="slate">Slate</option><option value="custom">Custom</option></select>
          </label>
          <label class="settings-field"><span>Custom accent</span><input id="settingCustomAccent" type="color" aria-label="Custom accent color"></label>
          <label class="settings-field"><span>Text size</span><select id="settingFontScale"><option value="90">Small</option><option value="100">Default</option><option value="110">Large</option><option value="120">Extra large</option><option value="130">Huge</option></select></label>
        </section>
        <section class="settings-section">
          <h3>Interface</h3>
          <label class="settings-range"><span>Corner roundness <output id="cornerRadiusValue">16px</output></span><input id="settingCornerRadius" type="range" min="0" max="32" step="1"></label>
          <label class="settings-range"><span>Liquid glass opacity <output id="glassOpacityValue">14%</output></span><input id="settingGlassOpacity" type="range" min="0" max="40" step="1"></label>
          <label class="settings-range"><span>Glass blur <output id="glassBlurValue">10px</output></span><input id="settingGlassBlur" type="range" min="0" max="24" step="1"></label>
          <label class="settings-check"><input id="settingLiquidGlass" type="checkbox"><span>Use liquid glass surfaces</span></label>
          <label class="settings-check"><input id="settingCompactCards" type="checkbox"><span>Compact cards and spacing</span></label>
          <label class="settings-check"><input id="settingReducedMotion" type="checkbox"><span>Reduce motion and transitions</span></label>
        </section>
        <section class="settings-section">
          <h3>Performance and controls</h3>
          <label class="settings-check"><input id="settingLightweight" type="checkbox"><span>Lightweight mode</span></label>
          <label class="settings-check"><input id="settingContextMenu" type="checkbox"><span>Use custom right-click menu</span></label>
        </section>
        <div class="settings-footer"><button class="settings-reset" id="settingsReset" type="button">Reset settings</button><button class="settings-done" type="submit">Done</button></div>
      </form>`;
    document.body.appendChild(dialog);

    dialog.addEventListener('click', event => {
      if (event.target === dialog) dialog.close();
    });
    document.getElementById('settingsReset').addEventListener('click', () => {
      settings = { ...DEFAULTS };
      saveSettings();
      applySettings();
      syncSettingsControls();
    });

    const bindings = {
      settingBrightness: 'brightness',
      settingBackground: 'background',
      settingAccent: 'accent',
      settingCustomBackground: 'customBackground',
      settingCustomAccent: 'customAccent',
      settingFontScale: 'fontScale',
      settingCornerRadius: 'cornerRadius',
      settingGlassOpacity: 'glassOpacity',
      settingGlassBlur: 'glassBlur',
      settingLiquidGlass: 'liquidGlass',
      settingCompactCards: 'compactCards',
      settingReducedMotion: 'reducedMotion',
      settingLightweight: 'lightweight',
      settingContextMenu: 'customContextMenu'
    };
    Object.entries(bindings).forEach(([id, key]) => {
      const control = document.getElementById(id);
      control.addEventListener('input', () => updateSettingFromControl(control, key));
      control.addEventListener('change', () => updateSettingFromControl(control, key));
    });
    syncSettingsControls();
  }

  function updateSettingFromControl(control, key) {
    const isCheckbox = control.type === 'checkbox';
    settings[key] = isCheckbox ? control.checked : (control.type === 'range' || control.type === 'number' ? Number(control.value) : control.value);
    if (key === 'customBackground') {
      settings.background = 'custom';
      const backgroundSelect = document.getElementById('settingBackground');
      if (backgroundSelect) backgroundSelect.value = 'custom';
    }
    if (key === 'customAccent') {
      settings.accent = 'custom';
      const accentSelect = document.getElementById('settingAccent');
      if (accentSelect) accentSelect.value = 'custom';
    }
    saveSettings();
    applySettings();
    updateRangeOutputs();
  }

  function updateRangeOutputs() {
    const radius = document.getElementById('cornerRadiusValue');
    const opacity = document.getElementById('glassOpacityValue');
    const blur = document.getElementById('glassBlurValue');
    if (radius) radius.textContent = `${settings.cornerRadius}px`;
    if (opacity) opacity.textContent = `${settings.glassOpacity}%`;
    if (blur) blur.textContent = `${settings.glassBlur}px`;
  }

  function syncSettingsControls() {
    const values = {
      settingBrightness: settings.brightness,
      settingBackground: settings.background,
      settingAccent: settings.accent,
      settingCustomBackground: settings.customBackground,
      settingCustomAccent: settings.customAccent,
      settingFontScale: settings.fontScale,
      settingCornerRadius: settings.cornerRadius,
      settingGlassOpacity: settings.glassOpacity,
      settingGlassBlur: settings.glassBlur,
      settingLiquidGlass: settings.liquidGlass,
      settingCompactCards: settings.compactCards,
      settingReducedMotion: settings.reducedMotion,
      settingLightweight: settings.lightweight,
      settingContextMenu: settings.customContextMenu
    };
    Object.entries(values).forEach(([id, value]) => {
      const control = document.getElementById(id);
      if (!control) return;
      if (control.type === 'checkbox') control.checked = Boolean(value);
      else control.value = String(value);
    });
    updateRangeOutputs();
    updateHeaderLabels();
  }

  function openSettings() {
    const dialog = document.getElementById('siteSettingsDialog');
    if (!dialog) return;
    syncSettingsControls();
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
  }

  function injectContextMenu() {
    if (document.getElementById('customContextMenu')) return;
    contextMenuElement = document.createElement('div');
    contextMenuElement.id = 'customContextMenu';
    contextMenuElement.className = 'custom-context-menu';
    contextMenuElement.setAttribute('role', 'menu');
    document.body.appendChild(contextMenuElement);

    document.addEventListener('contextmenu', event => {
      if (!settings.customContextMenu) return;
      event.preventDefault();
      contextImage = event.target instanceof HTMLImageElement ? event.target : event.target.closest?.('img') || null;
      renderContextMenu();
      contextMenuElement.style.display = 'block';
      const rect = contextMenuElement.getBoundingClientRect();
      const left = Math.max(8, Math.min(event.clientX, window.innerWidth - rect.width - 8));
      const top = Math.max(8, Math.min(event.clientY, window.innerHeight - rect.height - 8));
      contextMenuElement.style.left = `${left}px`;
      contextMenuElement.style.top = `${top}px`;
    });

    document.addEventListener('click', hideContextMenu);
    document.addEventListener('scroll', hideContextMenu, true);
    window.addEventListener('resize', hideContextMenu);
    contextMenuElement.addEventListener('click', handleContextMenuAction);
  }

  function renderContextMenu() {
    const selection = window.getSelection()?.toString().trim() || '';
    const imageItems = contextImage ? `
      <div class="context-divider"></div>
      <button class="context-item" type="button" data-action="save-image">Save image as…</button>
      <button class="context-item" type="button" data-action="copy-image-url">Copy image URL</button>
      <button class="context-item" type="button" data-action="copy-image-base64">Copy image base64 string</button>` : '';
    contextMenuElement.innerHTML = `
      <button class="context-item" type="button" data-action="back">Back</button>
      <button class="context-item" type="button" data-action="forward">Forward</button>
      <button class="context-item" type="button" data-action="reload">Reload</button>
      <div class="context-divider"></div>
      <button class="context-item" type="button" data-action="print">Print…</button>
      <button class="context-item" type="button" data-action="save-page">Save page as…</button>
      <button class="context-item" type="button" data-action="search" data-selection="${escapeAttribute(selection)}">Search the web</button>
      ${imageItems}
      <div class="context-divider"></div>
      <button class="context-item" type="button" data-action="settings">Settings</button>`;
  }

  function escapeAttribute(value) {
    return String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
  }

  async function handleContextMenuAction(event) {
    const button = event.target.closest('[data-action]');
    if (!button) return;
    event.stopPropagation();
    const action = button.dataset.action;
    const selectedImage = contextImage;
    hideContextMenu();
    try {
      switch (action) {
        case 'back': history.back(); break;
        case 'forward': history.forward(); break;
        case 'reload': location.reload(); break;
        case 'print': window.print(); break;
        case 'save-page': saveCurrentPage(); break;
        case 'search': {
          const query = button.dataset.selection || window.getSelection()?.toString() || 'HummingbirdTech';
          window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank', 'noopener,noreferrer');
          break;
        }
        case 'save-image': if (selectedImage) await saveImage(selectedImage); break;
        case 'copy-image-url': if (selectedImage) await copyText(selectedImage.currentSrc || selectedImage.src); break;
        case 'copy-image-base64': if (selectedImage) await copyImageAsBase64(selectedImage); break;
        case 'settings': openSettings(); break;
      }
    } catch (error) {
      console.warn('Context menu action failed:', error);
      window.alert(error.message || 'That action could not be completed.');
    }
  }

  function hideContextMenu() {
    if (contextMenuElement) contextMenuElement.style.display = 'none';
    contextImage = null;
  }

  async function copyText(text) {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(String(text));
      return;
    }
    const field = document.createElement('textarea');
    field.value = String(text);
    field.style.position = 'fixed';
    field.style.opacity = '0';
    document.body.appendChild(field);
    field.select();
    const copied = document.execCommand('copy');
    field.remove();
    if (!copied) throw new Error('Clipboard access is not available in this browser.');
  }

  async function fetchImageBlob(image) {
    const url = image.currentSrc || image.src;
    const response = await fetch(url, { mode: 'cors', credentials: 'omit' });
    if (!response.ok) throw new Error(`The image could not be fetched (HTTP ${response.status}).`);
    return response.blob();
  }

  async function saveImage(image) {
    const blob = await fetchImageBlob(image);
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = (new URL(image.currentSrc || image.src)).pathname.split('/').pop() || 'image';
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(objectUrl), 30000);
  }

  async function copyImageAsBase64(image) {
    const blob = await fetchImageBlob(image);
    const dataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error('The image could not be converted to base64.'));
      reader.readAsDataURL(blob);
    });
    await copyText(dataUrl);
  }

  function saveCurrentPage() {
    const blob = new Blob([document.documentElement.outerHTML], { type: 'text/html;charset=utf-8' });
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = `${location.pathname.split('/').pop() || 'page'}.html`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(objectUrl), 30000);
  }

  function bindGlobalKeys() {
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') hideContextMenu();
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === ',') {
        event.preventDefault();
        openSettings();
      }
    });
  }

  // Keep these functions available to any existing page markup while moving
  // the controls into the shared site header.
  window.toggleTheme = cycleBrightness;
  window.toggleLightweightEngine = toggleLightweightEngine;
  window.openHummingbirdSettings = openSettings;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize, { once: true });
  } else {
    initialize();
  }
})();
