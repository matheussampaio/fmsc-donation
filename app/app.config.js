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
      template: '<home pieces="pieces"></home>',
      resolve: {
        pieces: PiecesService => PiecesService.getPieces('sold')
      },
      /* @ngInject */
      controller: ($scope, pieces) => {
        console.log('vsf');
        $scope.pieces = pieces;
      }
    };

    const donateState = {
      url: 'donate',
      template: '<donate available="available"></donate>',
      resolve: {
        available: PiecesService => PiecesService.getPieces('available')
      },
      /* @ngInject */
      controller: ($scope, available) => {
        $scope.available = available;
      }
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
