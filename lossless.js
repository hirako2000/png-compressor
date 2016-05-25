const imagemin = require('imagemin');
const imageminOptipng = require('imagemin-optipng');

var execFile = require('child_process').execFile;
var pngout = require('pngout-bin');


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

console.log("OptiPNGing all PNGs located in: " + source);
console.log("Output for those will be located in: " + destination);

imagemin([source + '/**/*.{jpg,png}'], destination, {
  plugins: [
    imageminOptipng({optimizationLevel : 3}) // default level is enough: 16 trial, could bump up to level 7: 240 trials
  ]
}).then(files => {
  if (files.length > 0) {
    console.log("Now 2nd pass on each compressed image, with PNGOut this time");
    pngoutit(0, files);
  } else {
    console.log("No file to pngout, DONE.");
  }
});

var pngoutit = function(index, files) {
  console.log("PNGouting: " + files[index].path);
  execFile(pngout, [files[index].path, files[index].path + '.min.png', '-s0', '-k0', '-f0'], function (err) {
      console.log('OK');
      index++;
      if (index >= files.length) {
        console.log("DONE.");
      } else {
        pngoutit(index, files);
      }
  });
}

/* ---- PNG options: ----

/f0	None
/f1	Sub (delta x)
/f2	Up (delta y)
/f3	Average (delta x&y)
/f4	Paeth
/f5	Adaptive (mixed)
/f6	Reuse (copy line by line from source PNG)
For palette images /f0 is best, and /f5 is often the best for grayscale or true color images, but not always.
The default value is /f0 for palette images (/c3), and /f5 for everything else.

/s0	Xtreme! (Slowest)
/s1	Intense (Slow)
/s2	Longest Match (Fast)
/s3	Huffman Only (Faster)
/s4	Uncompressed (Fastest)

/k0	Remove all unnecessary chunks. (default)
/kp	Keep the palette order intact. Using this may hurt compression slightly,
    but it may be necessary for certain applications (often on small electronic devices) that need to share a common palette.

---- PNG options ---- */
