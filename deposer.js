/* deposer.js */
const zone = document.getElementById('uploadZone');
const fileInput = document.getElementById('fileInput');
const filePreview = document.getElementById('filePreview');

zone?.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('dragover'); });
zone?.addEventListener('dragleave', () => zone.classList.remove('dragover'));
zone?.addEventListener('drop', e => {
  e.preventDefault(); zone.classList.remove('dragover');
  handleFile(e.dataTransfer.files[0]);
});
zone?.addEventListener('click', () => fileInput?.click());
fileInput?.addEventListener('change', () => handleFile(fileInput.files[0]));

function handleFile(file) {
  if (!file) return;
  filePreview.style.display = 'block';
  filePreview.textContent = `📄 ${file.name} (${(file.size/1024/1024).toFixed(2)} Mo)`;
}

const form = document.getElementById('deposerForm');
form?.addEventListener('submit', e => {
  e.preventDefault();
  let ok = true;
  const check = (id, errId, msg) => { if (!document.getElementById(id)?.value.trim()) { const el = document.getElementById(errId); if (el) el.textContent = msg; ok = false; } };
  ['titre','description','dep-matiere','dep-niveau','dep-type','apercu'].forEach(id => {
    const errId = 'err-' + id;
    const el = document.getElementById(errId);
    if (el) el.textContent = '';
  });
  check('titre', 'err-titre', 'Le titre est requis.');
  check('description', 'err-description', 'La description est requise.');
  check('dep-matiere', 'err-dep-matiere', 'Choisis une matière.');
  check('dep-niveau', 'err-dep-niveau', 'Choisis un niveau.');
  check('dep-type', 'err-dep-type', 'Choisis un type.');
  check('apercu', 'err-apercu', "L'aperçu public est requis.");
  const confirm = document.getElementById('confirm-original');
  if (!confirm?.checked) { const el = document.getElementById('err-confirm'); if (el) el.textContent = 'Tu dois certifier que cette ressource est ton propre travail.'; ok = false; }
  if (ok) { form.style.display = 'none'; document.getElementById('depSuccessMsg').style.display = 'block'; }
});
