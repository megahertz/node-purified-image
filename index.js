'use strict';

const fs     = require('fs');
const path   = require('path');
const stream = require('stream');
const pImage = require('pureimage');


/**
 * Steam that saves data to a buffer
 */
class BufferWritable extends stream.Writable {
  constructor() {
    super();
    //noinspection JSUnresolvedVariable
    this.buffer = new Buffer([]);
  }

  //noinspection JSUnusedGlobalSymbols,JSUnusedLocalSymbols
  _write(chunk, encoding, callback) {
    //noinspection JSUnresolvedVariable
    this.buffer = Buffer.concat([this.buffer, chunk]);
    callback();
  }
}

/**
 * Steam that reads data from a buffer
 */
class BufferReadable extends stream.Readable {
  constructor(buffer) {
    super();
    //noinspection JSUnresolvedVariable
    this.buffer = buffer;
  }

  //noinspection JSUnusedGlobalSymbols
  _read() {
    //noinspection JSUnresolvedFunction
    this.push(this.buffer);
    //noinspection JSUnresolvedFunction
    this.push(null);
  }
}

class Image {
  /**
   * Optionally load a file
   * @param {string} [imagePath]
   * @param {string} [imageType]
   */
  constructor(imagePath, imageType = 'auto') {
    this._fontPromises = [];
    if (imagePath) {
      this.load(imagePath, imageType);
    }
  }

  /**
   * Load an image from a file
   * @param {string} imagePath
   * @param {string} imageType png or jpeg (now only png is supported)
   * @returns {Image}
   */
  load(imagePath, imageType = 'auto') {
    imageType = Image._getTypeByPath(imagePath, imageType);

    this._imgPromise = new Promise((resolve, reject) => {
      const imageStream = fs.createReadStream(imagePath);

      if (imageType === 'jpg') {
        reject('Loading JPEG format is not supported by pureimage now');
      } else {
        pImage.decodePNG(imageStream, img => resolve(img));
      }
    });

    return this;
  }

  /**
   * Load a TTF font file
   * @param {string} fontPath
   * @param {string} [fontName] By default it's base name of file
   */
  loadFont(fontPath, fontName) {
    if (!fontName) {
      fontName = path.parse(fontPath).name
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/([a-z])[-_]([A-Z])/g, '$1 $2');
    }

    this._fontPromises[fontName] = new Promise(resolve => {
      pauseConsole();
      pImage.registerFont(fontPath, fontName).load(resolve);
      resumeConsole();
    });
    
    return this;
  }

  /**
   * Make a copy of the current image
   * @return Image
   */
  copy() {
    const image = new this.constructor();
    image._imgPromise = this._imgPromise.then(img => {
      let imgCopy = new img.constructor(img.width, img.height);
      imgCopy._buffer = Buffer.from(img._buffer);
      return imgCopy;
    });
    image._fontPromises = this._fontPromises;
    return image;
  }

  /**
   * This callback is called when a pureimage canvas is ready
   * @callback Image~drawCallback
   * @param {Bitmap4BBPContext} ctx
   */

  /**
   * Draw on image canvas
   * @param {Image~drawCallback} callback
   * @returns {Image}
   */
  draw(callback) {
    var promises = [this._imgPromise].concat(this._fontPromises);
    this._imgPromise = Promise.all(promises).then(values => {
      /** @type {Bitmap4BBP} */
      let img = values[0];
      let ctx = img.getContext('2d');
      // Now pureimage doesn't render font without this
      ctx.USE_FONT_GLYPH_CACHING = false;
      callback(ctx);
      return img;
    }).catch(e => { throw e; });
    return this;
  }

  /**
   * Save image data to buffer
   * @param {string} [imageType=png]
   * @returns {Promise.<Buffer>}
   */
  toBuffer(imageType = 'png') {
    var stream = new BufferWritable();
    return this._encode(stream, imageType).then(buffer => buffer.buffer);
  }

  /**
   * Load an image from a buffer
   * @param {Buffer} buffer
   * @param {string} [imageType=png]
   * @returns {Image}
   */
  fromBuffer(buffer, imageType = 'png') {
    this._imgPromise = new Promise((resolve, reject) => {
      const imageStream = new BufferReadable(buffer);
      if (imageType === 'jpg') {
        reject('Loading JPEG format is not supported by pureimage now');
      } else {
        pImage.decodePNG(imageStream, img => resolve(img));
      }
    });
    return this;
  }

  /**
   * Save image data to file
   * @param {string} imagePath
   * @param {string} [imageType=auto]
   * @returns {Promise.<stream.Writable>}
   */
  save(imagePath, imageType = 'auto') {
    imageType = Image._getTypeByPath(imagePath, imageType);
    var stream = fs.createWriteStream(imagePath);
    return this._encode(stream, imageType);
  }

  _encode(stream, imageType = 'png') {
    return this._imgPromise.then(img => {
      return new Promise((resolve, reject) => {
        if ('jpg' === imageType) {
          pImage.encodeJPEG(img, stream, done);
        } else {
          pImage.encodePNG(img, stream, done);
        }
        function done(err) {
          if (err) {
            reject(err);
          } else {
            stream.img = img;
            resolve(stream);
          }
        }
      });
    });
  }
  
  static _getTypeByPath(imagePath, imageType = 'auto') {
    if (['png, jpg'].indexOf(imageType) === -1) {
      if (imagePath.endsWith('jpg') || imagePath.endsWith('jpeg')) {
        return 'jpg';
      } else {
        return 'png';
      }
    }
    return imageType;
  }
}
module.exports = Image;

const log = console.log;
function pauseConsole() {
  console.log = () => {};
}

function resumeConsole() {
  console.log = log;
}