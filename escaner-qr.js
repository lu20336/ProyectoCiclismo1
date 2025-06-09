(function () {
  if (typeof window === "undefined" || !window.navigator || !window.document) return;

  function sanitize(val) {
    return _.isString(val)
      ? _.replace(_.replace(val, /</g, "[" + "lt" + "]"), />/g, "[" + "gt" + "]")
      : "";
  }

  function updateText(id, textValue) {
    var el = window.document && window.document.getElementById ? window.document.getElementById(id) : null;
    if (el) {
      el.textContent = textValue;
    }
  }

  function formatMembers(members) {
    if (!_.isArray(members)) return "";
    return members
      .map(function (member) {
        return "* " + sanitize(member.name) + " - " + sanitize(member.email);
      })
      .join("\n");
  }

  function formatTeamInfo(data) {
    var output = formatMembers(data.members) + "\n";
    output += "Name: " + sanitize(data.teamName) + "\n";
    output += "Manager: " + sanitize(data.manager) + "\n";
    output += "Email: " + sanitize(data.email) + "\n";
    output += "Phone: " + sanitize(data.phone) + "\n";
    return output;
  }

  function processQR(raw) {
    var data;
    try {
      data = JSON.parse(raw);
    } catch (e) {
      updateText("resultado", "Invalid QR data.");
      return;
    }

    if (!_.isObject(data)) return;

    updateText("resultado", "QR read successfully.");
    updateText("infoEquipo", formatTeamInfo(data));
  }

  function startScanner(video) {
    window.navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }).then(function (stream) {
      video.srcObject = stream;
      video.setAttribute("playsinline", "true");
      video.play();

      var canvasElement = window.document.createElement("canvas");
      var canvas = canvasElement.getContext("2d");
      var alreadyScanned = false;

      function scanFrame() {
        if (alreadyScanned) return;

        canvasElement.width = video.videoWidth;
        canvasElement.height = video.videoHeight;
        canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);

        var imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
        if (!_.isFunction(window.jsQR)) return;

        var code = window.jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert"
        });

        if (code && code.data) {
          alreadyScanned = true;
          processQR(code.data);
        }
      }

      setInterval(scanFrame, 1000);
    }).catch(function () {
      updateText("resultado", "Cannot access camera.");
    });
  }

  var video = window.document && window.document.getElementById ? window.document.getElementById("preview") : null;
  if (video) startScanner(video);
})();
