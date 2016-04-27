(function () {

  angular
    .module('fmsc')
    .directive('millionCanvas', millionCanvasDirective);

  function millionCanvasDirective($log, DrawCanvas, ImageService, TooltipService) {
    return {
      controller: millionCanvasController,
      controllerAs: '$ctrl',
      templateUrl: 'million-canvas/million-canvas.html',
      scope: {
        pieces: '='
      },
      link: ($scope, $element) => {
        const image = new Image();
        const canvas = $element[0].children[0];

        ImageService.getFilename().then((filename) => {
          $log.debug(`filename: ${filename}`);
          image.src = `assets/images/${filename}`;
          image.onload = () => {
            $log.debug('image onload');
            $scope.drawCanvas = DrawCanvas.create(canvas, image);

            ImageService.register({
              id: 'drawCanvas',
              resource: 'sold',
              fn: ({ key }) => {
                ImageService.getSold().then((sold) => {
                  $scope.drawCanvas.drawOne(sold.$getRecord(key));
                  TooltipService.setBuyer(sold.$getRecord(key));
                });
              }
            });

            ImageService.getSold().then((sold) => {
              $scope.drawCanvas.draw(sold);
              TooltipService.setBuyers(sold);
            });
          };
        });

        canvas.addEventListener('mousemove', showBuyer, false);
        canvas.addEventListener('mouseleave', hideBuyer, false);

        function showBuyer(e) {
          const r = canvas.getBoundingClientRect();
          const mouseX = (e.clientX - r.left) / (r.right - r.left) * canvas.width;
          const mouseY = (e.clientY - r.top) / (r.bottom - r.top) * canvas.height;
          const pieceX = Math.floor(mouseX / 5);
          const pieceY = Math.floor(mouseY / 5);

          TooltipService.setMessage(pieceX, pieceY);

          // X: minus 8 equals to margin
          // Y: minus 72 equals to margin and toolbar height
          TooltipService.setPosition(e.pageX - 8, e.pageY - 72);
        }

        function hideBuyer() {
          TooltipService.hideElement();
        }
      }
    };
  }

  function millionCanvasController($scope, ImageService) {
    const vm = this;

    vm.ImageService = ImageService;
  }

})();
