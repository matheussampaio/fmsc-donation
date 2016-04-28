(function () {

  angular
    .module('fmsc')
    .component('invoices', {
      controller: invoicesController,
      templateUrl: 'invoices/invoices.html'
    });

  function invoicesController(InvoicesService, AuthService, LoadingService) {
    const vm = this;

    vm.LoadingService = LoadingService;
    vm.$onInit = $onInit;

    ////////////////


    function $onInit() {
      LoadingService.start();

      AuthService.getUser().then(user => {
        vm.invoices = InvoicesService.getAllFromUser(user.uid);

        vm.invoices.$loaded().then(() => {
          LoadingService.stop();
          vm.loading = false;
        });
      });
    }


  }

})();
