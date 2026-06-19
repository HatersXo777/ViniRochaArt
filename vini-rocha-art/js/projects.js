/**
 * Projects and Project details module for Vini Rocha Art.
 * Handles loading project cards grid and dynamic generation of individual project pages.
 */

const projectsData = {
  'branding-exposicao': {
    id: 'branding-exposicao',
    title: 'Identidade Visual: Museu de Arte Moderna',
    category: 'Identidade & Editorial',
    year: '2026',
    client: 'Museu de Arte Contemporânea',
    role: 'Diretor de Arte e Designer',
    coverImg: 'assets/projects/proj_branding.png',
    description: 'Projeto completo de branding e design editorial desenvolvido para a exposição anual de artes visuais contemporâneas.',
    longDescription: `
      <p>Desenvolvimento do sistema de identidade visual e comunicação integrada para a exposição anual do Museu de Arte Contemporânea. A proposta conceitual partiu de formas geométricas abstratas puras e de uma paleta de alto contraste cromático para estabelecer diálogo direto com a arte contemporânea exposta.</p>
      <p>O projeto abrangeu o design de cartazes promocionais em larga escala, sinalização interna do museu, catálogos editoriais refinados para os visitantes e a interface do aplicativo oficial da mostra. Cada ponto de contato foi pensado para valorizar o espaço em branco, a sofisticação tipográfica e o impacto estético das cores institucionais.</p>
    `,
    gallery: [
      'assets/projects/proj_branding.png',
      'assets/illustrations/art_abstract.png',
      'assets/illustrations/art_scifi.png'
    ]
  },
  'ecos-do-silencio': {
    id: 'ecos-do-silencio',
    title: 'Livro de Arte: Ecos do Silêncio',
    category: 'Fine Art & Editorial',
    year: '2025',
    client: 'Editora Antropia / Autoral',
    role: 'Artista Visual & Editor',
    coverImg: 'assets/projects/proj_echoes.png',
    description: 'Livro autoral compilando pinturas digitais surrealistas sobre isolamento, imensidão e paisagens metafísicas.',
    longDescription: `
      <p>"Ecos do Silêncio" é uma compilação editorial que reúne cinco anos de trabalho autoral em pintura digital e ilustração conceitual. As artes giram em torno de temas como a pequenez humana diante do cosmos, o silêncio visual dos desertos e a arquitetura onírica dos sonhos.</p>
      <p>O livro foi impresso em papel Fine Art texturizado de alta gramatura, com acabamento de capa dura em tecido escuro e detalhes em hot-stamping laranja vibrante, transpondo para a matéria física a exata energia cromática pensada na tela. Este projeto representa a consolidação da identidade artística de Vini Rocha no cenário nacional.</p>
    `,
    gallery: [
      'assets/projects/proj_echoes.png',
      'assets/illustrations/art_surreal.png',
      'assets/illustrations/art_portrait.png'
    ]
  }
};

function initializeProjects() {
  const projectsGrid = document.querySelector('.projects-grid');
  if (!projectsGrid) return;

  // Render cards only if grid is empty
  if (projectsGrid.children.length === 0) {
    projectsGrid.innerHTML = '';
    
    Object.values(projectsData).forEach(project => {
      const card = document.createElement('div');
      card.className = 'project-card scroll-fade-in';
      card.innerHTML = `
        <div class="project-img-wrapper">
          <img src="${project.coverImg}" alt="${project.title}" loading="lazy" class="hover-zoom-img">
        </div>
        <div class="project-info">
          <h3 class="project-card-title">${project.title}</h3>
          <p class="project-card-desc">${project.description}</p>
        </div>
      `;
      card.addEventListener('click', () => {
        window.location.hash = `#projetos/${project.id}`;
      });
      projectsGrid.appendChild(card);
    });

    if (window.initScrollObserver) {
      window.initScrollObserver();
    }
  }
}

function loadProjectDetail(projectId) {
  const project = projectsData[projectId];
  const detailContainer = document.getElementById('projeto-detalhe');
  if (!project || !detailContainer) return false;

  // Build the details content
  detailContainer.innerHTML = `
    <div class="container">
      <div class="project-detail-header">
        <a href="#projetos" class="back-to-projects-btn">
          ← Voltar para Projetos
        </a>
        <h1 class="project-detail-title">${project.title}</h1>
        
        <div class="project-meta-grid">
          <div class="project-meta-item">
            <h4>Categoria</h4>
            <p>${project.category}</p>
          </div>
          <div class="project-meta-item">
            <h4>Ano</h4>
            <p>${project.year}</p>
          </div>
          <div class="project-meta-item">
            <h4>Cliente</h4>
            <p>${project.client}</p>
          </div>
          <div class="project-meta-item">
            <h4>Função</h4>
            <p>${project.role}</p>
          </div>
        </div>
      </div>

      <div class="project-detail-body">
        <div class="project-content-text">
          ${project.longDescription}
        </div>
        <div class="project-gallery">
          ${project.gallery.map(imgSrc => `
            <img src="${imgSrc}" alt="Gallery image for ${project.title}" class="project-gallery-img scroll-fade-in" loading="lazy">
          `).join('')}
        </div>
      </div>
    </div>
  `;

  // Re-trigger scroll observer for the newly added dynamic gallery images
  setTimeout(() => {
    if (window.initScrollObserver) {
      window.initScrollObserver();
    }
  }, 100);

  return true;
}

// Export functions globally
window.initializeProjects = initializeProjects;
window.loadProjectDetail = loadProjectDetail;
