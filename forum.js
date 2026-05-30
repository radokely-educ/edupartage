/* ============================================================
   forum.js — filtres catégories, recherche, tri, modal
   ============================================================ */

const discussions = Array.from(document.querySelectorAll('.discussion-card'));
const emptyEl     = document.getElementById('emptyForum');
let currentCat    = 'tout';
let currentSearch = '';

/* -------- FILTRE PAR CATÉGORIE -------- */
document.querySelectorAll('.cat-item').forEach(item => {
  item.addEventListener('click', () => {
    document.querySelectorAll('.cat-item').forEach(i => i.classList.remove('active'));
    item.classList.add('active');
    currentCat = item.dataset.cat;
    applyFilters();
  });
});

/* -------- RECHERCHE -------- */
const forumSearch = document.getElementById('forumSearch');
forumSearch?.addEventListener('input', () => {
  currentSearch = forumSearch.value.trim().toLowerCase();
  applyFilters();
});

/* -------- RÉINITIALISER -------- */
document.getElementById('resetForum')?.addEventListener('click', () => {
  currentCat    = 'tout';
  currentSearch = '';
  if (forumSearch) forumSearch.value = '';
  document.querySelectorAll('.cat-item').forEach(i => i.classList.remove('active'));
  document.querySelector('.cat-item[data-cat="tout"]')?.classList.add('active');
  applyFilters();
});

/* -------- APPLIQUER FILTRES -------- */
function applyFilters() {
  let visible = 0;
  discussions.forEach(card => {
    const matchCat    = currentCat === 'tout' || card.dataset.cat === currentCat;
    const matchSearch = currentSearch === '' || card.innerText.toLowerCase().includes(currentSearch);
    const show = matchCat && matchSearch;
    card.style.display = show ? '' : 'none';
    if (show) visible++;
  });
  if (emptyEl) emptyEl.style.display = visible === 0 ? 'block' : 'none';
}

/* -------- TRI -------- */
document.querySelectorAll('.sort-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.sort-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    const list   = document.getElementById('discussionsList');
    const sorted = [...discussions].sort((a, b) => {
      if (tab.dataset.sort === 'popular') {
        const getViews = el => parseInt(el.querySelector('.disc-meta span:last-child')?.textContent) || 0;
        return getViews(b) - getViews(a);
      }
      if (tab.dataset.sort === 'nonrepondus') {
        const getReplies = el => parseInt(el.querySelector('.disc-replies')?.textContent) || 0;
        return getReplies(a) - getReplies(b);
      }
      return 0; // récents = ordre d'origine
    });
    sorted.forEach(card => list.appendChild(card));
  });
});

/* -------- MODAL NOUVELLE DISCUSSION -------- */
const overlay  = document.getElementById('modalOverlay');
const openBtn  = document.getElementById('btnNouvelleDiscussion');
const closeBtn = document.getElementById('modalClose');

openBtn?.addEventListener('click', () => overlay?.classList.add('open'));
closeBtn?.addEventListener('click', () => overlay?.classList.remove('open'));
overlay?.addEventListener('click', (e) => {
  if (e.target === overlay) overlay.classList.remove('open');
});

/* Fermeture avec Escape */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') overlay?.classList.remove('open');
});
