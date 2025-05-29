document.addEventListener("DOMContentLoaded", function () {
    var loginButton = document.getElementById("loginButton");
    var registroLink = document.getElementById("registroLink");
    var logoutButton = document.getElementById("logout");
    var authContainer = document.getElementById("authContainer");
    var authButton = document.getElementById("authButton");
    var toggleAuth = document.getElementById("toggleAuth");
    var authTitle = document.getElementById("authTitle");
    var extraFields = document.getElementById("extraFields");

    var isRegistering = false;

    loginButton.addEventListener("click", function () {
        authContainer.style.display = "flex";
    });

    toggleAuth.addEventListener("click", function () {
        isRegistering = !isRegistering;
        if (isRegistering) {
            authTitle.innerText = "Crear Cuenta";
            authButton.innerText = "Registrarse";
            extraFields.style.display = "block";
            toggleAuth.innerHTML = '¿Ya tienes cuenta? <a href="#">Inicia sesión aquí</a>';
        } else {
            authTitle.innerText = "Iniciar Sesión";
            authButton.innerText = "Ingresar";
            extraFields.style.display = "none";
            toggleAuth.innerHTML = '¿No tienes cuenta? <a href="#">Regístrate aquí</a>';
        }
    });

    authButton.addEventListener("click", function () {
        var email = getValue("email");
        var password = getValue("password");

        if (!validarLogin(email, password)) return;

        if (isRegistering) {
            manejarRegistro(email, password);
        } else {
            manejarLogin(email, password);
        }
    });

    logoutButton.addEventListener("click", function () {
        localStorage.removeItem("loggedInUser");
        updateUI();
    });

    function updateUI() {
        if (localStorage.getItem("loggedInUser")) {
            loginButton.style.display = "none";
            logoutButton.style.display = "block";
            registroLink.href = "registro.html";
        } else {
            loginButton.style.display = "block";
            logoutButton.style.display = "none";
            registroLink.href = "#";
        }
    }

    function getValue(id) {
        var el = document.getElementById(id);
        return el ? el.value.trim() : "";
    }

    function validarLogin(email, password) {
        if (!email || !password) {
            alert("Todos los campos son obligatorios.");
            return false;
        }
        return true;
    }

    function manejarRegistro(email, password) {
        var nombreCompleto = getValue("nombreCompleto");
        var telefono = getValue("telefono");
        var ciudad = getValue("ciudad");

        if (!nombreCompleto || !telefono || !ciudad) {
            alert("Todos los campos son obligatorios para registrarte.");
            return;
        }

        var userData = {
            email: email,
            password: password,
            nombreCompleto: nombreCompleto,
            telefono: telefono,
            ciudad: ciudad,
            equipos: []
        };

        localStorage.setItem(email, JSON.stringify(userData));
        alert("Registro exitoso. Ahora puedes iniciar sesión.");
        toggleAuth.click();
    }

    function manejarLogin(email, password) {
        var storedUser = localStorage.getItem(email);
        if (storedUser) {
            var user = JSON.parse(storedUser);
            if (user.password === password) {
                alert("Inicio de sesión exitoso.");
                localStorage.setItem("loggedInUser", email);
                authContainer.style.display = "none";
                updateUI();
            } else {
                alert("Contraseña incorrecta.");
            }
        } else {
            alert("Usuario no registrado.");
        }
    }

    updateUI();
});

document.addEventListener("DOMContentLoaded", function () {
    var infoTableBody = document.querySelector("#infoTable tbody");

    if (infoTableBody) {
        var registros = JSON.parse(localStorage.getItem("inscripciones")) || [];

        infoTableBody.innerHTML = "";

        if (registros.length === 0) {
            var fila = infoTableBody.insertRow();
            var celda = fila.insertCell(0);
            celda.colSpan = 4;
            celda.textContent = "No hay inscripciones registradas";
            celda.style.textAlign = "center";
        } else {
            registros.forEach(function (registro) {
                var fila = infoTableBody.insertRow();
                fila.insertCell(0).textContent = registro.nombre;
                fila.insertCell(1).textContent = registro.email;
                fila.insertCell(2).textContent = registro.telefono;
                fila.insertCell(3).textContent = registro.curso;
            });
        }
    }
});

document.getElementById("formRegistro").addEventListener("submit", function (event) {
    event.preventDefault();

    var nombre = document.getElementById("nombre").value;
    var email = document.getElementById("email").value;
    var telefono = document.getElementById("telefono").value;
    var curso = document.getElementById("curso").value;

    var inscripciones = JSON.parse(localStorage.getItem("inscripciones")) || [];
    inscripciones.push({ nombre: nombre, email: email, telefono: telefono, curso: curso });

    localStorage.setItem("inscripciones", JSON.stringify(inscripciones));

    alert("Inscripción guardada con éxito");
    this.reset();
});

document.addEventListener("DOMContentLoaded", function () {
    var formulario = document.querySelector("#formularioInscripcion");

    if (formulario) {
        formulario.addEventListener("submit", function (event) {
            event.preventDefault();

            var nombre = document.querySelector("#nombre").value;
            var email = document.querySelector("#email").value;
            var telefono = document.querySelector("#telefono").value;
            var curso = document.querySelector("#curso").value;

            if (nombre && email && telefono && curso) {
                var inscripciones = JSON.parse(localStorage.getItem("inscripciones")) || [];

                var nuevoRegistro = {
                    nombre: nombre,
                    email: email,
                    telefono: telefono,
                    curso: curso
                };

                inscripciones.push(nuevoRegistro);
                localStorage.setItem("inscripciones", JSON.stringify(inscripciones));

                alert("Inscripción guardada correctamente.");
                formulario.reset();
            } else {
                alert("Por favor, complete todos los campos.");
            }
        });
    }
});
