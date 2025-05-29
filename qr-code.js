(function () {
  if (typeof document === "undefined") return;
  if (typeof _ === "undefined") return;

  function getTrimmedValue(id) {
    var el = document.getElementById(id);
    return el ? _.trim(el.value) : "";
  }

  function extractMembers() {
    var divs = document.querySelectorAll("#memberContainer > div");
    return _.map(divs, function (div) {
      var inputs = div.getElementsByTagName("input");
      var name = inputs.length > 0 ? _.trim(inputs[0].value) : "";
      var email = inputs.length > 1 ? _.trim(inputs[1].value) : "";
      var phone = inputs.length > 2 ? _.trim(inputs[2].value) : "";
      return {
        name: name,
        email: email,
        phone: phone
      };
    });
  }

  function generateQRCode(data) {
    var container = document.getElementById("qrCode");
    if (container && typeof QRCode !== "undefined") {
      container.innerHTML = "";
      new QRCode(container, {
        text: JSON.stringify(data),
        width: 150,
        height: 150
      });
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    var button = document.getElementById("generateQR");
    if (!button) return;

    button.addEventListener("click", function () {
      var teamName = getTrimmedValue("teamName");
      var manager = getTrimmedValue("managerName");
      var email = getTrimmedValue("email");
      var phone = getTrimmedValue("phone");

      if (!teamName) {
        alert("Team name is required.");
        return;
      }

      var data = {
        teamName: teamName,
        manager: manager,
        email: email,
        phone: phone,
        members: extractMembers()
      };

      generateQRCode(data);
    });
  });
})();
