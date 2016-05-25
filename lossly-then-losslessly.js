const imagemin = require('imagemin');
const imageminPngquant = require('imagemin-pngquant');
const imageminOptipng = require('imagemin-optipng');

const fs = require("fs");
var execFile = require('child_process').execFile;
var pngout = require('pngout-bin');

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
    if (files.length > 0) {
      console.log("Now 2nd pass on each compressed image, with PNGOut this time");
      pngoutit(0, files);
    } else {
      console.log("No file to pngout, DONE.");
    }
  });

});

var pngoutit = function(index, files) {
  console.log("PNGouting: " + files[index].path);
  execFile(pngout, [files[index].path, '-s0', '-k0', '-f0'], function (err) {
      console.log('OK');
      index++;
      if (index >= files.length) {
        console.log("DONE.");
      } else {
        pngoutit(index, files);
      }
  });
}
