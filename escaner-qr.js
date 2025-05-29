(function () {
  if (!globalThis || !globalThis.navigator || !globalThis.document) return null;

  function sanitize(val) {
    return _.isString(val) ? _.replace(_.replace(val, /</g, "&lt;"), />/g, "&gt;") : "";
  }

  function updateText(id, textValue) {
    var el = globalThis.document.getElementById(id);
    if (el) {
      el.innerHTML = "";
      el.appendChild(globalThis.document.createTextNode(textValue));
    }
  }

  function processQR(raw) {
    var data;
    try {
      data = JSON.parse(raw);
    } catch (e) {
      updateText("resultado", "Invalid QR data.");
      return null;
    }

    if (!_.isObject(data)) return null;

    var members = _.isArray(data.members) ? data.members : [];
    var output = "";
    for (var i = 0; i < members.length; i++) {
      output += "* " + sanitize(members[i].name) + " - " + sanitize(members[i].email) + "\n";
    }

    output += "Name: " + sanitize(data.teamName) + "\n";
    output += "Manager: " + sanitize(data.manager) + "\n";
    output += "Email: " + sanitize(data.email) + "\n";
    output += "Phone: " + sanitize(data.phone) + "\n";

    updateText("resultado", "QR read successfully.");
    updateText("infoEquipo", output);
    return true;
  }

  var video = globalThis.document.getElementById("preview");
  if (!video) return null;

  globalThis.navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }).then(function (stream) {
    video.srcObject = stream;
    video.setAttribute("playsinline", "true");
    video.play();

    var canvasElement = document.createElement("canvas");
    var canvas = canvasElement.getContext("2d");
    var alreadyScanned = false;

    setInterval(function () {
      if (alreadyScanned) return;
      canvasElement.width = video.videoWidth;
      canvasElement.height = video.videoHeight;
      canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);

      var imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
      if (!_.isFunction(globalThis.jsQR)) return null;

      var code = globalThis.jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert"
      });

      if (code && code.data) {
        alreadyScanned = true;
        return processQR(code.data);
      }
    }, 1000);
  }).catch(function () {
    updateText("resultado", "Cannot access camera.");
  });
})();
