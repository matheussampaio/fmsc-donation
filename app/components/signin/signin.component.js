(function () {

  angular
    .module('fmsc')
    .component('signin', {
      controller: signinController,
      templateUrl: 'signin/signin.html'
    });

  function signinController($log, $state, $rootScope, FirebaseService) {
    const vm = this;

    vm.data = {
      email: '',
      password: ''
    };

    vm.login = login;

    ////////////////

    function login() {
      FirebaseService.auth.$authWithPassword({
        email: vm.data.email,
        password: vm.data.password
      }).then((user) => {
        $log.debug('Logged in as:', user);
        $rootScope.user = user;
        $state.go('app.home');
      }).catch((error) => {
        vm.error = error;
        $log.error('Authentication failed:', error);
      });
    }

  }

})();
