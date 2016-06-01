/* jshint -W030, -W079 */
'use strict';

const fs     = require('fs');
const stream = require('stream');

const expect = require('chai').expect;
const Image  = require('..');

const memwatch = require('memwatch-next');


const TEMPORARY = __dirname + '/temp/square.png';

describe('Image', () => {

  it('should be created', () => {
    expect(instance()).to.be.instanceOf(Image);
  });

  it('should get image type from file extension', () => {
    expect(Image._getTypeByPath('/file.jpg')).to.equal('jpg');
    expect(Image._getTypeByPath('/file.jpeg')).to.equal('jpg');
    expect(Image._getTypeByPath('/file.png')).to.equal('png');
    expect(Image._getTypeByPath('/file')).to.equal('png');
    expect(Image._getTypeByPath('/file', 'bmp')).to.equal('png');
  });

  it('should load a png file', () => {
    expect(instance()._imgPromise).to.be.a('promise');
  });

  it('should load a font', () => {
    let img = instance().loadFont(__dirname + '/res/OpenSans-Regular.ttf');
    expect(img._fontPromises['Open Sans Regular']).to.be.a('promise');
  });

  it('should create a copy of current image', () => {
    let img = instance();
    let copy = img.copy();
    expect(copy).to.be.instanceOf(Image);
    expect(copy).to.not.equal(img);
  });

  it('should get a canvas when drawing', done => {
    instance().draw(ctx => {
      expect(ctx).to.have.property('fillStyle');
      done();
    });
  });

  it('should encode image', done => {
    let ws = new stream.Writable();
    ws._write = (_1, _2, cb) => cb();
    instance()._encode(ws)
      .then(s => {
        expect(s).to.equal(ws);
        done();
      })
      .catch(e => done(e));
  });

  it('should save to buffer', done => {
    instance().toBuffer()
      .then(buffer => {
        expect(buffer.length).to.greaterThan(0);
        done();
      })
      .catch(e => done(e));
  });
  
  it('should load from buffer', done => {
    instance()
      .draw(ctx => {
        ctx.fillStyle = '#ff00ff';
        ctx.fillRect(40, 40, 20, 20);
      })
      .toBuffer()
      .then(buffer => {
        instance()
          .fromBuffer(buffer)
          .draw(ctx => {
            expect(ctx.getPixeli32(30, 30), 0xFF);
            expect(ctx.getPixeli32(50, 50), 0xFF00FFFF);
            done();
          });
      })
      .catch(e => done(e));
  });

  it('should save a png', done => {
    instance().save(TEMPORARY)
      .then((writable) => {
        expect(writable).to.be.instanceOf(stream.Writable);
        fs.stat(TEMPORARY, (err) => {
          expect(err).to.be.a('null');
          return fs.unlink(TEMPORARY, done);
        });
      }).catch(e => done(e));
  });

  it('should emit events', done => {
    const image = instance();

    let isImageLoaded = false;
    let isFontLoaded  = false;
    let isLoaded      = false;
    let isEncoded     = false;

    image.on('image-loaded', () => isImageLoaded = true);
    image.on('font-loaded',  () => isFontLoaded = true);
    image.on('loaded',       () => isLoaded = true);
    image.on('encoded',      () => isEncoded = true);

    image
      .loadFont(__dirname + '/res/OpenSans-Regular.ttf')
      .draw((ctx) => {
        ctx.fillStyle = '#ff00ff';
        ctx.setFont('Open Sans Regular', 20);
        ctx.fillText('test', 30, 30);
      })
      .toBuffer()
      .then(() => {
        expect(isImageLoaded).to.be.true;
        expect(isFontLoaded).to.be.true;
        expect(isLoaded).to.be.true;
        expect(isEncoded).to.be.true;
        done();
      })
      .catch(e => done(e));
  });

  it('should resize', done => {
    instance().draw(srcCtx => {
      instance()
        .resize(400, 400)
        .draw(ctx => {
          expect(ctx.getPixeli32(32, 20)).to.equal(srcCtx.getPixeli32(32, 20));
          expect(ctx.getPixeli32(32, 17)).to.equal(srcCtx.getPixeli32(32, 17));
          expect(ctx.getPixeli32(300, 300)).to.equal(0x00000000);
          done();
        });
    });
  });

});

describe('Scenarios', () => {
  it('should write text', (done) => {
    instance()
      .loadFont(__dirname + '/res/OpenSans-Regular.ttf')
      .draw((ctx) => {
        ctx.fillStyle = '#ff00ff';
        ctx.setFont('Open Sans Regular', 20);
        ctx.fillText('test', 30, 30);
      })
      .toBuffer()
      .then(buffer => {
        instance().fromBuffer(buffer)
          .draw(ctx => {
          expect(ctx.getPixeli32(32, 20)).to.equal(0xFF00FFFF);
          expect(ctx.getPixeli32(32, 17)).to.equal(0x970097FF);
          done();
        });
      })
      .catch(e => done(e));
  });
});

describe('Image performance', () => {
  it('should not have memory leaks', function(done) {
    this.timeout(5000);

    const image = new Image(__dirname + '/res/nodejs.png');
    let hd;

    image.on('loaded', () => {
      hd = new memwatch.HeapDiff();
    });

    memwatch.on('leak', function(info) {
      console.log(info);
      done(['Memory leak Found a memory leak']);
    });

    const count = 50;
    for (let i = 0; i < count; i++) {
      drawToBuffer(image.copy(), (e) => {
        if (e) {
          done(e);
          return;
        }
        if (i >= count - 1) {
          const diff = hd.end();
          const memoryDiff = diff.after['size_bytes'] - diff.before['size_bytes'];
          expect(memoryDiff).to.be.not.greaterThan(2 * 1024);
          done();
        }
      });
    }
  });

  function drawToBuffer(image, cb) {
    image
      .draw((ctx) => {
        ctx.setPixeli32(32, 20, 0x970097FF);
      })
      .toBuffer()
      .then(buffer => cb())
      .catch(e => cb(e));
  }
});

function instance() {
  return new Image(__dirname + '/res/square.png');
}