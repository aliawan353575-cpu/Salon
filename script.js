/* =========================================================
   Maria's Beauty Salon I-8 — Script
   ========================================================= */
document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Mobile menu ---------- */
  var menuToggle = document.getElementById('menu-toggle');
  var mobileMenu = document.getElementById('mobile-menu');

  function closeMenu(){
    mobileMenu.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open menu');
  }
  function openMenu(){
    mobileMenu.classList.add('open');
    menuToggle.setAttribute('aria-expanded', 'true');
    menuToggle.setAttribute('aria-label', 'Close menu');
  }
  menuToggle.addEventListener('click', function(){
    var isOpen = mobileMenu.classList.contains('open');
    if (isOpen) { closeMenu(); } else { openMenu(); }
  });
  mobileMenu.querySelectorAll('a').forEach(function(link){
    link.addEventListener('click', closeMenu);
  });

  /* ---------- Active nav link on scroll ---------- */
  var sections = Array.prototype.slice.call(document.querySelectorAll('main section[id], .hero'));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-link'));

  function setActiveNav(){
    var scrollPos = window.scrollY + 120;
    var currentId = sections.length ? sections[0].id : null;
    sections.forEach(function(sec){
      if (sec.offsetTop <= scrollPos) { currentId = sec.id; }
    });
    navLinks.forEach(function(link){
      var target = link.getAttribute('href').replace('#', '');
      link.classList.toggle('active', target === currentId);
    });
  }
  window.addEventListener('scroll', setActiveNav, { passive: true });
  setActiveNav();

  /* ---------- Scroll reveal animations ---------- */
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function(el){ io.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add('in-view'); });
  }

  /* ---------- Graceful image fallback ---------- */
  document.querySelectorAll('.photo-slot').forEach(function(img){
    img.addEventListener('error', function(){
      var wrap = img.parentElement;
      img.remove();
      var fallback = document.createElement('div');
      fallback.className = 'photo-fallback';
      var label = wrap.dataset && img.dataset.fallbackLabel ? img.dataset.fallbackLabel : '';
      fallback.innerHTML = '<span>' + (label || '') + '</span>';
      wrap.appendChild(fallback);
    }, { once: true });
  });

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-question').forEach(function(btn){
    btn.addEventListener('click', function(){
      var expanded = btn.getAttribute('aria-expanded') === 'true';
      var answer = btn.nextElementSibling;

      document.querySelectorAll('.faq-question').forEach(function(other){
        if (other !== btn) {
          other.setAttribute('aria-expanded', 'false');
          other.nextElementSibling.style.maxHeight = null;
        }
      });

      if (expanded) {
        btn.setAttribute('aria-expanded', 'false');
        answer.style.maxHeight = null;
      } else {
        btn.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  /* ---------- Gallery lightbox ---------- */
  var galleryItems = Array.prototype.slice.call(document.querySelectorAll('.gallery-item'));
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightbox-img');
  var lightboxClose = document.getElementById('lightbox-close');
  var lightboxPrev = document.getElementById('lightbox-prev');
  var lightboxNext = document.getElementById('lightbox-next');
  var currentIndex = 0;

  function getGalleryImages(){
    return galleryItems
      .map(function(item){ return item.querySelector('img'); })
      .filter(function(img){ return img && img.isConnected; });
  }

  function openLightbox(index){
    var images = getGalleryImages();
    if (!images.length) { return; }
    currentIndex = (index + images.length) % images.length;
    var img = images[currentIndex];
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.hidden = false;
    lightboxClose.focus();
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox(){
    lightbox.hidden = true;
    lightboxImg.src = '';
    document.body.style.overflow = '';
  }
  function showRelative(offset){
    var images = getGalleryImages();
    if (!images.length) { return; }
    currentIndex = (currentIndex + offset + images.length) % images.length;
    var img = images[currentIndex];
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
  }

  galleryItems.forEach(function(item, idx){
    item.addEventListener('click', function(){ openLightbox(idx); });
  });
  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', function(){ showRelative(-1); });
  lightboxNext.addEventListener('click', function(){ showRelative(1); });
  lightbox.addEventListener('click', function(e){
    if (e.target === lightbox) { closeLightbox(); }
  });
  document.addEventListener('keydown', function(e){
    if (lightbox.hidden) { return; }
    if (e.key === 'Escape') { closeLightbox(); }
    if (e.key === 'ArrowLeft') { showRelative(-1); }
    if (e.key === 'ArrowRight') { showRelative(1); }
  });

  /* ---------- Appointment form -> WhatsApp ---------- */
  var form = document.getElementById('appointment-form');
  form.addEventListener('submit', function(e){
    e.preventDefault();
    var name = document.getElementById('f-name').value.trim();
    var phone = document.getElementById('f-phone').value.trim();
    var service = document.getElementById('f-service').value;
    var date = document.getElementById('f-date').value;
    var time = document.getElementById('f-time').value;
    var message = document.getElementById('f-message').value.trim();

    var lines = [
      "Hello Maria's Beauty Salon I-8,",
      "",
      "I would like to request an appointment.",
      "",
      "Name: " + name,
      "Phone: " + phone,
      "Service: " + service,
      "Preferred Date: " + (date || '-'),
      "Preferred Time: " + (time || '-'),
      "Message: " + (message || '-'),
      "",
      "Please confirm availability."
    ];

    var text = encodeURIComponent(lines.join('\n'));
    window.open('https://wa.me/923268309697?text=' + text, '_blank', 'noopener');
  });

});
