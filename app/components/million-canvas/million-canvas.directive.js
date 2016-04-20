(function () {

  angular
    .module('fmsc')
    .directive('millionCanvas', millionCanvasDirective);

  function millionCanvasDirective($log, DrawCanvas) {
    return {
      controller: millionCanvasController,
      controllerAs: '$ctrl',
      templateUrl: 'million-canvas/million-canvas.html',
      scope: {
        pieces: '='
      },
      link: ($scope, $element) => {
        const image = new Image();
        const canvas = $element[0].children[1];

        image.src = 'assets/images/image.jpg';
        image.onload = () => {
          $log.debug('image onload');
          $scope.drawCanvas = DrawCanvas.create(canvas, image);
          $scope.drawCanvas.testDraw(true);
        };

        canvas.addEventListener('mousemove', showBuyer, false);

        function showBuyer(e) {
          const r = canvas.getBoundingClientRect();
          const mouseX = (e.clientX - r.left) / (r.right - r.left) * canvas.width;
          const mouseY = (e.clientY - r.top) / (r.bottom - r.top) * canvas.height;
          const pieceX = Math.floor(mouseX / 5);
          const pieceY = Math.floor(mouseY / 5);

          $log.debug(`pieceX : ${pieceX} pieceY : ${pieceY}`);
        }
      }
    };
  }

  function millionCanvasController($log, $scope) {
    const vm = this;

    let lastX = 0;
    let lastY = 0;

    vm.newPieces = newPieces;

    function newPieces() {
      $log.debug('new pieces');

      $scope.drawCanvas.drawOne({ x: lastX++, y: lastY++ });
    }
  }

})();
