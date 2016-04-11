(function () {

  angular
    .module('fmsc')
    .component('toolbar', {
      controller: toolbarController,
      templateUrl: 'toolbar/toolbar.html'
    });

  function toolbarController($state, $log, UserService) {
    const vm = this;

    vm.user = UserService;

    vm.logout = logout;

    ////////////////

    function logout() {
      UserService.logout();
      $state.go('app.home');
    }
  }

})();
