
// ==========================================
// FADEX - PANEL DEL CLIENTE
// ==========================================


// ==========================================
// 1. OBTENER CLIENTE ACTUAL
// ==========================================

function obtenerClienteActual() {

    const usuarioGuardado = localStorage.getItem("fadexUsuario");

    if (!usuarioGuardado) return null;

    const usuario = JSON.parse(usuarioGuardado);

    const clientes = obtenerDatos("fadexClientes");

    // Buscar al cliente por su correo.
    let cliente = clientes.find(
        item => item.correo.toLowerCase() ===
            usuario.correo.toLowerCase()
    );

    // Si no existe, registrarlo automáticamente
    // para permitir probar el prototipo con cualquier correo.
    if (!cliente) {

        cliente = {
            id: Date.now(),
            nombre: usuario.nombre,
            correo: usuario.correo,
            telefono: "No registrado"
        };

        clientes.push(cliente);

        guardarDatos("fadexClientes", clientes);
    }

    return cliente;
}


// ==========================================
// 2. FUNCIÓN PRINCIPAL
// ==========================================

function obtenerContenidoCliente(pagina) {

    const cliente = obtenerClienteActual();

    if (!cliente) {
        return `
            <div class="dashboard-panel">
                <h3 class="panel-title">No se pudo identificar al cliente</h3>
                <p>Vuelve a iniciar sesión.</p>
            </div>
        `;
    }

    switch (pagina) {

        case "resumen":
            return mostrarResumenCliente(cliente);

        case "agendar":
            return mostrarAgendarCliente(cliente);

        case "reservas":
            return mostrarReservasCliente(cliente);

        case "analisis":
            return mostrarAnalisisCliente();

        case "historial":
            return mostrarHistorialCliente(cliente);

        case "fidelizacion":
            return mostrarFidelizacionCliente(cliente);

        case "perfil":
            return mostrarPerfilCliente(cliente);

        default:
            return `
                <div class="dashboard-panel">
                    <h3 class="panel-title">Módulo no encontrado</h3>
                </div>
            `;
    }
}


// ==========================================
// 3. OBTENER RESERVAS DEL CLIENTE
// ==========================================

function obtenerReservasCliente(cliente) {

    const reservas = obtenerDatos("fadexReservas");

    return reservas.filter(
        reserva => Number(reserva.clienteId) === Number(cliente.id)
    );
}


// ==========================================
// 4. DASHBOARD DEL CLIENTE
// ==========================================

function mostrarResumenCliente(cliente) {

    const reservas = obtenerReservasCliente(cliente);

    const pendientes = reservas.filter(
        reserva => reserva.estado === "Pendiente"
    ).length;

    const confirmadas = reservas.filter(
        reserva => reserva.estado === "Confirmada"
    ).length;

    const completadas = reservas.filter(
        reserva => reserva.estado === "Completada"
    ).length;

    // Obtener todas las reservas pendientes o confirmadas
    const proximasReservas = reservas.filter(reserva =>
        reserva.estado === "Pendiente" ||
        reserva.estado === "Confirmada"
    );

    // Ordenarlas por fecha y hora
    proximasReservas.sort((a, b) => {

        const fechaA = new Date(`${a.fecha}T${a.hora}:00`);
        const fechaB = new Date(`${b.fecha}T${b.hora}:00`);

        return fechaA - fechaB;
    });

    // Mostrar la más cercana, aunque ya haya pasado la hora
    const proximaReserva = proximasReservas[0];

    return `
        <h2 class="dashboard-title">
            ¡Bienvenido, ${cliente.nombre}!
        </h2>

        <p class="dashboard-subtitle">
            Este es tu espacio personal en FadeX.
        </p>

        <div class="stats-grid">

            <div class="stat-card">
                <span class="stat-card-label">Mis reservas</span>
                <h3 class="stat-card-value">${reservas.length}</h3>
                <p class="stat-card-description">Citas registradas</p>
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
                <span class="stat-card-label">Cortes realizados</span>
                <h3 class="stat-card-value">${completadas}</h3>
                <p class="stat-card-description">Servicios completados</p>
            </div>

        </div>

        <div class="dashboard-panel">

            <h3 class="panel-title">Mi próxima cita</h3>

            ${proximaReserva
            ? `
                    <p><strong>Servicio:</strong> ${proximaReserva.servicio}</p>
                    <p><strong>Barbero:</strong> ${proximaReserva.barbero}</p>
                    <p><strong>Fecha de reserva:</strong>
                        ${proximaReserva.fechaReserva
                ? formatearFechaCliente(proximaReserva.fechaReserva)
                : "No registrada"}
                    </p>
                    
                    <p><strong>Fecha de atención:</strong>
                        ${formatearFechaCliente(proximaReserva.fecha)}
                    </p>

                    <p><strong>Hora de atención:</strong> ${proximaReserva.hora}</p>

                    <p><strong>Duración:</strong>
                        ${Number(proximaReserva.duracion || 30)} minutos
                    </p>
                    <p><strong>Estado:</strong> ${proximaReserva.estado}</p>
                `
            : `
                    <p>No tienes citas pendientes.</p>

                    <button class="dashboard-button"
                        onclick="navegarDashboard('agendar')">
                        Agendar una cita
                    </button>
                `
        }

        </div>
    `;
}


