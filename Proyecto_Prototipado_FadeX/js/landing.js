
/* =========================================
   FADEX - PAGINA PRINCIPAL
========================================= */

// IMAGENES DEL CARRUSEL

const slides = [
    {
        image: "assets/cortebarba.jpg",
        title: "TU IMAGEN,<br>NUESTRA PASIÓN",
        description:
            "Experimenta el arte del grooming masculino con los mejores barberos de la ciudad."
    },

    {
        image: "assets/afeitadoclasico.webp",
        title: "EL ESTILO<br>ES PERSONAL",
        description:
            "Encuentra el estilo que mejor representa tu personalidad."
    },

    {
        image: "assets/tijeras.jpg",
        title: "TU MEJOR<br>VERSIÓN",
        description:
            "En FadeX cuidamos cada detalle para ofrecerte una experiencia única."
    }
];


// POSICION ACTUAL DEL CARRUSEL

let currentSlide = 0;


// =========================================
// MOSTRAR PAGINA PRINCIPAL
// =========================================

function mostrarLanding() {

    const app = document.getElementById("app");

    app.innerHTML = `

        <!-- BARRA DE NAVEGACION -->

        <header class="navbar">

            <a href="#inicio" class="logo">

                <img src="assets/Logo_FadeX.webp" alt="FadeX">

                <span>FadeX</span>

            </a>


            <!-- MENU PRINCIPAL -->

            <nav class="nav-menu">

                <a href="#inicio">Inicio</a>

                <a href="#nosotros">Nosotros</a>

                <a href="#servicios">Servicios</a>

                <a href="#tienda">Tienda</a>

            </nav>


            <!-- ICONOS -->

            <div class="nav-icons">

                <button
                    class="nav-icon"
                    onclick="mostrarCarrito()"
                    title="Carrito">

                    🛒

                </button>


                <button
                    class="nav-icon"
                    onclick="mostrarReservas()"
                    title="Reservas">

                    ▤

                </button>


                <button
                    class="user-icon"
                    onclick="mostrarLogin()"
                    title="Mi cuenta">

                    ♟

                </button>

            </div>

        </header>



        <!-- HERO PRINCIPAL -->

        <section class="hero" id="inicio">

            <!-- FLECHA IZQUIERDA -->

            <button
                class="hero-arrow left"
                onclick="cambiarSlide(-1)">

                &#8249;

            </button>


            <!-- TEXTO PRINCIPAL -->

            <div class="hero-content">

                <h1 id="hero-title">

                    ${slides[0].title}

                </h1>


                <p id="hero-description">

                    ${slides[0].description}

                </p>


                <button
                    class="btn-reservar"
                    onclick="mostrarLogin()">

                    Reservar cita

                </button>

            </div>


            <!-- FLECHA DERECHA -->

            <button
                class="hero-arrow right"
                onclick="cambiarSlide(1)">

                &#8250;

            </button>


            <!-- INDICADORES -->

            <div class="hero-indicators">

                ${slides.map((slide, index) => `

                    <button
                        class="${index === 0 ? 'active' : ''}"
                        onclick="irSlide(${index})">

                    </button>

                `).join("")}

            </div>

        </section>



        <!-- SECCION NOSOTROS -->

        <section class="landing-section" id="nosotros">

            <h2 class="section-title">

                Bienvenido a FadeX

            </h2>


            <p class="section-description">

                Más que una barbería, una experiencia.
                Nos especializamos en resaltar tu estilo
                con profesionalismo y dedicación.

            </p>

        </section>



        <!-- SECCION SERVICIOS -->

        <section class="landing-section" id="servicios">

            <h2 class="section-title">

                Nuestros servicios

            </h2>


            <p class="section-description">

                Descubre nuestros servicios y encuentra
                el estilo perfecto para ti.

            </p>


            <div class="services-grid">

                ${crearTarjetasServicios()}

            </div>

        </section>



        <!-- SECCION TIENDA -->

        <section class="landing-section" id="tienda">

            <h2 class="section-title">

                Nuestra tienda

            </h2>


            <p class="section-description">

                Encuentra productos para cuidar
                tu cabello y mantener tu estilo.

            </p>


            <div class="services-grid">

                <article class="service-card">

                    <img
                        src="assets/producto.webp"
                        alt="Producto de barbería">

                    <div class="service-info">

                        <h3>Productos de cuidado</h3>

                        <p>Consulta nuestros productos</p>

                        <button
                            class="btn-dorado"
                            onclick="mostrarCarrito()">

                            Ver tienda

                        </button>

                    </div>

                </article>

            </div>

        </section>



        <!-- BOTONES FLOTANTES -->

        <div class="floating-buttons">

            <button
                class="float-btn float-cart"
                onclick="mostrarCarrito()"
                title="Carrito">

                🛒

            </button>


            <button
                class="float-btn float-whatsapp"
                onclick="abrirWhatsApp()"
                title="WhatsApp">

                ☎

            </button>

        </div>



        <!-- PIE DE PAGINA -->

        <footer class="landing-section">

            <p style="text-align:center;color:#888;">

                © 2026 FadeX - Todos los derechos reservados.

            </p>

        </footer>

    `;


    // COLOCAR IMAGEN INICIAL DEL CARRUSEL

    actualizarSlide();

}


