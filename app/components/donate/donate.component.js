(function () {

  angular
    .module('fmsc')
    .component('donate', {
      controller: donateController,
      templateUrl: 'donate/donate.html',
      bindings: {
        user: '<'
      }
    });

  function donateController(UtilsService, InvoicesService, FMSCDebug, LoadingService) {
    const vm = this;

    vm.debugMode = FMSCDebug;
    vm.data = {};
    vm.LoadingService = LoadingService;
    vm.states = UtilsService.statesNames;

    vm.checkout = checkout;
    vm.$onInit = $onInit;

    ////////////////

    function $onInit() {
      vm.data.quantity = 1;
      vm.data.name = vm.user.name;
      vm.data.state = vm.user.state;
    }

    function checkout() {
      if (!vm.LoadingService.isLoading() && vm.data.quantity && vm.data.name && vm.data.state) {
        LoadingService.start();

        InvoicesService.create({
          state: vm.data.state,
          name: vm.data.name,
          quantity: vm.data.quantity
        })
        .then((invoice) => {
          angular.element(document).find('#invoiceKey').val(invoice.key());
          angular.element(document).find('#formDonate').submit();
        });
      }
    }
  }

})();
