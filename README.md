Miditacion
==========

JavaScript MIDI sequencer implemented on top of Web Audio API.

This project uses Jason Parrott's JSWorkBench as its build system. (See git://github.com/Moncader/JSWorkBench.git)
Also, Breader is used internally to read byte array (See git://github.com/Moncader/Breader.git)
As it will be downloaded automatically at build time by JSWorkBench, you don't have to clone Breader manually.

[Build (concatenating & minifying JS files using Google closure compiler)]

  $ cd Miditacion
  $ jsworkbench update
  $ jsworkbench build

  -----> The output file is bin/miditacion.js
  -----> 'jsworkbench update' is required only when updating dependencies, i.e. Breader.

[Usage]

  Include bin/miditacion.js into your app. (See sample/index.html)
