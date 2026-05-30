/* ============================================================
   auth.js — validation formulaires inscription & connexion
   ============================================================ */

/* -------- UTILITAIRES -------- */
function showError(id, msg) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = msg;
  const input = el.previousElementSibling?.tagName === 'DIV'
    ? el.previousElementSibling.querySelector('input')
    : el.previousElementSibling;
  if (input) input.classList.toggle('input-error', !!msg);
}

function clearErrors() {
  document.querySelectorAll('.form-error').forEach(el => el.textContent = '');
  document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
}

function val(id) {
  return (document.getElementById(id)?.value || '').trim();
}

/* -------- TOGGLE MOT DE PASSE -------- */
function setupToggle(btnId, inputId) {
  const btn   = document.getElementById(btnId);
  const input = document.getElementById(inputId);
  if (!btn || !input) return;
  btn.addEventListener('click', () => {
    const show = input.type === 'password';
    input.type  = show ? 'text' : 'password';
    btn.textContent = show ? '🙈' : '👁';
  });
}

setupToggle('togglePw1',  'password');
setupToggle('togglePw2',  'password2');
setupToggle('togglePwCo', 'password-co');

/* -------- FORCE DU MOT DE PASSE -------- */
const pwInput = document.getElementById('password');
const pwBar   = document.getElementById('pwBar');
const pwLabel = document.getElementById('pwLabel');

if (pwInput && pwBar) {
  pwInput.addEventListener('input', () => {
    const pw = pwInput.value;
    let score = 0;
    if (pw.length >= 8)            score++;
    if (/[A-Z]/.test(pw))          score++;
    if (/[0-9]/.test(pw))          score++;
    if (/[^A-Za-z0-9]/.test(pw))   score++;

    const levels = [
      { w: '0%',    bg: 'transparent', label: '' },
      { w: '25%',   bg: '#e53e3e',     label: 'Trop court' },
      { w: '50%',   bg: '#f6ad55',     label: 'Faible' },
      { w: '75%',   bg: '#68d391',     label: 'Bien' },
      { w: '100%',  bg: '#38a169',     label: 'Excellent' },
    ];
    const lvl = levels[Math.min(score, 4)];
    pwBar.style.width      = lvl.w;
    pwBar.style.background = lvl.bg;
    if (pwLabel) pwLabel.textContent = lvl.label;
  });
}

/* -------- FORMULAIRE INSCRIPTION -------- */
const inscriptionForm = document.getElementById('inscriptionForm');
if (inscriptionForm) {
  inscriptionForm.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors();
    let ok = true;

    if (!val('prenom')) { showError('err-prenom', 'Le prénom est requis.'); ok = false; }
    if (!val('nom'))    { showError('err-nom',    'Le nom est requis.');    ok = false; }

    const email = val('email');
    if (!email) {
      showError('err-email', "L'email est requis."); ok = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showError('err-email', "L'adresse email n'est pas valide."); ok = false;
    }

    if (!val('matiere')) { showError('err-matiere', 'Choisis une matière.'); ok = false; }
    if (!val('niveau'))  { showError('err-niveau',  'Choisis un niveau.');   ok = false; }

    const pw  = document.getElementById('password')?.value  || '';
    const pw2 = document.getElementById('password2')?.value || '';
    if (pw.length < 8) {
      showError('err-password', 'Le mot de passe doit contenir au moins 8 caractères.'); ok = false;
    }
    if (pw !== pw2) {
      showError('err-password2', 'Les mots de passe ne correspondent pas.'); ok = false;
    }

    const cgu = document.getElementById('cgu');
    if (cgu && !cgu.checked) {
      showError('err-cgu', "Tu dois accepter les conditions d'utilisation."); ok = false;
    }

    if (ok) {
      inscriptionForm.style.display = 'none';
      document.getElementById('successMsg').style.display = 'block';
    }
  });
}

/* -------- FORMULAIRE CONNEXION -------- */
const connexionForm = document.getElementById('connexionForm');
if (connexionForm) {
  connexionForm.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors();
    let ok = true;

    const email = val('email-co');
    if (!email) {
      showError('err-email-co', "L'email est requis."); ok = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showError('err-email-co', "L'adresse email n'est pas valide."); ok = false;
    }

    const pw = document.getElementById('password-co')?.value || '';
    if (!pw) {
      showError('err-password-co', 'Le mot de passe est requis.'); ok = false;
    }

    if (ok) {
      connexionForm.style.display = 'none';
      const msg = document.getElementById('successMsg');
      if (msg) {
        msg.style.display = 'block';
        // Redirection simulée après 2s
        setTimeout(() => { window.location.href = 'bibliotheque.html'; }, 2000);
      }
    }
  });
}
