(function () {

  angular
    .module('fmsc')
    .component('fmscNavbar', {
      bindings: {
        user: '='
      },
      controller: FmscNavbarController,
      templateUrl: 'fmsc-navbar/fmsc-navbar.html'
    });

  function FmscNavbarController($log, $state, $rootScope, FirebaseService) {
    const vm = this;

    vm.user = $rootScope.user;

    vm.logout = logout;

    ////////////////

    function logout() {
      $log.debug('login out');
      FirebaseService.auth.$unauth();
      $state.go('app.home');
    }
  }

})();
