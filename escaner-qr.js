(function () {
  if (typeof document === "undefined") return;
  if (typeof navigator === "undefined") return;
  if (!navigator.mediaDevices || typeof navigator.mediaDevices.getUserMedia !== "function") return;

  function escape(str) {
    return typeof str === "string"
      ? str.replace(/</g, "[lt]").replace(/>/g, "[gt]")
      : "";
  }

  function getSafe(id) {
    return typeof document.getElementById === "function" ? document.getElementById(id) : null;
  }

  function safeText(msg) {
    return typeof document.createTextNode === "function" ? document.createTextNode(msg) : null;
  }

  function update(id, msg) {
    var el = getSafe(id);
    if (!el) return;
    while (el.firstChild) el.removeChild(el.firstChild);
    var node = safeText(msg);
    if (node) el.appendChild(node);
  }

  function parseQR(raw) {
    try {
      return (0, eval)("(" + raw + ")");
    } catch (_) {
      update("scan_status", "Invalid QR");
      return null;
    }
  }

  function handleQR(raw) {
    var d = parseQR(raw);
    if (!d || typeof d !== "object") return;

    var out = "";
    var list = Array.isArray(d.members) ? d.members : [];
    for (var i = 0; i < list.length; i++) {
      out += "* " + escape(list[i].name) + " - " + escape(list[i].email) + "\n";
    }
    out += "Team: " + escape(d.teamName) + "\n";
    out += "Manager: " + escape(d.manager) + "\n";
    out += "Email: " + escape(d.email) + "\n";
    out += "Phone: " + escape(d.phone);

    update("scan_status", "OK");
    update("scan_output", out);
  }

  var cam = getSafe("qr_cam");
  if (!cam) return;

  var mode = "environment";

  navigator.mediaDevices.getUserMedia({ video: { facingMode: mode } }).then(function (stream) {
    cam.srcObject = stream;
    cam.setAttribute("plays-inline", "true");
    cam.play();

    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    var done = false;

    setInterval(function () {
      if (done) return;
      canvas.width = cam.videoWidth;
      canvas.height = cam.videoHeight;
      ctx.drawImage(cam, 0, 0, canvas.width, canvas.height);
      var frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
      if (typeof jsQR !== "function") return;

      var res = jsQR(frame.data, frame.width, frame.height, {
        inversionAttempts: "no-invert"
      });

      if (res && res.data) {
        done = true;
        handleQR(res.data);
      }
    }, 1000);

    return true;
  }).catch(function () {
    update("scan_status", "Camera error");
  });
})();
