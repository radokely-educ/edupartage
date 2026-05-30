function toggleReact(btn) {
  const span = btn.querySelector('span');
  if (!span) return;
  const active = btn.classList.toggle('active');
  span.textContent = parseInt(span.textContent) + (active ? 1 : -1);
}
function quotePost(author) {
  const preview = document.getElementById('quotePreview');
  const textarea = document.getElementById('replyText');
  if (preview) {
    preview.style.display = 'block';
    preview.textContent = `Citation de ${author} : "…"`;
  }
  textarea?.focus();
}
function submitReply() {
  alert('Connecte-toi pour publier une réponse.');
  window.location.href = 'connexion.html';
}
