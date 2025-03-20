// app.js

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

document.addEventListener("DOMContentLoaded", () => {
  loadGithubPortfolio();
  initSmoothScroll();
});
