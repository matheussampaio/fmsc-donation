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

    $stateProvider
      .state('app', appState);

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/');
  }

})();
