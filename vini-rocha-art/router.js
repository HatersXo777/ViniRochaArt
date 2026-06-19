/**
 * Simple Single Page Application Router for Vini Rocha Art website.
 * Manages hash routing, page transitions, active nav states, and SEO metadata update.
 */

const routes = {
  'home': {
    title: 'Vini Rocha Art | Portfólio de Arte Visual',
    description: 'Explore o portfólio de arte visual de Vinicius Rocha. Ilustrações contemporâneas, projetos de design e contato.',
    init: () => {
      // Re-trigger scroll animations on home
      if (window.initializeHomeScroll) {
        window.initializeHomeScroll();
      }
    }
  },
  'ilustracoes': {
    title: 'Ilustrações | Vini Rocha Art',
    description: 'Galeria completa de ilustrações autorais e estudos visuais de Vini Rocha. Arte digital, surrealismo e minimalismo.',
    init: () => {
      if (window.initializeGallery) {
        window.initializeGallery();
      }
    }
  },
  'projetos': {
    title: 'Projetos | Vini Rocha Art',
    description: 'Projetos e direções de arte desenvolvidos por Vini Rocha. Design editorial, identidade de marca e artes conceituais.',
    init: () => {
      if (window.initializeProjects) {
        window.initializeProjects();
      }
    }
  },
  'fale-comigo': {
    title: 'Fale Comigo | Vini Rocha Art',
    description: 'Entre em contato com o artista visual Vinicius Rocha. Disponível para projetos comerciais, parcerias e encomendas.',
    init: () => {}
  }
};

class Router {
  constructor() {
    this.loadingBar = document.querySelector('.page-loading-bar');
    window.addEventListener('hashchange', () => this.handleRoute());
    window.addEventListener('DOMContentLoaded', () => this.handleRoute());
  }

  handleRoute() {
    // Start page loading simulation
    this.startLoading();

    let hash = window.location.hash.slice(1) || 'home';
    let baseRoute = hash.split('/')[0];
    let routeParam = hash.split('/')[1];

    // Close mobile menu on transition
    if (window.closeMobileMenu) {
      window.closeMobileMenu();
    }

    // Check if the route exists
    if (routes[baseRoute]) {
      this.switchPage(baseRoute, routeParam);
    } else {
      // Default fallback
      window.location.hash = '#home';
    }
  }

  startLoading() {
    if (this.loadingBar) {
      this.loadingBar.style.width = '0%';
      this.loadingBar.classList.remove('complete');
      this.loadingBar.classList.add('start');
      setTimeout(() => {
        this.loadingBar.style.width = '70%';
      }, 50);
    }
  }

  finishLoading() {
    if (this.loadingBar) {
      this.loadingBar.style.width = '100%';
      this.loadingBar.classList.remove('start');
      this.loadingBar.classList.add('complete');
    }
  }

  switchPage(route, param) {
    const currentActiveSection = document.querySelector('.view-section.active');
    
    // If transitioning to a project detail page
    if (route === 'projetos' && param) {
      this.renderProjectDetail(param, currentActiveSection);
      return;
    }

    const targetSection = document.getElementById(route);
    if (!targetSection) {
      this.finishLoading();
      return;
    }

    // Ensure project details is hidden when entering main projects list
    const projectDetailSection = document.getElementById('projeto-detalhe');
    if (projectDetailSection) {
      projectDetailSection.classList.remove('active');
    }

    this.transitionView(currentActiveSection, targetSection, () => {
      // Update metadata
      document.title = routes[route].title;
      this.updateMetaDescription(routes[route].description);
      
      // Update nav link active state
      this.updateNavLinks(route);

      // Scroll smoothly to top
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Run page initialization script
      routes[route].init();
      
      this.finishLoading();
    });
  }

  renderProjectDetail(projectId, currentActiveSection) {
    const targetSection = document.getElementById('projeto-detalhe');
    if (!targetSection) {
      this.finishLoading();
      return;
    }

    // Load project data and construct detail page
    if (window.loadProjectDetail && window.loadProjectDetail(projectId)) {
      this.transitionView(currentActiveSection, targetSection, () => {
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.updateNavLinks('projetos');
        this.finishLoading();
      });
    } else {
      // If project not found, redirect to list
      window.location.hash = '#projetos';
    }
  }

  transitionView(fromSection, toSection, onHalfway) {
    if (fromSection && fromSection !== toSection) {
      // Fade out current section
      fromSection.style.opacity = '0';
      fromSection.style.transform = 'translateY(15px)';

      setTimeout(() => {
        fromSection.classList.remove('active');
        
        // Setup target section
        toSection.classList.add('active');
        // Force reflow
        toSection.offsetHeight;
        
        onHalfway();

        // Fade in target section
        toSection.style.opacity = '1';
        toSection.style.transform = 'translateY(0)';
      }, 300); // matches transition time
    } else {
      // Initial page load
      toSection.classList.add('active');
      toSection.style.opacity = '1';
      toSection.style.transform = 'translateY(0)';
      onHalfway();
    }
  }

  updateNavLinks(activeRoute) {
    // Desktop Nav Links
    document.querySelectorAll('.nav-link').forEach(link => {
      if (link.getAttribute('href') === `#${activeRoute}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Mobile Nav Links
    document.querySelectorAll('.nav-mobile-link').forEach(link => {
      if (link.getAttribute('href') === `#${activeRoute}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  updateMetaDescription(description) {
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    }
    
    // Update Open Graph tags as well
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', description);
    }
  }
}

// Instantiate router
window.appRouter = new Router();
