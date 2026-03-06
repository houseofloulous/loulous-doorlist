(function () {

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
    gatedPages: ['/members','/latelier','/donotdisturb','/results','/membersevents','/loulousdonotdisturb','/ateliertix'],
    redirectAfterLogin: 'https://www.houseofloulous.com/members',
    signInUrl: 'https://accounts.houseofloulous.com/sign-in',
    logoUrl: 'https://images.squarespace-cdn.com/content/699e2523b3b47f13793c4748/0d527c23-2099-4148-8bdf-28a9c7d97381/LL_LOGO_Horizontal_Blk2.png?content-type=image%2Fpng',
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
      formFieldLabel: { display: 'none' },
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

  function hideNavLinks(user) {
    document.querySelectorAll('a').forEach(function(link) {
      var text = link.textContent.trim().toUpperCase();
      if (user) {
        if (text === 'REQUEST ENTRY' || text === 'MEMBERS HOUSE' || text === 'MEMBERSHOUSE') {
          link.style.display = 'none';
          if (link.parentElement && (link.parentElement.tagName === 'LI' || link.parentElement.classList.contains('header-nav-item'))) {
            link.parentElement.style.display = 'none';
          }
        }
      }
    });
  }

  function addGateStyles() {
    if (document.querySelector('#loulou-gate-styles')) return;
    var style = document.createElement('style');
    style.id = 'loulou-gate-styles';
    style.textContent = [
      'body.loulou-checking main,body.loulou-checking #page,body.loulou-checking .content-wrapper,body.loulou-checking article,body.loulou-checking .page-section{opacity:0!important;pointer-events:none!important;}',
      '.loulou-denied-overlay{position:fixed;top:0;left:0;right:0;bottom:0;z-index:999999;display:flex;align-items:center;justify-content:center;background:#f5f0eb;font-family:"Instrument Serif",serif;}',
      '.loulou-denied-box{text-align:center;padding:3rem 2.5rem;max-width:500px;width:90%;}',
      '.loulou-denied-logo img{max-height:80px;margin-bottom:1.5rem;}',
      '.loulou-denied-line{width:60px;height:1px;background:#1a1a1a;margin:1.5rem auto;opacity:0.3;}',
      '.loulou-denied-title{font-size:1.6rem;color:#1a1a1a;font-weight:400;letter-spacing:0.15em;text-transform:uppercase;margin-bottom:0.75rem;font-family:"Instrument Serif",serif;}',
      '.loulou-denied-sub{font-size:1.1rem;color:#555;font-weight:300;margin-bottom:2.5rem;line-height:1.7;font-family:"Instrument Serif",serif;}',
      '.loulou-denied-btn{display:inline-block;padding:16px 50px;background:#1a1a1a;border:none;color:#f5f0eb;font-family:"Instrument Serif",serif;font-size:1rem;letter-spacing:0.2em;text-transform:uppercase;cursor:pointer;transition:background 0.3s;}',
      '.loulou-denied-btn:hover{background:#333;}',
      '.loulou-denied-apply{display:block;margin-top:2rem;font-size:1rem;color:#888;font-family:"Instrument Serif",serif;}',
      '.loulou-denied-apply a{color:#1a1a1a;font-weight:600;text-decoration:none;border-bottom:1px solid #1a1a1a;}',
      '#loulou-signin-modal{display:none;position:fixed;top:0;left:0;right:0;bottom:0;z-index:9999999;background:rgba(0,0,0,0.5);align-items:center;justify-content:center;}',
      '#loulou-signin-modal.active{display:flex;}',
      '#loulou-signin-inner{background:#f5f0eb;padding:2rem;max-width:480px;width:90%;max-height:90vh;overflow-y:auto;position:relative;}',
      '#loulou-signin-close{position:absolute;top:1rem;right:1rem;background:none;border:none;font-size:1.5rem;cursor:pointer;color:#1a1a1a;font-family:"Instrument Serif",serif;}',
      '#loulou-clerk-mount{min-height:300px;}'
    ].join('');
    document.head.appendChild(style);
  }

  function createSignInModal() {
    if (document.querySelector('#loulou-signin-modal')) return;
    var modal = document.createElement('div');
    modal.id = 'loulou-signin-modal';
    modal.innerHTML = '<div id="loulou-signin-inner"><button id="loulou-signin-close" type="button">\u00d7</button><div id="loulou-clerk-mount"></div></div>';
    document.body.appendChild(modal);
    document.querySelector('#loulou-signin-close').addEventListener('click', function() {
      modal.classList.remove('active');
    });
    modal.addEventListener('click', function(e) {
      if (e.target === modal) modal.classList.remove('active');
    });
  }

  function openSignInModal(clerk) {
    var modal = document.querySelector('#loulou-signin-modal');
    if (!modal) return;
    modal.classList.add('active');
    var mountEl = document.querySelector('#loulou-clerk-mount');
    if (mountEl && !mountEl.dataset.mounted) {
      mountEl.dataset.mounted = 'true';
      setTimeout(function() {
        clerk.mountSignIn(mountEl, {
          appearance: CLERK_APPEARANCE,
          fallbackRedirectUrl: GATE_CONFIG.redirectAfterLogin
        });
        clerk.addListener(function(resources) {
          if (resources.user) {
            window.location.href = GATE_CONFIG.redirectAfterLogin;
          }
        });
      }, 300);
    }
  }

  function showDeniedOverlay(clerk) {
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
      if (clerk) openSignInModal(clerk);
    });
    var applyDiv = document.createElement('div');
    applyDiv.className = 'loulou-denied-apply';
    applyDiv.innerHTML = 'Need an account? <a href="' + GATE_CONFIG.applyUrl + '">Apply now</a> &nbsp;|&nbsp; Having trouble? <a href="mailto:' + GATE_CONFIG.supportEmail + '">Contact us</a>';
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
    if (user) hideNavLinks(user);

    if (isLoginPage()) {
      if (user) {
        window.location.href = GATE_CONFIG.redirectAfterLogin;
        return;
      }
      createSignInModal();
      function hijackEnterButton() {
        document.querySelectorAll('a, [data-sqsp-button]').forEach(function(el) {
          var text = el.textContent.trim().toUpperCase();
          if ((text === 'ENTER' || text === 'SIGN IN') && !el.dataset.clerkHijacked) {
            el.dataset.clerkHijacked = 'true';
            if (el.tagName === 'A') el.setAttribute('href', '#');
            el.addEventListener('click', function(e) {
              e.preventDefault();
              e.stopPropagation();
              openSignInModal(clerk);
            });
          }
        });
      }
      hijackEnterButton();
      setTimeout(hijackEnterButton, 500);
      setTimeout(hijackEnterButton, 1000);
      setTimeout(hijackEnterButton, 2000);
      return;
    }

    if (isGatedPage()) {
      if (user) {
        showPageContent();
        hideNavLinks(user);
      } else {
        document.body.classList.remove('loulou-checking');
        createSignInModal();
        showDeniedOverlay(clerk);
      }
      clerk.addListener(function(resources) {
        if (!resources.user && isGatedPage()) showDeniedOverlay(clerk);
        if (resources.user) { showPageContent(); hideNavLinks(resources.user); }
      });
    }
  }

  function initClerk() {
    var needsGate = isGatedPage();
    var needsLogin = isLoginPage();
    if (!needsGate && !needsLogin) return;
    addGateStyles();
    if (needsGate) document.body.classList.add('loulou-checking');
    var waitForClerk = setInterval(function() {
      if (window.Clerk) {
        clearInterval(waitForClerk);
        window.Clerk.load({ standardBrowser: true, appearance: CLERK_APPEARANCE })
          .then(function() { handleAuth(window.Clerk); })
          .catch(function(err) {
            console.error('Clerk failed to load:', err);
            if (needsGate) {
              document.body.classList.remove('loulou-checking');
              showDeniedOverlay(null);
            }
          });
      }
    }, 100);
    setTimeout(function() {
      clearInterval(waitForClerk);
      if (needsGate && document.body.classList.contains('loulou-checking')) {
        document.body.classList.remove('loulou-checking');
        showDeniedOverlay(null);
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
