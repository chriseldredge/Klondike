var Writer = require('broccoli-writer')
var childProcess = require('child_process')
var Promise = require('rsvp').Promise

module.exports = GitDescribe;
GitDescribe.prototype = Object.create(Writer.prototype);
GitDescribe.prototype.constructor = GitDescribe;

function GitDescribe (inputTree, options) {
  if (!(this instanceof GitDescribe)) return new GitDescribe(inputTree, options)
  this.inputTree = inputTree;

  options = options || {};
  for (var prop in options) {
    this[prop] = options[prop];
  }
}

GitDescribe.prototype.write = function (readTree, destDir) {
  var self = this;
  return readTree(this.inputTree).then(function (srcDir) {
    return new Promise(function (resolve, reject) {
      var proc = childProcess.spawn('git', ['describe', '--long', '--abbrev=10', '--all', '--always', '--dirty']);
      var output = '';

      proc.on('close', function(code) {
        if (code === 0) {
          var revision = self.parseRevision(output);
          var fs = require('fs');
          fs.writeFile(destDir + '/revision.js', 'window.KlondikeENV.APP.revision = "' + revision + '";\n', function(err) {
              if (err) {
                  reject(new Error('failed to write ' + destDir + '/revision.js:' + err));
              } else {
                  resolve();
              }
          });
        } else {
          reject(new Error('git-describe exited with code ' + code + ': ' + output));
        }
      });

      proc.stdout.on('data', function(data) {
        output += data;
      });

      proc.stderr.on('data', function(data) {
        output += data;
      });
    });
  });
}

GitDescribe.prototype.parseRevision = function (output) {
  var parts = output.trim().split('-');
  var rev = parts[parts.length - 1];
  if (rev === 'dirty') {
    rev = parts[parts.length - 2] + '-' + rev;
  }
  return rev;
}
