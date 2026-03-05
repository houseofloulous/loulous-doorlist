(function () {

  // ============================================
  // 1. PARTNER FIELDS TOGGLE
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

  // ============================================
  // 2. CONFIG
  // ============================================
  var GATE_CONFIG = {
    loginPage: '/membershouse',
    gatedPages: [
      '/members',
      '/latelier',
      '/donotdisturb',
      '/obscura',
      '/results',
      '/membersevents',
      '/loulousdonotdisturb',
      '/ateliertix'
    ],
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
      fontFamily: '"Instrument Serif", Georgia, serif',
