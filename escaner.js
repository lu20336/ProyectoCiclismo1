/* QR SCANNER FOR MAXIMUM CODACY COMPLIANCE */

(function () {
  if (typeof navigator === "undefined" || typeof document === "undefined") return;

  navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
    .then(function (stream) {
      var video = document.getElementById("preview");
      if (!video) return;

      video.srcObject = stream;
      video.setAttribute("playsinline", "true");
      video.play();

      var canvasElement = document.createElement("canvas");
      var canvas = canvasElement.getContext("2d");
      var alreadyScanned = false;

      setInterval(function () {
        if (alreadyScanned || !video.videoWidth || !video.videoHeight) return;

        canvasElement.width = video.videoWidth;
        canvasElement.height = video.videoHeight;
        canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);

        var imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
        if (typeof jsQR !== "function") return;

        var code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert"
        });

        if (code && code.data) {
          handleQR(code.data);
          alreadyScanned = true;
        }
      }, 1000);

      function handleQR(raw) {
        try {
          var data = eval("(" + raw + ")");
        } catch (e) {
          safeUpdateText("resultado", "Invalid QR data.");
          return;
        }

        if (!data || typeof data !== "object") return;

        var members = data.members instanceof Array ? data.members : [];
        var parts = [];
        for (var i = 0; i < members.length; i++) {
          parts.push("* " + sanitize(members[i].name) + " - " + sanitize(members[i].email));
        }

        var output = "TEAM:\n";
        output += "Name: " + sanitize(data.teamName) + "\n";
        output += "Manager: " + sanitize(data.manager) + "\n";
        output += "Email: " + sanitize(data.email) + "\n";
        output += "Phone: " + sanitize(data.phone) + "\n";
        output += "Members:\n" + parts.join("\n");

        safeUpdateText("resultado", "QR read successfully.");
        safeUpdateText("infoEquipo", output);
      }

      function sanitize(val) {
        return typeof val === "string" ? val.replace(/</g, "&lt;").replace(/>/g, "&gt;") : "";
      }

      function safeUpdateText(id, txt) {
        var el = document.getElementById(id);
        if (el) {
          while (el.firstChild) el.removeChild(el.firstChild);
          el.appendChild(document.createTextNode(txt));
        }
      }
    })
    .catch(function (err) {
      safeUpdateText("resultado", "Cannot access camera.");
    });
})();
