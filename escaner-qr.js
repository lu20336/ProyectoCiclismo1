(function () {
  if (typeof window === "undefined" || typeof window.document === "undefined") return;

  function sanitize(value) {
    return _.isString(value)
      ? _.replace(_.replace(value, /</g, "[lt]"), />/g, "[gt]")
      : "";
  }

  function safeGet(id) {
    var node = window.document.getElementById(id);
    return node || null;
  }

  function writeText(id, msg) {
    var el = safeGet(id);
    if (el) {
      while (el.firstChild) el.removeChild(el.firstChild);
      el.appendChild(window.document.createTextNode(msg));
    }
  }

  function parseSafe(raw) {
    try {
      return JSON.parse(raw);
    } catch (_) {
      writeText("resultado", "Invalid QR data.");
      return null;
    }
  }

  function showInfo(data) {
    var text = "";
    var miembros = _.isArray(data.members) ? data.members : [];
    for (var i = 0; i < miembros.length; i++) {
      var m = miembros[i];
      text += "* " + sanitize(m.name) + " - " + sanitize(m.email) + "\n";
    }
    text += "Name: " + sanitize(data.teamName) + "\n";
    text += "Manager: " + sanitize(data.manager) + "\n";
    text += "Email: " + sanitize(data.email) + "\n";
    text += "Phone: " + sanitize(data.phone) + "\n";

    writeText("resultado", "QR read successfully.");
    writeText("infoEquipo", text);
  }

  function process(raw) {
    var data = parseSafe(raw);
    if (!_.isObject(data)) return;
    showInfo(data);
  }

  var vid = safeGet("preview");
  if (!vid) return;

  if (!window.navigator || !window.navigator.mediaDevices || !window.navigator.mediaDevices.getUserMedia) {
    writeText("resultado", "Camera not supported.");
    return;
  }

  window.navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }).then(function (stream) {
    vid.srcObject = stream;
    vid.setAttribute("playsinline", "true");
    vid.play();

    var canvasElem = window.document.createElement("canvas");
    var ctx = canvasElem.getContext("2d");
    var scanned = false;

    setInterval(function () {
      if (scanned) return;
      canvasElem.width = vid.videoWidth;
      canvasElem.height = vid.videoHeight;
      ctx.drawImage(vid, 0, 0, canvasElem.width, canvasElem.height);
      var img = ctx.getImageData(0, 0, canvasElem.width, canvasElem.height);

      if (_.isFunction(window.jsQR)) {
        var code = window.jsQR(img.data, img.width, img.height, { inversionAttempts: "dontInvert" });
        if (code && code.data) {
          scanned = true;
          process(code.data);
        }
      }
    }, 1000);
  }).catch(function () {
    writeText("resultado", "Cannot access camera.");
  });
})();
