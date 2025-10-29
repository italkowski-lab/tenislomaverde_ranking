document.addEventListener("DOMContentLoaded", () => {
  const csvFileInput = document.getElementById("csvFile");
  const tableBody = document.querySelector("#rankingTable tbody");
  const fileName = document.getElementById("fileName");

  const adminLoginBtn = document.getElementById("adminLoginBtn");
  const loginModal = document.getElementById("loginModal");
  const closeModal = document.getElementById("closeModal");
  const loginBtn = document.getElementById("loginBtn");
  const adminPanel = document.getElementById("adminPanel");
  const loginError = document.getElementById("loginError");

  // LOGIN
  adminLoginBtn.addEventListener("click", () => loginModal.style.display = "block");
  closeModal.addEventListener("click", () => loginModal.style.display = "none");

  loginBtn.addEventListener("click", () => {
    const user = document.getElementById("adminUser").value.trim();
    const pass = document.getElementById("adminPass").value.trim();

    if (user === "subcotenis" && pass === "654321") {
      adminPanel.style.display = "block";
      loginModal.style.display = "none";
      loginError.style.display = "none";
    } else {
      loginError.style.display = "block";
    }
  });

  window.addEventListener("click", e => {
    if (e.target === loginModal) loginModal.style.display = "none";
  });

  // IMPORTAR CSV
  csvFileInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (!file) return;

    fileName.textContent = `Archivo cargado: ${file.name}`;
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const data = parseCSV(text);
      renderTable(data);
    };
    reader.readAsText(file);
  });

  function parseCSV(text) {
    const lines = text.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
    if (lines.length === 0) return [];

    return lines.slice(1).map(line => {
      const sep = line.includes(';') ? ';' : ',';
      const cols = line.split(sep).map(c => c.trim()).filter(Boolean);

      const pos = parseInt(cols[0]);
      const nombre = cols[1] || '';
      const puntos = parseFloat((cols[2] || '0').replace(/\./g, '').replace(',', '.'));

      return {
        pos: isNaN(pos) ? '' : pos,
        nombre,
        puntos: isNaN(puntos) ? 0 : puntos
      };
    }).filter(r => r.nombre);
  }

  function renderTable(data) {
    tableBody.innerHTML = "";
    data.forEach(row => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${row.pos}</td>
        <td>${row.nombre}</td>
        <td>${row.puntos}</td>
      `;
      tableBody.appendChild(tr);
    });
  }
});
document.addEventListener("DOMContentLoaded", function() {
  const adminBtn = document.getElementById("adminBtn");
  const loginModal = document.getElementById("loginModal");
  const closeLogin = document.getElementById("closeLogin");
  const loginSubmit = document.getElementById("loginSubmit");
  const uploadBtn = document.getElementById("uploadBtn");

  const ADMIN_USER = "subcoloma";
  const ADMIN_PASS = "654321";

  // Abrir modal
  adminBtn.addEventListener("click", () => {
    loginModal.style.display = "block";
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
      loginModal.style.display = "none";
      adminBtn.style.display = "none";
      uploadBtn.style.display = "block";
      alert("Acceso concedido");
    } else {
      alert("Usuario o contraseña incorrectos");
    }
  });

  // Cerrar modal si se hace clic fuera
  window.addEventListener("click", (e) => {
    if (e.target === loginModal) {
      loginModal.style.display = "none";
    }
  });
});
