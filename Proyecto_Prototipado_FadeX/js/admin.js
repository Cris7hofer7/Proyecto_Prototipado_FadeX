
// ==========================================
// FADEX - PANEL DEL ADMINISTRADOR
// ==========================================


// ==========================================
// 1. FUNCIÓN PRINCIPAL
// ==========================================

function obtenerContenidoAdmin(pagina) {

    switch (pagina) {

        case "resumen":
            return mostrarResumenAdmin();

        case "reservas":
            return mostrarReservasAdmin();

        case "ventas":
            return mostrarVentasAdmin();

        case "pagos":
            return mostrarPagosAdmin();

        case "clientes":
            return mostrarClientesAdmin();

        case "barberos":
            return mostrarBarberosAdmin();

        case "usuarios":
            return mostrarUsuariosAdmin();

        case "catalogo":
            return mostrarCatalogoAdmin();

        case "fidelizacion":
            return mostrarFidelizacionAdmin();

        case "reportes":
            return mostrarReportesAdmin();

        case "configuracion":
            return mostrarConfiguracionAdmin();

        default:
            return `
                <div class="dashboard-panel">
                    <h3 class="panel-title">Módulo no encontrado</h3>
                    <p>Selecciona una opción del menú.</p>
                </div>
            `;
    }
}


// ==========================================
// 2. RESUMEN DEL ADMINISTRADOR
// ==========================================

function mostrarResumenAdmin() {

    const clientes = obtenerDatos("fadexClientes");
    const barberos = obtenerDatos("fadexBarberos");
    const reservas = obtenerDatos("fadexReservas");
    const ventas = obtenerDatos("fadexVentas");

    const ingresos = ventas.reduce(
        (total, venta) => total + Number(venta.total),
        0
    );

    const reservasPendientes = reservas.filter(
        reserva => reserva.estado === "Pendiente"
    ).length;

    return `
        <h2 class="dashboard-title">Resumen general</h2>
        <p class="dashboard-subtitle">
            Bienvenido al panel de administración de FadeX.
        </p>

        <div class="stats-grid">

            <div class="stat-card">
                <span class="stat-card-label">Clientes registrados</span>
                <h3 class="stat-card-value">${clientes.length}</h3>
                <p class="stat-card-description">Clientes de FadeX</p>
            </div>

            <div class="stat-card">
                <span class="stat-card-label">Barberos</span>
                <h3 class="stat-card-value">${barberos.length}</h3>
                <p class="stat-card-description">Personal registrado</p>
            </div>

            <div class="stat-card">
                <span class="stat-card-label">Reservas</span>
                <h3 class="stat-card-value">${reservas.length}</h3>
                <p class="stat-card-description">
                    ${reservasPendientes} pendientes
                </p>
            </div>

            <div class="stat-card">
                <span class="stat-card-label">Ingresos registrados</span>
                <h3 class="stat-card-value">S/ ${ingresos.toFixed(2)}</h3>
                <p class="stat-card-description">Ventas de demostración</p>
            </div>

        </div>

        <div class="dashboard-panel">
            <h3 class="panel-title">Últimas reservas</h3>
            ${crearTablaReservasAdmin(reservas.slice(-5).reverse())}
        </div>
    `;
}


// ==========================================
// 3. TABLA DE RESERVAS
// ==========================================

function crearTablaReservasAdmin(reservas) {

    if (reservas.length === 0) {
        return "<p>No hay reservas registradas.</p>";
    }

    return `
        <div class="table-container">
            <table class="dashboard-table">

                <thead>
                    <tr>
                        <th>Cliente</th>
                        <th>Barbero</th>
                        <th>Servicio</th>
                        <th>Fecha</th>
                        <th>Hora</th>
                        <th>Estado</th>
                    </tr>
                </thead>

                <tbody>
                    ${reservas.map(reserva => `
                        <tr>
                            <td>${reserva.cliente}</td>
                            <td>${reserva.barbero}</td>
                            <td>${reserva.servicio}</td>
                            <td>${reserva.fecha}</td>
                            <td>${reserva.hora}</td>
                            <td>
                                <span class="status ${obtenerClaseEstado(reserva.estado)}">
                                    ${reserva.estado}
                                </span>
                            </td>
                        </tr>
                    `).join("")}
                </tbody>

            </table>
        </div>
    `;
}


