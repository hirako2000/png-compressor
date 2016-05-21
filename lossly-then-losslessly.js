const imagemin = require('imagemin');
const imageminPngquant = require('imagemin-pngquant');
const imageminOptipng = require('imagemin-optipng');

const fs = require("fs");

var args = process.argv.slice(2);
if(args.length < 3) {
  console.log("Please pass three arguments");
  console.log("First argument is the original images folder, input");
  console.log("Second argument is the lossly optimized images folder, output");
  console.log("Third argument is the losslesssly compressed images folder, output");
  console.log("Example: node appX.js optimized compressed");
  process.exit(1);
}

var source = args[0] || './image/';
var destination = args[1] || './optimized/';
var finalDestination = args[2] || 'compressed/';

imagemin([source + '/**/*.{jpg,png}'], destination, {
  plugins: [
    imageminPngquant({quality: '65-80'})
  ]
}).then(files => {
  console.log("PNGs now Optimized, find files in " + destination);
  imagemin([destination + '/**/*.png'], finalDestination, {
    plugins: [
      imageminOptipng({optimizationLevel : 3})
    ]
  }).then(files => {
    console.log("Optimized PNGs now Compressed, find files in " + finalDestination);
  });

});








