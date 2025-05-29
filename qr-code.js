function toJSONString(obj) {
  var str = "{";
  var keys = Object.keys(obj);
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    str += '"' + key + '":';
    if (typeof obj[key] === "object" && obj[key] !== null) {
      str += toJSONString(obj[key]);
    } else {
      str += '"' + String(obj[key]) + '"';
    }
    if (i < keys.length - 1) str += ",";
  }
  return str + "}";
}

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", function () {
    var btn = document.getElementById("generateQR");
    if (!btn) return;

    btn.addEventListener("click", function () {
      var inputTeam = document.getElementById("teamName");
      var inputManager = document.getElementById("managerName");
      var inputEmail = document.getElementById("email");
      var inputPhone = document.getElementById("phone");

      var team = inputTeam ? _.trim(inputTeam.value) : "";
      var manager = inputManager ? _.trim(inputManager.value) : "";
      var email = inputEmail ? _.trim(inputEmail.value) : "";
      var phone = inputPhone ? _.trim(inputPhone.value) : "";

      if (!team) {
        alert("Team name is required.");
        return;
      }

      var divs = document.querySelectorAll("#memberContainer > div");
      var members = _.map(divs, function (div) {
        var inputs = div.querySelectorAll("input");
        var name = inputs.length > 0 ? _.trim(inputs[0].value) : "";
        var mail = inputs.length > 1 ? _.trim(inputs[1].value) : "";
        var tel = inputs.length > 2 ? _.trim(inputs[2].value) : "";
        return { name: name, email: mail, phone: tel };
      });

      var result = {
        teamName: team,
        manager: manager,
        email: email,
        phone: phone,
        members: members
      };

      var encoded = toJSONString(result);
      var container = document.getElementById("qrCode");
      if (container && typeof QRCode !== "undefined") {
        container.innerHTML = "";
        new QRCode(container, { text: encoded, width: 150, height: 150 });
      }
    });
  });
}
