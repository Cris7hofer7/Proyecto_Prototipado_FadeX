
/* =========================================
   FADEX - AUTENTICACION
========================================= */


// =========================================
// MOSTRAR INICIO DE SESION
// =========================================

function mostrarLogin() {

    const app = document.getElementById("app");

    app.innerHTML = `

        <main class="login-container">

            <section class="login-card">

                <!-- LOGOTIPO -->

                <div class="login-logo">

                    <img
                        src="assets/Logo_FadeX.webp"
                        alt="Logo FadeX">

                </div>


                <!-- TITULO -->

                <h2>Bienvenido a FadeX</h2>

                <p class="login-description">

                    Inicia sesión para acceder a tu cuenta.

                </p>


                <!-- FORMULARIO -->

                <form class="login-form" onsubmit="iniciarSesion(event)">


                    <!-- CORREO -->

                    <div class="login-group">

                        <label for="correo">

                            Correo electrónico

                        </label>

                        <input
                            type="email"
                            id="correo"
                            placeholder="usuario@fadex.com"
                            required>

                    </div>


                    <!-- CONTRASEÑA -->

                    <div class="login-group">

                        <label for="contrasena">

                            Contraseña

                        </label>

                        <input
                            type="password"
                            id="contrasena"
                            placeholder="Ingresa tu contraseña"
                            required
                            minlength="4">

                    </div>


                    <!-- SELECCION DE ROL -->

                    <div class="login-group">

                        <label for="rol">

                            Ingresar como

                        </label>

                        <select id="rol" required>

                            <option value="cliente">

                                Cliente

                            </option>

                            <option value="barbero">

                                Barbero

                            </option>

                            <option value="admin">

                                Administrador

                            </option>

                        </select>

                    </div>


                    <!-- OPCIONES -->

                    <div class="login-options">

                        <label>

                            <input
                                type="checkbox"
                                id="recordarme">

                            Recordarme

                        </label>

                        <a href="#" onclick="recuperarContrasena(event)">

                            ¿Olvidaste tu contraseña?

                        </a>

                    </div>


                    <!-- MENSAJE -->

                    <div
                        id="login-message"
                        class="login-message">

                    </div>


                    <!-- BOTON -->

                    <button
                        type="submit"
                        class="login-button">

                        Iniciar sesión

                    </button>


                </form>


                <!-- VOLVER -->

                <a
                    class="login-back"
                    onclick="mostrarLanding()">

                    ← Volver a la página principal

                </a>


            </section>

        </main>

    `;

}


// =========================================
// INICIAR SESION
// =========================================

function iniciarSesion(event) {

    event.preventDefault();


    // OBTENER DATOS DEL FORMULARIO

    const correo = document.getElementById("correo").value.trim();

    const contrasena = document.getElementById("contrasena").value;

    const rol = document.getElementById("rol").value;


    const mensaje = document.getElementById("login-message");


    // VALIDAR CAMPOS

    if (!correo || !contrasena) {

        mensaje.textContent = "Completa todos los campos.";

        mensaje.className = "login-message error";

        return;

    }


    // GUARDAR ROL Y USUARIO

    const usuario = {

        correo: correo,

        rol: rol,

        nombre: correo.split("@")[0]

    };


    localStorage.setItem(
        "fadexUsuario",
        JSON.stringify(usuario)
    );


    localStorage.setItem("fadexRole", rol);


    // ACCEDER AL DASHBOARD

    mensaje.textContent = "Acceso correcto. Bienvenido a FadeX.";

    mensaje.className = "login-message success";


    // MOSTRAR EL PANEL CORRESPONDIENTE

    setTimeout(() => {

        if (typeof mostrarDashboard === "function") {

            mostrarDashboard(rol);

        } else {

            alert("El dashboard se implementará en las siguientes partes.");

            mostrarLanding();

        }

    }, 500);

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

    const rol = document.getElementById("rol");

    if (rol) {

        rol.value = "cliente";

    }

}
