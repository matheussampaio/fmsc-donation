(function () {

  angular
    .module('fmsc')
    .component('invoices', {
      controller: invoicesController,
      templateUrl: 'invoices/invoices.html'
    });

  function invoicesController(InvoicesService) {
    const vm = this;

    vm.loading = true;
    vm.$onInit = $onInit;

    ////////////////


    function $onInit() {
      vm.invoices = InvoicesService.getAllFromUser();

      vm.invoices.$loaded().then(() => {
        vm.loading = false;
      });
    }


  }

})();
