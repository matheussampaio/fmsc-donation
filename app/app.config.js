(function () {

  angular.module('fmsc')
    .run(fmscRun)
    .config(fmscConfig);

  function fmscRun($state, $rootScope, AuthService) {
    $rootScope.$on('$stateChangeStart', (event, toState) => {

      // if already authenticated...
      const isAuthenticated = AuthService.isAuthenticated();
      // any public action is allowed
      const isPrivateAction = angular.isObject(toState.data) && toState.data.private === true;

      if (!isAuthenticated && isPrivateAction) {
        event.preventDefault();

        $state.go('app.login', { from: toState.name });
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
      params: {
        from: 'app.home'
      }
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
        .state('app.invoice', invoiceState)
        .state('app.invoiceDetails', invoiceDetailsState)
        .state('app.login', loginState)
        .state('app.register', registerState)
        .state('app.admin', adminState);

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/home');
  }

})();
