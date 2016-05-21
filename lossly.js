const imagemin = require('imagemin');
const imageminPngquant = require('imagemin-pngquant');

var args = process.argv.slice(2);
if(args.length < 2) {
  console.log("Please pass two arguments");
  console.log("First argument is the original images folder, input");
  console.log("Second argument is the lossly optimized images folder, output");
  console.log("Example: node appX.js src-image optimized");
  process.exit(1);
}

var source = args[0] || './image/';
var destination = args[1] || './optimized/';

imagemin([source + '/**/*.{jpg,png}'], destination, {
  plugins: [
    imageminPngquant({quality: '65-80'})
  ]
}).then(files => {
  console.log("Optimized lossly, find files in " + destination);
  //=> [{data: <Buffer 89 50 4e …>, path: 'build/images/foo.jpg'}, …]
});
