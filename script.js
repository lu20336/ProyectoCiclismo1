document.addEventListener("DOMContentLoaded", function () {
    const loginButton = document.getElementById("loginButton");
    const registroLink = document.getElementById("registroLink");
    const logoutButton = document.getElementById("logout");
    const authContainer = document.getElementById("authContainer");
    const authButton = document.getElementById("authButton");
    const toggleAuth = document.getElementById("toggleAuth");
    const authTitle = document.getElementById("authTitle");
    const extraFields = document.getElementById("extraFields");
    
    let isRegistering = false;

    // Mostrar formulario de login
    loginButton.addEventListener("click", function () {
        authContainer.style.display = "flex";
    });

    // Alternar entre "Iniciar sesión" y "Registrarse"
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

    // Manejo de autenticación
    authButton.addEventListener("click", function () ){
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        if (!email || !password) {
            alert("Todos los campos son obligatorios.");
            return;
        }

        if (isRegistering) {
            // Registro de usuario
            const nombreCompleto = document.getElementById("nombreCompleto").value;
            const telefono = document.getElementById("telefono").value;
            const ciudad = document.getElementById("ciudad").value;

            if (!nombreCompleto || !telefono || !ciudad) {
                alert("Todos los campos son obligatorios para registrarte.");
                return;
            }

            const userData = {
                email,
                password,
                nombreCompleto,
                telefono,
                ciudad,
                equipos: [] // 👈 Aquí se guarda espacio para los equipos
            };
            localStorage.setItem(email, JSON.stringify(userData));
            
            alert("Registro exitoso. Ahora puedes iniciar sesión.");
    toggleAuth.click();
}

        } else {
            // Inicio de sesión
            const storedUser = localStorage.getItem(email);
            if (storedUser) {
                const user = JSON.parse(storedUser);
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
    });

    // Cerrar sesión
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

    updateUI();
});

    document.addEventListener("DOMContentLoaded", function () {
        const infoTableBody = document.querySelector("#infoTable tbody");
    
        if (infoTableBody) {
            let registros = JSON.parse(localStorage.getItem("inscripciones")) || [];
    
            infoTableBody.innerHTML = ""; // Limpia la tabla antes de insertar datos
    
            if (registros.length === 0) {
                let fila = infoTableBody.insertRow();
                let celda = fila.insertCell(0);
                celda.colSpan = 4;
                celda.textContent = "No hay inscripciones registradas";
                celda.style.textAlign = "center";
            } else {
                registros.forEach(registro => {
                    let fila = infoTableBody.insertRow();
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
    
        let nombre = document.getElementById("nombre").value;
        let email = document.getElementById("email").value;
        let telefono = document.getElementById("telefono").value;
        let curso = document.getElementById("curso").value;
    
        let inscripciones = JSON.parse(localStorage.getItem("inscripciones")) || [];
        inscripciones.push({ nombre, email, telefono, curso });
    
        localStorage.setItem("inscripciones", JSON.stringify(inscripciones));
    
        alert("Inscripción guardada con éxito");
        this.reset();
    });
    document.addEventListener("DOMContentLoaded", function () {
        const formulario = document.querySelector("#formularioInscripcion");
    
        if (formulario) {
            formulario.addEventListener("submit", function (event) {
                event.preventDefault();
    
                let nombre = document.querySelector("#nombre").value;
                let email = document.querySelector("#email").value;
                let telefono = document.querySelector("#telefono").value;
                let curso = document.querySelector("#curso").value;
    
                if (nombre && email && telefono && curso) {
                    let inscripciones = JSON.parse(localStorage.getItem("inscripciones")) || [];
    
                    let nuevoRegistro = {
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
