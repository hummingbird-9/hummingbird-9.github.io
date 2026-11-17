(function (global) {
  "use strict";

  var active = null;

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function mapProgress(progress) {
    var real = clamp(progress, 0, 1);

    if (real >= 1) {
      return 1;
    }

    if (real <= 0.7) {
      var early = real / 0.7;
      return 0.72 * (1 - Math.pow(1 - early, 2.2));
    }

    var late = (real - 0.7) / 0.3;
    return 0.72 + 0.23 * (1 - Math.pow(1 - late, 1.4));
  }

  function createMarkup(config) {
    var root = document.createElement("div");
    var backgroundUrl = new URL(config.background, document.baseURI).href;
    root.id = "game-cover-loader";
    root.className = "cover-loader";
    root.setAttribute("role", "status");
    root.setAttribute("aria-live", "polite");
    root.setAttribute("aria-label", "Loading " + config.gameName);
    root.style.setProperty("--cover-background-image", "url(\"" + backgroundUrl.replace(/\"/g, "\\\"") + "\")");
    root.innerHTML = [
      '<div class="cover-loader__panel">',
      '  <img class="cover-loader__logo" src="' + config.logo + '" alt="' + config.gameName + '">',
      '  <div class="cover-loader__spinner" aria-hidden="true"></div>',
      '  <div class="cover-loader__stage" aria-hidden="true">',
      '    <img class="cover-loader__character" src="' + config.character + '" alt="">',
      '    <div class="cover-loader__progress"><div class="cover-loader__progress-fill"></div></div>',
      '    <div class="cover-loader__flare"><i></i><i></i><i></i></div>',
      '  </div>',
      '  <div class="cover-loader__status">LOADING ASSETS 0%</div>',
      '  <div class="cover-loader__hint">PREPARING THE BATTLEFIELD</div>',
      '</div>'
    ].join("");
    return root;
  }

  function getUnityInstance() {
    if (global.unityInstance) {
      return global.unityInstance;
    }

    if (global.GameInit && typeof global.GameInit.getUnityInstance === "function") {
      try {
        return global.GameInit.getUnityInstance();
      } catch (error) {
        return null;
      }
    }

    return null;
  }

  function readOriginalProgress() {
    var bar = document.querySelector(".gameloader-progressbar-progress");
    var info = document.querySelector(".gameloader-progress-info");
    var match;

    if (bar) {
      var inlineWidth = parseFloat(bar.style.width);
      if (isFinite(inlineWidth)) {
        return clamp(inlineWidth / 100, 0, 1);
      }

      if (bar.parentElement && bar.parentElement.offsetWidth > 0) {
        return clamp(bar.offsetWidth / bar.parentElement.offsetWidth, 0, 1);
      }
    }

    if (info) {
      match = info.textContent.match(/(\d{1,3})\s*%/);
      if (match) {
        return clamp(parseInt(match[1], 10) / 100, 0, 1);
      }
    }

    return null;
  }

  function labels(value) {
    var percent = Math.round(value * 100);

    if (value >= 1) {
      return ["BATTLE READY 100%", "ENTERING THE BATTLE"];
    }

    if (value >= 0.9) {
      return ["FINAL PUSH " + percent + "%", "ALMOST THERE"];
    }

    if (value >= 0.6) {
      return ["BUILDING THE ARENA " + percent + "%", "THE BATTLE IS HEATING UP"];
    }

    return ["LOADING ASSETS " + percent + "%", "PREPARING THE BATTLEFIELD"];
  }

  function mount(options) {
    var config = Object.assign({
      background: "cover-loader/background.webp",
      logo: "cover-loader/logo.webp",
      character: "cover-loader/character.webp",
      gameName: "Game",
      finishDelay: 760
    }, options || {});

    if (active) {
      active.destroy();
    }

    var root = createMarkup(config);
    var fill = root.querySelector(".cover-loader__progress-fill");
    var status = root.querySelector(".cover-loader__status");
    var hint = root.querySelector(".cover-loader__hint");
    var displayedProgress = 0;
    var realProgress = 0;
    var finished = false;
    var observer;
    var pollTimer;

    document.body.appendChild(root);

    function setProgress(progress, useMapping) {
      if (finished) {
        return;
      }

      var real = clamp(Number(progress) || 0, 0, 1);
      var mapped = useMapping === false ? real : mapProgress(real);
      var value = real >= 1 ? 1 : Math.max(displayedProgress, Math.min(0.95, mapped));
      var copy = labels(value);
      var edgePercent = value * 100;
      var edgeInset = 5 - value * 10;
      var edgeOffset = edgeInset >= 0
        ? "+ " + edgeInset.toFixed(3) + "px"
        : "- " + Math.abs(edgeInset).toFixed(3) + "px";

      realProgress = Math.max(realProgress, real);
      displayedProgress = value;
      root.style.setProperty(
        "--cover-progress",
        "calc(" + edgePercent.toFixed(3) + "% " + edgeOffset + ")"
      );
      fill.style.transform = "scaleX(" + value + ")";
      status.textContent = copy[0];
      hint.textContent = copy[1];

      if (value >= 0.6) {
        root.classList.add("cover-loader--clash");
      }

      if (value >= 0.9) {
        root.classList.add("cover-loader--final-push");
      }
    }

    function finish() {
      if (finished) {
        return;
      }

      setProgress(1, false);
      finished = true;
      if (observer) {
        observer.disconnect();
      }
      if (pollTimer) {
        global.clearInterval(pollTimer);
      }
      root.classList.add("cover-loader--finishing");

      global.setTimeout(function () {
        root.classList.add("cover-loader--complete");
      }, config.finishDelay);

      global.setTimeout(function () {
        root.hidden = true;
      }, config.finishDelay + 380);
    }

    function fail(message) {
      finished = true;
      root.classList.add("cover-loader--error");
      status.textContent = message || "LOAD FAILED";
      hint.textContent = "PLEASE REFRESH AND TRY AGAIN";
    }

    function sync() {
      var originalProgress = readOriginalProgress();
      if (originalProgress !== null) {
        setProgress(originalProgress, true);
      }

      var instance = getUnityInstance();
      if (instance) {
        finish();
      }
    }

    function destroy() {
      if (observer) {
        observer.disconnect();
      }
      if (pollTimer) {
        global.clearInterval(pollTimer);
      }
      if (root.parentNode) {
        root.parentNode.removeChild(root);
      }
      if (active && active.root === root) {
        active = null;
      }
    }

    observer = new MutationObserver(function (records) {
      var hasExternalChange = records.some(function (record) {
        return !root.contains(record.target);
      });

      if (hasExternalChange) {
        sync();
      }
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class", "style"]
    });
    pollTimer = global.setInterval(sync, 150);
    sync();

    active = {
      root: root,
      setProgress: setProgress,
      finish: finish,
      fail: fail,
      destroy: destroy
    };
    return active;
  }

  global.CoverLoader = {
    mount: mount,
    getActive: function () {
      return active;
    }
  };
})(window);
