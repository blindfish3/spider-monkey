# spider-monkey
_A web development environment for dabblers_

## Description
When playing with libraries like [p5js](http://p5js.org/) and [pixijs](http://www.pixijs.com/) I want access to all the handy development tools I use professionally; but without the overhead of setting up a separate project for each little experiment.

This setup is an attempt to achieve that.  I've started with parsing of SASS, Jade templates and linting and direct copying of JS; with browserSync handling automatic refresh duties.  Browserify, Babel - and no doubt more - will come later.

## Installation

Make sure global dependencies are installed (see below) and then run `npm install` (as admin) from the root folder.  That will install all the local dependencies listed in package.json.

### Dependencies

* [nodejs](https://nodejs.org/) and npm (tested with 5.6.0 3.6.0)
* [gulp](http://gulpjs.com/) (tested with 3.9.1)
* [node-sass](https://www.npmjs.com/package/node-sass) (tested with 3.4.2)

### Optional dependencies
* [Vagrant](https://www.vagrantup.com/)
* Git

### Possible gotchas
#### Windows users
Node and npm on Windows still has some pain points.  The path length  issue happily appears [a thing of the past](https://github.com/npm/npm/blob/master/CHANGELOG.md#flat-flat-flat); but that doesn't mean it's plain sailing. node-gyp in particular is still a [significant enough problem](https://github.com/nodejs/node-gyp/issues/629) to put me off.  Having wasted too much time trying to figure it out, and being reluctant to install 7-8GBs of Visual Studio dependencies to get it working I opted instead to use [Vagrant](https://www.vagrantup.com/docs/why-vagrant/) running Ubuntu.  I've included a Vagrant file that will set up a box with the appropriate global dependencies (make sure you're running your command line as admin on first `vagrant up` and when you run `npm install`).

## Usage

* Add your source code, assets etc. to the src folder.
* Organise into folders as you see fit (an example of a typical setup for p5js is included).  
* Run `gulp` from the command line.
  This will process existing files and shunt the results into a new 'dist' folder; fire up a server on localhost:8080; and do its best to auto-refresh when you save assets.
* If necessary manually run `gulp clean` to remove the dist folder

## TODO
* add licence and properly document sources...
