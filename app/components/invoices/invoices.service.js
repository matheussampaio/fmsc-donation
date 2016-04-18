(function () {

  angular
    .module('fmsc')
    .service('InvoicesService', InvoicesService);

  function InvoicesService($q, $log, AuthService, PiecesService, PromiseHandler, Firebase,
    DEBUGFirebaseURL) {
    const _ref = new Firebase(DEBUGFirebaseURL);

    const service = {
      create
    };

    return service;

    function create({ state, name, quantity, notify }) {
      const _invoice = {
        state,
        name,
        quantity,
        user: AuthService.user.uid,
        reserved_time: Date.now(),
        pieces: {}
      };

      // try to reserve the pieces
      return PiecesService.reservePieces({ quantity, notify })
        // Update the invoice object with the pieces ids and push to firebase
        .then((pieces) => {
          console.log('pieces.length', pieces.length);
          console.log('_invoice.pieces before:', Object.keys(_invoice.pieces).length);

          pieces.forEach((piece) => {
            if (_invoice.pieces[piece]) {
              console.error('invoice already contains', piece);
            } else {
              _invoice.pieces[piece] = true;
            }
          });

          console.log('_invoice.pieces after:', Object.keys(_invoice.pieces).length);

          return _ref.child('invoices').push(_invoice);
        })
        // For each piece, update with the invoice id
        .then((invoice) => {
          const resource = Object.keys(_invoice.pieces).map((pieceId) => {
            return {
              id: pieceId,
              obj: {
                invoice: invoice.key()
              }
            };
          });

          return PromiseHandler.create().start({ resource, fn: PiecesService.update, notify });
        })
        // return the invoice
        .then(() => {
          return _invoice;
        });
    }

  }
})();
