var devkitSpriter = require('devkit-spriter');
var path = require('path');
var fs = require('graceful-fs');
var Promise = require('bluebird');
var writeFile = Promise.promisify(fs.writeFile);

exports.run = function (opts) {
  return devkitSpriter.loadImages(opts.filenames)
    .then(function (images) {
      return devkitSpriter.sprite(opts.name, images);
    })
    .map(function (spritesheet) {
      var ext = (opts.mime == 'images/jpeg' ? '.jpg' : '.png');
      var filename = spritesheet.name + ext;

      return spritesheet.composite().buffer.getBuffer(opts.mime)
        .then(function (buffer) {
          spritesheet.recycle();
          return writeFile(path.join(opts.outputDirectory, filename), buffer)
            .return({
              filename: filename,
              map: spritesheet.toJSON()
            });
        });
    });
};
