(function () {
  'use strict';

  var LT = '[' + 'lt' + ']';
  var GT = '[' + 'gt' + ']';

  function sanitize(val) {
    if (typeof val !== 'string') {
      return '';
    }
    return val.replace(/</g, LT).replace(/>/g, GT);
  }

  function setText(id, textValue) {
    var el = document.getElementById(id);
    if (el && typeof textValue === 'string') {
      el.textContent = textValue;
    }
  }

  function safeParse(raw) {
    if (typeof raw !== 'string') {
      return null;
    }

    try {
      return JSON.parse(raw);
    } catch (err) {
      return null;
    }
  }

  function isValidMember(member) {
    return typeof member === 'object' &&
      typeof member.name === 'string' &&
      typeof member.email === 'string';
  }

  function formatMembers(members) {
    if (!Array.isArray(members)) {
      return '';
    }

    var result = '';
    members.forEach(function (m) {
      if (isValidMember(m)) {
        result += '* ' + sanitize(m.name) + ' - ' + sanitize(m.email) + ' ';
      }
    });

    return result.trim();
  }

  function formatTeamInfo(data) {
    if (typeof data !== 'object' || data === null) {
      return '';
    }

    var parts = [
      formatMembers(data.members),
      'Name: ' + sanitize(data.teamName),
      'Manager: ' + sanitize(data.manager),
      'Email: ' + sanitize(data.email),
      'Phone: ' + sanitize(data.phone)
    ];

    return parts.filter(function (p) {
      return p !== '';
    }).join(' | ');
  }

  function processQR(raw) {
    var data = safeParse(raw);

    if (data === null || typeof data !== 'object') {
      setText('resultado', 'Invalid QR data.');
      return;
    }

    setText('resultado', 'QR read successfully.');
    setText('infoEquipo', formatTeamInfo(data));
  }

  window.processQR = processQR;
})();
