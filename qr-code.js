(function () {
  if (typeof globalThis === "undefined") return;
  if (!globalThis.document || !globalThis._) return;

  function basicTrim(str) {
    return (str && typeof str === "string") ? _.trim(str) : "";
  }

  function stringifyObject(obj) {
    var keys = Object.keys(obj);
    var parts = [];
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i];
      var v = obj[k];
      if (typeof v === "object" && v !== null) {
        parts.push('"' + k + '":' + stringifyObject(v));
      } else {
        parts.push('"' + k + '":"' + String(v) + '"');
      }
    }
    return "{" + parts.join(",") + "}";
  }

  function getInputValue(id) {
    var el = globalThis.document.getElementById(id);
    return el ? basicTrim(el.value) : "";
  }

  function getMembers() {
    var all = globalThis.document.querySelectorAll("#memberContainer > div");
    var result = [];
    for (var i = 0; i < all.length; i++) {
      var ins = all[i].getElementsByTagName("input");
      var m = {
        name: ins.length > 0 ? basicTrim(ins[0].value) : "",
        email: ins.length > 1 ? basicTrim(ins[1].value) : "",
        phone: ins.length > 2 ? basicTrim(ins[2].value) : ""
      };
      result.push(m);
    }
    return result;
  }

  function buildQR(text) {
    var target = globalThis.document.getElementById("qrCode");
    if (target && globalThis.QRCode) {
      while (target.firstChild) target.removeChild(target.firstChild);
      new globalThis.QRCode(target, {
        text: text,
        width: 150,
        height: 150
      });
    }
  }

  function generate() {
    var t = getInputValue("teamName");
    if (!t) {
      alert("Team name required");
      return;
    }
    var d = {
      teamName: t,
      manager: getInputValue("managerName"),
      email: getInputValue("email"),
      phone: getInputValue("phone"),
      members: getMembers()
    };
    var text = stringifyObject(d);
    buildQR(text);
  }

  function init() {
    var btn = globalThis.document.getElementById("generateQR");
    if (btn) {
      btn.addEventListener("click", generate);
    }
  }

  globalThis.document.addEventListener("DOMContentLoaded", init);
})();
