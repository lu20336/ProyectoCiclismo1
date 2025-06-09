(function () {
  'use strict';

  function sanitize(val) {
    if (typeof val !== 'string') {
      return '';
    }
    return val.replace(/</g, '[lt]').replace(/>/g, '[gt]');
  }

  function setText(id, textValue) {
    var el = document.getElementById(id);
    if (el && typeof textValue === 'string') {
      el.textContent = textValue;
    }
  }

  function safeJSON(raw) {
    if (typeof raw !== 'string' || raw.length === 0) {
      return null;
    }
    if (raw.charAt(0) !== '{' || raw.charAt(raw.length - 1) !== '}') {
      return null;
    }
    var data;
    try {
      data = JSON.parse(raw);
    } catch (e) {
      return null;
    }
    if (!data || typeof data !== 'object') {
      return null;
    }
    return data;
  }

  function formatTeam(data) {
    var output = '';
    var membersData = data.members;
    if (membersData && membersData.length > 0) {
      var i = 0;
      while (i < membersData.length) {
        var m = membersData[i];
        if (m && typeof m.name === 'string' && typeof m.email === 'string') {
          output += '* ' + sanitize(m.name) + ' - ' + sanitize(m.email) + ' ';
        }
        i += 1;
      }
    }

    output += ' Name: ' + sanitize(data.teamName);
    output += ' Manager: ' + sanitize(data.manager);
    output += ' Email: ' + sanitize(data.email);
    output += ' Phone: ' + sanitize(data.phone);

    return output;
  }

  function processQR(raw) {
    var data = safeJSON(raw);

    if (data === null) {
      setText('resultado', 'Invalid QR data.');
      return;
    }

    setText('resultado', 'QR read successfully.');
    setText('infoEquipo', formatTeam(data));
  }

  window.processQR = processQR;
})();
