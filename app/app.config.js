(function () {

  angular.module('fmsc')
    .run(fmscRun)
    .config(fmscConfig);

  function fmscRun($state, $rootScope, AuthService) {
    $rootScope.$on('$stateChangeStart', (event, toState) => {

      const isAuthenticated = AuthService.isAuthenticated();
      const isPrivateAction = angular.isObject(toState.data) && toState.data.private === true;
      const isPublicOnlyAction = angular.isObject(toState.data) && toState.data.publicOnly === true;

      if (isAuthenticated) {
        if (isPublicOnlyAction) {
          event.preventDefault();
          $state.go('app.home');
        }
      } else {
        if (isPrivateAction) {
          event.preventDefault();
          $state.go('app.login', { from: toState.name });
        }
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

    const donateState = {
      url: 'donate',
      template: '<donate user="user"></donate>',
      data: {
        private: true
      },
      resolve: {
        user: (AuthService) => AuthService.getUser()
      },
      /* @ngInject */
      controller: ($scope, user) => {
        $scope.user = user;
      }
    };

    const invoiceState = {
      url: 'invoice',
      template: '<invoice invoice="invoice"></invoice>',
      data: {
        private: true
      },
      resolve: {
        user: (AuthService) => AuthService.getUser(),
        invoice: (InvoicesService, user) => InvoicesService.getAllFromUser(user.uid)
      },
      /* @ngInject */
      controller: ($scope, invoice) => {
        $scope.invoice = invoice;
      }
    };

    const invoiceDetailsState = {
      url: 'invoice/:invoiceId',
      template: '<invoice invoice="invoice"></invoice>',
      data: {
        private: true
      },
      resolve: {
        user: (AuthService) => AuthService.getUser(),
        invoice: (InvoicesService, $stateParams) => InvoicesService.get($stateParams.invoiceId)
      },
      /* @ngInject */
      controller: ($scope, $state, invoice, user) => {
        $scope.invoice = invoice;

        if (invoice.user !== user.uid) {
          $state.go('app.home');
        }
      }
    };

    const loginState = {
      url: 'login',
      template: '<login></login>',
      data: {
        publicOnly: true
      },
      params: {
        from: 'app.home'
      }
    };

    const registerState = {
      url: 'register',
      data: {
        publicOnly: true
      },
      template: '<register></register>'
    };

    $stateProvider
      .state('app', appState)
        .state('app.home', homeState)
        .state('app.donate', donateState)
        .state('app.invoice', invoiceState)
        .state('app.invoiceDetails', invoiceDetailsState)
        .state('app.login', loginState)
        .state('app.register', registerState);

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/home');
  }

})();
