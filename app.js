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
    
    // Inicializar el menú móvil mejorado
    adjustMobileView();
    window.addEventListener('resize', adjustMobileView);
    
    // Función para ajustar la vista móvil
    function adjustMobileView() {
      const isSmallScreen = window.innerWidth <= 768;
      const isMobile = window.innerWidth <= 576;
      const menuToggle = document.getElementById('menuToggle');
      const navMenu = document.getElementById('navMenu');
      const navItems = document.querySelectorAll('.nav-menu .nav-item');
      
      // Mantener visible el enlace de "Inicio" y el título en pantallas pequeñas
      if (isSmallScreen && navItems.length > 0) {
        // Asegurar que el primer elemento (Inicio) permanezca visible
        navItems[0].style.display = 'inline-block';
        
        // Hacer que los demás elementos se muestren solo cuando el menú está activo
        for (let i = 1; i < navItems.length; i++) {
          navItems[i].style.display = navMenu.classList.contains('active') ? 'block' : 'none';
        }
      } else {
        // En pantallas grandes, mostrar todos los elementos de navegación
        navItems.forEach(item => {
          item.style.display = '';
        });
      }
      
      // Ajustar la altura de la sección "Labores Destacadas" para móvil
      const carouselContainers = document.querySelectorAll('.carousel-container');
      carouselContainers.forEach(container => {
        if (isSmallScreen) {
          // En móvil, asegurar que haya espacio suficiente para el contenido
          container.style.minHeight = isMobile ? '520px' : '480px';
          
          // Ajustar la altura del contenido de texto
          const contentElements = container.querySelectorAll('.carousel-content');
          contentElements.forEach(content => {
            // En móvil, dar mucho más espacio al contenido
            content.style.minHeight = isMobile ? '320px' : '230px';
            content.style.maxHeight = isMobile ? '320px' : '230px';
            
            // Asegurar que los botones sean visibles
            const buttons = content.querySelectorAll('.u-btn-1');
            buttons.forEach(button => {
              if (isMobile) {
                button.style.display = 'inline-block';
                button.style.margin = '20px auto 10px';
                button.style.position = 'relative';
                button.style.zIndex = '10';
                button.style.padding = '8px 20px';
              } else {
                button.style.display = '';
                button.style.margin = '';
                button.style.position = '';
                button.style.zIndex = '';
                button.style.padding = '';
              }
            });
          });
        } else {
          // En pantallas grandes, usar los valores del CSS
          container.style.minHeight = '';
          const contentElements = container.querySelectorAll('.carousel-content');
          contentElements.forEach(content => {
            content.style.minHeight = '';
            content.style.maxHeight = '';
            
            // Restaurar estilos de botones
            const buttons = content.querySelectorAll('.u-btn-1');
            buttons.forEach(button => {
              button.style.display = '';
              button.style.margin = '';
              button.style.position = '';
              button.style.zIndex = '';
              button.style.padding = '';
            });
          });
        }
      });
      
      // Ajustar espacio entre secciones y footer en móvil
      if (isMobile) {
        const footer = document.querySelector('.u-footer');
        const lastSection = document.querySelector('.u-section-4');
        
        if (footer && lastSection) {
          lastSection.style.paddingBottom = '40px'; // Reducir el espacio
          footer.style.marginTop = '10px';
        }
      }
      
      // Asegurar que la primera sección esté pegada al navbar
      const firstSection = document.querySelector('.u-section-1');
      if (firstSection) {
        firstSection.style.paddingTop = isSmallScreen ? '50px' : '60px';
        firstSection.style.marginTop = '0';
      }
    }
    
    // Mejorar el manejo del botón de hamburguesa y su interacción
    const menuToggle = document.getElementById('menuToggle');
    if (menuToggle) {
      menuToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        toggleMobileMenu();
        // Actualizar la visualización después de cambiar el estado del menú
        adjustMobileView();
      });
    }
    
    function toggleMobileMenu() {
      menuToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
      document.body.classList.toggle('menu-open');
    }
    
    // Manejar dropdowns en móvil - corregido para funcionar en cualquier tamaño de pantalla
    const dropdownItems = document.querySelectorAll('.nav-item.dropdown');
    dropdownItems.forEach(item => {
      const link = item.querySelector('.nav-link');
      
      link.addEventListener('click', function(e) {
        // En móvil, el clic en dropdown solo despliega el menú en vez de navegar
        if (window.innerWidth <= 576) {
          e.preventDefault();
          
          // Cerrar otros dropdowns
          dropdownItems.forEach(otherItem => {
            if (otherItem !== item) {
              otherItem.classList.remove('active');
            }
          });
          
          // Alternar el dropdown actual
          item.classList.toggle('active');
        }
      });
    });
    
    // Manejar clics en enlaces dentro de dropdowns
    document.querySelectorAll('.dropdown-content a').forEach(link => {
      link.addEventListener('click', function() {
        if (window.innerWidth <= 576) {
          setTimeout(() => {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
            document.body.classList.remove('menu-open');
          }, 300);
        }
      });
    });
    
    // Cerrar menú al hacer clic en enlaces directos (no dropdown)
    document.querySelectorAll('.nav-item:not(.dropdown) .nav-link').forEach(link => {
      link.addEventListener('click', function() {
        if (window.innerWidth <= 576) {
          setTimeout(() => {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
            document.body.classList.remove('menu-open');
          }, 300);
        }
      });
    });
    
    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', function(e) {
      if (navMenu.classList.contains('active') && 
          !navMenu.contains(e.target) && 
          !menuToggle.contains(e.target)) {
        navMenu.classList.remove('active');
        menuToggle.classList.remove('active');
        document.body.classList.remove('menu-open');
      }
    });
    
    // Ajustar altura de elementos en móvil para mejorar visualización
    function adjustMobileHeights() {
      if (window.innerWidth <= 576) {
        const carouselSlides = document.querySelectorAll('.carousel-slide');
        carouselSlides.forEach(slide => {
          const img = slide.querySelector('img');
          const content = slide.querySelector('.carousel-content');
          if (img && content) {
            // Asegurar que la altura del contenido se ajuste según la cantidad de texto
            content.style.height = 'auto';
            content.style.minHeight = '180px'; 
          }
        });
      }
    }
    
    // Llamar ajuste al cargar y cuando cambie el tamaño de ventana
    adjustMobileHeights();
    window.addEventListener('resize', adjustMobileHeights);
    
    // Verificación adicional del menú móvil después de carga completa
    window.addEventListener('load', function() {
      // Forzar visibilidad del menú hamburguesa en móvil
      if (window.innerWidth <= 576 && menuToggle) {
        menuToggle.style.display = 'block';
      }
    });
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
        
        // Eliminamos la actualización de URL para que no afecte la navegación
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
        
        // Eliminamos la actualización de URL para evitar cambios en la navegación
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
    // Agregar listener para mostrar/ocultar repositorios
    viewMoreBtn.addEventListener('click', function() {
      if (!reposContainer.classList.contains('visible')) {
        // Si los repos no están cargados aún, hacer la petición a la API
        if (reposContainer.children.length === 0) {
          // Mostrar loader mientras se cargan los repos
          viewMoreBtn.innerHTML = '<span class="loading-spinner"></span> Cargando repositorios...';
          viewMoreBtn.disabled = true;
          
          // Cargar repositorios desde GitHub
          loadRepositories();
        } else {
          // Si ya están cargados, solo mostrarlos
          showRepositories();
        }
      } else {
        // Ocultar repositorios con animación
        hideRepositories();
      }
    });
    
    // Función para cargar repositorios desde la API
    function loadRepositories() {
      const username = "Nico2603"; // Nombre de usuario de GitHub
      const apiURL = `https://api.github.com/users/${username}/repos`;
      const mainProjects = ['ChatBot-MentalHealth', 'PdM-Manager', 'FastQA-HomePage', 'magiacafetera-ui'];
      
      fetch(apiURL)
        .then(response => {
          if (!response.ok) {
            throw new Error('Error al obtener repositorios');
          }
          return response.json();
        })
        .then(data => {
          // Filtrar para no incluir los proyectos principales
          const otherRepos = data.filter(repo => !mainProjects.includes(repo.name));
          
          // Limpiar contenedor
          reposContainer.innerHTML = '';
          
          // Crear tarjetas para cada repositorio
          otherRepos.forEach((repo, index) => {
            const repoDiv = document.createElement("div");
            repoDiv.classList.add("repo");
            repoDiv.style.setProperty('--item-index', index);
            
            // Crear el HTML para el repositorio
            repoDiv.innerHTML = `
              <h3><a href="${repo.html_url}" target="_blank" rel="noopener">${repo.name}</a></h3>
              <p>${repo.description || "Repositorio de código en GitHub."}</p>
              <div class="repo-meta">
                <span class="repo-language">${repo.language || 'N/A'}</span>
                <span class="repo-stars">⭐ ${repo.stargazers_count}</span>
                <span class="repo-forks">🍴 ${repo.forks_count}</span>
              </div>
              <a href="${repo.html_url}" class="repo-link" target="_blank" rel="noopener">Ver en GitHub <i class="fas fa-external-link-alt"></i></a>
            `;
            
            // Agregar al contenedor
            reposContainer.appendChild(repoDiv);
          });
          
          // Mostrar los repositorios
          showRepositories();
        })
        .catch(error => {
          console.error("Error al cargar repositorios:", error);
          reposContainer.innerHTML = `
            <div class="error-message">
              <p>No se pudieron cargar los repositorios. Intente más tarde.</p>
            </div>
          `;
          showRepositories();
        })
        .finally(() => {
          // Restaurar el botón
          viewMoreBtn.innerHTML = 'Ocultar repositorios adicionales';
          viewMoreBtn.disabled = false;
        });
    }
    
    // Función para mostrar los repositorios con animación
    function showRepositories() {
      // Mostrar el contenedor
      reposContainer.style.display = 'grid';
      
      // Aplicar clase para la animación después de un pequeño retraso
      setTimeout(() => {
        reposContainer.classList.add('visible');
      }, 10);
      
      // Cambiar texto del botón
      viewMoreBtn.textContent = 'Ocultar repositorios adicionales';
    }
    
    // Función para ocultar los repositorios con animación
    function hideRepositories() {
      // Remover clase para iniciar la animación de salida
      reposContainer.classList.remove('visible');
      
      // Ocultar completamente después de que termine la animación
      setTimeout(() => {
        reposContainer.style.display = 'none';
      }, 400);
      
      // Cambiar texto del botón
      viewMoreBtn.textContent = 'Ver todos los repositorios';
    }
  }
}

