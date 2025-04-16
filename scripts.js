console.log("Script cargado");



// Animación de aparición por scroll
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('section').forEach(section => {
  observer.observe(section);
});



// Clic en tarjeta de servicio → precargar nombre en el formulario
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => {
      const nombreServicio = card.getAttribute('data-servicio');
      const inputServicio = document.querySelector('#form-reserva input[name="servicio"]');
      if (inputServicio) {
        inputServicio.value = nombreServicio;
        document.getElementById("reservas").scrollIntoView({ behavior: "smooth" });
      }
    });
  });







  const abrirGaleria = document.getElementById("abrirGaleria");
const contenedorGaleria = document.getElementById("contenedorGaleria");
const volverGaleria = document.getElementById("volverGaleria");

abrirGaleria.addEventListener("click", () => {
  contenedorGaleria.classList.remove("oculto");
  contenedorGaleria.classList.add("visible");
  volverGaleria.classList.remove("oculto");
  volverGaleria.classList.add("visible");
  abrirGaleria.style.display = "none";
});

volverGaleria.addEventListener("click", () => {
  contenedorGaleria.classList.remove("visible");
  contenedorGaleria.classList.add("oculto");
  volverGaleria.classList.remove("visible");
  volverGaleria.classList.add("oculto");
  abrirGaleria.style.display = "block";
});





// Botón + Info para desplegar/ocultar descripción del servicio
document.querySelectorAll('.btn-info').forEach(btn => {
    btn.addEventListener('click', () => {
      const desc = btn.closest('.servicio').querySelector('.descripcion');
      desc.classList.toggle('oculto');
      btn.textContent = desc.classList.contains('oculto') ? '+ Info' : '- Info';
    });
  });
  


  const buscador = document.getElementById("buscadorServicios");
buscador.addEventListener("input", () => {
  const filtro = buscador.value.toLowerCase();
  document.querySelectorAll(".servicio").forEach(servicio => {
    const nombre = servicio.querySelector("h3").textContent.toLowerCase();
    const desc = servicio.querySelector(".descripcion").textContent.toLowerCase();
    servicio.style.display = nombre.includes(filtro) || desc.includes(filtro) ? "block" : "none";
  });
});




document.addEventListener('DOMContentLoaded', () => {
    const botonesInfo = document.querySelectorAll('.btn-info');
  
    botonesInfo.forEach(boton => {
      boton.addEventListener('click', () => {
        const descripcion = boton.closest('.servicio').querySelector('.descripcion');
        descripcion.classList.toggle('visible');
        descripcion.classList.toggle('oculto');
  
        // Cambiar texto del botón
        if (descripcion.classList.contains('visible')) {
          boton.textContent = '− Info';
        } else {
          boton.textContent = '+ Info';
        }
      });
    });
  });
  



  
  



  let serviciosSeleccionados = [];

document.querySelectorAll('.btn-carrito').forEach(boton => {
  boton.addEventListener('click', () => {
    const servicio = boton.closest('.servicio').querySelector('h3').textContent;
    if (!serviciosSeleccionados.includes(servicio)) {
      serviciosSeleccionados.push(servicio);
      actualizarInputServicios();
    }
  });
});




function actualizarInputServicios() {
  const input = document.getElementById("input-servicio");
  const lista = document.getElementById("listaSeleccion");

  // Actualiza el input oculto con todos los servicios separados por coma
  input.value = serviciosSeleccionados.join(', ');

  // Limpia el HTML visual
  lista.innerHTML = "";

  // Vuelve a mostrar los servicios con botón ❌
  serviciosSeleccionados.forEach((servicio, index) => {
    const li = document.createElement("li");
    li.textContent = servicio;

    const btnEliminar = document.createElement("button");
    btnEliminar.textContent = "❌";
    btnEliminar.style.marginLeft = "0.5rem";
    btnEliminar.onclick = () => {
      serviciosSeleccionados.splice(index, 1);
      actualizarInputServicios(); // vuelve a renderizar
    };

    li.appendChild(btnEliminar);
    lista.appendChild(li);
  });
}












// Firebase SDK
// Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, where, deleteDoc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";


// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyA6OpeR0brd4QHxxsdR8BCQ5ZEol3aspeQ",
  authDomain: "csstudio-reservas.firebaseapp.com",
  projectId: "csstudio-reservas",
  storageBucket: "csstudio-reservas.firebasestorage.app",
  messagingSenderId: "70779975882",
  appId: "1:70779975882:web:3cffec38bf7a0dc44a9c33"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 🔍 Acá va tu log de prueba
console.log("Firebase conectado ✅");

