const agregarBtn = document.getElementById('agregar');
const agregarNum = document.getElementById('num');
const limpiarBtn = document.getElementById('limpiar');
const contenedor = document.getElementById('contenedor');
const itemInput = document.getElementById('item');
const nombreErrorElement = document.getElementById('nombre-error'); 
const busquedaError = document.getElementById('busqueda-error');

let elementoEditado = null; // Variable para rastrear el elemento en modo de edición

// Cargar elementos desde el Local Storage al cargar la página
let storedItems = JSON.parse(localStorage.getItem('items')) || [];
storedItems.forEach(itemText => {
  const item = createListItem(itemText);
  contenedor.appendChild(item);
});

agregarBtn.addEventListener('click', () => {
  const newItemText = itemInput.value.trim();
  const newNumText = agregarNum.value.trim();

 // Expresión regular para verificar que newItemText contiene solo letras
 const letrasRegex = /^[A-Za-z]+$/;


  if (elementoEditado) {
    // Estamos en modo de edición, así que actualiza el elemento existente
    const nuevoItemText = `${newItemText} - ${newNumText}`;
    elementoEditado.firstChild.textContent = nuevoItemText;

    // Actualiza en el almacenamiento local (si es necesario)
    const index = storedItems.indexOf(elementoEditado.originalText);
    if (index !== -1) {
      storedItems[index] = nuevoItemText;
      localStorage.setItem('items', JSON.stringify(storedItems));
    }

    // Reinicia el formulario y el modo de edición
    itemInput.value = '';
    agregarNum.value = '';
    agregarBtn.textContent = 'Agregar';
    elementoEditado = null;
  } else {
    // No estamos en modo de edición, así que agrega un nuevo elemento
    if (!newItemText || !newNumText) {
      // Error: Uno de los campos no se completó
      nombreErrorElement.textContent = '*Por favor, complete los dos campos.';
    } else if (!letrasRegex.test(newItemText)) {
      // Error: El nombre no contiene solo letras
      nombreErrorElement.textContent = '*Por favor, ingrese un nombre que solo contenga letras.';
    } else {
      // No hay errores, podemos agregar el elemento
      const nuevoItem = createListItem(` ${newItemText} - ${newNumText}`);
      contenedor.appendChild(nuevoItem);
      storedItems.push(`${newItemText} - ${newNumText}`);
      localStorage.setItem('items', JSON.stringify(storedItems));
  
      // Limpia el formulario y el mensaje de error
      itemInput.value = '';
      agregarNum.value = '';
      nombreErrorElement.textContent = ''; // Limpia el mensaje de error
    }
  }
});

limpiarBtn.addEventListener('click', () => {
  // Limpiar el Local Storage
  localStorage.removeItem('items');
  storedItems = [];
  // Limpiar la vista
  contenedor.innerHTML = '';
});

function createListItem(text) {
  const item = document.createElement('li');
  item.className = 'list-group-item';

  // Ícono de Edición
  const editIcon = document.createElement('i');
  editIcon.className = 'btn custom-edit-btn fas fa-edit'; // Agrega la clase editIcon
  editIcon.addEventListener('click', () => {

    // Extrae el nombre y el número actuales
    const [nombreActual, numeroActual] = text.split('-').map(t => t.trim());

    // Llena los campos de entrada con los valores actuales
    itemInput.value = nombreActual;
    agregarNum.value = numeroActual;

    // Cambia el botón "Agregar" a "Guardar"
    agregarBtn.textContent = 'Guardar';

    // Marca el elemento como en modo de edición
    elementoEditado = item;
    elementoEditado.originalText = text;
  });

 // Ícono de Borrar
 const deleteIcon = document.createElement('i');
 deleteIcon.className = 'btn custom-delete-btn fas fa-trash-alt'; 
 deleteIcon.addEventListener('click', () => {
    item.remove(); // Elimina el elemento al hacer clic en el botón de borrar
    removeItemFromLocalStorage(text); // También elimina el elemento del Local Storage
  });

  // Texto del elemento de la lista
  const itemText = document.createElement('span');
  itemText.textContent = text;

// Agrega íconos y texto al elemento de la lista
item.appendChild(itemText);
item.appendChild(editIcon);
item.appendChild(deleteIcon);

  return item;
}

function removeItemFromLocalStorage(itemText) {
  // Elimina el elemento correspondiente del Local Storage
  const indexToRemove = storedItems.indexOf(itemText);
  if (indexToRemove !== -1) {
    storedItems.splice(indexToRemove, 1);
    localStorage.setItem('items', JSON.stringify(storedItems));
  }
}
const searchInput = document.getElementById('buscar');
buscarBtn.addEventListener('click', () => {
  const searchTerm = searchInput.value.trim().toLowerCase();
  contenedor.innerHTML = '';

  // Verifica si el término de búsqueda contiene dígitos numéricos
  const contieneNumeros = /\d/.test(searchTerm);

  if (contieneNumeros) {
    // Muestra un mensaje de error si el término de búsqueda contiene números
    busquedaError.textContent = '*Por favor, realice su búsqueda por nombre.';
  } else {
    // Realiza la búsqueda normalmente
    const filteredItems = storedItems.filter(item => {
      const [nombre] = item.split(' - ');
      const nombreEnMinusculas = nombre.toLowerCase();
      return nombreEnMinusculas.includes(searchTerm);
    });

    filteredItems.forEach(itemText => {
      const item = createListItem(itemText);
      contenedor.appendChild(item);
      busquedaError.textContent = '';
    });
  }
});
