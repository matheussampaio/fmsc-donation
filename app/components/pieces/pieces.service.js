(function () {

  angular
    .module('fmsc')
    .service('PiecesService', PiecesService);

  function PiecesService($log, Firebase, DEBUGFirebaseURL) {
    const _ref = new Firebase(DEBUGFirebaseURL);
    const vm = this;

    let _imageId;

    vm.pieces = {};
    vm.pieces.available = [];
    vm.pieces.reserved = [];
    vm.pieces.sold = [];

    const service = {
      getPieces
    };

    init();

    return service;

    function init() {
      $log.debug('init() PiecesService');

      getCurrentImage()
        .then(setPieces)
        .then(() => {
          $log.debug('setPieces() finished');
          $log.debug(vm.pieces);
        });
    }

    function getCurrentImage() {
      $log.debug('getCurrentImage()');

      // TODO: how to make sure the app will wait till we get the image id?
      return _ref.child('current_image').once('value', (snap) => {
        _imageId = snap.val();
      });
    }

    function setPieces() {
      $log.debug('setPieces()');

      const setPromises = [];
      setPromises.push(setAvailablePieces());
      setPromises.push(setReservedPieces());
      setPromises.push(setSoldPieces());

      return Promise.all(setPromises);
    }

    function setAvailablePieces() {
      return _ref.child(`images/${_imageId}/pieces_available`).once('value',
        (available) => {
          vm.pieces.available = (available.val() === null)
                              ? [] : Object.keys(available.val());
        });
    }

    function setReservedPieces() {
      return _ref.child(`images/${_imageId}/pieces_reserved`).once('value',
        (reserved) => {
          vm.pieces.reserved = (reserved.val() === null)
                             ? [] : Object.keys(reserved.val());
        });
    }

    function setSoldPieces() {
      return _ref.child(`images/${_imageId}/pieces_sold`).once('value',
        (sold) => {
          vm.pieces.sold = (sold.val() === null)
                         ? [] : Object.keys(sold.val());
        });
    }

    function getPieces(type) {
      if (type === 'available') {
        return vm.pieces.available;
      }

      if (type === 'reserved') {
        return vm.pieces.reserved;
      }

      if (type === 'sold') {
        return vm.pieces.sold;
      }

      return vm.pieces;
    }
  }
})();
