(function () {

  angular
    .module('fmsc')
    .directive('millionCanvas', millionCanvasDirective);

  function millionCanvasDirective() {
    return {
      controller: millionCanvasController,
      templateUrl: 'million-canvas/million-canvas.html',
      link: ($scope, $element) => {
        const con = $element[0].children[0].getContext('2d');

        const background = new Image();
        background.src = 'assets/images/image-2.jpg';

        background.onload = () => {
          con.drawImage(background, 0, 0, 1200, 800);
        };
      }
    };
  }

  function millionCanvasController() {
    const vm = this;
  }

})();
