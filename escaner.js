navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
  .then(function(stream) {
    const video = document.getElementById("preview");
    video.srcObject = stream;
    video.setAttribute("playsinline", true);
    video.play();

    const canvasElement = document.createElement("canvas");
    const canvas = canvasElement.getContext("2d");

    let yaEscaneado = false;

    setInterval(function() {
      if (yaEscaneado) return;

      canvasElement.width = video.videoWidth;
      canvasElement.height = video.videoHeight;
      canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);

      const imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert"
      });

      if (code?.data)        {
        yaEscaneado = true;

        document.getElementById("resultado").innerText = "QR leído correctamente.";

        let data;
        try {
          data = JSON.parse(code.data);
        } catch (e) {
          console.warn("Error al parsear el contenido del QR:", e);
          document.getElementById("infoEquipo").innerHTML = "<p style='color:red;'>❌ El QR no contiene información válida del equipo.</p>";
          return;
        }
        

        const miembrosHTML = Array.isArray(data.miembros)
          ? "<ul>" + data.miembros.map(m =>
              `<li><strong>${m.nombre}</strong> – ${m.email} – ${m.telefono}</li>`).join("") + "</ul>"
          : "<p>No hay miembros.</p>";

        document.getElementById("infoEquipo").innerHTML = `
          <h3>📋 Información del Equipo</h3>
          <p><strong>Nombre:</strong> ${data.nombreEquipo}</p>
          <p><strong>Manager:</strong> ${data.manager}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Teléfono:</strong> ${data.telefono}</p>
          <p><strong>Miembros:</strong></p>
          ${miembrosHTML}
          <br><button onclick="location.reload()">🔁 Escanear otro QR</button>
        `;
      }
    }, 1000);
  })
  .catch(function(err) {
    console.error("Error al acceder a la cámara:", err);
    document.getElementById("resultado").innerText = "❌ No se pudo acceder a la cámara.";
  });
