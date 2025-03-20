// Función para cargar el portafolio desde la API de GitHub
function loadGithubPortfolio() {
  const username = "Nico2603"; // Actualiza con tu nombre de usuario de GitHub
  const apiURL = `https://api.github.com/users/${username}/repos`;
  
  fetch(apiURL)
    .then(response => response.json())
    .then(data => {
      const portfolioContainer = document.getElementById("github-portfolio");
      if (portfolioContainer) {
        portfolioContainer.innerHTML = ''; // Limpiar contenido previo
        data.forEach(repo => {
          const repoDiv = document.createElement("div");
          repoDiv.classList.add("repo");
          repoDiv.innerHTML = `
            <h3><a href="${repo.html_url}" target="_blank">${repo.name}</a></h3>
            <p>${repo.description ? repo.description : ""}</p>
          `;
          portfolioContainer.appendChild(repoDiv);
        });
      }
    })
    .catch(error => console.error("Error al cargar repositorios:", error));
}

// Función para implementar scroll suave en los enlaces de navegación
function initSmoothScroll() {
  document.querySelectorAll('a.nav-link, a.nav-logo, a.u-btn-1').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      if (this.hash !== "") {
        e.preventDefault();
        const target = document.querySelector(this.hash);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });
}

// Función para aplicar animaciones suaves en cada sección mediante IntersectionObserver
function initSPA() {
  const sections = document.querySelectorAll("section");
  const observerOptions = {
    threshold: 0.3
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
}

// Función para iniciar un carrusel automático (si existe un contenedor de carrusel)
function initCarousel() {
  const carouselContainer = document.querySelector('.carousel-container');
  if (!carouselContainer) return;
  
  const carouselSlides = carouselContainer.querySelectorAll('.carousel-slide');
  let currentSlide = 0;
  
  // Función para mostrar el slide indicado
  function showSlide(index) {
    carouselSlides.forEach((slide, i) => {
      slide.classList.toggle("active", i === index);
    });
  }
  
  // Función para avanzar al siguiente slide
  function nextSlide() {
    currentSlide = (currentSlide + 1) % carouselSlides.length;
    showSlide(currentSlide);
  }
  
  // Inicia el intervalo para el carrusel (cada 7 segundos)
  let carouselInterval = setInterval(nextSlide, 7000);
  
  // Pausa el carrusel al hacer hover y reanuda al quitarlo
  carouselContainer.addEventListener('mouseenter', () => clearInterval(carouselInterval));
  carouselContainer.addEventListener('mouseleave', () => {
    carouselInterval = setInterval(nextSlide, 7000);
  });
  
  // Muestra el primer slide inicialmente
  showSlide(currentSlide);
}

// Iniciar todas las funciones cuando el DOM esté cargado
document.addEventListener("DOMContentLoaded", () => {
  loadGithubPortfolio();
  initSmoothScroll();
  initSPA();
  initCarousel();
});
