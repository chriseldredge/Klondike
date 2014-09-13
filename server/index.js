var childProcess = require('child_process')
var httpProxy = require('http-proxy')
var path = require('path')
var Promise = require('RSVP').Promise;

var port = 4201;
var proc = null;
var proxyServer = null;
var proxyReady;

// TODO: shadow copy on win32
// TODO: change Settings.config to put lucene index outside of dist so it doesn't get nuked
// TODO: change Settings.config to point to Klondike/packages for some test data
// TODO: change Settings.config to synchronize on start up
function start() {
  var binDir = path.join(__dirname, '..', 'dist', 'bin');
  var exe = path.join(binDir, 'Klondike.SelfHost.exe');
  var args = [];
  var useMono = process.platform !== 'win32';

  if (useMono) {
    args.push(exe);
    exe = 'mono';
  }

  args.push('--port=' + port);
  args.push('--packagesPath=' + path.normalize(path.join(__dirname, '..', 'packages')));
  args.push('--lucenePath=' + path.normalize(path.join(__dirname, '..', 'tmp', 'lucene')));
  args.push('--synchronizeOnStart');

  proxyReady = new Promise(function(resolve, reject) {
    var doStart = function() {
      proc = childProcess.spawn(exe, args, { cwd: binDir });

      proc.stdout.on('data', function(data) {
        if (data.toString().match(/enter to quit/i)) {
          proxyServer = new httpProxy.createProxyServer({
            target: {
              host: 'localhost',
              port: port
            }
          });

          resolve(proxyServer);
        }
      });

      proc.stderr.on('data', function(data) {
        console.error('' + data);
      });

    }

    if (proc != null) {
      proc.on('exit', doStart);
      proc.stdin.write('quit\n');
      proc = null;
      proxyServer = null;
    } else {
      doStart();
    }
  });
}

module.exports = function(app, options) {
  if (!options || !options.watcher) {
    console.warn('Watcher is not available. Not proxying requests to Klondike.SelfHost.');
    return;
  }

  options.watcher.on('change', start)

  app.all('/api/*', function(req, res, next) {
    if (proxyReady == null) {
      res.status(502).send('Bad Gateway');
      return;
    }

    proxyReady.then(function() {
      try {
        proxyServer.web(req, res);
      } catch (err) {
        console.error('HTTP Proxy to Klondike.SelfHost failed:', err);
        res.status(502).send('Bad Gateway');
      }
    });
  });

  app.on('upgrade', function (req, socket, head) {
    if (proxyReady == null) {
      res.status(502).send('Bad Gateway');
      return;
    }

    proxyReady.then(function() {
      try {
        proxyServer.ws(req, socket, head);
      } catch (err) {
        console.error('WebSocket Proxy to Klondike.SelfHost failed:', err);
        res.status(502).send('Bad Gateway');
      }
    });
  });
}
