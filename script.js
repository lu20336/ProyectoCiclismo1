authButton.addEventListener("click", function () {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!camposValidos(email, password)) return;

    if (isRegistering) {
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
            equipos: []
        };
        localStorage.setItem(email, JSON.stringify(userData));
        alert("Registro exitoso. Ahora puedes iniciar sesión.");
        toggleAuth.click();
    } else {
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

function camposValidos(email, password) {
    if (!email || !password) {
        alert("Todos los campos son obligatorios.");
        return false;
    }
    return true;
}
