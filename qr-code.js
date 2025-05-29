(function () {
  if (typeof globalThis === "undefined") return;
  if (!globalThis.document || !globalThis._) return;

  function safeTrim(str) {
    return typeof str === "string" ? _.trim(str) : "";
  }

  function serialize(obj) {
    var result = "{";
    var keys = Object.keys(obj);
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var val = obj[key];
      if (typeof val === "object" && val !== null) {
        result += '"' + key + '":' + serialize(val);
      } else {
        result += '"' + key + '":"' + String(val) + '"';
      }
      if (i < keys.length - 1) result += ",";
    }
    return result + "}";
  }

  function getValue(id) {
    var input = globalThis.document.getElementById(id);
    return input ? safeTrim(input.value) : "";
  }

  function collect() {
    var blocks = globalThis.document.querySelectorAll("#memberContainer > div");
    var out = [];
    for (var i = 0; i < blocks.length; i++) {
      var inputs = blocks[i].getElementsByTagName("input");
      var n = inputs.length > 0 ? safeTrim(inputs[0].value) : "";
      var e = inputs.length > 1 ? safeTrim(inputs[1].value) : "";
      var p = inputs.length > 2 ? safeTrim(inputs[2].value) : "";
      out.push({ name: n, email: e, phone: p });
    }
    return out;
  }

  function showQR(txt) {
    var target = globalThis.document.getElementById("qrCode");
    if (target && typeof globalThis.QRCode !== "undefined") {
      while (target.firstChild) {
        target.removeChild(target.firstChild);
      }
      new globalThis.QRCode(target, {
        text: txt,
        width: 150,
        height: 150
      });
    }
  }

  function ready() {
    var btn = globalThis.document.getElementById("generateQR");
    if (!btn) return;

    btn.addEventListener("click", function () {
      var t = getValue("teamName");
      if (!t) {
        alert("Team name is required.");
        return;
      }

      var m = getValue("managerName");
      var em = getValue("email");
      var ph = getValue("phone");

      v
