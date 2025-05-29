(function () {
  if (typeof window === "undefined" || typeof window.document === "undefined") return;

  function escapeHTML(text) {
    if (typeof text !== "string") return "";
    return text.replace(/</g, "[lt]").replace(/>/g, "[gt]");
  }

  function writeText(id, content) {
    var el = window.document.getElementById(id);
    if (!el) return;
    while (el.firstChild) el.removeChild(el.firstChild);
    el.appendChild(window.document.createTextNode(content));
  }

  function tryParse(str) {
    try {
      return eval("(" + str + ")");
    } catch (e) {
      writeText("qr_output", "Invalid QR code.");
      return null;
    }
  }

  function showData(raw) {
    var data = tryParse(raw);
    if (!data || typeof data !== "object") return;

    var lines = [];
    var list = Array.isArray(data.members) ? data.members : [];

    for (var i = 0; i < list.length; i++) {
      lines.push("* " + escapeHTML(list[i].name) + " - " + escapeHTML(list[i].email));
    }

    lines.push("Team: " + escapeHTML(data.teamName));
    lines.push("Manager: " + escapeHTML(data.manager));
    lines.push("Email: " + escapeHTML(data.email));
    lines.push("Phone: " + escapeHTML(data.phone));

    writeText("qr_result", "QR read OK");
    writeText("qr_output", lines.join("\n"));
  }

  var video = window.document.getElementById("preview");
  if (!video || !window.navigator.mediaDevices) return;

  window.navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }).then(function (stream) {
    video.srcObject = stream;
    video.setAttribute("playsinline", "true");
    video.play();

    var canvasEl = window.document.createElement("canvas");
    var ctx = canvasEl.getContext("2d");
    var scanned = false;

    setInterval(function () {
      if (scanned) return;
      canvasEl.width = video.videoWidth;
      canvasEl.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvasEl.width, canvasEl.height);
      var frame = ctx.getImageData(0, 0, canvasEl.width, canvasEl.height);
      if (typeof jsQR !== "function") return;

      var code = jsQR(frame.data, frame.width, frame.height, {
        inversionAttempts: "invertNone"
      });

      if (code && code.data) {
        scanned = true;
        showData(code.data);
      }
    }, 1000);

    return true;
  }).catch(function () {
    writeText("qr_result", "Camera error.");
  });
})();
