if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", function () {
    var generateBtn = document.getElementById("generateQR");
    if (!generateBtn) return;

    generateBtn.addEventListener("click", function () {
      var teamInput = document.getElementById("teamName");
      var managerInput = document.getElementById("managerName");
      var emailInput = document.getElementById("email");
      var phoneInput = document.getElementById("phone");

      var teamName = teamInput ? _.trim(teamInput.value) : "";
      var managerName = managerInput ? _.trim(managerInput.value) : "";
      var email = emailInput ? _.trim(emailInput.value) : "";
      var phone = phoneInput ? _.trim(phoneInput.value) : "";

      if (!teamName) {
        alert("⚠️ Team name is required.");
        return;
      }

      var containers = document.querySelectorAll("#memberContainer > div");
      var members = _.map(containers, function (div) {
        var inputs = div.querySelectorAll("input");
        var name = inputs.length > 0 ? _.trim(inputs[0].value) : "";
        var mail = inputs.length > 1 ? _.trim(inputs[1].value) : "";
        var tel = inputs.length > 2 ? _.trim(inputs[2].value) : "";
        return {
          name: name,
          email: mail,
          phone: tel
        };
      });

      var qrData = {
        teamName: teamName,
        manager: managerName,
        email: email,
        phone: phone,
        members: members
      };

      var qrText = JSON.stringify(qrData);

      var qrContainer = document.getElementById("qrCode");
      if (qrContainer) {
        qrContainer.innerHTML = "";
        new QRCode(qrContainer, {
          text: qrText,
          width: 150,
          height: 150
        });
      }
    });
  });
}
