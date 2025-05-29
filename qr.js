document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("generarQR").addEventListener("click", function () {
      const nombreEquipo = document.getElementById("nombreEquipo").value.trim();
      const manager = document.getElementById("nombreManager").value.trim();
      const email = document.getElementById("email").value.trim();
      const telefono = document.getElementById("telefono").value.trim();
  
      if (!nombreEquipo) {
        alert("⚠️ El nombre del equipo es obligatorio.");
        return;
      }
  
      const miembros = Array.from(document.querySelectorAll("#miembrosContainer > div")).map(div => {
        const [nombre, correo, tel] = div.querySelectorAll("input");
        return {
          nombre: nombre?.value.trim(),
          email: correo?.value.trim(),
          telefono: tel?.value.trim()
        };
      });
  
      const datosQR = {
        nombreEquipo,
        manager,
        email,
        telefono,
        miembros
      };
  

  
      const qrCodeContainer = document.getElementById("qrCode");
      qrCodeContainer.innerHTML = "";
      const qr = new QRCode(qrCodeContainer, {
        text: JSON.stringify(datosQR),
        width: 150,
        height: 150
      });
      console.debug("QR generado:", qr);
      
      
           
    });
  });
  