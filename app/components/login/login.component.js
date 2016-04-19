(function () {

  angular
    .module('fmsc')
    .component('login', {
      controller: loginController,
      templateUrl: 'login/login.html'
    });

  function loginController($state, $log, AuthService) {
    const vm = this;

    vm.data = {
      email: null,
      password: null,
      remember: true
    };

    vm.login = login;

    ////////////////

    function login() {
      AuthService.login(vm.data)
        .then((user) => {
          $log.debug('Logged in as:', user);
          $state.go($state.params.from);
        }).catch((error) => {
          vm.error = error;
          $log.error('Authentication failed:', error);
        });
    }
  }

})();
