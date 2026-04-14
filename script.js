// ========== CANVAS ANIMADO EN EL HEADER ==========
// Este código crea un efecto de partículas interactivas en el encabezado
window.addEventListener('load', () => {
    const canvas = document.getElementById("bannerCanvas");
    const ctx = canvas.getContext("2d");
    const header = canvas.parentElement;

    canvas.width = header.offsetWidth;
    canvas.height = header.offsetHeight;

    const particles = [];
    const mouse = { x: -1000, y: -1000, radius: 100 };

    // Evento para detectar movimiento del ratón y hacer que las partículas se alejen
    canvas.addEventListener("mousemove", (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    // Cuando el ratón sale del canvas, las partículas vuelven a su comportamiento normal
    canvas.addEventListener("mouseleave", () => {
        mouse.x = -1000;
        mouse.y = -1000;
    });

    // Clase Particle: Define una partícula con posición, velocidad y tamaño
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 5 + 1;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.2;
        }

        // Actualiza la posición de la partícula
        update() {
            // Cálculo de distancia al ratón usando la fórmula de distancia euclidiana
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            
            // Si el ratón está dentro del radio, la partícula se aleja
            if (distance < mouse.radius) {
                let force = (mouse.radius - distance) / mouse.radius;
                let dirX = dx / distance;
                let dirY = dy / distance;
                this.x -= dirX * force * 5;
                this.y -= dirY * force * 5;
            }

            // Movimiento normal de la partícula
            this.x += this.speedX;
            this.y += this.speedY;

            // Hacer que las partículas aparezcan en el lado opuesto si salen del canvas
            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }

        // Dibuja la partícula en el canvas
        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = "white";
            ctx.fill();
            ctx.restore();
        }
    }

    // Crear 70 partículas iniciales
    for (let i = 0; i < 70; i++) particles.push(new Particle());

    // Función de animación: loop que actualiza y dibuja todas las partículas
    function animate() {
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animate); // Solicita el siguiente frame
    }
    animate();
});

// ========== SISTEMA DE FILTRADO DE PROYECTOS ==========
// Este código maneja el filtrado de tarjetas de proyectos por categoría

// Obtener referencias del DOM
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
const toggleDetailBtn = document.getElementById('toggleDetailBtn');
const editImageBtn = document.getElementById('editImageBtn');

// Variable para rastrear si los detalles están visibles
let detailsVisible = false;
let themeIndex = 0;

// Array con diferentes temas de colores para las imágenes
const themeGradients = [
    [
        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
    ],
    [
        'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        'linear-gradient(135deg, #eb3349 0%, #f45c43 100%)',
        'linear-gradient(135deg, #0575e6 0%, #021b79 100%)',
        'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
        'linear-gradient(135deg, #ee0979 0%, #ff6a00 100%)',
        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    ],
    [
        'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)',
        'linear-gradient(135deg, #ffa500 0%, #ffb703 100%)',
        'linear-gradient(135deg, #a8dadc 0%, #457b9d 100%)',
        'linear-gradient(135deg, #06a77d 0%, #05386b 100%)',
        'linear-gradient(135deg, #d62828 0%, #f77f00 100%)',
        'linear-gradient(135deg, #c9184a 0%, #caffbf 100%)'
    ]
];

/**
 * FUNCIÓN: Filtrar proyectos por categoría
 * Parámetro: categoria - la categoría seleccionada ('todos', 'frontend', 'backend', 'fullstack')
 * Lógica: Mostrar solo las tarjetas que coincidan con la categoría
 */
function filterProjects(categoria) {
    projectCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        
        // Si es "todos" o si la categoría coincide, mostrar la tarjeta
        if (categoria === 'todos' || cardCategory === categoria) {
            card.classList.remove('hidden');
        } else {
            card.classList.add('hidden');
        }
    });

    // Actualizar el botón activo visualmente
    filterButtons.forEach(btn => {
        if (btn.getAttribute('data-filter') === categoria) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

/**
 * FUNCIÓN: Mostrar/Ocultar detalles técnicos de proyectos
 * Lógica: Toggle que alterna la visibilidad de los badges de tecnología
 */
function toggleProjectDetails() {
    const techBadges = document.querySelectorAll('.project-tech');
    detailsVisible = !detailsVisible;
    
    techBadges.forEach(badge => {
        badge.style.display = detailsVisible ? 'flex' : 'none';
    });

    // Cambiar el texto del botón para indicar el estado
    toggleDetailBtn.textContent = detailsVisible ? 'Ocultar Detalles' : 'Ver Detalles';
}

/**
 * FUNCIÓN: Cambiar el tema de colores de las imágenes de los proyectos
 * Lógica: Rotar entre diferentes esquemas de colores predefinidos
 */
function changeTheme() {
    themeIndex = (themeIndex + 1) % themeGradients.length;
    const gradients = themeGradients[themeIndex];
    const projectImages = document.querySelectorAll('.project-image');
    
    projectImages.forEach((img, index) => {
        img.style.background = gradients[index % gradients.length];
    });

    // Cambiar el color del botón para indicar que el tema cambió
    editImageBtn.style.background = `linear-gradient(135deg, ${gradients[0]})`;
}

/**
 * FUNCIÓN: Cambiar la descripción de un proyecto específico
 * Parámetro: button - el botón que fue presionado
 * Lógica: Obtener el proyecto padre y editar su descripción interactivamente
 */
function changeProjectDetail(button) {
    // Buscar el contenedor del proyecto más cercano
    const card = button.closest('.project-card');
    const description = card.querySelector('.project-description');
    const currentText = description.textContent;
    
    // Solicitar nueva descripción al usuario
    const newText = prompt('Ingresa la nueva descripción del proyecto:', currentText);
    
    // Si el usuario no canceló, actualizar el texto
    if (newText !== null && newText.trim() !== '') {
        description.textContent = newText;
        // Pequeña animación visual para indicar que cambió
        description.style.color = '#2563EB';
        setTimeout(() => {
            description.style.color = '#666';
        }, 1500);
    }
}

// ========== CONFIGURACIÓN DE EVENT LISTENERS ==========
// Agregar eventos a los botones de filtrado
filterButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const filtro = e.target.getAttribute('data-filter');
        filterProjects(filtro);
    });
});

// Evento para el botón de mostrar/ocultar detalles
toggleDetailBtn.addEventListener('click', toggleProjectDetails);

// Evento para el botón de cambiar tema
editImageBtn.addEventListener('click', changeTheme);

// Al cargar la página, ocultar los detalles técnicos por defecto
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.project-tech').forEach(tech => {
        tech.style.display = 'none';
    });
});