// Funciones para la experiencia móvil moderna
document.addEventListener('DOMContentLoaded', function() {
  // Referencias a elementos
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const body = document.body;
  const navItems = document.querySelectorAll('.nav-item');
  
  // Asignar índices a los items para transiciones escalonadas
  navItems.forEach((item, index) => {
    item.style.setProperty('--item-index', index);
  });
  
  // Toggle del menú
  if (menuToggle) {
    menuToggle.addEventListener('click', function() {
      this.classList.toggle('active');
      navMenu.classList.toggle('active');
      body.classList.toggle('menu-open');
    });
  }
  
  // Cerrar menú al hacer click en un enlace
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      if (menuToggle) {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        body.classList.remove('menu-open');
      }
    });
  });
  
  // Animación al scroll
  const fadeElements = document.querySelectorAll('.u-text-1, .u-text-2, .carousel-container, .project-card, .social-icons-presentation a, .social-icons-contact a');
  fadeElements.forEach(el => {
    el.classList.add('fade-in-element');
  });
  
  // Observer para detectar elementos en viewport
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });
  
  // Observar todos los elementos
  fadeElements.forEach(el => {
    observer.observe(el);
  });
  
  // Transición entre páginas
  const pageTransition = document.createElement('div');
  pageTransition.className = 'page-transition';
  pageTransition.innerHTML = '<span class="loader"></span>';
  document.body.appendChild(pageTransition);
  
  // Mostrar transición al cambiar de página
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if(targetId !== '#' && document.querySelector(targetId)) {
        e.preventDefault();
        pageTransition.classList.add('active');
        
        setTimeout(() => {
          window.location.hash = targetId;
          pageTransition.classList.remove('active');
          
          // Scroll suave a la sección
          const targetElement = document.querySelector(targetId);
          if (targetElement) {
            window.scrollTo({
              top: targetElement.offsetTop - 70, // Ajustar para compensar navbar
              behavior: 'smooth'
            });
          }
        }, 500);
      }
    });
  });
  
  // Detectar scroll para aplicar efectos al navbar
  let lastScrollTop = 0;
  window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    const header = document.querySelector('header#main-header');
    
    if (header) {
      if (currentScroll > lastScrollTop && currentScroll > 100) {
        // Scroll hacia abajo - ocultar navbar
        header.style.transform = 'translateY(-100%)';
      } else {
        // Scroll hacia arriba o inicio - mostrar navbar
        header.style.transform = 'translateY(0)';
      }
      
      // Cambiar apariencia al hacer scroll
      if (currentScroll > 50) {
        header.style.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.1)';
        header.style.height = '50px';
      } else {
        header.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.08)';
        header.style.height = '60px';
      }
      
      lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    }
  }, { passive: true });
  
  // Efecto de ripple para botones
  const buttons = document.querySelectorAll('.u-btn-1, .view-more-btn, .carousel-content .u-btn-1');
  
  buttons.forEach(button => {
    button.addEventListener('click', function(e) {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const ripple = document.createElement('span');
      ripple.className = 'ripple-effect';
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      
      this.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
  
  // Inicializar carrusel con scroll unificado si estamos en móvil
  if (window.innerWidth <= 768) {
    unifyCarouselScroll();
  }
  
  // Mantener el scroll unificado al cambiar el tamaño de la ventana
  window.addEventListener('resize', function() {
    if (window.innerWidth <= 768) {
      unifyCarouselScroll();
    }
  });
  
  function unifyCarouselScroll() {
    // Asegurar que todos los elementos del carrusel sean visibles
    const carouselSlides = document.querySelectorAll('.carousel-slide');
    const carouselContainer = document.querySelector('.carousel-container');
    
    if (carouselContainer && carouselSlides.length > 0) {
      // Ajustar altura del contenedor para mostrar solo el slide activo
      carouselContainer.style.height = 'auto';
      
      // Mostrar solo el slide activo y ocultar los demás
      carouselSlides.forEach(slide => {
        if (slide.classList.contains('active')) {
          slide.style.display = 'block';
          slide.style.position = 'relative';
          slide.style.opacity = '1';
        } else {
          slide.style.display = 'none';
        }
      });
    }
  }
});

// Mejorar la funcionalidad del menú hamburguesa
document.addEventListener('DOMContentLoaded', function() {
  // Obtener elementos del DOM
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  if (menuToggle && navMenu) {
    // Crear estructura de hamburguesa si no existe
    if (menuToggle.children.length === 0) {
      menuToggle.innerHTML = `
        <span></span>
        <span></span>
        <span></span>
      `;
    }
    
    // Toggle del menú al hacer clic en el botón hamburguesa
    menuToggle.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      // Toggle de clases para animaciones
      this.classList.toggle('active');
      navMenu.classList.toggle('active');
      document.body.classList.toggle('menu-open');
      
      // Animar los elementos del menú con retraso
      const items = navMenu.querySelectorAll('.nav-item');
      items.forEach((item, index) => {
        item.style.setProperty('--item-index', index);
      });
    });
    
    // Cerrar menú al hacer clic en un enlace
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', function() {
        // Solo si estamos en móvil
        if (window.innerWidth <= 768) {
          setTimeout(() => {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
          }, 100);
        }
      });
    });
    
    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', function(e) {
      // Solo si el menú está abierto y se hace clic fuera del menú y el botón
      if (navMenu.classList.contains('active') && 
          !navMenu.contains(e.target) && 
          !menuToggle.contains(e.target)) {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
      }
    });
  }
});
