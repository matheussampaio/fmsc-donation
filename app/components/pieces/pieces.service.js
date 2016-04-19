(function () {

  angular
    .module('fmsc')
    .service('PiecesService', PiecesService);

  function PiecesService($q, $log, _, PromiseHandler, ImageService, FirebaseRef) {
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
      Promise.all([
        ImageService.getAvailable(),
        ImageService.getReserved()
      ]).then(([available, reserved]) => {
        return available.$remove(_.random(available.length - 1)).then(piece => {
          console.log('removed', piece.key());
          reserved[piece] = true;
          return reserved.$save(piece);
        });
      })
      .then(piece => {
        console.log(piece);
        return piece.key();
      })
      .catch(error => {
        if (error) console.error(error);
        // _reservePiece();
      });
    }

  }
})();
