(function () {

  angular
    .module('fmsc')
    .service('PiecesService', PiecesService);

  function PiecesService($q, $log, _, PromiseHandler, Firebase, DEBUGFirebaseURL) {
    const _ref = new Firebase(DEBUGFirebaseURL);
    const vm = this;

    let _imageId = null;
    let _promise = null;

    vm.pieces = {};
    vm.pieces.available = [];
    vm.pieces.reserved = [];
    vm.pieces.sold = [];

    const service = {
      getPieces,
      reservePieces,
      update
    };

    activate();

    return service;

    function activate() {
      _promise = getCurrentImage().then(setPieces);
    }

    function getPieces(type) {
      return _promise.then(() => {
        return vm.pieces[type];
      });
    }

    function update({ id, obj }) {
      return _ref.child(`pieces/${id}`).update(obj);
    }

    function reservePieces({ quantity, notify }) {
      return getCurrentImage()
        .then(() => {
          return PromiseHandler.create().start({ quantity, fn: _reservePiece, notify });
        });
    }

    function _reservePiece() {
      const piece = _.sample(vm.pieces.available);

      return _ref.child(`images/${_imageId}/pieces_available/${piece}`)
        .remove()
        .then(() => {
          return _ref.child(`images/${_imageId}/pieces_reserved`)
            .update({
              [piece]: true
            });
        })
        .then((error) => {
          if (error) console.warn(error);
          return piece;
        })
        .catch((error) => {
          if (error) console.error(error);
          _reservePiece();
        });
    }

    function getCurrentImage() {
      if (_imageId !== null) {
        return $q.when();
      }

      return $q.when(_ref.child('current_image')
        .once('value', (snap) => {
          _imageId = snap.val();
        }));
    }

    function setPieces() {
      return $q.all([
        setAvailablePieces(),
        setReservedPieces(),
        setSoldPieces()
      ]);
    }

    function setAvailablePieces() {
      return $q.when(_ref.child(`images/${_imageId}/pieces_available`)
        .once('value', (available) => {
          if (available.val() !== null) {
            vm.pieces.available = Object.keys(available.val());
          }
        }));
    }

    function setReservedPieces() {
      return $q.when(_ref.child(`images/${_imageId}/pieces_reserved`)
        .once('value', (reserved) => {
          if (reserved.val() !== null) {
            vm.pieces.reserved = Object.keys(reserved.val());
          }
        }));
    }

    function setSoldPieces() {
      return $q.when(_ref.child(`images/${_imageId}/pieces_sold`)
        .once('value', (sold) => {
          if (sold.val() !== null) {
            vm.pieces.sold = Object.keys(sold.val());
          }
        }));
    }

  }
})();
