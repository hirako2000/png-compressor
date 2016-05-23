# png-compressor

A small suite of tools to compress PNG files in bulk. Eitherlossy, losslessly, or both.

## Usage

Install deps

``
npm install
``

Compress (lossless)

``
node lossless.js images-source lossless-ouput
``

Optmize (lossy) 

``
node lossly.js images-source lossly-ouput
``

Optimize then compress (lossy)

``
node lossly-then-losslessly.js images-source optimized-output optimized-compressed-out
``

Compare images size (unique file name supported only)

``
node comparator.js images-source optimized-and-compressed
``

## License
MIT
