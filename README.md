# Portafolio Personal de Nicolás Ceballos Brito

Este repositorio contiene el código fuente de mi página web personal, que sirve como portafolio profesional donde muestro mis proyectos, experiencia y habilidades.

## Estructura del Proyecto

```
├── index.html          # Documento HTML principal
├── style.css           # Estilos CSS 
├── app.js              # JavaScript con funcionalidad interactiva
└── images/             # Carpeta de imágenes
    ├── pic.jpg         # Foto de perfil
    ├── p1.jpg          # Imágenes del carrusel
    └── ...
```

## Características

- **Diseño Responsivo**: Adaptable a todos los dispositivos, desde móviles hasta pantallas grandes.
- **Navegación Intuitiva**: Menú de navegación con dropdowns para acceso rápido a las secciones.
- **Carrusel Interactivo**: Muestra proyectos y experiencias con navegación manual y automática.
- **Integración con GitHub**: Muestra repositorios dinámicamente mediante la API de GitHub.
- **Optimización SEO**: Metadatos y estructura semántica para mejor posicionamiento.

## Tecnologías Utilizadas

- **HTML5**: Estructura semántica con las últimas etiquetas de HTML.
- **CSS3**: Estilos modernos con variables CSS, flexbox y grid.
- **JavaScript**: Interactividad y funcionalidades dinámicas sin frameworks.
- **Font Awesome**: Iconos vectoriales para redes sociales.
- **Google Fonts**: Tipografías web optimizadas.
- **API de GitHub**: Integración para mostrar repositorios actualizados.

## Cómo Utilizarlo

1. Clona el repositorio:
   ```bash
   git clone https://github.com/Nico2603/personal-portfolio.git
   ```

2. Abre el archivo `index.html` en tu navegador para ver el sitio localmente.

3. Para personalizar:
   - Modifica `index.html` para actualizar el contenido.
   - Ajusta los estilos en `style.css`.
   - Personaliza la funcionalidad en `app.js`.
   - Reemplaza las imágenes en la carpeta `images/` con tus propias imágenes.

## Personalización

### Cambiar Usuario de GitHub

Para mostrar tus propios repositorios, edita la constante `GITHUB_USERNAME` en `app.js`:

```javascript
const GITHUB_USERNAME = 'TuUsuarioDeGitHub';
```

### Modificar Proyectos Destacados

Edita la sección con id `projects-grid` en `index.html` para mostrar tus propios proyectos.

### Actualizar Información Personal

Modifica las secciones relevantes en `index.html` para incluir tu información personal y profesional.

## Optimización

- Las imágenes están optimizadas para carga rápida.
- El CSS está organizado por componentes para facilitar el mantenimiento.
- El JavaScript utiliza funciones modernas y está estructurado para máxima eficiencia.

## Próximas Mejoras

- [ ] Implementar modo oscuro con toggle.
- [ ] Añadir filtros para categorización de proyectos.
- [ ] Integrar blog con contenido técnico.
- [ ] Mejorar accesibilidad para cumplir con WCAG 2.1.

---

## Licencia

Este proyecto está bajo la Licencia MIT. Siéntete libre de usarlo como base para tu propio portafolio personal.
