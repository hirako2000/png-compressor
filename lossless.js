const imagemin = require('imagemin');
const imageminOptipng = require('imagemin-optipng');

var args = process.argv.slice(2);
if(args.length < 2) {
  console.log("Please pass two arguments");
  console.log("First argument is the original images folder");
  console.log("Second argument is the losslessly compressed images folder, output");
  console.log("Example: node appX.js src-image compressed");
  process.exit(1);
}

var source = args[0] || './image/';
var destination = args[1] || './optimized/';

imagemin([source + '/**/*.{jpg,png}'], destination, {
  plugins: [
    imageminOptipng({optimizationLevel : 3}) // default level is enough: 16 trial, could bump up to level 7: 240 trials
  ]
}).then(files => {
  console.log("Optimized losslessly, find files in " + destination);
});
