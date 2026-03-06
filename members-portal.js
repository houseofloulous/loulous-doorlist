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

  document.addEventListener('DOMContentLoaded', function() {
    if (isAdmin()) return;

    var t = setInterval(function() {
      if (window.Clerk) {
        clearInterval(t);
        var clerk = new window.Clerk(GC.clerkKey);
        clerk.load().then(function() {
          var user = clerk.user;
          if (isLogin() && user) {
            window.location.href = GC.redirectAfterLogin;
            return;
          }
          if (isGated() && !user) {
            var o = document.createElement('div');
            o.style.cssText = 'position:fixed;inset:0;background:#F5F0EB;z-index:99999;display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:"Instrument Serif",serif;';
            o.innerHTML = '<img src="' + GC.logoUrl + '" style="width:180px;margin-bottom:32px;"><hr style="width:60px;border:none;border-top:1px solid #222;margin:0 auto 28px;"><h2 style="font-size:22px;letter-spacing:0.18em;text-transform:uppercase;color:#1a1a1a;margin:0 0 14px;">Members Only</h2><p style="font-size:15px;color:#444;margin:0 0 32px;text-align:center;line-height:1.6;">This page is reserved for approved members.<br>Please sign in to continue.</p><button id="ll-sb" style="background:#1a1a1a;color:#fff;border:none;padding:16px 48px;font-family:\'Instrument Serif\',serif;font-size:13px;letter-spacing:0.2em;text-transform:uppercase;cursor:pointer;">SIGN IN</button><div style="margin-top:28px;font-size:13px;color:#888;"><a href="' + GC.applyUrl + '" style="color:#888;text-decoration:underline;margin:0 8px;">Apply now</a> &nbsp;|&nbsp; <a href="mailto:' + GC.supportEmail + '" style="color:#888;text-decoration:underline;margin:0 8px;">Contact us</a></div>';
            document.body.appendChild(o);
            document.getElementById('ll-sb').addEventListener('click', function(e) {
              e.preventDefault();
              window.__llOpenModal && window.__llOpenModal();
            });
          }
          if (isGated() && user) {
            var style = document.createElement('style');
            style.textContent = 'a[href="/apply"],a[href*="/apply"],[data-link-href*="/apply"],.header-nav-item:has(a[href*="/apply"]){display:none!important;}';
            document.head.appendChild(style);
          }
          if (isLogin() && !user) {
            window.__llOpenModal = function() {
              alert('Modal coming next step');
            };
          }
        });
      }
    }, 100);

    setTimeout(function() { clearInterval(t); }, 15000);
  });

})();
