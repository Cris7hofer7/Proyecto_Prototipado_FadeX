
/* =========================================
   FADEX - AUTENTICACION
========================================= */

// =========================================
// CUENTA PRINCIPAL DEL ADMINISTRADOR
// =========================================

const ADMIN_FADEX = {
    nombre: "Administrador FadeX",
    correo: "cris@fadex.com",
    contrasena: "1234567",
    rol: "admin"
};


// =========================================
// MOSTRAR INICIO DE SESION
// =========================================

function mostrarLogin() {

    const app = document.getElementById("app");

    app.innerHTML = `

        <main class="login-container">

            <section class="login-card">

                <!-- COLUMNA IZQUIERDA -->

                <div class="login-left">

                    <div class="login-brand">
                        <h1>FadeX</h1>
                        <p>Sistema de Gestión de Barbería</p>
                    </div>

                    <form class="login-form" onsubmit="iniciarSesion(event)">

                        <div class="login-group">
                            <label for="correo">Correo electrónico</label>
                            <input
                                type="email"
                                id="correo"
                                placeholder="usuario@correo.com"
                                required>
                        </div>

                        <div class="login-group">
                            <label for="contrasena">Contraseña</label>
                            <input
                                type="password"
                                id="contrasena"
                                placeholder="Ingresa tu contraseña"
                                required>
                        </div>

                        <div class="login-options">

                            <label>
                                <input type="checkbox" id="recordarme">
                                Recordarme
                            </label>

                            <a href="#" onclick="recuperarContrasena(event)">
                                ¿Olvidaste tu contraseña?
                            </a>

                        </div>

                        <div id="login-message" class="login-message"></div>

                        <button type="submit" class="login-button">
                            Iniciar sesión
                        </button>

                    </form>

                    <div class="login-divider">
                        <span>O continúa con</span>
                    </div>

                    <button
                        class="login-google"
                        type="button"
                        onclick="accesoGoogle()">

                        <span>G</span>
                        Acceder con Google

                    </button>

                    <div class="login-credentials">

                        <p>Credenciales de prueba:</p>

                        <small>
                            Admin: cris@fadex.com / 1234567
                        </small>

                    </div>

                    <p class="login-register">
                        ¿No tienes cuenta?
                        <a href="#" onclick="mostrarRegistro()">
                            Regístrate
                        </a>
                    </p>

                    <a class="login-back" onclick="mostrarLanding()">
                        ← Volver a la página principal
                    </a>

                </div>


                <!-- COLUMNA DERECHA: QR -->

                <div class="login-right">

                    <div class="qr-heading">
                        <span class="qr-icon">▦</span>
                        <h2>Acceso con QR</h2>
                        <p>Escanea tu código QR e ingresa más rápido.</p>
                    </div>

                    <div class="qr-placeholder">

                        <span>▦</span>

                        <p>
                            Activa la cámara para escanear
                        </p>

                    </div>

                    <button
                        class="qr-button"
                        type="button"
                        onclick="escanearQR()">

                        ▣ Activar escáner

                    </button>

                    <div class="qr-benefits">

                        <div>
                            <strong>♙ Seguro</strong>
                            <small>Acceso personalizado</small>
                        </div>

                        <div>
                            <strong>⚡ Rápido</strong>
                            <small>Acceso en segundos</small>
                        </div>

                    </div>

                </div>

            </section>

        </main>

    `;
}


// =========================================
// INICIAR SESION
// =========================================

