// app.js

// Definición de las rutas y sus respectivas plantillas
const routes = {
    '/perfil': document.getElementById('view-perfil').innerHTML,
    '/contacto': document.getElementById('view-contacto').innerHTML
  };
  
  // Función para renderizar la vista correspondiente
  function router() {
    // Obtiene el hash actual, si no hay, se asume '/perfil'
    const hash = window.location.hash.slice(1) || '/perfil';
    const view = routes[hash] || routes['/perfil'];
    document.getElementById('app').innerHTML = view;
    
    // Si la vista es Perfil, inicia el script para cargar repositorios de GitHub
    if (hash === '/perfil') {
      loadGithubPortfolio();
    }
  }
  
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
  
  // Escuchar cambios en el hash de la URL para enrutamiento
  window.addEventListener("hashchange", router);
  
  // Renderiza la vista al cargar la página
  window.addEventListener("DOMContentLoaded", router);
  