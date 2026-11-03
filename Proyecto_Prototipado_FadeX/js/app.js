
/* =========================================
   FADEX - CONTROL GENERAL DEL SISTEMA
========================================= */


// =========================================
// CONFIGURACION DE LOS ROLES
// =========================================

const menusRoles = {

    admin: [
        { nombre: "Resumen", pagina: "resumen" },

        { nombre: "Reservas", pagina: "reservas" },
        { nombre: "Ventas", pagina: "ventas" },
        { nombre: "Reclamos", pagina: "reclamos" },

        { nombre: "Clientes", pagina: "clientes" },
        { nombre: "Barberos", pagina: "barberos" },
        { nombre: "Usuarios", pagina: "usuarios" },
        { nombre: "Sueldos", pagina: "sueldos" },

        { nombre: "Categorías", pagina: "categorias" },
        { nombre: "Servicios", pagina: "catalogo" },
        { nombre: "Productos", pagina: "catalogo" },

        { nombre: "Seguimiento", pagina: "fidelizacion" },
        { nombre: "Ruletas", pagina: "ruletas" },
        { nombre: "Reglas", pagina: "reglas" },

        { nombre: "Reportes", pagina: "reportes" },
        { nombre: "Métricas", pagina: "metricas" },
        { nombre: "Predicciones", pagina: "predicciones" },

        { nombre: "Configuración", pagina: "configuracion" },
        { nombre: "Perfil", pagina: "perfil" }
    ],

    barbero: [
        { nombre: "Dashboard", icono: "▦", pagina: "resumen" },
        { nombre: "Mis cortes", icono: "✂", pagina: "cortes" },
        { nombre: "Mis reservas", icono: "▣", pagina: "reservas" },
        { nombre: "Ventas", icono: "▤", pagina: "ventas" },
        { nombre: "Mi perfil", icono: "♙", pagina: "perfil" }
    ],

    cliente: [
        { nombre: "Mi dashboard", icono: "▦", pagina: "resumen" },
        { nombre: "Agendar cita", icono: "＋", pagina: "agendar" },
        { nombre: "Mis reservas", icono: "▣", pagina: "reservas" },
        { nombre: "Análisis facial", icono: "◎", pagina: "analisis" },
        { nombre: "Mi historial", icono: "◷", pagina: "historial" },
        { nombre: "Fidelización", icono: "☆", pagina: "fidelizacion" },
        { nombre: "Mi perfil", icono: "♙", pagina: "perfil" }
    ]

};
// =========================================
// BARRA LATERAL DEL ADMINISTRADOR
// =========================================