function iniciarSesion(event) {

    event.preventDefault();

    const correo = document.getElementById("correo").value.trim().toLowerCase();
    const contrasena = document.getElementById("contrasena").value;
    const mensaje = document.getElementById("login-message");

    let usuario = null;

    // 1. COMPROBAR ADMINISTRADOR

    if (
        correo === ADMIN_FADEX.correo &&
        contrasena === ADMIN_FADEX.contrasena
    ) {

        usuario = {
            nombre: ADMIN_FADEX.nombre,
            correo: ADMIN_FADEX.correo,
            rol: ADMIN_FADEX.rol
        };

    }

    // 2. COMPROBAR BARBEROS

    if (!usuario) {

        const barberos = obtenerDatos("fadexBarberos");

        const barbero = barberos.find(
            b =>
                b.correo.toLowerCase() === correo &&
                b.contrasena === contrasena &&
                b.estado === "Activo"
        );

        if (barbero) {

            usuario = {
                nombre: barbero.nombre,
                correo: barbero.correo,
                rol: "barbero"
            };

        }

    }

    // 3. COMPROBAR CLIENTES

    if (!usuario) {

        const clientes = obtenerDatos("fadexClientes");

        const cliente = clientes.find(
            c =>
                c.correo.toLowerCase() === correo &&
                c.contrasena === contrasena
        );

        if (cliente) {

            usuario = {
                nombre: cliente.nombre,
                correo: cliente.correo,
                rol: "cliente"
            };

        }

    }

    // 4. SI NO SE ENCUENTRA LA CUENTA

    if (!usuario) {

        mensaje.textContent =
            "Correo o contraseña incorrectos, o cuenta no habilitada.";

        mensaje.className = "login-message error";

        return;

    }

    // 5. GUARDAR SESION

    localStorage.setItem(
        "fadexUsuario",
        JSON.stringify(usuario)
    );

    localStorage.setItem("fadexRole", usuario.rol);

    mensaje.textContent = "Acceso correcto. Bienvenido a FadeX.";

    mensaje.className = "login-message success";

    // 6. ABRIR EL PANEL SEGUN EL ROL

    setTimeout(() => {
        mostrarDashboard(usuario.rol);
    }, 500);

}


// =========================================
// MOSTRAR REGISTRO DE CLIENTE
// =========================================

function mostrarRegistro() {

    const app = document.getElementById("app");

    app.innerHTML = `

        <main class="registro-container">

            <section class="registro-card">

                <div class="registro-brand">
                    <h1>FadeX</h1>
                    <p>Crea tu cuenta y empieza a reservar</p>
                </div>

                <h2>FADEX <span>BARBER</span></h2>

                <form
                    class="registro-form"
                    onsubmit="registrarCliente(event)">

                    <div class="registro-group">
                        <label for="reg-nombre">Nombre</label>
                        <input
                            type="text"
                            id="reg-nombre"
                            placeholder="Juan"
                            required>
                    </div>

                    <div class="registro-group">
                        <label for="reg-apellido">Apellido</label>
                        <input
                            type="text"
                            id="reg-apellido"
                            placeholder="Pérez"
                            required>
                    </div>

                    <div class="registro-group">
                        <label for="reg-telefono">Teléfono</label>
                        <input
                            type="tel"
                            id="reg-telefono"
                            placeholder="999 888 777"
                            required>
                    </div>

                    <div class="registro-group">
                        <label for="reg-correo">Correo electrónico</label>
                        <input
                            type="email"
                            id="reg-correo"
                            placeholder="tucorreo@gmail.com"
                            required>
                    </div>

                    <div class="registro-group">
                        <label for="reg-usuario">Nombre de usuario</label>
                        <input
                            type="text"
                            id="reg-usuario"
                            placeholder="tusuariomax"
                            required>
                    </div>

                    <div class="registro-group">
                        <label for="reg-contrasena">Contraseña</label>
                        <input
                            type="password"
                            id="reg-contrasena"
                            minlength="6"
                            placeholder="Crea una contraseña"
                            required>
                    </div>

                    <div class="registro-group">
                        <label for="reg-confirmar">Confirmar contraseña</label>
                        <input
                            type="password"
                            id="reg-confirmar"
                            minlength="6"
                            placeholder="Repite tu contraseña"
                            required>
                    </div>

                    <div class="registro-terms">
                        <label>
                            <input type="checkbox" id="reg-terminos" required>
                            Acepto los
                            <a href="#">términos y condiciones</a>
                            y la
                            <a href="#">política de privacidad</a>
                        </label>
                    </div>

                    <div id="registro-message" class="registro-message"></div>

                    <button type="submit" class="registro-button">
                        Crear cuenta
                    </button>

                </form>

                <div class="registro-divider">
                    <span>O regístrate con</span>
                </div>

                <button
                    class="registro-google"
                    type="button"
                    onclick="accesoGoogle()">

                    <span>G</span>
                    Acceder con Google

                </button>

                <p class="registro-login">
                    ¿Ya tienes cuenta?
                    <a href="#" onclick="mostrarLogin()">
                        Inicia sesión
                    </a>
                </p>

            </section>

        </main>

    `;

}