// ==========================================
// 5. AGENDAR UNA CITA
// ==========================================

function mostrarAgendarCliente(cliente) {

    const servicios = obtenerDatos("fadexServicios").filter(
        servicio => !servicio.estado || servicio.estado === "Activo"
    );

    const barberos = obtenerDatos("fadexBarberos").filter(
        barbero => !barbero.estado || barbero.estado === "Activo"
    );

    const fechaActual = obtenerFechaLocal();

    return `
        <h2 class="dashboard-title">Agendar una cita</h2>

        <p class="dashboard-subtitle">
            Selecciona el servicio, barbero y horario que prefieras.
        </p>

        <div class="dashboard-panel">

            <h3 class="panel-title">Nueva reserva</h3>

            <form class="dashboard-form"
                onsubmit="registrarReservaCliente(event)">

                <div class="dashboard-form-group">

                    <label>Cliente</label>

                    <input
                        type="text"
                        value="${cliente.nombre}"
                        disabled>

                </div>


                <div class="dashboard-form-group">

                    <label for="servicio-reserva">Servicio</label>

                    <select
                        id="servicio-reserva"
                        name="servicio"
                        required>

                        <option value="">Selecciona un servicio</option>

                        ${servicios.map(servicio => `
                        <option value="${servicio.id}">
                            ${servicio.nombre} -
                            S/ ${Number(servicio.precio).toFixed(2)} -
                            ${Number(servicio.duracion || 30)} minutos
                        </option>
                    `).join("")}

                    </select>

                </div>


                <div class="dashboard-form-group">

                    <label for="barbero-reserva">Barbero</label>

                    <select
                        id="barbero-reserva"
                        name="barbero"
                        required>

                        <option value="">Selecciona un barbero</option>

                        ${barberos.map(barbero => `
                            <option value="${barbero.id}">
                                ${barbero.nombre} -
                                ${barbero.especialidad}
                            </option>
                        `).join("")}

                    </select>

                </div>


                <div class="dashboard-form-group">

                    <label for="fecha-reserva">Selecciona la fecha de tu cita</label>

                    <input
                        type="date"
                        id="fecha-reserva"
                        name="fecha"
                        min="${fechaActual}"
                        required
                        onclick="this.showPicker()">

                </div>


                <div class="dashboard-form-group">

                    <label for="hora-reserva">Hora</label>

                    <select
                        id="hora-reserva"
                        name="hora"
                        required>

                        <option value="">Selecciona una hora</option>

                        ${Array.from({ length: 55 }, (_, i) => {
        const minutosTotales = 9 * 60 + i * 10;
        const horas = Math.floor(minutosTotales / 60);
        const minutos = minutosTotales % 60;

        const hora = `${String(horas).padStart(2, "0")}:${String(minutos).padStart(2, "0")}`;

        return `<option value="${hora}">${hora}</option>`;
    }).join("")}

                    </select>

                </div>


                <button type="submit" class="dashboard-button">
                    Confirmar reserva
                </button>

            </form>

        </div>
    `;
}


// ==========================================
// 6. REGISTRAR RESERVA
// ==========================================