// ==========================================
// 4. GESTIÓN DE RESERVAS
// ==========================================

function mostrarReservasAdmin() {

    const reservas = obtenerDatos("fadexReservas");

    return `
        <h2 class="dashboard-title">Gestión de reservas</h2>
        <p class="dashboard-subtitle">
            Consulta y administra las citas de la barbería.
        </p>

        <div class="dashboard-panel">

            <div class="dashboard-toolbar">
                <h3 class="panel-title">Reservas registradas</h3>

                <button class="dashboard-button"
                    onclick="agregarReservaDemo()">
                    + Nueva reserva
                </button>
            </div>

            ${crearTablaReservasAdmin(reservas)}

        </div>
    `;
}


function agregarReservaDemo() {

    const clientes = obtenerDatos("fadexClientes");
    const barberos = obtenerDatos("fadexBarberos");
    const servicios = obtenerDatos("fadexServicios");

    if (!clientes.length || !barberos.length || !servicios.length) {
        alert("No hay suficientes datos para crear una reserva.");
        return;
    }

    const nuevaReserva = {
        id: Date.now(),
        clienteId: clientes[0].id,
        cliente: clientes[0].nombre,
        barberoId: barberos[0].id,
        barbero: barberos[0].nombre,
        servicioId: servicios[0].id,
        servicio: servicios[0].nombre,
        fecha: new Date().toISOString().split("T")[0],
        hora: "16:00",
        precio: servicios[0].precio,
        estado: "Pendiente"
    };

    const reservas = obtenerDatos("fadexReservas");

    reservas.push(nuevaReserva);

    guardarDatos("fadexReservas", reservas);

    alert("Reserva de demostración creada correctamente.");

    navegarDashboard("reservas");
}


// ==========================================
// 5. GESTIÓN DE VENTAS
// ==========================================

function mostrarVentasAdmin() {

    const ventas = obtenerDatos("fadexVentas");

    const total = ventas.reduce(
        (suma, venta) => suma + Number(venta.total),
        0
    );

    return `
        <h2 class="dashboard-title">Ventas</h2>
        <p class="dashboard-subtitle">
            Consulta las ventas registradas en FadeX.
        </p>

        <div class="stats-grid">

            <div class="stat-card">
                <span class="stat-card-label">Ventas registradas</span>
                <h3 class="stat-card-value">${ventas.length}</h3>
            </div>

            <div class="stat-card">
                <span class="stat-card-label">Total vendido</span>
                <h3 class="stat-card-value">S/ ${total.toFixed(2)}</h3>
            </div>

        </div>

        <div class="dashboard-panel">

            <h3 class="panel-title">Historial de ventas</h3>

            <div class="table-container">
                <table class="dashboard-table">

                    <thead>
                        <tr>
                            <th>Descripción</th>
                            <th>Cliente</th>
                            <th>Fecha</th>
                            <th>Método de pago</th>
                            <th>Total</th>
                        </tr>
                    </thead>

                    <tbody>
                        ${ventas.map(venta => `
                            <tr>
                                <td>${venta.descripcion}</td>
                                <td>${venta.cliente}</td>
                                <td>${venta.fecha}</td>
                                <td>${venta.metodoPago}</td>
                                <td>S/ ${Number(venta.total).toFixed(2)}</td>
                            </tr>
                        `).join("")}
                    </tbody>

                </table>
            </div>

        </div>
    `;
}


// ==========================================
// 6. GESTIÓN DE PAGOS
// ==========================================

function mostrarPagosAdmin() {

    const ventas = obtenerDatos("fadexVentas");

    return `
        <h2 class="dashboard-title">Pagos</h2>
        <p class="dashboard-subtitle">
            Consulta los pagos registrados.
        </p>

        <div class="dashboard-panel">

            <h3 class="panel-title">Historial de pagos</h3>

            <div class="table-container">
                <table class="dashboard-table">

                    <thead>
                        <tr>
                            <th>Cliente</th>
                            <th>Concepto</th>
                            <th>Método</th>
                            <th>Monto</th>
                            <th>Estado</th>
                        </tr>
                    </thead>

                    <tbody>
                        ${ventas.map(venta => `
                            <tr>
                                <td>${venta.cliente}</td>
                                <td>${venta.descripcion}</td>
                                <td>${venta.metodoPago}</td>
                                <td>S/ ${Number(venta.total).toFixed(2)}</td>
                                <td>
                                    <span class="status status-confirmed">
                                        Pagado
                                    </span>
                                </td>
                            </tr>
                        `).join("")}
                    </tbody>

                </table>
            </div>

        </div>
    `;
}


