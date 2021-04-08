import Image from '../index';

const image = new Image('img/template.png');

image
  .loadFont('/res/OpenSans.ttf')
  .draw(ctx => {
    ctx.fillStyle = '#000000';
    ctx.font = { family: 'Open Sans', size: 20 };
    ctx.fillText('example', 30, 30);
  })
  .save('out.jpg')
  .then(() => console.log('saved'));
