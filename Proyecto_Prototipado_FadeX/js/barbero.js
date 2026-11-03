
// ==========================================
// FADEX - PANEL DEL BARBERO
// ==========================================


// ==========================================
// 1. OBTENER BARBERO ACTUAL
// ==========================================

function obtenerBarberoActual() {

    const usuarioGuardado = localStorage.getItem("fadexUsuario");

    if (!usuarioGuardado) return null;

    const usuario = JSON.parse(usuarioGuardado);

    const barberos = obtenerDatos("fadexBarberos");

    // Buscar al barbero por su correo de inicio de sesión.
    return barberos.find(
        barbero => barbero.correo.toLowerCase() ===
            usuario.correo.toLowerCase()
    ) || null;
}


// ==========================================
// 2. FUNCIÓN PRINCIPAL
// ==========================================

function obtenerContenidoBarbero(pagina) {

    const barbero = obtenerBarberoActual();

    if (!barbero) {
        return `
            <div class="dashboard-panel">
                <h3 class="panel-title">Barbero no identificado</h3>
                <p>
                    No encontramos un barbero asociado a esta cuenta.
                    Cierra sesión e inicia con el correo registrado
                    de un barbero.
                </p>
            </div>
        `;
    }

    switch (pagina) {

        case "resumen":
            return mostrarResumenBarbero(barbero);

        case "cortes":
            return mostrarCortesBarbero(barbero);

        case "reservas":
            return mostrarReservasBarbero(barbero);

        case "ventas":
            return mostrarVentasBarbero(barbero);

        case "perfil":
            return mostrarPerfilBarbero(barbero);

        default:
            return `
                <div class="dashboard-panel">
                    <h3 class="panel-title">Módulo no encontrado</h3>
                </div>
            `;
    }
}


// ==========================================
// 3. DASHBOARD PRINCIPAL
// ==========================================

function mostrarResumenBarbero(barbero) {

    const reservas = obtenerDatos("fadexReservas");

    const misReservas = reservas.filter(
        reserva => Number(reserva.barberoId) === Number(barbero.id)
    );

    const pendientes = misReservas.filter(
        reserva => reserva.estado === "Pendiente"
    ).length;

    const confirmadas = misReservas.filter(
        reserva => reserva.estado === "Confirmada"
    ).length;

    const completadas = misReservas.filter(
        reserva => reserva.estado === "Completada"
    ).length;

    return `
        <h2 class="dashboard-title">
            ¡Hola, ${barbero.nombre}!
        </h2>

        <p class="dashboard-subtitle">
            Este es el resumen de tu actividad en FadeX.
        </p>

        <div class="stats-grid">

            <div class="stat-card">
                <span class="stat-card-label">Mis reservas</span>
                <h3 class="stat-card-value">${misReservas.length}</h3>
                <p class="stat-card-description">Citas asignadas</p>
            </div>

            <div class="stat-card">
                <span class="stat-card-label">Pendientes</span>
                <h3 class="stat-card-value">${pendientes}</h3>
                <p class="stat-card-description">Por atender</p>
            </div>

            <div class="stat-card">
                <span class="stat-card-label">Confirmadas</span>
                <h3 class="stat-card-value">${confirmadas}</h3>
                <p class="stat-card-description">Citas confirmadas</p>
            </div>

            <div class="stat-card">
                <span class="stat-card-label">Cortes completados</span>
                <h3 class="stat-card-value">${completadas}</h3>
                <p class="stat-card-description">Servicios realizados</p>
            </div>

        </div>

        <div class="dashboard-panel">

            <h3 class="panel-title">Mis próximas reservas</h3>

            ${crearTablaReservasBarbero(
        misReservas.filter(reserva =>
            reserva.estado === "Pendiente" ||
            reserva.estado === "Confirmada"
        ).slice(0, 5),
        false
    )}

        </div>
    `;
}


// ==========================================
// 4. MIS CORTES
// ==========================================

function mostrarCortesBarbero(barbero) {

    const reservas = obtenerDatos("fadexReservas");

    const misCortes = reservas.filter(
        reserva =>
            Number(reserva.barberoId) === Number(barbero.id) &&
            reserva.estado === "Completada"
    );

    const totalGenerado = misCortes.reduce(
        (total, reserva) => total + Number(reserva.precio),
        0
    );

    return `
        <h2 class="dashboard-title">Mis cortes</h2>

        <p class="dashboard-subtitle">
            Historial de los servicios que has realizado.
        </p>

        <div class="stats-grid">

            <div class="stat-card">
                <span class="stat-card-label">Servicios completados</span>
                <h3 class="stat-card-value">${misCortes.length}</h3>
            </div>

            <div class="stat-card">
                <span class="stat-card-label">Valor de servicios</span>
                <h3 class="stat-card-value">
                    S/ ${totalGenerado.toFixed(2)}
                </h3>
            </div>

        </div>

        <div class="dashboard-panel">

            <h3 class="panel-title">Historial de cortes</h3>

            ${crearTablaReservasBarbero(misCortes, false)}

        </div>
    `;
}


