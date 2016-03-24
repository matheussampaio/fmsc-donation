(function () {

  angular
    .module('fmsc')
    .component('signup', {
      controller: signupController,
      templateUrl: 'signup/signup.html'
    });

  function signupController($log, $state, $rootScope, FirebaseService) {
    const vm = this;

    vm.data = {
      email: undefined,
      password: undefined
    };

    vm.register = register;

    ////////////////

    function register() {
      FirebaseService.auth.$createUser({
        email: vm.data.email,
        password: vm.data.password
      }).then((user) => {
        $log.debug('Logged in as: ', user.uid);

        return FirebaseService.auth.$authWithPassword({
          email: vm.data.email,
          password: vm.data.password
        });
      }).then((user) => {
        $rootScope.user = user;
        $state.go('app.home');
      }).catch((error) => {
        $log.error('Error: ', error);
      });
    }

  }

})();
