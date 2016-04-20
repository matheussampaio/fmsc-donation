(function () {

  angular
    .module('fmsc')
    .component('register', {
      controller: registerController,
      templateUrl: 'register/register.html'
    });

  function registerController($state, $log, UtilsService, AuthService) {
    const vm = this;

    vm.loading = false;
    vm.states = UtilsService.states;
    vm.data = {
      email: null,
      confirmEmail: null,
      password: null,
      confirmPassword: null
    };
    vm.error = {
      show: null,
      message: {
        EMAIL_TAKEN: 'The specified email address is already in use.',
        PASSWORD_NOT_MATCH: 'The confirm password should match.',
        EMAIL_NOT_MATCH: 'The confirm email should match.'
      },
      last: null
    };

    vm.register = register;

    ////////////////

    function register() {
      if (vm.data.email !== vm.data.confirmEmail) {
        vm.error.show = 'EMAIL_NOT_MATCH';

      } else if (vm.data.password !== vm.data.confirmPassword) {
        vm.error.show = 'PASSWORD_NOT_MATCH';

      } else if (!vm.loading) {
        vm.loading = true;
        AuthService.createUser(vm.data)
          .then(() => {
            $state.go('app.home');
          })
          .catch((error) => {
            console.log(error.code, error);
            if (!vm.error.message[error.code]) {
              vm.error.show = 'LAST';
              vm.error.message.last = error;
            } else {
              vm.error.show = error.code;
            }

            vm.loading = false;
          });
      }
    }
  }

})();
