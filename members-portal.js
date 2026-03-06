(function () {

  var GC = {
    loginPage: '/membershouse',
    gatedPages: ['/members','/latelier','/donotdisturb','/membersevent','/ateliertix','/loulousdonotdisturb'],
    redirectAfterLogin: '/members',
    logoUrl: 'https://images.squarespace-cdn.com/content/699e2523b3b47f13793c4748/0d527c23-2099-4148-8bdf-28a9c7d97381/LL_LOGO_Horizontal_Blk2.png?content-type=image%2Fpng',
    applyUrl: 'https://houseofloulous.com/apply',
    supportEmail: 'hello@houseofloulous.com'
  };

  var APPEARANCE = {
    layout: {
      logoImageUrl: GC.logoUrl,
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
      formFieldAction: { color: '#888', fontFamily: '"Instrument Serif", serif' }
    }
  };

  function getSlug() {
    return window.location.pathname.replace(/\/$/, '').toLowerCase();
  }

  function isGated() {
    var s = getSlug();
    return GC.gatedPages.some(function(p) { return s === p || s.startsWith(p + '/'); });
  }

  function isLogin() {
    return getSlug() === GC.loginPage;
  }

  function isAdmin() {
    return document.body.classList.contains('sqs-edit-mode') ||
           window.location.href.includes('/config/') ||
           window.location.href.includes('squarespace.com/');
  }

  function openModal() {
    window.Clerk.openSignIn({
      afterSignInUrl: GC.redirectAfterLogin,
      afterSignUpUrl: GC.redirectAfterLogin,
      appearance: APPEARANCE
    });
  }

  function addStyles() {
    if (document.getElementById('ll-gate-style')) return;
    var s = document.createElement('style');
    s.id = 'll-gate-style';
    s.textContent = [
      'body.loulou-checking #page, body.loulou-checking .sqs-layout { opacity: 0 !important; pointer-events: none !important; }',
      '.ll-do { position: fixed; inset: 0; background: #F5F0EB; z-index: 99999; display: flex; flex-direction: column; align-items: center; justify-content: center; font-family: "Instrument Serif", serif; }',
      '.ll-do img { width: 180px; margin-bottom: 32px; }',
      '.ll-do hr { width: 60px; border: none; border-top: 1px solid #222; margin: 0 auto 28px; }',
      '.ll-do h2 { font-size: 22px; letter-spacing: 0.18em; text-transform: uppercase; color: #1a1a1a; margin: 0 0 14px; }',
      '.ll-do p { font-size: 15px; color: #444; margin: 0 0 32px; text-align: center; line-height: 1.6; }',
      '.ll-do button { background: #1a1a1a; color: #fff; border: none; padding: 16px 48px; font-family: "Instrument Serif", serif; font-size: 13px; letter-spacing: 0.2em; text-transform: uppercase; cursor: pointer; display: block; }',
      '.ll-do button:hover { background: #333; }',
      '.ll-do .ll-links { margin-top: 28px; font-size: 13px; color: #888; }',
      '.ll-do .ll-links a { color: #888; text-decoration: underline; margin: 0 8px; }',
      '#ll-signout-btn { background: none; border: none; cursor: pointer; font-family: "Instrument Serif", serif; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: #999; padding: 0; margin-left: 24px; }',
      '#ll-signout-btn:hover { color: #333; }'
    ].join('\n');
    document.head.appendChild(s);
  }

  function showDenied() {
    if (document.querySelector('.ll-do')) return;
    var o = document.createElement('div');
    o.className = 'll-do';
    o.innerHTML = '<img src="' + GC.logoUrl + '" alt="LouLous"><hr>' +
      '<h2>Members Only</h2>' +
      '<p>This page is reserved for approved members.<br>Please sign in to continue.</p>' +
      '<button id="ll-sb">SIGN IN</button>' +
      '<div class="ll-links"><a href="' + GC.applyUrl + '">Apply now</a> &nbsp;|&nbsp; <a href="mailto:' + GC.supportEmail + '">Contact us</a></div>';
    document.body.appendChild(o);
    document.getElementById('ll-sb').addEventListener('click', function(e) {
      e.preventDefault();
      openModal();
    });
  }

  function showContent() {
    document.body.classList.remove('loulou-checking');
    var o = document.querySelector('.ll-do');
    if (o) o.remove();
  }

  function hideRequestEntry() {
    if (document.getElementById('ll-nav-style')) return;
    var s = document.createElement('style');
    s.id = 'll-nav-style';
    s.textContent = 'a[href="/apply"], a[href*="/apply"], [data-link-href*="/apply"] { display: none !important; }';
    document.head.appendChild(s);
  }

  function injectSignOut() {
    if (document.getElementById('ll-signout-btn')) return;
    var nav = document.querySelector('.header-nav, .main-nav, nav, [data-section-type="header-section"]');
    if (!nav) return;
    var btn = document.createElement('button');
    btn.id = 'll-signout-btn';
    btn.textContent = 'SIGN OUT';
    btn.addEventListener('click', function() {
      window.Clerk.signOut().then(function() { window.location.href = '/'; });
    });
    nav.appendChild(btn);
  }

  function setupToggle() {
    var allFields = document.querySelectorAll('.form-item');
    var partnerFields = [];
    allFields.forEach(function(f) {
      if ((f.textContent || '').match(/Partner/i)) partnerFields.push(f);
    });
    if (!partnerFields.length) return;
    partnerFields.forEach(function(f) { f.style.display = 'none'; });
    document.addEventListener('click', function(e) {
      var t = e.target.closest('.option, label, [role="radio"]');
      if (!t) return;
      var txt = t.textContent.trim().toLowerCase();
      if (txt === 'couple' || txt === 'couples') {
        partnerFields.forEach(function(f) { f.style.display = ''; });
      } else if (txt === 'individual') {
        partnerFields.forEach(function(f) { f.style.display = 'none'; });
      }
    });
  }

  function handleAuth(clerk) {
    var user = clerk.user;

    if (isLogin()) {
      if (user) {
        window.location.href = GC.redirectAfterLogin;
        return;
      }
      document.addEventListener('click', function(e) {
        var el = e.target.closest('a, button');
        if (!el) return;
        var txt = (el.textContent || '').trim().toUpperCase();
        if (txt === 'ENTER') {
          e.preventDefault();
          e.stopPropagation();
          openModal();
        }
      }, true);
      return;
    }

    if (isGated()) {
      if (user) {
        showContent();
        hideRequestEntry();
        injectSignOut();
      } else {
        document.body.classList.remove('loulou-checking');
        showDenied();
      }

      clerk.addListener(function() {
        if (!clerk.user) {
          var btn = document.getElementById('ll-signout-btn');
          if (btn) btn.remove();
          var ns = document.getElementById('ll-nav-style');
          if (ns) ns.remove();
          showDenied();
        }
      });
    }
  }

  document.addEventListener('DOMContentLoaded', function() {
    if (isAdmin()) return;
    addStyles();
    if (isGated()) document.body.classList.add('loulou-checking');
    setTimeout(setupToggle, 1000);
    new MutationObserver(function() {
      setupToggle();
    }).observe(document.body, { childList: true, subtree: true });

    var t = setInterval(function() {
      if (window.Clerk) {
        clearInterval(t);
        window.Clerk.load().then(function() {
          handleAuth(window.Clerk);
        }).catch(function() {
          if (isGated()) {
            document.body.classList.remove('loulou-checking');
            showDenied();
          }
        });
      }
    }, 100);

    setTimeout(function() {
      clearInterval(t);
      if (isGated() && document.body.classList.contains('loulou-checking')) {
        document.body.classList.remove('loulou-checking');
        showDenied();
      }
    }, 15000);
  });

})();
