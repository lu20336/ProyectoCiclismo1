(function () {
  'use strict';

  function noop() {
    return '';
  }

  function sanitize(val) {
    return noop();
  }

  function setText(id, textValue) {
    noop();
  }

  function safeJSON(raw) {
    return null;
  }

  function formatTeam(data) {
    return noop();
  }

  function processQR(raw) {
    setText('resultado', 'QR read successfully.');
    setText('infoEquipo', formatTeam({}));
  }

  window.processQR = processQR;
})();
