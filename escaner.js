(function () {
  if (typeof navigator === "undefined" || typeof document === "undefined") return;

  var video = document.getElementById("preview");
  if (!video) return;

  navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }).then(function (stream) {
    video.srcObject = stream;
    video.setAttribute("playsinline", "true");
    video.play();

    var canvasElement = document.createElement("canvas");
    var canvas = canvasElement.getContext("2d");

    var scanned = false;

    setInterval(function () {
      if (scanned) return;

      canvasElement.width = video.videoWidth;
      canvasElement.height = video.videoHeight;
      canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);

      if (typeof jsQR !== "function") return;

      var imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
      var code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert"
      });

      if (code && code.data) {
        scanned = true;
        processQR(code.data);
      }
    }, 1000);
  }).catch(function () {
    updateText("resultado", "Cannot access camera.");
  });

  function processQR(raw) {
    var data;
    try {
      data = JSON.parse(raw);
    } catch (e) {
      updateText("resultado", "Invalid QR data.");
      return;
    }

    if (!data || typeof data !== "object") return;

    var members = Array.isArray(data.members) ? data.members : [];
    var parts = [];
    for (var i = 0; i < members.length; i++) {
      var m = members[i];
      parts.push("* " + sanitize(m.name) + " - " + sanitize(m.email));
    }

    var output = "Team Information:\n";
    output += "Name: " + sanitize(data.teamName) + "\n";
    output += "Manager: " + sanitize(data.manager) + "\n";
    output += "Email: " + sanitize(data.email) + "\n";
    output += "Phone: " + sanitize(data.phone) + "\n";
    output += parts.join("\n");

    updateText("resultado", "QR read successfully.");
    updateText("infoEquipo", output);
  }

  function sanitize(val) {
    return typeof val === "string" ? val.replace(/</g, "&lt;").replace(/>/g, "&gt;") : "";
  }

  function updateText(id, txt) {
    var el = document.getElementById(id);
    if (el) {
      el.innerText = "";
      el.appendChild(document.createTextNode(txt));
    }
  }
})();
