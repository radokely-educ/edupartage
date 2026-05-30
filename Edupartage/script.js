// Menu mobile
const toggle = document.getElementById('menuToggle');
const menu   = document.getElementById('mobileMenu');

if (toggle && menu) {
  toggle.addEventListener('click', () => {
    menu.classList.toggle('open');
  });
}

// Navbar shadow au scroll
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    navbar.style.boxShadow = window.scrollY > 10
      ? '0 2px 16px rgba(29,74,46,0.10)'
      : 'none';
  }
});
