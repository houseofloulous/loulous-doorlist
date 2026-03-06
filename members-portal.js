(function () {
  var GC = {
    clerkKey: 'pk_live_Y2xlcmsuaG91c2VvZmxvdWxvdXMuY29tJA',
    loginPage: '/membershouse',
    gatedPages: ['/members','/latelier','/donotdisturb','/membersevent','/ateliertix','/loulousdonotdisturb'],
    redirectAfterLogin: '/members',
    logoUrl: 'https://images.squarespace-cdn.com/content/699e2523b3b47f13793c4748/0d527c23-2099-4148-8bdf-28a9c7d97381/LL_LOGO_Horizontal_Blk2.png?content-type=image%2Fpng',
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
    return getSlug() === GC.loginPage;
  }

  function isAdmin() {
    return document.body.classList.contains('sqs-edit-mode') ||
           window.location.href.includes('/config/') ||
           window.location.href.includes('squarespace.com/');
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

  function showDenied(clerk) {
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
      openSignInModal(clerk);
    });
  }

  function openSignInModal(clerk) {
    var bg = document.createElement('div');
    bg.className = 'll-modal-bg';
    bg.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.4);z-index:999999;display:flex;align-items:center;justify-content:center;';
    bg.innerHTML =
      '<div style="background:#F5F0EB;padding:48px 40px;width:100%;max-width:440px;font-family:\'Instrument Serif\',serif;position:relative;box-sizing:border-box;">' +
        '<button id="ll-close" style="position:absolute;top:16px;right:20px;background:none;border:none;font-size:20px;cursor:pointer;color:#999;">&times;</button>' +
        '<img src="' + GC.logoUrl + '" style="width:140px;display:block;margin:0 auto 32px;">' +
        '<div style="margin-bottom:24px;position:relative;">' +
          '<input type="email" id="ll-email" placeholder="Email" autocomplete="email" style="width:100%;border:none;border-bottom:1px solid #ccc;background:transparent;font-family:\'Instrument Serif\',serif;font-size:16px;color:#1a1a1a;padding:10px 0;outline:none;box-sizing:border-box;">' +
        '</div>' +
        '<div style="margin-bottom:24px;position:relative;">' +
          '<input type="password" id="ll-password" placeholder="Password" autocomplete="current-password" style="width:100%;border:none;border-bottom:1px solid #ccc;background:transparent;font-family:\'Instrument Serif\',serif;font-size:16px;color:#1a1a1a;padding:10px 0;outline:none;box-sizing:border-box;">' +
          '<button type="button" id="ll-toggle-pw" style="position:absolute;right:0;top:10px;cursor:pointer;color:#999;font-size:13px;background:none;border:none;font-family:\'Instrument Serif\',serif;">Show</button>' +
        '</div>' +
        '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:28px;font-size:14px;color:#444;">' +
          '<label style="display:flex;align-items:center;gap:8px;cursor:pointer;"><input type="checkbox" id="ll-remember"> Remember me</label>' +
          '<a href="#" id="ll-forgot" style="color:#888;text-decoration:underline;font-size:13px;">Forgot Password?</a>' +
        '</div>' +
        '<div id="ll-error" style="color:#c0392b;font-size:13px;margin-bottom:16px;text-align:center;min-height:18px;"></div>' +
        '<button id="ll-submit" style="width:100%;background:#1a1a1a;color:#fff;border:none;padding:16px;font-family:\'Instrument Serif\',serif;font-size:13px;letter-spacing:0.2em;text-transform:uppercase;cursor:pointer;margin-bottom:24px;">SIGN IN</button>' +
        '<div style="text-align:center;color:#bbb;font-size:13px;margin-bottom:20px;display:flex;align-items:center;gap:12px;"><span style="flex:1;border-top:1px solid #ddd;display:block;"></span>OR<span style="flex:1;border-top:1px solid #ddd;display:block;"></span></div>' +
        '<div style="text-align:center;font-size:13px;color:#888;">Need an account? <a href="' + GC.applyUrl + '" style="color:#1a1a1a;font-weight:600;text-decoration:none;">Apply now</a></div>' +
      '</div>';
    document.body.appendChild(bg);

    document.getElementById('ll-close').addEventListener('click', function() { bg.remove(); });
    bg.addEventListener('click', function(e) { if (e.target === bg) bg.remove(); });

    var pwInput = document.getElementById('ll-password');
    document.getElementById('ll-toggle-pw').addEventListener('click', function() {
      if (pwInput.type === 'password') { pwInput.type = 'text'; this.textContent = 'Hide'; }
      else { pwInput.type = 'password'; this.textContent = 'Show'; }
    });

    document.getElementById('ll-forgot').addEventListener('click', function(e) {
      e.preventDefault();
      var email = document.getElementById('ll-email').value.trim();
      var errEl = document.getElementById('ll-error');
      if (!email) { errEl.textContent = 'Please enter your email first.'; return; }
      errEl.style.color = '#1a1a1a'; errEl.textContent = 'Sending...';
      clerk.client.signIn.create({ strategy: 'reset_password_email_code', identifier: email })
        .then(function() { errEl.style.color = '#27ae60'; errEl.textContent = 'Reset email sent. Check your inbox.'; })
        .catch(function() { errEl.style.color = '#c0392b'; errEl.textContent = 'Could not send reset email. Contact ' + GC.supportEmail; });
    });

    document.getElementById('ll-submit').addEventListener('click', function() {
      var email = document.getElementById('ll-email').value.trim();
      var password = document.getElementById('ll-password').value;
      var errEl = document.getElementById('ll-error');
      var btn = document.getElementById('ll-submit');
      errEl.textContent = '';
      if (!email || !password) { errEl.textContent = 'Please enter your email and password.'; return; }
      btn.disabled = true; btn.textContent = 'SIGNING IN...';
      clerk.client.signIn.create({ identifier: email, password: password })
        .then(function(result) {
          if (result.status === 'complete') {
            clerk.setActive({ session: result.createdSessionId }).then(function() {
              window.location.href = GC.redirectAfterLogin;
            });
          } else {
            errEl.textContent = 'Sign in incomplete. Contact ' + GC.supportEmail;
            btn.disabled = false; btn.textContent = 'SIGN IN';
          }
        })
        .catch(function(err) {
          var msg = (err.errors && err.errors[0] && err.errors[0].message) || 'Incorrect email or password.';
          errEl.textContent = msg;
          btn.disabled = false; btn.textContent = 'SIGN IN';
        });
    });

    document.getElementById('ll-password').addEventListener('keydown', function(e) { if (e.key === 'Enter') document.getElementById('ll-submit').click(); });
    document.getElementById('ll-email').addEventListener('keydown', function(e) { if (e.key === 'Enter') document.getElementById('ll-password').focus(); });
    setTimeout(function() { document.getElementById('ll-email').focus(); }, 100);
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
    s.textContent = '.header-nav-item:has(a[href*="/apply"]) { display: none !important; }';
    document.head.appendChild(s);
  }

  function injectSignOut(clerk) {
    if (document.getElementById('ll-signout-btn')) return;
    var nav = document.querySelector('.header-nav, .main-nav, nav, [data-section-type="header-section"]');
    if (!nav) return;
    var btn = document.createElement('button');
    btn.id = 'll-signout-btn';
    btn.textContent = 'SIGN OUT';
    btn.addEventListener('click', function() {
      clerk.signOut().then(function() { window.location.href = '/'; });
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
      if (user) { window.location.href = GC.redirectAfterLogin; return; }
      document.addEventListener('click', function(e) {
        var el = e.target.closest('a, button');
        if (!el) return;
        var txt = (el.textContent || '').trim().toUpperCase();
        if (txt === 'ENTER') {
          e.preventDefault();
          e.stopPropagation();
          openSignInModal(clerk);
        }
      }, true);
      return;
    }

    if (isGated()) {
      if (user) {
        showContent();
        hideRequestEntry();
        injectSignOut(clerk);
      } else {
        document.body.classList.remove('loulou-checking');
        showDenied(clerk);
      }
      clerk.addListener(function() {
        if (!clerk.user) {
          var btn = document.getElementById('ll-signout-btn');
          if (btn) btn.remove();
          var ns = document.getElementById('ll-nav-style');
          if (ns) ns.remove();
          showDenied(clerk);
        }
      });
    }
  }

  document.addEventListener('DOMContentLoaded', function() {
    if (isAdmin()) return;
    addStyles();
    if (isGated()) document.body.classList.add('loulou-checking');
    setTimeout(setupToggle, 1000);
    new MutationObserver(function() { setupToggle(); }).observe(document.body, { childList: true, subtree: true });

    var t = setInterval(function() {
      if (window.Clerk) {
        clearInterval(t);
        var clerkInstance = new window.Clerk(GC.clerkKey);
        clerkInstance.load().then(function() {
          handleAuth(clerkInstance);
        }).catch(function() {
          if (isGated()) {
            document.body.classList.remove('loulou-checking');
            showDenied(null);
          }
        });
      }
    }, 100);

    setTimeout(function() {
      clearInterval(t);
      if (isGated() && document.body.classList.contains('loulou-checking')) {
        document.body.classList.remove('loulou-checking');
        showDenied(null);
      }
    }, 15000);
  });

})();