// =========================================
// REGISTRAR NUEVO CLIENTE
// =========================================

function registrarCliente(event) {

    event.preventDefault();

    const nombre = document.getElementById("reg-nombre").value.trim();
    const apellido = document.getElementById("reg-apellido").value.trim();
    const telefono = document.getElementById("reg-telefono").value.trim();
    const correo = document.getElementById("reg-correo").value.trim().toLowerCase();
    const username = document.getElementById("reg-usuario").value.trim();
    const contrasena = document.getElementById("reg-contrasena").value;
    const confirmar = document.getElementById("reg-confirmar").value;

    const mensaje = document.getElementById("registro-message");

    // COMPROBAR CONTRASEÑAS

    if (contrasena !== confirmar) {

        mensaje.textContent = "Las contraseñas no coinciden.";
        mensaje.className = "registro-message error";

        return;

    }

    // COMPROBAR SI EL CORREO YA EXISTE

    if (correo === ADMIN_FADEX.correo.toLowerCase()) {

        mensaje.textContent = "Este correo ya está registrado.";
        mensaje.className = "registro-message error";

        return;

    }

    const clientes = obtenerDatos("fadexClientes");
    const barberos = obtenerDatos("fadexBarberos");

    const correoExiste =
        clientes.some(c => c.correo.toLowerCase() === correo) ||
        barberos.some(b => b.correo.toLowerCase() === correo);

    if (correoExiste) {

        mensaje.textContent = "Ya existe una cuenta con ese correo.";
        mensaje.className = "registro-message error";

        return;

    }

    // CREAR CUENTA DE CLIENTE

    const nuevoCliente = {

        id: Date.now(),

        nombre: `${nombre} ${apellido}`,

        correo: correo,

        telefono: telefono,

        username: username,

        contrasena: contrasena

    };

    clientes.push(nuevoCliente);

    guardarDatos("fadexClientes", clientes);

    mensaje.textContent = "¡Cuenta creada correctamente!";

    mensaje.className = "registro-message success";

    // VOLVER AL LOGIN

    setTimeout(() => {

        mostrarLogin();

        const campoCorreo = document.getElementById("correo");

        if (campoCorreo) {
            campoCorreo.value = correo;
        }

    }, 1000);

}


// =========================================
// ACCESO CON QR
// =========================================

function escanearQR() {

    alert(
        "El escáner QR se habilitará en la siguiente etapa. " +
        "Necesitaremos configurar la cámara y los códigos de acceso."
    );

}


// =========================================
// ACCESO CON GOOGLE
// =========================================

function accesoGoogle() {

    alert(
        "El acceso con Google requiere configurar Google Authentication."
    );

}


// =========================================
// CERRAR SESION
// =========================================

function cerrarSesion() {

    localStorage.removeItem("fadexRole");
    localStorage.removeItem("fadexUsuario");

    mostrarLanding();

}


// =========================================
// RECUPERAR CONTRASEÑA
// =========================================

function recuperarContrasena(event) {

    event.preventDefault();

    alert(
        "La recuperación de contraseña estará disponible en una versión futura."
    );

}


// =========================================
// MOSTRAR CARRITO
// =========================================

function mostrarCarrito() {

    alert(
        "Carrito de compras de FadeX. Esta sección se implementará próximamente."
    );

}


// =========================================
// MOSTRAR RESERVAS
// =========================================

function mostrarReservas() {

    mostrarLogin();

}