// ==========================================
// 7. GESTIÓN DE CLIENTES
// ==========================================

function mostrarClientesAdmin() {

    const clientes = obtenerDatos("fadexClientes");

    return `
        <h2 class="dashboard-title">Clientes</h2>
        <p class="dashboard-subtitle">
            Administra los clientes registrados.
        </p>

        <div class="dashboard-panel">

            <div class="dashboard-toolbar">
                <h3 class="panel-title">Lista de clientes</h3>

                <button class="dashboard-button"
                    onclick="agregarClienteDemo()">
                    + Nuevo cliente
                </button>
            </div>

            <div class="table-container">
                <table class="dashboard-table">

                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Correo</th>
                            <th>Teléfono</th>
                        </tr>
                    </thead>

                    <tbody>
                        ${clientes.map(cliente => `
                            <tr>
                                <td>${cliente.nombre}</td>
                                <td>${cliente.correo}</td>
                                <td>${cliente.telefono}</td>
                            </tr>
                        `).join("")}
                    </tbody>

                </table>
            </div>

        </div>
    `;
}


function agregarClienteDemo() {

    const nombre = prompt("Nombre del nuevo cliente:");

    if (!nombre || !nombre.trim()) return;

    const correo = prompt("Correo electrónico:");

    if (!correo || !correo.trim()) return;

    const telefono = prompt("Número de teléfono:");

    if (!telefono || !telefono.trim()) return;

    const clientes = obtenerDatos("fadexClientes");

    clientes.push({
        id: Date.now(),
        nombre: nombre.trim(),
        correo: correo.trim(),
        telefono: telefono.trim()
    });

    guardarDatos("fadexClientes", clientes);

    alert("Cliente registrado correctamente.");

    navegarDashboard("clientes");
}


// ==========================================
// 8. GESTIÓN DE BARBEROS
// ==========================================

function mostrarBarberosAdmin() {

    const barberos = obtenerDatos("fadexBarberos");

    return `
        <h2 class="dashboard-title">Barberos</h2>
        <p class="dashboard-subtitle">
            Administra el personal de FadeX.
        </p>

        <div class="dashboard-panel">

            <div class="dashboard-toolbar">
                <h3 class="panel-title">Personal registrado</h3>

                <button class="dashboard-button"
                    onclick="agregarBarberoDemo()">
                    + Nuevo barbero
                </button>
            </div>

            <div class="table-container">
                <table class="dashboard-table">

                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Correo</th>
                            <th>Especialidad</th>
                            <th>Teléfono</th>
                            <th>Estado</th>
                        </tr>
                    </thead>

                    <tbody>
                        ${barberos.map(barbero => `
                            <tr>
                                <td>${barbero.nombre}</td>
                                <td>${barbero.correo}</td>
                                <td>${barbero.especialidad}</td>
                                <td>${barbero.telefono}</td>
                                <td>
                                    <span class="status status-confirmed">
                                        ${barbero.estado}
                                    </span>
                                </td>
                            </tr>
                        `).join("")}
                    </tbody>

                </table>
            </div>

        </div>
    `;
}


function agregarBarberoDemo() {

    const nombre = prompt("Nombre del barbero:");

    if (!nombre || !nombre.trim()) return;

    const correo = prompt("Correo del barbero:");

    if (!correo || !correo.trim()) return;

    const especialidad = prompt("Especialidad del barbero:");

    if (!especialidad || !especialidad.trim()) return;

    const telefono = prompt("Teléfono del barbero:");

    if (!telefono || !telefono.trim()) return;

    const barberos = obtenerDatos("fadexBarberos");

    barberos.push({
        id: Date.now(),
        nombre: nombre.trim(),
        correo: correo.trim(),
        especialidad: especialidad.trim(),
        telefono: telefono.trim(),
        estado: "Activo"
    });

    guardarDatos("fadexBarberos", barberos);

    alert("Barbero registrado correctamente.");

    navegarDashboard("barberos");
}


// ==========================================
// 9. GESTIÓN DE USUARIOS
// ==========================================

