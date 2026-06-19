/**
 * Main application initializer for Vini Rocha Art.
 * Coordinates UI states, mobile menu, scroll effects, parallax, and vertical home gallery.
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initMobileMenu();
  initScrollObserver();
  initParallaxEffect();
  initializeHomeScroll(); // initial load trigger
});

// 1. Header scroll visual indicator
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // run once on start
}

// 2. Mobile Menu hamburger and overlay
function initMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const navMobile = document.querySelector('.nav-mobile');
  const navMobileLinks = document.querySelectorAll('.nav-mobile-link');

  if (!menuToggle || !navMobile) return;

  const toggleMenu = () => {
    menuToggle.classList.toggle('open');
    navMobile.classList.toggle('open');
    if (navMobile.classList.contains('open')) {
      document.body.style.overflow = 'hidden'; // lock background scrolling
    } else {
      document.body.style.overflow = '';
    }
  };

  const closeMenu = () => {
    menuToggle.classList.remove('open');
    navMobile.classList.remove('open');
    document.body.style.overflow = '';
  };

  menuToggle.addEventListener('click', toggleMenu);
  navMobileLinks.forEach(link => link.addEventListener('click', closeMenu));

  // Export close function so router can trigger it on page change
  window.closeMobileMenu = closeMenu;
}

// 3. Dynamic Scroll Observer for Fade-in effects
function initScrollObserver() {
  const fadeElements = document.querySelectorAll('.scroll-fade-in, .gallery-item-vertical');
  if (fadeElements.length === 0) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        // Once in view, we can unobserve if we only want animate-once behavior
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  fadeElements.forEach(el => observer.observe(el));
}

// 4. Parallax Effect for Vertical Gallery Images
function initParallaxEffect() {
  const parallaxContainers = document.querySelectorAll('.vertical-img-container');
  if (parallaxContainers.length === 0) return;

  const handleParallax = () => {
    parallaxContainers.forEach(container => {
      const img = container.querySelector('img');
      if (!img) return;

      const rect = container.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Check if container is partially in viewport
      if (rect.top < viewportHeight && rect.bottom > 0) {
        // Calculate scroll progress percentage through the viewport
        const totalDistance = viewportHeight + rect.height;
        const currentProgress = (viewportHeight - rect.top) / totalDistance;
        
        // Translate the image scale position slightly (e.g. from -5% to 5%)
        const moveAmount = (currentProgress - 0.5) * 40; // max 20px translation either way
        img.style.transform = `scale(1.1) translateY(${moveAmount}px)`;
      }
    });
  };

  window.addEventListener('scroll', handleParallax);
  window.addEventListener('resize', handleParallax);
  // run once
  setTimeout(handleParallax, 200);
}

// 5. Initialize Vertical Gallery on Home View
function initializeHomeScroll() {
  const homeFeed = document.querySelector('.vertical-gallery');
  if (!homeFeed) return;

  // Build vertical gallery if empty
  if (homeFeed.children.length === 0) {
    homeFeed.innerHTML = '';
    
    // Use all 10 premium Behance illustrations for the home feed
    const homeWorks = window.illustrationsData;


    homeWorks.forEach((work, index) => {
      if (!work) return;

      const item = document.createElement('div');
      item.className = 'gallery-item-vertical';
      item.innerHTML = `
        <div class="vertical-img-container" data-speed="1.5">
          <img src="${work.img}" alt="${work.title}">
        </div>
        <div class="vertical-img-caption">
          <h3 class="vertical-img-title">${work.title}</h3>
          <span class="vertical-img-category">${work.category}</span>
        </div>
      `;

      // Navigate to gallery lightbox on click
      item.addEventListener('click', () => {
        // Go to illustrations page and open the lightbox
        window.location.hash = '#ilustracoes';
        // Delay slightly to wait for page switch animation, then open
        setTimeout(() => {
          if (window.initializeGallery) {
            // Find index in original data
            const origIndex = window.illustrationsData.findIndex(w => w.id === work.id);
            if (origIndex !== -1) {
              window.openLightbox ? window.openLightbox(origIndex) : null;
            }
          }
        }, 400);
      });

      homeFeed.appendChild(item);
    });

    // Reinitialize scroll triggers & parallax
    setTimeout(() => {
      initScrollObserver();
      initParallaxEffect();
    }, 100);
  }
}

// Export initializers globally
window.initScrollObserver = initScrollObserver;
window.initParallaxEffect = initParallaxEffect;
window.initializeHomeScroll = initializeHomeScroll;
