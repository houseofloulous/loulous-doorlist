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
      headerSu