function crearSidebarAdmin() {

    const grupos = [

        {
            id: "operaciones",
            nombre: "Operaciones",
            icono: "fa-calendar-check",
            opciones: [
                { nombre: "Reservas", pagina: "reservas", icono: "fa-calendar-days" },
                { nombre: "Ventas", pagina: "ventas", icono: "fa-cash-register" },
                { nombre: "Reclamos", pagina: "reclamos", icono: "fa-comment-dots" }
            ]
        },

        {
            id: "gestion",
            nombre: "Gestión",
            icono: "fa-users",
            opciones: [
                { nombre: "Clientes", pagina: "clientes", icono: "fa-user" },
                { nombre: "Barberos", pagina: "barberos", icono: "fa-scissors" },
                { nombre: "Usuarios", pagina: "usuarios", icono: "fa-user-group" },
                { nombre: "Sueldos", pagina: "sueldos", icono: "fa-wallet" }
            ]
        },

        {
            id: "catalogo",
            nombre: "Catálogo",
            icono: "fa-layer-group",
            opciones: [
                { nombre: "Categorías", pagina: "categorias", icono: "fa-list" },
                { nombre: "Servicios", pagina: "catalogo", icono: "fa-scissors" },
                { nombre: "Productos", pagina: "catalogo", icono: "fa-box" }
            ]
        },

        {
            id: "fidelizacion",
            nombre: "Fidelización",
            icono: "fa-star",
            opciones: [
                { nombre: "Seguimiento", pagina: "fidelizacion", icono: "fa-chart-line" },
                { nombre: "Ruletas", pagina: "ruletas", icono: "fa-dharmachakra" },
                { nombre: "Reglas", pagina: "reglas", icono: "fa-sliders" }
            ]
        },

        {
            id: "analisis",
            nombre: "Análisis",
            icono: "fa-chart-pie",
            abierto: true,
            opciones: [
                { nombre: "Reportes", pagina: "reportes", icono: "fa-file-lines" },
                { nombre: "Métricas", pagina: "metricas", icono: "fa-chart-column" },
                { nombre: "Predicciones", pagina: "predicciones", icono: "fa-wand-magic-sparkles" }
            ]
        },

        {
            id: "sistema",
            nombre: "Sistema",
            icono: "fa-gear",
            opciones: [
                { nombre: "Configuración", pagina: "configuracion", icono: "fa-gear" },
                { nombre: "Perfil", pagina: "perfil", icono: "fa-user-gear" }
            ]
        }

    ];

    return `
        <div class="admin-sidebar-header">

            <div class="admin-brand">
                <i class="fa-solid fa-crown"></i>
                <span>FadeX</span>
            </div>

            <p>SISTEMA DE GESTIÓN DE BARBERÍA</p>

        </div>

        <nav class="admin-sidebar-menu">

            <button
                class="admin-nav-link"
                data-pagina="resumen"
                onclick="navegarDashboard('resumen')">

                <i class="fa-solid fa-house"></i>
                <span>Resumen</span>

            </button>

            <div class="admin-menu-separator"></div>

            ${grupos.map(grupo => `

                <div class="admin-menu-group">

                    <button
                        class="admin-group-title ${grupo.abierto ? "expanded" : ""}"
                        onclick="toggleAdminGroup('${grupo.id}')">

                        <span>
                            <i class="fa-solid ${grupo.icono}"></i>
                            ${grupo.nombre}
                        </span>

                        <i class="fa-solid fa-chevron-down admin-group-arrow"></i>

                    </button>

                    <div
                        class="admin-group-content ${grupo.abierto ? "open" : ""}"
                        id="grupo-${grupo.id}">

                        ${grupo.opciones.map(opcion => `

                            <button
                                class="admin-nav-link"
                                data-pagina="${opcion.pagina}"
                                onclick="navegarDashboard('${opcion.pagina}')">

                                <i class="fa-solid ${opcion.icono}"></i>
                                <span>${opcion.nombre}</span>

                            </button>

                        `).join("")}

                    </div>

                </div>

            `).join("")}

        </nav>

        <div class="admin-sidebar-footer">

            <button onclick="cerrarSesion()">
                <i class="fa-solid fa-right-from-bracket"></i>
                <span>Cerrar sesión</span>
            </button>

        </div>
    `;
}


// =========================================
// ABRIR Y CERRAR GRUPOS DEL MENÚ
// =========================================

function toggleAdminGroup(id) {

    const contenido = document.getElementById(`grupo-${id}`);

    if (!contenido) return;

    const boton = contenido.previousElementSibling;

    const estaAbierto = contenido.classList.contains("open");

    if (estaAbierto) {

        contenido.style.maxHeight = "0px";
        contenido.classList.remove("open");

    } else {

        contenido.classList.add("open");
        contenido.style.maxHeight = contenido.scrollHeight + "px";

    }

    boton.classList.toggle("expanded", !estaAbierto);
}

// =========================================
// INFORMACION DE LOS ROLES
// =========================================

const nombresRoles = {

    admin: "Administrador",

    barbero: "Barbero",

    cliente: "Cliente"

};


// =========================================
// MOSTRAR DASHBOARD
// =========================================

