const fs = require("fs");
const path = require('path');

var args = process.argv.slice(2);
if(args.length < 2) {
  console.log("Please pass two arguments");
  console.log("First argument is the original images folder, input");
  console.log("Second argument is the optimized and/or compressed images folder to compare with, input");
  process.exit(1);
}

var source = args[0] || './image/';
var destination = args[1] || './optimized/';

var walk = function(dir, done) {
  var results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);

    var pending = list.length;
    if (!pending) return done(null, results);

    list.forEach(function(file) {
      file = path.resolve(dir, file);
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          var parsedPath = path.parse(file);
          if (parsedPath.ext === '.png' || parsedPath === '.PNG') {
            // we only build the map if the extension is png
            results.push(file);
          }
          if (!--pending) done(null, results);
        }
      });
    });
  });
};

var fileToSizeSet = {};
walk(source, function(err, results) {
  if (err) throw err;
  for(var i = 0 ; i < results.length; i++) {
    var stats = fs.statSync(results[i]);
    var fileSizeInBytes = stats["size"];
    //console.log("File size of image " + results[i] + " : " + fileSizeInBytes);
    var fileName = path.parse(results[i]).base;
    fileToSizeSet[fileName] = fileSizeInBytes;
  }

  var foundUncompressed = [];
  walk(destination, function(err, results) {
    for(var i = 0 ; i < results.length; i++) {
      var stats = fs.statSync(results[i]);
      var fileSizeInBytes = stats["size"];
      //console.log("File size of optimized " + results[i] + " : " + fileSizeInBytes);
      var fileName = path.parse(results[i]).base;
      if(fileToSizeSet[fileName] > fileSizeInBytes) {
        //console.log("original was not compressed: " + fileToSizeSet[fileName] + " > " + fileSizeInBytes);
        var uncompressedFile = { fileName : fileName, size: fileToSizeSet[fileName], compressedSize : fileSizeInBytes};
        foundUncompressed.push(uncompressedFile);
      } else {
        //console.log("original was compressed: " + fileToSizeSet[fileName] + " <= " + fileSizeInBytes);
      }
    }

    console.log("======== Found uncompressed ========");
    if(foundUncompressed.length === 0) {
      console.log("None");
    }
    for (var j = 0; j < foundUncompressed.length; j++) {
      var percentDifference = (foundUncompressed[j].size - foundUncompressed[j].compressedSize) / foundUncompressed[j].size * 100;
      percentDifference = round(percentDifference, 2);
      console.log(foundUncompressed[j].fileName + " is " + foundUncompressed[j].size
        + " could be " + foundUncompressed[j].compressedSize + " bytes" + " (-" + percentDifference + "%)");
    }
    console.log("====================================");

  });

});

 var round = function(value, decimals) {
   // A bit hacky to round to 2 decimal.
   // I won't pull a library just for that.
   return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
};
