// Variables y configuración global
let currentSlide = 0;
const GITHUB_USERNAME = 'Nico2603'; // Cambia esto por tu nombre de usuario de GitHub
const MAX_REPOS = 6; // Número máximo de repositorios a mostrar

// Inicialización cuando el DOM está completamente cargado
document.addEventListener('DOMContentLoaded', () => {
  // Inicializar componentes
  initMobileMenu();
  initCarousel();
  initViewMoreRepos();
  initScrollAnimations();
  initDropdownMenu();
  initEmailHandling();
});

/**
 * Inicializa el menú móvil con animaciones y eventos
 */
function initMobileMenu() {
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  if (!mobileMenuToggle || !navMenu) return;
  
  mobileMenuToggle.addEventListener('click', () => {
    mobileMenuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.classList.toggle('menu-open');
    
    // Añadir índices para animar secuencialmente los items del menú
    const navItems = navMenu.querySelectorAll('.nav-item');
    navItems.forEach((item, index) => {
      item.style.setProperty('--item-index', index);
    });
  });
  
  // Cerrar menú al hacer clic en enlaces
  const navLinks = document.querySelectorAll('.nav-link:not(.dropdown-toggle)');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('active')) {
        mobileMenuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
      }
    });
  });
}

/**
 * Inicializa los menús desplegables para móvil
 */
function initDropdownMenu() {
  const dropdownItems = document.querySelectorAll('.nav-item.dropdown');
  
  dropdownItems.forEach(item => {
    const dropdownToggle = item.querySelector('.dropdown-toggle');
    const dropdownContent = item.querySelector('.dropdown-content');
    
    if (!dropdownToggle || !dropdownContent) return;
    
    // En dispositivos móviles, prevenir navegación y mostrar submenú
    dropdownToggle.addEventListener('click', (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        item.classList.toggle('active');
        
        // Añadir índices para animar secuencialmente los enlaces del dropdown
        const dropdownLinks = item.querySelectorAll('.dropdown-content a');
        dropdownLinks.forEach((link, index) => {
          link.style.setProperty('--link-index', index);
        });
      }
    });
    
    // Cerrar menú móvil al hacer clic en enlaces del dropdown
    const dropdownLinks = dropdownContent.querySelectorAll('a');
    dropdownLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768 && document.querySelector('.nav-menu.active')) {
          document.querySelector('.mobile-menu-toggle').classList.remove('active');
          document.querySelector('.nav-menu').classList.remove('active');
          document.body.classList.remove('menu-open');
          item.classList.remove('active');
        }
      });
    });
  });
}

/**
 * Inicializa el carrusel con navegación y eventos
 */
function initCarousel() {
  const slides = document.querySelectorAll('.carousel-slide');
  if (slides.length === 0) return;
  
  // Mostrar el primer slide
  slides[0].classList.add('active');
  
  // Configurar los botones de navegación
  const prevButton = document.querySelector('.carousel-nav.prev');
  const nextButton = document.querySelector('.carousel-nav.next');
  
  if (prevButton) {
    prevButton.addEventListener('click', () => {
      changeSlide(-1);
    });
  }
  
  if (nextButton) {
    nextButton.addEventListener('click', () => {
      changeSlide(1);
    });
  }
  
  // Cambio automático cada 5 segundos
  setInterval(() => {
    changeSlide(1);
  }, 5000);
}

/**
 * Cambia el slide actual del carrusel
 * @param {number} direction - Dirección del cambio (1: siguiente, -1: anterior)
 */
function changeSlide(direction) {
  const slides = document.querySelectorAll('.carousel-slide');
  if (slides.length === 0) return;
  
  // Eliminar clase active del slide actual
  slides[currentSlide].classList.remove('active');
  
  // Calcular el nuevo índice
  currentSlide = (currentSlide + direction + slides.length) % slides.length;
  
  // Añadir clase active al nuevo slide
  slides[currentSlide].classList.add('active');
}

/**
 * Inicializa la funcionalidad para ver más repositorios desde GitHub
 */
