/**
 * Sourced from: https://github.com/nathanboktae/mocha-phantomjs-core
 */
(function() {
  // A shim for non ES5 supporting browsers, like PhantomJS. Lovingly inspired by:
  // http://www.angrycoding.com/2011/09/to-bind-or-not-to-bind-that-is-in.html
  if (!('bind' in Function.prototype)) {
    Function.prototype.bind = function() {
      const funcObj = this;
      const extraArgs = Array.prototype.slice.call(arguments);
      const thisObj = extraArgs.shift();
      return function() {
        return funcObj.apply(
          thisObj,
          extraArgs.concat(Array.prototype.slice.call(arguments)),
        );
      };
    };
  }

  function isFileReady(readyState) {
    // Check to see if any of the ways a file can be ready are available as properties on the file's element
    return (
      !readyState ||
      readyState == 'loaded' ||
      readyState == 'complete' ||
      readyState == 'uninitialized'
    );
  }

  function shimMochaProcess(M) {
    // Mocha needs a process.stdout.write in order to change the cursor position.
    M.process = M.process || {};
    M.process.stdout = M.process.stdout || process.stdout;
    M.process.stdout.write = function(s) {
      window.callPhantom({ stdout: s });
    };
    window.callPhantom({ getColWith: true });
  }

  function shimMochaInstance(m) {
    const origRun = m.run;
    const origUi = m.ui;
    m.ui = function() {
      const retval = origUi.apply(mocha, arguments);
      window.callPhantom({ configureMocha: true });
      m.reporter = function() {};
      return retval;
    };
    m.run = function() {
      window.callPhantom({ testRunStarted: m.suite.suites.length });
      m.runner = origRun.apply(mocha, arguments);
      if (m.runner.stats && m.runner.stats.end) {
        window.callPhantom({ testRunEnded: m.runner });
      } else {
        m.runner.on('end', function() {
          window.callPhantom({ testRunEnded: m.runner });
        });
      }
      return m.runner;
    };
  }

  Object.defineProperty(window, 'checkForMocha', {
    value() {
      const scriptTags = document.querySelectorAll('script');
      const mochaScript = Array.prototype.filter.call(scriptTags, function(s) {
        const src = s.getAttribute('src');
        return src && src.match(/mocha\.js$/);
      })[0];

      if (mochaScript) {
        mochaScript.onreadystatechange = mochaScript.onload = function() {
          if (isFileReady(mochaScript.readyState)) {
            initMochaPhantomJS();
          }
        };
      }
    },
  });

  Object.defineProperty(window, 'initMochaPhantomJS', {
    value() {
      shimMochaProcess(Mocha);
      shimMochaInstance(mocha);
      delete window.initMochaPhantomJS;
    },
    configurable: true,
  });

  // Mocha needs the formating feature of console.log so copy node's format function and
  // monkey-patch it into place. This code is copied from node's, links copyright applies.
  // https://github.com/joyent/node/blob/master/lib/util.js
  if (!console.format) {
    console.format = function(f) {
      if (typeof f !== 'string') {
        return Array.prototype.map
          .call(arguments, function(arg) {
            try {
              return JSON.stringify(arg);
            } catch (_) {
              return '[Circular]';
            }
          })
          .join(' ');
      }
      let i = 1;
      const args = arguments;
      const len = args.length;
      let str = String(f).replace(/%[sdj%]/g, function(x) {
        if (x === '%%') return '%';
        if (i >= len) return x;
        switch (x) {
          case '%s':
            return String(args[i++]);
          case '%d':
            return Number(args[i++]);
          case '%j':
            try {
              return JSON.stringify(args[i++]);
            } catch (_) {
              return '[Circular]';
            }
          default:
            return x;
        }
      });
      for (let x = args[i]; i < len; x = args[++i]) {
        if (x === null || typeof x !== 'object') {
          str += ` ${x}`;
        } else {
          str += ` ${JSON.stringify(x)}`;
        }
      }
      return str;
    };
    const origError = console.error;
    console.error = function() {
      origError.call(console, console.format.apply(console, arguments));
    };
    const origLog = console.log;
    console.log = function() {
      origLog.call(console, console.format.apply(console, arguments));
    };
  }
})();
