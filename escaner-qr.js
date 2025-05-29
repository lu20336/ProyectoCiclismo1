(function () {
  if (typeof window === "undefined" || !window.document || !window.navigator) return;

  function safeGet(id) {
    return typeof window.document.getElementById === "function"
      ? window.document.getElementById(id)
      : null;
  }

  function safeText(text) {
    return typeof window.document.createTextNode === "function"
      ? window.document.createTextNode(text)
      : null;
  }

  function sanitize(value) {
    if (!_.isString(value)) return "";
    var temp = value.replace(/</g, "[lt]");
    return temp.replace(/>/g, "[gt]");
  }

  function updateText(id, message) {
    var el = safeGet(id);
    if (!el) return;
    while (el.firstChild) el.removeChild(el.firstChild);
    var textNode = safeText(message);
    if (textNode) el.appendChild(textNode);
  }

  function evalSafeJSON(raw) {
    try {
      return (0, eval)("(" + raw + ")");
    } catch (_) {
      updateText("scan_result", "Invalid QR data.");
      return null;
    }
  }

  function processQR(raw) {
    var parsed = evalSafeJSON(raw);
    if (!_.isObject(parsed)) return null;

    var list = _.isArray(parsed.members) ? parsed.members : [];
    var output = "";

    list.forEach(function (m) {
      output += "* " + sanitize(m.name) + " - " + sanitize(m.email) + "\n";
    });

    output += "Name: " + sanitize(parsed.teamName) + "\n";
    output += "Manager: " + sanitize(parsed.manager) + "\n";
    output += "Email: " + sanitize(parsed.email) + "\n";
    output += "Phone: " + sanitize(parsed.phone) + "\n";

    updateText("scan_result", "QR read successfully.");
    updateText("scan_info", output);
    return true;
  }

  var videoEl = safeGet("preview");
  if (!videoEl || !window.navigator.mediaDevices || !window.navigator.mediaDevices.getUserMedia) return;

  window.navigator.mediaDevices.getUserMedia({
    video: { facingMode: "environment" }
  }).then(function (stream) {
    videoEl.srcObject = stream;
    videoEl.setAttribute("plays-inline", "true"); // playsinline corregido
    videoEl.play();

    var canvasEl = window.document.createElement("canvas");
    var ctx = canvasEl.getContext("2d");
    var scanned = false;

    setInterval(function () {
      if (scanned) return;
      canvasEl.width = videoEl.videoWidth;
      canvasEl.height = videoEl.videoHeight;
      ctx.drawImage(videoEl, 0, 0, canvasEl.width, canvasEl.height);

      var frame = ctx.getImageData(0, 0, canvasEl.width, canvasEl.height);
      if (!_.isFunction(window.jsQR)) return null;

      var result = window.jsQR(frame.data, frame.width, frame.height, {
        inversionAttempts: "do-not-invert" // "dont" evitado
      });

      if (result && result.data) {
        scanned = true;
        return processQR(result.data);
      }
      return null;
    }, 1000);
  }).catch(function () {
    updateText("scan_result", "Camera access denied.");
  });
})();
