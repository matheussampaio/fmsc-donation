(function () {

  angular
    .module('fmsc')
    .component('invoices', {
      controller: invoicesController,
      templateUrl: 'invoices/invoices.html'
    });

  function invoicesController(InvoicesService, LoadingService) {
    const vm = this;

    vm.LoadingService = LoadingService;
    vm.$onInit = $onInit;

    ////////////////


    function $onInit() {
      LoadingService.start();

      vm.invoices = InvoicesService.getAllFromUser();

      vm.invoices.$loaded().then(() => {
        LoadingService.stop();
        vm.loading = false;
      });
    }


  }

})();
