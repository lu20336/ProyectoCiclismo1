/* eslint-disable no-console */
/**
 * Escáner QR optimizado para Codacy.
 * Usa jsQR y canvas para capturar códigos QR desde la cámara del dispositivo.
 */

navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
  .then((stream) => {
    const video = document.getElementById("preview");
    video.srcObject = stream;
    video.setAttribute("playsinline", true);
    video.play();

    const canvasElement = document.createElement("canvas");
    const canvas = canvasElement.getContext("2d");
    let yaEscaneado = false;

    const escanear = () => {
      if (yaEscaneado) return;

      canvasElement.width = video.videoWidth;
      canvasElement.height = video.videoHeight;
      canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);

      const imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert"
      });

      if (code?.data) {
        procesarQR(code.data);
        yaEscaneado = true;
      }
    };

    const procesarQR = (contenido) => {
      let data;
      try {
        data = JSON.parse(contenido);
      } catch (e) {
        mostrarError("❌ El QR no contiene información válida del equipo.");
        console.warn("Error al parsear QR:", e);
        return;
      }

      const miembrosHTML = Array.isArray(data.miembros)
        ? "<ul>" + data.miembros.map((m) =>
            `<li><strong>${m.nombre}</strong> – ${m.email} – ${m.telefono}</li>`).join("") + "</ul>"
        : "<p>No hay miembros.</p>";

      const info = `
        <h3>📋 Información del Equipo</h3>
        <p><strong>Nombre:</strong> ${data.nombreEquipo}</p>
        <p><strong>Manager:</strong> ${data.manager}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Teléfono:</strong> ${data.telefono}</p>
        <p><strong>Miembros:</strong></p>
        ${miembrosHTML}
        <br><button type="button" onclick="location.reload()">🔁 Escanear otro QR</button>
      `;
      document.getElementById("resultado").innerText = "✅ QR leído correctamente.";
      document.getElementById("infoEquipo").innerHTML = info;
    };

    const mostrarError = (mensaje) => {
      document.getElementById("resultado").innerText = mensaje;
    };

    setInterval(escanear, 1000);
  })
  .catch((err) => {
    console.error("Error al acceder a la cámara:", err);
    document.getElementById("resultado").innerText = "❌ No se pudo acceder a la cámara.";
  });
