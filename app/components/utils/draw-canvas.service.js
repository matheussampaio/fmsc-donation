(function () {

  class DrawCanvas {
    constructor(canvas, image) {
      this.ctx = canvas.getContext('2d');
      this.pieceWidth = 5;
      this.pieceHeight = 5;
      this.image = image;
      this.ratioX = this.image.width / 1250;
      this.ratioY = this.image.height / 800;
    }

    draw(pieces) {
      pieces.forEach((element) => {
        this.drawOne(element);
      });
    }

    drawOne(piece) {
      this.ctx.drawImage(this.image,
        piece.x * this.pieceWidth * this.ratioX,
        piece.y * this.pieceHeight * this.ratioY,
        this.pieceWidth * this.ratioX,
        this.pieceHeight * this.ratioY,
        piece.x * this.pieceWidth,
        piece.y * this.pieceHeight,
        this.pieceWidth,
        this.pieceHeight
      );
    }

    testDraw(random = false) {
      const maxRows = 160;
      const maxColumns = 250;

      for (let y = 0; y < maxRows; y++) {
        for (let x = 0; x < maxColumns; x++) {
          if (random && Math.random() < 0.5) {
            continue;
          }
          // drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh)
          this.ctx.drawImage(this.image,
            x * 5 * this.ratioX, y * 5 * this.ratioY, 5 * this.ratioX, 5 * this.ratioY,
            x * 5, y * 5, 5, 5);
        }
      }
    }
  }

  angular
    .module('fmsc')
    .factory('DrawCanvas', DrawCanvasFactory);

  function DrawCanvasFactory() {
    return {
      create: (canvas, image) => {
        return new DrawCanvas(canvas, image);
      }
    };
  }

})();
