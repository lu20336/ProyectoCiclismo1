(function () {
  if (typeof globalThis === "undefined" || typeof globalThis.document === "undefined") return;
  if (typeof globalThis._ === "undefined") return;

  function safeTrim(value) {
    return typeof value === "string" ? _.trim(value) : "";
  }

  function serializeObject(obj) {
    var result = "{";
    var keys = Object.keys(obj);
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i];
      var v = obj[k];
      if (typeof v === "object" && v !== null) {
        result += '"' + k + '":' + serializeObject(v);
      } else {
        result += '"' + k + '":"' + String(v) + '"';
      }
      if (i < keys.length - 1) result += ",";
    }
    return result + "}";
  }

  function getTextFromInput(inputId) {
    var element = globalThis.document.getElementById(inputId);
    return element ? safeTrim(element.value) : "";
  }

  function collectMembers() {
    var memberElements = globalThis.document.querySelectorAll("#memberContainer > div");
    return _.map(memberElements, function (block) {
      var fields = block.getElementsByTagName("input");
      var n = fields.length > 0 ? safeTrim(fields[0].value) : "";
      var e = fields.length > 1 ? safeTrim(fields[1].value) : "";
      var p = fields.length > 2 ? safeTrim(fields[2].value) : "";
      return { name: n, email: e, phone: p };
    });
  }

  function drawQR(content) {
    var qrBox = globalThis.document.getElementById("qrCode");
    if (qrBox && typeof globalThis.QRCode !== "undefined") {
      qrBox.innerHTML = "";
      new globalThis.QRCode(qrBox, {
        text: content,
        width: 150,
        height: 150
      });
    }
  }

  globalThis.document.addEventListener("DOMContentLoaded", function () {
    var trigger = globalThis.document.getElementById("generateQR");
    if (!trigger) return;

    trigger.addEventListener("click", function () {
      var team = getTextFromInput("teamName");
      if (!team) {
        alert("Team name is required.");
        return;
      }

      var manager = getTextFromInput("managerName");
      var email = getTextFromInput("email");
      var phone = getTextFromInput("phone");
      var members = collectMembers();

      var payload = {
        teamName: team,
        manager: manager,
        email: email,
        phone: phone,
        members: members
      };

      var serialized = serializeObject(payload);
      drawQR(serialized);
    });
  });
})();
