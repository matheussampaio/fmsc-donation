(function () {

  angular
    .module('fmsc')
    .component('millionImage', {
      controller: millionImageController,
      templateUrl: 'million-image/million-image.html'
    });

  function millionImageController($rootScope, $log, Firebase, DEBUGFirebaseURL) {
    const vm = this;
    const _ref = new Firebase(DEBUGFirebaseURL);

    let _imageId = null;

    vm.rows = [];
    vm.cols = [];
    vm.meals = [];
    vm.soldPieces = [];
    vm.isBought = isBought;
    vm.showBuyer = showBuyer;
    vm.hideBuyer = hideBuyer;

    init();

    ////////////////

    function init() {
      getImageID();
    }

    function getImageID() {
      _ref.child('current_image').on('value', (snap) => {
        _imageId = snap.val();
        $log.debug(`Image ID: ${_imageId}`);

        getSoldPieces();
      });
    }

    function getSoldPieces() {
      // TODO: change to pieces_sold
      _ref.child(`images/${_imageId}/pieces_reserved`).on('value',
        (snapshot) => {
          const soldPieces = (snapshot.val() === null)
                           ? [] : Object.keys(snapshot.val());

          $log.debug('Sold Pieces');
          $log.debug(soldPieces);

          getPiecesData(soldPieces).then((pieces) => {
            pieces.forEach((piece) => {
              vm.soldPieces[`${piece.y}-${piece.x}`] = {
                name: piece.name,
                state: piece.state
              };
            });

            $log.debug(vm.soldPieces);

            activate();
          });
        });
    }

    function getPiecesData(soldPieces) {
      const piecesPromises = [];

      for (let i = 0; i < soldPieces.length; i++) {
        piecesPromises.push(getPiece(soldPieces[i]));
      }

      return Promise.all(piecesPromises);
    }

    function getPiece(pieceId) {
      return _ref.child(`pieces/${pieceId}`)
        .once('value')
        .then((p) => {
          const piece = p.val();

          return _ref.child(`invoices/${piece.invoice}`)
            .once('value')
            .then((i) => {
              const invoice = i.val();
              piece.name = invoice.name;
              piece.state = invoice.state;

              return piece;
            });
        });
    }

    function activate() {
      const MAX_ROWS = 160;
      const MAX_COLUMNS = 250;

      vm.rows = [];
      for (let y = 0; y < MAX_ROWS; y++) {
        vm.rows.push(y);
      }

      vm.cols = [];
      for (let x = 0; x < MAX_COLUMNS; x++) {
        vm.cols.push(x);
      }

      vm.meals = [];
      for (let y = 0; y < MAX_ROWS; y++) {
        vm.meals.push([]);
        for (let x = 0; x < MAX_COLUMNS; x++) {
          const piece = vm.soldPieces[`${y}-${x}`] || null;
          const buyer = (piece === null) ? '' : piece.name;

          vm.meals[y].push({
            isBought: piece !== null,
            buyer
          });
        }
      }

      refresh();
    }

    function isBought(row, col) {
      return vm.meals[row][col].isBought;
    }

    function showBuyer(row, col) {
      if (vm.meals[row][col].isBought) {
        $log.log(vm.meals[row][col].buyer);
      }
    }

    function hideBuyer(row, col) {
      // console.log(vm.meals[row][col].buyer);
    }

    function refresh() {
      if (!$rootScope.$$phase) {
        $rootScope.$digest();
      }
    }
  }

})();
