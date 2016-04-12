(function () {

  angular
    .module('fmsc')
    .component('donate', {
      controller: donateController,
      templateUrl: 'donate/donate.html'
    });

  function donateController($rootScope, $log, Firebase, DEBUGFirebaseURL, _) {
    const vm = this;
    const _ref = new Firebase(DEBUGFirebaseURL);

    let _imageId = null;

    vm.data = {};
    vm.donate = donate;
    vm.reservedPieces = [];
    vm.availablePieces = [];

    init();

    function donate() {
      $log.debug('donating...');

      getNewReservedPieces().then((newPieces) => {

        const invoice = {};
        invoice.state = vm.data.state;
        invoice.name = vm.data.name;
        invoice.user = 'user';
        invoice.reserved_time = Date.now();
        invoice.pieces = {};

        for (let i = 0; i < newPieces.length; i++) {
          invoice.pieces[newPieces[i]] = true;
        }

        _ref.child('invoices').push(invoice);
        _ref.child(`images/${_imageId}/pieces_reserved`).update(invoice.pieces);

        $log.debug('Invoice');
        $log.debug(invoice);
      });
    }

    function init() {
      getImageID();
    }

    function getImageID() {
      _ref.child('current_image').on('value', (snap) => {
        _imageId = snap.val();
        $log.debug(`Image ID: ${_imageId}`);

        getAvailablePieces();
        getReservedPieces();
      });
    }

    function getAvailablePieces() {
      _ref.child(`images/${_imageId}/pieces_available`).on('value',
        (snapshot) => {
          vm.availablePieces = (snapshot.val() === null)
                             ? [] : Object.keys(snapshot.val());

          $log.debug('Available Pieces');
          $log.debug(vm.availablePieces);

          refresh();
        });
    }

    function getReservedPieces() {
      _ref.child(`images/${_imageId}/pieces_reserved`).on('value',
        (snapshot) => {
          vm.reservedPieces = (snapshot.val() === null)
                            ? [] : Object.keys(snapshot.val());

          $log.debug('Reserved Pieces');
          $log.debug(vm.reservedPieces);

          refresh();
        });
    }

    function removePiece() {
      const newPiece = _.sample(vm.availablePieces);

      // TODO: infinite loop
      return _ref.child(`images/${_imageId}/pieces_available/${newPiece}`)
        .remove()
        .then(() => newPiece)
        .catch(() => removePiece());
    }

    function getNewReservedPieces() {
      const removePromises = [];

      for (let i = 0; i < vm.data.quantity; i++) {
        removePromises.push(removePiece());
      }

      return Promise.all(removePromises);
    }

    function refresh() {
      if (!$rootScope.$$phase) {
        $rootScope.$digest();
      }
    }
  }

})();
