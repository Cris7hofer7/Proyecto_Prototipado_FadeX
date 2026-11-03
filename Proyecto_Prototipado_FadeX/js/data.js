
// ==========================================
// FADEX - BASE DE DATOS DE DEMOSTRACIÓN
// ==========================================

// Esta función permite guardar información
// en el almacenamiento local del navegador.
function guardarDatos(clave, datos) {
    localStorage.setItem(clave, JSON.stringify(datos));
}


// Esta función permite recuperar información.
// Si no existe, devuelve un arreglo vacío.
function obtenerDatos(clave) {
    const datos = localStorage.getItem(clave);

    return datos ? JSON.parse(datos) : [];
}


// ==========================================
// 1. CLIENTES
// ==========================================

const clientesIniciales = [
    {
        id: 1,
        nombre: "Carlos Mendoza",
        correo: "carlos@gmail.com",
        telefono: "987654321"
    },
    {
        id: 2,
        nombre: "Luis Torres",
        correo: "luis@gmail.com",
        telefono: "976543210"
    },
    {
        id: 3,
        nombre: "Andrés Flores",
        correo: "andres@gmail.com",
        telefono: "965432109"
    }
];


// ==========================================
// 2. BARBEROS
// ==========================================

const barberosIniciales = [
    {
        id: 1,
        nombre: "Miguel Ángel",
        correo: "miguel@fadex.com",
        especialidad: "Cortes degradados",
        telefono: "987111222",
        estado: "Activo"
    },
    {
        id: 2,
        nombre: "José Ramírez",
        correo: "jose@fadex.com",
        especialidad: "Barba y afeitados",
        telefono: "987333444",
        estado: "Activo"
    },
    {
        id: 3,
        nombre: "Daniel Castro",
        correo: "daniel@fadex.com",
        especialidad: "Cortes clásicos",
        telefono: "987555666",
        estado: "Activo"
    }
];


// ==========================================
// 3. SERVICIOS
// ==========================================

const serviciosIniciales = [
    {
        id: 1,
        nombre: "Corte clásico",
        descripcion: "Corte tradicional de cabello.",
        precio: 20,
        duracion: 30,
        estado: "Activo"
    },
    {
        id: 2,
        nombre: "Corte degradado",
        descripcion: "Corte moderno con degradado.",
        precio: 25,
        duracion: 40,
        estado: "Activo"
    },
    {
        id: 3,
        nombre: "Corte y barba",
        descripcion: "Corte de cabello y arreglo de barba.",
        precio: 35,
        duracion: 50,
        estado: "Activo"
    },
    {
        id: 4,
        nombre: "Arreglo de barba",
        descripcion: "Perfilado y arreglo de barba.",
        precio: 15,
        duracion: 20,
        estado: "Activo"
    },
    {
        id: 5,
        nombre: "Corte para niños",
        descripcion: "Corte de cabello infantil.",
        precio: 18,
        duracion: 30,
        estado: "Activo"
    }
];


// ==========================================
// 4. PRODUCTOS
// ==========================================

const productosIniciales = [
    {
        id: 1,
        nombre: "Cera para cabello",
        precio: 25,
        stock: 15,
        estado: "Disponible"
    },
    {
        id: 2,
        nombre: "Shampoo masculino",
        precio: 30,
        stock: 10,
        estado: "Disponible"
    },
    {
        id: 3,
        nombre: "Aceite para barba",
        precio: 22,
        stock: 8,
        estado: "Disponible"
    }
];


// ==========================================
// 5. RESERVAS
// ==========================================

const reservasIniciales = [
    {
        id: 1,
        clienteId: 1,
        cliente: "Carlos Mendoza",
        barberoId: 1,
        barbero: "Miguel Ángel",
        servicioId: 2,
        servicio: "Corte degradado",
        fecha: "2026-11-02",
        hora: "10:00",
        precio: 25,
        estado: "Confirmada"
    },
    {
        id: 2,
        clienteId: 2,
        cliente: "Luis Torres",
        barberoId: 2,
        barbero: "José Ramírez",
        servicioId: 4,
        servicio: "Arreglo de barba",
        fecha: "2026-11-02",
        hora: "11:00",
        precio: 15,
        estado: "Pendiente"
    },
    {
        id: 3,
        clienteId: 3,
        cliente: "Andrés Flores",
        barberoId: 3,
        barbero: "Daniel Castro",
        servicioId: 1,
        servicio: "Corte clásico",
        fecha: "2026-11-03",
        hora: "15:00",
        precio: 20,
        estado: "Completada"
    }
];


// ==========================================
// 6. VENTAS
// ==========================================

const ventasIniciales = [
    {
        id: 1,
        descripcion: "Corte degradado",
        cliente: "Carlos Mendoza",
        total: 25,
        fecha: "2026-10-28",
        metodoPago: "Efectivo"
    },
    {
        id: 2,
        descripcion: "Cera para cabello",
        cliente: "Luis Torres",
        total: 25,
        fecha: "2026-10-28",
        metodoPago: "Yape"
    }
];


// ==========================================
// 7. INICIALIZAR DATOS
// ==========================================

// Solo crea los datos iniciales si todavía
// no existen en el almacenamiento del navegador.

function inicializarDatosFadeX() {

    if (!localStorage.getItem("fadexClientes")) {
        guardarDatos("fadexClientes", clientesIniciales);
    }

    if (!localStorage.getItem("fadexBarberos")) {
        guardarDatos("fadexBarberos", barberosIniciales);
    }

    if (!localStorage.getItem("fadexServicios")) {
        guardarDatos("fadexServicios", serviciosIniciales);
    }

    if (!localStorage.getItem("fadexProductos")) {
        guardarDatos("fadexProductos", productosIniciales);
    }

    if (!localStorage.getItem("fadexReservas")) {
        guardarDatos("fadexReservas", reservasIniciales);
    }

    if (!localStorage.getItem("fadexVentas")) {
        guardarDatos("fadexVentas", ventasIniciales);
    }

}


// ==========================================
// 8. RESTABLECER DATOS DE DEMOSTRACIÓN
// ==========================================

// Esta función permite recuperar los datos
// originales cuando estemos haciendo pruebas.

function restablecerDatosDemo() {

    localStorage.removeItem("fadexClientes");
    localStorage.removeItem("fadexBarberos");
    localStorage.removeItem("fadexServicios");
    localStorage.removeItem("fadexProductos");
    localStorage.removeItem("fadexReservas");
    localStorage.removeItem("fadexVentas");

    inicializarDatosFadeX();

    alert("Los datos de demostración fueron restablecidos.");
}


// ==========================================
// 9. EJECUTAR INICIALIZACIÓN
// ==========================================

inicializarDatosFadeX();

console.log("FadeX: datos de demostración cargados correctamente.");
