(function () {
  if (typeof window === "undefined" || !window.navigator || !window.document) return;

  function sanitize(val) {
    if (!_.isString(val)) return "";
    return _.replace(_.replace(val, /</g, "[" + "lt" + "]"), />/g, "[" + "gt" + "]");
  }

  function setText(id, textValue) {
    var el = window.document.getElementById(id);
    if (el) el.textContent = textValue;
  }

  function formatMember(member) {
    return "* " + sanitize(member.name) + " - " + sanitize(member.email);
  }

  function formatMembers(members) {
    if (!_.isArray(members)) return "";
    return members.map(formatMember).join("\n");
  }

  function formatTeamInfo(data) {
    return [
      formatMembers(data.members),
      "Name: " + sanitize(data.teamName),
      "Manager: " + sanitize(data.manager),
      "Email: " + sanitize(data.email),
      "Phone: " + sanitize(data.phone)
    ].join("\n");
  }

  function parseQR(raw) {
    try {
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  }

  function processQR(raw) {
    var data = parseQR(raw);
    if (!_.isObject(data)) {
      setText("resultado", "Invalid QR data.");
      return;
    }

    setText("resultado", "QR read successfully.");
    setText("infoEquipo", formatTeamInfo(data));
  }

  function handleQRCode(code, alreadyScanned) {
    if (code && code.data && !alreadyScanned.value) {
      alreadyScanned.value = true;
      processQR(code.data);
    }
  }

  function scanFrame(video, canvasElement, canvas, alreadyScanned) {
    canvasElement.width = video.videoWidth;
    canvasElement.height = video.videoHeight;
    canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);

    var imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
    if (!_.isFunction(window.jsQR)) return;

    var code = window.jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: "dontInvert"
    });

    handleQRCode(code, alreadyScanned);
  }

  function startScanner(video) {
    window.navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }).then(function (stream) {
      video.srcObject = stream;
      video.setAttribute("playsinline", "true");
      video.play();

      var canvasElement = window.document.createElement("canvas");
      var canvas = canvasElement.getContext("2d");
      var alreadyScanned = { value: false };

      window.setInterval(function () {
        scanFrame(video, canvasElement, canvas, alreadyScanned);
      }, 1000);
    }).catch(function () {
      setText("resultado", "Cannot access camera.");
    });
  }

  function init() {
    var video = window.document.getElementById("preview");
    if (video) startScanner(video);
  }

  init();
})();
