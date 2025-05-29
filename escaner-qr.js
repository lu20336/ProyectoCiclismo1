(function () {
  if (typeof window === "undefined" || typeof window.document === "undefined" || typeof window.navigator === "undefined") return;

  function sanitize(str) {
    return _.isString(str)
      ? _.replace(_.replace(str, /</g, "[lt]"), />/g, "[gt]")
      : "";
  }

  function safeGetElement(id) {
    return typeof window.document.getElementById === "function"
      ? window.document.getElementById(id)
      : null;
  }

  function safeTextContent(text) {
    return typeof window.document.createTextNode === "function"
      ? window.document.createTextNode(text)
      : null;
  }

  function updateText(id, content) {
    var el = safeGetElement(id);
    if (el) {
      while (el.firstChild) el.removeChild(el.firstChild);
      var textNode = safeTextContent(content);
      if (textNode) el.appendChild(textNode);
    }
  }

  function parseSafeJSON(raw) {
    try {
      return eval("(" + raw + ")");
    } catch (_) {
      updateText("scan_result", "Invalid QR data.");
      return null;
    }
  }

  function processQR(raw) {
    var data = parseSafeJSON(raw);
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

    updateText("scan_result", "QR read successfully.");
    updateText("scan_info", output);
    return true;
  }

  var video = safeGetElement("preview");
  if (!video) return;

  if (!window.navigator.mediaDevices || !window.navigator.mediaDevices.getUserMedia) {
    updateText("scan_result", "Camera not supported.");
    return;
  }

  var facingOption = "environment"; // evitar propiedad reservada inline

  window.navigator.mediaDevices.getUserMedia({
    video: { facingMode: facingOption }
  }).then(function (stream) {
    video.srcObject = stream;
    video.setAttribute("plays-inline", "true");
    video.play();

    var canvas = window.document.createElement("canvas");
    var context = canvas.getContext("2d");
    var scanned = false;

    setInterval(function () {
      if (scanned) return;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      var image = context.getImageData(0, 0, canvas.width, canvas.height);
      if (!_.isFunction(window.jsQR)) return;

      var code = window.jsQR(image.data, image.width, image.height, {
        inversionAttempts: "no-invert"
      });

      if (code && code.data) {
        scanned = true;
        processQR(code.data);
      }
      return;
    }, 1000);

    return true; // cumplimiento de .then()
  }).catch(function () {
    updateText("scan_result", "Cannot access camera.");
  });
})();
