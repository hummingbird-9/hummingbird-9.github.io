'use strict';

// Vending machines: buy BSoda / Zesty Bar with quarters.

const Vending = (() => {

  const machines = [];

  function init() {
    machines.length = 0;
    for (const v of MapData.VENDING) {
      machines.push({
        kind: v.kind,
        x: v.x, z: v.z, rot: v.rot,
      });
    }
  }

  function all() { return machines; }

  function tryBuy(m) {
    if (!Player.hasItem('quarter')) {
      AudioSys.SFX.doorLocked();
      AudioSys.Voice.baldi(I18n.t('voice.needQuarter'));
      UI.announce(I18n.t('ann.quarterNeed'));
      return;
    }
    Player.state.inv.splice(Player.state.inv.indexOf('quarter'), 1);
    const kind = m.kind === 'bsoda' ? 'bsoda' : 'zesty';
    if (Player.state.inv.length < 3) {
      Player.addItem(kind);
    } else {
      UI.announce(I18n.t('ann.pocketsFull'));
      // refund
      Player.addItem('quarter');
      return;
    }
    AudioSys.SFX.quarter();
    AudioSys.SFX.vendThud();
    if (kind === 'bsoda') {
      UI.announce(I18n.t('ann.gotBsoda'));
      AudioSys.Voice.baldi(I18n.t('voice.mmmBsoda'));
    } else {
      UI.announce(I18n.t('ann.gotZesty'));
    }
    UI.updateHud();
  }

  return { init, all, tryBuy };
})();
