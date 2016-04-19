(function () {

  angular
    .module('fmsc')
    .component('donate', {
      controller: donateController,
      templateUrl: 'donate/donate.html'
    });

  function donateController($log, ImageService, InvoicesService) {
    const vm = this;

    vm.data = {
      loading: true
    };
    vm.checkout = checkout;

    vm.$onInit = $onInit;
    vm.$onDestroy = $onDestroy;

    ////////////////

    function $onInit() {
      ImageService.register({
        id: 'donate',
        resource: 'avaiable',
        fn: _update
      });

      ImageService.getAvaiable()
        .then((available) => {
          vm.data.loading = false;
          vm.data.available = available.length;
        });
    }

    function $onDestroy() {
      ImageService.unregister({
        id: 'donate'
      });

      ImageService.destroyAvaiable();
    }

    function checkout() {
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

    function _update(event) {
      console.log(event);

      if (event.event === 'child_removed') {
        vm.data.available--;
      } else if (event.event === 'child_added') {
        vm.data.available++;
      }
    }
  }

})();