// =========================================
// CREAR TARJETAS DE SERVICIOS
// =========================================

function crearTarjetasServicios() {

    const servicios = [

        {
            nombre: "Corte clásico",
            imagen: "corteclasico.webp",
            precio: "S/ 25.00"
        },

        {
            nombre: "Corte degradado",
            imagen: "degradado.webp",
            precio: "S/ 30.00"
        },

        {
            nombre: "Corte + barba",
            imagen: "cortemasbarba.webp",
            precio: "S/ 40.00"
        },

        {
            nombre: "Arreglo de barba",
            imagen: "arreglobarba.webp",
            precio: "S/ 20.00"
        },

        {
            nombre: "Corte para niños",
            imagen: "corteninos.webp",
            precio: "S/ 20.00"
        },

        {
            nombre: "Tratamiento capilar",
            imagen: "tratamientocap.webp",
            precio: "S/ 35.00"
        }

    ];


    return servicios.map(servicio => `

        <article class="service-card">

            <img
                src="assets/${servicio.imagen}"
                alt="${servicio.nombre}">

            <div class="service-info">

                <h3>${servicio.nombre}</h3>

                <p>${servicio.precio}</p>

                <button
                    class="btn-dorado"
                    onclick="mostrarLogin()">

                    Reservar

                </button>

            </div>

        </article>

    `).join("");

}


// =========================================
// ACTUALIZAR CARRUSEL
// =========================================

function actualizarSlide() {

    const hero = document.querySelector(".hero");

    const title = document.getElementById("hero-title");

    const description =
        document.getElementById("hero-description");


    if (!hero || !title || !description) return;


    const slide = slides[currentSlide];


    hero.style.backgroundImage =
        `url("${slide.image}")`;


    title.innerHTML = slide.title;

    description.textContent = slide.description;


    // ACTUALIZAR INDICADORES

    const indicators =
        document.querySelectorAll(".hero-indicators button");


    indicators.forEach((button, index) => {

        button.classList.toggle(
            "active",
            index === currentSlide
        );

    });

}


// =========================================
// CAMBIAR SLIDE
// =========================================

function cambiarSlide(direccion) {

    currentSlide += direccion;


    if (currentSlide >= slides.length) {

        currentSlide = 0;

    }


    if (currentSlide < 0) {

        currentSlide = slides.length - 1;

    }


    actualizarSlide();

}


// =========================================
// IR A UN SLIDE ESPECIFICO
// =========================================

function irSlide(indice) {

    currentSlide = indice;

    actualizarSlide();

}


// =========================================
// WHATSAPP
// =========================================

function abrirWhatsApp() {

    const numero = "51999999999";

    const mensaje =
        encodeURIComponent("Hola FadeX, quisiera información sobre sus servicios.");

    window.open(
        `https://wa.me/${numero}?text=${mensaje}`,
        "_blank"
    );

}
// MOSTRAR PAGINA PRINCIPAL AL INICIAR
mostrarLanding();