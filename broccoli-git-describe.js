var Writer = require('broccoli-writer')
var childProcess = require('child_process')
var Promise = require('rsvp').Promise
var replace = require('broccoli-replace')

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
  return new Promise(function(resolve, reject) {
    var proc = childProcess.spawn('git', ['describe', '--long', '--abbrev=10', '--all', '--always', '--dirty']);
    var output = '';

    proc.on('close', function(code) {
      if (code === 0) {
        var status = self.parseStatus(output);

        resolve(status);
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
  }).then(function(status) {
    var replacement = replace(self.inputTree, {
        files: ['index.html'],
        patterns: [{
          match: /\{\{GIT_REVISION\}\}/g,
          replacement: status
        }]
      });

    return replacement.write(readTree, destDir);
  });
}

GitDescribe.prototype.parseStatus = function (output) {
  var parts = output.trim().split('-');
  var rev = parts[parts.length - 1];
  var dirty = false;
  if (rev === 'dirty') {
    dirty = true;
    rev = parts[parts.length - 2];
  }
  return { commit: rev, dirty: dirty };
}