// ==========================================
// 5. MIS RESERVAS
// ==========================================

function mostrarReservasBarbero(barbero) {

    const reservas = obtenerDatos("fadexReservas");

    const misReservas = reservas.filter(
        reserva => Number(reserva.barberoId) === Number(barbero.id)
    );

    return `
        <h2 class="dashboard-title">Mis reservas</h2>

        <p class="dashboard-subtitle">
            Consulta tus citas y actualiza su estado.
        </p>

        <div class="dashboard-panel">

            <h3 class="panel-title">Citas asignadas</h3>

            ${crearTablaReservasBarbero(misReservas, true)}

        </div>
    `;
}


// ==========================================
// 6. TABLA DE RESERVAS DEL BARBERO
// ==========================================


function crearTablaReservasBarbero(reservas, mostrarAcciones) {

    if (reservas.length === 0) {
        return `
            <p>No tienes reservas en esta sección.</p>
        `;
    }

    return `
        <div class="table-container">

            <table class="dashboard-table">

                <thead>
                    <tr>
                        <th>Cliente</th>
                        <th>Servicio</th>
                        <th>Duración</th>
                        <th>Fecha de reserva</th>
                        <th>Fecha de atención</th>
                        <th>Hora de atención</th>
                        <th>Precio</th>
                        <th>Estado</th>
                        ${mostrarAcciones ? "<th>Acciones</th>" : ""}
                    </tr>
                </thead>

                <tbody>

                    ${reservas.map(reserva => `

                        <tr>

                            <td>${reserva.cliente}</td>

                            <td>${reserva.servicio}</td>

                            <td>${Number(reserva.duracion || 30)} minutos</td>

                            <td>
                                ${reserva.fechaReserva
            ? formatearFechaBarbero(reserva.fechaReserva)
            : "No registrada"}
                            </td>

                            <td>
                                ${formatearFechaBarbero(reserva.fecha)}
                            </td>

                            <td>${reserva.hora}</td>

                            <td>
                                S/ ${Number(reserva.precio).toFixed(2)}
                            </td>

                            <td>
                                <span class="status ${obtenerClaseEstadoBarbero(reserva.estado)}">
                                    ${reserva.estado}
                                </span>
                            </td>

                            ${mostrarAcciones ? `
                                <td>
                                    ${crearAccionesReservaBarbero(reserva)}
                                </td>
                            ` : ""}

                        </tr>

                    `).join("")}

                </tbody>

            </table>

        </div>
    `;
}



// ==========================================
// 7. BOTONES PARA ACTUALIZAR RESERVAS
// ==========================================

function crearAccionesReservaBarbero(reserva) {

    if (
        reserva.estado === "Completada" ||
        reserva.estado === "Cancelada"
    ) {
        return `<span class="texto-gris">Sin acciones</span>`;
    }

    return `
        <button
            class="dashboard-button"
            onclick="actualizarEstadoReservaBarbero(${reserva.id}, 'Completada')">

            Completar

        </button>

        <button
            class="btn-secundario"
            onclick="actualizarEstadoReservaBarbero(${reserva.id}, 'Cancelada')">

            Cancelar

        </button>
    `;
}


// ==========================================
// 8. ACTUALIZAR ESTADO DE UNA RESERVA
// ==========================================


function actualizarEstadoReservaBarbero(id, nuevoEstado) {

    const reservas = obtenerDatos("fadexReservas");

    const reserva = reservas.find(
        item => Number(item.id) === Number(id)
    );

    if (!reserva) {
        alert("No se encontró la reserva.");
        return;
    }

    const barbero = obtenerBarberoActual();

    // Comprobar que la reserva pertenezca al barbero actual.
    if (
        !barbero ||
        Number(reserva.barberoId) !== Number(barbero.id)
    ) {
        alert("No puedes modificar esta reserva.");
        return;
    }

    // Comprobar que el nuevo estado sea válido.
    const estadosPermitidos = ["Completada", "Cancelada"];

    if (!estadosPermitidos.includes(nuevoEstado)) {
        alert("El estado seleccionado no es válido.");
        return;
    }

    // No permitir modificar reservas que ya finalizaron.
    if (
        reserva.estado === "Completada" ||
        reserva.estado === "Cancelada"
    ) {
        alert("Esta reserva ya fue finalizada y no puede modificarse.");
        return;
    }

    const confirmar = confirm(
        `¿Deseas cambiar el estado de esta reserva a "${nuevoEstado}"?`
    );

    if (!confirmar) return;

    reserva.estado = nuevoEstado;

    guardarDatos("fadexReservas", reservas);

    alert("El estado de la reserva fue actualizado.");

    navegarDashboard("reservas");
}



