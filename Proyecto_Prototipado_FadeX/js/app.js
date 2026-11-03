
/* =========================================
   FADEX - CONTROL GENERAL DEL SISTEMA
========================================= */


// =========================================
// CONFIGURACION DE LOS ROLES
// =========================================

const menusRoles = {

    admin: [
        { nombre: "Resumen", icono: "▦", pagina: "resumen" },
        { nombre: "Reservas", icono: "▣", pagina: "reservas" },
        { nombre: "Ventas", icono: "▤", pagina: "ventas" },
        { nombre: "Pagos", icono: "＄", pagina: "pagos" },
        { nombre: "Clientes", icono: "♙", pagina: "clientes" },
        { nombre: "Barberos", icono: "✂", pagina: "barberos" },
        { nombre: "Usuarios", icono: "♟", pagina: "usuarios" },
        { nombre: "Servicios y productos", icono: "▧", pagina: "catalogo" },
        { nombre: "Fidelización", icono: "☆", pagina: "fidelizacion" },
        { nombre: "Reportes", icono: "▥", pagina: "reportes" },
        { nombre: "Configuración", icono: "⚙", pagina: "configuracion" }
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

            <aside class="sidebar">


                <!-- LOGOTIPO -->

                <div class="sidebar-logo">

                    <img
                        src="assets/Logo_FadeX.webp"
                        alt="FadeX">

                    <span>FadeX</span>

                </div>


                <!-- ROL -->

                <div class="sidebar-label">

                    ${nombresRoles[rol]}

                </div>


                <!-- MENU -->

                <nav class="sidebar-menu">

                    ${menusRoles[rol].map(opcion => `

                        <button
                            class="sidebar-link"
                            onclick="navegarDashboard('${opcion.pagina}')">

                            <span class="sidebar-icon">

                                ${opcion.icono}

                            </span>

                            <span>

                                ${opcion.nombre}

                            </span>

                        </button>

                    `).join("")}

                </nav>


                <!-- CERRAR SESION -->

                <div class="sidebar-bottom">

                    <button
                        class="sidebar-link"
                        onclick="cerrarSesion()">

                        <span class="sidebar-icon">↪</span>

                        <span>Cerrar sesión</span>

                    </button>

                </div>


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


    // ACTUALIZAR MENU ACTIVO

    document.querySelectorAll(".sidebar-link").forEach(boton => {

        boton.classList.remove("active");

        if (boton.getAttribute("onclick") ===
            `navegarDashboard('${pagina}')`) {

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


