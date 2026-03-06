(function () {

  var GC = {
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

      /* Gate overlay */
      '.ll-do { position: fixed; inset: 0; background: #F5F0EB; z-index: 99999; display: flex; flex-direction: column; align-items: center; justify-content: center; font-family: "Instrument Serif", serif; }',
      '.ll-do img.ll-logo { width: 180px; margin-bottom: 32px; }',
      '.ll-do hr { width: 60px; border: none; border-top: 1px solid #222; margin: 0 auto 28px; }',
      '.ll-do h2 { font-size: 22px; letter-spacing: 0.18em; text-transform: uppercase; color: #1a1a1a; margin: 0 0 14px; }',
      '.ll-do p { font-size: 15px; color: #444; margin: 0 0 32px; text-align: center; line-height: 1.6; }',
      '.ll-do .ll-links { margin-top: 28px; font-size: 13px; color: #888; }',
      '.ll-do .ll-links a { color: #888; text-decoration: underline; margin: 0 8px; }',

      /* Custom modal */
      '.ll-modal-bg { position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 999999; display: flex; align-items: center; justify-content: center; }',
      '.ll-modal { background: #F5F0EB; padding: 48px 40px; width: 100%; max-width: 440px; font-family: "Instrument Serif", serif; position: relative; }',
      '.ll-modal img { width: 140px; display: block; margin: 0 auto 32px; }',
      '.ll-modal .ll-field { margin-bottom: 24px; position: relative; }',
      '.ll-modal .ll-field input { width: 100%; border: none; border-bottom: 1px solid #ccc; background: transparent; font-family: "Instrument Serif", serif; font-size: 16px; color: #1a1a1a; padding: 10px 0; outline: none; box-sizing: border-box; }',
      '.ll-modal .ll-field input::placeholder { color: #999; }',
      '.ll-modal .ll-field .ll-toggle-pw { position: absolute; right: 0; top: 10px; cursor: pointer; color: #999; font-size: 13px; background: none; border: none; font-family: "Instrument Serif", serif; }',
      '.ll-modal .ll-remember { display: flex; align-items: center; justify-content: space-between; margin-bottom: 28px; font-size: 14px; color: #444; }',
      '.ll-modal .ll-remember label { display: flex; align-items: center; gap: 8px; cursor: pointer; }',
      '.ll-modal .ll-remember a { color: #888; text-decoration: underline; font-size: 13px; }',
      '.ll-modal .ll-submit { width: 100%; background: #1a1a1a; color: #fff; border: none; padding: 16px; font-family: "Instrument Serif", serif; font-size: 13px; letter-spacing: 0.2em; text-transform: uppercase; cursor: pointer; margin-bottom: 24px; }',
      '.ll-modal .ll-submit:hover { background: #333; }',
      '.ll-modal .ll-submit:disabled { background: #999; cursor: not-allowed; }',
      '.ll-modal .ll-or { text-align: center; color: #bbb; font-size: 13px; margin-bottom: 20px; display: flex; align-items: center; gap: 12px; }',
      '.ll-modal .ll-or::before, .ll-modal .ll-or::after { content: ""; flex: 1; border-top: 1px solid #ddd; }',
      '.ll-modal .ll-bottom { text-align: center; font-size: 13px; color: #888; }',
      '.ll-modal .ll-bottom a { color: #1a1a1a; font-weight: 600; text-decoration: none; }',
      '.ll-modal .ll-error { color: #c0392b; font-size: 13px; margin-bottom: 16px; text-align: center; min-height: 18px; }',
      '.ll-modal .ll-success { color: #27ae60; font-size: 13px; margin-bottom: 16px; text-align: center; min-height: 18px; }',
      '.ll-modal .ll-close { position: absolute; top: 16px; right: 20px; background: none; border: none; font-size: 20px; cursor: pointer; color: #999; }',

      /* Sign out button */
      '#ll-signout-btn { background: none; border: none; cursor: pointer; font-family: "Instrument Serif", serif; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: #999; padding: 0; margin-left: 24px; }',
      '#ll-signout-btn:hover { color: #333; }'
    ].join('\n');
    document.head.appendChild(s);
  }

  function openModal() {
    if (document.querySelector('.ll-modal-bg')) return;

    var bg = document.createElement('div');
    bg.className = 'll-modal-bg';
    bg.innerHTML =
      '<div class="ll-modal">' +
        '<button class="ll-close" id="ll-close-btn">&times;</button>' +
        '<img src="' + GC.logoUrl + '" alt="LouLous">' +
        '<div class="ll-field">' +
          '<input type="email" id="ll-email" placeholder="Email" autocomplete="email">' +
        '</div>' +
        '<div class="ll-field">' +
          '<input type="password" id="ll-password" placeholder="Password" autocomplete="current-password">' +
          '<button type="button" class="ll-toggle-pw" id="ll-toggle-pw">Show</button>' +
        '</div>' +
        '<div class="ll-remember">' +
          '<label><input type="checkbox" id="ll-remember"> Remember me</label>' +
          '<a href="#" id="ll-forgot">Forgot Password?</a>' +
        '</div>' +
        '<div class="ll-error" id="ll-error"></div>' +
        '<button class="ll-submit" id="ll-submit">SIGN IN</button>' +
        '<div class="ll-or">OR</div>' +
        '<div class="ll-bottom">Need an account? <a href="' + GC.applyUrl + '">Apply now</a></div>' +
      '</div>';

    document.body.appendChild(bg);

    // Close
    document.getElementById('ll-close-btn').addEventListener('click', function() {
      bg.remove();
    });
    bg.addEventListener('click', function(e) {
      if (e.target === bg) bg.remove();
    });

    // Show/hide password
    var pwInput = document.getElementById('ll-password');
    var toggleBtn = document.getElementById('ll-toggle-pw');
    toggleBtn.addEventListener('click', function() {
      if (pwInput.type === 'password') {
        pwInput.type = 'text';
        toggleBtn.textContent = 'Hide';
      } else {
        pwInput.type = 'password';
        toggleBtn.textContent = 'Show';
      }
    });

    // Forgot password
    document.getElementById('ll-forgot').addEventListener('click', function(e) {
      e.preventDefault();
      var email = document.getElementById('ll-email').value.trim();
      var errEl = document.getElementById('ll-error');
      if (!email) {
        errEl.textContent = 'Please enter your email address first.';
        return;
      }
      errEl.textContent = '';
      window.Clerk.client.signIn.create({
        strategy: 'reset_password_email_code',
        identifier: email
      }).then(function() {
        errEl.style.color = '#27ae60';
        errEl.textContent = 'Password reset email sent. Please check your inbox.';
      }).catch(function() {
        errEl.style.color = '#c0392b';
        errEl.textContent = 'Could not send reset email. Please contact ' + GC.supportEmail;
      });
    });

    // Sign in
    document.getElementById('ll-submit').addEventListener('click', function() {
      var email = document.getElementById('ll-email').value.trim();
      var password = document.getElementById('ll-password').value;
      var errEl = document.getElementById('ll-error');
      var btn = document.getElementById('ll-submit');

      errEl.textContent = '';
      if (!email || !password) {
        errEl.textContent = 'Please enter your email and password.';
        return;
      }

      btn.disabled = true;
      btn.textContent = 'SIGNING IN...';

      window.Clerk.client.signIn.create({
        identifier: email,
        password: password
      }).then(function(result) {
        if (result.status === 'complete') {
          window.Clerk.setActive({ session: result.createdSessionId }).then(function() {
            window.location.href = GC.redirectAfterLogin;
          });
        } else {
          errEl.textContent = 'Sign in incomplete. Please try again or contact ' + GC.supportEmail;
          btn.disabled = false;
          btn.textContent = 'SIGN IN';
        }
      }).catch(function(err) {
        var msg = (err.errors && err.errors[0] && err.errors[0].message) || 'Incorrect email or password.';
        errEl.textContent = msg;
        btn.disabled = false;
        btn.textContent = 'SIGN IN';
      });
    });

    // Enter key
    document.getElementById('ll-password').addEventListener('keydown', function(e) {
      if (e.key === 'Enter') document.getElementById('ll-submit').click();
    });
    document.getElementById('ll-email').addEventListener('keydown', function(e) {
      if (e.key === 'Enter') document.getElementById('ll-password').focus();
    });
  }

  function showDenied() {
    if (document.querySelector('.ll-do')) return;
    var o = document.createElement('div');
    o.className = 'll-do';
    o.innerHTML =
      '<img class="ll-logo" src="' + GC.logoUrl + '" alt="LouLous"><hr>' +
      '<h2>Members Only</h2>' +
      '<p>This page is reserved for approved members.<br>Please sign in to continue.</p>' +
      '<button id="ll-sb" style="background:#1a1a1a;color:#fff;border:none;padding:16px 48px;font-family:\'Instrument Serif\',serif;font-size:13px;letter-spacing:0.2em;text-transform:uppercase;cursor:pointer;">SIGN IN</button>' +
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
    s.textContent = 'a[href="/apply"], a[href*="/apply"], [data-link-href*="/apply"], .header-nav-item:has(a[href*="/apply"]) { display: none !important; }';
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
    new MutationObserver(function() { setupToggle(); }).observe(document.body, { childList: true, subtree: true });

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
