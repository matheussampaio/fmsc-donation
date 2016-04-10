(function () {

  angular.module('fmsc')
    .run(fmscRun)
    .config(fmscConfig);

  function fmscRun($rootScope, $state) {
    $rootScope.$on('$stateChangeStart', (event, toState, toParams) => {
      if (toState.auth && !$rootScope.user) {
        event.preventDefault();
        $state.go('app.signin');
      }
    });
  }

  function fmscConfig($stateProvider, $urlRouterProvider) {
    const appState = {
      url: '/',
      template: '<app></app>'
    };

    const homeState = {
      url: 'home',
      template: '<home></home>'
    };

    const pressState = {
      url: 'press',
      template: '<press></press>'
    };

    const faqState = {
      url: 'faq',
      template: '<faq></faq>'
    };

    const aboutState = {
      url: 'about',
      template: '<about></about>'
    };

    const donateState = {
      url: 'donate',
      template: '<donate></donate>',
      auth: true
    };

    const signinState = {
      url: 'signin',
      template: '<signin></signin>'
    };

    const signupState = {
      url: 'signup',
      template: '<signup></signup>'
    };

    const settingsState = {
      url: 'settings',
      template: '<settings></settings>',
      auth: true
    };

    $stateProvider
      .state('app', appState)
        .state('app.home', homeState)
        .state('app.press', pressState)
        .state('app.faq', faqState)
        .state('app.about', aboutState)
        .state('app.donate', donateState)
        .state('app.signin', signinState)
        .state('app.signup', signupState)
        .state('app.settings', settingsState);

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/home');
  }

})();
