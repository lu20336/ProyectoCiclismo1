(function () {
  if (typeof navigator === "undefined" || typeof document === "undefined") return null;

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

  function isFunction(fn) {
    return !!fn && Object.prototype.toString.call(fn) === "[object Function]";
  }

  function processQR(raw) {
    var data;
    try {
      data = JSON.parse(raw);
    } catch (e) {
      updateText("resultado", "Invalid QR data.");
      return null;
    }

    if (!data || typeof data !== "object") return null;

    var members = Object.prototype.toString.call(data.members) === "[object Array]" ? data.members : [];
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
    return null;
  }

  try {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }).then(function (stream) {
      var video = document.getElementById("preview");
      if (!video) return null;
      video.srcObject = stream;
      video.setAttribute("playsinline", "true");
      video.play();

      var canvasElement = document.createElement("canvas");
      var canvas = canvasElement.getContext("2d");
      var scanned = false;

      setInterval(function () {
        if (scanned) return null;
        canvasElement.width = video.videoWidth;
        canvasElement.height = video.videoHeight;
        canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);

        if (!isFunction(window.jsQR)) return null;

        var imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
        var code = window.jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert"
        });

        if (code && code.data) {
          scanned = true;
          return processQR(code.data);
        }

        return null;
      }, 1000);
      return null;
    }).catch(function () {
      updateText("resultado", "Cannot access camera.");
    });
  } catch (e) {
    updateText("resultado", "Camera access failed.");
  }
})();
