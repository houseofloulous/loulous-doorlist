(function () {

  // ============================================
  // HIDE EVENT END DATES
  // ============================================
  function hideEventEndDates() {
    document.querySelectorAll('.eventlist-meta-date, .event-date, [class*="event"][class*="date"]').forEach(function(el) {
      var html = el.innerHTML;
      if (html.includes('–') || html.includes('-') || html.includes('&ndash;')) {
        el.innerHTML = html.replace(/\s*[–\-&ndash;].*?(PM|AM)/gi, '');
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(hideEventEndDates, 500);
      setTimeout(hideEventEndDates, 1500);
    });
  } else {
    setTimeout(hideEventEndDates, 500);
    setTimeout(hideEventEndDates, 1500);
  }

  new MutationObserver(function() {
    hideEventEndDates();
  }).observe(document.body, { childList: true, subtree: true });

  // ============================================
  // PARTNER FIELDS TOGGLE
  // ============================================
  function setupToggle() {
    var allFields = document.querySelectorAll('.form-item');
    var partnerFields = [];
    allFields.forEach(function(field) {
      if ((field.textContent || '').match(/Partner/i)) partnerFields.push(field);
    });
    if (partnerFields.length === 0) return;
    partnerFields.forEach(function(f) { f.style.display = 'none'; });
    document.addEventListener('click', function(e) {
      var target = e.target.closest('.option, label, [role="radio"]');
      if (!target) return;
      var text = target.textContent.trim().toLowerCase();
      if (text === 'couple' || text === 'couples') {
        partnerFields.forEach(function(f) { f.style.display = ''; });
      } else if (text === 'individual') {
        partnerFields.forEach(function(f) { f.style.display = 'none'; });
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() { setTimeout(setupToggle, 1000); });
  } else {
    setTimeout(setupToggle, 1000);
  }

  var GATE_CONFIG = {
    loginPage: '/membershouse',
    gatedPages: ['/members','/latelier','/donotdisturb','/obscura','/results','/membersevents','/loulousdonotdisturb','/ateliertix'],
    redirectAfterLogin: '/members',
    logoUrl: 'https://images.squarespace-cdn.com/content/699e2523b3b47f13793c4748/0d527c23-2099-4148-8bdf-28a9c7d97381/LL_LOGO_Horizontal_Blk2.png?content-type=image%2Fpng',
    logoWhiteUrl: 'https://images.squarespace-cdn.com/content/v1/699e2523b3b47f13793c4748/89f7fd71-9df9-41c6-b43a-d2330e040602/LL_LOGO_Horizontal_White2.png',
    applyUrl: 'https://houseofloulous.com/apply',
    supportEmail: 'hello@houseofloulous.com'
  };

  var CLERK_APPEARANCE = {
    layout: {
      logoImageUrl: GATE_CONFIG.logoUrl,
      logoPlacement: 'inside',
      socialButtonsPlacement: 'bottom',
      showOptionalFields: false,
      unsafe_disableDevelopmentModeWarnings: true
    },
    variables: {
      colorPrimary: '#1a1a1a',
      colorBackground: '#f5f0eb',
      colorText: '#1a1a1a',
      colorInputBackground: 'transparent',
      colorInputText: '#1a1a1a',
      borderRadius: '0px',
      fontFamily: '"Instrument Serif", serif',
      colorNeutral: '#1a1a1a'
    },
    elements: {
      card: { backgroundColor: '#f5f0eb', border: 'none', boxShadow: 'none' },
      headerTitle: { display: 'none' },
      headerSubtitle: { display: 'none' },
      logoBox: { height: '120px', justifyContent: 'center', marginBottom: '8px' },
      logoImage: { maxHeight: '100px', objectFit: 'contain' },
      formFieldInput: {
        borderTop: 'none', borderLeft: 'none', borderRight: 'none',
        borderBottom: '1px solid #ccc', borderRadius: '0',
        backgroundColor: 'transparent', fontSize: '1rem',
        fontFamily: '"Instrument Serif", serif',
        padding: '12px 0', color: '#1a1a1a'
      },
      formFieldLabel: { fontFamily: '"Instrument Serif", serif', fontSize: '0.95rem', color: '#666', display: 'none' },
      formButtonPrimary: {
        backgroundColor: '#1a1a1a', color: '#f5f0eb',
        fontFamily: '"Instrument Serif", serif',
        fontSize: '0.9rem', letterSpacing: '0.2em',
        textTransform: 'uppercase', borderRadius: '0',
        padding: '14px', fontWeight: '400'
      },
      footerAction: { fontFamily: '"Instrument Serif", serif' },
      footerActionLink: { color: '#1a1a1a', fontWeight: '600', fontFamily: '"Instrument Serif", serif' },
      socialButtonsBlockButton: { border: '1px solid #ddd', color: '#1a1a1a', backgroundColor: 'transparent', borderRadius: '0', fontFamily: '"Instrument Serif", serif' },
      dividerLine: { background: '#ddd' },
      dividerText: { color: '#aaa', fontFamily: '"Instrument Serif", serif', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.8rem' },
      identityPreviewEditButton: { color: '#1a1a1a' },
      formFieldAction: { color: '#888', fontFamily: '"Instrument Serif", serif' },
      alternativeMethodsBlockButton: { border: '1px solid #ddd', borderRadius: '0', fontFamily: '"Instrument Serif", serif' }
    }
  };

  function getCurrentPath() {
    return window.location.pathname.replace(/\/$/, '').toLowerCase();
  }

  function isSquarespaceAdmin() {
    var url = window.location.href;
    return (
      url.indexOf('/config/') > -1 ||
      url.indexOf('.squarespace.com') > -1 ||
      document.querySelector('.sqs-edit-mode') !== null ||
      document.querySelector('.sqs-edit-mode-active') !== null ||
      document.querySelector('#sqs-site-frame') !== null ||
      document.body.classList.contains('sqs-edit-mode') ||
      window.self !== window.top
    );
  }

  function isLoginPage() { return getCurrentPath() === GATE_CONFIG.loginPage; }

  function isGatedPage() {
    if (isSquarespaceAdmin()) return false;
    var path = getCurrentPath();
    return GATE_CONFIG.gatedPages.some(function(p) { return path === p || path.startsWith(p + '/'); });
  }

  function setMemberCookie() {
    document.cookie = 'loulou_member=1;path=/;max-age=86400;SameSite=Lax';
  }

  function clearMemberCookie() {
    document.cookie = 'loulou_member=;path=/;max-age=0;SameSite=Lax';
  }

  function customizeClerkUI() {
    document.querySelectorAll('.cl-footerActionLink').forEach(function(link) {
      if (link.textContent.trim().toLowerCase() === 'sign up' && !link.dataset.clerkCustomized) {
        link.dataset.clerkCustomized = 'true';
        link.textContent = 'Apply now';
        link.removeAttribute('href');
        link.style.cursor = 'pointer';
        link.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          window.location.href = GATE_CONFIG.applyUrl;
        }, true);
      }
    });
    document.querySelectorAll('.cl-footerActionText').forEach(function(el) {
      if (el.textContent.toLowerCase().includes("don't have an account")) {
        el.textContent = 'Need an account? ';
      }
    });
    document.querySelectorAll('.cl-formFieldAction').forEach(function(link) {
      if (link.textContent.toLowerCase().includes('forgot') && !link.dataset.clerkCustomized) {
        link.dataset.clerkCustomized = 'true';
        link.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          window.location.href = 'mailto:' + GATE_CONFIG.supportEmail + '?subject=Password%20Help%20-%20House%20of%20LouLou%27s';
        }, true);
      }
    });
  }

  // GLOBAL function — called by header intercept and by this script
  window.loulouOpenSignIn = function(redirectTo) {
    redirectTo = redirectTo || GATE_CONFIG.redirectAfterLogin;
    function tryOpen() {
      if (window.Clerk && window.Clerk.openSignIn) {
        window.Clerk.load().then(function() {
          window.Clerk.openSignIn({ fallbackRedirectUrl: redirectTo, appearance: CLERK_APPEARANCE });
          var custInterval = setInterval(function() {
            if (document.querySelector('.cl-card, .cl-signIn-root, .cl-rootBox')) {
              customizeClerkUI();
              clearInterval(custInterval);
            }
          }, 200);
          setTimeout(function() {
            var clerkRoot = document.querySelector('.cl-rootBox, .cl-signIn-root');
            if (clerkRoot) {
              new MutationObserver(customizeClerkUI).observe(clerkRoot, { childList: true, subtree: true });
            }
          }, 1000);
        });
      } else {
        setTimeout(tryOpen, 100);
      }
    }
    tryOpen();
  };

  function injectMemberNav() {
    if (document.querySelector('#loulou-member-nav')) return;
    setMemberCookie();
    var style = document.createElement('style');
    style.id = 'loulou-member-nav-style';
    style.textContent = '#loulou-member-nav{position:fixed;top:0;left:0;right:0;z-index:99999;background:#1a2535;height:70px;}#loulou-nav-inner{max-width:1400px;margin:0 auto;padding:0 40px;height:70px;display:flex;align-items:center;justify-content:space-between;}#loulou-nav-logo img{height:40px;display:block;}#loulou-nav-links{display:flex;align-items:center;gap:36px;}#loulou-nav-links a{color:#e8e0d0!important;text-decoration:none!important;font-family:"Instrument Serif",serif;font-size:14px;letter-spacing:0.12em;text-transform:uppercase;white-space:nowrap;}#loulou-nav-links a:hover{color:#fff!important;}#loulou-hamburger{display:none;flex-direction:column;justify-content:center;gap:5px;cursor:pointer;padding:8px;background:none;border:none;}#loulou-hamburger span{display:block;width:24px;height:2px;background:#e8e0d0;transition:all 0.3s;}#loulou-mobile-menu{display:none;position:fixed;top:70px;left:0;right:0;background:#1a2535;z-index:99998;padding:16px 0;border-top:1px solid rgba(255,255,255,0.1);}#loulou-mobile-menu.open{display:block;}#loulou-mobile-menu a{display:block;padding:14px 32px;color:#e8e0d0!important;text-decoration:none!important;font-family:"Instrument Serif",serif;font-size:15px;letter-spacing:0.12em;text-transform:uppercase;border-bottom:1px solid rgba(255,255,255,0.05);}#loulou-mobile-menu a:last-child{border-bottom:none;}#loulou-mobile-menu a:hover{background:rgba(255,255,255,0.05);color:#fff!important;}body.loulou-nav-on{padding-top:70px!important;}header,#header,.header,.site-header,[data-section-type="header-section"]{display:none!important;}@media(max-width:768px){#loulou-nav-inner{padding:0 20px;}#loulou-nav-links{display:none;}#loulou-hamburger{display:flex;}}';
    document.head.appendChild(style);
    var nav = document.createElement('div');
    nav.id = 'loulou-member-nav';
    nav.innerHTML = '<div id="loulou-nav-inner"><a id="loulou-nav-logo" href="https://www.houseofloulous.com/members"><img src="' + GATE_CONFIG.logoWhiteUrl + '" alt="LouLous"></a><div id="loulou-nav-links"><a href="/latelier">L\'ATELIER</a><a href="/donotdisturb">DO NOT DISTURB</a><a href="/obscura">OBSCURA</a><a href="/membersevents">MEMBER EVENTS</a><a href="/cart">&#x1F6D2;</a></div><button id="loulou-hamburger" aria-label="Menu"><span></span><span></span><span></span></button></div>';
    var mobileMenu = document.createElement('div');
    mobileMenu.id = 'loulou-mobile-menu';
    mobileMenu.innerHTML = '<a href="/latelier">L\'ATELIER</a><a href="/donotdisturb">DO NOT DISTURB</a><a href="/obscura">OBSCURA</a><a href="/membersevents">MEMBER EVENTS</a><a href="/cart">&#x1F6D2; CART</a>';
    document.body.prepend(mobileMenu);
    document.body.prepend(nav);
    document.body.classList.add('loulou-nav-on');
    document.getElementById('loulou-hamburger').addEventListener('click', function() {
      document.getElementById('loulou-mobile-menu').classList.toggle('open');
    });
    document.addEventListener('click', function(e) {
      var hamburger = document.getElementById('loulou-hamburger');
      var menu = document.getElementById('loulou-mobile-menu');
      if (menu && hamburger && !hamburger.contains(e.target) && !menu.contains(e.target)) {
        menu.classList.remove('open');
      }
    });
  }

  function addGateStyles() {
    if (document.querySelector('#loulou-gate-styles')) return;
    var style = document.createElement('style');
    style.id = 'loulou-gate-styles';
    style.textContent = 'body.loulou-checking main,body.loulou-checking #page,body.loulou-checking .content-wrapper,body.loulou-checking article,body.loulou-checking .page-section{opacity:0!important;pointer-events:none!important;}.loulou-denied-overlay{position:fixed;top:0;left:0;right:0;bottom:0;z-index:999999;display:flex;align-items:center;justify-content:center;background:#f5f0eb;font-family:"Instrument Serif",serif;}.loulou-denied-box{text-align:center;padding:3rem 2.5rem;max-width:500px;width:90%;}.loulou-denied-logo img{max-height:80px;margin-bottom:1.5rem;}.loulou-denied-line{width:60px;height:1px;background:#1a1a1a;margin:1.5rem auto;opacity:0.3;}.loulou-denied-title{font-size:1.6rem;color:#1a1a1a;font-weight:400;letter-spacing:0.15em;text-transform:uppercase;margin-bottom:0.75rem;font-family:"Instrument Serif",serif;}.loulou-denied-sub{font-size:1.1rem;color:#555;font-weight:300;margin-bottom:2.5rem;line-height:1.7;font-family:"Instrument Serif",serif;}.loulou-denied-btn{display:inline-block;padding:16px 50px;background:#1a1a1a;border:none;color:#f5f0eb;font-family:"Instrument Serif",serif;font-size:1rem;letter-spacing:0.2em;text-transform:uppercase;cursor:pointer;transition:background 0.3s;position:relative;z-index:1;}.loulou-denied-btn:hover{background:#333;}.loulou-denied-apply{display:block;margin-top:2rem;font-size:1rem;color:#888;font-family:"Instrument Serif",serif;}.loulou-denied-apply a{color:#1a1a1a;font-weight:600;text-decoration:none;border-bottom:1px solid #1a1a1a;}.cl-modalBackdrop,.cl-rootBox{z-index:9999999!important;}.cl-card{max-height:90vh;overflow-y:auto;}@media(max-width:480px){.loulou-denied-box{padding:2rem 1.5rem;}.cl-card{max-height:85vh;}}';
    document.head.appendChild(style);
  }

  function showDeniedOverlay() {
    if (document.querySelector('.loulou-denied-overlay')) return;
    var overlay = document.createElement('div');
    overlay.className = 'loulou-denied-overlay';
    var box = document.createElement('div');
    box.className = 'loulou-denied-box';
    var logo = document.createElement('div');
    logo.className = 'loulou-denied-logo';
    logo.innerHTML = '<img src="' + GATE_CONFIG.logoUrl + '" alt="LouLous">';
    var line = document.createElement('div');
    line.className = 'loulou-denied-line';
    var title = document.createElement('div');
    title.className = 'loulou-denied-title';
    title.textContent = 'Members Only';
    var sub = document.createElement('div');
    sub.className = 'loulou-denied-sub';
    sub.innerHTML = 'This page is reserved for approved members.<br>Please sign in to continue.';
    var btn = document.createElement('button');
    btn.className = 'loulou-denied-btn';
    btn.type = 'button';
    btn.textContent = 'SIGN IN';
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      window.location.href = GATE_CONFIG.loginPage + '?redirect=' + encodeURIComponent(window.location.pathname);
    });
    var applyDiv = document.createElement('div');
    applyDiv.className = 'loulou-denied-apply';
    applyDiv.innerHTML = 'Need an account? <a href="' + GATE_CONFIG.applyUrl + '">Apply now</a>';
    box.appendChild(logo);
    box.appendChild(line);
    box.appendChild(title);
    box.appendChild(sub);
    box.appendChild(btn);
    box.appendChild(applyDiv);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
  }

  function showPageContent() {
    document.body.classList.remove('loulou-checking');
    var overlay = document.querySelector('.loulou-denied-overlay');
    if (overlay) overlay.remove();
  }

  function handleAuth(clerk) {
    var user = clerk.user;

    if (isLoginPage()) {
      if (user) {
        var params = new URLSearchParams(window.location.search);
        window.location.href = params.get('redirect') || GATE_CONFIG.redirectAfterLogin;
        return;
      }
      // Auto-open if redirected from a gated page
      var params = new URLSearchParams(window.location.search);
      if (params.has('redirect')) {
        window.loulouOpenSignIn(params.get('redirect'));
      }
      return;
    }

    if (user) {
      showPageContent();
      injectMemberNav();
    } else {
      clearMemberCookie();
      if (isGatedPage()) {
        document.body.classList.remove('loulou-checking');
        showDeniedOverlay();
      }
    }

    clerk.addListener(function() {
      if (!clerk.user) {
        clearMemberCookie();
        var nav = document.querySelector('#loulou-member-nav');
        if (nav) nav.remove();
        var mobileMenu = document.querySelector('#loulou-mobile-menu');
        if (mobileMenu) mobileMenu.remove();
        var navStyle = document.querySelector('#loulou-member-nav-style');
        if (navStyle) navStyle.remove();
        document.body.classList.remove('loulou-nav-on');
        if (isGatedPage()) showDeniedOverlay();
      }
    });
  }

  function initClerk() {
    if (isSquarespaceAdmin()) return;
    addGateStyles();
    if (isGatedPage()) document.body.classList.add('loulou-checking');
    var waitForClerk = setInterval(function() {
      if (window.Clerk) {
        clearInterval(waitForClerk);
        window.Clerk.load()
          .then(function() { handleAuth(window.Clerk); })
          .catch(function(err) {
            console.error('Clerk failed to load:', err);
            if (isGatedPage()) {
              document.body.classList.remove('loulou-checking');
              showDeniedOverlay();
            }
          });
      }
    }, 100);
    setTimeout(function() {
      clearInterval(waitForClerk);
      if (isGatedPage() && document.body.classList.contains('loulou-checking')) {
        document.body.classList.remove('loulou-checking');
        showDeniedOverlay();
      }
    }, 15000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initClerk);
  } else {
    initClerk();
  }

  new MutationObserver(function() { setupToggle(); }).observe(document.body, { childList: true, subtree: true });

})();
