/**
 * Gallery and Lightbox functionality for Vini Rocha Art.
 * Dynamically builds illustrations grid and handles fullscreen media overlay navigation.
 */

const illustrationsData = [
  {
    id: 'japan-collection-1',
    title: 'Japan Collection I',
    category: 'Ilustração / Fine Art',
    desc: 'Estudo estético da cultura tradicional japonesa fundido a técnicas modernas de composição digital.',
    img: 'https://mir-s3-cdn-cf.behance.net/project_modules/hd/c53676196376947.661ede0955b6f.png'
  },
  {
    id: 'japan-collection-2',
    title: 'Japan Collection II',
    category: 'Ilustração / Fine Art',
    desc: 'Elementos arquitetônicos orientais e retratos conceituais com paleta sofisticada em tons pastéis e pretos gráficos.',
    img: 'https://mir-s3-cdn-cf.behance.net/project_modules/hd/1c51c7196376947.661ede09562f7.png'
  },
  {
    id: 'japan-collection-3',
    title: 'Japan Collection III',
    category: 'Ilustração / Fine Art',
    desc: 'A fusão entre formas naturais e a geometria urbana de Tóquio, emoldurando uma identidade visual contemporânea.',
    img: 'https://mir-s3-cdn-cf.behance.net/project_modules/hd/2c6fc6196376947.661ede09553b2.png'
  },
  {
    id: 'docinhos-da-ana-1',
    title: 'Docinhos da Ana I',
    category: 'Ilustração Infantil / Editorial',
    desc: 'Ilustração delicada com texturas de aquarela e traços orgânicos desenvolvida para projeto literário infantil.',
    img: 'https://mir-s3-cdn-cf.behance.net/project_modules/1400/54df24184963477.655ba1580ad8d.png'
  },
  {
    id: 'docinhos-da-ana-2',
    title: 'Docinhos da Ana II',
    category: 'Ilustração Infantil / Editorial',
    desc: 'Criação de personagens e cenários lúdicos baseados em doces e fantasias infantis coloridas.',
    img: 'https://mir-s3-cdn-cf.behance.net/project_modules/1400/676f1e184963477.655ba1580bcf8.png'
  },
  {
    id: 'docinhos-da-ana-3',
    title: 'Docinhos da Ana III',
    category: 'Ilustração Infantil / Editorial',
    desc: 'Estudos de cor e luz suave para narrativas infantis e designs de capas de livros.',
    img: 'https://mir-s3-cdn-cf.behance.net/project_modules/1400/9bf1f3184963477.655ba1580d9bd.png'
  },
  {
    id: 'space-hamburger-1',
    title: 'Space Hamburger I',
    category: 'Pop Art / 3D Art',
    desc: 'Colagem visual e modelagem conceitual unindo elementos de fast-food com a grandiosidade e mistério espacial.',
    img: 'https://mir-s3-cdn-cf.behance.net/project_modules/1400/16904b196363679.661eb46fcc8e4.png'
  },
  {
    id: 'space-hamburger-2',
    title: 'Space Hamburger II',
    category: 'Pop Art / 3D Art',
    desc: 'Exploração tipográfica e cromática surrealista sobre comida flutuante no cosmos.',
    img: 'https://mir-s3-cdn-cf.behance.net/project_modules/hd/dd5294196363679.661eb46fcd06b.png'
  },
  {
    id: 'godzilla',
    title: 'Godzilla',
    category: 'Arte Conceitual / Poster',
    desc: 'Poster conceitual de escala colossal reimaginando o monstro sob uma paleta monocromática de alto impacto e fumaça vermelha.',
    img: 'https://mir-s3-cdn-cf.behance.net/project_modules/1400/000a43193453631.65ebe9604742d.png'
  },
  {
    id: 'cat',
    title: 'Gato Minimalista',
    category: 'Ilustração / Minimalismo',
    desc: 'Estudo expressivo de silhueta felina com linhas limpas, sombras pesadas e formas geométricas puras.',
    img: 'https://mir-s3-cdn-cf.behance.net/project_modules/hd/818805194931315.66046c4b63383.png'
  }
];

let currentImageIndex = 0;

function initializeGallery() {
  const gridContainer = document.querySelector('.illustrations-grid');
  if (!gridContainer) return;

  // Render only if grid is empty
  if (gridContainer.children.length === 0) {
    gridContainer.innerHTML = '';
    illustrationsData.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'illustration-card scroll-fade-in';
      card.setAttribute('data-index', index);
      card.innerHTML = `
        <img src="${item.img}" alt="${item.title}" loading="lazy">
        <div class="illustration-overlay">
          <h3 class="illustration-title">${item.title}</h3>
          <p class="illustration-desc">${item.category}</p>
        </div>
      `;
      card.addEventListener('click', () => openLightbox(index));
      gridContainer.appendChild(card);
    });

    // Re-initialize scroll fade in animations for dynamic content
    if (window.initScrollObserver) {
      window.initScrollObserver();
    }
  }
}

// Lightbox Logic
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.querySelector('.lightbox-img');
const lightboxTitle = document.querySelector('.lightbox-title');
const lightboxDesc = document.querySelector('.lightbox-desc');
const lightboxCloseBtn = document.querySelector('.lightbox-close');
const lightboxPrevBtn = document.querySelector('.lightbox-prev');
const lightboxNextBtn = document.querySelector('.lightbox-next');

function openLightbox(index) {
  currentImageIndex = index;
  updateLightboxContent();
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden'; // prevent page scrolling

  // Event Listeners for controls
  lightboxCloseBtn.addEventListener('click', closeLightbox);
  lightboxPrevBtn.addEventListener('click', prevImage);
  lightboxNextBtn.addEventListener('click', nextImage);
  lightbox.addEventListener('click', handleOutsideClick);
  document.addEventListener('keydown', handleKeyPress);
}

function updateLightboxContent() {
  const item = illustrationsData[currentImageIndex];
  
  // Fade transition inside lightbox
  lightboxImg.style.opacity = '0';
  setTimeout(() => {
    lightboxImg.src = item.img;
    lightboxImg.alt = item.title;
    lightboxTitle.textContent = item.title;
    lightboxDesc.textContent = item.desc;
    
    lightboxImg.onload = () => {
      lightboxImg.style.opacity = '1';
    };
  }, 150);
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = ''; // restore scrolling
  
  // Cleanup event listeners
  lightboxCloseBtn.removeEventListener('click', closeLightbox);
  lightboxPrevBtn.removeEventListener('click', prevImage);
  lightboxNextBtn.removeEventListener('click', nextImage);
  lightbox.removeEventListener('click', handleOutsideClick);
  document.removeEventListener('keydown', handleKeyPress);
}

function prevImage() {
  currentImageIndex = (currentImageIndex - 1 + illustrationsData.length) % illustrationsData.length;
  updateLightboxContent();
}

function nextImage() {
  currentImageIndex = (currentImageIndex + 1) % illustrationsData.length;
  updateLightboxContent();
}

function handleOutsideClick(e) {
  // Close if click is on the backdrop or on the container wrapper, not on controls/image
  if (e.target === lightbox || e.target.classList.contains('lightbox-image-wrapper')) {
    closeLightbox();
  }
}

function handleKeyPress(e) {
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') prevImage();
  if (e.key === 'ArrowRight') nextImage();
}

// Export initialization function globally
window.initializeGallery = initializeGallery;
window.illustrationsData = illustrationsData; // share for home vertical gallery