function registrarReservaCliente(event) {

    event.preventDefault();

    const cliente = obtenerClienteActual();

    if (!cliente) {
        alert("No se pudo identificar al cliente.");
        return;
    }

    const formulario = event.target;

    const servicioId = Number(
        formulario.querySelector("#servicio-reserva").value
    );

    const barberoId = Number(
        formulario.querySelector("#barbero-reserva").value
    );

    const fecha = formulario.querySelector("#fecha-reserva").value;

    const hora = formulario.querySelector("#hora-reserva").value;

    const servicios = obtenerDatos("fadexServicios");

    const barberos = obtenerDatos("fadexBarberos");

    const servicio = servicios.find(
        item =>
            Number(item.id) === servicioId &&
            (!item.estado || item.estado === "Activo")
    );

    const barbero = barberos.find(
        item =>
            Number(item.id) === barberoId &&
            (!item.estado || item.estado === "Activo")
    );

    if (!servicio || !barbero || !fecha || !hora) {
        alert("Completa todos los campos correctamente.");
        return;
    }

    if (fecha < obtenerFechaLocal()) {
        alert("No puedes reservar en una fecha pasada.");
        return;
    }

    const reservas = obtenerDatos("fadexReservas");

    // ==========================================
    // VERIFICAR DISPONIBILIDAD DEL BARBERO
    // ==========================================

    const duracionNueva = Number(servicio.duracion || 30);

    const horarioOcupado = reservas.some(reserva => {

        // Solo revisar reservas del mismo barbero y fecha.
        if (
            Number(reserva.barberoId) !== barberoId ||
            reserva.fecha !== fecha
        ) {
            return false;
        }

        // Las reservas canceladas o completadas no bloquean horarios.
        if (
            reserva.estado !== "Pendiente" &&
            reserva.estado !== "Confirmada"
        ) {
            return false;
        }

        // Compatibilidad con reservas antiguas que no tengan duración.
        const duracionExistente = Number(reserva.duracion || 30);

        return existeCruceHorario(
            hora,
            duracionNueva,
            reserva.hora,
            duracionExistente
        );
    });

    if (horarioOcupado) {
        alert(
            "Ese horario se cruza con otra reserva del barbero. Selecciona otro horario."
        );
        return;
    }

    const nuevaReserva = {
        id: Date.now(),

        // Fecha en que el cliente registró la reserva.
        fechaReserva: obtenerFechaLocal(),

        clienteId: cliente.id,
        cliente: cliente.nombre,

        barberoId: barbero.id,
        barbero: barbero.nombre,

        servicioId: servicio.id,
        servicio: servicio.nombre,

        fecha: fecha,
        hora: hora,

        precio: Number(servicio.precio),
        duracion: Number(servicio.duracion || 30),

        estado: "Pendiente"
    };

    reservas.push(nuevaReserva);

    guardarDatos("fadexReservas", reservas);

    alert("¡Tu reserva fue registrada correctamente!");

    navegarDashboard("reservas");
}


// ==========================================
// 7. MIS RESERVAS
// ==========================================

function mostrarReservasCliente(cliente) {

    const reservas = obtenerReservasCliente(cliente);

    return `
        <h2 class="dashboard-title">Mis reservas</h2>

        <p class="dashboard-subtitle">
            Consulta las citas que has registrado.
        </p>

        <div class="dashboard-panel">

            <div class="dashboard-toolbar">

                <h3 class="panel-title">Historial de reservas</h3>

                <button class="dashboard-button"
                    onclick="navegarDashboard('agendar')">

                    + Nueva cita

                </button>

            </div>

            ${crearTablaReservasCliente(reservas)}

        </div>
    `;
}


// ==========================================
// 8. TABLA DE RESERVAS DEL CLIENTE
// ==========================================

function crearTablaReservasCliente(reservas) {

    if (reservas.length === 0) {
        return "<p>Todavía no tienes reservas registradas.</p>";
    }

    return `
        <div class="table-container">

            <table class="dashboard-table">

                <thead>
                    <tr>
                        <th>Servicio</th>
                        <th>Duración</th>
                        <th>Barbero</th>
                        <th>Fecha de reserva</th>
                        <th>Fecha de atención</th>
                        <th>Hora de atención</th>
                        <th>Precio</th>
                        <th>Estado</th>
                        <th>Acción</th>
                    </tr>
                </thead>

                <tbody>

                    ${reservas.map(reserva => `

                        <tr>

                            <td>${reserva.servicio}</td>

                            <td>${Number(reserva.duracion || 30)} minutos</td>

                            <td>${reserva.barbero}</td>

                            <td>
                                ${reserva.fechaReserva
            ? formatearFechaCliente(reserva.fechaReserva)
            : "No registrada"}
                            </td>

                            <td>${formatearFechaCliente(reserva.fecha)}</td>

                            <td>${reserva.hora}</td>

                            <td>S/ ${Number(reserva.precio).toFixed(2)}</td>

                            <td>
                                <span class="status ${obtenerClaseEstadoCliente(reserva.estado)}">
                                    ${reserva.estado}
                                </span>
                            </td>

                            <td>
                                ${reserva.estado === "Pendiente" ||
            reserva.estado === "Confirmada"
            ? `
                                        <button
                                            class="btn-secundario"
                                            onclick="cancelarReservaCliente(${reserva.id})">

                                            Cancelar

                                        </button>
                                    `
            : `<span class="texto-gris">Sin acciones</span>`
        }
                            </td>

                        </tr>

                    `).join("")}

                </tbody>

            </table>

        </div>
    `;
}


