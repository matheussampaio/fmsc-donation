(function () {

  angular
    .module('fmsc')
    .component('profile', {
      controller: profileController,
      templateUrl: 'profile/profile.html',
      bindings: {
        user: '<'
      }
    });

  function profileController(_, UtilsService, LoadingService, AuthService) {
    const vm = this;

    vm.data = null;
    vm.LoadingService = LoadingService;
    vm.states = UtilsService.statesNames;
    vm.update = update;
    vm.cancel = cancel;
    vm.save = save;

    vm.$onInit = $onInit;

    ///////////////

    function $onInit() {
      LoadingService.start();
      AuthService.getUser().then((user) => {
        LoadingService.stop();
        vm.data = {
          name: user.name,
          state: user.state
        };
      });
    }

    function update() {
      if (vm.data.name !== AuthService.user.name) {
        vm.updating = true;
      } else {
        vm.updating = false;
      }
    }

    function cancel() {
      vm.data.name = AuthService.user.name;
      vm.data.state = AuthService.user.state;
      vm.updating = false;
    }

    function save() {
      vm.updating = false;

      LoadingService.start();

      AuthService.update(vm.data).then(() => {
        LoadingService.stop();
        vm.updating = false;
      });
    }
  }

})();
