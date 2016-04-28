(function () {

  angular
    .module('fmsc')
    .component('changePassword', {
      controller: changePasswordController,
      templateUrl: 'change-password/change-password.html',
      bindings: {
        user: '<'
      }
    });

  function changePasswordController(_, UtilsService, LoadingService, AuthService) {
    const vm = this;

    vm.data = null;
    vm.refresh = refresh;
    vm.changePassword = changePassword;
    vm.LoadingService = LoadingService;

    vm.$onInit = $onInit;
    ///////////////

    function $onInit() {
      LoadingService.start();
      AuthService.getUser().then(() => {
        LoadingService.stop();
        vm.userLoaded = true;
      });
    }

    function refresh() {
      if (vm.data.newPassword === vm.data.newConfirmPassword) {
        vm.passwordMatch = true;
      } else {
        vm.passwordMatch = false;
      }
    }

    function changePassword() {
      LoadingService.start();

      AuthService.changePassword(vm.data)
        .then(() => {
          vm.success = true;
        })
        .catch(() => {
          vm.error = true;
        })
        .then(() => {
          LoadingService.stop();
        });
    }
  }

})();
