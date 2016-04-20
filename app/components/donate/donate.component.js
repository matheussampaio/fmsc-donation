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

  function donateController($log, UtilsService, InvoicesService) {
    const vm = this;

    vm.data = {};
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
      if (vm.data.quantity && vm.data.name && vm.data.state) {
        InvoicesService.create({
          state: vm.data.state,
          name: vm.data.name,
          quantity: vm.data.quantity
        })
        .then((invoice) => {
          vm.invoice = invoice;
          console.log('invoice', invoice);
        });
      }
    }
  }

})();
