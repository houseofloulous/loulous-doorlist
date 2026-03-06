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
      '<div style="background:#F5F0EB;padding:48px
