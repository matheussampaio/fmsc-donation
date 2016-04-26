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

  function profileController($log) {
    const vm = this;

    $log.debug(vm.user);
  }

})();
