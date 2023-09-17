//Variables
const carrito = document.querySelector('#carrito');
const contenedorCarrito = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn= document.querySelector('#vaciar-carrito');
const listaCursos = document.querySelector('#lista-cursos');
let articulosCarrito = [];

cargarEventListeners();
function cargarEventListeners() {
  //Cuando agregas un curso presionando "Agregar al carrito"
  listaCursos.addEventListener('click', agregarCurso);

  //Elimina cursos del carrito
  carrito.addEventListener('click', eliminarCurso);

  //Muestra los cursos de localStorage
  document.addEventListener('DOMContentLoaded', () => {
    articulosCarrito = JSON.parse(localStorage.getItem('carrito')) || [];

    carritoHTML();
  })

  //Vaciar el carrito
  vaciarCarritoBtn.addEventListener('click', () => {
    articulosCarrito = []; //resetea el array

    limpiarHTML(); //elimina todo el html del carrito
  })
}

//Funciones
function agregarCurso(e) {
  e.preventDefault();
  if(e.target.classList.contains('agregar-carrito')) {
    const cursoSeleccionado = e.target.parentElement.parentElement;
    leerDatosCurso(cursoSeleccionado)
  }
}

//Elimina un curso del carrito
function eliminarCurso(e) {
  if(e.target.classList.contains('borrar-curso')) {
    const cursoId = e.target.getAttribute('data-id');

    //Elimina del array articulosCarrito por el data-id
    articulosCarrito = articulosCarrito.filter(elem => elem.id !== cursoId);

    carritoHTML(); //para q actualice los elementos a mostrar
  }
}

//Lee el contenido del HTML al que le dimos click y extrae la informacion del curso
function leerDatosCurso(curso) {
  //Crear un objeto con el contenido del curso actual
  const infoCurso = {
    imagen: curso.querySelector('img').src,
    titulo: curso.querySelector('h4').textContent,
    precio: curso.querySelector('.precio span').textContent,
    id: curso.querySelector('a').getAttribute('data-id'),
    cantidad: 1
  }

  //comprueba si un elemento ya existe en el carrito
  const existe = articulosCarrito.some(elem => elem.id === infoCurso.id);

  if(existe) {
    //Actualizamos la cantidad
    const cursos = articulosCarrito.map(elem => {
      if(elem.id === infoCurso.id) {
        elem.cantidad++;
        return elem; //retorna el objeto actualizado //no es necesario ya que el return fuera de este if hace lo mismo sea o no un elemento duplicado
      }
      return elem; //retorna los objetos que no son los duplicados
    });

    articulosCarrito = [...cursos]; //no es necesario guardar el nuevo array ya que dentro del map se modifican los objetos y ya queda guardada la informacion
  } else {
    //Agrega elementos al array de carrito
    articulosCarrito = [...articulosCarrito, infoCurso];
  }
  

  //console.log(articulosCarrito);

  carritoHTML();
}

//Muestra el carrito de compras en el HTML
function carritoHTML() {
  //Limpiar el HTML
  limpiarHTML();

  //Recorre el carrito y genera el HTML
  articulosCarrito.forEach( elem => {
    const { imagen, titulo, precio, cantidad, id } = elem;
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>
        <img src='${imagen}' width='100'>
      </td>
      <td>${titulo}</td>
      <td>${precio}</td>
      <td>${cantidad}</td>
      <td>
        <a href="#" class='borrar-curso' data-id="${id}"> X </a>
      </td>
    `;

    //Agrega el HTML del carrito en el tbody
    contenedorCarrito.appendChild(row);
  });

  //Agregar el carrito de compras a localStorage
  sincronizarSotrage();
}

function sincronizarSotrage() {
  localStorage.setItem('carrito', JSON.stringify(articulosCarrito));
}

//Elimina los cursos del tbody
function limpiarHTML() {
  //contenedorCarrito.innerHTML = ''; //forma lenta

  while(contenedorCarrito.firstChild) {
    contenedorCarrito.removeChild(contenedorCarrito.firstChild);
  }
}