const agregarBtn = document.getElementById('agregar');
const agregarNum = document.getElementById('num');
const limpiarBtn = document.getElementById('limpiar');
const contenedor = document.getElementById('contenedor');
const itemInput = document.getElementById('item');

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
    if (newItemText && newNumText !== '') {
      const nuevoItem = createListItem(`${newItemText} - ${newNumText}`);
      contenedor.appendChild(nuevoItem);
      storedItems.push(`${newItemText} - ${newNumText}`);
      localStorage.setItem('items', JSON.stringify(storedItems));

      // Limpia el formulario
      itemInput.value = '';
      agregarNum.value = '';
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
    // Código de edición aquí...

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
 deleteIcon.className = 'btn custom-delete-btn fas fa-trash-alt'; // Agrega la clase deleteIcon
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
  const searchTerm = searchInput.value.toLowerCase();
  const filteredItems = storedItems.filter(item => item.toLowerCase().includes(searchTerm));
  contenedor.innerHTML = '';
  filteredItems.forEach(itemText => {
    const item = createListItem(itemText);
    contenedor.appendChild(item);
  });
});
