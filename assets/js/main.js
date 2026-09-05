/* PSGC Limited — site interactions */
(function(){
  "use strict";

  /* ---------- header scroll state ---------- */
  var header = document.querySelector('.site-header');
  function onScroll(){
    if(!header) return;
    if(window.scrollY > 30) header.classList.add('scrolled');
    else header.classList.remove('scrolled');

    var toTop = document.querySelector('.to-top');
    if(toTop){
      if(window.scrollY > 600) toTop.classList.add('show');
      else toTop.classList.remove('show');
    }
  }
  document.addEventListener('scroll', onScroll, { passive:true });
  onScroll();

  /* ---------- mobile nav ---------- */
  var navToggle = document.querySelector('.nav-toggle');
  var mobilePanel = document.querySelector('.mobile-panel');
  if(navToggle && mobilePanel){
    navToggle.addEventListener('click', function(){
      navToggle.classList.toggle('open');
      mobilePanel.classList.toggle('open');
      document.body.style.overflow = mobilePanel.classList.contains('open') ? 'hidden' : '';
    });
    mobilePanel.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){
        navToggle.classList.remove('open');
        mobilePanel.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---------- back to top ---------- */
  var toTopBtn = document.querySelector('.to-top');
  if(toTopBtn){
    toTopBtn.addEventListener('click', function(){
      window.scrollTo({ top:0, behavior:'smooth' });
    });
  }

  /* ---------- scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal, .reveal-stagger');
  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold:.15, rootMargin:'0px 0px -60px 0px' });
    revealEls.forEach(function(el){ io.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add('in'); });
  }

  /* ---------- hero brand card (home page) ---------- */
  var brandcard = document.getElementById('heroBrandcard');
  if(brandcard){
    var hbcSlides = brandcard.querySelectorAll('.hbc-slide');
    var hbcDots = brandcard.querySelectorAll('.hbc-dot');
    var hbcIndex = 0;
    var hbcTimer;
    function showSlide(i){
      hbcIndex = i;
      hbcSlides.forEach(function(s, idx){ s.classList.toggle('active', idx === i); });
      hbcDots.forEach(function(d, idx){ d.classList.toggle('active', idx === i); });
    }
    function nextSlide(){ showSlide((hbcIndex + 1) % hbcSlides.length); }
    function restartTimer(){
      clearInterval(hbcTimer);
      hbcTimer = setInterval(nextSlide, 4500);
    }
    hbcDots.forEach(function(dot){
      dot.addEventListener('click', function(){
        showSlide(parseInt(dot.getAttribute('data-i'), 10));
        restartTimer();
      });
    });
    if(hbcSlides.length > 1) restartTimer();
  }

  /* ---------- focus tabs (home page) ---------- */
  var tabs = document.querySelectorAll('.focus-tab');
  var panels = document.querySelectorAll('.focus-panel');
  tabs.forEach(function(tab){
    tab.addEventListener('click', function(){
      var target = tab.getAttribute('data-tab');
      tabs.forEach(function(t){ t.classList.remove('active'); });
      panels.forEach(function(p){ p.classList.remove('active'); });
      tab.classList.add('active');
      var panel = document.querySelector('.focus-panel[data-panel="'+target+'"]');
      if(panel) panel.classList.add('active');
    });
  });

  /* ---------- product filter + lightbox (products page) ---------- */
  var cards = document.querySelectorAll('.product-card');
  document.querySelectorAll('.gallery-block').forEach(function(block){
    var btns = block.querySelectorAll('.filter-btn');
    var blockCards = block.querySelectorAll('.product-card');
    btns.forEach(function(btn){
      btn.addEventListener('click', function(){
        btns.forEach(function(b){ b.classList.remove('active'); });
        btn.classList.add('active');
        var f = btn.getAttribute('data-filter');
        blockCards.forEach(function(card){
          var match = f === 'all' || card.getAttribute('data-cat') === f;
          card.classList.toggle('hidden', !match);
        });
      });
    });
  });

  var lightbox = document.querySelector('.lightbox');
  if(lightbox && cards.length){
    var lbImg = lightbox.querySelector('img');
    var lbName = lightbox.querySelector('.lb-name');
    var lbCat = lightbox.querySelector('.lb-cat');
    var activeGroup = cards;
    var visibleList = function(){ return Array.prototype.filter.call(activeGroup, function(c){ return !c.classList.contains('hidden'); }); };
    var currentIndex = 0;

    function openAt(card){
      var block = card.closest('.gallery-block');
      activeGroup = block ? block.querySelectorAll('.product-card') : cards;
      var list = visibleList();
      currentIndex = list.indexOf(card);
      renderCurrent(list);
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function renderCurrent(list){
      var card = list[currentIndex];
      if(!card) return;
      var img = card.querySelector('img');
      lbImg.src = img.src;
      lbImg.alt = img.alt;
      lbName.textContent = card.getAttribute('data-name');
      lbCat.textContent = card.getAttribute('data-catlabel');
      lbCat.className = 'pcat lb-cat ' + card.getAttribute('data-cat').split('-')[0];
    }
    function step(dir){
      var list = visibleList();
      if(!list.length) return;
      currentIndex = (currentIndex + dir + list.length) % list.length;
      renderCurrent(list);
    }
    cards.forEach(function(card){
      card.addEventListener('click', function(){ openAt(card); });
    });
    lightbox.querySelector('.lightbox-close').addEventListener('click', close);
    lightbox.addEventListener('click', function(e){ if(e.target === lightbox) close(); });
    lightbox.querySelector('.lightbox-nav.prev').addEventListener('click', function(){ step(-1); });
    lightbox.querySelector('.lightbox-nav.next').addEventListener('click', function(){ step(1); });
    document.addEventListener('keydown', function(e){
      if(!lightbox.classList.contains('open')) return;
      if(e.key === 'Escape') close();
      if(e.key === 'ArrowRight') step(1);
      if(e.key === 'ArrowLeft') step(-1);
    });
    function close(){
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-item').forEach(function(item){
    var q = item.querySelector('.faq-q');
    q.addEventListener('click', function(){
      var wasOpen = item.classList.contains('open');
      item.parentElement.querySelectorAll('.faq-item').forEach(function(i){ i.classList.remove('open'); });
      if(!wasOpen) item.classList.add('open');
    });
  });

  /* ---------- contact form (static handoff — no backend) ---------- */
  var form = document.querySelector('.contact-form');
  if(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var field = function(name){
        var el = form.querySelector('[name="' + name + '"]');
        return el ? el.value.trim() : '';
      };
      var name = field('name');
      var email = field('email');
      var message = field('message');

      var lines = [];
      var pushIf = function(label, value){ if(value) lines.push(label + ': ' + value); };
      pushIf('Company', field('company'));
      pushIf('Work Email', email);
      pushIf('Telephone Number', field('phone'));
      pushIf('Property Type', field('propertyType'));
      pushIf('Service Required', field('serviceRequired'));
      pushIf('Preferred Cleaning Frequency', field('frequency'));
      pushIf('Site Address', field('siteAddress'));

      var bodyParts = [];
      if(lines.length) bodyParts.push(lines.join('\n'));
      if(message) bodyParts.push('Requirements:\n' + message);
      bodyParts.push('— ' + name + (email ? ' (' + email + ')' : ''));

      var subject = encodeURIComponent('Cleaning quote enquiry from ' + (name || 'website visitor'));
      var body = encodeURIComponent(bodyParts.join('\n\n'));
      var success = document.querySelector('.form-success');
      if(success) success.classList.add('show');
      window.location.href = 'mailto:info@psgclimited.com?subject=' + subject + '&body=' + body;
      form.reset();
    });
  }

  /* ---------- cookie banner ---------- */
  var cookieBanner = document.querySelector('.cookie-banner');
  if(cookieBanner){
    try{
      if(!localStorage.getItem('psgc_cookie_choice')){
        setTimeout(function(){ cookieBanner.classList.add('show'); }, 900);
      }
    }catch(e){ setTimeout(function(){ cookieBanner.classList.add('show'); }, 900); }

    cookieBanner.querySelectorAll('[data-cookie]').forEach(function(btn){
      btn.addEventListener('click', function(){
        try{ localStorage.setItem('psgc_cookie_choice', btn.getAttribute('data-cookie')); }catch(e){}
        cookieBanner.classList.remove('show');
      });
    });
  }

})();