function initViewMoreRepos() {
  const viewMoreBtn = document.getElementById('viewMoreRepos');
  const reposContainer = document.getElementById('github-portfolio');
  
  if (!viewMoreBtn || !reposContainer) return;
  
  viewMoreBtn.addEventListener('click', async function() {
    // Si ya están visibles, alternar visibilidad
    if (reposContainer.classList.contains('visible')) {
      reposContainer.classList.remove('visible');
      viewMoreBtn.textContent = 'Ver todos los repositorios';
      viewMoreBtn.classList.remove('expanded');
      
      // Esperar a que termine la transición antes de ocultar completamente
      setTimeout(() => {
        if (!reposContainer.classList.contains('visible')) {
          reposContainer.style.display = 'none';
        }
      }, 400);
      
      return;
    }
    
    // Asegurarse de que el contenedor esté visible antes de la animación
    reposContainer.style.display = 'grid';
    
    // Mostrar estado de carga
    viewMoreBtn.innerHTML = '<span class="loading-spinner"></span>Cargando...';
    viewMoreBtn.disabled = true;
    viewMoreBtn.classList.add('expanded');
    
    try {
      // Obtener repositorios desde la API de GitHub
      const repos = await fetchGitHubRepos();
      displayRepos(repos, reposContainer);
      
      // Mostrar el contenedor con animación
      setTimeout(() => {
        reposContainer.classList.add('visible');
      }, 10); // Pequeño retraso para asegurar que la transición funcione
      
      viewMoreBtn.textContent = 'Ocultar repositorios';
    } catch (error) {
      console.error('Error al cargar los repositorios:', error);
      reposContainer.innerHTML = `
        <div class="error-message">
          <p>Lo sentimos, hubo un problema al cargar los repositorios. Por favor, inténtalo de nuevo más tarde.</p>
        </div>
      `;
      reposContainer.classList.add('visible');
      viewMoreBtn.textContent = 'Reintentar';
    } finally {
      viewMoreBtn.disabled = false;
    }
  });
}

/**
 * Obtiene los repositorios desde la API de GitHub
 * @returns {Promise<Array>} - Promesa que resuelve con los repositorios
 */
async function fetchGitHubRepos() {
  try {
    const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&direction=desc`);
    
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    
    let repos = await response.json();
    
    // Filtrar repositorios destacados y no vacíos
    repos = repos
      .filter(repo => !repo.fork && !repo.private && repo.description)
      .slice(0, MAX_REPOS);
    
    return repos;
  } catch (error) {
    console.error('Error al obtener repositorios:', error);
    throw error;
  }
}

/**
 * Muestra los repositorios en el contenedor
 * @param {Array} repos - Repositorios a mostrar
 * @param {HTMLElement} container - Contenedor donde mostrar los repositorios
 */
function displayRepos(repos, container) {
  if (!container || !repos) return;
  
  // Limpiar el contenedor
  container.innerHTML = '';
  container.style.display = 'grid';
  
  if (repos.length === 0) {
    container.innerHTML = `
      <div class="error-message">
        <p>No se encontraron repositorios públicos. Intenta más tarde.</p>
      </div>
    `;
    return;
  }
  
  // Añadir cada repositorio
  repos.forEach(repo => {
    const repoEl = document.createElement('div');
    repoEl.className = 'repo';
    
    // Crear el HTML para el repositorio
    repoEl.innerHTML = `
      <h3>${repo.name}</h3>
      <p>${repo.description || 'Sin descripción'}</p>
      <div class="repo-meta">
        ${repo.language ? `<span class="repo-language">${repo.language}</span>` : ''}
        <span class="repo-stars"><i class="fas fa-star"></i> ${repo.stargazers_count}</span>
        <span class="repo-forks"><i class="fas fa-code-branch"></i> ${repo.forks_count}</span>
      </div>
      <a href="${repo.html_url}" class="repo-link" target="_blank" rel="noopener noreferrer">
        Ver en GitHub <i class="fas fa-external-link-alt"></i>
      </a>
    `;
    
    container.appendChild(repoEl);
  });
}

/**
 * Inicializa animaciones al desplazarse por la página
 */
function initScrollAnimations() {
  // Detectar elementos que deben animarse al entrar en el viewport
  const animateElements = document.querySelectorAll('.section');
  
  // Callback para el Intersection Observer
  const callback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        // Dejar de observar el elemento después de animarlo
        observer.unobserve(entry.target);
      }
    });
  };
  
  // Crear un nuevo Intersection Observer
  const observer = new IntersectionObserver(callback, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  // Observar cada elemento
  animateElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(element);
  });
}

/**
 * Inicializa el manejo especial para enlaces de correo electrónico
 * Detecta si es PC o móvil para abrir Gmail en PC o la app de correo en móvil
 */
function initEmailHandling() {
  const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
  
  emailLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      // Detectar si es dispositivo móvil
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      if (!isMobile) {
        e.preventDefault();
        const href = this.getAttribute('href');
        
        // Extraer información del mailto
        const mailtoInfo = href.substring(7); // Quitar "mailto:"
        const parts = mailtoInfo.split('?');
        const email = parts[0];
        
        // Analizar parámetros
        let subject = '';
        let body = '';
        
        if (parts.length > 1) {
          const params = new URLSearchParams(parts[1]);
          subject = params.get('subject') || '';
          body = params.get('body') || '';
        }
        
        // Construir URL para Gmail
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        
        // Abrir Gmail en una nueva pestaña
        window.open(gmailUrl, '_blank');
      }
      // En móvil, deja que el enlace mailto funcione normalmente
    });
  });
}
