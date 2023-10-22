let carritoContainer = document.getElementById('carritoContainer');
let carritoActual = JSON.parse(localStorage.getItem('carrito')) || [];

document.addEventListener("DOMContentLoaded", () => {
  mostrarInformacionEnHTML();
});

function mostrarInformacionEnHTML(data) {
  if (!carritoActual || carritoActual.length === 0) {
    carritoContainer.innerHTML = '<p class="alert alert-warning">El carrito está vacío</p>';
    return;
  }

  const tableContainer = document.createElement("div");
  tableContainer.classList.add("table-responsive");

  const tabla = document.createElement('table');
  tabla.classList.add('table', 'table-striped', 'table-bordered', 'w-100', 'table-responsive');
  tabla.innerHTML = `
    <thead class="thead-dark text-center">
      <tr>
        <th>Producto</th>
        <th>Nombre</th>
        <th class="col-1">Cantidad</th>
        <th>Costo</th>
        <th>Moneda</th>
        <th>Subtotal</th>
        <th>Acción</th>
      </tr>
    </thead>
    <tbody class="text-center">
      <!-- Los datos del carrito se agregarán aquí dinámicamente -->
    </tbody>
  `;

  // Obtener el cuerpo de la tabla para agregar filas
  const tbody = tabla.querySelector('tbody');

  carritoActual.forEach(producto => {
    const fila = document.createElement("tr");

    // Celda de la imagen
    const imagenCell = document.createElement("td");
    imagenCell.innerHTML = `<img src="${producto.image}" alt="${producto.name}" style="width: 70px;">`;

    // Celda del nombre
    const nombreCell = document.createElement("td");
    nombreCell.textContent = producto.name;

    // Celda de la cantidad con el botón de eliminación
    const cantidadCell = document.createElement("td");
    const cantidadInput = document.createElement("input");
    cantidadInput.type = "number";
    cantidadInput.classList.add("btn", "btn-sm", "cantidad");
    cantidadInput.value = producto.count;
    cantidadInput.min = 1;
    cantidadInput.dataset.productoId = producto.id;
    cantidadCell.appendChild(cantidadInput);

    // Celda del costo
    const costoCell = document.createElement("td");
    costoCell.textContent = producto.unitCost;

    // Celda de la moneda
    const monedaCell = document.createElement("td");
    monedaCell.textContent = producto.currency;

    // Celda del subtotal
    const subtotalCell = document.createElement("td");

    // Botón de eliminación
    const eliminarButton = document.createElement("button");
    eliminarButton.textContent = "Eliminar";
    eliminarButton.classList.add("btn", "btn-danger", "btn-sm");
    eliminarButton.dataset.productoId = producto.id;
    eliminarButton.addEventListener("click", () => {
      const productoId = producto.id;
      carritoActual = carritoActual.filter(item => item.id !== productoId);
      localStorage.setItem('carrito', JSON.stringify(carritoActual));
      mostrarInformacionEnHTML();
    });

    // Celda de la acción con el botón de eliminación
    const accionCell = document.createElement("td");
    accionCell.appendChild(eliminarButton);

    // Función para actualizar el subtotal
    const actualizarSubtotal = () => {
      const cantidad = parseInt(cantidadInput.value);
      let subtotalValue = 0;

      if (producto.currency === 'UYU') {
        subtotalValue = cantidad * producto.unitCost * 40;
        subtotalCell.textContent = `UYU ${subtotalValue}`;
      } else {
        subtotalValue = cantidad * producto.unitCost;
        subtotalCell.textContent = `${producto.currency} ${(subtotalValue).toFixed(2)}`;
      }

      // Actualizar el producto en el carritoActual con la nueva cantidad
      const productoIndex = carritoActual.findIndex(item => item.id === producto.id);
      if (productoIndex !== -1) {
        carritoActual[productoIndex].count = cantidad;
        localStorage.setItem('carrito', JSON.stringify(carritoActual));
      }

      mostrarCosto();
    };

    cantidadInput.addEventListener("change", actualizarSubtotal);
    actualizarSubtotal();

    // Agregar todas las celdas a la fila
    fila.appendChild(imagenCell);
    fila.appendChild(nombreCell);
    fila.appendChild(cantidadCell);
    fila.appendChild(costoCell);
    fila.appendChild(monedaCell);
    fila.appendChild(subtotalCell);
    fila.appendChild(accionCell);

    // Agregar la fila al cuerpo de la tabla
    tbody.appendChild(fila);
  });

  // Agregar la tabla al contenedor
  tableContainer.appendChild(tabla);

  // Limpiar el contenedor y agregar la tabla
  carritoContainer.innerHTML = "";
  carritoContainer.appendChild(tableContainer);
}

function mostrarCosto() {
    if (!carritoActual || carritoActual.length === 0) {
      document.getElementById("subtotalCosto").textContent = "$0.00";
    } else {
      let subtotal = 0;
      carritoActual.forEach(producto => {
        if (producto.currency === 'UYU') {
          subtotal += producto.count * producto.unitCost * 40;
        } else {
          subtotal += producto.count * producto.unitCost;
        }
      });
      document.getElementById("subtotalCosto").textContent = `${parseFloat(subtotal).toFixed(2)}`;
    }
  }