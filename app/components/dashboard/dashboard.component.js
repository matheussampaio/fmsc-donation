(function () {

  angular
    .module('fmsc')
    .component('dashboard', {
      controller: dashboardController,
      templateUrl: 'dashboard/dashboard.html'
    });

  function dashboardController(ImageService) {
    const vm = this;

    vm.ImageService = ImageService;
  }

})();
