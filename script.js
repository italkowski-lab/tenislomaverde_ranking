document.addEventListener("DOMContentLoaded", function() {
    const adminBtn = document.getElementById("adminBtn");
    const loginModal = document.getElementById("loginModal");
    const closeLogin = document.getElementById("closeLogin");
    const loginSubmit = document.getElementById("loginSubmit");
    const uploadBtn = document.getElementById("uploadBtn");

    const ADMIN_USER = "subcoloma";
    const ADMIN_PASS = "654321";

    // Función para limpiar los campos del login
    function resetLoginForm() {
        document.getElementById("username").value = "";
        document.getElementById("password").value = "";
    }

    // Abrir modal
    adminBtn.addEventListener("click", () => {
        loginModal.style.display = "block";
        resetLoginForm(); // Limpia los campos cada vez que se abre
    });

    // Cerrar modal
    closeLogin.addEventListener("click", () => {
        loginModal.style.display = "none";
    });

    // Verificar login
    loginSubmit.addEventListener("click", () => {
        const user = document.getElementById("username").value.trim();
        const pass = document.getElementById("password").value.trim();

        if (user === ADMIN_USER && pass === ADMIN_PASS) {
            // Éxito: Ocultar modal, ocultar Admin, mostrar Subir CSV
            loginModal.style.display = "none";
            adminBtn.style.display = "none";
            uploadBtn.style.display = "block";
            // En una aplicación real, se usaría localStorage para mantener la sesión
            alert("Acceso concedido. Botón de subir CSV activado.");
        } else {
            // Fallo: Mostrar alerta y limpiar la contraseña
            alert("Usuario o contraseña incorrectos");
            document.getElementById("password").value = ""; // Limpiar solo la contraseña
        }
    });

    // Cerrar modal si se hace clic fuera
    window.addEventListener("click", (e) => {
        if (e.target === loginModal) {
            loginModal.style.display = "none";
        }
    });
});
