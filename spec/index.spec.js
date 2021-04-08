'use strict';

const { describe, expect, it } = require('humile');
const fs = require('fs');
const path = require('path');
const stream = require('stream');
const Image = require('..');

const TEMPORARY = path.join(__dirname, 'temp/square.png');

describe('Image', () => {
  it('should be created', () => {
    expect(instance() instanceof Image).toBe(true);
  });

  it('should get image type from file extension', () => {
    expect(Image._getTypeByPath('/file.jpg')).toBe('jpg');
    expect(Image._getTypeByPath('/file.jpeg')).toBe('jpg');
    expect(Image._getTypeByPath('/file.png')).toBe('png');
    expect(Image._getTypeByPath('/file')).toBe('png');
    expect(Image._getTypeByPath('/file', 'bmp')).toBe('png');
  });

  it('should load a png file', () => {
    expect(instance()._imgPromise instanceof Promise).toBe(true);
  });

  it('should load a font', () => {
    const img = instance()
      .loadFont(path.resolve(__dirname, 'res/OpenSans-Regular.ttf'));
    expect(img._fontPromises['Open Sans Regular'] instanceof Promise)
      .toBe(true);
  });

  it('should create a copy of current image', () => {
    const img = instance();
    const copy = img.copy();
    expect(copy instanceof Image).toBe(true);
    expect(copy).not.toBe(img);
  });

  it('should get a canvas when drawing', (done) => {
    instance().draw((ctx) => {
      expect(ctx.fillStyle).toBeDefined();
      done();
    });
  });

  it('should encode image', (done) => {
    const ws = new stream.Writable();
    ws._write = (_1, _2, cb) => cb();
    instance()._encode(ws)
      .then((s) => {
        expect(s).toBe(ws);
        done();
      })
      .catch((e) => done(e));
  });

  it('should save to buffer', (done) => {
    instance().toBuffer()
      .then((buffer) => {
        expect(buffer.length).toBeGreaterThan(0);
        done();
      })
      .catch((e) => done(e));
  });

  it('should load from buffer', (done) => {
    instance()
      .draw((ctx) => {
        ctx.fillStyle = '#ff00ff';
        ctx.fillRect(40, 40, 20, 20);
      })
      .toBuffer()
      .then((buffer) => {
        instance()
          .fromBuffer(buffer)
          .draw((ctx) => {
            expect(ctx.bitmap.getPixelRGBA(30, 30)).toBe(0xFF);
            expect(ctx.bitmap.getPixelRGBA(50, 50)).toBe(0xFF00FFFF);
            done();
          });
      })
      .catch((e) => done(e));
  });

  it('should save a png', (done) => {
    instance().save(TEMPORARY)
      .then((writable) => {
        expect(writable instanceof stream.Writable).toBe(true);
        fs.stat(TEMPORARY, (err) => {
          expect(err).toBe(null);
          return fs.unlink(TEMPORARY, done);
        });
      }).catch((e) => done(e));
  });

  it('should emit events', (done) => {
    const image = instance();

    let isImageLoaded = false;
    let isFontLoaded = false;
    let isLoaded = false;
    let isEncoded = false;

    image.on('image-loaded', () => isImageLoaded = true);
    image.on('font-loaded', () => isFontLoaded = true);
    image.on('loaded', () => isLoaded = true);
    image.on('encoded', () => isEncoded = true);

    image
      .loadFont(path.join(__dirname, 'res/OpenSans-Regular.ttf'))
      .draw((ctx) => {
        ctx.fillStyle = '#ff00ff';
        ctx.font = '20 Open Sans Regular';
        ctx.fillText('test', 30, 30);
      })
      .toBuffer()
      .then(() => {
        expect(isImageLoaded).toBe(true);
        expect(isFontLoaded).toBe(true);
        expect(isLoaded).toBe(true);
        expect(isEncoded).toBe(true);
        done();
      })
      .catch((e) => done(e));
  });

  it('should resize', (done) => {
    instance().draw((srcCtx) => {
      instance()
        .resize(400, 400)
        .draw((ctx) => {
          expect(ctx.bitmap.getPixelRGBA(32, 20))
            .toBe(srcCtx.bitmap.getPixelRGBA(32, 20));
          expect(ctx.bitmap.getPixelRGBA(32, 17))
            .toBe(srcCtx.bitmap.getPixelRGBA(32, 17));
          expect(ctx.bitmap.getPixelRGBA(300, 300))
            .toBe(0x00000000);
          done();
        });
    });
  });
});

describe('Scenarios', () => {
  it('should write text', (done) => {
    instance()
      .loadFont(path.join(__dirname, 'res/OpenSans-Regular.ttf'))
      .draw((ctx) => {
        ctx.fillStyle = '#ff00ff';
        ctx.font = '20 Open Sans Regular';
        ctx.fillText('test', 30, 30);
      })
      .toBuffer()
      .then((buffer) => {
        instance().fromBuffer(buffer)
          .draw((ctx) => {
            expect(ctx.bitmap.getPixelRGBA(32, 20)).toBe(0xFF00FFFF);
            expect(ctx.bitmap.getPixelRGBA(32, 17)).toBe(0x970097FF);
            done();
          });
      })
      .catch((e) => done(e));
  });
});

function instance() {
  return new Image(path.join(__dirname, 'res/square.png'));
}