// ==========================================
// 9. CANCELAR RESERVA
// ==========================================

function cancelarReservaCliente(id) {

    const confirmar = confirm(
        "¿Estás seguro de que deseas cancelar esta reserva?"
    );

    if (!confirmar) return;

    const cliente = obtenerClienteActual();

    const reservas = obtenerDatos("fadexReservas");

    const reserva = reservas.find(
        item => Number(item.id) === Number(id)
    );

    if (!reserva) {
        alert("No se encontró la reserva.");
        return;
    }

    // Verificar que la reserva pertenezca al cliente.
    if (
        !cliente ||
        Number(reserva.clienteId) !== Number(cliente.id)
    ) {
        alert("No puedes cancelar esta reserva.");
        return;
    }

    if (
        reserva.estado !== "Pendiente" &&
        reserva.estado !== "Confirmada"
    ) {
        alert("Esta reserva ya no se puede cancelar.");
        return;
    }

    reserva.estado = "Cancelada";

    guardarDatos("fadexReservas", reservas);

    alert("La reserva fue cancelada.");

    navegarDashboard("reservas");
}


// ==========================================
// 10. ANÁLISIS FACIAL
// ==========================================

function mostrarAnalisisCliente() {

    return `
        <h2 class="dashboard-title">Análisis facial</h2>

        <p class="dashboard-subtitle">
            Descubre recomendaciones de estilos de corte.
        </p>

        <div class="dashboard-panel">

            <h3 class="panel-title">Analiza tu estilo</h3>

            <p>
                En esta sección se podrá incorporar una herramienta
                de análisis facial para recomendar cortes de cabello
                según las características del rostro.
            </p>

            <div class="dashboard-form-group">

                <label for="tipo-rostro">Selecciona tu tipo de rostro</label>

                <select id="tipo-rostro">

                    <option value="">Selecciona una opción</option>
                    <option value="Ovalado">Ovalado</option>
                    <option value="Redondo">Redondo</option>
                    <option value="Cuadrado">Cuadrado</option>
                    <option value="Alargado">Alargado</option>
                    <option value="Diamante">Diamante</option>

                </select>

            </div>

            <button class="dashboard-button"
                onclick="recomendarCorte()">

                Obtener recomendación

            </button>

            <div id="resultado-analisis"></div>

        </div>
    `;
}


function recomendarCorte() {

    const tipo = document.getElementById("tipo-rostro").value;

    const resultado = document.getElementById("resultado-analisis");

    if (!tipo) {
        alert("Selecciona un tipo de rostro.");
        return;
    }

    const recomendaciones = {

        Ovalado: "Puedes probar un corte clásico, degradado o crop.",

        Redondo: "Puedes probar un degradado alto con volumen superior.",

        Cuadrado: "Puedes probar un corte clásico o un degradado bajo.",

        Alargado: "Puedes probar un corte con volumen moderado y laterales equilibrados.",

        Diamante: "Puedes probar un corte texturizado o un flequillo."
    };

    resultado.innerHTML = `
        <div class="dashboard-panel">

            <h3 class="panel-title">Tu recomendación</h3>

            <p><strong>Tipo de rostro:</strong> ${tipo}</p>

            <p>${recomendaciones[tipo]}</p>

        </div>
    `;
}


// ==========================================
// 11. HISTORIAL DE CORTES
// ==========================================

function mostrarHistorialCliente(cliente) {

    const reservas = obtenerReservasCliente(cliente);

    const historial = reservas.filter(
        reserva => reserva.estado === "Completada"
    );

    return `
        <h2 class="dashboard-title">Mi historial</h2>

        <p class="dashboard-subtitle">
            Consulta los servicios que has recibido en FadeX.
        </p>

        <div class="dashboard-panel">

            <h3 class="panel-title">Servicios completados</h3>

            ${crearTablaHistorialCliente(historial)}

        </div>
    `;
}