function mostrarUsuariosAdmin() {

    const clientes = obtenerDatos("fadexClientes");
    const barberos = obtenerDatos("fadexBarberos");

    const usuarios = [
        ...clientes.map(cliente => ({
            nombre: cliente.nombre,
            correo: cliente.correo,
            rol: "Cliente"
        })),

        ...barberos.map(barbero => ({
            nombre: barbero.nombre,
            correo: barbero.correo,
            rol: "Barbero"
        }))
    ];

    return `
        <h2 class="dashboard-title">Usuarios</h2>
        <p class="dashboard-subtitle">
            Consulta los usuarios registrados en el prototipo.
        </p>

        <div class="dashboard-panel">

            <h3 class="panel-title">Usuarios del sistema</h3>

            <div class="table-container">
                <table class="dashboard-table">

                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Correo</th>
                            <th>Rol</th>
                        </tr>
                    </thead>

                    <tbody>
                        ${usuarios.map(usuario => `
                            <tr>
                                <td>${usuario.nombre}</td>
                                <td>${usuario.correo}</td>
                                <td>${usuario.rol}</td>
                            </tr>
                        `).join("")}
                    </tbody>

                </table>
            </div>

        </div>
    `;
}


// ==========================================
// 10. CATÁLOGO DE SERVICIOS Y PRODUCTOS
// ==========================================


