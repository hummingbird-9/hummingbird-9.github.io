(() => {
  'use strict';

  // Keep the preference key used by the latest published site version so existing settings migrate cleanly.
  const SETTINGS_KEY = 'hummingbird_site_preferences_v1';
  const LEGACY_SETTINGS_KEY = 'hummingbird-site-settings-v2';
  const LOGO_URL = 'img/humminglogo.png';
  const TAB_PRESETS_KEY = 'hummingbird_tab_disguise_presets_v1';
  const DEFAULT_FAVICON = 'img/humming.png';
  const DEFAULTS = {
    brightness: 'normal',
    background: 'gradient',
    surfaceStyle: 'glass',
    customBackground: '#ffffff',
    cornerRadius: 9,
    glassOpacity: 0,
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
    logoClickGame: 'pong',
    pastAccentColors: [],
    disguiseTitle: '',
    disguiseFaviconUrl: '',
    disguiseFaviconData: '',
    tabDisguiseActive: false,
    emergencyKey: 'F9',
    emergencyTemplate: 'classroom',
    disguiseOnLeave: false,
    stayDisguisedOnReturn: false,
    classroomTeacherName: 'Nicole Librearski',
    classroomTeacherAvatarData: 'img/overlays/classroom-floral-avatar.svg',
    classroomTeacherColor0: '#4e7fc3',
    classroomTeacherColor1: '#3b9a58',
    classroomTeacherColor2: '#f18a25',
    classroomTeacherColor3: '#9270c9',
    classroomTeacherColor4: '#27adb6'
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
    // The former built-in default was Flappy Bird; switch that old default to Pong once.
    try {
      const migrationKey = 'hummingbird_logo_game_default_pong_v1';
      if (!localStorage.getItem(migrationKey)) {
        if (!source.logoClickGame || source.logoClickGame === 'flappy') {
          source.logoClickGame = 'pong';
          localStorage.setItem(SETTINGS_KEY, JSON.stringify({ ...stored, logoClickGame: 'pong' }));
        }
        localStorage.setItem(migrationKey, '1');
      }
    } catch (_) {}
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
      // Treat the old built-in 16px value as the previous default during migration.
      cornerRadius: source.cornerRadius == null || Number(source.cornerRadius) === 12 || Number(source.cornerRadius) === 16 ? DEFAULTS.cornerRadius : source.cornerRadius,
      // Migrate the previous built-in 14% default to 0%; preserve other custom values.
      glassOpacity: source.glassOpacity == null || Number(source.glassOpacity) === 14 ? DEFAULTS.glassOpacity : source.glassOpacity,
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
      logoClickGame: ['off', 'flappy', 'dino', 'snake', 'pong', 'tetris', 'chess'].includes(source.logoClickGame) ? source.logoClickGame : DEFAULTS.logoClickGame,
      pastAccentColors: Array.isArray(source.pastAccentColors)
        ? source.pastAccentColors.filter(color => typeof color === 'string' && /^#[0-9a-f]{6}$/i.test(color)).slice(0, 10)
        : [],
      disguiseTitle: typeof source.disguiseTitle === 'string' ? source.disguiseTitle.slice(0, 100) : '',
      disguiseFaviconUrl: typeof source.disguiseFaviconUrl === 'string' ? source.disguiseFaviconUrl.slice(0, 2000) : '',
      disguiseFaviconData: typeof source.disguiseFaviconData === 'string' && source.disguiseFaviconData.startsWith('data:image/') ? source.disguiseFaviconData : '',
      tabDisguiseActive: source.tabDisguiseActive === true,
      emergencyKey: typeof source.emergencyKey === 'string' && source.emergencyKey.length <= 12 ? source.emergencyKey : DEFAULTS.emergencyKey,
      emergencyTemplate: ['classroom', 'khan', 'youtube', 'wikipedia', 'desmos', 'gmail'].includes(source.emergencyTemplate) ? source.emergencyTemplate : DEFAULTS.emergencyTemplate,
      disguiseOnLeave: source.disguiseOnLeave === true,
      stayDisguisedOnReturn: source.stayDisguisedOnReturn === true,
      classroomTeacherName: typeof source.classroomTeacherName === 'string' && source.classroomTeacherName.trim()
        ? source.classroomTeacherName.trim().slice(0, 60) : DEFAULTS.classroomTeacherName,
      classroomTeacherAvatarData: typeof source.classroomTeacherAvatarData === 'string' && ((source.classroomTeacherAvatarData.startsWith('data:image/') && source.classroomTeacherAvatarData.length <= 400000) || source.classroomTeacherAvatarData === 'img/overlays/classroom-floral-avatar.svg')
        ? source.classroomTeacherAvatarData : DEFAULTS.classroomTeacherAvatarData,
      classroomTeacherColor0: /^#[0-9a-f]{6}$/i.test(source.classroomTeacherColor0 || '') ? source.classroomTeacherColor0 : DEFAULTS.classroomTeacherColor0,
      classroomTeacherColor1: /^#[0-9a-f]{6}$/i.test(source.classroomTeacherColor1 || '') ? source.classroomTeacherColor1 : DEFAULTS.classroomTeacherColor1,
      classroomTeacherColor2: /^#[0-9a-f]{6}$/i.test(source.classroomTeacherColor2 || '') ? source.classroomTeacherColor2 : DEFAULTS.classroomTeacherColor2,
      classroomTeacherColor3: /^#[0-9a-f]{6}$/i.test(source.classroomTeacherColor3 || '') ? source.classroomTeacherColor3 : DEFAULTS.classroomTeacherColor3,
      classroomTeacherColor4: /^#[0-9a-f]{6}$/i.test(source.classroomTeacherColor4 || '') ? source.classroomTeacherColor4 : DEFAULTS.classroomTeacherColor4
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
    clearLegacyAccountData();
    clearHardRefreshMarker();
    originalDocumentTitle = document.title;
    const iconLinks = [...document.querySelectorAll('link[rel~="icon"], link[rel="shortcut icon"]')];
    originalFaviconHref = DEFAULT_FAVICON;
    if (!iconLinks.length) {
      const icon = document.createElement('link');
      icon.rel = 'icon';
      document.head.appendChild(icon);
      iconLinks.push(icon);
    }
    iconLinks.forEach(icon => { icon.href = DEFAULT_FAVICON; });
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
    document.querySelectorAll('.site-brand').forEach(link => {
      if (link.dataset.hardRefreshBound === 'true') return;
      link.dataset.hardRefreshBound = 'true';
      link.addEventListener('click', hardRefreshCurrentDocument);
    });
    const heroLogo = document.querySelector('.home-hero-logo');
    if (!heroLogo || heroLogo.dataset.logoGameBound === 'true') return;
    heroLogo.dataset.logoGameBound = 'true';
    heroLogo.addEventListener('click', event => {
      // Re-read storage so an already-open homepage sees a game choice saved in another tab.
      settings = readSettings();
      const selectedGame = settings.logoClickGame;
      if (selectedGame === 'off') {
        hardRefreshCurrentDocument(event);
        return;
      }
      const miniGames = window.HummingbirdLogoGames;
      if (miniGames && typeof miniGames.open === 'function') {
        event.preventDefault();
        miniGames.open(selectedGame);
      } else {
        hardRefreshCurrentDocument(event);
      }
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
    // --panel is defined on :root, so opacity must live there as well.
    document.documentElement.style.setProperty('--glass-opacity', `${clamp(settings.glassOpacity, 0, 90) / 100}`);
    body.style.setProperty('--glass-blur', `${clamp(settings.glassBlur, 0, 24)}px`);
    body.style.setProperty('--accent', accentColor(settings.accent));
    body.style.setProperty('--custom-page-background', settings.customBackground);
    document.documentElement.style.setProperty('--font-scale', String(clamp(settings.fontScale, 85, 130) / 100));
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
        <a class="site-tab site-settings-tab" href="settings.html">Settings</a>
      </nav>`;
    document.body.prepend(header);
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
    const currentPage = location.pathname.split('/').pop() || 'index.html';
    if (currentPage !== 'settings.html' || document.getElementById('siteSettingsPanel')) return;
    const panel = document.createElement('section');
    panel.id = 'siteSettingsPanel';
    panel.className = 'site-settings-panel';
    panel.hidden = false;
    panel.innerHTML = `
      <div class="settings-panel-heading"><div><h2>Settings</h2><p>Personalize how humming[bird]Tech looks and works.</p></div><span class="settings-beta-label">BETA TEST</span></div>
      <label class="settings-search"><span>Find a setting</span><input id="settingsSearch" type="search" placeholder="Search settings…" autocomplete="off"></label>
      <div class="settings-panel-grid">
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
          <p class="settings-description">Save this site’s local browser data, including settings, bookmarks, recently played games, and game progress stored by this site. Storage kept separately by external game sites may not be included.</p>
          <div class="settings-action-row"><button id="settingsExport" type="button">Export site data</button><button id="settingsImport" type="button">Import site data</button><input id="settingsImportFile" type="file" accept="application/json,.json" hidden></div>
        </section>

        <section class="settings-section"><h3>Display</h3>
          <label class="settings-check"><input id="settingHideGameThumbnails" type="checkbox"><span>Hide game thumbnails</span></label>
        </section>

        <section class="settings-section"><h3>Home logo game</h3>
          <label class="settings-field"><span>Game when clicking the large homepage logo</span><select id="settingLogoClickGame"><option value="flappy">Flappy Bird</option><option value="dino">Chrome Dinosaur</option><option value="snake">Snake</option><option value="pong">Pong</option><option value="tetris">Tetris</option><option value="chess">Chess</option><option value="off">Off — show the normal logo</option></select></label>
          <p class="settings-description">The selected game opens when you click the large logo in the middle of Home. Close it to return to the logo. The small top-left logo always goes Home.</p>
        </section>

        <section class="settings-section"><h3>Emergency disguise</h3>
          <p class="settings-description">Show a full-screen cover image and switch the browser tab to match. Press Escape or click the top-left hint to hide it.</p>
          <div class="settings-action-row"><button id="settingEmergencyKeyButton" type="button">Change shortcut (F9)</button><button id="resetEmergencyKey" type="button">Reset shortcut</button></div>
          <p id="emergencyKeyHelp" class="settings-description">Choose one key. Browser shortcuts and keys pressed while typing are left alone.</p>
          <label class="settings-field"><span>Cover image</span><select id="settingEmergencyTemplate">
            <option value="classroom">Google Classroom</option><option value="khan">Khan Academy</option><option value="youtube">YouTube</option><option value="wikipedia">Wikipedia</option><option value="desmos">Desmos</option><option value="gmail">Gmail</option>
          </select></label>
          <p class="settings-description">Overlay images live in <code>img/overlays/</code>. Already uploaded: <code>google-classroom.png</code> and <code>khan-academy.png</code>. Still missing: <code>youtube.png</code>, <code>wikipedia.png</code>, <code>desmos.png</code>, and <code>gmail.png</code>. JPG, JPEG, WebP, and AVIF also work.</p>
          <details class="emergency-advanced-settings">
            <summary>Further optimization</summary>
            <label class="settings-field"><span>Teacher name</span><input id="settingClassroomTeacherName" type="text" maxlength="60" placeholder="Nicole Librearski"></label>
            <label class="settings-field"><span>Teacher circle image</span><input id="settingClassroomAvatarImage" type="file" accept="image/png,image/jpeg,image/webp,image/gif,image/avif"></label>
            <div class="settings-action-row"><button id="clearClassroomAvatar" type="button">Restore original flower image</button></div>
            <p class="settings-description">The original flower picture stays in each circle. Your tint changes its color while keeping the floral details visible. Upload a different image to replace it.</p>
            <div class="classroom-avatar-color-grid">
              <label class="settings-field"><span>Science circle</span><input id="settingClassroomAvatarColor0" type="color"></label>
              <label class="settings-field"><span>Social Studies circle</span><input id="settingClassroomAvatarColor1" type="color"></label>
              <label class="settings-field"><span>Actively Learn circle</span><input id="settingClassroomAvatarColor2" type="color"></label>
              <label class="settings-field"><span>Wonders circle</span><input id="settingClassroomAvatarColor3" type="color"></label>
              <label class="settings-field"><span>McGraw Hill circle</span><input id="settingClassroomAvatarColor4" type="color"></label>
            </div>
          </details>
          <label class="settings-check"><input id="settingDisguiseOnLeave" type="checkbox"><span>Turn on the disguise when I leave this tab</span></label>
          <label class="settings-check"><input id="settingStayDisguisedOnReturn" type="checkbox"><span>Keep the disguise on when I come back</span></label>
          <div class="settings-action-row"><button id="previewEmergencyDisguise" type="button">Preview emergency screen</button></div>
        </section>

        <section class="settings-section"><h3>Game browsing</h3>
          <label class="settings-check"><input id="settingShowRecentlyPlayed" type="checkbox"><span>Show recently played games</span></label>
        </section>

        <section class="settings-section"><h3>Interface</h3>
          <label class="settings-range"><span>Corner roundness <output id="cornerRadiusValue">9px</output></span><input id="settingCornerRadius" type="range" min="0" max="32" step="1"></label>
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
    if (!header) return;
    document.body.classList.add('settings-page');
    document.title = 'Settings (Beta test) | humming[bird]Tech';
    header.insertAdjacentElement('afterend', panel);
    document.getElementById('settingsExport').addEventListener('click', exportSiteData);
    document.getElementById('settingsImport').addEventListener('click', () => document.getElementById('settingsImportFile').click());
    document.getElementById('settingsImportFile').addEventListener('change', importSiteDataFile);
    document.getElementById('settingsSearch').addEventListener('input', event => filterSettingsSections(event.target.value));
    document.getElementById('settingsReset').addEventListener('click', () => {
      settings = { ...DEFAULTS, pastAccentColors: [] };
      if (emergencyOverlayActive) exitEmergencyDisguise();
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
      settingContextMenu: 'customContextMenu', settingShowRecentlyPlayed: 'showRecentlyPlayed',
      settingHideGameThumbnails: 'hideGameThumbnails', settingLogoClickGame: 'logoClickGame', settingDisguiseTitle: 'disguiseTitle',
      settingDisguiseFaviconUrl: 'disguiseFaviconUrl', settingEmergencyTemplate: 'emergencyTemplate',
      settingDisguiseOnLeave: 'disguiseOnLeave', settingStayDisguisedOnReturn: 'stayDisguisedOnReturn',
      settingClassroomTeacherName: 'classroomTeacherName',
      settingClassroomAvatarColor0: 'classroomTeacherColor0',
      settingClassroomAvatarColor1: 'classroomTeacherColor1',
      settingClassroomAvatarColor2: 'classroomTeacherColor2',
      settingClassroomAvatarColor3: 'classroomTeacherColor3',
      settingClassroomAvatarColor4: 'classroomTeacherColor4'
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
    document.getElementById('settingDisguiseFaviconFile').addEventListener('change', handleFaviconUpload);
    document.getElementById('settingClassroomAvatarImage').addEventListener('change', handleClassroomAvatarUpload);
    document.getElementById('clearClassroomAvatar').addEventListener('click', () => {
      settings.classroomTeacherAvatarData = DEFAULTS.classroomTeacherAvatarData;
      const upload = document.getElementById('settingClassroomAvatarImage');
      if (upload) upload.value = '';
      saveSettings();
      if (emergencyOverlayActive && settings.emergencyTemplate === 'classroom') enterEmergencyDisguise(emergencyPreviewActive);
    });
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

    renderTabPresetOptions();
    syncSettingsControls();
  }

  function openSettings() {
    const settingsUrl = new URL('settings.html', location.href);
    if (location.pathname.endsWith('/settings.html')) {
      document.getElementById('siteSettingsPanel')?.scrollIntoView({
        behavior: settings.reducedMotion || settings.lightweight ? 'auto' : 'smooth',
        block: 'start'
      });
      return;
    }
    location.assign(settingsUrl.href);
  }

  function filterSettingsSections(query) {
    const panel = document.getElementById('siteSettingsPanel');
    if (!panel) return;
    const needle = String(query || '').trim().toLowerCase();
    panel.querySelectorAll('.settings-section').forEach(section => {
      let visible = 0;
      section.querySelectorAll('.settings-field, .settings-range, .settings-check, .settings-action-row, .settings-description, .settings-preset-grid, .settings-past-colors, .settings-preset-manager').forEach(row => {
        const match = !needle || row.textContent.toLowerCase().includes(needle);
        row.hidden = !match;
        if (match) visible++;
      });
      section.hidden = visible === 0;
    });
  }

  function clearLegacyAccountData() {
    // Remove values created by the old local-only account controls.
    ['hummingbird_account_id_v1', 'hummingbird_account_name_v1', 'hummingbird_account_tier_v1'].forEach(key => {
      try { localStorage.removeItem(key); } catch (_) {}
    });
  }

  function exportSiteData() {
    const storage = {};
    for (let index = 0; index < localStorage.length; index++) {
      const key = localStorage.key(index);
      if (key !== null && !key.startsWith('hummingbird_account_')) storage[key] = localStorage.getItem(key);
    }
    const backup = {
      format: 'hummingbird-site-backup',
      version: 1,
      exportedAt: new Date().toISOString(),
      storage
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'hummingbird-site-backup.json';
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 30000);
  }

  async function importSiteDataFile(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      if (parsed && ['hummingbird-site-backup', 'hummingbird-account-backup'].includes(parsed.format) && parsed.storage && typeof parsed.storage === 'object' && !Array.isArray(parsed.storage)) {
        localStorage.clear();
        for (const [key, value] of Object.entries(parsed.storage)) {
          if (typeof value === 'string' && !key.startsWith('hummingbird_account_')) localStorage.setItem(key, value);
        }
      } else if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        // Continue to accept older settings-only exports from previous versions.
        const allowed = new Set(Object.keys(DEFAULTS));
        const cleaned = {};
        for (const [key, value] of Object.entries(parsed)) {
          if (allowed.has(key) && typeof value === typeof DEFAULTS[key]) cleaned[key] = value;
        }
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(cleaned));
      } else {
        throw new Error('This file is not a Hummingbird site-data backup.');
      }
      clearLegacyAccountData();
      settings = readSettings();
      if (emergencyOverlayActive) exitEmergencyDisguise();
      saveSettings();
      applySettings();
      syncSettingsControls();
      renderTabPresetOptions();
      window.alert('Site data restored. The page will reload so saved game data can be re-read.');
      window.location.reload();
    } catch (error) {
      window.alert('Could not restore site data: ' + error.message);
    } finally {
      event.target.value = '';
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
    classroom: {
      title: 'Google Classroom',
      domain: 'classroom.google.com',
      faviconUrl: 'img/humming.png'
    },
    khan: { title: 'Khan Academy', domain: 'khanacademy.org' },
    docs: {
      title: 'Google Docs',
      domain: 'docs.google.com',
      faviconUrl: 'img/humming.png'
    },
    youtube: { title: 'YouTube', domain: 'youtube.com' },
    wikipedia: { title: 'Wikipedia', domain: 'wikipedia.org' },
    desmos: { title: 'Desmos', domain: 'desmos.com' },
    quizlet: { title: 'Quizlet', domain: 'quizlet.com' },
    gmail: {
      title: 'Gmail',
      domain: 'mail.google.com',
      faviconUrl: 'img/humming.png'
    },
    drive: {
      title: 'Google Drive',
      domain: 'drive.google.com',
      faviconUrl: 'img/humming.png'
    },
    canvas: { title: 'Canvas', domain: 'instructure.com' }
  };

  function getPresetFaviconUrl(preset) {
    return 'img/humming.png';
  }

  function getBuiltInPresetForTitle(title) {
    return Object.values(BUILT_IN_TAB_PRESETS).find(preset => preset.title === title) || null;
  }

  function chooseBuiltInTabPreset(key) {
    const preset = BUILT_IN_TAB_PRESETS[key];
    if (!preset) return;
    settings.disguiseTitle = preset.title;
    if (['classroom', 'khan', 'youtube', 'wikipedia', 'desmos', 'gmail'].includes(key)) settings.emergencyTemplate = key;
    settings.disguiseFaviconUrl = getPresetFaviconUrl(preset);
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
      const preset = getBuiltInPresetForTitle(settings.disguiseTitle);
      const savedUrl = settings.disguiseFaviconUrl || '';
      // Existing saved presets may still hold Google's generic favicon-service URL.
      const resolvedUrl = preset
        ? getPresetFaviconUrl(preset)
        : savedUrl;
      link.href = settings.disguiseFaviconData || resolvedUrl || originalFaviconHref || DEFAULT_FAVICON;
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

  function handleClassroomAvatarUpload(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      window.alert('Choose a valid image file.');
      event.target.value = '';
      return;
    }
    if (file.size > 256 * 1024) {
      window.alert('Please choose a teacher image smaller than 256 KB.');
      event.target.value = '';
      return;
    }
    readImageFile(file).then(dataUrl => {
      settings.classroomTeacherAvatarData = dataUrl;
      saveSettings();
      if (emergencyOverlayActive && settings.emergencyTemplate === 'classroom') enterEmergencyDisguise(emergencyPreviewActive);
    }).catch(error => window.alert(error.message)).finally(() => { event.target.value = ''; });
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
    if (help && !isCapturingEmergencyKey) help.textContent = 'Choose one key to show the cover. Press Escape at any time to hide it.';
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
    if (event.key === 'Escape' && emergencyOverlayActive) {
      event.preventDefault();
      event.stopImmediatePropagation();
      exitEmergencyDisguise();
      return;
    }
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

  const EMERGENCY_IMAGE_FILES = {
    classroom: 'google-classroom',
    khan: 'khan-academy',
    youtube: 'youtube',
    wikipedia: 'wikipedia',
    desmos: 'desmos',
    gmail: 'gmail'
  };

  function emergencyPresetDetails() {
    const key = EMERGENCY_IMAGE_FILES[settings.emergencyTemplate] ? settings.emergencyTemplate : 'classroom';
    return BUILT_IN_TAB_PRESETS[key] || BUILT_IN_TAB_PRESETS.classroom;
  }

  function emergencyScreenMarkup() {
    const key = EMERGENCY_IMAGE_FILES[settings.emergencyTemplate] ? settings.emergencyTemplate : 'classroom';
    const fileBase = EMERGENCY_IMAGE_FILES[key];
    const label = emergencyPresetDetails().title;
    if (key === 'classroom') {
      const teacherName = settings.classroomTeacherName || DEFAULTS.classroomTeacherName;
      const avatarImage = settings.classroomTeacherAvatarData || DEFAULTS.classroomTeacherAvatarData;
      const avatarColors = [
        settings.classroomTeacherColor0, settings.classroomTeacherColor1,
        settings.classroomTeacherColor2, settings.classroomTeacherColor3,
        settings.classroomTeacherColor4
      ];
      const courses = [
        { name: 'Science', color: '#0878b9' },
        { name: 'Social Studies', color: '#315fcb' },
        { name: 'Actively Learn', color: '#0b858b' },
        { name: 'Wonders Grade 4 Class', color: '#586f79' },
        { name: 'Math', color: '#354c56' }
      ];

      return `
        <div class="classroom-disguise">
          <header class="classroom-topbar">
            <span class="classroom-menu-mark">☰</span>
            <span class="classroom-app-mark">▣</span>
            <span class="classroom-brand">Classroom</span>
            <span class="classroom-top-spacer"></span><span class="classroom-top-action">＋</span><span class="classroom-app-grid">⠿</span><span class="classroom-account-dot">●</span>
          </header>
          <aside class="classroom-sidebar">
            <div class="classroom-nav-item is-active"><b>⌂</b> Home</div>
            <div class="classroom-nav-item"><b>▣</b> Calendar</div>
            <div class="classroom-nav-heading">Enrolled <span>⌃</span></div>
            <div class="classroom-nav-item"><b>☑</b> To-do</div>
            ${courses.map(course => `<div class="classroom-nav-item classroom-course-nav"><i style="background:${course.color}"></i>${escapeAttribute(course.name)}</div>`).join('')}
            <div class="classroom-nav-item classroom-archived"><b>▣</b> Archived classes</div>
            <div class="classroom-nav-item"><b>⚙</b> Settings</div>
          </aside>
          <main class="classroom-main">
            <div class="classroom-main-notice">You don’t have any assigned class learning tools</div>
            <div class="classroom-heading"><span>Classes</span><span class="classroom-add-class">＋ &nbsp;Add class</span></div>
            <div class="classroom-course-grid">
              ${courses.map((course, index) => `
                <article class="classroom-course-card">
                  <div class="classroom-course-banner" style="--course-color:${course.color}">
                    <div class="classroom-course-title">${escapeAttribute(course.name)}</div>
                    <div class="classroom-teacher-name">${escapeAttribute(teacherName)}</div>
                    <div class="classroom-teacher-initials" style="--teacher-avatar-color:${escapeAttribute(avatarColors[index] || '#4e7fc3')}" aria-hidden="true">
                      <img class="classroom-teacher-avatar-image" src="${escapeAttribute(avatarImage)}" alt="">
                      <span class="classroom-teacher-avatar-tint"></span>
                    </div>
                  </div>
                  <div class="classroom-course-work"></div>
                  <div class="classroom-course-actions"><span>▣</span><span>▱</span><span>⋮</span></div>
                </article>`).join('')}
            </div>
            <div class="classroom-help">ⓘ</div>
          </main>
        </div>
        <button class="emergency-overlay-hint" type="button" aria-label="Hide screen overlay">Press Escape to hide overlay</button>`;
    }
    return `
      <img class="emergency-cover-image" data-cover-base="${escapeAttribute(fileBase)}" src="img/overlays/${escapeAttribute(fileBase)}.png" alt="${escapeAttribute(label)}" draggable="false">
      <div class="emergency-cover-missing" hidden>
        <strong>Cover image not found</strong>
        <span>Add <code>img/overlays/${escapeAttribute(fileBase)}.png</code> (or a JPG, JPEG, WebP, or AVIF) to the site's <code>img/overlays/</code> folder.</span>
      </div>
      <button class="emergency-overlay-hint" type="button" aria-label="Hide screen overlay">Press Escape to hide overlay</button>`;
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
    const coverImage = overlay.querySelector('.emergency-cover-image');
    const missingCover = overlay.querySelector('.emergency-cover-missing');
    if (coverImage && missingCover) {
      const extensions = ['png', 'jpg', 'jpeg', 'webp', 'avif'];
      let extensionIndex = 0;
      coverImage.addEventListener('error', () => {
        extensionIndex += 1;
        if (extensionIndex < extensions.length) {
          coverImage.src = `img/overlays/${coverImage.dataset.coverBase}.${extensions[extensionIndex]}`;
          return;
        }
        coverImage.hidden = true;
        missingCover.hidden = false;
      });
    }
    const hideButton = overlay.querySelector('.emergency-overlay-hint');
    hideButton?.addEventListener('click', exitEmergencyDisguise);
    overlay.setAttribute('aria-hidden', 'false');
    overlay.classList.add('is-visible');
    document.body.classList.add('emergency-disguise-active');
    const details = emergencyPresetDetails();
    document.title = details.title;
    getFaviconLink().href = getPresetFaviconUrl(details);
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
    if (key.startsWith('classroomTeacher') && emergencyOverlayActive && settings.emergencyTemplate === 'classroom') {
      enterEmergencyDisguise(emergencyPreviewActive);
    }
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
      settingLogoClickGame: settings.logoClickGame,
      settingDisguiseTitle: settings.disguiseTitle, settingDisguiseFaviconUrl: settings.disguiseFaviconUrl,
      settingEmergencyTemplate: settings.emergencyTemplate, settingDisguiseOnLeave: settings.disguiseOnLeave,
      settingStayDisguisedOnReturn: settings.stayDisguisedOnReturn,
      settingClassroomTeacherName: settings.classroomTeacherName,
      settingClassroomAvatarColor0: settings.classroomTeacherColor0,
      settingClassroomAvatarColor1: settings.classroomTeacherColor1,
      settingClassroomAvatarColor2: settings.classroomTeacherColor2,
      settingClassroomAvatarColor3: settings.classroomTeacherColor3,
      settingClassroomAvatarColor4: settings.classroomTeacherColor4
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
      // A cross-origin iframe takes focus away from the parent window.
      // Defer the check until focus has settled, then ignore iframe focus:
      // clicking or typing inside Padlet/HummingWeb is not leaving the site.
      window.setTimeout(() => {
        if (!settings.disguiseOnLeave || emergencyOverlayActive) return;
        if (document.visibilityState === 'hidden') return; // visibilitychange handles actual tab switches
        if (document.activeElement instanceof HTMLIFrameElement) return;
        enterEmergencyDisguise(false);
      }, 0);
    });
    window.addEventListener('focus', () => {
      if (emergencyOverlayActive && !settings.stayDisguisedOnReturn && document.visibilityState === 'visible') exitEmergencyDisguise();
    });
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
