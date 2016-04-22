const _ = require('lodash');
const Firebase = require('firebase');
const PromiseManager = require('./promise-manager');

class Image {
  constructor() {
    console.log('constructor');
    this.MAX_ROWS = 160;
    this.MAX_COLUMNS = 250;
    this.IMAGE_FILENAME = 'image.jpg';

    if (process.env.FMSC_RELEASE) {
      this.ROOT_URL = 'https://fmsc-donation1.firebaseio.com';
    } else {
      this.ROOT_URL = 'https://fmsc-donation-debug.firebaseio.com';
    }

    this.currentImage = null;
    this.imageRef = null;

    this.ref = new Firebase(this.ROOT_URL);

    this._init().then(() => {
      process.emit('image_loaded');
    });
  }

  handle(argv) {
    console.log('handle', argv);
    if (argv.invoice) {
      const invoiceId = argv.invoice;

      return this._getInvoice(invoiceId).then(invoice => {
        const quantity = invoice.quantity;
        const selectPieces = _.sampleSize(_.keys(this.imageData.pieces_available), quantity);
        const soldPieces = [];

        if (!this.imageData.pieces_sold) {
          this.imageData.pieces_sold = {};
        }

        selectPieces.forEach(key => {
          const piece = this.imageData.pieces_available[key];

          piece.state = invoice.state;
          piece.name = invoice.name;
          piece.timestamp = invoice.created;

          soldPieces.push({ key, piece });
        });

        const updatePieces = new PromiseManager({
          resource: soldPieces,
          fn: (data) => {
            return Promise.all([
              // remove from available
              this.imageRef.child('pieces_available').child(data.key).remove(),
              // add to sold
              this.imageRef.child('pieces_sold').child(data.key).set(data.piece)
            ]);
          }
        });

        return Promise.all([
          updatePieces.start(),
          this._updateInvoice(invoiceId, selectPieces)
        ])
        .then(() => {
          console.log('invoice handler finished', invoice);
        });
      });
    }

    return Promise.reject();
  }

  _updateInvoice(invoiceId, piecesIds) {
    console.log('_updateInvoice');
    return this.ref.child('invoices').child(invoiceId).update({
      pieces: piecesIds,
      status: 'paid'
    });
  }

  _getInvoice(id) {
    console.log('_getInvoice');
    return this.ref.child('invoices').child(id).once('value').then(value => value.val());
  }

  _init() {
    console.log('_init');
    return this._loadCurrentImage()
      .catch(() => {
        return this._createImage();
      })
      .then(() => {
        return this._loadImage();
      });
  }

  _loadCurrentImage() {
    console.log('_loadCurrentImage');
    return this._getCurrentImageId().then(imageId => {
      if (imageId) {
        this.currentImage = imageId;
        this.imageRef = this.ref.child('images').child(imageId);

        return Promise.resolve();
      }

      return Promise.reject();
    });
  }

  _loadImage() {
    console.log('_loadImage');
    return this.imageRef.once('value').then(image => {
      this.imageData = image.val();

      let avaiableSize = 0;
      let soldSize = 0;

      if (this.imageData.pieces_available) {
        avaiableSize = _.keys(this.imageData.pieces_available).length;
      }

      if (this.imageData.pieces_sold) {
        soldSize = _.keys(this.imageData.pieces_sold).length;
      }

      console.log({
        filename: this.imageData.filename,
        pieces_available: avaiableSize,
        pieces_sold: soldSize
      });

      return Promise.resolve();
    });
  }

  _getCurrentImageId() {
    console.log('_getCurrentImageId');
    return this.ref.child('current_image').once('value').then(data => data.val());
  }

  _setCurrentImage(imageId) {
    console.log('_setCurrentImage');
    return this.ref.update({ current_image: imageId });
  }

  _createImage() {
    console.log('_createImage');

    const image = {
      filename: this.IMAGE_FILENAME,
      pieces_available: {},
      pieces_sold: {}
    };

    return this.ref.child('images').push(image).then(_imageId => {
      this.currentImage = _imageId.key();
      this.imageRef = this.ref.child('images').child(this.currentImage);
      return this._populateImage();
    })
    .then(() => {
      return this._setCurrentImage(this.currentImage);
    });
  }

  _populateImage() {
    console.log('_populateImage');

    const tempPieces = [];

    for (let y = 0; y < this.MAX_ROWS; y++) {
      for (let x = 0; x < this.MAX_COLUMNS; x++) {
        tempPieces.push({ x, y });
      }
    }

    _.shuffle(tempPieces);

    const promiseHandler = new PromiseManager({
      resource: tempPieces,
      fn: (piece) => {
        return this.imageRef.child('pieces_available').push(piece).then(data => data.key());
      }
    });

    return promiseHandler.start();
  }

}

module.exports = new Image();
