/* QR SCANNER LEGACY VERSION FOR CODACY LEGACY RULES */

navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
  .then(function(stream) {
    var video = document.getElementById("preview");
    video.srcObject = stream;
    video.setAttribute("playsinline", true);
    video.play();

    var canvasElement = document.createElement("canvas");
    var canvas = canvasElement.getContext("2d");
    var alreadyScanned = false;

    setInterval(function() {
      if (alreadyScanned) return;

      canvasElement.width = video.videoWidth;
      canvasElement.height = video.videoHeight;
      canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);

      var imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
      var code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert"
      });

      if (code && code.data) {
        processQR(code.data);
        alreadyScanned = true;
      }
    }, 1000);

    function processQR(raw) {
      var data;
      try {
        data = JSON.parse(raw);
      } catch (e) {
        showError("Invalid QR data.");
        console.log("QR parse error:", e);
        return;
      }

      var listHtml = "";
      if (Array.isArray(data.members)) {
        listHtml = "<ul>";
        for (var i = 0; i < data.members.length; i++) {
          var m = data.members[i];
          listHtml += "<li><strong>" + m.name + "</strong> - " + m.email + " - " + m.phone + "</li>";
        }
        listHtml += "</ul>";
      } else {
        listHtml = "<p>No members.</p>";
      }

      var html = ""
        + "<h3>Team Info</h3>"
        + "<p><strong>Name:</strong> " + data.teamName + "</p>"
        + "<p><strong>Manager:</strong> " + data.manager + "</p>"
        + "<p><strong>Email:</strong> " + data.email + "</p>"
        + "<p><strong>Phone:</strong> " + data.phone + "</p>"
        + "<p><strong>Members:</strong></p>"
        + listHtml
        + "<br><button type='button' onclick='location.reload()'>Scan another QR</button>";

      document.getElementById("resultado").innerText = "QR read successfully.";
      document.getElementById("infoEquipo").innerHTML = html;
    }

    function showError(msg) {
      document.getElementById("resultado").innerText = msg;
    }
  })
  .catch(function(err) {
    console.log("Camera access error:", err);
    document.getElementById("resultado").innerText = "Cannot access camera.";
  });
