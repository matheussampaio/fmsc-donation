(function () {

  angular
    .module('fmsc')
    .component('invoice', {
      controller: invoiceController,
      templateUrl: 'invoice/invoice.html',
      bindings: {
        invoice: '<'
      }
    });

  function invoiceController($log) {
    const vm = this;
  }

})();
