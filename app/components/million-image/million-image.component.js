(function() {

  angular
    .module('fmsc')
    .directive('millionImage', millionImageDirective);

  function millionImageDirective() {
    return {
      controller: millionImageController,
      templateUrl: 'million-image/million-image.html',
      link: ($scope, $elem) => {
        const con = $elem[0].children[1].getContext('2d');

        let imgData = con.getImageData(0, 0, 500, 500);

        console.log((500 + (500 * imgData.width)) * 4);

        for (let row = 0; row < 500; row++) {
          for (let col = 0; col < 500; col++) {
            let index = (col + (row * imgData.width)) * 4;

            if (bits.includes(index)) {
              console.log(index);
              imgData.data[index] = 255;
              imgData.data[index + 1] = 0;
              imgData.data[index + 2] = 0;
              imgData.data[index + 3] = 255;
            }
          }
        }

        con.putImageData(imgData, 0, 0);
      }
    }
  }

  function millionImageController($log) {
  }

})();
