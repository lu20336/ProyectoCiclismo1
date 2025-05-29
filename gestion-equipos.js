if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", function () {
    var userId = sessionStorage.getItem("usuario_id");
    if (!userId) {
      alert("Inicia sesión para continuar.");
      goToLogin();
    }

    function goToLogin() {
      window.location.href = "index.html";
    }

    var miembrosCont = document.getElementById("miembrosContainer");
    var miembros = [];
    var contador = 0;
    document.getElementById("btnAgregarMiembro").onclick = function () {
      if (miembros.filter(function (x) { return x; }).length >= 5) {
        return alert("Máximo 5 miembros.");
      }
      var idx = contador++;
      var div = document.createElement("div");
      div.className = "miembro";
      div.innerHTML = '<label>Miembro ' + (idx + 1) + ': <input required></label>' +
        '<label>Email: <input type="email" required></label>' +
        '<label>Teléfono: <input type="tel" required></label>' +
        '<button type="button">Eliminar</button><hr>';
      miembrosCont.appendChild(div);
      miembros[idx] = div;
      div.querySelector("button").onclick = function () {
        div.remove();
        miembros[idx] = null;
      };
    };

    function guardar(equipo) {
      return fetch("addTeam.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(equipo)
      }).then(function (res) {
        return res.json();
      });
    }

    function cargar() {
      return fetch("getTeams.php?usuario_id=" + userId)
        .then(function (res) {
          if (!res.ok) throw new Error(res.statusText);
          return res.json();
        });
    }

    document.getElementById("registrarEquipo").onclick = function () {
      var nombreEquipo = document.getElementById("nombreEquipo").value.trim();
      var nombreManager = document.getElementById("nombreManager").value.trim();
      var email = document.getElementById("email").value.trim();
      var telefono = document.getElementById("telefono").value.trim();
      if (!nombreEquipo || !nombreManager || !email || !telefono) {
        return alert("Completa todos los campos del equipo.");
      }
      var listaMiembros = miembros.filter(function (x) { return x; }).map(function (div) {
        var inputs = div.querySelectorAll("input");
        return {
          nombre: inputs[0].value.trim(),
          email: inputs[1].value.trim(),
          telefono: inputs[2].value.trim()
        };
      });
      if (!listaMiembros.length) {
        return alert("Agrega al menos un miembro.");
      }
      var payload = {
        usuario_id: +userId,
        nombreEquipo: nombreEquipo,
        nombreManager: nombreManager,
        email: email,
        telefono: telefono,
        miembros: listaMiembros
      };
      guardar(payload).then(function (resp) {
        if (resp.success) {
          alert("Registrado OK");
          document.getElementById("registroForm").reset();
          miembrosCont.innerHTML = "";
          miembros.length = 0;
          renderEquipos();
        } else {
          alert(resp.error || "Error al guardar.");
        }
      });
    };

    var lista = document.querySelector("#listaEquipos");
    if (lista) {
      lista.addEventListener("click", function (ev) {
        if (ev.target.tagName === "BUTTON" && ev.target.textContent === "Eliminar") {
          var id = ev.target.dataset.id;
          if (!confirm("Eliminar este equipo?")) return;
          fetch("deleteTeam.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ equipo_id: id })
          }).then(function (res) {
            return res.json();
          }).then(function (json) {
            if (json.success) {
              alert("Eliminado");
              renderEquipos();
            } else {
              alert(json.error);
            }
          });
        }
      });
    }

    function renderEquipos() {
      var ul = document.getElementById("listaEquipos");
      ul.innerHTML = "<li>Cargando…</li>";
      cargar().then(function (datos) {
        if (!datos.length) {
          ul.innerHTML = "<li>No hay equipos.</li>";
          return;
        }
        ul.innerHTML = "";
        datos.forEach(function (e) {
          var mems = [];
          if (typeof e.miembros === "string") {
            try { mems = JSON.parse(e.miembros); } catch (ex) {}
          }
          var li = document.createElement("li");
          li.innerHTML = '<strong>' + e.nombre + '</strong><br>' +
            'Manager: ' + e.manager + '<br>' +
            'Email: ' + e.email + '<br>' +
            'Tel: ' + e.telefono + '<br>' +
            mems.map(function (m) {
              return '• ' + m.nombre + ' (' + m.email + ')';
            }).join("<br>") +
            '<br><button data-id="' + e.id + '">Eliminar</button>';
          ul.appendChild(li);
        });
      }).catch(function () {
        ul.innerHTML = "<li>Error al cargar equipos.</li>";
      });
    }

    renderEquipos();
  });
}
