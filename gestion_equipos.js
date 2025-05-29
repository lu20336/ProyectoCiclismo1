// gestion_equipos.js

document.addEventListener("DOMContentLoaded", () => {
  const usuarioId = sessionStorage.getItem("usuario_id");
  if (!usuarioId) {
    alert("Debes iniciar sesión primero.");
    redirigirAlLogin();
  }
  
  function redirigirAlLogin() {
    window.location.href = "index.html";
  }
  

  // Agregar miembros al formulario
  const miembrosCont = document.getElementById("miembrosContainer");
  const miembros = [];
  let contador = 0;
  document.getElementById("btnAgregarMiembro").onclick = () => {
    if (miembros.filter(x => x).length >= 5) {
      return alert("Máximo 5 miembros.");
    }
    const idx = contador++;
    const div = document.createElement("div");
    div.className = "miembro";
    div.innerHTML = `
      <label>Miembro ${idx+1}: <input required></label>
      <label>Email: <input type="email" required></label>
      <label>Teléfono: <input type="tel" required></label>
      <button type="button">Eliminar</button>
      <hr>
    `;
    miembrosCont.appendChild(div);
    miembros[idx] = div;
    div.querySelector("button").onclick = () => {
      div.remove();
      miembros[idx] = null;
    };
  };

  // Guarda equipo en BD
  async function guardar(equipo) {
    const res = await fetch("addTeam.php", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify(equipo)
    });
    return res.json();
  }

  // Carga equipos desde BD
  async function cargar() {
    const res = await fetch(`getTeams.php?usuario_id=${usuarioId}`);
    if (!res.ok) throw new Error(res.statusText);
    return res.json();
  }

  // Registrar
  document.getElementById("registrarEquipo").onclick = async () => {
    const nombreEquipo  = document.getElementById("nombreEquipo").value.trim();
    const nombreManager = document.getElementById("nombreManager").value.trim();
    const email         = document.getElementById("email").value.trim();
    const telefono      = document.getElementById("telefono").value.trim();

    // validaciones básicas...
    if (!nombreEquipo || !nombreManager || !email || !telefono) {
      return alert("Completa todos los campos del equipo.");
    }

    // Miembros
    const listaMiembros = miembros
      .filter(x => x)
      .map(div => {
        const [inpNom, inpEmail, inpTel] = div.querySelectorAll("input");
        return {
          nombre: inpNom.value.trim(),
          email: inpEmail.value.trim(),
          telefono: inpTel.value.trim()
        };
      });
    if (!listaMiembros.length) {
      return alert("Agrega al menos un miembro.");
    }

    const payload = {
      usuario_id: +usuarioId,
      nombreEquipo,
      nombreManager,
      email,
      telefono,
      miembros: listaMiembros
    };

    const resp = await guardar(payload);
    if (resp.success) {
      alert("Registrado OK");
      document.getElementById("registroForm").reset();
      miembrosCont.innerHTML = "";
      limpiarMiembros();
      await renderEquipos();
    } else {
      alert(resp.error || "Error al guardar.");
    }
  };

  // Eliminar
  document.querySelector("#listaEquipos")?.addEventListener("click", async ev => {
    if (ev.target.tagName === "BUTTON" && ev.target.textContent === "Eliminar") {
      const id = ev.target.dataset.id;
      if (!confirm("Eliminar este equipo?")) return;
      const res = await fetch("deleteTeam.php", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ equipo_id: id })
      });
      const json = await res.json();
      if (json.success) {
        alert("Eliminado");
        await renderEquipos();
      } else alert(json.error);
    }
  });

  // Mostrar
  async function renderEquipos() {
    const ul = document.getElementById("listaEquipos");
    ul.innerHTML = "<li>Cargando…</li>";
    try {
      const datos = await cargar();
      if (!datos.length) {
        ul.innerHTML = "<li>No hay equipos.</li>";
        return;
      }
      ul.innerHTML = "";
      datos.forEach(e => {
        let mems = [];
        if (typeof e.miembros === "string") {
          try { mems = JSON.parse(e.miembros); }
          catch {}
        }
        const li = document.createElement("li");
        li.innerHTML = `
          <strong>${e.nombre}</strong><br>
          Manager: ${e.manager}<br>
          Email: ${e.email}<br>
          Tel: ${e.telefono}<br>
          ${mems.map(m=> `• ${m.nombre} (${m.email})`).join("<br>")}
          <br><button data-id="${e.id}">Eliminar</button>
        `;
        ul.appendChild(li);
      });
    } catch {
      ul.innerHTML = "<li>Error al cargar equipos.</li>";
    }
  }

  renderEquipos();
});
