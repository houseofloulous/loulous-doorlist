(function () {

  var db = document.body;

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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() { setTimeout(setupToggle, 1000); });
  } else {
    setTimeout(setupToggle, 1000);
  }

  var GC = {
    loginPage: '/membershouse',
    gatedPages: ['/members','/latelier','/donotdisturb','/membersevent','/ateliertix','/loulousdonotdisturb'],
    redirectAfterLogin: '/members',
    logoUrl: 'https://images.squarespace-cdn.com/content/699e2523b3b47f13793c4748/0d527c23-2099-4148-8bdf-28a9c7d97381/LL_LOGO_Horizontal_Blk2.png?content-type=image%2Fpng',
    logoWhiteUrl: 'https://images.squarespace-cdn.com/content/v1/699e2523b3b47f13793c4748/89f7fd71-9df9-41c6-b43a-d2330e040602/LL_LOGO_Horizontal_White2.png',
    applyUrl: 'https://houseofloulous.com/apply',
    supportEmail: 'hello@houseofloulous.com'
  };

  function getSlug() {
    return window.location.pathname.replace(/\/$/, '').toLowerCase();
  }

  function isGated() {
    var s = getSlug();
    return GC.gatedPages.some(function(p) { return s === p || s.startsWith(p + '/'); });
  }

  function isLogin() {
    var s = getSlug();
    return s === GC.loginPage || s.startsWith(GC.loginPage + '/');
  }

  function isAdmin() {
    return document.body.classList.contains('sqs-edit-mode') ||
           window.location.href.includes('/config/') ||
           window.location.href.includes('squarespace.com/');
  }

  function addGateStyles() {
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
      '#loulou-member-nav { position: fixed; top: 0; left: 0; right: 0; z-index: 9999; background: #1a1a1a; display: flex; align-items: center; justify-content: space-between; padding: 0 32px; height: 56px; }',
      '#loulou-member-nav img { height: 28px; }',
      '#loulou-member-nav .ll-nav-links { display: flex; gap: 28px; align-items: center; }',
      '#loulou-member-nav .ll-nav-links a { color: #fff; text-decoration: none; font-family: "Instrument Serif", serif; font-size: 12px; letter-spacing: 0.18em; text-transform: uppercase; }',
      '#loulou-member-nav .ll-nav-links a:hover { opacity: 0.7; }',
      '#loulou-member-nav .ll-signout { color: #aaa !important; font-size: 11px !important; }',
      'body.loulou-nav-on { padding-top: 56px !important; }'
    ].join('\n');
    document.head.appendChild(s);
  }

  function injectNav() {
    if (document.getElementById('loulou-member-nav')) return;
    db.classList.add('loulou-nav-on');
    var nav = document.createElement('div');
    nav.id = 'loulou-member-nav';
    nav.innerHTML = '<a href="/members"><img src="' + GC.logoWhiteUrl + '" alt="LouLous"></a>' +
      '<div class="ll-nav-links">' +
        '<a href="/members">Members</a>' +
        '<a href="/latelier">L\'Atelier</a>' +
        '<a href="/donotdisturb">Do Not Disturb</a>' +
        '<a href="/membersevent">Member Events</a>' +
        '<a href="/ateliertix">Atelier Tix</a>' +
        '<a href="/loulousdonotdisturb">Lou\'s DND</a>' +
        '<a href="#" class="ll-signout" id="ll-signout-btn">Sign Out</a>' +
      '</div>';
    document.body.insertBefore(nav, document.body.firstChild);
    document.getElementById('ll-signout-btn').addEventListener('click', function(e) {
      e.preventDefault();
      window.Clerk.signOut().then(function() { window.location.href = '/'; });
    });
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
    db.appendChild(o);
    document.getElementById('ll-sb').addEventListener('click', function(e) {
      e.preventDefault();
      window.Clerk.openSignIn({
        afterSignInUrl: GC.redirectAfterLogin,
        afterSignUpUrl: GC.redirectAfterLogin
      });
    });
  }

  function showContent() {
    db.classList.remove('loulou-checking');
    var o = document.querySelector('.ll-do');
    if (o) o.remove();
  }

  function handleAuth(clerk) {
    var user = clerk.user;

    if (isLogin()) {
      if (user) {
        var p = new URLSearchParams(window.location.search);
        window.location.href = p.get('redirect') || GC.redirectAfterLogin;
        return;
      }
      var params = new URLSearchParams(window.location.search);
      if (params.has('redirect')) {
        clerk.openSignIn({ afterSignInUrl: params.get('redirect') || GC.redirectAfterLogin });
      }
      return;
    }

    if (user) {
      showContent();
      injectNav();
    } else {
      if (isGated()) {
        db.classList.remove('loulou-checking');
        showDenied();
      }
    }

    clerk.addListener(function() {
      if (!clerk.user) {
        var nav = document.getElementById('loulou-member-nav');
        if (nav) nav.remove();
        db.classList.remove('loulou-nav-on');
        if (isGated()) showDenied();
      }
    });
  }

  function init() {
    if (isAdmin()) return;
    addGateStyles();
    if (isGated()) db.classList.add('loulou-checking');

    var t = setInterval(function() {
      if (window.Clerk) {
        clearInterval(t);
        window.Clerk.load().then(function() {
          handleAuth(window.Clerk);
        }).catch(function() {
          if (isGated()) {
            db.classList.remove('loulou-checking');
            showDenied();
          }
        });
      }
    }, 100);

    setTimeout(function() {
      clearInterval(t);
      if (isGated() && db.classList.contains('loulou-checking')) {
        db.classList.remove('loulou-checking');
        showDenied();
      }
    }, 15000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  new MutationObserver(function() { setupToggle(); }).observe(db, { childList: true, subtree: true });

})();