// 🧠 Ejecutamos el resto cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-reserva");
  const horaSelect = document.getElementById("select-hora");

  const HORARIOS = [
    "10:00", "11:00", "12:00",
    "14:00", "15:00", "16:00", "17:00"
  ];

  form.fecha.addEventListener("change", async () => {
    const fecha = form.fecha.value;

    const q = query(collection(db, "reservas"), where("fecha", "==", fecha));
    const snapshot = await getDocs(q);
    const horasOcupadas = snapshot.docs.map(doc => doc.data().hora);

    horaSelect.innerHTML = '<option value="">Seleccioná una hora</option>';
    HORARIOS.forEach(hora => {
      if (!horasOcupadas.includes(hora)) {
        const option = document.createElement("option");
        option.value = hora;
        option.textContent = hora;
        horaSelect.appendChild(option);
      }
    });
  });

  form.addEventListener("submit", async e => {
    e.preventDefault();

    const data = {
      nombre: form.nombre.value,
      servicio: form.servicio.value,
      fecha: form.fecha.value,
      hora: form.hora.value
    };

    await addDoc(collection(db, "reservas"), data);

    alert("Reserva guardada con éxito ✅");
    form.reset();
    horaSelect.innerHTML = '<option value="">Seleccioná una hora</option>';
  });
});





// ✅ Modo admin
let modoAdmin = false;

function activarAdmin() {
  const clave = document.getElementById("admin-pass").value;
  if (clave === "tucuenta123") {
    modoAdmin = true;
    alert("Modo administrador activado 🔐");
    document.getElementById("admin-panel").style.display = "block";
    document.getElementById("admin-login").style.display = "none";
    mostrarReservas(); // recargar la lista con los botones
  } else {
    alert("Clave incorrecta ❌");
  }
}
window.activarAdmin = activarAdmin;

function cerrarAdmin() {
  modoAdmin = false;
  document.getElementById("admin-panel").style.display = "none";
  document.getElementById("admin-login").style.display = "block";
  document.getElementById("admin-pass").value = "";
}
window.cerrarAdmin = cerrarAdmin;

function mostrarToast(mensaje) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = mensaje;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// ✅ Mostrar todas las reservas
async function mostrarReservas() {
  const lista = document.getElementById("lista-reservas");
  lista.innerHTML = "";

  const snapshot = await getDocs(collection(db, "reservas"));
  snapshot.forEach(doc => {
    const datos = doc.data();
    const li = document.createElement("li");
    li.textContent = `${datos.fecha} - ${datos.hora} - ${datos.nombre} - ${datos.servicio}`;

    // 🔐 Botón de borrar si es admin
    if (modoAdmin) {
      const btn = document.createElement("button");
      btn.textContent = "❌";
      btn.style.marginLeft = "1rem";
      btn.onclick = async () => {
        li.classList.add("fade-out");
        setTimeout(async () => {
          await deleteDoc(doc.ref);
          li.remove();
          mostrarToast("Reserva eliminada ✅");
        }, 400);
      };
      li.appendChild(btn);
    }

    lista.appendChild(li);
  });
}

// ✅ Filtrar reservas por fecha
async function filtrarReservas() {
  const fechaSeleccionada = document.getElementById("filtro-fecha").value;
  const lista = document.getElementById("lista-reservas");
  lista.innerHTML = "";

  if (!fechaSeleccionada) return;

  const q = query(collection(db, "reservas"), where("fecha", "==", fechaSeleccionada));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    lista.innerHTML = "<li>No hay reservas para esa fecha</li>";
    return;
  }

  snapshot.forEach(doc => {
    const datos = doc.data();
    const li = document.createElement("li");
    li.textContent = `${datos.fecha} - ${datos.hora} - ${datos.nombre} - ${datos.servicio}`;

    if (modoAdmin) {
      const btn = document.createElement("button");
      btn.textContent = "❌";
      btn.style.marginLeft = "1rem";
      btn.onclick = async () => {
        li.classList.add("fade-out");
        setTimeout(async () => {
          await deleteDoc(doc.ref);
          li.remove();
          mostrarToast("Reserva eliminada ✅");
        }, 400);
      };
      li.appendChild(btn);
    }

    lista.appendChild(li);
  });
}
window.filtrarReservas = filtrarReservas;

document.addEventListener("DOMContentLoaded", mostrarReservas);












function cambiarEstado(mensaje) {
  const seccion = document.getElementById("estado-del-dia");
  const cartel = document.getElementById("mensaje-estado");
  if (cartel && seccion) {
    cartel.textContent = mensaje;
    seccion.style.display = "block";
  }
}
window.cambiarEstado = cambiarEstado;


function cambiarEstadoPersonalizado() {
  const input = document.getElementById("estado-personalizado");
  if (input && input.value.trim() !== "") {
    cambiarEstado("📝 " + input.value.trim());
    input.value = "";
  }
}
window.cambiarEstadoPersonalizado = cambiarEstadoPersonalizado;

function ocultarEstado() {
  const seccion = document.getElementById("estado-del-dia");
  if (seccion) {
    seccion.style.display = "none";
  }
}
window.ocultarEstado = ocultarEstado;


