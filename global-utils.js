(() => {
  'use strict';

  // Keep the preference key used by the latest published site version so existing settings migrate cleanly.
  const SETTINGS_KEY = 'hummingbird_site_preferences_v1';
  const LEGACY_SETTINGS_KEY = 'hummingbird-site-settings-v2';
  const LOGO_URL = 'https://uploads.onecompiler.io/447kr4gf2/44f9wbztv/humming%5Bbird%5DTech%20logo%20(4).png';
  const ACCOUNT_ID_KEY = 'hummingbird_account_id_v1';
  const ACCOUNT_NAME_KEY = 'hummingbird_account_name_v1';
  const ACCOUNT_TIER_KEY = 'hummingbird_account_tier_v1';
  const TAB_PRESETS_KEY = 'hummingbird_tab_disguise_presets_v1';
  const DEFAULT_FAVICON = 'https://uploads.onecompiler.io/447kr4gf2/44f9wbztv/humming%5Bbird%5DTech%20logo%20(4).png';
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
    showRecentlyPlayed: false,
    hideGameThumbnails: false,
    pastAccentColors: [],
    disguiseTitle: '',
    disguiseFaviconUrl: '',
    disguiseFaviconData: '',
    tabDisguiseActive: false,
    emergencyKey: 'F9',
    emergencyTemplate: 'classroom',
    emergencyScreenshot: '',
    disguiseOnLeave: false,
    stayDisguisedOnReturn: false
  };

  let settings = readSettings();
  let contextMenuElement = null;
  let contextImage = null;
  let erudaLoadPromise = null;
  let erudaInitialized = false;
  let originalDocumentTitle = document.title;
  let originalFaviconHref = '';
  let isCapturingEmergencyKey = false;
  let emergencyOverlayActive = false;
  let emergencyPreviewActive = false;

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
      showRecentlyPlayed: source.showRecentlyPlayed === true,
      hideGameThumbnails: source.hideGameThumbnails === true,
      pastAccentColors: Array.isArray(source.pastAccentColors)
        ? source.pastAccentColors.filter(color => typeof color === 'string' && /^#[0-9a-f]{6}$/i.test(color)).slice(0, 10)
        : [],
      disguiseTitle: typeof source.disguiseTitle === 'string' ? source.disguiseTitle.slice(0, 100) : '',
      disguiseFaviconUrl: typeof source.disguiseFaviconUrl === 'string' ? source.disguiseFaviconUrl.slice(0, 2000) : '',
      disguiseFaviconData: typeof source.disguiseFaviconData === 'string' && source.disguiseFaviconData.startsWith('data:image/') ? source.disguiseFaviconData : '',
      tabDisguiseActive: source.tabDisguiseActive === true,
      emergencyKey: typeof source.emergencyKey === 'string' && source.emergencyKey.length <= 12 ? source.emergencyKey : DEFAULTS.emergencyKey,
      emergencyTemplate: ['classroom', 'docs', 'wikipedia', 'custom'].includes(source.emergencyTemplate) ? source.emergencyTemplate : DEFAULTS.emergencyTemplate,
      emergencyScreenshot: typeof source.emergencyScreenshot === 'string' && source.emergencyScreenshot.startsWith('data:image/') ? source.emergencyScreenshot : '',
      disguiseOnLeave: source.disguiseOnLeave === true,
      stayDisguisedOnReturn: source.stayDisguisedOnReturn === true
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
    originalDocumentTitle = document.title;
    const initialIcon = document.querySelector('link[rel~="icon"], link[rel="shortcut icon"]');
    originalFaviconHref = initialIcon?.href || DEFAULT_FAVICON;
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
      'reduced-motion', 'compact-cards', 'hide-game-thumbnails'
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
    if (settings.hideGameThumbnails) body.classList.add('hide-game-thumbnails');

    body.style.setProperty('--corner-radius', `${clamp(settings.cornerRadius, 0, 32)}px`);
    body.style.setProperty('--glass-opacity', `${clamp(settings.glassOpacity, 0, 90) / 100}`);
    body.style.setProperty('--glass-blur', `${clamp(settings.glassBlur, 0, 24)}px`);
    body.style.setProperty('--accent', accentColor(settings.accent));
    body.style.setProperty('--custom-page-background', settings.customBackground);
    body.style.setProperty('--font-scale', String(clamp(settings.fontScale, 85, 130) / 100));
    updateHeaderLabels();
    applyTabDisguise();
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
        <a class="site-tab" href="submit.html">Game feedback</a>
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
      <p>Not Copyright © 2026 humming[bird]Tech. No rights reserved.</p>
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
        <section class="settings-section"><h3>Account</h3>
          <label class="settings-field"><span>Display name</span><input id="accountDisplayName" type="text" maxlength="32" autocomplete="nickname" placeholder="Choose a name"></label>
          <div class="settings-action-row"><button id="saveAccountName" type="button">Save name</button></div>
          <div class="settings-account-id"><span>Your account ID</span><code id="accountIdValue"></code><button id="copyAccountId" type="button">Copy ID</button></div>
          <div class="settings-account-id"><span>Account tier</span><code id="accountTierValue">Not assigned</code></div>
          <p class="settings-description">Your name and ID are saved in this browser. This version of the site does not yet have a shared account service for syncing names or admin-assigned tiers between visitors.</p>
        </section>

        <section class="settings-section"><h3>Appearance</h3>
          <label class="settings-field"><span>Theme</span><select id="settingBrightness"><option value="normal">Automatic style</option><option value="dark">Dark mode</option><option value="light">Light mode</option><option value="contrast">High contrast</option></select></label>
          <label class="settings-field"><span>Background</span><select id="settingBackground"><option value="gradient">Original</option><option value="forest">Forest</option><option value="midnight">Midnight</option><option value="slate">Slate</option><option value="sunrise">Sunset</option><option value="ocean">Ocean</option><option value="charcoal">Charcoal</option><option value="lavender">Lavender</option><option value="sand">Sand</option><option value="paper">Paper</option><option value="plain">Plain white</option><option value="custom">Custom color</option></select></label>
          <label class="settings-field"><span>Custom background</span><input id="settingCustomBackground" type="color" aria-label="Custom background color"></label>
          <label class="settings-field"><span>Accent color</span><select id="settingAccent"><option value="green">Green</option><option value="blue">Muted teal</option><option value="violet">Plum</option><option value="amber">Warm</option><option value="slate">Graphite</option><option value="custom">Custom</option></select></label>
          <label class="settings-field"><span>Pick a custom accent</span><input id="settingCustomAccent" type="color" aria-label="Custom accent color"></label>
          <div class="settings-past-colors"><span>Past colors</span><div id="pastAccentColors" class="past-accent-swatches" aria-label="Previously used accent colors"></div></div>
          <label class="settings-field"><span>Text size</span><select id="settingFontScale"><option value="90">Small</option><option value="100">Default</option><option value="110">Large</option><option value="120">Extra large</option><option value="130">Huge</option></select></label>
        </section>

        <section class="settings-section"><h3>Backup &amp; restore</h3>
          <p class="settings-description">Save this site’s local browser data, including settings, bookmarks, recently played games, your name, account ID, and game progress saved to this site’s localStorage. Storage kept separately by external game sites may not be included.</p>
          <div class="settings-action-row"><button id="settingsExport" type="button">Export account data</button><button id="settingsImport" type="button">Import account data</button><input id="settingsImportFile" type="file" accept="application/json,.json" hidden></div>
        </section>

        <section class="settings-section"><h3>Display</h3>
          <label class="settings-check"><input id="settingHideGameThumbnails" type="checkbox"><span>Hide game thumbnails</span></label>
        </section>

        <section class="settings-section"><h3>Emergency disguise</h3>
          <p class="settings-description">Show a full-screen cover and switch the browser tab to match. Press your shortcut again to return to the page.</p>
          <div class="settings-action-row"><button id="settingEmergencyKeyButton" type="button">Change shortcut (F9)</button><button id="resetEmergencyKey" type="button">Reset shortcut</button></div>
          <p id="emergencyKeyHelp" class="settings-description">Choose one key. Browser shortcuts and keys pressed while typing are left alone.</p>
          <label class="settings-field"><span>Cover screen</span><select id="settingEmergencyTemplate"><option value="classroom">Google Classroom</option><option value="docs">Google Docs</option><option value="wikipedia">Wikipedia</option><option value="custom">My uploaded screenshot</option></select></label>
          <label class="settings-field"><span>Upload a cover screenshot</span><input id="settingEmergencyScreenshot" type="file" accept="image/png,image/jpeg,image/webp,image/avif"></label>
          <label class="settings-check"><input id="settingDisguiseOnLeave" type="checkbox"><span>Turn on the disguise when I leave this tab</span></label>
          <label class="settings-check"><input id="settingStayDisguisedOnReturn" type="checkbox"><span>Keep the disguise on when I come back</span></label>
          <div class="settings-action-row"><button id="previewEmergencyDisguise" type="button">Preview emergency screen</button></div>
        </section>

        <section class="settings-section"><h3>Game browsing</h3>
          <label class="settings-check"><input id="settingShowRecentlyPlayed" type="checkbox"><span>Show recently played games</span></label>
        </section>

        <section class="settings-section"><h3>Interface</h3>
          <label class="settings-range"><span>Corner roundness <output id="cornerRadiusValue">16px</output></span><input id="settingCornerRadius" type="range" min="0" max="32" step="1"></label>
          <label class="settings-range"><span>Liquid glass opacity <output id="glassOpacityValue">14%</output></span><input id="settingGlassOpacity" type="range" min="0" max="90" step="1"></label>
          <label class="settings-range"><span>Glass blur <output id="glassBlurValue">10px</output></span><input id="settingGlassBlur" type="range" min="0" max="24" step="1"></label>
          <label class="settings-field"><span>Surface style</span><select id="settingSurfaceStyle"><option value="glass">Liquid glass</option><option value="solid">Solid</option><option value="minimal">Minimal</option><option value="flat">Flat</option></select></label>
          <label class="settings-check"><input id="settingCompactCards" type="checkbox"><span>Compact cards</span></label>
          <label class="settings-check"><input id="settingReducedMotion" type="checkbox"><span>Reduce motion</span></label>
        </section>

        <section class="settings-section"><h3>Performance &amp; controls</h3>
          <label class="settings-check"><input id="settingLightweight" type="checkbox"><span>Lightweight mode</span></label>
          <label class="settings-check"><input id="settingContextMenu" type="checkbox"><span>Use the custom right-click menu</span></label>
        </section>

        <section class="settings-section"><h3>Tab disguise</h3>
          <label class="settings-field"><span>Tab title</span><input id="settingDisguiseTitle" type="text" maxlength="100" placeholder="Title shown in the browser tab"></label>
          <label class="settings-field"><span>Favicon URL (optional)</span><input id="settingDisguiseFaviconUrl" type="url" placeholder="https://example.com/favicon.ico"></label>
          <label class="settings-field"><span>Upload a favicon</span><input id="settingDisguiseFaviconFile" type="file" accept="image/png,image/jpeg,image/svg+xml,image/webp,image/x-icon"></label>
          <div class="settings-preset-grid" aria-label="Built-in tab disguises">
            <button type="button" data-tab-preset="classroom">🏫 Google Classroom</button>
            <button type="button" data-tab-preset="khan">📚 Khan Academy</button>
            <button type="button" data-tab-preset="docs">📄 Google Docs</button>
            <button type="button" data-tab-preset="youtube">▶️ YouTube</button>
            <button type="button" data-tab-preset="wikipedia">📖 Wikipedia</button>
            <button type="button" data-tab-preset="desmos">📐 Desmos</button>
            <button type="button" data-tab-preset="quizlet">🗂️ Quizlet</button>
            <button type="button" data-tab-preset="gmail">✉️ Gmail</button>
            <button type="button" data-tab-preset="drive">📁 Google Drive</button>
            <button type="button" data-tab-preset="canvas">🎓 Canvas</button>
          </div>
          <div class="settings-preset-manager">
            <label class="settings-field"><span>My presets</span><select id="myTabPresets"><option value="">No saved presets</option></select></label>
            <div class="settings-action-row"><button id="saveTabPreset" type="button">Save current as preset</button><button id="applyTabPreset" type="button">Apply saved preset</button></div>
          </div>
          <div class="settings-action-row"><button id="applyTabDisguise" type="button">Apply tab disguise</button><button id="clearTabDisguise" type="button">Clear disguise</button></div>
        </section>
      </div>
      <div class="settings-footer">
        <button class="settings-reset" id="settingsReset" type="button">Reset preferences</button>
      </div>`;
    const header = document.getElementById('siteHeader');
    header.insertAdjacentElement('afterend', panel);
    document.getElementById('settingsExport').addEventListener('click', exportAccountData);
    document.getElementById('settingsImport').addEventListener('click', () => document.getElementById('settingsImportFile').click());
    document.getElementById('settingsImportFile').addEventListener('change', importAccountDataFile);
    document.getElementById('settingsSearch').addEventListener('input', event => filterSettingsSections(event.target.value));
    document.getElementById('settingsReset').addEventListener('click', () => {
      settings = { ...DEFAULTS, pastAccentColors: [] };
      if (emergencyOverlayActive) exitEmergencyDisguise();
      saveSettings();
      applySettings();
      syncSettingsControls();
    });
    document.getElementById('saveAccountName').addEventListener('click', saveAccountName);
    document.getElementById('copyAccountId').addEventListener('click', async () => {
      try { await copyText(getOrCreateAccountId()); }
      catch (error) { window.alert(error.message || 'Could not copy the account ID.'); }
    });

    const bindings = {
      settingBrightness: 'brightness', settingBackground: 'background', settingAccent: 'accent',
      settingCustomBackground: 'customBackground', settingCustomAccent: 'customAccent',
      settingFontScale: 'fontScale', settingCornerRadius: 'cornerRadius',
      settingGlassOpacity: 'glassOpacity', settingGlassBlur: 'glassBlur',
      settingSurfaceStyle: 'surfaceStyle', settingCompactCards: 'compactCards',
      settingReducedMotion: 'reducedMotion', settingLightweight: 'lightweight',
      settingContextMenu: 'customContextMenu', settingShowRecentlyPlayed: 'showRecentlyPlayed',
      settingHideGameThumbnails: 'hideGameThumbnails', settingDisguiseTitle: 'disguiseTitle',
      settingDisguiseFaviconUrl: 'disguiseFaviconUrl', settingEmergencyTemplate: 'emergencyTemplate',
      settingDisguiseOnLeave: 'disguiseOnLeave', settingStayDisguisedOnReturn: 'stayDisguisedOnReturn'
    };
    Object.entries(bindings).forEach(([id, key]) => {
      const control = document.getElementById(id);
      if (!control) return;
      control.addEventListener('input', () => updateSettingFromControl(control, key));
      control.addEventListener('change', () => updateSettingFromControl(control, key));
    });

    document.getElementById('settingEmergencyKeyButton').addEventListener('click', beginEmergencyKeyCapture);
    document.getElementById('resetEmergencyKey').addEventListener('click', () => {
      settings.emergencyKey = DEFAULTS.emergencyKey;
      saveSettings();
      updateEmergencyKeyButton();
    });
    document.getElementById('previewEmergencyDisguise').addEventListener('click', () => {
      if (emergencyOverlayActive) exitEmergencyDisguise();
      else enterEmergencyDisguise(true);
    });
    document.getElementById('settingEmergencyScreenshot').addEventListener('change', handleEmergencyScreenshotUpload);
    document.getElementById('settingDisguiseFaviconFile').addEventListener('change', handleFaviconUpload);
    document.querySelectorAll('[data-tab-preset]').forEach(button => {
      button.addEventListener('click', () => chooseBuiltInTabPreset(button.dataset.tabPreset));
    });
    document.getElementById('saveTabPreset').addEventListener('click', saveCurrentTabPreset);
    document.getElementById('applyTabPreset').addEventListener('click', applySavedTabPreset);
    document.getElementById('applyTabDisguise').addEventListener('click', () => {
      settings.tabDisguiseActive = true;
      saveSettings();
      applyTabDisguise();
    });
    document.getElementById('clearTabDisguise').addEventListener('click', clearTabDisguise);

    fillAccountControls();
    renderTabPresetOptions();
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
      section.querySelectorAll('.settings-field, .settings-range, .settings-check, .settings-action-row, .settings-description, .settings-preset-grid, .settings-past-colors, .settings-preset-manager, .settings-account-id').forEach(row => {
        const match = !needle || row.textContent.toLowerCase().includes(needle);
        row.hidden = !match;
        if (match) visible++;
      });
      section.hidden = visible === 0;
    });
  }

  function exportAccountData() {
    const storage = {};
    for (let index = 0; index < localStorage.length; index++) {
      const key = localStorage.key(index);
      if (key !== null) storage[key] = localStorage.getItem(key);
    }
    storage[ACCOUNT_ID_KEY] = getOrCreateAccountId();
    const backup = {
      format: 'hummingbird-account-backup',
      version: 1,
      exportedAt: new Date().toISOString(),
      storage
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'hummingbird-account-backup.json';
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 30000);
  }

  async function importAccountDataFile(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      if (parsed && parsed.format === 'hummingbird-account-backup' && parsed.storage && typeof parsed.storage === 'object' && !Array.isArray(parsed.storage)) {
        localStorage.clear();
        for (const [key, value] of Object.entries(parsed.storage)) {
          if (typeof value === 'string') localStorage.setItem(key, value);
        }
      } else if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        // Continue to accept older settings-only exports from earlier versions.
        const allowed = new Set(Object.keys(DEFAULTS));
        const cleaned = {};
        for (const [key, value] of Object.entries(parsed)) {
          if (allowed.has(key) && typeof value === typeof DEFAULTS[key]) cleaned[key] = value;
        }
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(cleaned));
      } else {
        throw new Error('This file is not a Hummingbird account backup.');
      }
      settings = readSettings();
      if (emergencyOverlayActive) exitEmergencyDisguise();
      saveSettings();
      applySettings();
      syncSettingsControls();
      fillAccountControls();
      renderTabPresetOptions();
      window.alert('Account data restored. The page will reload so saved game data can be re-read.');
      window.location.reload();
    } catch (error) {
      window.alert('Could not restore account data: ' + error.message);
    } finally {
      event.target.value = '';
    }
  }

  function getOrCreateAccountId() {
    let id = '';
    try { id = localStorage.getItem(ACCOUNT_ID_KEY) || ''; } catch (_) {}
    if (!id) {
      id = window.crypto?.randomUUID ? window.crypto.randomUUID() : `hb-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
      try { localStorage.setItem(ACCOUNT_ID_KEY, id); } catch (_) {}
    }
    return id;
  }

  function fillAccountControls() {
    const nameInput = document.getElementById('accountDisplayName');
    const idOutput = document.getElementById('accountIdValue');
    if (nameInput) nameInput.value = localStorage.getItem(ACCOUNT_NAME_KEY) || '';
    if (idOutput) idOutput.textContent = getOrCreateAccountId();
    const tierOutput = document.getElementById('accountTierValue');
    if (tierOutput) tierOutput.textContent = localStorage.getItem(ACCOUNT_TIER_KEY) || 'Not assigned';
  }

  function saveAccountName() {
    const input = document.getElementById('accountDisplayName');
    const name = String(input?.value || '').trim().replace(/\s+/g, ' ').slice(0, 32);
    try { localStorage.setItem(ACCOUNT_NAME_KEY, name); }
    catch (_) { window.alert('Could not save the name in this browser.'); return; }
    if (input) input.value = name;
    const button = document.getElementById('saveAccountName');
    if (button) {
      const previous = button.textContent;
      button.textContent = 'Saved';
      setTimeout(() => { button.textContent = previous; }, 1300);
    }
  }

  function recordPastAccentColor(color) {
    if (!/^#[0-9a-f]{6}$/i.test(color)) return;
    settings.pastAccentColors = [color, ...(settings.pastAccentColors || []).filter(item => item.toLowerCase() !== color.toLowerCase())].slice(0, 10);
  }

  function renderPastAccentColors() {
    const container = document.getElementById('pastAccentColors');
    if (!container) return;
    container.replaceChildren();
    (settings.pastAccentColors || []).forEach(color => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'past-accent-swatch';
      button.style.setProperty('--swatch-color', color);
      button.title = `Use ${color}`;
      button.setAttribute('aria-label', `Use accent color ${color}`);
      button.addEventListener('click', () => {
        settings.customAccent = color;
        settings.accent = 'custom';
        recordPastAccentColor(color);
        saveSettings();
        applySettings();
        syncSettingsControls();
      });
      container.appendChild(button);
    });
    if (!container.children.length) {
      const empty = document.createElement('span');
      empty.className = 'settings-muted';
      empty.textContent = 'Your recent custom colors will appear here.';
      container.appendChild(empty);
    }
  }

  const BUILT_IN_TAB_PRESETS = {
    classroom: { title: 'Google Classroom', domain: 'classroom.google.com' },
    khan: { title: 'Khan Academy', domain: 'khanacademy.org' },
    docs: { title: 'Google Docs', domain: 'docs.google.com' },
    youtube: { title: 'YouTube', domain: 'youtube.com' },
    wikipedia: { title: 'Wikipedia', domain: 'wikipedia.org' },
    desmos: { title: 'Desmos', domain: 'desmos.com' },
    quizlet: { title: 'Quizlet', domain: 'quizlet.com' },
    gmail: { title: 'Gmail', domain: 'mail.google.com' },
    drive: { title: 'Google Drive', domain: 'drive.google.com' },
    canvas: { title: 'Canvas', domain: 'instructure.com' }
  };

  function chooseBuiltInTabPreset(key) {
    const preset = BUILT_IN_TAB_PRESETS[key];
    if (!preset) return;
    settings.disguiseTitle = preset.title;
    settings.disguiseFaviconUrl = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(preset.domain)}&sz=64`;
    settings.disguiseFaviconData = '';
    syncSettingsControls();
    saveSettings();
  }

  function loadTabPresets() {
    try {
      const presets = JSON.parse(localStorage.getItem(TAB_PRESETS_KEY) || '[]');
      return Array.isArray(presets) ? presets.filter(item => item && typeof item.name === 'string' && typeof item.title === 'string') : [];
    } catch (_) { return []; }
  }

  function renderTabPresetOptions() {
    const select = document.getElementById('myTabPresets');
    if (!select) return;
    const presets = loadTabPresets();
    const previous = select.value;
    select.replaceChildren();
    const empty = document.createElement('option');
    empty.value = '';
    empty.textContent = presets.length ? 'Choose a saved preset' : 'No saved presets';
    select.appendChild(empty);
    presets.forEach((preset, index) => {
      const option = document.createElement('option');
      option.value = String(index);
      option.textContent = preset.name;
      select.appendChild(option);
    });
    if (previous && Number(previous) < presets.length) select.value = previous;
  }

  function saveCurrentTabPreset() {
    const name = window.prompt('Name this tab disguise:');
    if (!name || !name.trim()) return;
    const presets = loadTabPresets();
    presets.push({
      name: name.trim().slice(0, 40),
      title: settings.disguiseTitle || '',
      faviconUrl: settings.disguiseFaviconUrl || '',
      faviconData: settings.disguiseFaviconData || ''
    });
    try { localStorage.setItem(TAB_PRESETS_KEY, JSON.stringify(presets)); }
    catch (_) { window.alert('Could not save this preset. Browser storage may be full.'); return; }
    renderTabPresetOptions();
    const select = document.getElementById('myTabPresets');
    if (select) select.value = String(presets.length - 1);
  }

  function applySavedTabPreset() {
    const select = document.getElementById('myTabPresets');
    const index = Number(select?.value);
    const preset = loadTabPresets()[index];
    if (!preset) { window.alert('Choose one of your saved presets first.'); return; }
    settings.disguiseTitle = preset.title || '';
    settings.disguiseFaviconUrl = preset.faviconUrl || '';
    settings.disguiseFaviconData = preset.faviconData || '';
    syncSettingsControls();
    saveSettings();
  }

  function clearTabDisguise() {
    settings.disguiseTitle = '';
    settings.disguiseFaviconUrl = '';
    settings.disguiseFaviconData = '';
    settings.tabDisguiseActive = false;
    const file = document.getElementById('settingDisguiseFaviconFile');
    if (file) file.value = '';
    saveSettings();
    syncSettingsControls();
    applyTabDisguise();
  }

  function getFaviconLink() {
    let link = document.querySelector('link[rel~="icon"], link[rel="shortcut icon"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    if (!originalFaviconHref) originalFaviconHref = link.href || DEFAULT_FAVICON;
    return link;
  }

  function applyTabDisguise() {
    if (emergencyOverlayActive) return;
    const link = getFaviconLink();
    if (settings.tabDisguiseActive) {
      document.title = settings.disguiseTitle || originalDocumentTitle;
      link.href = settings.disguiseFaviconData || settings.disguiseFaviconUrl || originalFaviconHref || DEFAULT_FAVICON;
    } else {
      document.title = originalDocumentTitle;
      link.href = originalFaviconHref || DEFAULT_FAVICON;
    }
  }

  function handleFaviconUpload(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    if (file.size > 512 * 1024) {
      window.alert('Please choose a favicon smaller than 512 KB.');
      event.target.value = '';
      return;
    }
    readImageFile(file).then(dataUrl => {
      settings.disguiseFaviconData = dataUrl;
      settings.disguiseFaviconUrl = '';
      saveSettings();
      syncSettingsControls();
      applyTabDisguise();
    }).catch(error => window.alert(error.message));
  }

  function handleEmergencyScreenshotUpload(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    if (file.size > 1500 * 1024) {
      window.alert('Please choose a screenshot smaller than 1.5 MB so it can be saved in browser storage.')
      event.target.value = '';
      return;
    }
    readImageFile(file).then(dataUrl => {
      settings.emergencyScreenshot = dataUrl;
      settings.emergencyTemplate = 'custom';
      saveSettings();
      syncSettingsControls();
    }).catch(error => window.alert(error.message));
  }

  function readImageFile(file) {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) { reject(new Error('Choose a valid image file.')); return; }
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = () => reject(new Error('The image could not be read.'));
      reader.readAsDataURL(file);
    });
  }

  function updateEmergencyKeyButton() {
    const button = document.getElementById('settingEmergencyKeyButton');
    const help = document.getElementById('emergencyKeyHelp');
    if (button) button.textContent = isCapturingEmergencyKey ? 'Press a key…' : `Change shortcut (${settings.emergencyKey})`;
    if (help && !isCapturingEmergencyKey) help.textContent = 'Choose one key. Browser shortcuts and keys pressed while typing are left alone.';
  }

  function beginEmergencyKeyCapture() {
    isCapturingEmergencyKey = true;
    updateEmergencyKeyButton();
    const help = document.getElementById('emergencyKeyHelp');
    if (help) help.textContent = 'Now press the key you want to use. Modifier and browser-reserved keys cannot be assigned.';
  }

  function isEditableTarget(target) {
    return Boolean(target && (target.isContentEditable || target.closest?.('input, textarea, select, [contenteditable="true"]')));
  }

  function handleEmergencyKeydown(event) {
    if (event.ctrlKey || event.metaKey || event.altKey || event.shiftKey || event.repeat) return;
    if (isCapturingEmergencyKey && !isEditableTarget(event.target)) {
      const key = event.key;
      const reserved = ['Escape', 'Tab', 'Enter', ' ', 'F1', 'F3', 'F4', 'F5', 'F6', 'F7', 'F11', 'F12', 'Backspace', 'Delete'];
      const allowedFunctionKey = ['F2', 'F8', 'F9', 'F10'].includes(key);
      if (!reserved.includes(key) && (key.length === 1 || allowedFunctionKey)) {
        event.preventDefault();
        settings.emergencyKey = key;
        isCapturingEmergencyKey = false;
        saveSettings();
        updateEmergencyKeyButton();
      }
      return;
    }
    if (isCapturingEmergencyKey || isEditableTarget(event.target)) return;
    if (event.key.toLowerCase() === String(settings.emergencyKey).toLowerCase()) {
      event.preventDefault();
      if (emergencyOverlayActive) exitEmergencyDisguise();
      else enterEmergencyDisguise(false);
    }
  }

  function emergencyPresetDetails() {
    const details = {
      classroom: { title: 'Google Classroom', domain: 'classroom.google.com' },
      docs: { title: 'Google Docs', domain: 'docs.google.com' },
      wikipedia: { title: 'Wikipedia', domain: 'wikipedia.org' },
      custom: { title: 'Google Classroom', domain: 'classroom.google.com' }
    };
    return details[settings.emergencyTemplate] || details.classroom;
  }

  function emergencyScreenMarkup() {
    if (settings.emergencyTemplate === 'custom' && settings.emergencyScreenshot) {
      return `<img class="emergency-custom-screenshot" src="${escapeAttribute(settings.emergencyScreenshot)}" alt="Emergency disguise screen">`;
    }
    if (settings.emergencyTemplate === 'docs') return `
      <div class="emergency-docs"><header><b class="docs-mark">▣</b><span>Untitled document</span><span class="docs-spacer"></span><button>Share</button></header><nav>File　Edit　View　Insert　Format　Tools　Extensions　Help</nav><div class="docs-toolbar">↶　↷　▤　100%　Normal text　Arial　−　12　＋　B　I　U　A</div><article><h1>Untitled document</h1><p></p></article></div>`;
    if (settings.emergencyTemplate === 'wikipedia') return `
      <div class="emergency-wiki"><header><b>WIKIPEDIA</b><span>The Free Encyclopedia</span></header><nav>Main page　Contents　Current events　Random article　About</nav><main><aside>Contents<br><br>Overview<br>History<br>References</aside><article><h1>Welcome to Wikipedia</h1><p>the free encyclopedia that anyone can edit</p><hr><h2>From today's featured article</h2><p>Explore articles, topics, and reference material from across the encyclopedia.</p><h2>In the news</h2><p>Recent events and notable updates from around the world.</p></article></main></div>`;
    return `
      <div class="emergency-classroom"><header><b>▦</b><span>Classroom</span><span class="classroom-spacer"></span><span>▦</span><span>●</span></header><nav><span>☰</span><span>▣　Classes</span><span>▤　Calendar</span><span>▣　Teaching</span></nav><main><h1>Classes</h1><div class="classroom-cards"><section><div class="classroom-card-top">Science</div><h2>Science</h2><p>Room 204</p></section><section><div class="classroom-card-top">Mathematics</div><h2>Mathematics</h2><p>Period 2</p></section><section><div class="classroom-card-top">History</div><h2>History</h2><p>Room 108</p></section></div></main></div>`;
  }

  function enterEmergencyDisguise(preview) {
    emergencyOverlayActive = true;
    emergencyPreviewActive = Boolean(preview);
    let overlay = document.getElementById('emergencyDisguiseOverlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'emergencyDisguiseOverlay';
      overlay.className = 'emergency-disguise-overlay';
      overlay.setAttribute('aria-hidden', 'true');
      document.body.appendChild(overlay);
    }
    overlay.innerHTML = emergencyScreenMarkup();
    overlay.setAttribute('aria-hidden', 'false');
    overlay.classList.add('is-visible');
    document.body.classList.add('emergency-disguise-active');
    const details = emergencyPresetDetails();
    document.title = details.title;
    getFaviconLink().href = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(details.domain)}&sz=64`;
  }

  function exitEmergencyDisguise() {
    emergencyOverlayActive = false;
    emergencyPreviewActive = false;
    const overlay = document.getElementById('emergencyDisguiseOverlay');
    if (overlay) { overlay.classList.remove('is-visible'); overlay.setAttribute('aria-hidden', 'true'); }
    document.body.classList.remove('emergency-disguise-active');
    applyTabDisguise();
  }

  function handleAutomaticEmergencyDisguise() {
    if (!settings.disguiseOnLeave) return;
    if (document.visibilityState === 'hidden') {
      if (!emergencyOverlayActive) enterEmergencyDisguise(false);
      return;
    }
    if (document.visibilityState === 'visible' && emergencyOverlayActive && !settings.stayDisguisedOnReturn) {
      exitEmergencyDisguise();
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
      recordPastAccentColor(settings.customAccent);
      const accentSelect = document.getElementById('settingAccent');
      if (accentSelect) accentSelect.value = 'custom';
    }
    if (key === 'surfaceStyle') settings.liquidGlass = settings.surfaceStyle === 'glass';
    if (key === 'disguiseFaviconUrl') {
      settings.disguiseFaviconData = '';
      const upload = document.getElementById('settingDisguiseFaviconFile');
      if (upload) upload.value = '';
    }
    saveSettings();
    applySettings();
    updateRangeOutputs();
    renderPastAccentColors();
    if (key === 'emergencyTemplate' && emergencyOverlayActive) enterEmergencyDisguise(emergencyPreviewActive);
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
      settingShowRecentlyPlayed: settings.showRecentlyPlayed, settingHideGameThumbnails: settings.hideGameThumbnails,
      settingDisguiseTitle: settings.disguiseTitle, settingDisguiseFaviconUrl: settings.disguiseFaviconUrl,
      settingEmergencyTemplate: settings.emergencyTemplate, settingDisguiseOnLeave: settings.disguiseOnLeave,
      settingStayDisguisedOnReturn: settings.stayDisguisedOnReturn
    };
    Object.entries(values).forEach(([id, value]) => {
      const control = document.getElementById(id);
      if (!control) return;
      if (control.type === 'checkbox') control.checked = Boolean(value);
      else control.value = String(value);
    });
    updateRangeOutputs();
    updateHeaderLabels();
    renderPastAccentColors();
    updateEmergencyKeyButton();
    applyTabDisguise();
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


  function openErudaConsole() {
    const initializeConsole = () => {
      if (!window.eruda) throw new Error('Eruda did not finish loading.');
      if (!erudaInitialized) {
        window.eruda.init();
        erudaInitialized = true;
      }
      window.eruda.show();
    };

    if (window.eruda) {
      initializeConsole();
      return Promise.resolve();
    }
    if (!erudaLoadPromise) {
      erudaLoadPromise = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/eruda';
        script.async = true;
        script.onload = resolve;
        script.onerror = () => reject(new Error('Could not load Eruda. Check your connection and try again.'));
        document.head.appendChild(script);
      }).catch(error => {
        erudaLoadPromise = null;
        throw error;
      });
    }
    return erudaLoadPromise.then(initializeConsole);
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
      <button class="context-item" type="button" data-action="eruda">Developer console (Eruda)</button>
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
        case 'eruda': await openErudaConsole(); break;
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
    document.addEventListener('keydown', handleEmergencyKeydown, true);
    const bindFrameShortcut = frame => {
      if (!(frame instanceof HTMLIFrameElement) || frame.dataset.emergencyKeyBound === 'true') return;
      frame.dataset.emergencyKeyBound = 'true';
      const bind = () => {
        try { frame.contentDocument?.addEventListener('keydown', handleEmergencyKeydown, true); } catch (_) {}
      };
      frame.addEventListener('load', bind);
      bind();
    };
    document.querySelectorAll('iframe').forEach(bindFrameShortcut);
    if ('MutationObserver' in window) {
      const frameObserver = new MutationObserver(records => {
        records.forEach(record => record.addedNodes.forEach(node => {
          if (!(node instanceof Element)) return;
          if (node.matches?.('iframe')) bindFrameShortcut(node);
          node.querySelectorAll?.('iframe').forEach(bindFrameShortcut);
        }));
      });
      frameObserver.observe(document.body, { childList: true, subtree: true });
    }
    document.addEventListener('visibilitychange', handleAutomaticEmergencyDisguise);
    window.addEventListener('blur', () => {
      if (settings.disguiseOnLeave && !emergencyOverlayActive) enterEmergencyDisguise(false);
    });
    window.addEventListener('focus', () => {
      if (emergencyOverlayActive && !settings.stayDisguisedOnReturn && document.visibilityState === 'visible') exitEmergencyDisguise();
    });
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
