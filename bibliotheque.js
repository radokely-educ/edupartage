/* ============================================================
   bibliotheque.js — logique filtres, recherche, tri, vue
   ============================================================ */

const cards        = Array.from(document.querySelectorAll('.res-card'));
const grid         = document.getElementById('resourcesGrid');
const countEl      = document.getElementById('resultsCount');
const emptyEl      = document.getElementById('emptyState');
const activeFiltersEl = document.getElementById('activeFilters');
const searchInput  = document.getElementById('searchInput');
const sortSelect   = document.getElementById('sortSelect');

// ---- état des filtres actifs ----
let activeFilters = { matiere: [], niveau: [], type: [], format: [] };
let searchQuery   = '';

// -------- FILTRES CHECKBOXES --------
document.querySelectorAll('[data-filter]').forEach(cb => {
  cb.addEventListener('change', () => {
    const key = cb.dataset.filter;
    if (cb.checked) {
      activeFilters[key].push(cb.value);
    } else {
      activeFilters[key] = activeFilters[key].filter(v => v !== cb.value);
    }
    applyFilters();
    renderActiveTags();
  });
});

// -------- RECHERCHE --------
searchInput.addEventListener('input', () => {
  searchQuery = searchInput.value.trim().toLowerCase();
  applyFilters();
});

document.getElementById('searchBtn')?.addEventListener('click', () => {
  searchQuery = searchInput.value.trim().toLowerCase();
  applyFilters();
});

// -------- RÉINITIALISER --------
function resetAll() {
  activeFilters = { matiere: [], niveau: [], type: [], format: [] };
  searchQuery   = '';
  searchInput.value = '';
  document.querySelectorAll('[data-filter]').forEach(cb => cb.checked = false);
  applyFilters();
  renderActiveTags();
}

document.getElementById('resetFilters')?.addEventListener('click', resetAll);
document.getElementById('resetFromEmpty')?.addEventListener('click', resetAll);

// -------- APPLIQUER FILTRES --------
function applyFilters() {
  let visible = 0;

  cards.forEach(card => {
    const m = card.dataset.matiere;
    const n = card.dataset.niveau;
    const t = card.dataset.type;
    const f = card.dataset.format;

    const matchMatiere  = activeFilters.matiere.length  === 0 || activeFilters.matiere.includes(m);
    const matchNiveau   = activeFilters.niveau.length   === 0 || activeFilters.niveau.includes(n);
    const matchType     = activeFilters.type.length     === 0 || activeFilters.type.includes(t);
    const matchFormat   = activeFilters.format.length   === 0 || activeFilters.format.includes(f);

    const text = card.innerText.toLowerCase();
    const matchSearch   = searchQuery === '' || text.includes(searchQuery);

    const show = matchMatiere && matchNiveau && matchType && matchFormat && matchSearch;
    card.style.display = show ? '' : 'none';
    if (show) visible++;
  });

  countEl.textContent = visible;
  emptyEl.style.display  = visible === 0 ? 'block' : 'none';
  document.getElementById('pagination').style.display = visible === 0 ? 'none' : 'flex';
}

// -------- TAGS FILTRES ACTIFS --------
const labelMap = {
  matiere:  { svt:'SVT', maths:'Maths', francais:'Français', histoire:'Histoire-Géo', physique:'Physique', anglais:'Anglais' },
  niveau:   { '6e':'6e', '5e':'5e', '4e':'4e', '3e':'3e' },
  type:     { cours:'Cours', examen:'Examen', correction:'Correction', exercice:'Exercice', sequence:'Séquence' },
  format:   { pdf:'PDF', word:'Word', image:'Image' }
};

function renderActiveTags() {
  activeFiltersEl.innerHTML = '';
  Object.entries(activeFilters).forEach(([key, vals]) => {
    vals.forEach(val => {
      const tag = document.createElement('span');
      tag.className = 'filter-tag';
      tag.innerHTML = `${labelMap[key][val]} <span class="filter-tag-x">×</span>`;
      tag.addEventListener('click', () => {
        activeFilters[key] = activeFilters[key].filter(v => v !== val);
        const cb = document.querySelector(`input[data-filter="${key}"][value="${val}"]`);
        if (cb) cb.checked = false;
        applyFilters();
        renderActiveTags();
      });
      activeFiltersEl.appendChild(tag);
    });
  });
}

// -------- VUE GRILLE / LISTE --------
document.getElementById('viewGrid')?.addEventListener('click', function() {
  grid.classList.remove('list-view');
  this.classList.add('active');
  document.getElementById('viewList').classList.remove('active');
});

document.getElementById('viewList')?.addEventListener('click', function() {
  grid.classList.add('list-view');
  this.classList.add('active');
  document.getElementById('viewGrid').classList.remove('active');
});

// -------- FILTRES MOBILE --------
const filtersPanel  = document.getElementById('filtersPanel');
const filtersToggle = document.getElementById('filtersToggle');
const filtersClose  = document.getElementById('filtersClose');

filtersToggle?.addEventListener('click', () => filtersPanel.classList.add('open'));
filtersClose?.addEventListener('click', () => filtersPanel.classList.remove('open'));

// -------- TRI --------
sortSelect?.addEventListener('change', () => {
  const val = sortSelect.value;
  const sorted = [...cards].sort((a, b) => {
    if (val === 'popular') {
      const getDownloads = el => parseInt(el.querySelector('.res-stats span')?.textContent) || 0;
      return getDownloads(b) - getDownloads(a);
    }
    if (val === 'note') {
      const getNote = el => parseFloat(el.querySelectorAll('.res-stats span')[1]?.textContent.replace('⭐ ','')) || 0;
      return getNote(b) - getNote(a);
    }
    return 0;
  });
  sorted.forEach(card => grid.appendChild(card));
});
