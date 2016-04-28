(function () {

  angular
    .module('fmsc')
    .component('resetPassword', {
      controller: resetPasswordController,
      templateUrl: 'reset-password/reset-password.html'
    });

  function resetPasswordController(AuthService, LoadingService) {
    const vm = this;

    vm.loading = false;
    vm.data = {
      email: null
    };

    vm.reset = reset;

    ////////////////

    function reset() {
      if (!vm.loading) {
        LoadingService.start();
        vm.loading = true;

        console.log('reseting', vm.data);
        AuthService.resetPassword(vm.data)
          .then(() => {
            vm.success = true;
          }).catch(() => {
            // we omit reset fails...
          })
          .then(() => {
            vm.success = true;
            vm.loading = false;
            LoadingService.stop();
          });
      }
    }
  }

})();
