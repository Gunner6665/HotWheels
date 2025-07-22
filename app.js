
const formulario = document.getElementById('formulario');
const lista = document.getElementById('lista-autos');
let autos = JSON.parse(localStorage.getItem('autos')) || [];
let autoEditando = null;

function mostrarAutos() {
  lista.innerHTML = '';
  
  autos.sort((a, b) => a.nombre.localeCompare(b.nombre));
  document.getElementById('contador-autos').textContent = `🏎️ Total de carritos: ${autos.length}`;

  autos.forEach((auto, index) => {
    const li = document.createElement('li');
    li.style.borderLeftColor = auto.color;

    const contenido = document.createElement('span');
    contenido.textContent = `${auto.nombre} - ${auto.modelo} (${auto.anio})`;

    const botonEditar = document.createElement('button');
    botonEditar.textContent = '✏️';
    botonEditar.onclick = (event) => {
      event.stopPropagation();
      editarAuto(index);
    };

    const botonEliminar = document.createElement('button');
    botonEliminar.textContent = '❌';
    botonEliminar.onclick = (event) => {
      event.stopPropagation();
      eliminarAuto(index);
    };

    li.onclick = () => mostrarDetalle(auto);
    li.appendChild(contenido);
    li.appendChild(botonEditar);
    li.appendChild(botonEliminar);

    if (auto.foto) {
      const imagen = document.createElement('img');
      imagen.src = auto.foto;
      imagen.alt = "Foto del auto";
      imagen.style.width = "80px";
      imagen.style.marginRight = "50px";
      li.prepend(imagen);
    }

    lista.appendChild(li);
  });
}

formulario.addEventListener('submit', (e) => {
  e.preventDefault();

  const nombre = document.getElementById('nombre').value;
  const modelo = document.getElementById('modelo').value;
  const anio = document.getElementById('anio').value;
  const color = document.getElementById('color').value;
  const archivoFoto = document.getElementById('foto').files[0];

  if (archivoFoto) {
    const lector = new FileReader();
    lector.onload = function () {
      const img = new Image();
      img.onload = function () {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 640;
        const MAX_HEIGHT = 480;
        canvas.width = MAX_WIDTH;
        canvas.height = MAX_HEIGHT;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, MAX_WIDTH, MAX_HEIGHT);
        const dataURL = canvas.toDataURL('image/jpeg', 0.7);
        guardarAuto(nombre, modelo, anio, color, dataURL);
      };
      img.src = lector.result;
    };
    lector.readAsDataURL(archivoFoto);
  } else {
    guardarAuto(nombre, modelo, anio, color, null);
  }
});

function guardarAuto(nombre, modelo, anio, color, foto) {
  const confirmacion = confirm(`¿Deseas agregar el auto "${nombre} - ${modelo} (${anio})"?`);
  if (!confirmacion) return;

  const autoNuevo = { nombre, modelo, anio, color, foto };
  if (autoEditando !== null) {
    autos[autoEditando] = autoNuevo;
    autoEditando = null;
  } else {
    autos.push(autoNuevo);
  }
  localStorage.setItem('autos', JSON.stringify(autos));
  mostrarAutos();
  formulario.reset();
}

function eliminarAuto(index) {
  const auto = autos[index];
  const advertencia = confirm(`⚠️ Vas a eliminar "${auto.nombre} - ${auto.modelo}". Esta acción no se puede deshacer. ¿Continuar?`);
  if (!advertencia) return;
  const confirmacionFinal = confirm(`¿Estás completamente seguro de eliminar "${auto.nombre} - ${auto.modelo}"?`);
  if (!confirmacionFinal) return;

  autos.splice(index, 1);
  localStorage.setItem('autos', JSON.stringify(autos));
  mostrarAutos();
}

function editarAuto(index) {
  const auto = autos[index];
  document.getElementById('nombre').value = auto.nombre;
  document.getElementById('modelo').value = auto.modelo;
  document.getElementById('anio').value = auto.anio;
  document.getElementById('color').value = auto.color;
  autoEditando = index;
}

function mostrarDetalle(auto) {
  document.getElementById('modal-foto').src = auto.foto || '';
  document.getElementById('modal-nombre').textContent = auto.nombre;
  document.getElementById('modal-modelo').textContent = auto.modelo;
  document.getElementById('modal-anio').textContent = auto.anio;
  document.getElementById('modal-color').textContent = auto.color;
  document.getElementById('modal-detalle').style.display = 'flex';
}

function cerrarModal() {
  document.getElementById('modal-detalle').style.display = 'none';
}

document.getElementById('exportar').addEventListener('click', () => {
  const data = JSON.stringify(autos, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const enlace = document.createElement('a');
  enlace.href = url;
  enlace.download = 'coleccion_hotwheels.json';
  enlace.click();
  URL.revokeObjectURL(url);
});

document.getElementById('importar').addEventListener('change', (evento) => {
  const archivo = evento.target.files[0];
  if (!archivo) return;

  const lector = new FileReader();
  lector.onload = (e) => {
    try {
      const datosImportados = JSON.parse(e.target.result);
      if (Array.isArray(datosImportados)) {
        autos = datosImportados;
        localStorage.setItem('autos', JSON.stringify(autos));
        mostrarAutos();
        alert("🎉 Colección importada correctamente.");
      } else {
        alert("⚠️ El archivo no contiene una colección válida.");
      }
    } catch (err) {
      alert("⚠️ Error al leer el archivo.");
    }
  };
  lector.readAsText(archivo);
});

const buscador = document.getElementById('buscador');
buscador.addEventListener('input', () => {
  const texto = buscador.value.toLowerCase();
  const autosFiltrados = autos.filter(auto =>
    auto.nombre.toLowerCase().includes(texto) ||
    auto.modelo.toLowerCase().includes(texto)
  );
  mostrarAutosFiltrados(autosFiltrados);
});

function mostrarAutosFiltrados(listaFiltrada) {
  lista.innerHTML = '';
  listaFiltrada.forEach((auto, index) => {
    const li = document.createElement('li');
    li.style.borderLeftColor = auto.color;

    const contenido = document.createElement('span');
    contenido.textContent = `${auto.nombre} - ${auto.modelo} (${auto.anio})`;

    const botonEditar = document.createElement('button');
    botonEditar.textContent = '✏️';
    botonEditar.onclick = () => editarAuto(index);

    const botonEliminar = document.createElement('button');
    botonEliminar.textContent = '❌';
    botonEliminar.onclick = () => eliminarAuto(index);

    li.onclick = () => mostrarDetalle(auto);
    li.appendChild(contenido);
    li.appendChild(botonEditar);
    li.appendChild(botonEliminar);

    if (auto.foto) {
      const imagen = document.createElement('img');
      imagen.src = auto.foto;
      imagen.alt = "Foto del auto";
      imagen.style.width = "80px";
      imagen.style.marginRight = "50px";
      li.prepend(imagen);
    }

    lista.appendChild(li);
  });
}

mostrarAutos();
