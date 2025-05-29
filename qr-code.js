if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", function () {
    var generateBtn = document.getElementById("generateQR");
    if (!generateBtn) return;

    generateBtn.addEventListener("click", function () {
      var teamName = _.trim(document.getElementById("teamName")?.value || "");
      var managerName = _.trim(document.getElementById("managerName")?.value || "");
      var email = _.trim(document.getElementById("email")?.value || "");
      var phone = _.trim(document.getElementById("phone")?.value || "");

      if (!teamName) {
        alert("⚠️ Team name is required.");
        return;
      }

      var members = Array.prototype.slice.call(document.querySelectorAll("#memberContainer > div")).map(function (div) {
        var inputs = div.querySelectorAll("input");
        return {
          name: _.trim(inputs[0]?.value || ""),
          email: _.trim(inputs[1]?.value || ""),
          phone: _.trim(inputs[2]?.value || "")
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
