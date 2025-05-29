function validarCamposLogin(email, password) {
  if (!email || !password) {
    alert("Todos los campos son obligatorios.");
    return false;
  }
  return true;
}

function validarCamposRegistro(nombreCompleto, telefono, ciudad) {
  if (!nombreCompleto || !telefono || !ciudad) {
    alert("Todos los campos son obligatorios para registrarte.");
    return false;
  }
  return true;
}

function registrarUsuario(email, password, nombreCompleto, telefono, ciudad) {
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
}

function iniciarSesion(email, password, authContainer, updateUI) {
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
