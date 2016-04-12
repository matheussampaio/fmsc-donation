(function () {

  angular
    .module('fmsc')
    .component('admin', {
      controller: adminController,
      templateUrl: 'admin/admin.html'
    });

  function adminController($rootScope, Firebase, DEBUGFirebaseURL) {
    const vm = this;
    const MAX_ROWS = 160;
    const MAX_COLUMNS = 250;
    const _ref = new Firebase(DEBUGFirebaseURL);

    let _imageId = null;

    vm.data = {};
    vm.refresh = refresh;
    vm.createImage = createImage;
    vm._pieces = [];

    ////////////////

    function createImage() {
      _ref.child('images').push({
        url: 'images-2.jpg'
      })
      .then(image => {

        _ref.update({
          current_image: image.key()
        });

        _imageId = image.key();

        populatePieces();

        addPieces();
      });
    }

    function populatePieces() {
      for (let y = 0; y < MAX_ROWS; y++) {
        for (let x = 0; x < MAX_COLUMNS; x++) {
          vm._pieces.push({
            x, y,
            image: _imageId
          });
        }
      }
    }

    function addPieces() {
      if (vm._pieces.length === 0) {
        return Promise.resolve();
      }

      const piecesAddPromise = [];

      for (let i = 0; i < Math.min(50, vm._pieces.length); i++) {
        piecesAddPromise.push(addPiece(vm._pieces.shift()));
      }

      return Promise.all(piecesAddPromise).then(() => {
        refresh();
        addPieces();
      });
    }

    function addPiece(piece) {
      return _ref.child('pieces').push(piece).then(p => {
        _ref.child('images').child(_imageId).child('pieces_available').update({
          [p.key()]: true
        });
      });
    }

    function refresh() {
      if (!$rootScope.$$phase) {
        $rootScope.$digest();
      }
    }

  }

})();
