(function () {

  angular
    .module('fmsc')
    .component('loading', {
      controller: loadingController,
      templateUrl: 'loading/loading.html'
    });

  function loadingController(LoadingService) {
    const vm = this;

    vm.LoadingService = LoadingService;
  }

})();
