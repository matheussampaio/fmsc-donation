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

  function donateController(UtilsService, InvoicesService, FMSCDebug) {
    const vm = this;

    vm.debugMode = FMSCDebug;
    vm.data = {};
    vm.loading = false;
    vm.states = UtilsService.states;

    vm.checkout = checkout;
    vm.$onInit = $onInit;

    ////////////////

    function $onInit() {
      vm.data.quantity = 1;
      vm.data.name = vm.user.name;
      vm.data.state = vm.user.state;
    }

    function checkout() {
      if (!vm.loading && vm.data.quantity && vm.data.name && vm.data.state) {
        vm.loading = true;

        InvoicesService.create({
          state: vm.data.state,
          name: vm.data.name,
          quantity: vm.data.quantity
        })
        .then((invoice) => {
          $('#invoiceKey').val(invoice.key());
          $('#formDonate').submit();
        });
      }
    }
  }

})();