function mostrarDashboard(rol) {

    const usuarioGuardado =
        localStorage.getItem("fadexUsuario");


    // VERIFICAR QUE EXISTA UNA SESION

    if (!usuarioGuardado) {

        mostrarLogin();

        return;

    }


    const usuario = JSON.parse(usuarioGuardado);


    // VERIFICAR EL ROL

    if (!menusRoles[rol] || usuario.rol !== rol) {

        alert("No tienes acceso a este panel.");

        mostrarLogin();

        return;

    }


    // GUARDAR ROL ACTUAL

    localStorage.setItem("fadexRole", rol);


    // MOSTRAR ESTRUCTURA

    const app = document.getElementById("app");

    app.innerHTML = `

        <div class="dashboard">


            <!-- =================================
                 BARRA LATERAL
            ================================== -->

            <aside class="${rol === "admin" ? "admin-sidebar" : "sidebar"}">

                ${rol === "admin" ? crearSidebarAdmin() : `

                    <div class="sidebar-logo">

                        <img src="assets/Logo_FadeX.webp" alt="FadeX">
                        <span>FadeX</span>

                    </div>

                    <div class="sidebar-label">
                        ${nombresRoles[rol]}
                    </div>

                    <nav class="sidebar-menu">

                        ${menusRoles[rol].map(opcion => `

                            <button
                                class="sidebar-link"
                                onclick="navegarDashboard('${opcion.pagina}')">

                                <span class="sidebar-icon">
                                    ${opcion.icono}
                                </span>

                                <span>${opcion.nombre}</span>

                            </button>

                        `).join("")}

                    </nav>

                    <div class="sidebar-bottom">

                        <button
                            class="sidebar-link"
                            onclick="cerrarSesion()">

                            <span class="sidebar-icon">↪</span>
                            <span>Cerrar sesión</span>

                        </button>

                    </div>

                `}

            </aside>



            <!-- =================================
                 CONTENIDO PRINCIPAL
            ================================== -->

            <main class="dashboard-main">


                <!-- BARRA SUPERIOR -->

                <header class="dashboard-topbar">

                    <div class="topbar-title">

                        ${nombresRoles[rol]} / FadeX

                    </div>


                    <div class="topbar-user">

                        <div class="topbar-user-info">

                            <strong>

                                ${usuario.nombre}

                            </strong>

                            <span>

                                ${nombresRoles[rol]}

                            </span>

                        </div>


                        <div class="user-avatar">

                            ${usuario.nombre.charAt(0).toUpperCase()}

                        </div>

                    </div>

                </header>



                <!-- CONTENIDO DINAMICO -->

                <section
                    class="dashboard-content"
                    id="dashboard-content">

                </section>


            </main>

        </div>

    `;


    // ABRIR RESUMEN INICIAL

    navegarDashboard("resumen");

}


// =========================================
// NAVEGACION DEL DASHBOARD
// =========================================

function navegarDashboard(pagina) {

    const rol = localStorage.getItem("fadexRole");

    if (!menusRoles[rol]) return;


    // VERIFICAR QUE EL ROL TENGA PERMISO

    const tieneAcceso = menusRoles[rol].some(
        opcion => opcion.pagina === pagina
    );


    if (!tieneAcceso) {

        alert("No tienes permiso para acceder a esta sección.");

        return;

    }


    // =========================================
    // ACTUALIZAR OPCIÓN ACTIVA
    // =========================================

    document.querySelectorAll(
        ".sidebar-link, .admin-nav-link"
    ).forEach(boton => {

        boton.classList.remove("active");

        if (boton.dataset.pagina === pagina) {

            boton.classList.add("active");

        }

    });


    // MOSTRAR CONTENIDO

    const contenido = document.getElementById("dashboard-content");

    if (!contenido) return;


    contenido.innerHTML = obtenerContenidoInicial(rol, pagina);

}


// =========================================
// CONTENIDO INICIAL DE LOS DASHBOARDS
// =========================================



function obtenerContenidoInicial(rol, pagina) {

    // PANEL DEL ADMINISTRADOR
    if (rol === "admin") {

        if (typeof obtenerContenidoAdmin === "function") {
            return obtenerContenidoAdmin(pagina);
        }

    }

    // PANEL DEL BARBERO
    if (rol === "barbero") {

        if (typeof obtenerContenidoBarbero === "function") {
            return obtenerContenidoBarbero(pagina);
        }

    }

    // PANEL DEL CLIENTE
    if (rol === "cliente") {

        if (typeof obtenerContenidoCliente === "function") {
            return obtenerContenidoCliente(pagina);
        }

    }

    // CONTENIDO TEMPORAL SI EL MÓDULO TODAVÍA NO EXISTE
    return `
        <div class="dashboard-panel">

            <h3 class="panel-title">
                Módulo en desarrollo
            </h3>

            <p>
                Esta sección estará disponible
                en una próxima actualización de FadeX.
            </p>

        </div>
    `;
}


