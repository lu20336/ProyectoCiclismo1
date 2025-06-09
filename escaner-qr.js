(function () {
  'use strict';

  function sanitize(val) {
    if (typeof val !== 'string') {
      return '';
    }
    return val.replace(/</g, '[' + 'lt' + ']').replace(/>/g, '[' + 'gt' + ']');
  }

  function setText(id, textValue) {
    var el = document.getElementById(id);
    if (el) {
      el.textContent = textValue;
    }
  }

  function formatTeamInfo(data) {
    if (typeof data !== 'object' || data === null) {
      return '';
    }

    var membersOutput = Array.isArray(data.members)
      ? data.members.map(function (m) {
          return '* ' + sanitize(m.name) + ' - ' + sanitize(m.email);
        }).join('\n')
      : '';

    var output = membersOutput + '\n';
    output += 'Name: ' + sanitize(data.teamName) + '\n';
    output += 'Manager: ' + sanitize(data.manager) + '\n';
    output += 'Email: ' + sanitize(data.email) + '\n';
    output += 'Phone: ' + sanitize(data.phone) + '\n';

    return output;
  }

  function processQR(raw) {
    var data;
    try {
      data = JSON.parse(raw);
    } catch (err) {
      setText('resultado', 'Invalid QR data.');
      return;
    }

    if (typeof data !== 'object' || data === null) {
      return;
    }

    setText('resultado', 'QR read successfully.');
    setText('infoEquipo', formatTeamInfo(data));
  }

  function dummyScanQR() {
    // Simulación de escaneo QR
    var simulatedQR = JSON.stringify({
      teamName: 'Simulated Team',
      manager: 'Sim Manager',
      email: 'manager@example.com',
      phone: '123456789',
      members: [
        { name: 'Member One', email: 'one@example.com' },
        { name: 'Member Two', email: 'two@example.com' }
      ]
    });

    processQR(simulatedQR);
  }

  function init() {
    var button = document.getElementById('startScan');
    if (button) {
      button.addEventListener('click', function () {
        dummyScanQR();
      });
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