function crearTablaHistorialCliente(historial) {

    if (historial.length === 0) {
        return "<p>Aún no tienes servicios completados.</p>";
    }

    return `
        <div class="table-container">

            <table class="dashboard-table">

                <thead>
                    <tr>
                        <th>Servicio</th>
                        <th>Barbero</th>
                        <th>Fecha</th>
                        <th>Precio</th>
                    </tr>
                </thead>

                <tbody>

                    ${historial.map(reserva => `

                        <tr>
                            <td>${reserva.servicio}</td>
                            <td>${reserva.barbero}</td>
                            <td>${reserva.fecha}</td>
                            <td>S/ ${Number(reserva.precio).toFixed(2)}</td>
                        </tr>

                    `).join("")}

                </tbody>

            </table>

        </div>
    `;
}


// ==========================================
// 12. FIDELIZACIÓN
// ==========================================

function mostrarFidelizacionCliente(cliente) {

    const reservas = obtenerReservasCliente(cliente);

    const completadas = reservas.filter(
        reserva => reserva.estado === "Completada"
    ).length;

    // Cada servicio completado otorga 10 puntos.
    const puntos = completadas * 10;

    return `
        <h2 class="dashboard-title">Mi fidelización</h2>

        <p class="dashboard-subtitle">
            Acumula puntos por cada servicio completado.
        </p>

        <div class="dashboard-panel">

            <h3 class="panel-title">Mis puntos FadeX</h3>

            <div class="stats-grid">

                <div class="stat-card">

                    <span class="stat-card-label">Puntos acumulados</span>

                    <h3 class="stat-card-value">${puntos}</h3>

                    <p class="stat-card-description">
                        10 puntos por cada servicio completado.
                    </p>

                </div>

                <div class="stat-card">

                    <span class="stat-card-label">Servicios realizados</span>

                    <h3 class="stat-card-value">${completadas}</h3>

                </div>

            </div>

            <p>
                Sigue visitando FadeX para acumular puntos
                y acceder a futuras recompensas.
            </p>

        </div>
    `;
}


// ==========================================
// 13. MI PERFIL
// ==========================================

function mostrarPerfilCliente(cliente) {

    return `
        <h2 class="dashboard-title">Mi perfil</h2>

        <p class="dashboard-subtitle">
            Consulta tu información personal.
        </p>

        <div class="dashboard-panel">

            <div class="dashboard-form">

                <div class="dashboard-form-group">

                    <label>Nombre completo</label>

                    <input
                        type="text"
                        value="${cliente.nombre}"
                        disabled>

                </div>

                <div class="dashboard-form-group">

                    <label>Correo electrónico</label>

                    <input
                        type="email"
                        value="${cliente.correo}"
                        disabled>

                </div>

                <div class="dashboard-form-group">

                    <label>Teléfono</label>

                    <input
                        type="text"
                        value="${cliente.telefono}"
                        disabled>

                </div>

            </div>

        </div>
    `;
}


// ==========================================
// 14. FUNCIONES AUXILIARES
// ==========================================

function obtenerClaseEstadoCliente(estado) {

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
// DETECTAR CRUCE ENTRE DOS RESERVAS
// ==========================================

function existeCruceHorario(horaInicio1, duracion1, horaInicio2, duracion2) {

    // Convertir las horas HH:MM a minutos.
    function convertirAMinutos(hora) {
        const [horas, minutos] = hora.split(":").map(Number);
        return horas * 60 + minutos;
    }

    const inicio1 = convertirAMinutos(horaInicio1);
    const fin1 = inicio1 + duracion1;

    const inicio2 = convertirAMinutos(horaInicio2);
    const fin2 = inicio2 + duracion2;

    // Comprobar si los horarios se superponen.
    return inicio1 < fin2 && inicio2 < fin1;
}

// Obtener fecha local en formato YYYY-MM-DD.
// Evita problemas con la conversión de zonas horarias.

function obtenerFechaLocal() {

    const fecha = new Date();

    const anio = fecha.getFullYear();

    const mes = String(fecha.getMonth() + 1).padStart(2, "0");

    const dia = String(fecha.getDate()).padStart(2, "0");

    return `${anio}-${mes}-${dia}`;
}
function formatearFechaCliente(fecha) {

    if (!fecha) return "No disponible";

    const [anio, mes, dia] = fecha.split("-");

    return `${dia}/${mes}/${anio}`;
}