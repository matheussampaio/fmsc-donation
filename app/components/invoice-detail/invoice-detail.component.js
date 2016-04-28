(function () {

  angular
    .module('fmsc')
    .component('invoiceDetail', {
      controller: invoiceDetailController,
      templateUrl: 'invoice-detail/invoice-detail.html',
      bindings: {
        invoice: '<'
      }
    });

  function invoiceDetailController() {
    // console.log('teste', this.invoice);
  }

})();