// ==========================================
// 9. VENTAS
// ==========================================


function mostrarVentasBarbero(barbero) {

    const ventas = obtenerDatos("fadexVentas");

    // Mostrar las ventas de este barbero.
    // También conservamos los registros antiguos que no tienen barberoId.
    const misVentas = ventas.filter(
        venta =>
            !venta.barberoId &&
            Number(venta.barberoId) === Number(barbero.id)
    );

    const totalVentas = misVentas.reduce(
        (total, venta) => total + Number(venta.total || 0),
        0
    );

    return `
        <h2 class="dashboard-title">Mis ventas</h2>

        <p class="dashboard-subtitle">
            Registra productos vendidos y consulta tus ventas.
        </p>

        <div class="stats-grid">

            <div class="stat-card">
                <span class="stat-card-label">Ventas registradas</span>
                <h3 class="stat-card-value">${misVentas.length}</h3>
                <p class="stat-card-description">Operaciones realizadas</p>
            </div>

            <div class="stat-card">
                <span class="stat-card-label">Total vendido</span>
                <h3 class="stat-card-value">
                    S/ ${totalVentas.toFixed(2)}
                </h3>
                <p class="stat-card-description">Importe acumulado</p>
            </div>

        </div>

        <div class="dashboard-panel">

            <h3 class="panel-title">Registrar venta de producto</h3>

            ${crearFormularioVentaBarbero()}

        </div>

        <div class="dashboard-panel">

            <h3 class="panel-title">Historial de ventas</h3>

            ${crearTablaVentasBarbero(misVentas)}

        </div>
    `;
}


// ==========================================
// FORMULARIO DE VENTA
// ==========================================

function crearFormularioVentaBarbero() {

    const productos = obtenerDatos("fadexProductos").filter(
        producto => producto.estado === "Disponible"
    );

    if (productos.length === 0) {
        return "<p>No hay productos disponibles en el catálogo.</p>";
    }

    return `
        <form class="dashboard-form"
            onsubmit="registrarVentaProductoBarbero(event)">

            <div class="dashboard-form-group">

                <label for="producto-venta">Producto</label>

                <select id="producto-venta" required>

                    <option value="">Selecciona un producto</option>

                    ${productos.map(producto => `
                        <option
                            value="${producto.id}"
                            ${Number(producto.stock) <= 0 ? "disabled" : ""}>

                            ${producto.nombre} -
                            S/ ${Number(producto.precio).toFixed(2)}
                            (Stock: ${producto.stock})

                        </option>
                    `).join("")}

                </select>

            </div>

            <div class="dashboard-form-group">

                <label for="cantidad-venta">Cantidad</label>

                <input
                    type="number"
                    id="cantidad-venta"
                    min="1"
                    step="1"
                    value="1"
                    required>

            </div>

            <div class="dashboard-form-group">

                <label for="cliente-venta">Nombre del cliente</label>

                <input
                    type="text"
                    id="cliente-venta"
                    placeholder="Ej. Carlos Mendoza">

            </div>

            <div class="dashboard-form-group">

                <label for="metodo-pago-venta">Método de pago</label>

                <select id="metodo-pago-venta" required>

                    <option value="">Selecciona un método</option>
                    <option value="Efectivo">Efectivo</option>
                    <option value="Yape">Yape</option>
                    <option value="Plin">Plin</option>
                    <option value="Tarjeta">Tarjeta</option>

                </select>

            </div>

            <button type="submit" class="dashboard-button">
                Registrar venta
            </button>

        </form>
    `;
}


// ==========================================
// REGISTRAR VENTA Y DESCONTAR INVENTARIO
// ==========================================