function mostrarCatalogoAdmin() {

    const servicios = obtenerDatos("fadexServicios");
    const productos = obtenerDatos("fadexProductos");

    return `
        <div class="dashboard-toolbar">
            <div>
                <h3 class="panel-title">Servicios</h3>
                <p class="texto-gris">Administra los servicios y sus precios.</p>
            </div>

            <button class="btn-dorado" onclick="agregarServicioAdmin()">
                + Nuevo servicio
            </button>
        </div>

        <div class="table-container">
            <table class="dashboard-table">
                <thead>
                    <tr>
                        <th>Servicio</th>
                        <th>Precio</th>
                        <th>Duración</th>
                        <th>Acciones</th>
                    </tr>
                </thead>

                <tbody>
                    ${servicios.map(servicio => `
                        <tr>
                            <td>${servicio.nombre}</td>
                            <td>S/ ${servicio.precio}</td>
                            <td>${servicio.duracion} min</td>
                            <td>
                                <button class="btn-secundario"
                                    onclick="editarServicioAdmin(${servicio.id})">
                                    Editar
                                </button>

                                <button class="btn-secundario"
                                    onclick="eliminarServicioAdmin(${servicio.id})">
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>
        </div>

        <br>

        <div class="dashboard-toolbar">
            <div>
                <h3 class="panel-title">Productos</h3>
                <p class="texto-gris">Administra los productos y el inventario.</p>
            </div>

            <button class="btn-dorado" onclick="agregarProductoAdmin()">
                + Nuevo producto
            </button>
        </div>

        <div class="table-container">
            <table class="dashboard-table">
                <thead>
                    <tr>
                        <th>Producto</th>
                        <th>Precio</th>
                        <th>Stock</th>
                        <th>Acciones</th>
                    </tr>
                </thead>

                <tbody>
                    ${productos.map(producto => `
                        <tr>
                            <td>${producto.nombre}</td>
                            <td>S/ ${producto.precio}</td>
                            <td>${producto.stock}</td>
                            <td>
                                <button class="btn-secundario"
                                    onclick="editarProductoAdmin(${producto.id})">
                                    Editar
                                </button>

                                <button class="btn-secundario"
                                    onclick="eliminarProductoAdmin(${producto.id})">
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>
        </div>
    `;
}



// ==========================================
// 11. FIDELIZACIÓN
// ==========================================

function mostrarFidelizacionAdmin() {

    const clientes = obtenerDatos("fadexClientes");

    return `
        <h2 class="dashboard-title">Fidelización</h2>
        <p class="dashboard-subtitle">
            Consulta los clientes registrados en el programa.
        </p>

        <div class="dashboard-panel">

            <h3 class="panel-title">Programa de clientes frecuentes</h3>

            <p>
                En esta sección se podrán administrar puntos,
                recompensas y beneficios para los clientes.
            </p>

            <div class="stats-grid">

                <div class="stat-card">
                    <span class="stat-card-label">Clientes participantes</span>
                    <h3 class="stat-card-value">${clientes.length}</h3>
                </div>

                <div class="stat-card">
                    <span class="stat-card-label">Programa</span>
                    <h3 class="stat-card-value">Activo</h3>
                </div>

            </div>

        </div>
    `;
}


// ==========================================
// 12. REPORTES
// ==========================================

function mostrarReportesAdmin() {

    const ventas = obtenerDatos("fadexVentas");
    const reservas = obtenerDatos("fadexReservas");

    const ingresos = ventas.reduce(
        (total, venta) => total + Number(venta.total),
        0
    );

    const completadas = reservas.filter(
        reserva => reserva.estado === "Completada"
    ).length;

    const pendientes = reservas.filter(
        reserva => reserva.estado === "Pendiente"
    ).length;

    return `
        <h2 class="dashboard-title">Reportes</h2>
        <p class="dashboard-subtitle">
            Estadísticas generales del negocio.
        </p>

        <div class="stats-grid">

            <div class="stat-card">
                <span class="stat-card-label">Ingresos</span>
                <h3 class="stat-card-value">S/ ${ingresos.toFixed(2)}</h3>
            </div>

            <div class="stat-card">
                <span class="stat-card-label">Reservas completadas</span>
                <h3 class="stat-card-value">${completadas}</h3>
            </div>

            <div class="stat-card">
                <span class="stat-card-label">Reservas pendientes</span>
                <h3 class="stat-card-value">${pendientes}</h3>
            </div>

        </div>

        <div class="dashboard-panel">
            <h3 class="panel-title">Información del reporte</h3>

            <p>
                Los resultados se calculan a partir de los datos
                almacenados en el navegador.
            </p>

            <button class="dashboard-button"
                onclick="window.print()">
                Imprimir reporte
            </button>
        </div>
    `;
}


// ==========================================
// 13. CONFIGURACIÓN
// ==========================================

function mostrarConfiguracionAdmin() {

    return `
        <h2 class="dashboard-title">Configuración</h2>
        <p class="dashboard-subtitle">
            Opciones generales del prototipo.
        </p>

        <div class="dashboard-panel">

            <h3 class="panel-title">Información del negocio</h3>

            <div class="dashboard-form">

                <div class="dashboard-form-group">
                    <label>Nombre del negocio</label>
                    <input type="text" value="FadeX" disabled>
                </div>

                <div class="dashboard-form-group">
                    <label>Tipo de negocio</label>
                    <input type="text" value="Barbería" disabled>
                </div>

                <div class="dashboard-form-group">
                    <label>Moneda</label>
                    <input type="text" value="Soles peruanos (S/)" disabled>
                </div>

            </div>

        </div>

        <div class="dashboard-panel">

            <h3 class="panel-title">Datos de demostración</h3>

            <p>
                Puedes restablecer los registros originales
                para volver a realizar pruebas.
            </p>

            <button class="dashboard-button"
                onclick="confirmarRestablecimiento()">
                Restablecer datos
            </button>

        </div>
    `;
}


// ==========================================
// 14. FUNCIONES AUXILIARES
// ==========================================

function obtenerClaseEstado(estado) {

    switch (estado) {

        case "Confirmada":
        case "Completada":
            return "status-confirmed";

        case "Pendiente":
            return "status-pending";

        case "Cancelada":
            return "status-cancelled";

        default:
            return "";
    }
}


function confirmarRestablecimiento() {

    const confirmar = confirm(
        "¿Seguro que deseas restablecer los datos de demostración? " +
        "Se perderán los cambios realizados en clientes, reservas, " +
        "barberos, productos y ventas."
    );

    if (confirmar) {

        restablecerDatosDemo();

        navegarDashboard("resumen");
    }
}

// ==========================================
// GESTIÓN DE SERVICIOS
// ==========================================

function agregarServicioAdmin() {

    const nombre = prompt("Nombre del nuevo servicio:");

    if (!nombre || nombre.trim() === "") {
        return;
    }

    const precio = Number(prompt("Precio del servicio:"));

    if (!Number.isFinite(precio) || precio <= 0) {
        alert("Ingresa un precio válido.");
        return;
    }

    const duracion = Number(prompt("Duración en minutos:"));

    if (!Number.isInteger(duracion) || duracion <= 0) {
        alert("Ingresa una duración válida.");
        return;
    }

    const servicios = obtenerDatos("fadexServicios");

    const nuevoServicio = {
        id: Date.now(),
        nombre: nombre.trim(),
        precio: precio,
        duracion: duracion
    };

    servicios.push(nuevoServicio);

    guardarDatos("fadexServicios", servicios);

    alert("Servicio agregado correctamente.");

    navegarDashboard("catalogo");
}


function editarServicioAdmin(id) {

    const servicios = obtenerDatos("fadexServicios");

    const servicio = servicios.find(s => s.id === id);

    if (!servicio) {
        alert("No se encontró el servicio.");
        return;
    }

    const nuevoNombre = prompt("Nuevo nombre:", servicio.nombre);

    if (!nuevoNombre || nuevoNombre.trim() === "") {
        return;
    }

    const nuevoPrecio = Number(
        prompt("Nuevo precio:", servicio.precio)
    );

    if (!Number.isFinite(nuevoPrecio) || nuevoPrecio <= 0) {
        alert("Precio inválido.");
        return;
    }

    const nuevaDuracion = Number(
        prompt("Nueva duración en minutos:", servicio.duracion)
    );

    if (!Number.isInteger(nuevaDuracion) || nuevaDuracion <= 0) {
        alert("Duración inválida.");
        return;
    }

    servicio.nombre = nuevoNombre.trim();
    servicio.precio = nuevoPrecio;
    servicio.duracion = nuevaDuracion;

    guardarDatos("fadexServicios", servicios);

    alert("Servicio actualizado correctamente.");

    navegarDashboard("catalogo");
}


function eliminarServicioAdmin(id) {

    const confirmar = confirm(
        "¿Estás seguro de eliminar este servicio?"
    );

    if (!confirmar) {
        return;
    }

    const servicios = obtenerDatos("fadexServicios");

    const serviciosActualizados = servicios.filter(
        servicio => servicio.id !== id
    );

    guardarDatos("fadexServicios", serviciosActualizados);

    alert("Servicio eliminado.");

    navegarDashboard("catalogo");
}

// ==========================================
// GESTIÓN DE PRODUCTOS
// ==========================================

function agregarProductoAdmin() {

    const nombre = prompt("Nombre del nuevo producto:");

    if (!nombre || nombre.trim() === "") {
        return;
    }

    const precio = Number(prompt("Precio del producto:"));

    if (!Number.isFinite(precio) || precio <= 0) {
        alert("Ingresa un precio válido.");
        return;
    }

    const stock = Number(prompt("Cantidad inicial de stock:"));

    if (!Number.isInteger(stock) || stock < 0) {
        alert("Ingresa una cantidad válida.");
        return;
    }

    const productos = obtenerDatos("fadexProductos");

    const nuevoProducto = {
        id: Date.now(),
        nombre: nombre.trim(),
        precio: precio,
        stock: stock
    };

    productos.push(nuevoProducto);

    guardarDatos("fadexProductos", productos);

    alert("Producto agregado correctamente.");

    navegarDashboard("catalogo");
}


function editarProductoAdmin(id) {

    const productos = obtenerDatos("fadexProductos");

    const producto = productos.find(p => p.id === id);

    if (!producto) {
        alert("No se encontró el producto.");
        return;
    }

    const nuevoNombre = prompt("Nuevo nombre:", producto.nombre);

    if (!nuevoNombre || nuevoNombre.trim() === "") {
        return;
    }

    const nuevoPrecio = Number(
        prompt("Nuevo precio:", producto.precio)
    );

    if (!Number.isFinite(nuevoPrecio) || nuevoPrecio <= 0) {
        alert("Precio inválido.");
        return;
    }

    const nuevoStock = Number(
        prompt("Nuevo stock:", producto.stock)
    );

    if (!Number.isInteger(nuevoStock) || nuevoStock < 0) {
        alert("Stock inválido.");
        return;
    }

    producto.nombre = nuevoNombre.trim();
    producto.precio = nuevoPrecio;
    producto.stock = nuevoStock;

    guardarDatos("fadexProductos", productos);

    alert("Producto actualizado correctamente.");

    navegarDashboard("catalogo");
}


function eliminarProductoAdmin(id) {

    const confirmar = confirm(
        "¿Estás seguro de eliminar este producto?"
    );

    if (!confirmar) {
        return;
    }

    const productos = obtenerDatos("fadexProductos");

    const productosActualizados = productos.filter(
        producto => producto.id !== id
    );

    guardarDatos("fadexProductos", productosActualizados);

    alert("Producto eliminado.");

    navegarDashboard("catalogo");
}
