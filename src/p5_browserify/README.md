# Using Browserify

To create a new entry file for your project you must prepend it with `main_`.  Gulp will then treat this as a separate starting point and pull in any dependencies relative to that point.

The bundled file is output with the `main_` removed.  So in this example `js/main_sketch.js` is our entry point and is bundled as 'sketch.js'; a link to which is included in the p5js template.

Any Browserify modules should be saved with an _underscore prepending the filename.  I've no idea if this is considered good/bad practice (or contradicts some other standard); but it means I can continue to support linting and distribution of standard JS files: the associated gulp task ignores JS files beginning with _underscore.

Note that I've included a global _lib folder for modules that might be used across multiple sketches.  Again no idea if this is good practice in the Browserify world.  I'll update this as I dig deeper...