function registrarVentaProductoBarbero(event) {

    event.preventDefault();

    const barbero = obtenerBarberoActual();

    if (!barbero) {
        alert("No se pudo identificar al barbero.");
        return;
    }

    const productoId = Number(
        document.getElementById("producto-venta").value
    );

    const cantidad = Number(
        document.getElementById("cantidad-venta").value
    );

    const cliente =
        document.getElementById("cliente-venta").value.trim()
        || "Venta directa";

    const metodoPago =
        document.getElementById("metodo-pago-venta").value;

    if (
        !productoId ||
        !Number.isInteger(cantidad) ||
        cantidad <= 0 ||
        !metodoPago
    ) {
        alert("Completa los datos de la venta correctamente.");
        return;
    }

    const productos = obtenerDatos("fadexProductos");

    const producto = productos.find(
        item => Number(item.id) === productoId
    );

    if (!producto) {
        alert("El producto ya no está disponible.");
        return;
    }

    if (producto.estado !== "Disponible") {
        alert("El producto está desactivado.");
        return;
    }

    const stockActual = Number(producto.stock);

    if (!Number.isInteger(stockActual) || stockActual < cantidad) {
        alert("No hay suficiente stock para realizar esta venta.");
        return;
    }

    const precioUnitario = Number(producto.precio);

    if (!Number.isFinite(precioUnitario) || precioUnitario <= 0) {
        alert("El precio del producto no es válido.");
        return;
    }

    const total = precioUnitario * cantidad;

    const confirmar = confirm(
        `¿Registrar ${cantidad} unidad(es) de ${producto.nombre} por S/ ${total.toFixed(2)}?`
    );

    if (!confirmar) {
        return;
    }

    // Descontar el inventario.
    producto.stock = stockActual - cantidad;

    guardarDatos("fadexProductos", productos);

    // Crear el registro de venta.
    const ventas = obtenerDatos("fadexVentas");

    const nuevaVenta = {

        id: Date.now(),

        tipo: "Producto",

        productoId: producto.id,
        descripcion: producto.nombre,

        cantidad: cantidad,
        precioUnitario: precioUnitario,

        cliente: cliente,

        barberoId: barbero.id,
        barbero: barbero.nombre,

        fecha: obtenerFechaVentaLocal(),

        metodoPago: metodoPago,

        total: total
    };

    ventas.push(nuevaVenta);

    guardarDatos("fadexVentas", ventas);

    alert("¡Venta registrada y stock actualizado correctamente!");

    navegarDashboard("ventas");
}


// ==========================================
// TABLA DE VENTAS DEL BARBERO
// ==========================================

function crearTablaVentasBarbero(ventas) {

    if (ventas.length === 0) {
        return "<p>Todavía no hay ventas registradas.</p>";
    }

    return `
        <div class="table-container">

            <table class="dashboard-table">

                <thead>
                    <tr>
                        <th>Producto o servicio</th>
                        <th>Cliente</th>
                        <th>Fecha</th>
                        <th>Método de pago</th>
                        <th>Total</th>
                    </tr>
                </thead>

                <tbody>

                    ${ventas.map(venta => `
                        <tr>
                            <td>${venta.descripcion || venta.producto || venta.servicio || "Venta"}</td>
                            <td>${venta.cliente || "No registrado"}</td>
                            <td>${formatearFechaBarbero(venta.fecha)}</td>
                            <td>${venta.metodoPago}</td>
                            <td>S/ ${Number(venta.total || 0).toFixed(2)}</td>
                        </tr>
                    `).join("")}

                </tbody>

            </table>

        </div>
    `;
}


// ==========================================
// FECHA LOCAL DE LA VENTA
// ==========================================

function obtenerFechaVentaLocal() {

    const fecha = new Date();

    const anio = fecha.getFullYear();

    const mes = String(fecha.getMonth() + 1).padStart(2, "0");

    const dia = String(fecha.getDate()).padStart(2, "0");

    return `${anio}-${mes}-${dia}`;
}



// ==========================================
// 10. MI PERFIL
// ==========================================

function mostrarPerfilBarbero(barbero) {

    return `
        <h2 class="dashboard-title">Mi perfil</h2>

        <p class="dashboard-subtitle">
            Información de tu cuenta de barbero.
        </p>

        <div class="dashboard-panel">

            <div class="dashboard-form">

                <div class="dashboard-form-group">
                    <label>Nombre completo</label>
                    <input
                        type="text"
                        value="${barbero.nombre}"
                        disabled>
                </div>

                <div class="dashboard-form-group">
                    <label>Correo electrónico</label>
                    <input
                        type="email"
                        value="${barbero.correo}"
                        disabled>
                </div>

                <div class="dashboard-form-group">
                    <label>Teléfono</label>
                    <input
                        type="text"
                        value="${barbero.telefono}"
                        disabled>
                </div>

                <div class="dashboard-form-group">
                    <label>Especialidad</label>
                    <input
                        type="text"
                        value="${barbero.especialidad}"
                        disabled>
                </div>

                <div class="dashboard-form-group">
                    <label>Estado</label>
                    <input
                        type="text"
                        value="${barbero.estado}"
                        disabled>
                </div>

            </div>

        </div>
    `;
}


// ==========================================
// 11. CLASES DE ESTADO
// ==========================================

function obtenerClaseEstadoBarbero(estado) {

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
// ==========================================
// FORMATEAR FECHAS DEL BARBERO
// ==========================================

function formatearFechaBarbero(fecha) {

    if (!fecha) return "No disponible";

    const [anio, mes, dia] = fecha.split("-");

    return `${dia}/${mes}/${anio}`;
}