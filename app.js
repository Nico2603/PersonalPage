// Función para cargar el portafolio desde la API de GitHub
function loadGithubPortfolio() {
  const username = "Nico2603"; // Nombre de usuario de GitHub
  const apiURL = `https://api.github.com/users/${username}/repos`;
  const mainProjects = ['ChatBot-MentalHealth', 'PdM-Manager', 'FastQA-HomePage', 'magiacafetera-ui'];
  
  fetch(apiURL)
    .then(response => response.json())
    .then(data => {
      const portfolioContainer = document.getElementById("github-portfolio");
      if (portfolioContainer) {
        portfolioContainer.innerHTML = ''; // Limpiar contenido previo
        
        // Filtrar para no incluir los proyectos principales
        const otherRepos = data.filter(repo => !mainProjects.includes(repo.name));
        
        otherRepos.forEach(repo => {
          const repoDiv = document.createElement("div");
          repoDiv.classList.add("repo");
          repoDiv.innerHTML = `
            <h3><a href="${repo.html_url}" target="_blank">${repo.name}</a></h3>
            <p>${repo.description ? repo.description : "Repositorio de código en GitHub."}</p>
          `;
          portfolioContainer.appendChild(repoDiv);
        });
      }
    })
    .catch(error => console.error("Error al cargar repositorios:", error));
}

// Función para implementar scroll suave mejorado para enlaces internos
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      // Manejo especial para enlaces de portafolio
      if (targetId.startsWith('#portafolio-')) {
        // Primero desplazarse a la sección de portafolio
        const portfolioSection = document.getElementById('portafolio');
        if (portfolioSection) {
          portfolioSection.scrollIntoView({ behavior: 'smooth' });
          
          // Luego destacar el proyecto específico
          setTimeout(() => {
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
              targetElement.classList.add('highlighted');
              setTimeout(() => {
                targetElement.classList.remove('highlighted');
              }, 2000);
              
              // Scroll adicional para centrar el proyecto
              targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }, 500);
        }
        return;
      }
      
      // Manejo para enlaces de labores/proyectos
      if (targetId.startsWith('#proyecto')) {
        const targetElement = document.querySelector(targetId);
        if (targetElement && targetElement.classList.contains('carousel-slide')) {
          // Primero desplazarse a la sección de labores
          const laboresSection = document.getElementById('labores');
          if (laboresSection) {
            laboresSection.scrollIntoView({ behavior: 'smooth' });
            
            // Luego mostrar la diapositiva específica
            setTimeout(() => {
              const slides = document.querySelectorAll('.carousel-slide');
              slides.forEach((slide, index) => {
                if (slide.id === targetElement.id) {
                  goToSlide(index);
                }
              });
            }, 500);
          }
          return;
        }
      }
      
      // Comportamiento normal para otros enlaces
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80, // Ajuste para el navbar fijo
          behavior: 'smooth'
        });
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

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar el carrusel
    initCarousel();
    
    // Inicializar repositorios de GitHub 
    loadGithubPortfolio();
    
    // Inicializar desplazamiento suave
    initSmoothScroll();
    
    // Resaltar sección actual en nav
    initActiveNav();
    
    // Inicializar botón para ver más repositorios
    initViewMoreRepos();
    
    // Añadir clase CSS para efecto de destacado al portafolio
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      .project-card.highlighted {
        transform: translateY(-10px);
        box-shadow: 0 15px 30px rgba(0,0,0,0.2);
        transition: all 0.5s ease;
      }
    `;
    document.head.appendChild(styleElement);
});

// Función para inicializar el carrusel
function initCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    if (slides.length === 0) return;
    
    let currentSlide = 0;
    
    // Mostrar la primera diapositiva
    slides[currentSlide].classList.add('active');
    
    // Cambiar diapositivas cada 5 segundos
    setInterval(function() {
        // Ocultar la diapositiva actual
        slides[currentSlide].classList.remove('active');
        
        // Incrementar el índice de la diapositiva
        currentSlide = (currentSlide + 1) % slides.length;
        
        // Mostrar la nueva diapositiva
        slides[currentSlide].classList.add('active');
        
        // Actualizar URL con el hash del proyecto actual
        const projectId = slides[currentSlide].id;
        if (projectId) {
            history.replaceState(null, null, '#' + projectId);
        }
    }, 5000);
    
    // Añadir navegación manual para el carrusel
    const laboresSection = document.querySelector('.u-section-labores');
    if (laboresSection) {
        const prevButton = document.createElement('button');
        prevButton.className = 'carousel-nav prev';
        prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
        
        const nextButton = document.createElement('button');
        nextButton.className = 'carousel-nav next';
        nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
        
        // Funciones para la navegación manual
        prevButton.addEventListener('click', function() {
            goToSlide((currentSlide - 1 + slides.length) % slides.length);
        });
        
        nextButton.addEventListener('click', function() {
            goToSlide((currentSlide + 1) % slides.length);
        });
        
        const carouselContainer = document.querySelector('.carousel-container');
        carouselContainer.appendChild(prevButton);
        carouselContainer.appendChild(nextButton);
    }
    
    // Función para ir a una diapositiva específica
    window.goToSlide = function(index) {
        if (index < 0 || index >= slides.length) return;
        
        // Ocultar la diapositiva actual
        slides[currentSlide].classList.remove('active');
        
        // Establecer la nueva diapositiva
        currentSlide = index;
        
        // Mostrar la nueva diapositiva
        slides[currentSlide].classList.add('active');
        
        // Actualizar URL con el hash del proyecto actual
        const projectId = slides[currentSlide].id;
        if (projectId) {
            history.replaceState(null, null, '#' + projectId);
        }
    };
    
    // Manejar los enlaces directos a proyectos
    if (window.location.hash && window.location.hash.startsWith('#proyecto')) {
        const targetProject = document.querySelector(window.location.hash);
        if (targetProject && targetProject.classList.contains('carousel-slide')) {
            // Encontrar el índice del proyecto en el carrusel
            slides.forEach((slide, index) => {
                if (slide.id === targetProject.id) {
                    goToSlide(index);
                }
            });
        }
    }
}

// Función para resaltar la sección actual en el menú de navegación
function initActiveNav() {
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
                currentSection = '#' + section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === currentSection) {
                link.classList.add('active');
            }
        });
    });
}

// Función para inicializar el botón de ver más repositorios
function initViewMoreRepos() {
  const viewMoreBtn = document.getElementById('viewMoreRepos');
  const reposContainer = document.getElementById('github-portfolio');
  
  if (viewMoreBtn && reposContainer) {
    viewMoreBtn.addEventListener('click', function() {
      if (reposContainer.style.display === 'none') {
        reposContainer.style.display = 'grid';
        viewMoreBtn.textContent = 'Ocultar repositorios adicionales';
      } else {
        reposContainer.style.display = 'none';
        viewMoreBtn.textContent = 'Ver todos los repositorios';
      }
    });
  }
}
