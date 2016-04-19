(function () {

  angular
    .module('fmsc')
    .service('PiecesService', PiecesService);

  function PiecesService($q, $log, _, PromiseHandler, FirebaseRef) {
    const vm = {
      imageId: null,
      ref: {
        root: FirebaseRef.root
      }
    };

    const service = {
      reservePieces,
      update
    };

    return service;

    function update({ id, obj }) {
      return vm.ref.root.child(`pieces/${id}`).update(obj);
    }

    function reservePieces({ quantity }) {
      return PromiseHandler.create().start({ quantity, fn: _reservePiece });
    }

    function _reservePiece() {
      const piece = _.sample(vm.pieces.available);

      return vm.ref.root.child(`images/${vm.imageId}/pieces_available/${piece}`)
        .remove()
        .then((...obj) => {
          console.info(obj);

          return vm.ref.root.child(`images/${vm.imageId}/pieces_reserved`)
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

  }
})();
