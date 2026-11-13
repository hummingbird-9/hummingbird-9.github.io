(() => {
  'use strict';

  // Keep the preference key used by the latest published site version so existing settings migrate cleanly.
  const SETTINGS_KEY = 'hummingbird_site_preferences_v1';
  const LEGACY_SETTINGS_KEY = 'hummingbird-site-settings-v2';
  const LOGO_URL = 'https://uploads.onecompiler.io/447kr4gf2/44f9wbztv/humming%5Bbird%5DTech%20logo%20(4).png';
  const DEFAULTS = {
    brightness: 'normal',
    background: 'gradient',
    surfaceStyle: 'glass',
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
    compactCards: false,
    showRecentlyPlayed: false
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
    if (!['gradient', 'forest', 'midnight', 'slate', 'sunrise', 'ocean', 'charcoal', 'lavender', 'sand', 'paper', 'custom', 'plain'].includes(background)) background = DEFAULTS.background;

    let accent = source.accent ?? DEFAULTS.accent;
    let customAccent = source.customAccent || DEFAULTS.customAccent;
    if (typeof accent === 'string' && /^#[0-9a-f]{6}$/i.test(accent)) {
      customAccent = accent;
      accent = 'custom';
    }
    if (!['green', 'blue', 'violet', 'amber', 'slate', 'custom'].includes(accent)) accent = DEFAULTS.accent;

    return {
      ...DEFAULTS,
      brightness: ['normal', 'dark', 'light', 'contrast'].includes(brightness) ? brightness : DEFAULTS.brightness,
      background,
      surfaceStyle: ['glass', 'solid', 'minimal', 'flat'].includes(source.surfaceStyle)
        ? source.surfaceStyle
        : (source.liquidGlass === false || source.glass === false ? 'solid' : DEFAULTS.surfaceStyle),
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
      compactCards: source.compactCards ?? source.compact ?? DEFAULTS.compactCards,
      showRecentlyPlayed: source.showRecentlyPlayed === true
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
      window.dispatchEvent(new CustomEvent('hummingbird-settings-updated', {
        detail: { ...settings }
      }));
    } catch (error) {
      console.warn('Could not save Hummingbird settings:', error);
    }
  }

  function initialize() {
    clearHardRefreshMarker();
    applySettings();
    injectSiteHeader();
    injectSiteFooter();
    injectSettingsDialog();
    bindHomeLogoRefresh();
    injectContextMenu();
    bindGlobalKeys();
  }

  function clearHardRefreshMarker() {
    const url = new URL(location.href);
    if (!url.searchParams.has('__hbt_hard_refresh')) return;
    url.searchParams.delete('__hbt_hard_refresh');
    history.replaceState(history.state, '', url.pathname + url.search + url.hash);
  }

  function bindHomeLogoRefresh() {
    if (!document.body.classList.contains('home-page')) return;
    document.querySelectorAll('.site-brand, .home-hero-logo').forEach(link => {
      if (link.dataset.hardRefreshBound === 'true') return;
      link.dataset.hardRefreshBound = 'true';
      link.addEventListener('click', hardRefreshCurrentDocument);
    });
  }

  async function hardRefreshCurrentDocument(event) {
    event.preventDefault();
    if (document.documentElement.dataset.hardRefreshing === 'true') return;
    document.documentElement.dataset.hardRefreshing = 'true';
    try {
      if ('caches' in window) {
        const paths = new Set([location.pathname, '/index.html', '/']);
        for (const name of await caches.keys()) {
          const cache = await caches.open(name);
          for (const request of await cache.keys()) {
            try {
              const url = new URL(request.url);
              if (url.origin === location.origin && paths.has(url.pathname)) {
                await cache.delete(request);
              }
            } catch (_) {}
          }
        }
      }
    } catch (error) {
      console.info('The browser did not allow the page cache to be cleared:', error);
    }
    const freshUrl = new URL(location.href);
    freshUrl.searchParams.set('__hbt_hard_refresh', Date.now().toString(36));
    location.replace(freshUrl.href);
  }

  function applySettings() {
    const body = document.body;
    body.classList.remove(
      'theme-normal', 'theme-dark', 'theme-light', 'theme-contrast',
      'plain-background', 'background-forest', 'background-midnight', 'background-slate',
      'background-sunrise', 'background-ocean', 'background-charcoal', 'background-lavender',
      'background-sand', 'background-paper', 'custom-background', 'lightweight-mode',
      'no-glass', 'surface-glass', 'surface-solid', 'surface-minimal', 'surface-flat',
      'reduced-motion', 'compact-cards'
    );
    const theme = ['normal', 'dark', 'light', 'contrast'].includes(settings.brightness)
      ? settings.brightness : 'normal';
    const surfaceStyle = ['glass', 'solid', 'minimal', 'flat'].includes(settings.surfaceStyle)
      ? settings.surfaceStyle : (settings.liquidGlass ? 'glass' : 'solid');
    settings.surfaceStyle = surfaceStyle;
    settings.liquidGlass = surfaceStyle === 'glass';
    body.classList.add(`theme-${theme}`, `surface-${surfaceStyle}`);
    if (settings.background === 'plain') body.classList.add('plain-background');
    else if (['forest', 'midnight', 'slate', 'sunrise', 'ocean', 'charcoal', 'lavender', 'sand', 'paper'].includes(settings.background)) {
      body.classList.add(`background-${settings.background}`);
    } else if (settings.background === 'custom') body.classList.add('custom-background');
    if (settings.lightweight) body.classList.add('lightweight-mode');
    if (surfaceStyle !== 'glass') body.classList.add('no-glass');
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
      green: '#90e4c1',
      blue: '#718b91',
      violet: '#897d91',
      amber: '#b58b53',
      slate: '#68746d'
    })[name] || (name === 'custom' && /^#[0-9a-f]{6}$/i.test(settings.customAccent) ? settings.customAccent : '#48b982');
  }

  function injectSiteHeader() {
    if (document.getElementById('siteHeader')) return;
    const header = document.createElement('header');
    header.id = 'siteHeader';
    header.className = 'site-header';
    const isHome = document.body.classList.contains('home-page');
    header.innerHTML = `
      <a class="site-brand" href="index.html" aria-label="Home"><img src="${LOGO_URL}" alt="Home" width="270" height="124"></a>
      <nav class="site-header-actions" aria-label="Main navigation">
        <a class="site-tab" href="index.html">Home</a>
        <a class="site-tab" href="gallery.html">View applications and projects</a>
        <a class="site-tab" href="games.html">Browse games</a>
        <a class="site-tab" href="submit.html">Submit a game</a>
        <a class="site-tab" href="web.html">Search the HummingWeb</a>
        <a class="site-tab" href="chat.html">Chat</a>
        <button class="site-tab site-settings-tab" id="settingsOpenBtn" type="button" aria-expanded="false">Settings</button>
      </nav>`;
    document.body.prepend(header);
    document.getElementById('settingsOpenBtn').addEventListener('click', openSettings);
    injectSettingsDialog();
    const current = location.pathname.split('/').pop() || 'index.html';
    header.querySelectorAll('a.site-tab').forEach(link => {
      if (link.getAttribute('href') === current) link.classList.add('is-current');
    });
  }


  function injectSiteFooter() {
    if (document.getElementById('siteLegalFooter')) return;
    const footer = document.createElement('footer');
    footer.id = 'siteLegalFooter';
    footer.className = 'site-footer';
    footer.innerHTML = `
      <p>Copyright © 2026 humming[bird]Tech. No rights reserved beyond the MIT License terms.</p>
      <p>Licensed under the <a href="LICENSE">MIT License</a>.</p>`;
    document.body.appendChild(footer);
  }

  function updateHeaderLabels() {
    const theme = document.getElementById('settingBrightness');
    const lightweight = document.getElementById('settingLightweight');
    if (theme) theme.value = settings.brightness;
    if (lightweight) lightweight.checked = Boolean(settings.lightweight);
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
    if (document.getElementById('siteSettingsPanel')) return;
    const panel = document.createElement('section');
    panel.id = 'siteSettingsPanel';
    panel.className = 'site-settings-panel';
    panel.hidden = true;
    panel.innerHTML = `
      <div class="settings-panel-heading"><h2>Settings</h2></div>
      <label class="settings-search"><span>Find a setting</span><input id="settingsSearch" type="search" placeholder="Search settings…" autocomplete="off"></label>
      <div class="settings-panel-grid">
        <section class="settings-section"><h3>Appearance</h3>
          <label class="settings-field"><span>Theme</span><select id="settingBrightness"><option value="normal">Normal</option><option value="dark">Dark</option><option value="light">Light</option><option value="contrast">High contrast</option></select></label>
          <label class="settings-field"><span>Background</span><select id="settingBackground"><option value="gradient">Original</option><option value="forest">Forest</option><option value="midnight">Midnight</option><option value="slate">Slate</option><option value="sunrise">Sunset</option><option value="ocean">Ocean</option><option value="charcoal">Charcoal</option><option value="lavender">Lavender</option><option value="sand">Sand</option><option value="paper">Paper</option><option value="plain">Plain white</option><option value="custom">Custom color</option></select></label>
          <label class="settings-field"><span>Custom background</span><input id="settingCustomBackground" type="color" aria-label="Custom background color"></label>
          <label class="settings-field"><span>Accent</span><select id="settingAccent"><option value="green">Green</option><option value="blue">Muted teal</option><option value="violet">Plum</option><option value="amber">Warm</option><option value="slate">Graphite</option><option value="custom">Custom</option></select></label>
          <label class="settings-field"><span>Custom accent</span><input id="settingCustomAccent" type="color" aria-label="Custom accent color"></label>
          <label class="settings-field"><span>Text size</span><select id="settingFontScale"><option value="90">Small</option><option value="100">Default</option><option value="110">Large</option><option value="120">Extra large</option><option value="130">Huge</option></select></label>
        </section>
        <section class="settings-section"><h3>Interface</h3>
          <label class="settings-range"><span>Corner roundness <output id="cornerRadiusValue">16px</output></span><input id="settingCornerRadius" type="range" min="0" max="32" step="1"></label>
          <label class="settings-range"><span>Liquid glass opacity <output id="glassOpacityValue">14%</output></span><input id="settingGlassOpacity" type="range" min="0" max="40" step="1"></label>
          <label class="settings-range"><span>Glass blur <output id="glassBlurValue">10px</output></span><input id="settingGlassBlur" type="range" min="0" max="24" step="1"></label>
          <label class="settings-field"><span>Surface style</span><select id="settingSurfaceStyle"><option value="glass">Liquid glass</option><option value="solid">Solid</option><option value="minimal">Minimal</option><option value="flat">Flat</option></select></label>
          <label class="settings-check"><input id="settingCompactCards" type="checkbox"><span>Compact cards</span></label>
          <label class="settings-check"><input id="settingReducedMotion" type="checkbox"><span>Reduce motion</span></label>
        </section>
        <section class="settings-section"><h3>Game browsing</h3>
          <label class="settings-check"><input id="settingShowRecentlyPlayed" type="checkbox"><span>Show recently played games</span></label>
        </section>
        <section class="settings-section"><h3>Performance and controls</h3>
          <label class="settings-check"><input id="settingLightweight" type="checkbox"><span>Lightweight mode</span></label>
          <label class="settings-check"><input id="settingContextMenu" type="checkbox"><span>Custom right-click menu</span></label>
        </section>
      </div>
      <div class="settings-footer">
        <button id="settingsImport" type="button">Import settings</button>
        <button id="settingsExport" type="button">Export settings</button>
        <button class="settings-reset" id="settingsReset" type="button">Reset settings</button>
        <input id="settingsImportFile" type="file" accept="application/json,.json" hidden>
      </div>`;
    const header = document.getElementById('siteHeader');
    header.insertAdjacentElement('afterend', panel);
    document.getElementById('settingsExport').addEventListener('click', exportSettings);
    document.getElementById('settingsImport').addEventListener('click', () => document.getElementById('settingsImportFile').click());
    document.getElementById('settingsImportFile').addEventListener('change', importSettingsFile);
    document.getElementById('settingsSearch').addEventListener('input', event => filterSettingsSections(event.target.value));
    document.getElementById('settingsReset').addEventListener('click', () => {
      settings = { ...DEFAULTS };
      saveSettings();
      applySettings();
      syncSettingsControls();
    });
    const bindings = {
      settingBrightness: 'brightness', settingBackground: 'background', settingAccent: 'accent',
      settingCustomBackground: 'customBackground', settingCustomAccent: 'customAccent',
      settingFontScale: 'fontScale', settingCornerRadius: 'cornerRadius',
      settingGlassOpacity: 'glassOpacity', settingGlassBlur: 'glassBlur',
      settingSurfaceStyle: 'surfaceStyle', settingCompactCards: 'compactCards',
      settingReducedMotion: 'reducedMotion', settingLightweight: 'lightweight',
      settingContextMenu: 'customContextMenu', settingShowRecentlyPlayed: 'showRecentlyPlayed'
    };
    Object.entries(bindings).forEach(([id, key]) => {
      const control = document.getElementById(id);
      control.addEventListener('input', () => updateSettingFromControl(control, key));
      control.addEventListener('change', () => updateSettingFromControl(control, key));
    });
    syncSettingsControls();
  }

  function openSettings() {
    const panel = document.getElementById('siteSettingsPanel');
    if (!panel) return;
    const shouldOpen = panel.hidden;
    panel.hidden = !shouldOpen;
    document.body.classList.toggle('settings-open', shouldOpen);
    const button = document.getElementById('settingsOpenBtn');
    if (button) button.setAttribute('aria-expanded', String(shouldOpen));
    if (shouldOpen) {
      syncSettingsControls();
      const search = document.getElementById('settingsSearch');
      if (search) search.value = '';
      filterSettingsSections('');
      panel.scrollIntoView({ behavior: settings.reducedMotion || settings.lightweight ? 'auto' : 'smooth', block: 'start' });
    }
  }

  function closeSettings() {
    const panel = document.getElementById('siteSettingsPanel');
    if (panel) panel.hidden = true;
    document.body.classList.remove('settings-open');
    const button = document.getElementById('settingsOpenBtn');
    if (button) button.setAttribute('aria-expanded', 'false');
  }

  function filterSettingsSections(query) {
    const panel = document.getElementById('siteSettingsPanel');
    if (!panel) return;
    const needle = String(query || '').trim().toLowerCase();
    panel.querySelectorAll('.settings-section').forEach(section => {
      let visible = 0;
      section.querySelectorAll('.settings-field, .settings-range, .settings-check').forEach(row => {
        const match = !needle || row.textContent.toLowerCase().includes(needle);
        row.hidden = !match;
        if (match) visible++;
      });
      section.hidden = visible === 0;
    });
  }

  function exportSettings() {
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'hummingbird-settings.json';
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 30000);
  }

  async function importSettingsFile(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        throw new Error('The selected file is not a settings object.');
      }
      const allowed = new Set(Object.keys(DEFAULTS));
      const cleaned = {};
      for (const [key, value] of Object.entries(parsed)) {
        if (!allowed.has(key)) continue;
        if (typeof value === typeof DEFAULTS[key]) cleaned[key] = value;
      }
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(cleaned));
      settings = readSettings();
      saveSettings();
      applySettings();
      syncSettingsControls();
      window.alert('Settings imported.');
    } catch (error) {
      window.alert('Could not import settings: ' + error.message);
    } finally {
      event.target.value = '';
    }
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
    if (key === 'surfaceStyle') settings.liquidGlass = settings.surfaceStyle === 'glass';
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
      settingBrightness: settings.brightness, settingBackground: settings.background,
      settingAccent: settings.accent, settingCustomBackground: settings.customBackground,
      settingCustomAccent: settings.customAccent, settingFontScale: settings.fontScale,
      settingCornerRadius: settings.cornerRadius, settingGlassOpacity: settings.glassOpacity,
      settingGlassBlur: settings.glassBlur, settingSurfaceStyle: settings.surfaceStyle,
      settingCompactCards: settings.compactCards, settingReducedMotion: settings.reducedMotion,
      settingLightweight: settings.lightweight, settingContextMenu: settings.customContextMenu,
      settingShowRecentlyPlayed: settings.showRecentlyPlayed
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
      if (event.key === 'Escape') {
        hideContextMenu();
        if (!document.getElementById('siteSettingsPanel')?.hidden) closeSettings();
      }
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
