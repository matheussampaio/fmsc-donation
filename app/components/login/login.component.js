(function () {

  angular
    .module('fmsc')
    .component('login', {
      controller: loginController,
      templateUrl: 'login/login.html'
    });

  function loginController($state, $log, AuthService, LoadingService) {
    const vm = this;

    vm.loading = false;
    vm.data = {
      email: null,
      password: null,
      remember: true
    };

    vm.error = {
      show: null,
      message: {
        INVALID_EMAIL: 'Email or password invalid.',
        INVALID_PASSWORD: 'Email or password invalid.'
      }
    };

    vm.login = login;

    ////////////////

    function login() {
      if (!vm.loading) {
        LoadingService.start();
        vm.loading = true;

        AuthService.login(vm.data)
          .then(() => {
            $state.go($state.params.from);
          }).catch((error) => {
            vm.error.show = error.code;
            LoadingService.stop();
            vm.loading = false;
          });
      }
    }
  }

})();
