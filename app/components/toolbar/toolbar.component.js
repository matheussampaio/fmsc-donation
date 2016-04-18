(function () {

  angular
    .module('fmsc')
    .component('toolbar', {
      controller: toolbarController,
      templateUrl: 'toolbar/toolbar.html'
    });

  function toolbarController($state, $log, AuthService) {
    const vm = this;

    vm.auth = AuthService;

    vm.logout = logout;

    ////////////////

    function logout() {
      AuthService.logout();
      $state.go('app.home');
    }
  }

})();
