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
    vm.isOpen = true;

    ////////////////

    function logout() {
      AuthService.logout();
      $state.go('app.home');
    }
  }

})();
