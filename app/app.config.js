(function () {

  angular.module('fmsc')
    .run(fmscRun)
    .config(fmscConfig);

  function fmscRun() {
    // $rootScope.$on('$stateChangeStart', (event, toState, toParams) => {
    //   if (toState.auth && !$rootScope.user) {
    //     event.preventDefault();
    //     $state.go('app.login');
    //   }
    // });
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

    const donateState = {
      url: 'donate',
      template: '<donate></donate>'
    };

    const loginState = {
      url: 'login',
      template: '<login></login>'
    };

    const registerState = {
      url: 'register',
      template: '<register></register>'
    };

    const adminState = {
      url: 'admin',
      template: '<admin></admin>'
    };

    $stateProvider
      .state('app', appState)
        .state('app.home', homeState)
        .state('app.donate', donateState)
        .state('app.login', loginState)
        .state('app.register', registerState)
        .state('app.admin', adminState);

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/home');
  }

})();
