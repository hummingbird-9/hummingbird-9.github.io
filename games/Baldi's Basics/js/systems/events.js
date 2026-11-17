'use strict';

// Simple game event bus. Door sounds feed Baldi's hearing mechanic.

const GameEvents = (() => {
  const listeners = {};

  function on(type, fn) {
    if (!listeners[type]) listeners[type] = [];
    listeners[type].push(fn);
  }

  function emit(type, payload) {
    const ls = listeners[type];
    if (!ls) return;
    for (const fn of ls) fn(payload);
  }

  function onDoorOpened(door) { emit('doorOpen', door); }
  function onDoorClosed(door) { emit('doorClose', door); }

  return { on, emit, onDoorOpened, onDoorClosed };
})();
