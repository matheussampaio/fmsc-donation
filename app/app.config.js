(function () {

  angular.module('fmsc')
    .config(fmscConfig);

  function fmscConfig($stateProvider, $urlRouterProvider) {
    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js

    const appState = {
      url: '/',
      controller: 'AppController as appCtrl',
      templateUrl: 'app/app.html'
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
      template: '<donate></donate>'
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
      template: '<settings></settings>'
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
