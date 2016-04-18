(function () {

  angular
    .module('fmsc')
    .service('PiecesService', PiecesService);

  function PiecesService($q, $log, _, PromiseHandler, FirebaseRef) {
    const _ref = FirebaseRef.root;
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
      console.log('pieces service activate');
      _promise = getCurrentImage().then(setPieces);
    }

    function getPieces(type) {
      return $q.when(_promise.then(() => vm.pieces[type]));
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
        return Promise.resolve();
      }

      return _ref.child('current_image')
        .once('value', (snap) => {
          _imageId = snap.val();
        });
    }

    function setPieces() {
      return Promise.all([
        setAvailablePieces(),
        setReservedPieces(),
        setSoldPieces()
      ]);
    }

    function setAvailablePieces() {
      return _ref.child(`images/${_imageId}/pieces_available`)
        .once('value', (available) => {
          if (available.val() !== null) {
            vm.pieces.available = Object.keys(available.val());
          }
        });
    }

    function setReservedPieces() {
      return _ref.child(`images/${_imageId}/pieces_reserved`)
        .once('value', (reserved) => {
          if (reserved.val() !== null) {
            vm.pieces.reserved = Object.keys(reserved.val());
          }
        });
    }

    function setSoldPieces() {
      return _ref.child(`images/${_imageId}/pieces_sold`)
        .once('value', (sold) => {
          if (sold.val() !== null) {
            vm.pieces.sold = Object.keys(sold.val());
          }
        });
    }

  }
})();
