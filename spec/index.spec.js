/* jshint -W030, -W079 */
'use strict';

const fs     = require('fs');
const stream = require('stream');

const expect = require('chai').expect;
const Image  = require('..');


const TEMPORARY = __dirname + '/temp/square.png';

describe('Image class', () => {

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
          expect(ctx.getPixeli32(32, 20), 0xFF00FFFF);
          expect(ctx.getPixeli32(32, 17), 0x970097FF);
          done();
        });
      })
      .catch(e => done(e));
  });
});

function instance() {
  return new Image(__dirname + '/res/square.png');
}