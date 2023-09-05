
  const agregarBtn = document.getElementById('agregar');
  const agregarNum = document.getElementById('num');
  const limpiarBtn = document.getElementById('limpiar');
  const contenedor = document.getElementById('contenedor');
  const itemInput = document.getElementById('item');
  const dosEnUno = itemInput+" "+agregarNum;
  
  // Cargar elementos desde el Local Storage al cargar la página
  const storedItems = JSON.parse(localStorage.getItem('items')) || [];
  storedItems.forEach(itemText => {
    const item = document.createElement('li');
    item.className = 'list-group-item';
    item.textContent = itemText;
    contenedor.appendChild(item);
  });
  
  agregarBtn.addEventListener('click', () => {
    const newItemText = item.value.trim();
    const newNumText = num.value.trim();
    if (newItemText && newNumText !== '' ) {
      const newItem = createListItem(`${newItemText} - ${newNumText}`); // Combinar texto del input de ítem y número
      contenedor.appendChild(newItem);
      // Agregar el nuevo ítem al Local Storage
      storedItems.push(`${newItemText} - ${newNumText}`);
      localStorage.setItem('items', JSON.stringify(storedItems));
      
      itemInput.value = '';
      agregarNum.value = ''; // Limpiar el campo
    }
  });

  
  limpiarBtn.addEventListener('click', () => {
    // Limpiar el Local Storage
    localStorage.removeItem('items');
    
    // Limpiar la vista
    contenedor.innerHTML = '';
  });
  function createListItem(text) {
    const item = document.createElement('li');
    item.className = 'list-group-item';
    item.textContent = text;
    return item;
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