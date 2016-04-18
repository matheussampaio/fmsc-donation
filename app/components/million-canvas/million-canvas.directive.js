(function () {

  angular
    .module('fmsc')
    .directive('millionCanvas', millionCanvasDirective);

  function millionCanvasDirective($log) {
    return {
      controller: millionCanvasController,
      templateUrl: 'million-canvas/million-canvas.html',
      scope: {
        pieces: '='
      },
      link: ($scope, $element) => {
        const con = $element[0].children[0].getContext('2d');

        const background = new Image();
        background.src = 'assets/images/image-2.jpg';
        background.onload = () => {

          const MAX_ROWS = 160;
          const MAX_COLUMNS = 250;
          const ratioX = background.width / 1250;
          const ratioY = background.height / 800;

          $log.debug(`background.width : ${background.width}`);
          $log.debug(`background.height: ${background.height}`);
          $log.debug(`ratioX : ${ratioX}`);
          $log.debug(`ratioY : ${ratioY}`);

          for (let y = 0; y < MAX_ROWS; y++) {
            for (let x = 0; x < MAX_COLUMNS; x++) {
              const drawIt = Math.random() < 0.5;

              if (!drawIt) {
                continue;
              }

              // drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh)
              con.drawImage(background,
                x * 5 * ratioX, y * 5 * ratioY, 5 * ratioX, 5 * ratioY,
                x * 5, y * 5, 5, 5);
            }
          }
        };
      }
    };
  }

  function millionCanvasController($log) {
    const vm = this;
  }

})();
