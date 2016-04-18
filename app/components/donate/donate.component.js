(function () {

  angular
    .module('fmsc')
    .component('donate', {
      controller: donateController,
      templateUrl: 'donate/donate.html',
      bindings: {
        available: '<'
      }
    });

  function donateController($log, InvoicesService) {
    const vm = this;

    vm.data = {};
    vm.checkout = checkout;

    ////////////////

    function checkout() {
      InvoicesService.create({
        state: vm.data.state,
        name: vm.data.name,
        quantity: vm.data.quantity,
        notify: _notify
      })
      .then((invoice) => {
        vm.invoice = invoice;
        console.log('invoice', invoice);
      });
    }

    function _notify(progress) {
      vm.data.progress = 100 - (progress * 100 / vm.data.quantity * 2);
    }
  }

})();
