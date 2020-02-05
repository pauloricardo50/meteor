module.exports = (function(e, t) {
  const r = {};
  function __webpack_require__(t) {
    if (r[t]) {
      return r[t].exports;
    }
    const n = (r[t] = { i: t, l: false, exports: {} });
    e[t].call(n.exports, n, n.exports, __webpack_require__);
    n.l = true;
    return n.exports;
  }
  __webpack_require__.ab = `${__dirname}/`;
  function startup() {
    return __webpack_require__(497);
  }
  t(__webpack_require__);
  return startup();
})(
  {
    0(e, t, r) {
      e.exports = withDefaults;
      const n = r(500);
      function withDefaults(e, t) {
        const r = e.defaults(t);
        const i = function(e, t) {
          return n(r, e, t);
        };
        i.defaults = withDefaults.bind(null, r);
        return i;
      }
    },
    2(e, t, r) {
      const n = r(87);
      const i = r(118);
      const s = r(49);
      const o = (e, t) => {
        if (!e && t) {
          throw new Error(
            "You can't specify a `release` without specifying `platform`",
          );
        }
        e = e || n.platform();
        let r;
        if (e === 'darwin') {
          if (!t && n.platform() === 'darwin') {
            t = n.release();
          }
          const e = t
            ? Number(t.split('.')[0]) > 15
              ? 'macOS'
              : 'OS X'
            : 'macOS';
          r = t ? i(t).name : '';
          return e + (r ? ` ${r}` : '');
        }
        if (e === 'linux') {
          if (!t && n.platform() === 'linux') {
            t = n.release();
          }
          r = t ? t.replace(/^(\d+\.\d+).*/, '$1') : '';
          return `Linux${r ? ` ${r}` : ''}`;
        }
        if (e === 'win32') {
          if (!t && n.platform() === 'win32') {
            t = n.release();
          }
          r = t ? s(t) : '';
          return `Windows${r ? ` ${r}` : ''}`;
        }
        return e;
      };
      e.exports = o;
    },
    8(e, t, r) {
      e.exports = iterator;
      const n = r(301);
      function iterator(e, t) {
        const r = t.headers;
        let i = e.request.endpoint(t).url;
        return {
          [Symbol.asyncIterator]: () => ({
            next() {
              if (!i) {
                return Promise.resolve({ done: true });
              }
              return e.request({ url: i, headers: r }).then(t => {
                n(e, i, t);
                i = ((t.headers.link || '').match(/<([^>]+)>;\s*rel="next"/) ||
                  [])[1];
                return { value: t };
              });
            },
          }),
        };
      }
    },
    9(e, t, r) {
      const n = r(969);
      const i = function() {};
      const s = function(e) {
        return e.setHeader && typeof e.abort === 'function';
      };
      const o = function(e) {
        return e.stdio && Array.isArray(e.stdio) && e.stdio.length === 3;
      };
      var a = function(e, t, r) {
        if (typeof t === 'function') return a(e, null, t);
        if (!t) t = {};
        r = n(r || i);
        const u = e._writableState;
        const p = e._readableState;
        let c = t.readable || (t.readable !== false && e.readable);
        let d = t.writable || (t.writable !== false && e.writable);
        let l = false;
        const g = function() {
          if (!e.writable) m();
        };
        var m = function() {
          d = false;
          if (!c) r.call(e);
        };
        const h = function() {
          c = false;
          if (!d) r.call(e);
        };
        const y = function(t) {
          r.call(e, t ? new Error(`exited with error code: ${t}`) : null);
        };
        const f = function(t) {
          r.call(e, t);
        };
        const b = function() {
          process.nextTick(_);
        };
        var _ = function() {
          if (l) return;
          if (c && !(p && p.ended && !p.destroyed)) {
            return r.call(e, new Error('premature close'));
          }
          if (d && !(u && u.ended && !u.destroyed)) {
            return r.call(e, new Error('premature close'));
          }
        };
        const q = function() {
          e.req.on('finish', m);
        };
        if (s(e)) {
          e.on('complete', m);
          e.on('abort', b);
          if (e.req) q();
          else e.on('request', q);
        } else if (d && !u) {
          e.on('end', g);
          e.on('close', g);
        }
        if (o(e)) e.on('exit', y);
        e.on('end', h);
        e.on('finish', m);
        if (t.error !== false) e.on('error', f);
        e.on('close', b);
        return function() {
          l = true;
          e.removeListener('complete', m);
          e.removeListener('abort', b);
          e.removeListener('request', q);
          if (e.req) e.req.removeListener('finish', m);
          e.removeListener('end', g);
          e.removeListener('close', g);
          e.removeListener('finish', m);
          e.removeListener('exit', y);
          e.removeListener('end', h);
          e.removeListener('error', f);
          e.removeListener('close', b);
        };
      };
      e.exports = a;
    },
    11(e) {
      e.exports = wrappy;
      function wrappy(e, t) {
        if (e && t) return wrappy(e)(t);
        if (typeof e !== 'function') {
          throw new TypeError('need wrapper function');
        }
        Object.keys(e).forEach(function(t) {
          wrapper[t] = e[t];
        });
        return wrapper;
        function wrapper() {
          const t = new Array(arguments.length);
          for (let r = 0; r < t.length; r++) {
            t[r] = arguments[r];
          }
          const n = e.apply(this, t);
          const i = t[t.length - 1];
          if (typeof n === 'function' && n !== i) {
            Object.keys(i).forEach(function(e) {
              n[e] = i[e];
            });
          }
          return n;
        }
      }
    },
    18() {
      eval('require')('encoding');
    },
    19(e, t, r) {
      e.exports = authenticationPlugin;
      const { Deprecation: n } = r(692);
      const i = r(969);
      const s = i((e, t) => e.warn(t));
      const o = r(674);
      const a = r(471);
      const u = r(349);
      function authenticationPlugin(e, t) {
        if (t.auth) {
          e.authenticate = () => {
            s(
              e.log,
              new n(
                '[@octokit/rest] octokit.authenticate() is deprecated and has no effect when "auth" option is set on Octokit constructor',
              ),
            );
          };
          return;
        }
        const r = { octokit: e, auth: false };
        e.authenticate = o.bind(null, r);
        e.hook.before('request', a.bind(null, r));
        e.hook.error('request', u.bind(null, r));
      }
    },
    20(e, t, r) {
      const n = r(129);
      const i = r(568);
      const s = r(881);
      function spawn(e, t, r) {
        const o = i(e, t, r);
        const a = n.spawn(o.command, o.args, o.options);
        s.hookChildProcess(a, o);
        return a;
      }
      function spawnSync(e, t, r) {
        const o = i(e, t, r);
        const a = n.spawnSync(o.command, o.args, o.options);
        a.error = a.error || s.verifyENOENTSync(a.status, o);
        return a;
      }
      e.exports = spawn;
      e.exports.spawn = spawn;
      e.exports.sync = spawnSync;
      e.exports._parse = i;
      e.exports._enoent = s;
    },
    34(e) {
      e.exports = require('https');
    },
    39(e) {
      e.exports = e => {
        e = e || {};
        const t = e.env || process.env;
        const r = e.platform || process.platform;
        if (r !== 'win32') {
          return 'PATH';
        }
        return Object.keys(t).find(e => e.toUpperCase() === 'PATH') || 'Path';
      };
    },
    46(e, t, r) {
      e.exports = getUserAgentNode;
      const n = r(2);
      function getUserAgentNode() {
        try {
          return `Node.js/${process.version.substr(1)} (${n()}; ${
            process.arch
          })`;
        } catch (e) {
          if (/wmic os get Caption/.test(e.message)) {
            return 'Windows <version undetectable>';
          }
          throw e;
        }
      }
    },
    47(e, t, r) {
      e.exports = factory;
      const n = r(402);
      const i = r(855);
      function factory(e) {
        const t = n.bind(null, e || []);
        t.plugin = i.bind(null, e || []);
        return t;
      }
    },
    49(e, t, r) {
      const n = r(87);
      const i = r(955);
      const s = new Map([
        ['10.0', '10'],
        ['6.3', '8.1'],
        ['6.2', '8'],
        ['6.1', '7'],
        ['6.0', 'Vista'],
        ['5.2', 'Server 2003'],
        ['5.1', 'XP'],
        ['5.0', '2000'],
        ['4.9', 'ME'],
        ['4.1', '98'],
        ['4.0', '95'],
      ]);
      const o = e => {
        const t = /\d+\.\d/.exec(e || n.release());
        if (e && !t) {
          throw new Error("`release` argument doesn't match `n.n`");
        }
        const r = (t || [])[0];
        if (
          (!e || e === n.release()) &&
          ['6.1', '6.2', '6.3', '10.0'].includes(r)
        ) {
          const e = i.sync('wmic', ['os', 'get', 'Caption']).stdout || '';
          const t = (e.match(/2008|2012|2016/) || [])[0];
          if (t) {
            return `Server ${t}`;
          }
        }
        return s.get(r);
      };
      e.exports = o;
    },
    87(e) {
      e.exports = require('os');
    },
    118(e, t, r) {
      const n = r(87);
      const i = new Map([
        [19, 'Catalina'],
        [18, 'Mojave'],
        [17, 'High Sierra'],
        [16, 'Sierra'],
        [15, 'El Capitan'],
        [14, 'Yosemite'],
        [13, 'Mavericks'],
        [12, 'Mountain Lion'],
        [11, 'Lion'],
        [10, 'Snow Leopard'],
        [9, 'Leopard'],
        [8, 'Tiger'],
        [7, 'Panther'],
        [6, 'Jaguar'],
        [5, 'Puma'],
      ]);
      const s = e => {
        e = Number((e || n.release()).split('.')[0]);
        return { name: i.get(e), version: `10.${e - 4}` };
      };
      e.exports = s;
      e.exports.default = s;
    },
    126(e) {
      const t = 200;
      const r = '__lodash_hash_undefined__';
      const n = 1 / 0;
      const i = '[object Function]';
      const s = '[object GeneratorFunction]';
      const o = /[\\^$.*+?()[\]{}|]/g;
      const a = /^\[object .+?Constructor\]$/;
      const u =
        typeof global === 'object' &&
        global &&
        global.Object === Object &&
        global;
      const p =
        typeof self === 'object' && self && self.Object === Object && self;
      const c = u || p || Function('return this')();
      function arrayIncludes(e, t) {
        const r = e ? e.length : 0;
        return !!r && baseIndexOf(e, t, 0) > -1;
      }
      function arrayIncludesWith(e, t, r) {
        let n = -1;
        const i = e ? e.length : 0;
        while (++n < i) {
          if (r(t, e[n])) {
            return true;
          }
        }
        return false;
      }
      function baseFindIndex(e, t, r, n) {
        const i = e.length;
        let s = r + (n ? 1 : -1);
        while (n ? s-- : ++s < i) {
          if (t(e[s], s, e)) {
            return s;
          }
        }
        return -1;
      }
      function baseIndexOf(e, t, r) {
        if (t !== t) {
          return baseFindIndex(e, baseIsNaN, r);
        }
        let n = r - 1;
        const i = e.length;
        while (++n < i) {
          if (e[n] === t) {
            return n;
          }
        }
        return -1;
      }
      function baseIsNaN(e) {
        return e !== e;
      }
      function cacheHas(e, t) {
        return e.has(t);
      }
      function getValue(e, t) {
        return e == null ? undefined : e[t];
      }
      function isHostObject(e) {
        let t = false;
        if (e != null && typeof e.toString !== 'function') {
          try {
            t = !!`${e}`;
          } catch (e) {}
        }
        return t;
      }
      function setToArray(e) {
        let t = -1;
        const r = Array(e.size);
        e.forEach(function(e) {
          r[++t] = e;
        });
        return r;
      }
      const d = Array.prototype;
      const l = Function.prototype;
      const g = Object.prototype;
      const m = c['__core-js_shared__'];
      const h = (function() {
        const e = /[^.]+$/.exec((m && m.keys && m.keys.IE_PROTO) || '');
        return e ? `Symbol(src)_1.${e}` : '';
      })();
      const y = l.toString;
      const f = g.hasOwnProperty;
      const b = g.toString;
      const _ = RegExp(
        `^${y
          .call(f)
          .replace(o, '\\$&')
          .replace(
            /hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,
            '$1.*?',
          )}$`,
      );
      const q = d.splice;
      const w = getNative(c, 'Map');
      const v = getNative(c, 'Set');
      const E = getNative(Object, 'create');
      function Hash(e) {
        let t = -1;
        const r = e ? e.length : 0;
        this.clear();
        while (++t < r) {
          const n = e[t];
          this.set(n[0], n[1]);
        }
      }
      function hashClear() {
        this.__data__ = E ? E(null) : {};
      }
      function hashDelete(e) {
        return this.has(e) && delete this.__data__[e];
      }
      function hashGet(e) {
        const t = this.__data__;
        if (E) {
          const n = t[e];
          return n === r ? undefined : n;
        }
        return f.call(t, e) ? t[e] : undefined;
      }
      function hashHas(e) {
        const t = this.__data__;
        return E ? t[e] !== undefined : f.call(t, e);
      }
      function hashSet(e, t) {
        const n = this.__data__;
        n[e] = E && t === undefined ? r : t;
        return this;
      }
      Hash.prototype.clear = hashClear;
      Hash.prototype.delete = hashDelete;
      Hash.prototype.get = hashGet;
      Hash.prototype.has = hashHas;
      Hash.prototype.set = hashSet;
      function ListCache(e) {
        let t = -1;
        const r = e ? e.length : 0;
        this.clear();
        while (++t < r) {
          const n = e[t];
          this.set(n[0], n[1]);
        }
      }
      function listCacheClear() {
        this.__data__ = [];
      }
      function listCacheDelete(e) {
        const t = this.__data__;
        const r = assocIndexOf(t, e);
        if (r < 0) {
          return false;
        }
        const n = t.length - 1;
        if (r == n) {
          t.pop();
        } else {
          q.call(t, r, 1);
        }
        return true;
      }
      function listCacheGet(e) {
        const t = this.__data__;
        const r = assocIndexOf(t, e);
        return r < 0 ? undefined : t[r][1];
      }
      function listCacheHas(e) {
        return assocIndexOf(this.__data__, e) > -1;
      }
      function listCacheSet(e, t) {
        const r = this.__data__;
        const n = assocIndexOf(r, e);
        if (n < 0) {
          r.push([e, t]);
        } else {
          r[n][1] = t;
        }
        return this;
      }
      ListCache.prototype.clear = listCacheClear;
      ListCache.prototype.delete = listCacheDelete;
      ListCache.prototype.get = listCacheGet;
      ListCache.prototype.has = listCacheHas;
      ListCache.prototype.set = listCacheSet;
      function MapCache(e) {
        let t = -1;
        const r = e ? e.length : 0;
        this.clear();
        while (++t < r) {
          const n = e[t];
          this.set(n[0], n[1]);
        }
      }
      function mapCacheClear() {
        this.__data__ = {
          hash: new Hash(),
          map: new (w || ListCache)(),
          string: new Hash(),
        };
      }
      function mapCacheDelete(e) {
        return getMapData(this, e).delete(e);
      }
      function mapCacheGet(e) {
        return getMapData(this, e).get(e);
      }
      function mapCacheHas(e) {
        return getMapData(this, e).has(e);
      }
      function mapCacheSet(e, t) {
        getMapData(this, e).set(e, t);
        return this;
      }
      MapCache.prototype.clear = mapCacheClear;
      MapCache.prototype.delete = mapCacheDelete;
      MapCache.prototype.get = mapCacheGet;
      MapCache.prototype.has = mapCacheHas;
      MapCache.prototype.set = mapCacheSet;
      function SetCache(e) {
        let t = -1;
        const r = e ? e.length : 0;
        this.__data__ = new MapCache();
        while (++t < r) {
          this.add(e[t]);
        }
      }
      function setCacheAdd(e) {
        this.__data__.set(e, r);
        return this;
      }
      function setCacheHas(e) {
        return this.__data__.has(e);
      }
      SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
      SetCache.prototype.has = setCacheHas;
      function assocIndexOf(e, t) {
        let r = e.length;
        while (r--) {
          if (eq(e[r][0], t)) {
            return r;
          }
        }
        return -1;
      }
      function baseIsNative(e) {
        if (!isObject(e) || isMasked(e)) {
          return false;
        }
        const t = isFunction(e) || isHostObject(e) ? _ : a;
        return t.test(toSource(e));
      }
      function baseUniq(e, r, n) {
        let i = -1;
        let s = arrayIncludes;
        const o = e.length;
        let a = true;
        const u = [];
        let p = u;
        if (n) {
          a = false;
          s = arrayIncludesWith;
        } else if (o >= t) {
          const c = r ? null : T(e);
          if (c) {
            return setToArray(c);
          }
          a = false;
          s = cacheHas;
          p = new SetCache();
        } else {
          p = r ? [] : u;
        }
        e: while (++i < o) {
          let d = e[i];
          const l = r ? r(d) : d;
          d = n || d !== 0 ? d : 0;
          if (a && l === l) {
            let g = p.length;
            while (g--) {
              if (p[g] === l) {
                continue e;
              }
            }
            if (r) {
              p.push(l);
            }
            u.push(d);
          } else if (!s(p, l, n)) {
            if (p !== u) {
              p.push(l);
            }
            u.push(d);
          }
        }
        return u;
      }
      var T = !(v && 1 / setToArray(new v([, -0]))[1] == n)
        ? noop
        : function(e) {
            return new v(e);
          };
      function getMapData(e, t) {
        const r = e.__data__;
        return isKeyable(t)
          ? r[typeof t === 'string' ? 'string' : 'hash']
          : r.map;
      }
      function getNative(e, t) {
        const r = getValue(e, t);
        return baseIsNative(r) ? r : undefined;
      }
      function isKeyable(e) {
        const t = typeof e;
        return t == 'string' || t == 'number' || t == 'symbol' || t == 'boolean'
          ? e !== '__proto__'
          : e === null;
      }
      function isMasked(e) {
        return !!h && h in e;
      }
      function toSource(e) {
        if (e != null) {
          try {
            return y.call(e);
          } catch (e) {}
          try {
            return `${e}`;
          } catch (e) {}
        }
        return '';
      }
      function uniq(e) {
        return e && e.length ? baseUniq(e) : [];
      }
      function eq(e, t) {
        return e === t || (e !== e && t !== t);
      }
      function isFunction(e) {
        const t = isObject(e) ? b.call(e) : '';
        return t == i || t == s;
      }
      function isObject(e) {
        const t = typeof e;
        return !!e && (t == 'object' || t == 'function');
      }
      function noop() {}
      e.exports = uniq;
    },
    129(e) {
      e.exports = require('child_process');
    },
    143(e, t, r) {
      e.exports = withAuthorizationPrefix;
      const n = r(368);
      const i = /^[\w-]+:/;
      function withAuthorizationPrefix(e) {
        if (/^(basic|bearer|token) /i.test(e)) {
          return e;
        }
        try {
          if (i.test(n(e))) {
            return `basic ${e}`;
          }
        } catch (e) {}
        if (e.split(/\./).length === 3) {
          return `bearer ${e}`;
        }
        return `token ${e}`;
      }
    },
    145(e, t, r) {
      const n = r(453);
      const i = r(966);
      class MaxBufferError extends Error {
        constructor() {
          super('maxBuffer exceeded');
          this.name = 'MaxBufferError';
        }
      }
      function getStream(e, t) {
        if (!e) {
          return Promise.reject(new Error('Expected a stream'));
        }
        t = { maxBuffer: Infinity, ...t };
        const { maxBuffer: r } = t;
        let s;
        return new Promise((o, a) => {
          const u = e => {
            if (e) {
              e.bufferedData = s.getBufferedValue();
            }
            a(e);
          };
          s = n(e, i(t), e => {
            if (e) {
              u(e);
              return;
            }
            o();
          });
          s.on('data', () => {
            if (s.getBufferedLength() > r) {
              u(new MaxBufferError());
            }
          });
        }).then(() => s.getBufferedValue());
      }
      e.exports = getStream;
      e.exports.buffer = (e, t) => getStream(e, { ...t, encoding: 'buffer' });
      e.exports.array = (e, t) => getStream(e, { ...t, array: true });
      e.exports.MaxBufferError = MaxBufferError;
    },
    148(e, t, r) {
      e.exports = paginatePlugin;
      const n = r(8);
      const i = r(807);
      function paginatePlugin(e) {
        e.paginate = i.bind(null, e);
        e.paginate.iterator = n.bind(null, e);
      }
    },
    168(e) {
      const t = ['stdin', 'stdout', 'stderr'];
      const r = e => t.some(t => Boolean(e[t]));
      e.exports = e => {
        if (!e) {
          return null;
        }
        if (e.stdio && r(e)) {
          throw new Error(
            `It's not possible to provide \`stdio\` in combination with one of ${t
              .map(e => `\`${e}\``)
              .join(', ')}`,
          );
        }
        if (typeof e.stdio === 'string') {
          return e.stdio;
        }
        const n = e.stdio || [];
        if (!Array.isArray(n)) {
          throw new TypeError(
            `Expected \`stdio\` to be of type \`string\` or \`Array\`, got \`${typeof n}\``,
          );
        }
        const i = [];
        const s = Math.max(n.length, t.length);
        for (let r = 0; r < s; r++) {
          let s = null;
          if (n[r] !== undefined) {
            s = n[r];
          } else if (e[t[r]] !== undefined) {
            s = e[t[r]];
          }
          i[r] = s;
        }
        return i;
      };
    },
    190(e, t, r) {
      e.exports = authenticationPlugin;
      const n = r(863);
      const i = r(293);
      const s = r(954);
      function authenticationPlugin(e, t) {
        if (!t.auth) {
          return;
        }
        s(t.auth);
        const r = { octokit: e, auth: t.auth };
        e.hook.before('request', n.bind(null, r));
        e.hook.error('request', i.bind(null, r));
      }
    },
    197(e, t, r) {
      e.exports = isexe;
      isexe.sync = sync;
      const n = r(747);
      function isexe(e, t, r) {
        n.stat(e, function(e, n) {
          r(e, e ? false : checkStat(n, t));
        });
      }
      function sync(e, t) {
        return checkStat(n.statSync(e), t);
      }
      function checkStat(e, t) {
        return e.isFile() && checkMode(e, t);
      }
      function checkMode(e, t) {
        const r = e.mode;
        const n = e.uid;
        const i = e.gid;
        const s =
          t.uid !== undefined ? t.uid : process.getuid && process.getuid();
        const o =
          t.gid !== undefined ? t.gid : process.getgid && process.getgid();
        const a = 0o100;
        const u = 0o010;
        const p = 0o001;
        const c = a | u;
        const d =
          r & p ||
          (r & u && i === o) ||
          (r & a && n === s) ||
          (r & c && s === 0);
        return d;
      }
    },
    211(e, t, r) {
      Object.defineProperty(t, '__esModule', { value: true });
      function _interopDefault(e) {
        return e && typeof e === 'object' && 'default' in e ? e.default : e;
      }
      const n = _interopDefault(r(2));
      function getUserAgent() {
        try {
          return `Node.js/${process.version.substr(1)} (${n()}; ${
            process.arch
          })`;
        } catch (e) {
          if (/wmic os get Caption/.test(e.message)) {
            return 'Windows <version undetectable>';
          }
          throw e;
        }
      }
      t.getUserAgent = getUserAgent;
    },
    215(e) {
      e.exports = {
        _from: '@octokit/rest@^16.15.0',
        _id: '@octokit/rest@16.35.0',
        _inBundle: false,
        _integrity:
          'sha512-9ShFqYWo0CLoGYhA1FdtdykJuMzS/9H6vSbbQWDX4pWr4p9v+15MsH/wpd/3fIU+tSxylaNO48+PIHqOkBRx3w==',
        _location: '/@octokit/rest',
        _phantomChildren: { 'os-name': '3.1.0' },
        _requested: {
          type: 'range',
          registry: true,
          raw: '@octokit/rest@^16.15.0',
          name: '@octokit/rest',
          escapedName: '@octokit%2frest',
          scope: '@octokit',
          rawSpec: '^16.15.0',
          saveSpec: null,
          fetchSpec: '^16.15.0',
        },
        _requiredBy: ['/@actions/github'],
        _resolved:
          'https://registry.npmjs.org/@octokit/rest/-/rest-16.35.0.tgz',
        _shasum: '7ccc1f802f407d5b8eb21768c6deca44e7b4c0d8',
        _spec: '@octokit/rest@^16.15.0',
        _where:
          '/Users/quentinherzig/Documents/dev/epotek/.actions/epotek-project-automation/node_modules/@actions/github',
        author: { name: 'Gregor Martynus', url: 'https://github.com/gr2m' },
        bugs: { url: 'https://github.com/octokit/rest.js/issues' },
        bundleDependencies: false,
        bundlesize: [
          { path: './dist/octokit-rest.min.js.gz', maxSize: '33 kB' },
        ],
        contributors: [
          { name: 'Mike de Boer', email: 'info@mikedeboer.nl' },
          { name: 'Fabian Jakobs', email: 'fabian@c9.io' },
          { name: 'Joe Gallo', email: 'joe@brassafrax.com' },
          { name: 'Gregor Martynus', url: 'https://github.com/gr2m' },
        ],
        dependencies: {
          '@octokit/request': '^5.2.0',
          '@octokit/request-error': '^1.0.2',
          'atob-lite': '^2.0.0',
          'before-after-hook': '^2.0.0',
          'btoa-lite': '^1.0.0',
          deprecation: '^2.0.0',
          'lodash.get': '^4.4.2',
          'lodash.set': '^4.3.2',
          'lodash.uniq': '^4.5.0',
          'octokit-pagination-methods': '^1.1.0',
          once: '^1.4.0',
          'universal-user-agent': '^4.0.0',
        },
        deprecated: false,
        description: 'GitHub REST API client for Node.js',
        devDependencies: {
          '@gimenete/type-writer': '^0.1.3',
          '@octokit/fixtures-server': '^5.0.6',
          '@octokit/graphql': '^4.2.0',
          '@types/node': '^12.0.0',
          bundlesize: '^0.18.0',
          chai: '^4.1.2',
          'compression-webpack-plugin': '^3.0.0',
          cypress: '^3.0.0',
          glob: '^7.1.2',
          'http-proxy-agent': '^2.1.0',
          'lodash.camelcase': '^4.3.0',
          'lodash.merge': '^4.6.1',
          'lodash.upperfirst': '^4.3.1',
          mkdirp: '^0.5.1',
          mocha: '^6.0.0',
          mustache: '^3.0.0',
          nock: '^11.3.3',
          'npm-run-all': '^4.1.2',
          nyc: '^14.0.0',
          prettier: '^1.14.2',
          proxy: '^1.0.0',
          'semantic-release': '^15.0.0',
          sinon: '^7.2.4',
          'sinon-chai': '^3.0.0',
          'sort-keys': '^4.0.0',
          'string-to-arraybuffer': '^1.0.0',
          'string-to-jsdoc-comment': '^1.0.0',
          typescript: '^3.3.1',
          webpack: '^4.0.0',
          'webpack-bundle-analyzer': '^3.0.0',
          'webpack-cli': '^3.0.0',
        },
        files: ['index.js', 'index.d.ts', 'lib', 'plugins'],
        homepage: 'https://github.com/octokit/rest.js#readme',
        keywords: ['octokit', 'github', 'rest', 'api-client'],
        license: 'MIT',
        name: '@octokit/rest',
        nyc: { ignore: ['test'] },
        publishConfig: { access: 'public' },
        release: {
          publish: [
            '@semantic-release/npm',
            {
              path: '@semantic-release/github',
              assets: ['dist/*', '!dist/*.map.gz'],
            },
          ],
        },
        repository: {
          type: 'git',
          url: 'git+https://github.com/octokit/rest.js.git',
        },
        scripts: {
          build: 'npm-run-all build:*',
          'build:browser': 'npm-run-all build:browser:*',
          'build:browser:development':
            'webpack --mode development --entry . --output-library=Octokit --output=./dist/octokit-rest.js --profile --json > dist/bundle-stats.json',
          'build:browser:production':
            'webpack --mode production --entry . --plugin=compression-webpack-plugin --output-library=Octokit --output-path=./dist --output-filename=octokit-rest.min.js --devtool source-map',
          'build:ts': 'npm run -s update-endpoints:typescript',
          coverage: 'nyc report --reporter=html && open coverage/index.html',
          'generate-bundle-report':
            'webpack-bundle-analyzer dist/bundle-stats.json --mode=static --no-open --report dist/bundle-report.html',
          lint:
            "prettier --check '{lib,plugins,scripts,test}/**/*.{js,json,ts}' 'docs/*.{js,json}' 'docs/src/**/*' index.js README.md package.json",
          'lint:fix':
            "prettier --write '{lib,plugins,scripts,test}/**/*.{js,json,ts}' 'docs/*.{js,json}' 'docs/src/**/*' index.js README.md package.json",
          'postvalidate:ts':
            'tsc --noEmit --target es6 test/typescript-validate.ts',
          'prebuild:browser': 'mkdirp dist/',
          pretest: 'npm run -s lint',
          'prevalidate:ts': 'npm run -s build:ts',
          'start-fixtures-server': 'octokit-fixtures-server',
          test: 'nyc mocha test/mocha-node-setup.js "test/*/**/*-test.js"',
          'test:browser': 'cypress run --browser chrome',
          'update-endpoints': 'npm-run-all update-endpoints:*',
          'update-endpoints:code': 'node scripts/update-endpoints/code',
          'update-endpoints:fetch-json':
            'node scripts/update-endpoints/fetch-json',
          'update-endpoints:typescript':
            'node scripts/update-endpoints/typescript',
          'validate:ts': 'tsc --target es6 --noImplicitAny index.d.ts',
        },
        types: 'index.d.ts',
        version: '16.35.0',
      };
    },
    248(e, t, r) {
      e.exports = octokitRegisterEndpoints;
      const n = r(899);
      function octokitRegisterEndpoints(e) {
        e.registerEndpoints = n.bind(null, e);
      }
    },
    260(e, t, r) {
      const n = r(357);
      let i = r(654);
      let s = r(614);
      if (typeof s !== 'function') {
        s = s.EventEmitter;
      }
      let o;
      if (process.__signal_exit_emitter__) {
        o = process.__signal_exit_emitter__;
      } else {
        o = process.__signal_exit_emitter__ = new s();
        o.count = 0;
        o.emitted = {};
      }
      if (!o.infinite) {
        o.setMaxListeners(Infinity);
        o.infinite = true;
      }
      e.exports = function(e, t) {
        n.equal(
          typeof e,
          'function',
          'a callback must be provided for exit handler',
        );
        if (u === false) {
          load();
        }
        let r = 'exit';
        if (t && t.alwaysLast) {
          r = 'afterexit';
        }
        const i = function() {
          o.removeListener(r, e);
          if (
            o.listeners('exit').length === 0 &&
            o.listeners('afterexit').length === 0
          ) {
            unload();
          }
        };
        o.on(r, e);
        return i;
      };
      e.exports.unload = unload;
      function unload() {
        if (!u) {
          return;
        }
        u = false;
        i.forEach(function(e) {
          try {
            process.removeListener(e, a[e]);
          } catch (e) {}
        });
        process.emit = c;
        process.reallyExit = p;
        o.count -= 1;
      }
      function emit(e, t, r) {
        if (o.emitted[e]) {
          return;
        }
        o.emitted[e] = true;
        o.emit(e, t, r);
      }
      var a = {};
      i.forEach(function(e) {
        a[e] = function listener() {
          const t = process.listeners(e);
          if (t.length === o.count) {
            unload();
            emit('exit', null, e);
            emit('afterexit', null, e);
            process.kill(process.pid, e);
          }
        };
      });
      e.exports.signals = function() {
        return i;
      };
      e.exports.load = load;
      var u = false;
      function load() {
        if (u) {
          return;
        }
        u = true;
        o.count += 1;
        i = i.filter(function(e) {
          try {
            process.on(e, a[e]);
            return true;
          } catch (e) {
            return false;
          }
        });
        process.emit = processEmit;
        process.reallyExit = processReallyExit;
      }
      var p = process.reallyExit;
      function processReallyExit(e) {
        process.exitCode = e || 0;
        emit('exit', process.exitCode, null);
        emit('afterexit', process.exitCode, null);
        p.call(process, process.exitCode);
      }
      var c = process.emit;
      function processEmit(e, t) {
        if (e === 'exit') {
          if (t !== undefined) {
            process.exitCode = t;
          }
          const r = c.apply(this, arguments);
          emit('exit', process.exitCode, null);
          emit('afterexit', process.exitCode, null);
          return r;
        }
        return c.apply(this, arguments);
      }
    },
    262(e, t, r) {
      Object.defineProperty(t, '__esModule', { value: true });
      const n = r(747);
      const i = r(87);
      class Context {
        constructor() {
          this.payload = {};
          if (process.env.GITHUB_EVENT_PATH) {
            if (n.existsSync(process.env.GITHUB_EVENT_PATH)) {
              this.payload = JSON.parse(
                n.readFileSync(process.env.GITHUB_EVENT_PATH, {
                  encoding: 'utf8',
                }),
              );
            } else {
              process.stdout.write(
                `GITHUB_EVENT_PATH ${process.env.GITHUB_EVENT_PATH} does not exist${i.EOL}`,
              );
            }
          }
          this.eventName = process.env.GITHUB_EVENT_NAME;
          this.sha = process.env.GITHUB_SHA;
          this.ref = process.env.GITHUB_REF;
          this.workflow = process.env.GITHUB_WORKFLOW;
          this.action = process.env.GITHUB_ACTION;
          this.actor = process.env.GITHUB_ACTOR;
        }

        get issue() {
          const e = this.payload;
          return {
            ...this.repo,
            number: (e.issue || e.pullRequest || e).number,
          };
        }

        get repo() {
          if (process.env.GITHUB_REPOSITORY) {
            const [e, t] = process.env.GITHUB_REPOSITORY.split('/');
            return { owner: e, repo: t };
          }
          if (this.payload.repository) {
            return {
              owner: this.payload.repository.owner.login,
              repo: this.payload.repository.name,
            };
          }
          throw new Error(
            "context.repo requires a GITHUB_REPOSITORY environment variable like 'owner/repo'",
          );
        }
      }
      t.Context = Context;
    },
    265(e, t, r) {
      e.exports = getPage;
      const n = r(370);
      const i = r(577);
      const s = r(297);
      function getPage(e, t, r, o) {
        n(
          `octokit.get${r.charAt(0).toUpperCase() +
            r.slice(
              1,
            )}Page() – You can use octokit.paginate or async iterators instead: https://github.com/octokit/rest.js#pagination.`,
        );
        const a = i(t)[r];
        if (!a) {
          const e = new s(`No ${r} page found`, 404);
          return Promise.reject(e);
        }
        const u = { url: a, headers: applyAcceptHeader(t, o) };
        const p = e.request(u);
        return p;
      }
      function applyAcceptHeader(e, t) {
        const r = e.headers && e.headers['x-github-media-type'];
        if (!r || (t && t.accept)) {
          return t;
        }
        t = t || {};
        t.accept = `application/vnd.${r
          .replace('; param=', '.')
          .replace('; format=', '+')}`;
        return t;
      }
    },
    280(e, t) {
      t = e.exports = SemVer;
      let r;
      if (
        typeof process === 'object' &&
        process.env &&
        process.env.NODE_DEBUG &&
        /\bsemver\b/i.test(process.env.NODE_DEBUG)
      ) {
        r = function() {
          const e = Array.prototype.slice.call(arguments, 0);
          e.unshift('SEMVER');
          console.log.apply(console, e);
        };
      } else {
        r = function() {};
      }
      t.SEMVER_SPEC_VERSION = '2.0.0';
      const n = 256;
      const i = Number.MAX_SAFE_INTEGER || 9007199254740991;
      const s = 16;
      const o = (t.re = []);
      const a = (t.src = []);
      let u = 0;
      const p = u++;
      a[p] = '0|[1-9]\\d*';
      const c = u++;
      a[c] = '[0-9]+';
      const d = u++;
      a[d] = '\\d*[a-zA-Z-][a-zA-Z0-9-]*';
      const l = u++;
      a[l] = `(${a[p]})\\.` + `(${a[p]})\\.` + `(${a[p]})`;
      const g = u++;
      a[g] = `(${a[c]})\\.` + `(${a[c]})\\.` + `(${a[c]})`;
      const m = u++;
      a[m] = `(?:${a[p]}|${a[d]})`;
      const h = u++;
      a[h] = `(?:${a[c]}|${a[d]})`;
      const y = u++;
      a[y] = `(?:-(${a[m]}(?:\\.${a[m]})*))`;
      const f = u++;
      a[f] = `(?:-?(${a[h]}(?:\\.${a[h]})*))`;
      const b = u++;
      a[b] = '[0-9A-Za-z-]+';
      const _ = u++;
      a[_] = `(?:\\+(${a[b]}(?:\\.${a[b]})*))`;
      const q = u++;
      const w = `v?${a[l]}${a[y]}?${a[_]}?`;
      a[q] = `^${w}$`;
      const v = `[v=\\s]*${a[g]}${a[f]}?${a[_]}?`;
      const E = u++;
      a[E] = `^${v}$`;
      const T = u++;
      a[T] = '((?:<|>)?=?)';
      const j = u++;
      a[j] = `${a[c]}|x|X|\\*`;
      const k = u++;
      a[k] = `${a[p]}|x|X|\\*`;
      const S = u++;
      a[S] =
        `[v=\\s]*(${a[k]})` +
        `(?:\\.(${a[k]})` +
        `(?:\\.(${a[k]})` +
        `(?:${a[y]})?${a[_]}?` +
        `)?)?`;
      const P = u++;
      a[P] =
        `[v=\\s]*(${a[j]})` +
        `(?:\\.(${a[j]})` +
        `(?:\\.(${a[j]})` +
        `(?:${a[f]})?${a[_]}?` +
        `)?)?`;
      const C = u++;
      a[C] = `^${a[T]}\\s*${a[S]}$`;
      const O = u++;
      a[O] = `^${a[T]}\\s*${a[P]}$`;
      const x = u++;
      a[x] =
        `${'(?:^|[^\\d])' + '(\\d{1,'}${s}})` +
        `(?:\\.(\\d{1,${s}}))?` +
        `(?:\\.(\\d{1,${s}}))?` +
        `(?:$|[^\\d])`;
      const G = u++;
      a[G] = '(?:~>?)';
      const A = u++;
      a[A] = `(\\s*)${a[G]}\\s+`;
      o[A] = new RegExp(a[A], 'g');
      const R = '$1~';
      const D = u++;
      a[D] = `^${a[G]}${a[S]}$`;
      const $ = u++;
      a[$] = `^${a[G]}${a[P]}$`;
      const F = u++;
      a[F] = '(?:\\^)';
      const B = u++;
      a[B] = `(\\s*)${a[F]}\\s+`;
      o[B] = new RegExp(a[B], 'g');
      const I = '$1^';
      const U = u++;
      a[U] = `^${a[F]}${a[S]}$`;
      const L = u++;
      a[L] = `^${a[F]}${a[P]}$`;
      const H = u++;
      a[H] = `^${a[T]}\\s*(${v})$|^$`;
      const z = u++;
      a[z] = `^${a[T]}\\s*(${w})$|^$`;
      const N = u++;
      a[N] = `(\\s*)${a[T]}\\s*(${v}|${a[S]})`;
      o[N] = new RegExp(a[N], 'g');
      const V = '$1$2$3';
      const W = u++;
      a[W] = `^\\s*(${a[S]})` + `\\s+-\\s+` + `(${a[S]})` + `\\s*$`;
      const K = u++;
      a[K] = `^\\s*(${a[P]})` + `\\s+-\\s+` + `(${a[P]})` + `\\s*$`;
      const X = u++;
      a[X] = '(<|>)?=?\\s*\\*';
      for (let J = 0; J < u; J++) {
        r(J, a[J]);
        if (!o[J]) {
          o[J] = new RegExp(a[J]);
        }
      }
      t.parse = parse;
      function parse(e, t) {
        if (!t || typeof t !== 'object') {
          t = { loose: !!t, includePrerelease: false };
        }
        if (e instanceof SemVer) {
          return e;
        }
        if (typeof e !== 'string') {
          return null;
        }
        if (e.length > n) {
          return null;
        }
        const r = t.loose ? o[E] : o[q];
        if (!r.test(e)) {
          return null;
        }
        try {
          return new SemVer(e, t);
        } catch (e) {
          return null;
        }
      }
      t.valid = valid;
      function valid(e, t) {
        const r = parse(e, t);
        return r ? r.version : null;
      }
      t.clean = clean;
      function clean(e, t) {
        const r = parse(e.trim().replace(/^[=v]+/, ''), t);
        return r ? r.version : null;
      }
      t.SemVer = SemVer;
      function SemVer(e, t) {
        if (!t || typeof t !== 'object') {
          t = { loose: !!t, includePrerelease: false };
        }
        if (e instanceof SemVer) {
          if (e.loose === t.loose) {
            return e;
          }
          e = e.version;
        } else if (typeof e !== 'string') {
          throw new TypeError(`Invalid Version: ${e}`);
        }
        if (e.length > n) {
          throw new TypeError(`version is longer than ${n} characters`);
        }
        if (!(this instanceof SemVer)) {
          return new SemVer(e, t);
        }
        r('SemVer', e, t);
        this.options = t;
        this.loose = !!t.loose;
        const s = e.trim().match(t.loose ? o[E] : o[q]);
        if (!s) {
          throw new TypeError(`Invalid Version: ${e}`);
        }
        this.raw = e;
        this.major = +s[1];
        this.minor = +s[2];
        this.patch = +s[3];
        if (this.major > i || this.major < 0) {
          throw new TypeError('Invalid major version');
        }
        if (this.minor > i || this.minor < 0) {
          throw new TypeError('Invalid minor version');
        }
        if (this.patch > i || this.patch < 0) {
          throw new TypeError('Invalid patch version');
        }
        if (!s[4]) {
          this.prerelease = [];
        } else {
          this.prerelease = s[4].split('.').map(function(e) {
            if (/^[0-9]+$/.test(e)) {
              const t = +e;
              if (t >= 0 && t < i) {
                return t;
              }
            }
            return e;
          });
        }
        this.build = s[5] ? s[5].split('.') : [];
        this.format();
      }
      SemVer.prototype.format = function() {
        this.version = `${this.major}.${this.minor}.${this.patch}`;
        if (this.prerelease.length) {
          this.version += `-${this.prerelease.join('.')}`;
        }
        return this.version;
      };
      SemVer.prototype.toString = function() {
        return this.version;
      };
      SemVer.prototype.compare = function(e) {
        r('SemVer.compare', this.version, this.options, e);
        if (!(e instanceof SemVer)) {
          e = new SemVer(e, this.options);
        }
        return this.compareMain(e) || this.comparePre(e);
      };
      SemVer.prototype.compareMain = function(e) {
        if (!(e instanceof SemVer)) {
          e = new SemVer(e, this.options);
        }
        return (
          compareIdentifiers(this.major, e.major) ||
          compareIdentifiers(this.minor, e.minor) ||
          compareIdentifiers(this.patch, e.patch)
        );
      };
      SemVer.prototype.comparePre = function(e) {
        if (!(e instanceof SemVer)) {
          e = new SemVer(e, this.options);
        }
        if (this.prerelease.length && !e.prerelease.length) {
          return -1;
        }
        if (!this.prerelease.length && e.prerelease.length) {
          return 1;
        }
        if (!this.prerelease.length && !e.prerelease.length) {
          return 0;
        }
        let t = 0;
        do {
          const n = this.prerelease[t];
          const i = e.prerelease[t];
          r('prerelease compare', t, n, i);
          if (n === undefined && i === undefined) {
            return 0;
          }
          if (i === undefined) {
            return 1;
          }
          if (n === undefined) {
            return -1;
          }
          if (n === i) {
            continue;
          } else {
            return compareIdentifiers(n, i);
          }
        } while (++t);
      };
      SemVer.prototype.inc = function(e, t) {
        switch (e) {
          case 'premajor':
            this.prerelease.length = 0;
            this.patch = 0;
            this.minor = 0;
            this.major++;
            this.inc('pre', t);
            break;
          case 'preminor':
            this.prerelease.length = 0;
            this.patch = 0;
            this.minor++;
            this.inc('pre', t);
            break;
          case 'prepatch':
            this.prerelease.length = 0;
            this.inc('patch', t);
            this.inc('pre', t);
            break;
          case 'prerelease':
            if (this.prerelease.length === 0) {
              this.inc('patch', t);
            }
            this.inc('pre', t);
            break;
          case 'major':
            if (
              this.minor !== 0 ||
              this.patch !== 0 ||
              this.prerelease.length === 0
            ) {
              this.major++;
            }
            this.minor = 0;
            this.patch = 0;
            this.prerelease = [];
            break;
          case 'minor':
            if (this.patch !== 0 || this.prerelease.length === 0) {
              this.minor++;
            }
            this.patch = 0;
            this.prerelease = [];
            break;
          case 'patch':
            if (this.prerelease.length === 0) {
              this.patch++;
            }
            this.prerelease = [];
            break;
          case 'pre':
            if (this.prerelease.length === 0) {
              this.prerelease = [0];
            } else {
              let r = this.prerelease.length;
              while (--r >= 0) {
                if (typeof this.prerelease[r] === 'number') {
                  this.prerelease[r]++;
                  r = -2;
                }
              }
              if (r === -1) {
                this.prerelease.push(0);
              }
            }
            if (t) {
              if (this.prerelease[0] === t) {
                if (isNaN(this.prerelease[1])) {
                  this.prerelease = [t, 0];
                }
              } else {
                this.prerelease = [t, 0];
              }
            }
            break;
          default:
            throw new Error(`invalid increment argument: ${e}`);
        }
        this.format();
        this.raw = this.version;
        return this;
      };
      t.inc = inc;
      function inc(e, t, r, n) {
        if (typeof r === 'string') {
          n = r;
          r = undefined;
        }
        try {
          return new SemVer(e, r).inc(t, n).version;
        } catch (e) {
          return null;
        }
      }
      t.diff = diff;
      function diff(e, t) {
        if (eq(e, t)) {
          return null;
        }
        const r = parse(e);
        const n = parse(t);
        let i = '';
        if (r.prerelease.length || n.prerelease.length) {
          i = 'pre';
          var s = 'prerelease';
        }
        for (const o in r) {
          if (o === 'major' || o === 'minor' || o === 'patch') {
            if (r[o] !== n[o]) {
              return i + o;
            }
          }
        }
        return s;
      }
      t.compareIdentifiers = compareIdentifiers;
      const Y = /^[0-9]+$/;
      function compareIdentifiers(e, t) {
        const r = Y.test(e);
        const n = Y.test(t);
        if (r && n) {
          e = +e;
          t = +t;
        }
        return e === t ? 0 : r && !n ? -1 : n && !r ? 1 : e < t ? -1 : 1;
      }
      t.rcompareIdentifiers = rcompareIdentifiers;
      function rcompareIdentifiers(e, t) {
        return compareIdentifiers(t, e);
      }
      t.major = major;
      function major(e, t) {
        return new SemVer(e, t).major;
      }
      t.minor = minor;
      function minor(e, t) {
        return new SemVer(e, t).minor;
      }
      t.patch = patch;
      function patch(e, t) {
        return new SemVer(e, t).patch;
      }
      t.compare = compare;
      function compare(e, t, r) {
        return new SemVer(e, r).compare(new SemVer(t, r));
      }
      t.compareLoose = compareLoose;
      function compareLoose(e, t) {
        return compare(e, t, true);
      }
      t.rcompare = rcompare;
      function rcompare(e, t, r) {
        return compare(t, e, r);
      }
      t.sort = sort;
      function sort(e, r) {
        return e.sort(function(e, n) {
          return t.compare(e, n, r);
        });
      }
      t.rsort = rsort;
      function rsort(e, r) {
        return e.sort(function(e, n) {
          return t.rcompare(e, n, r);
        });
      }
      t.gt = gt;
      function gt(e, t, r) {
        return compare(e, t, r) > 0;
      }
      t.lt = lt;
      function lt(e, t, r) {
        return compare(e, t, r) < 0;
      }
      t.eq = eq;
      function eq(e, t, r) {
        return compare(e, t, r) === 0;
      }
      t.neq = neq;
      function neq(e, t, r) {
        return compare(e, t, r) !== 0;
      }
      t.gte = gte;
      function gte(e, t, r) {
        return compare(e, t, r) >= 0;
      }
      t.lte = lte;
      function lte(e, t, r) {
        return compare(e, t, r) <= 0;
      }
      t.cmp = cmp;
      function cmp(e, t, r, n) {
        switch (t) {
          case '===':
            if (typeof e === 'object') e = e.version;
            if (typeof r === 'object') r = r.version;
            return e === r;
          case '!==':
            if (typeof e === 'object') e = e.version;
            if (typeof r === 'object') r = r.version;
            return e !== r;
          case '':
          case '=':
          case '==':
            return eq(e, r, n);
          case '!=':
            return neq(e, r, n);
          case '>':
            return gt(e, r, n);
          case '>=':
            return gte(e, r, n);
          case '<':
            return lt(e, r, n);
          case '<=':
            return lte(e, r, n);
          default:
            throw new TypeError(`Invalid operator: ${t}`);
        }
      }
      t.Comparator = Comparator;
      function Comparator(e, t) {
        if (!t || typeof t !== 'object') {
          t = { loose: !!t, includePrerelease: false };
        }
        if (e instanceof Comparator) {
          if (e.loose === !!t.loose) {
            return e;
          }
          e = e.value;
        }
        if (!(this instanceof Comparator)) {
          return new Comparator(e, t);
        }
        r('comparator', e, t);
        this.options = t;
        this.loose = !!t.loose;
        this.parse(e);
        if (this.semver === Z) {
          this.value = '';
        } else {
          this.value = this.operator + this.semver.version;
        }
        r('comp', this);
      }
      var Z = {};
      Comparator.prototype.parse = function(e) {
        const t = this.options.loose ? o[H] : o[z];
        const r = e.match(t);
        if (!r) {
          throw new TypeError(`Invalid comparator: ${e}`);
        }
        this.operator = r[1];
        if (this.operator === '=') {
          this.operator = '';
        }
        if (!r[2]) {
          this.semver = Z;
        } else {
          this.semver = new SemVer(r[2], this.options.loose);
        }
      };
      Comparator.prototype.toString = function() {
        return this.value;
      };
      Comparator.prototype.test = function(e) {
        r('Comparator.test', e, this.options.loose);
        if (this.semver === Z) {
          return true;
        }
        if (typeof e === 'string') {
          e = new SemVer(e, this.options);
        }
        return cmp(e, this.operator, this.semver, this.options);
      };
      Comparator.prototype.intersects = function(e, t) {
        if (!(e instanceof Comparator)) {
          throw new TypeError('a Comparator is required');
        }
        if (!t || typeof t !== 'object') {
          t = { loose: !!t, includePrerelease: false };
        }
        let r;
        if (this.operator === '') {
          r = new Range(e.value, t);
          return satisfies(this.value, r, t);
        }
        if (e.operator === '') {
          r = new Range(this.value, t);
          return satisfies(e.semver, r, t);
        }
        const n =
          (this.operator === '>=' || this.operator === '>') &&
          (e.operator === '>=' || e.operator === '>');
        const i =
          (this.operator === '<=' || this.operator === '<') &&
          (e.operator === '<=' || e.operator === '<');
        const s = this.semver.version === e.semver.version;
        const o =
          (this.operator === '>=' || this.operator === '<=') &&
          (e.operator === '>=' || e.operator === '<=');
        const a =
          cmp(this.semver, '<', e.semver, t) &&
          (this.operator === '>=' || this.operator === '>') &&
          (e.operator === '<=' || e.operator === '<');
        const u =
          cmp(this.semver, '>', e.semver, t) &&
          (this.operator === '<=' || this.operator === '<') &&
          (e.operator === '>=' || e.operator === '>');
        return n || i || (s && o) || a || u;
      };
      t.Range = Range;
      function Range(e, t) {
        if (!t || typeof t !== 'object') {
          t = { loose: !!t, includePrerelease: false };
        }
        if (e instanceof Range) {
          if (
            e.loose === !!t.loose &&
            e.includePrerelease === !!t.includePrerelease
          ) {
            return e;
          }
          return new Range(e.raw, t);
        }
        if (e instanceof Comparator) {
          return new Range(e.value, t);
        }
        if (!(this instanceof Range)) {
          return new Range(e, t);
        }
        this.options = t;
        this.loose = !!t.loose;
        this.includePrerelease = !!t.includePrerelease;
        this.raw = e;
        this.set = e
          .split(/\s*\|\|\s*/)
          .map(function(e) {
            return this.parseRange(e.trim());
          }, this)
          .filter(function(e) {
            return e.length;
          });
        if (!this.set.length) {
          throw new TypeError(`Invalid SemVer Range: ${e}`);
        }
        this.format();
      }
      Range.prototype.format = function() {
        this.range = this.set
          .map(function(e) {
            return e.join(' ').trim();
          })
          .join('||')
          .trim();
        return this.range;
      };
      Range.prototype.toString = function() {
        return this.range;
      };
      Range.prototype.parseRange = function(e) {
        const t = this.options.loose;
        e = e.trim();
        const n = t ? o[K] : o[W];
        e = e.replace(n, hyphenReplace);
        r('hyphen replace', e);
        e = e.replace(o[N], V);
        r('comparator trim', e, o[N]);
        e = e.replace(o[A], R);
        e = e.replace(o[B], I);
        e = e.split(/\s+/).join(' ');
        const i = t ? o[H] : o[z];
        let s = e
          .split(' ')
          .map(function(e) {
            return parseComparator(e, this.options);
          }, this)
          .join(' ')
          .split(/\s+/);
        if (this.options.loose) {
          s = s.filter(function(e) {
            return !!e.match(i);
          });
        }
        s = s.map(function(e) {
          return new Comparator(e, this.options);
        }, this);
        return s;
      };
      Range.prototype.intersects = function(e, t) {
        if (!(e instanceof Range)) {
          throw new TypeError('a Range is required');
        }
        return this.set.some(function(r) {
          return r.every(function(r) {
            return e.set.some(function(e) {
              return e.every(function(e) {
                return r.intersects(e, t);
              });
            });
          });
        });
      };
      t.toComparators = toComparators;
      function toComparators(e, t) {
        return new Range(e, t).set.map(function(e) {
          return e
            .map(function(e) {
              return e.value;
            })
            .join(' ')
            .trim()
            .split(' ');
        });
      }
      function parseComparator(e, t) {
        r('comp', e, t);
        e = replaceCarets(e, t);
        r('caret', e);
        e = replaceTildes(e, t);
        r('tildes', e);
        e = replaceXRanges(e, t);
        r('xrange', e);
        e = replaceStars(e, t);
        r('stars', e);
        return e;
      }
      function isX(e) {
        return !e || e.toLowerCase() === 'x' || e === '*';
      }
      function replaceTildes(e, t) {
        return e
          .trim()
          .split(/\s+/)
          .map(function(e) {
            return replaceTilde(e, t);
          })
          .join(' ');
      }
      function replaceTilde(e, t) {
        const n = t.loose ? o[$] : o[D];
        return e.replace(n, function(t, n, i, s, o) {
          r('tilde', e, t, n, i, s, o);
          let a;
          if (isX(n)) {
            a = '';
          } else if (isX(i)) {
            a = `>=${n}.0.0 <${+n + 1}.0.0`;
          } else if (isX(s)) {
            a = `>=${n}.${i}.0 <${n}.${+i + 1}.0`;
          } else if (o) {
            r('replaceTilde pr', o);
            a = `>=${n}.${i}.${s}-${o} <${n}.${+i + 1}.0`;
          } else {
            a = `>=${n}.${i}.${s} <${n}.${+i + 1}.0`;
          }
          r('tilde return', a);
          return a;
        });
      }
      function replaceCarets(e, t) {
        return e
          .trim()
          .split(/\s+/)
          .map(function(e) {
            return replaceCaret(e, t);
          })
          .join(' ');
      }
      function replaceCaret(e, t) {
        r('caret', e, t);
        const n = t.loose ? o[L] : o[U];
        return e.replace(n, function(t, n, i, s, o) {
          r('caret', e, t, n, i, s, o);
          let a;
          if (isX(n)) {
            a = '';
          } else if (isX(i)) {
            a = `>=${n}.0.0 <${+n + 1}.0.0`;
          } else if (isX(s)) {
            if (n === '0') {
              a = `>=${n}.${i}.0 <${n}.${+i + 1}.0`;
            } else {
              a = `>=${n}.${i}.0 <${+n + 1}.0.0`;
            }
          } else if (o) {
            r('replaceCaret pr', o);
            if (n === '0') {
              if (i === '0') {
                a = `>=${n}.${i}.${s}-${o} <${n}.${i}.${+s + 1}`;
              } else {
                a = `>=${n}.${i}.${s}-${o} <${n}.${+i + 1}.0`;
              }
            } else {
              a = `>=${n}.${i}.${s}-${o} <${+n + 1}.0.0`;
            }
          } else {
            r('no pr');
            if (n === '0') {
              if (i === '0') {
                a = `>=${n}.${i}.${s} <${n}.${i}.${+s + 1}`;
              } else {
                a = `>=${n}.${i}.${s} <${n}.${+i + 1}.0`;
              }
            } else {
              a = `>=${n}.${i}.${s} <${+n + 1}.0.0`;
            }
          }
          r('caret return', a);
          return a;
        });
      }
      function replaceXRanges(e, t) {
        r('replaceXRanges', e, t);
        return e
          .split(/\s+/)
          .map(function(e) {
            return replaceXRange(e, t);
          })
          .join(' ');
      }
      function replaceXRange(e, t) {
        e = e.trim();
        const n = t.loose ? o[O] : o[C];
        return e.replace(n, function(t, n, i, s, o, a) {
          r('xRange', e, t, n, i, s, o, a);
          const u = isX(i);
          const p = u || isX(s);
          const c = p || isX(o);
          const d = c;
          if (n === '=' && d) {
            n = '';
          }
          if (u) {
            if (n === '>' || n === '<') {
              t = '<0.0.0';
            } else {
              t = '*';
            }
          } else if (n && d) {
            if (p) {
              s = 0;
            }
            o = 0;
            if (n === '>') {
              n = '>=';
              if (p) {
                i = +i + 1;
                s = 0;
                o = 0;
              } else {
                s = +s + 1;
                o = 0;
              }
            } else if (n === '<=') {
              n = '<';
              if (p) {
                i = +i + 1;
              } else {
                s = +s + 1;
              }
            }
            t = `${n + i}.${s}.${o}`;
          } else if (p) {
            t = `>=${i}.0.0 <${+i + 1}.0.0`;
          } else if (c) {
            t = `>=${i}.${s}.0 <${i}.${+s + 1}.0`;
          }
          r('xRange return', t);
          return t;
        });
      }
      function replaceStars(e, t) {
        r('replaceStars', e, t);
        return e.trim().replace(o[X], '');
      }
      function hyphenReplace(e, t, r, n, i, s, o, a, u, p, c, d, l) {
        if (isX(r)) {
          t = '';
        } else if (isX(n)) {
          t = `>=${r}.0.0`;
        } else if (isX(i)) {
          t = `>=${r}.${n}.0`;
        } else {
          t = `>=${t}`;
        }
        if (isX(u)) {
          a = '';
        } else if (isX(p)) {
          a = `<${+u + 1}.0.0`;
        } else if (isX(c)) {
          a = `<${u}.${+p + 1}.0`;
        } else if (d) {
          a = `<=${u}.${p}.${c}-${d}`;
        } else {
          a = `<=${a}`;
        }
        return `${t} ${a}`.trim();
      }
      Range.prototype.test = function(e) {
        if (!e) {
          return false;
        }
        if (typeof e === 'string') {
          e = new SemVer(e, this.options);
        }
        for (let t = 0; t < this.set.length; t++) {
          if (testSet(this.set[t], e, this.options)) {
            return true;
          }
        }
        return false;
      };
      function testSet(e, t, n) {
        for (var i = 0; i < e.length; i++) {
          if (!e[i].test(t)) {
            return false;
          }
        }
        if (t.prerelease.length && !n.includePrerelease) {
          for (i = 0; i < e.length; i++) {
            r(e[i].semver);
            if (e[i].semver === Z) {
              continue;
            }
            if (e[i].semver.prerelease.length > 0) {
              const s = e[i].semver;
              if (
                s.major === t.major &&
                s.minor === t.minor &&
                s.patch === t.patch
              ) {
                return true;
              }
            }
          }
          return false;
        }
        return true;
      }
      t.satisfies = satisfies;
      function satisfies(e, t, r) {
        try {
          t = new Range(t, r);
        } catch (e) {
          return false;
        }
        return t.test(e);
      }
      t.maxSatisfying = maxSatisfying;
      function maxSatisfying(e, t, r) {
        let n = null;
        let i = null;
        try {
          var s = new Range(t, r);
        } catch (e) {
          return null;
        }
        e.forEach(function(e) {
          if (s.test(e)) {
            if (!n || i.compare(e) === -1) {
              n = e;
              i = new SemVer(n, r);
            }
          }
        });
        return n;
      }
      t.minSatisfying = minSatisfying;
      function minSatisfying(e, t, r) {
        let n = null;
        let i = null;
        try {
          var s = new Range(t, r);
        } catch (e) {
          return null;
        }
        e.forEach(function(e) {
          if (s.test(e)) {
            if (!n || i.compare(e) === 1) {
              n = e;
              i = new SemVer(n, r);
            }
          }
        });
        return n;
      }
      t.minVersion = minVersion;
      function minVersion(e, t) {
        e = new Range(e, t);
        let r = new SemVer('0.0.0');
        if (e.test(r)) {
          return r;
        }
        r = new SemVer('0.0.0-0');
        if (e.test(r)) {
          return r;
        }
        r = null;
        for (let n = 0; n < e.set.length; ++n) {
          const i = e.set[n];
          i.forEach(function(e) {
            const t = new SemVer(e.semver.version);
            switch (e.operator) {
              case '>':
                if (t.prerelease.length === 0) {
                  t.patch++;
                } else {
                  t.prerelease.push(0);
                }
                t.raw = t.format();
              case '':
              case '>=':
                if (!r || gt(r, t)) {
                  r = t;
                }
                break;
              case '<':
              case '<=':
                break;
              default:
                throw new Error(`Unexpected operation: ${e.operator}`);
            }
          });
        }
        if (r && e.test(r)) {
          return r;
        }
        return null;
      }
      t.validRange = validRange;
      function validRange(e, t) {
        try {
          return new Range(e, t).range || '*';
        } catch (e) {
          return null;
        }
      }
      t.ltr = ltr;
      function ltr(e, t, r) {
        return outside(e, t, '<', r);
      }
      t.gtr = gtr;
      function gtr(e, t, r) {
        return outside(e, t, '>', r);
      }
      t.outside = outside;
      function outside(e, t, r, n) {
        e = new SemVer(e, n);
        t = new Range(t, n);
        let i;
        let s;
        let o;
        let a;
        let u;
        switch (r) {
          case '>':
            i = gt;
            s = lte;
            o = lt;
            a = '>';
            u = '>=';
            break;
          case '<':
            i = lt;
            s = gte;
            o = gt;
            a = '<';
            u = '<=';
            break;
          default:
            throw new TypeError('Must provide a hilo val of "<" or ">"');
        }
        if (satisfies(e, t, n)) {
          return false;
        }
        for (let p = 0; p < t.set.length; ++p) {
          const c = t.set[p];
          var d = null;
          var l = null;
          c.forEach(function(e) {
            if (e.semver === Z) {
              e = new Comparator('>=0.0.0');
            }
            d = d || e;
            l = l || e;
            if (i(e.semver, d.semver, n)) {
              d = e;
            } else if (o(e.semver, l.semver, n)) {
              l = e;
            }
          });
          if (d.operator === a || d.operator === u) {
            return false;
          }
          if ((!l.operator || l.operator === a) && s(e, l.semver)) {
            return false;
          }
          if (l.operator === u && o(e, l.semver)) {
            return false;
          }
        }
        return true;
      }
      t.prerelease = prerelease;
      function prerelease(e, t) {
        const r = parse(e, t);
        return r && r.prerelease.length ? r.prerelease : null;
      }
      t.intersects = intersects;
      function intersects(e, t, r) {
        e = new Range(e, r);
        t = new Range(t, r);
        return e.intersects(t);
      }
      t.coerce = coerce;
      function coerce(e) {
        if (e instanceof SemVer) {
          return e;
        }
        if (typeof e !== 'string') {
          return null;
        }
        const t = e.match(o[x]);
        if (t == null) {
          return null;
        }
        return parse(`${t[1]}.${t[2] || '0'}.${t[3] || '0'}`);
      }
    },
    293(e, t, r) {
      e.exports = authenticationRequestError;
      const { RequestError: n } = r(463);
      function authenticationRequestError(e, t, r) {
        if (!t.headers) throw t;
        const i = /required/.test(t.headers['x-github-otp'] || '');
        if (t.status !== 401 || !i) {
          throw t;
        }
        if (
          t.status === 401 &&
          i &&
          t.request &&
          t.request.headers['x-github-otp']
        ) {
          if (e.otp) {
            delete e.otp;
          } else {
            throw new n(
              'Invalid one-time password for two-factor authentication',
              401,
              { headers: t.headers, request: r },
            );
          }
        }
        if (typeof e.auth.on2fa !== 'function') {
          throw new n(
            '2FA required, but options.on2fa is not a function. See https://github.com/octokit/rest.js#authentication',
            401,
            { headers: t.headers, request: r },
          );
        }
        return Promise.resolve()
          .then(() => e.auth.on2fa())
          .then(t => {
            const n = Object.assign(r, {
              headers: Object.assign(r.headers, { 'x-github-otp': t }),
            });
            return e.octokit.request(n).then(r => {
              e.otp = t;
              return r;
            });
          });
      }
    },
    294(e, t, r) {
      e.exports = parseOptions;
      const { Deprecation: n } = r(692);
      const { getUserAgent: i } = r(619);
      const s = r(969);
      const o = r(215);
      const a = s((e, t) => e.warn(t));
      const u = s((e, t) => e.warn(t));
      const p = s((e, t) => e.warn(t));
      function parseOptions(e, t, r) {
        if (e.headers) {
          e.headers = Object.keys(e.headers).reduce((t, r) => {
            t[r.toLowerCase()] = e.headers[r];
            return t;
          }, {});
        }
        const s = {
          headers: e.headers || {},
          request: e.request || {},
          mediaType: { previews: [], format: '' },
        };
        if (e.baseUrl) {
          s.baseUrl = e.baseUrl;
        }
        if (e.userAgent) {
          s.headers['user-agent'] = e.userAgent;
        }
        if (e.previews) {
          s.mediaType.previews = e.previews;
        }
        if (e.timeZone) {
          s.headers['time-zone'] = e.timeZone;
        }
        if (e.timeout) {
          a(
            t,
            new n(
              '[@octokit/rest] new Octokit({timeout}) is deprecated. Use {request: {timeout}} instead. See https://github.com/octokit/request.js#request',
            ),
          );
          s.request.timeout = e.timeout;
        }
        if (e.agent) {
          u(
            t,
            new n(
              '[@octokit/rest] new Octokit({agent}) is deprecated. Use {request: {agent}} instead. See https://github.com/octokit/request.js#request',
            ),
          );
          s.request.agent = e.agent;
        }
        if (e.headers) {
          p(
            t,
            new n(
              '[@octokit/rest] new Octokit({headers}) is deprecated. Use {userAgent, previews} instead. See https://github.com/octokit/request.js#request',
            ),
          );
        }
        const c = s.headers['user-agent'];
        const d = `octokit.js/${o.version} ${i()}`;
        s.headers['user-agent'] = [c, d].filter(Boolean).join(' ');
        s.request.hook = r.bind(null, 'request');
        return s;
      }
    },
    297(e) {
      e.exports = class HttpError extends Error {
        constructor(e, t, r) {
          super(e);
          if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
          }
          this.name = 'HttpError';
          this.code = t;
          this.headers = r;
        }
      };
    },
    301(e, t, r) {
      e.exports = normalizePaginatedListResponse;
      const { Deprecation: n } = r(692);
      const i = r(969);
      const s = i((e, t) => e.warn(t));
      const o = i((e, t) => e.warn(t));
      const a = i((e, t) => e.warn(t));
      const u = /^\/search\//;
      const p = /^\/repos\/[^\/]+\/[^\/]+\/commits\/[^\/]+\/(check-runs|check-suites)/;
      const c = /^\/installation\/repositories/;
      const d = /^\/user\/installations/;
      const l = /^\/orgs\/[^\/]+\/installations/;
      function normalizePaginatedListResponse(e, t, r) {
        const i = t.replace(e.request.endpoint.DEFAULTS.baseUrl, '');
        if (
          !u.test(i) &&
          !p.test(i) &&
          !c.test(i) &&
          !d.test(i) &&
          !l.test(i)
        ) {
          return;
        }
        const g = r.data.incomplete_results;
        const m = r.data.repository_selection;
        const h = r.data.total_count;
        delete r.data.incomplete_results;
        delete r.data.repository_selection;
        delete r.data.total_count;
        const y = Object.keys(r.data)[0];
        r.data = r.data[y];
        Object.defineProperty(r.data, y, {
          get() {
            a(
              e.log,
              new n(
                `[@octokit/rest] "result.data.${y}" is deprecated. Use "result.data" instead`,
              ),
            );
            return r.data;
          },
        });
        if (typeof g !== 'undefined') {
          Object.defineProperty(r.data, 'incomplete_results', {
            get() {
              s(
                e.log,
                new n(
                  '[@octokit/rest] "result.data.incomplete_results" is deprecated.',
                ),
              );
              return g;
            },
          });
        }
        if (typeof m !== 'undefined') {
          Object.defineProperty(r.data, 'repository_selection', {
            get() {
              o(
                e.log,
                new n(
                  '[@octokit/rest] "result.data.repository_selection" is deprecated.',
                ),
              );
              return m;
            },
          });
        }
        Object.defineProperty(r.data, 'total_count', {
          get() {
            o(
              e.log,
              new n('[@octokit/rest] "result.data.total_count" is deprecated.'),
            );
            return h;
          },
        });
      }
    },
    314(e) {
      e.exports = {
        _from: '@octokit/graphql@^2.0.1',
        _id: '@octokit/graphql@2.1.3',
        _inBundle: false,
        _integrity:
          'sha512-XoXJqL2ondwdnMIW3wtqJWEwcBfKk37jO/rYkoxNPEVeLBDGsGO1TCWggrAlq3keGt/O+C/7VepXnukUxwt5vA==',
        _location: '/@octokit/graphql',
        _phantomChildren: {},
        _requested: {
          type: 'range',
          registry: true,
          raw: '@octokit/graphql@^2.0.1',
          name: '@octokit/graphql',
          escapedName: '@octokit%2fgraphql',
          scope: '@octokit',
          rawSpec: '^2.0.1',
          saveSpec: null,
          fetchSpec: '^2.0.1',
        },
        _requiredBy: ['/@actions/github'],
        _resolved:
          'https://registry.npmjs.org/@octokit/graphql/-/graphql-2.1.3.tgz',
        _shasum: '60c058a0ed5fa242eca6f938908d95fd1a2f4b92',
        _spec: '@octokit/graphql@^2.0.1',
        _where:
          '/Users/quentinherzig/Documents/dev/epotek/.actions/epotek-project-automation/node_modules/@actions/github',
        author: { name: 'Gregor Martynus', url: 'https://github.com/gr2m' },
        bugs: { url: 'https://github.com/octokit/graphql.js/issues' },
        bundleDependencies: false,
        bundlesize: [
          { path: './dist/octokit-graphql.min.js.gz', maxSize: '5KB' },
        ],
        dependencies: {
          '@octokit/request': '^5.0.0',
          'universal-user-agent': '^2.0.3',
        },
        deprecated: false,
        description: 'GitHub GraphQL API client for browsers and Node',
        devDependencies: {
          chai: '^4.2.0',
          'compression-webpack-plugin': '^2.0.0',
          coveralls: '^3.0.3',
          cypress: '^3.1.5',
          'fetch-mock': '^7.3.1',
          mkdirp: '^0.5.1',
          mocha: '^6.0.0',
          'npm-run-all': '^4.1.3',
          nyc: '^14.0.0',
          'semantic-release': '^15.13.3',
          'simple-mock': '^0.8.0',
          standard: '^12.0.1',
          webpack: '^4.29.6',
          'webpack-bundle-analyzer': '^3.1.0',
          'webpack-cli': '^3.2.3',
        },
        files: ['lib'],
        homepage: 'https://github.com/octokit/graphql.js#readme',
        keywords: ['octokit', 'github', 'api', 'graphql'],
        license: 'MIT',
        main: 'index.js',
        name: '@octokit/graphql',
        publishConfig: { access: 'public' },
        release: {
          publish: [
            '@semantic-release/npm',
            {
              path: '@semantic-release/github',
              assets: ['dist/*', '!dist/*.map.gz'],
            },
          ],
        },
        repository: {
          type: 'git',
          url: 'git+https://github.com/octokit/graphql.js.git',
        },
        scripts: {
          build: 'npm-run-all build:*',
          'build:development':
            'webpack --mode development --entry . --output-library=octokitGraphql --output=./dist/octokit-graphql.js --profile --json > dist/bundle-stats.json',
          'build:production':
            'webpack --mode production --entry . --plugin=compression-webpack-plugin --output-library=octokitGraphql --output-path=./dist --output-filename=octokit-graphql.min.js --devtool source-map',
          'bundle-report':
            'webpack-bundle-analyzer dist/bundle-stats.json --mode=static --no-open --report dist/bundle-report.html',
          coverage: 'nyc report --reporter=html && open coverage/index.html',
          'coverage:upload': 'nyc report --reporter=text-lcov | coveralls',
          prebuild: 'mkdirp dist/',
          pretest: 'standard',
          test: 'nyc mocha test/*-test.js',
          'test:browser': 'cypress run --browser chrome',
        },
        standard: {
          globals: [
            'describe',
            'before',
            'beforeEach',
            'afterEach',
            'after',
            'it',
            'expect',
          ],
        },
        version: '2.1.3',
      };
    },
    323(e) {
      const t = (e.exports = function(e) {
        return (
          e !== null && typeof e === 'object' && typeof e.pipe === 'function'
        );
      });
      t.writable = function(e) {
        return (
          t(e) &&
          e.writable !== false &&
          typeof e._write === 'function' &&
          typeof e._writableState === 'object'
        );
      };
      t.readable = function(e) {
        return (
          t(e) &&
          e.readable !== false &&
          typeof e._read === 'function' &&
          typeof e._readableState === 'object'
        );
      };
      t.duplex = function(e) {
        return t.writable(e) && t.readable(e);
      };
      t.transform = function(e) {
        return (
          t.duplex(e) &&
          typeof e._transform === 'function' &&
          typeof e._transformState === 'object'
        );
      };
    },
    336(e, t, r) {
      e.exports = hasLastPage;
      const n = r(370);
      const i = r(577);
      function hasLastPage(e) {
        n(
          `octokit.hasLastPage() – You can use octokit.paginate or async iterators instead: https://github.com/octokit/rest.js#pagination.`,
        );
        return i(e).last;
      }
    },
    348(e, t, r) {
      e.exports = validate;
      const { RequestError: n } = r(463);
      const i = r(854);
      const s = r(883);
      function validate(e, t) {
        if (!t.request.validate) {
          return;
        }
        const { validate: r } = t.request;
        Object.keys(r).forEach(e => {
          const o = i(r, e);
          const a = o.type;
          let u;
          let p;
          let c = true;
          let d = false;
          if (/\./.test(e)) {
            u = e.replace(/\.[^.]+$/, '');
            d = u.slice(-2) === '[]';
            if (d) {
              u = u.slice(0, -2);
            }
            p = i(t, u);
            c = u === 'headers' || (typeof p === 'object' && p !== null);
          }
          const l = d
            ? (i(t, u) || []).map(t => t[e.split(/\./).pop()])
            : [i(t, e)];
          l.forEach((r, i) => {
            const u = typeof r !== 'undefined';
            const p = r === null;
            const l = d ? e.replace(/\[\]/, `[${i}]`) : e;
            if (!o.required && !u) {
              return;
            }
            if (!c) {
              return;
            }
            if (o.allowNull && p) {
              return;
            }
            if (!o.allowNull && p) {
              throw new n(`'${l}' cannot be null`, 400, { request: t });
            }
            if (o.required && !u) {
              throw new n(
                `Empty value for parameter '${l}': ${JSON.stringify(r)}`,
                400,
                { request: t },
              );
            }
            if (a === 'integer') {
              const e = r;
              r = parseInt(r, 10);
              if (isNaN(r)) {
                throw new n(
                  `Invalid value for parameter '${l}': ${JSON.stringify(
                    e,
                  )} is NaN`,
                  400,
                  { request: t },
                );
              }
            }
            if (o.enum && o.enum.indexOf(String(r)) === -1) {
              throw new n(
                `Invalid value for parameter '${l}': ${JSON.stringify(r)}`,
                400,
                { request: t },
              );
            }
            if (o.validation) {
              const e = new RegExp(o.validation);
              if (!e.test(r)) {
                throw new n(
                  `Invalid value for parameter '${l}': ${JSON.stringify(r)}`,
                  400,
                  { request: t },
                );
              }
            }
            if (a === 'object' && typeof r === 'string') {
              try {
                r = JSON.parse(r);
              } catch (e) {
                throw new n(
                  `JSON parse error of value for parameter '${l}': ${JSON.stringify(
                    r,
                  )}`,
                  400,
                  { request: t },
                );
              }
            }
            s(t, o.mapTo || l, r);
          });
        });
        return t;
      }
    },
    349(e, t, r) {
      e.exports = authenticationRequestError;
      const { RequestError: n } = r(463);
      function authenticationRequestError(e, t, r) {
        if (!t.headers) throw t;
        const i = /required/.test(t.headers['x-github-otp'] || '');
        if (t.status !== 401 || !i) {
          throw t;
        }
        if (
          t.status === 401 &&
          i &&
          t.request &&
          t.request.headers['x-github-otp']
        ) {
          throw new n(
            'Invalid one-time password for two-factor authentication',
            401,
            { headers: t.headers, request: r },
          );
        }
        if (typeof e.auth.on2fa !== 'function') {
          throw new n(
            '2FA required, but options.on2fa is not a function. See https://github.com/octokit/rest.js#authentication',
            401,
            { headers: t.headers, request: r },
          );
        }
        return Promise.resolve()
          .then(() => e.auth.on2fa())
          .then(t => {
            const n = Object.assign(r, {
              headers: { 'x-github-otp': t, ...r.headers },
            });
            return e.octokit.request(n);
          });
      }
    },
    357(e) {
      e.exports = require('assert');
    },
    363(e) {
      e.exports = register;
      function register(e, t, r, n) {
        if (typeof r !== 'function') {
          throw new Error('method for before hook must be a function');
        }
        if (!n) {
          n = {};
        }
        if (Array.isArray(t)) {
          return t.reverse().reduce(function(t, r) {
            return register.bind(null, e, r, t, n);
          }, r)();
        }
        return Promise.resolve().then(function() {
          if (!e.registry[t]) {
            return r(n);
          }
          return e.registry[t].reduce(function(e, t) {
            return t.hook.bind(null, e, n);
          }, r)();
        });
      }
    },
    368(e) {
      e.exports = function atob(e) {
        return Buffer.from(e, 'base64').toString('binary');
      };
    },
    370(e) {
      e.exports = deprecate;
      const t = {};
      function deprecate(e) {
        if (t[e]) {
          return;
        }
        console.warn(`DEPRECATED (@octokit/rest): ${e}`);
        t[e] = 1;
      }
    },
    372(e) {
      e.exports = octokitDebug;
      function octokitDebug(e) {
        e.hook.wrap('request', (t, r) => {
          e.log.debug('request', r);
          const n = Date.now();
          const i = e.request.endpoint.parse(r);
          const s = i.url.replace(r.baseUrl, '');
          return t(r)
            .then(t => {
              e.log.info(
                `${i.method} ${s} - ${t.status} in ${Date.now() - n}ms`,
              );
              return t;
            })
            .catch(t => {
              e.log.info(
                `${i.method} ${s} - ${t.status} in ${Date.now() - n}ms`,
              );
              throw t;
            });
        });
      }
    },
    385(e, t, r) {
      Object.defineProperty(t, '__esModule', { value: true });
      function _interopDefault(e) {
        return e && typeof e === 'object' && 'default' in e ? e.default : e;
      }
      const n = _interopDefault(r(696));
      const i = r(562);
      function lowercaseKeys(e) {
        if (!e) {
          return {};
        }
        return Object.keys(e).reduce((t, r) => {
          t[r.toLowerCase()] = e[r];
          return t;
        }, {});
      }
      function mergeDeep(e, t) {
        const r = { ...e };
        Object.keys(t).forEach(i => {
          if (n(t[i])) {
            if (!(i in e)) Object.assign(r, { [i]: t[i] });
            else r[i] = mergeDeep(e[i], t[i]);
          } else {
            Object.assign(r, { [i]: t[i] });
          }
        });
        return r;
      }
      function merge(e, t, r) {
        if (typeof t === 'string') {
          const [e, n] = t.split(' ');
          r = Object.assign(n ? { method: e, url: n } : { url: e }, r);
        } else {
          r = { ...t };
        }
        r.headers = lowercaseKeys(r.headers);
        const n = mergeDeep(e || {}, r);
        if (e && e.mediaType.previews.length) {
          n.mediaType.previews = e.mediaType.previews
            .filter(e => !n.mediaType.previews.includes(e))
            .concat(n.mediaType.previews);
        }
        n.mediaType.previews = n.mediaType.previews.map(e =>
          e.replace(/-preview/, ''),
        );
        return n;
      }
      function addQueryParameters(e, t) {
        const r = /\?/.test(e) ? '&' : '?';
        const n = Object.keys(t);
        if (n.length === 0) {
          return e;
        }
        return (
          e +
          r +
          n
            .map(e => {
              if (e === 'q') {
                return `q=${t.q
                  .split('+')
                  .map(encodeURIComponent)
                  .join('+')}`;
              }
              return `${e}=${encodeURIComponent(t[e])}`;
            })
            .join('&')
        );
      }
      const s = /\{[^}]+\}/g;
      function removeNonChars(e) {
        return e.replace(/^\W+|\W+$/g, '').split(/,/);
      }
      function extractUrlVariableNames(e) {
        const t = e.match(s);
        if (!t) {
          return [];
        }
        return t.map(removeNonChars).reduce((e, t) => e.concat(t), []);
      }
      function omit(e, t) {
        return Object.keys(e)
          .filter(e => !t.includes(e))
          .reduce((t, r) => {
            t[r] = e[r];
            return t;
          }, {});
      }
      function encodeReserved(e) {
        return e
          .split(/(%[0-9A-Fa-f]{2})/g)
          .map(function(e) {
            if (!/%[0-9A-Fa-f]/.test(e)) {
              e = encodeURI(e)
                .replace(/%5B/g, '[')
                .replace(/%5D/g, ']');
            }
            return e;
          })
          .join('');
      }
      function encodeUnreserved(e) {
        return encodeURIComponent(e).replace(/[!'()*]/g, function(e) {
          return `%${e
            .charCodeAt(0)
            .toString(16)
            .toUpperCase()}`;
        });
      }
      function encodeValue(e, t, r) {
        t = e === '+' || e === '#' ? encodeReserved(t) : encodeUnreserved(t);
        if (r) {
          return `${encodeUnreserved(r)}=${t}`;
        }
        return t;
      }
      function isDefined(e) {
        return e !== undefined && e !== null;
      }
      function isKeyOperator(e) {
        return e === ';' || e === '&' || e === '?';
      }
      function getValues(e, t, r, n) {
        let i = e[r];
        const s = [];
        if (isDefined(i) && i !== '') {
          if (
            typeof i === 'string' ||
            typeof i === 'number' ||
            typeof i === 'boolean'
          ) {
            i = i.toString();
            if (n && n !== '*') {
              i = i.substring(0, parseInt(n, 10));
            }
            s.push(encodeValue(t, i, isKeyOperator(t) ? r : ''));
          } else if (n === '*') {
            if (Array.isArray(i)) {
              i.filter(isDefined).forEach(function(e) {
                s.push(encodeValue(t, e, isKeyOperator(t) ? r : ''));
              });
            } else {
              Object.keys(i).forEach(function(e) {
                if (isDefined(i[e])) {
                  s.push(encodeValue(t, i[e], e));
                }
              });
            }
          } else {
            const e = [];
            if (Array.isArray(i)) {
              i.filter(isDefined).forEach(function(r) {
                e.push(encodeValue(t, r));
              });
            } else {
              Object.keys(i).forEach(function(r) {
                if (isDefined(i[r])) {
                  e.push(encodeUnreserved(r));
                  e.push(encodeValue(t, i[r].toString()));
                }
              });
            }
            if (isKeyOperator(t)) {
              s.push(`${encodeUnreserved(r)}=${e.join(',')}`);
            } else if (e.length !== 0) {
              s.push(e.join(','));
            }
          }
        } else if (t === ';') {
          if (isDefined(i)) {
            s.push(encodeUnreserved(r));
          }
        } else if (i === '' && (t === '&' || t === '?')) {
          s.push(`${encodeUnreserved(r)}=`);
        } else if (i === '') {
          s.push('');
        }
        return s;
      }
      function parseUrl(e) {
        return { expand: expand.bind(null, e) };
      }
      function expand(e, t) {
        const r = ['+', '#', '.', '/', ';', '?', '&'];
        return e.replace(/\{([^\{\}]+)\}|([^\{\}]+)/g, function(e, n, i) {
          if (n) {
            let e = '';
            const i = [];
            if (r.indexOf(n.charAt(0)) !== -1) {
              e = n.charAt(0);
              n = n.substr(1);
            }
            n.split(/,/g).forEach(function(r) {
              const n = /([^:\*]*)(?::(\d+)|(\*))?/.exec(r);
              i.push(getValues(t, e, n[1], n[2] || n[3]));
            });
            if (e && e !== '+') {
              let s = ',';
              if (e === '?') {
                s = '&';
              } else if (e !== '#') {
                s = e;
              }
              return (i.length !== 0 ? e : '') + i.join(s);
            }
            return i.join(',');
          }
          return encodeReserved(i);
        });
      }
      function parse(e) {
        const t = e.method.toUpperCase();
        let r = (e.url || '/').replace(/:([a-z]\w+)/g, '{+$1}');
        const n = { ...e.headers };
        let i;
        const s = omit(e, [
          'method',
          'baseUrl',
          'url',
          'headers',
          'request',
          'mediaType',
        ]);
        const o = extractUrlVariableNames(r);
        r = parseUrl(r).expand(s);
        if (!/^http/.test(r)) {
          r = e.baseUrl + r;
        }
        const a = Object.keys(e)
          .filter(e => o.includes(e))
          .concat('baseUrl');
        const u = omit(s, a);
        const p = /application\/octet-stream/i.test(n.accept);
        if (!p) {
          if (e.mediaType.format) {
            n.accept = n.accept
              .split(/,/)
              .map(t =>
                t.replace(
                  /application\/vnd(\.\w+)(\.v3)?(\.\w+)?(\+json)?$/,
                  `application/vnd$1$2.${e.mediaType.format}`,
                ),
              )
              .join(',');
          }
          if (e.mediaType.previews.length) {
            const t = n.accept.match(/[\w-]+(?=-preview)/g) || [];
            n.accept = t
              .concat(e.mediaType.previews)
              .map(t => {
                const r = e.mediaType.format
                  ? `.${e.mediaType.format}`
                  : '+json';
                return `application/vnd.github.${t}-preview${r}`;
              })
              .join(',');
          }
        }
        if (['GET', 'HEAD'].includes(t)) {
          r = addQueryParameters(r, u);
        } else if ('data' in u) {
          i = u.data;
        } else if (Object.keys(u).length) {
          i = u;
        } else {
          n['content-length'] = 0;
        }
        if (!n['content-type'] && typeof i !== 'undefined') {
          n['content-type'] = 'application/json; charset=utf-8';
        }
        if (['PATCH', 'PUT'].includes(t) && typeof i === 'undefined') {
          i = '';
        }
        return {
          method: t,
          url: r,
          headers: n,
          ...(typeof i !== 'undefined' ? { body: i } : null),
          ...(e.request ? { request: e.request } : null),
        };
      }
      function endpointWithDefaults(e, t, r) {
        return parse(merge(e, t, r));
      }
      function withDefaults(e, t) {
        const r = merge(e, t);
        const n = endpointWithDefaults.bind(null, r);
        return Object.assign(n, {
          DEFAULTS: r,
          defaults: withDefaults.bind(null, r),
          merge: merge.bind(null, r),
          parse,
        });
      }
      const o = '5.5.1';
      const a = `octokit-endpoint.js/${o} ${i.getUserAgent()}`;
      const u = {
        method: 'GET',
        baseUrl: 'https://api.github.com',
        headers: { accept: 'application/vnd.github.v3+json', 'user-agent': a },
        mediaType: { format: '', previews: [] },
      };
      const p = withDefaults(null, u);
      t.endpoint = p;
    },
    389(e, t, r) {
      const n = r(747);
      const i = r(866);
      function readShebang(e) {
        const t = 150;
        let r;
        if (Buffer.alloc) {
          r = Buffer.alloc(t);
        } else {
          r = new Buffer(t);
          r.fill(0);
        }
        let s;
        try {
          s = n.openSync(e, 'r');
          n.readSync(s, r, 0, t, 0);
          n.closeSync(s);
        } catch (e) {}
        return i(r.toString());
      }
      e.exports = readShebang;
    },
    402(e, t, r) {
      e.exports = Octokit;
      const { request: n } = r(753);
      const i = r(523);
      const s = r(294);
      function Octokit(e, t) {
        t = t || {};
        const r = new i.Collection();
        const o = {
          debug: () => {},
          info: () => {},
          warn: console.warn,
          error: console.error,
          ...(t && t.log),
        };
        const a = { hook: r, log: o, request: n.defaults(s(t, o, r)) };
        e.forEach(e => e(a, t));
        return a;
      }
    },
    413(e) {
      e.exports = require('stream');
    },
    427(e, t, r) {
      const n = r(669);
      let i;
      if (typeof n.getSystemErrorName === 'function') {
        e.exports = n.getSystemErrorName;
      } else {
        try {
          i = process.binding('uv');
          if (typeof i.errname !== 'function') {
            throw new TypeError('uv.errname is not a function');
          }
        } catch (e) {
          console.error(
            "execa/lib/errname: unable to establish process.binding('uv')",
            e,
          );
          i = null;
        }
        e.exports = e => errname(i, e);
      }
      e.exports.__test__ = errname;
      function errname(e, t) {
        if (e) {
          return e.errname(t);
        }
        if (!(t < 0)) {
          throw new Error('err >= 0');
        }
        return `Unknown system error ${t}`;
      }
    },
    430(e, t, r) {
      e.exports = octokitValidate;
      const n = r(348);
      function octokitValidate(e) {
        e.hook.before('request', n.bind(null, e));
      }
    },
    431(e, t, r) {
      Object.defineProperty(t, '__esModule', { value: true });
      const n = r(87);
      function issueCommand(e, t, r) {
        const i = new Command(e, t, r);
        process.stdout.write(i.toString() + n.EOL);
      }
      t.issueCommand = issueCommand;
      function issue(e, t = '') {
        issueCommand(e, {}, t);
      }
      t.issue = issue;
      const i = '::';
      class Command {
        constructor(e, t, r) {
          if (!e) {
            e = 'missing.command';
          }
          this.command = e;
          this.properties = t;
          this.message = r;
        }

        toString() {
          let e = i + this.command;
          if (this.properties && Object.keys(this.properties).length > 0) {
            e += ' ';
            for (const t in this.properties) {
              if (this.properties.hasOwnProperty(t)) {
                const r = this.properties[t];
                if (r) {
                  e += `${t}=${escape(`${r || ''}`)},`;
                }
              }
            }
          }
          e += i;
          const t = `${this.message || ''}`;
          e += escapeData(t);
          return e;
        }
      }
      function escapeData(e) {
        return e.replace(/\r/g, '%0D').replace(/\n/g, '%0A');
      }
      function escape(e) {
        return e
          .replace(/\r/g, '%0D')
          .replace(/\n/g, '%0A')
          .replace(/]/g, '%5D')
          .replace(/;/g, '%3B');
      }
    },
    453(e, t, r) {
      const n = r(969);
      const i = r(9);
      const s = r(747);
      const o = function() {};
      const a = /^v?\.0/.test(process.version);
      const u = function(e) {
        return typeof e === 'function';
      };
      const p = function(e) {
        if (!a) return false;
        if (!s) return false;
        return (
          (e instanceof (s.ReadStream || o) ||
            e instanceof (s.WriteStream || o)) &&
          u(e.close)
        );
      };
      const c = function(e) {
        return e.setHeader && u(e.abort);
      };
      const d = function(e, t, r, s) {
        s = n(s);
        let a = false;
        e.on('close', function() {
          a = true;
        });
        i(e, { readable: t, writable: r }, function(e) {
          if (e) return s(e);
          a = true;
          s();
        });
        let d = false;
        return function(t) {
          if (a) return;
          if (d) return;
          d = true;
          if (p(e)) return e.close(o);
          if (c(e)) return e.abort();
          if (u(e.destroy)) return e.destroy();
          s(t || new Error('stream was destroyed'));
        };
      };
      const l = function(e) {
        e();
      };
      const g = function(e, t) {
        return e.pipe(t);
      };
      const m = function() {
        let e = Array.prototype.slice.call(arguments);
        const t = (u(e[e.length - 1] || o) && e.pop()) || o;
        if (Array.isArray(e[0])) e = e[0];
        if (e.length < 2) {
          throw new Error('pump requires two streams per minimum');
        }
        let r;
        var n = e.map(function(i, s) {
          const o = s < e.length - 1;
          const a = s > 0;
          return d(i, o, a, function(e) {
            if (!r) r = e;
            if (e) n.forEach(l);
            if (o) return;
            n.forEach(l);
            t(r);
          });
        });
        return e.reduce(g);
      };
      e.exports = m;
    },
    454(e, t, r) {
      Object.defineProperty(t, '__esModule', { value: true });
      function _interopDefault(e) {
        return e && typeof e === 'object' && 'default' in e ? e.default : e;
      }
      const n = _interopDefault(r(413));
      const i = _interopDefault(r(605));
      const s = _interopDefault(r(835));
      const o = _interopDefault(r(34));
      const a = _interopDefault(r(761));
      const u = n.Readable;
      const p = Symbol('buffer');
      const c = Symbol('type');
      class Blob {
        constructor() {
          this[c] = '';
          const e = arguments[0];
          const t = arguments[1];
          const r = [];
          let n = 0;
          if (e) {
            const t = e;
            const i = Number(t.length);
            for (let e = 0; e < i; e++) {
              const i = t[e];
              let s;
              if (i instanceof Buffer) {
                s = i;
              } else if (ArrayBuffer.isView(i)) {
                s = Buffer.from(i.buffer, i.byteOffset, i.byteLength);
              } else if (i instanceof ArrayBuffer) {
                s = Buffer.from(i);
              } else if (i instanceof Blob) {
                s = i[p];
              } else {
                s = Buffer.from(typeof i === 'string' ? i : String(i));
              }
              n += s.length;
              r.push(s);
            }
          }
          this[p] = Buffer.concat(r);
          const i = t && t.type !== undefined && String(t.type).toLowerCase();
          if (i && !/[^\u0020-\u007E]/.test(i)) {
            this[c] = i;
          }
        }

        get size() {
          return this[p].length;
        }

        get type() {
          return this[c];
        }

        text() {
          return Promise.resolve(this[p].toString());
        }

        arrayBuffer() {
          const e = this[p];
          const t = e.buffer.slice(e.byteOffset, e.byteOffset + e.byteLength);
          return Promise.resolve(t);
        }

        stream() {
          const e = new u();
          e._read = function() {};
          e.push(this[p]);
          e.push(null);
          return e;
        }

        toString() {
          return '[object Blob]';
        }

        slice() {
          const e = this.size;
          const t = arguments[0];
          const r = arguments[1];
          let n;
          let i;
          if (t === undefined) {
            n = 0;
          } else if (t < 0) {
            n = Math.max(e + t, 0);
          } else {
            n = Math.min(t, e);
          }
          if (r === undefined) {
            i = e;
          } else if (r < 0) {
            i = Math.max(e + r, 0);
          } else {
            i = Math.min(r, e);
          }
          const s = Math.max(i - n, 0);
          const o = this[p];
          const a = o.slice(n, n + s);
          const u = new Blob([], { type: arguments[2] });
          u[p] = a;
          return u;
        }
      }
      Object.defineProperties(Blob.prototype, {
        size: { enumerable: true },
        type: { enumerable: true },
        slice: { enumerable: true },
      });
      Object.defineProperty(Blob.prototype, Symbol.toStringTag, {
        value: 'Blob',
        writable: false,
        enumerable: false,
        configurable: true,
      });
      function FetchError(e, t, r) {
        Error.call(this, e);
        this.message = e;
        this.type = t;
        if (r) {
          this.code = this.errno = r.code;
        }
        Error.captureStackTrace(this, this.constructor);
      }
      FetchError.prototype = Object.create(Error.prototype);
      FetchError.prototype.constructor = FetchError;
      FetchError.prototype.name = 'FetchError';
      let d;
      try {
        d = r(18).convert;
      } catch (e) {}
      const l = Symbol('Body internals');
      const g = n.PassThrough;
      function Body(e) {
        const t = this;
        const r =
          arguments.length > 1 && arguments[1] !== undefined
            ? arguments[1]
            : {};
        const i = r.size;
        const s = i === undefined ? 0 : i;
        const o = r.timeout;
        const a = o === undefined ? 0 : o;
        if (e == null) {
          e = null;
        } else if (isURLSearchParams(e)) {
          e = Buffer.from(e.toString());
        } else if (isBlob(e));
        else if (Buffer.isBuffer(e));
        else if (Object.prototype.toString.call(e) === '[object ArrayBuffer]') {
          e = Buffer.from(e);
        } else if (ArrayBuffer.isView(e)) {
          e = Buffer.from(e.buffer, e.byteOffset, e.byteLength);
        } else if (e instanceof n);
        else {
          e = Buffer.from(String(e));
        }
        this[l] = { body: e, disturbed: false, error: null };
        this.size = s;
        this.timeout = a;
        if (e instanceof n) {
          e.on('error', function(e) {
            const r =
              e.name === 'AbortError'
                ? e
                : new FetchError(
                    `Invalid response body while trying to fetch ${t.url}: ${e.message}`,
                    'system',
                    e,
                  );
            t[l].error = r;
          });
        }
      }
      Body.prototype = {
        get body() {
          return this[l].body;
        },
        get bodyUsed() {
          return this[l].disturbed;
        },
        arrayBuffer() {
          return consumeBody.call(this).then(function(e) {
            return e.buffer.slice(e.byteOffset, e.byteOffset + e.byteLength);
          });
        },
        blob() {
          const e = (this.headers && this.headers.get('content-type')) || '';
          return consumeBody.call(this).then(function(t) {
            return Object.assign(new Blob([], { type: e.toLowerCase() }), {
              [p]: t,
            });
          });
        },
        json() {
          const e = this;
          return consumeBody.call(this).then(function(t) {
            try {
              return JSON.parse(t.toString());
            } catch (t) {
              return Body.Promise.reject(
                new FetchError(
                  `invalid json response body at ${e.url} reason: ${t.message}`,
                  'invalid-json',
                ),
              );
            }
          });
        },
        text() {
          return consumeBody.call(this).then(function(e) {
            return e.toString();
          });
        },
        buffer() {
          return consumeBody.call(this);
        },
        textConverted() {
          const e = this;
          return consumeBody.call(this).then(function(t) {
            return convertBody(t, e.headers);
          });
        },
      };
      Object.defineProperties(Body.prototype, {
        body: { enumerable: true },
        bodyUsed: { enumerable: true },
        arrayBuffer: { enumerable: true },
        blob: { enumerable: true },
        json: { enumerable: true },
        text: { enumerable: true },
      });
      Body.mixIn = function(e) {
        for (const t of Object.getOwnPropertyNames(Body.prototype)) {
          if (!(t in e)) {
            const r = Object.getOwnPropertyDescriptor(Body.prototype, t);
            Object.defineProperty(e, t, r);
          }
        }
      };
      function consumeBody() {
        const e = this;
        if (this[l].disturbed) {
          return Body.Promise.reject(
            new TypeError(`body used already for: ${this.url}`),
          );
        }
        this[l].disturbed = true;
        if (this[l].error) {
          return Body.Promise.reject(this[l].error);
        }
        let t = this.body;
        if (t === null) {
          return Body.Promise.resolve(Buffer.alloc(0));
        }
        if (isBlob(t)) {
          t = t.stream();
        }
        if (Buffer.isBuffer(t)) {
          return Body.Promise.resolve(t);
        }
        if (!(t instanceof n)) {
          return Body.Promise.resolve(Buffer.alloc(0));
        }
        const r = [];
        let i = 0;
        let s = false;
        return new Body.Promise(function(n, o) {
          let a;
          if (e.timeout) {
            a = setTimeout(function() {
              s = true;
              o(
                new FetchError(
                  `Response timeout while trying to fetch ${e.url} (over ${e.timeout}ms)`,
                  'body-timeout',
                ),
              );
            }, e.timeout);
          }
          t.on('error', function(t) {
            if (t.name === 'AbortError') {
              s = true;
              o(t);
            } else {
              o(
                new FetchError(
                  `Invalid response body while trying to fetch ${e.url}: ${t.message}`,
                  'system',
                  t,
                ),
              );
            }
          });
          t.on('data', function(t) {
            if (s || t === null) {
              return;
            }
            if (e.size && i + t.length > e.size) {
              s = true;
              o(
                new FetchError(
                  `content size at ${e.url} over limit: ${e.size}`,
                  'max-size',
                ),
              );
              return;
            }
            i += t.length;
            r.push(t);
          });
          t.on('end', function() {
            if (s) {
              return;
            }
            clearTimeout(a);
            try {
              n(Buffer.concat(r, i));
            } catch (t) {
              o(
                new FetchError(
                  `Could not create Buffer from response body for ${e.url}: ${t.message}`,
                  'system',
                  t,
                ),
              );
            }
          });
        });
      }
      function convertBody(e, t) {
        if (typeof d !== 'function') {
          throw new Error(
            'The package `encoding` must be installed to use the textConverted() function',
          );
        }
        const r = t.get('content-type');
        let n = 'utf-8';
        let i;
        let s;
        if (r) {
          i = /charset=([^;]*)/i.exec(r);
        }
        s = e.slice(0, 1024).toString();
        if (!i && s) {
          i = /<meta.+?charset=(['"])(.+?)\1/i.exec(s);
        }
        if (!i && s) {
          i = /<meta[\s]+?http-equiv=(['"])content-type\1[\s]+?content=(['"])(.+?)\2/i.exec(
            s,
          );
          if (i) {
            i = /charset=(.*)/i.exec(i.pop());
          }
        }
        if (!i && s) {
          i = /<\?xml.+?encoding=(['"])(.+?)\1/i.exec(s);
        }
        if (i) {
          n = i.pop();
          if (n === 'gb2312' || n === 'gbk') {
            n = 'gb18030';
          }
        }
        return d(e, 'UTF-8', n).toString();
      }
      function isURLSearchParams(e) {
        if (
          typeof e !== 'object' ||
          typeof e.append !== 'function' ||
          typeof e.delete !== 'function' ||
          typeof e.get !== 'function' ||
          typeof e.getAll !== 'function' ||
          typeof e.has !== 'function' ||
          typeof e.set !== 'function'
        ) {
          return false;
        }
        return (
          e.constructor.name === 'URLSearchParams' ||
          Object.prototype.toString.call(e) === '[object URLSearchParams]' ||
          typeof e.sort === 'function'
        );
      }
      function isBlob(e) {
        return (
          typeof e === 'object' &&
          typeof e.arrayBuffer === 'function' &&
          typeof e.type === 'string' &&
          typeof e.stream === 'function' &&
          typeof e.constructor === 'function' &&
          typeof e.constructor.name === 'string' &&
          /^(Blob|File)$/.test(e.constructor.name) &&
          /^(Blob|File)$/.test(e[Symbol.toStringTag])
        );
      }
      function clone(e) {
        let t;
        let r;
        let i = e.body;
        if (e.bodyUsed) {
          throw new Error('cannot clone body after it is used');
        }
        if (i instanceof n && typeof i.getBoundary !== 'function') {
          t = new g();
          r = new g();
          i.pipe(t);
          i.pipe(r);
          e[l].body = t;
          i = r;
        }
        return i;
      }
      function extractContentType(e) {
        if (e === null) {
          return null;
        } if (typeof e === 'string') {
          return 'text/plain;charset=UTF-8';
        } if (isURLSearchParams(e)) {
          return 'application/x-www-form-urlencoded;charset=UTF-8';
        } if (isBlob(e)) {
          return e.type || null;
        } if (Buffer.isBuffer(e)) {
          return null;
        } if (
          Object.prototype.toString.call(e) === '[object ArrayBuffer]'
        ) {
          return null;
        } if (ArrayBuffer.isView(e)) {
          return null;
        } if (typeof e.getBoundary === 'function') {
          return `multipart/form-data;boundary=${e.getBoundary()}`;
        } if (e instanceof n) {
          return null;
        } else {
          return 'text/plain;charset=UTF-8';
        }
      }
      function getTotalBytes(e) {
        const t = e.body;
        if (t === null) {
          return 0;
        }
        if (isBlob(t)) {
          return t.size;
        }
        if (Buffer.isBuffer(t)) {
          return t.length;
        }
        if (t && typeof t.getLengthSync === 'function') {
          if (
            (t._lengthRetrievers && t._lengthRetrievers.length == 0) ||
            (t.hasKnownLength && t.hasKnownLength())
          ) {
            return t.getLengthSync();
          }
          return null;
        }
        return null;
      }
      function writeToStream(e, t) {
        const r = t.body;
        if (r === null) {
          e.end();
        } else if (isBlob(r)) {
          r.stream().pipe(e);
        } else if (Buffer.isBuffer(r)) {
          e.write(r);
          e.end();
        } else {
          r.pipe(e);
        }
      }
      Body.Promise = global.Promise;
      const m = /[^\^_`a-zA-Z\-0-9!#$%&'*+.|~]/;
      const h = /[^\t\x20-\x7e\x80-\xff]/;
      function validateName(e) {
        e = `${e}`;
        if (m.test(e) || e === '') {
          throw new TypeError(`${e} is not a legal HTTP header name`);
        }
      }
      function validateValue(e) {
        e = `${e}`;
        if (h.test(e)) {
          throw new TypeError(`${e} is not a legal HTTP header value`);
        }
      }
      function find(e, t) {
        t = t.toLowerCase();
        for (const r in e) {
          if (r.toLowerCase() === t) {
            return r;
          }
        }
        return undefined;
      }
      const y = Symbol('map');
      class Headers {
        constructor() {
          const e =
            arguments.length > 0 && arguments[0] !== undefined
              ? arguments[0]
              : undefined;
          this[y] = Object.create(null);
          if (e instanceof Headers) {
            const t = e.raw();
            const r = Object.keys(t);
            for (const e of r) {
              for (const r of t[e]) {
                this.append(e, r);
              }
            }
            return;
          }
          if (e == null);
          else if (typeof e === 'object') {
            const t = e[Symbol.iterator];
            if (t != null) {
              if (typeof t !== 'function') {
                throw new TypeError('Header pairs must be iterable');
              }
              const r = [];
              for (const t of e) {
                if (
                  typeof t !== 'object' ||
                  typeof t[Symbol.iterator] !== 'function'
                ) {
                  throw new TypeError('Each header pair must be iterable');
                }
                r.push(Array.from(t));
              }
              for (const e of r) {
                if (e.length !== 2) {
                  throw new TypeError(
                    'Each header pair must be a name/value tuple',
                  );
                }
                this.append(e[0], e[1]);
              }
            } else {
              for (const t of Object.keys(e)) {
                const r = e[t];
                this.append(t, r);
              }
            }
          } else {
            throw new TypeError('Provided initializer must be an object');
          }
        }

        get(e) {
          e = `${e}`;
          validateName(e);
          const t = find(this[y], e);
          if (t === undefined) {
            return null;
          }
          return this[y][t].join(', ');
        }

        forEach(e) {
          const t =
            arguments.length > 1 && arguments[1] !== undefined
              ? arguments[1]
              : undefined;
          let r = getHeaders(this);
          let n = 0;
          while (n < r.length) {
            const i = r[n];
            const s = i[0];
            const o = i[1];
            e.call(t, o, s, this);
            r = getHeaders(this);
            n++;
          }
        }

        set(e, t) {
          e = `${e}`;
          t = `${t}`;
          validateName(e);
          validateValue(t);
          const r = find(this[y], e);
          this[y][r !== undefined ? r : e] = [t];
        }

        append(e, t) {
          e = `${e}`;
          t = `${t}`;
          validateName(e);
          validateValue(t);
          const r = find(this[y], e);
          if (r !== undefined) {
            this[y][r].push(t);
          } else {
            this[y][e] = [t];
          }
        }

        has(e) {
          e = `${e}`;
          validateName(e);
          return find(this[y], e) !== undefined;
        }

        delete(e) {
          e = `${e}`;
          validateName(e);
          const t = find(this[y], e);
          if (t !== undefined) {
            delete this[y][t];
          }
        }

        raw() {
          return this[y];
        }

        keys() {
          return createHeadersIterator(this, 'key');
        }

        values() {
          return createHeadersIterator(this, 'value');
        }

        [Symbol.iterator]() {
          return createHeadersIterator(this, 'key+value');
        }
      }
      Headers.prototype.entries = Headers.prototype[Symbol.iterator];
      Object.defineProperty(Headers.prototype, Symbol.toStringTag, {
        value: 'Headers',
        writable: false,
        enumerable: false,
        configurable: true,
      });
      Object.defineProperties(Headers.prototype, {
        get: { enumerable: true },
        forEach: { enumerable: true },
        set: { enumerable: true },
        append: { enumerable: true },
        has: { enumerable: true },
        delete: { enumerable: true },
        keys: { enumerable: true },
        values: { enumerable: true },
        entries: { enumerable: true },
      });
      function getHeaders(e) {
        const t =
          arguments.length > 1 && arguments[1] !== undefined
            ? arguments[1]
            : 'key+value';
        const r = Object.keys(e[y]).sort();
        return r.map(
          t === 'key'
            ? function(e) {
                return e.toLowerCase();
              }
            : t === 'value'
            ? function(t) {
                return e[y][t].join(', ');
              }
            : function(t) {
                return [t.toLowerCase(), e[y][t].join(', ')];
              },
        );
      }
      const f = Symbol('internal');
      function createHeadersIterator(e, t) {
        const r = Object.create(b);
        r[f] = { target: e, kind: t, index: 0 };
        return r;
      }
      const b = Object.setPrototypeOf(
        {
          next() {
            if (!this || Object.getPrototypeOf(this) !== b) {
              throw new TypeError('Value of `this` is not a HeadersIterator');
            }
            const e = this[f];
            const t = e.target;
            const r = e.kind;
            const n = e.index;
            const i = getHeaders(t, r);
            const s = i.length;
            if (n >= s) {
              return { value: undefined, done: true };
            }
            this[f].index = n + 1;
            return { value: i[n], done: false };
          },
        },
        Object.getPrototypeOf(Object.getPrototypeOf([][Symbol.iterator]())),
      );
      Object.defineProperty(b, Symbol.toStringTag, {
        value: 'HeadersIterator',
        writable: false,
        enumerable: false,
        configurable: true,
      });
      function exportNodeCompatibleHeaders(e) {
        const t = { __proto__: null, ...e[y] };
        const r = find(e[y], 'Host');
        if (r !== undefined) {
          t[r] = t[r][0];
        }
        return t;
      }
      function createHeadersLenient(e) {
        const t = new Headers();
        for (const r of Object.keys(e)) {
          if (m.test(r)) {
            continue;
          }
          if (Array.isArray(e[r])) {
            for (const n of e[r]) {
              if (h.test(n)) {
                continue;
              }
              if (t[y][r] === undefined) {
                t[y][r] = [n];
              } else {
                t[y][r].push(n);
              }
            }
          } else if (!h.test(e[r])) {
            t[y][r] = [e[r]];
          }
        }
        return t;
      }
      const _ = Symbol('Response internals');
      const q = i.STATUS_CODES;
      class Response {
        constructor() {
          const e =
            arguments.length > 0 && arguments[0] !== undefined
              ? arguments[0]
              : null;
          const t =
            arguments.length > 1 && arguments[1] !== undefined
              ? arguments[1]
              : {};
          Body.call(this, e, t);
          const r = t.status || 200;
          const n = new Headers(t.headers);
          if (e != null && !n.has('Content-Type')) {
            const t = extractContentType(e);
            if (t) {
              n.append('Content-Type', t);
            }
          }
          this[_] = {
            url: t.url,
            status: r,
            statusText: t.statusText || q[r],
            headers: n,
            counter: t.counter,
          };
        }

        get url() {
          return this[_].url || '';
        }

        get status() {
          return this[_].status;
        }

        get ok() {
          return this[_].status >= 200 && this[_].status < 300;
        }

        get redirected() {
          return this[_].counter > 0;
        }

        get statusText() {
          return this[_].statusText;
        }

        get headers() {
          return this[_].headers;
        }

        clone() {
          return new Response(clone(this), {
            url: this.url,
            status: this.status,
            statusText: this.statusText,
            headers: this.headers,
            ok: this.ok,
            redirected: this.redirected,
          });
        }
      }
      Body.mixIn(Response.prototype);
      Object.defineProperties(Response.prototype, {
        url: { enumerable: true },
        status: { enumerable: true },
        ok: { enumerable: true },
        redirected: { enumerable: true },
        statusText: { enumerable: true },
        headers: { enumerable: true },
        clone: { enumerable: true },
      });
      Object.defineProperty(Response.prototype, Symbol.toStringTag, {
        value: 'Response',
        writable: false,
        enumerable: false,
        configurable: true,
      });
      const w = Symbol('Request internals');
      const v = s.parse;
      const E = s.format;
      const T = 'destroy' in n.Readable.prototype;
      function isRequest(e) {
        return typeof e === 'object' && typeof e[w] === 'object';
      }
      function isAbortSignal(e) {
        const t = e && typeof e === 'object' && Object.getPrototypeOf(e);
        return !!(t && t.constructor.name === 'AbortSignal');
      }
      class Request {
        constructor(e) {
          const t =
            arguments.length > 1 && arguments[1] !== undefined
              ? arguments[1]
              : {};
          let r;
          if (!isRequest(e)) {
            if (e && e.href) {
              r = v(e.href);
            } else {
              r = v(`${e}`);
            }
            e = {};
          } else {
            r = v(e.url);
          }
          let n = t.method || e.method || 'GET';
          n = n.toUpperCase();
          if (
            (t.body != null || (isRequest(e) && e.body !== null)) &&
            (n === 'GET' || n === 'HEAD')
          ) {
            throw new TypeError(
              'Request with GET/HEAD method cannot have body',
            );
          }
          const i =
            t.body != null
              ? t.body
              : isRequest(e) && e.body !== null
              ? clone(e)
              : null;
          Body.call(this, i, {
            timeout: t.timeout || e.timeout || 0,
            size: t.size || e.size || 0,
          });
          const s = new Headers(t.headers || e.headers || {});
          if (i != null && !s.has('Content-Type')) {
            const e = extractContentType(i);
            if (e) {
              s.append('Content-Type', e);
            }
          }
          let o = isRequest(e) ? e.signal : null;
          if ('signal' in t) o = t.signal;
          if (o != null && !isAbortSignal(o)) {
            throw new TypeError(
              'Expected signal to be an instanceof AbortSignal',
            );
          }
          this[w] = {
            method: n,
            redirect: t.redirect || e.redirect || 'follow',
            headers: s,
            parsedURL: r,
            signal: o,
          };
          this.follow =
            t.follow !== undefined
              ? t.follow
              : e.follow !== undefined
              ? e.follow
              : 20;
          this.compress =
            t.compress !== undefined
              ? t.compress
              : e.compress !== undefined
              ? e.compress
              : true;
          this.counter = t.counter || e.counter || 0;
          this.agent = t.agent || e.agent;
        }

        get method() {
          return this[w].method;
        }

        get url() {
          return E(this[w].parsedURL);
        }

        get headers() {
          return this[w].headers;
        }

        get redirect() {
          return this[w].redirect;
        }

        get signal() {
          return this[w].signal;
        }

        clone() {
          return new Request(this);
        }
      }
      Body.mixIn(Request.prototype);
      Object.defineProperty(Request.prototype, Symbol.toStringTag, {
        value: 'Request',
        writable: false,
        enumerable: false,
        configurable: true,
      });
      Object.defineProperties(Request.prototype, {
        method: { enumerable: true },
        url: { enumerable: true },
        headers: { enumerable: true },
        redirect: { enumerable: true },
        clone: { enumerable: true },
        signal: { enumerable: true },
      });
      function getNodeRequestOptions(e) {
        const t = e[w].parsedURL;
        const r = new Headers(e[w].headers);
        if (!r.has('Accept')) {
          r.set('Accept', '*/*');
        }
        if (!t.protocol || !t.hostname) {
          throw new TypeError('Only absolute URLs are supported');
        }
        if (!/^https?:$/.test(t.protocol)) {
          throw new TypeError('Only HTTP(S) protocols are supported');
        }
        if (e.signal && e.body instanceof n.Readable && !T) {
          throw new Error(
            'Cancellation of streamed requests with AbortSignal is not supported in node < 8',
          );
        }
        let i = null;
        if (e.body == null && /^(POST|PUT)$/i.test(e.method)) {
          i = '0';
        }
        if (e.body != null) {
          const t = getTotalBytes(e);
          if (typeof t === 'number') {
            i = String(t);
          }
        }
        if (i) {
          r.set('Content-Length', i);
        }
        if (!r.has('User-Agent')) {
          r.set(
            'User-Agent',
            'node-fetch/1.0 (+https://github.com/bitinn/node-fetch)',
          );
        }
        if (e.compress && !r.has('Accept-Encoding')) {
          r.set('Accept-Encoding', 'gzip,deflate');
        }
        let s = e.agent;
        if (typeof s === 'function') {
          s = s(t);
        }
        if (!r.has('Connection') && !s) {
          r.set('Connection', 'close');
        }
        return {
          ...t,
          method: e.method,
          headers: exportNodeCompatibleHeaders(r),
          agent: s,
        };
      }
      function AbortError(e) {
        Error.call(this, e);
        this.type = 'aborted';
        this.message = e;
        Error.captureStackTrace(this, this.constructor);
      }
      AbortError.prototype = Object.create(Error.prototype);
      AbortError.prototype.constructor = AbortError;
      AbortError.prototype.name = 'AbortError';
      const j = n.PassThrough;
      const k = s.resolve;
      function fetch(e, t) {
        if (!fetch.Promise) {
          throw new Error(
            'native promise missing, set fetch.Promise to your favorite alternative',
          );
        }
        Body.Promise = fetch.Promise;
        return new fetch.Promise(function(r, s) {
          const u = new Request(e, t);
          const p = getNodeRequestOptions(u);
          const c = (p.protocol === 'https:' ? o : i).request;
          const d = u.signal;
          let l = null;
          const g = function abort() {
            const e = new AbortError('The user aborted a request.');
            s(e);
            if (u.body && u.body instanceof n.Readable) {
              u.body.destroy(e);
            }
            if (!l || !l.body) return;
            l.body.emit('error', e);
          };
          if (d && d.aborted) {
            g();
            return;
          }
          const m = function abortAndFinalize() {
            g();
            finalize();
          };
          const h = c(p);
          let y;
          if (d) {
            d.addEventListener('abort', m);
          }
          function finalize() {
            h.abort();
            if (d) d.removeEventListener('abort', m);
            clearTimeout(y);
          }
          if (u.timeout) {
            h.once('socket', function(e) {
              y = setTimeout(function() {
                s(
                  new FetchError(
                    `network timeout at: ${u.url}`,
                    'request-timeout',
                  ),
                );
                finalize();
              }, u.timeout);
            });
          }
          h.on('error', function(e) {
            s(
              new FetchError(
                `request to ${u.url} failed, reason: ${e.message}`,
                'system',
                e,
              ),
            );
            finalize();
          });
          h.on('response', function(e) {
            clearTimeout(y);
            const t = createHeadersLenient(e.headers);
            if (fetch.isRedirect(e.statusCode)) {
              const n = t.get('Location');
              const i = n === null ? null : k(u.url, n);
              switch (u.redirect) {
                case 'error':
                  s(
                    new FetchError(
                      `redirect mode is set to error: ${u.url}`,
                      'no-redirect',
                    ),
                  );
                  finalize();
                  return;
                case 'manual':
                  if (i !== null) {
                    try {
                      t.set('Location', i);
                    } catch (e) {
                      s(e);
                    }
                  }
                  break;
                case 'follow':
                  if (i === null) {
                    break;
                  }
                  if (u.counter >= u.follow) {
                    s(
                      new FetchError(
                        `maximum redirect reached at: ${u.url}`,
                        'max-redirect',
                      ),
                    );
                    finalize();
                    return;
                  }
                  const n = {
                    headers: new Headers(u.headers),
                    follow: u.follow,
                    counter: u.counter + 1,
                    agent: u.agent,
                    compress: u.compress,
                    method: u.method,
                    body: u.body,
                    signal: u.signal,
                    timeout: u.timeout,
                  };
                  if (
                    e.statusCode !== 303 &&
                    u.body &&
                    getTotalBytes(u) === null
                  ) {
                    s(
                      new FetchError(
                        'Cannot follow redirect with body being a readable stream',
                        'unsupported-redirect',
                      ),
                    );
                    finalize();
                    return;
                  }
                  if (
                    e.statusCode === 303 ||
                    ((e.statusCode === 301 || e.statusCode === 302) &&
                      u.method === 'POST')
                  ) {
                    n.method = 'GET';
                    n.body = undefined;
                    n.headers.delete('content-length');
                  }
                  r(fetch(new Request(i, n)));
                  finalize();
                  return;
              }
            }
            e.once('end', function() {
              if (d) d.removeEventListener('abort', m);
            });
            let n = e.pipe(new j());
            const i = {
              url: u.url,
              status: e.statusCode,
              statusText: e.statusMessage,
              headers: t,
              size: u.size,
              timeout: u.timeout,
              counter: u.counter,
            };
            const o = t.get('Content-Encoding');
            if (
              !u.compress ||
              u.method === 'HEAD' ||
              o === null ||
              e.statusCode === 204 ||
              e.statusCode === 304
            ) {
              l = new Response(n, i);
              r(l);
              return;
            }
            const p = { flush: a.Z_SYNC_FLUSH, finishFlush: a.Z_SYNC_FLUSH };
            if (o == 'gzip' || o == 'x-gzip') {
              n = n.pipe(a.createGunzip(p));
              l = new Response(n, i);
              r(l);
              return;
            }
            if (o == 'deflate' || o == 'x-deflate') {
              const t = e.pipe(new j());
              t.once('data', function(e) {
                if ((e[0] & 15) === 8) {
                  n = n.pipe(a.createInflate());
                } else {
                  n = n.pipe(a.createInflateRaw());
                }
                l = new Response(n, i);
                r(l);
              });
              return;
            }
            if (o == 'br' && typeof a.createBrotliDecompress === 'function') {
              n = n.pipe(a.createBrotliDecompress());
              l = new Response(n, i);
              r(l);
              return;
            }
            l = new Response(n, i);
            r(l);
          });
          writeToStream(h, u);
        });
      }
      fetch.isRedirect = function(e) {
        return e === 301 || e === 302 || e === 303 || e === 307 || e === 308;
      };
      fetch.Promise = global.Promise;
      e.exports = t = fetch;
      Object.defineProperty(t, '__esModule', { value: true });
      t.default = t;
      t.Headers = Headers;
      t.Request = Request;
      t.Response = Response;
      t.FetchError = FetchError;
    },
    462(e) {
      const t = /([()\][%!^"`<>&|;, *?])/g;
      function escapeCommand(e) {
        e = e.replace(t, '^$1');
        return e;
      }
      function escapeArgument(e, r) {
        e = `${e}`;
        e = e.replace(/(\\*)"/g, '$1$1\\"');
        e = e.replace(/(\\*)$/, '$1$1');
        e = `"${e}"`;
        e = e.replace(t, '^$1');
        if (r) {
          e = e.replace(t, '^$1');
        }
        return e;
      }
      e.exports.command = escapeCommand;
      e.exports.argument = escapeArgument;
    },
    463(e, t, r) {
      Object.defineProperty(t, '__esModule', { value: true });
      function _interopDefault(e) {
        return e && typeof e === 'object' && 'default' in e ? e.default : e;
      }
      const n = r(692);
      const i = _interopDefault(r(969));
      const s = i(e => console.warn(e));
      class RequestError extends Error {
        constructor(e, t, r) {
          super(e);
          if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
          }
          this.name = 'HttpError';
          this.status = t;
          Object.defineProperty(this, 'code', {
            get() {
              s(
                new n.Deprecation(
                  '[@octokit/request-error] `error.code` is deprecated, use `error.status`.',
                ),
              );
              return t;
            },
          });
          this.headers = r.headers || {};
          const i = { ...r.request };
          if (r.request.headers.authorization) {
            i.headers = {
              ...r.request.headers,
              authorization: r.request.headers.authorization.replace(
                / .*$/,
                ' [REDACTED]',
              ),
            };
          }
          i.url = i.url
            .replace(/\bclient_secret=\w+/g, 'client_secret=[REDACTED]')
            .replace(/\baccess_token=\w+/g, 'access_token=[REDACTED]');
          this.request = i;
        }
      }
      t.RequestError = RequestError;
    },
    469(e, t, r) {
      const n =
        (this && this.__importDefault) ||
        function(e) {
          return e && e.__esModule ? e : { default: e };
        };
      const i =
        (this && this.__importStar) ||
        function(e) {
          if (e && e.__esModule) return e;
          const t = {};
          if (e != null) {
            for (const r in e) {
              if (Object.hasOwnProperty.call(e, r)) t[r] = e[r];
            }
          }
          t.default = e;
          return t;
        };
      Object.defineProperty(t, '__esModule', { value: true });
      const s = r(503);
      const o = n(r(613));
      const a = i(r(262));
      o.default.prototype = new o.default();
      t.context = new a.Context();
      class GitHub extends o.default {
        constructor(e, t = {}) {
          super({ ...t, auth: `token ${e}` });
          this.graphql = s.defaults({
            headers: { authorization: `token ${e}` },
          });
        }
      }
      t.GitHub = GitHub;
    },
    470(e, t, r) {
      const n =
        (this && this.__awaiter) ||
        function(e, t, r, n) {
          function adopt(e) {
            return e instanceof r
              ? e
              : new r(function(t) {
                  t(e);
                });
          }
          return new (r || (r = Promise))(function(r, i) {
            function fulfilled(e) {
              try {
                step(n.next(e));
              } catch (e) {
                i(e);
              }
            }
            function rejected(e) {
              try {
                step(n.throw(e));
              } catch (e) {
                i(e);
              }
            }
            function step(e) {
              e.done ? r(e.value) : adopt(e.value).then(fulfilled, rejected);
            }
            step((n = n.apply(e, t || [])).next());
          });
        };
      Object.defineProperty(t, '__esModule', { value: true });
      const i = r(431);
      const s = r(87);
      const o = r(622);
      let a;
      (function(e) {
        e[(e.Success = 0)] = 'Success';
        e[(e.Failure = 1)] = 'Failure';
      })((a = t.ExitCode || (t.ExitCode = {})));
      function exportVariable(e, t) {
        process.env[e] = t;
        i.issueCommand('set-env', { name: e }, t);
      }
      t.exportVariable = exportVariable;
      function setSecret(e) {
        i.issueCommand('add-mask', {}, e);
      }
      t.setSecret = setSecret;
      function addPath(e) {
        i.issueCommand('add-path', {}, e);
        process.env.PATH = `${e}${o.delimiter}${process.env.PATH}`;
      }
      t.addPath = addPath;
      function getInput(e, t) {
        const r =
          process.env[`INPUT_${e.replace(/ /g, '_').toUpperCase()}`] || '';
        if (t && t.required && !r) {
          throw new Error(`Input required and not supplied: ${e}`);
        }
        return r.trim();
      }
      t.getInput = getInput;
      function setOutput(e, t) {
        i.issueCommand('set-output', { name: e }, t);
      }
      t.setOutput = setOutput;
      function setFailed(e) {
        process.exitCode = a.Failure;
        error(e);
      }
      t.setFailed = setFailed;
      function debug(e) {
        i.issueCommand('debug', {}, e);
      }
      t.debug = debug;
      function error(e) {
        i.issue('error', e);
      }
      t.error = error;
      function warning(e) {
        i.issue('warning', e);
      }
      t.warning = warning;
      function info(e) {
        process.stdout.write(e + s.EOL);
      }
      t.info = info;
      function startGroup(e) {
        i.issue('group', e);
      }
      t.startGroup = startGroup;
      function endGroup() {
        i.issue('endgroup');
      }
      t.endGroup = endGroup;
      function group(e, t) {
        return n(this, void 0, void 0, function*() {
          startGroup(e);
          let r;
          try {
            r = yield t();
          } finally {
            endGroup();
          }
          return r;
        });
      }
      t.group = group;
      function saveState(e, t) {
        i.issueCommand('save-state', { name: e }, t);
      }
      t.saveState = saveState;
      function getState(e) {
        return process.env[`STATE_${e}`] || '';
      }
      t.getState = getState;
    },
    471(e, t, r) {
      e.exports = authenticationBeforeRequest;
      const n = r(675);
      const i = r(126);
      function authenticationBeforeRequest(e, t) {
        if (!e.auth.type) {
          return;
        }
        if (e.auth.type === 'basic') {
          const r = n(`${e.auth.username}:${e.auth.password}`);
          t.headers.authorization = `Basic ${r}`;
          return;
        }
        if (e.auth.type === 'token') {
          t.headers.authorization = `token ${e.auth.token}`;
          return;
        }
        if (e.auth.type === 'app') {
          t.headers.authorization = `Bearer ${e.auth.token}`;
          const r = t.headers.accept
            .split(',')
            .concat('application/vnd.github.machine-man-preview+json');
          t.headers.accept = i(r)
            .filter(Boolean)
            .join(',');
          return;
        }
        t.url += t.url.indexOf('?') === -1 ? '?' : '&';
        if (e.auth.token) {
          t.url += `access_token=${encodeURIComponent(e.auth.token)}`;
          return;
        }
        const r = encodeURIComponent(e.auth.key);
        const s = encodeURIComponent(e.auth.secret);
        t.url += `client_id=${r}&client_secret=${s}`;
      }
    },
    489(e, t, r) {
      const n = r(622);
      const i = r(814);
      const s = r(39)();
      function resolveCommandAttempt(e, t) {
        const r = process.cwd();
        const o = e.options.cwd != null;
        if (o) {
          try {
            process.chdir(e.options.cwd);
          } catch (e) {}
        }
        let a;
        try {
          a = i.sync(e.command, {
            path: (e.options.env || process.env)[s],
            pathExt: t ? n.delimiter : undefined,
          });
        } catch (e) {
        } finally {
          process.chdir(r);
        }
        if (a) {
          a = n.resolve(o ? e.options.cwd : '', a);
        }
        return a;
      }
      function resolveCommand(e) {
        return resolveCommandAttempt(e) || resolveCommandAttempt(e, true);
      }
      e.exports = resolveCommand;
    },
    497(e, t, r) {
      r.r(t);
      const n = {
        events: ['issues', 'pull_request'],
        modules: {
          bug: {
            project: 'Bugs',
            column: 'Triage',
            triggerLabels: ['bug', 'Bug', 'type: Bug'],
          },
          pull_request_review: { column: 'Review' },
        },
      };
      const i = n;
      const s = r(470);
      const o = r(469);
      const a = s.getInput('repo-token');
      const u = new o.GitHub(a);
      const p = async ({ settings: e, action: t, githubData: r }) => {
        const { node_id: n, html_url: i, labels: s = [] } = r;
        const { project: o, column: a, triggerLabels: p } = e.modules.bug;
        if (!s.length) {
          throw 'Only labeled issues are allowed';
        }
        if (!s.some(({ name: e }) => p.some(t => t === e))) {
          throw `Only issues labeled [${p
            .map(e => `"${e}"`)
            .join(', ')}] allowed`;
        }
        const c = `query {\n\t\t\tresource( url: "${i}" ) {\n\t\t\t\t... on Issue {\n\t\t\t\t\tprojectCards {\n\t\t\t\t\t\tnodes {\n\t\t\t\t\t\t\tid\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t\trepository {\n\t\t\t\t\t\tprojects( search: "${o}", first: 10, states: [OPEN] ) {\n\t\t\t\t\t\t\tnodes {\n\t\t\t\t\t\t\t\tid\n\t\t\t\t\t\t\t\tcolumns( first: 100 ) {\n\t\t\t\t\t\t\t\t\tnodes {\n\t\t\t\t\t\t\t\t\t\tid\n\t\t\t\t\t\t\t\t\t\tname\n\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}\n\t\t\t\t\t\towner {\n\t\t\t\t\t\t\t... on ProjectOwner {\n\t\t\t\t\t\t\t\tprojects( search: "${o}", first: 10, states: [OPEN] ) {\n\t\t\t\t\t\t\t\t\tnodes {\n\t\t\t\t\t\t\t\t\t\tid\n\t\t\t\t\t\t\t\t\t\tcolumns( first: 100 ) {\n\t\t\t\t\t\t\t\t\t\t\tnodes {\n\t\t\t\t\t\t\t\t\t\t\t\tid\n\t\t\t\t\t\t\t\t\t\t\t\tname\n\t\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n        }`;
        const { resource: d } = await u.graphql(c);
        const l = d.repository.projects.nodes || [];
        const g =
          (d.repository.owner &&
            d.repository.owner.projects &&
            d.repository.owner.projects.nodes) ||
          [];
        const m = [...l, ...g].flatMap(e =>
          e.columns.nodes ? e.columns.nodes.filter(e => e.name === a) : [],
        );
        const h =
          (d.projectCards.nodes &&
            d.projectCards.nodes[0] &&
            d.projectCards.nodes[0].id) ||
          null;
        if (m.length === 0) {
          throw new Error(`Could not find ${a} in ${o}`);
        }
        if (h) {
          await Promise.all(
            m.map(e =>
              u.graphql(
                `mutation {\n\t\t\t\t\tmoveProjectCard( input: { cardId: "${h}", columnId: "${e.id}"\n\t\t\t\t}) { clientMutationId } }`,
              ),
            ),
          );
        } else {
          await Promise.all(
            m.map(e =>
              u.graphql(
                `mutation {\n\t\t\t\t\taddProjectCard( input: { contentId: "${n}", projectColumnId: "${e.id}"\n\t\t\t\t}) { clientMutationId } }`,
              ),
            ),
          );
        }
        console.log(
          `✅ ${t === 'opened' ? 'Added' : 'Moved'} card to ${a} in ${o}`,
        );
      };
      const c = p;
      const d = r(470);
      const l = r(469);
      const g = d.getInput('repo-token');
      const m = new l.GitHub(g);
      const h = async ({ settings: e, githubData: t }) => {
        const { html_url: r } = t;
        const { column: n } = e.modules.pull_request_review;
        const i = `query {\n        resource(url: "${r}")\n        {\n            ... on PullRequest \n            {\n                body\n                projectCards\n                { \n                    nodes\n                    {\n                        id\n                        project {\n                            name\n                            id\n                            url\n                            columns(first:4) {\n                                nodes {\n                                    id\n                                    name\n                                    cards {\n                                        nodes {\n                                            id\n                                            content {\n                                                ... on Issue {                                                \n                                                        url\n                                                        title\n                                                }\n                                            }\n                                        }\n                                    }\n                                }\n                            }\n                        }\n                    } \n                }\n            }\n        }\n    }`;
        const { resource: s } = await m.graphql(i);
        const { body: o } = s;
        const a = o.match(/close[d|s] #(\d*)/m);
        const u = a.length > 1 && a[1];
        if (u) {
          const {
            projectCards: { nodes: e },
          } = s;
          const [
            {
              project: {
                name: t,
                columns: { nodes: r },
              },
            },
          ] = e;
          let i;
          let o;
          r.forEach(({ name: e, id: t, cards: { nodes: r } }) => {
            if (e === n) {
              o = t;
            }
            i =
              i ||
              r.find(
                ({ content: { url: e = '' } }) =>
                  e.split('/').slice(-1)[0] === u,
              );
          });
          const a = i && i.id;
          const p = i && i.content && i.content.title;
          if (a) {
            await m.graphql(
              `mutation {\n                moveProjectCard(input: {cardId:"${a}", columnId: "${o}"}) {clientMutationId}\n            }`,
            );
            console.log(`✅ Moved card ${p} to ${n} in ${t}`);
          }
        }
      };
      const y = h;
      const f = r(470);
      const b = r(469);
      const _ = f.getInput('module');
      const q = { issues: 'issue', pull_request: 'pull_request' };
      const w = () => {
        if (!Object.keys(i.modules).includes(_)) {
          throw new Error(`Unknown module ${_}`);
        }
      };
      const v = () => {
        const { eventName: e } = b.context;
        if (!i.events.includes(e)) {
          throw new Error(`Unsupported event ${e}`);
        }
      };
      const E = () => {
        v();
        const { eventName: e, payload: t } = b.context;
        const r = t[q[e]];
        return { eventName: e, action: t.action, githubData: r };
      };
      const T = async () => {
        const e = E();
        switch (_) {
          case 'bug':
            await c({ settings: i, ...e });
            break;
          case 'pull_request_review':
            await y({ settings: i, ...e });
            break;
          default:
            break;
        }
      };
      (async () => {
        try {
          w();
          await T();
        } catch (e) {
          if (typeof e === 'string') {
            f.error(new Error(e));
          } else {
            f.error(e);
            f.setFailed(e.message);
          }
        }
      })();
    },
    500(e, t, r) {
      e.exports = graphql;
      const n = r(862);
      const i = ['method', 'baseUrl', 'url', 'headers', 'request', 'query'];
      function graphql(e, t, r) {
        if (typeof t === 'string') {
          r = { query: t, ...r };
        } else {
          r = t;
        }
        const s = Object.keys(r).reduce((e, t) => {
          if (i.includes(t)) {
            e[t] = r[t];
            return e;
          }
          if (!e.variables) {
            e.variables = {};
          }
          e.variables[t] = r[t];
          return e;
        }, {});
        return e(s).then(e => {
          if (e.data.errors) {
            throw new n(s, e);
          }
          return e.data.data;
        });
      }
    },
    503(e, t, r) {
      const { request: n } = r(753);
      const i = r(46);
      const s = r(314).version;
      const o = `octokit-graphql.js/${s} ${i()}`;
      const a = r(0);
      e.exports = a(n, {
        method: 'POST',
        url: '/graphql',
        headers: { 'user-agent': o },
      });
    },
    510(e) {
      e.exports = addHook;
      function addHook(e, t, r, n) {
        const i = n;
        if (!e.registry[r]) {
          e.registry[r] = [];
        }
        if (t === 'before') {
          n = function(e, t) {
            return Promise.resolve()
              .then(i.bind(null, t))
              .then(e.bind(null, t));
          };
        }
        if (t === 'after') {
          n = function(e, t) {
            let r;
            return Promise.resolve()
              .then(e.bind(null, t))
              .then(function(e) {
                r = e;
                return i(r, t);
              })
              .then(function() {
                return r;
              });
          };
        }
        if (t === 'error') {
          n = function(e, t) {
            return Promise.resolve()
              .then(e.bind(null, t))
              .catch(function(e) {
                return i(e, t);
              });
          };
        }
        e.registry[r].push({ hook: n, orig: i });
      }
    },
    523(e, t, r) {
      const n = r(363);
      const i = r(510);
      const s = r(763);
      const o = Function.bind;
      const a = o.bind(o);
      function bindApi(e, t, r) {
        const n = a(s, null).apply(null, r ? [t, r] : [t]);
        e.api = { remove: n };
        e.remove = n;
        ['before', 'error', 'after', 'wrap'].forEach(function(n) {
          const s = r ? [t, n, r] : [t, n];
          e[n] = e.api[n] = a(i, null).apply(null, s);
        });
      }
      function HookSingular() {
        const e = 'h';
        const t = { registry: {} };
        const r = n.bind(null, t, e);
        bindApi(r, t, e);
        return r;
      }
      function HookCollection() {
        const e = { registry: {} };
        const t = n.bind(null, e);
        bindApi(t, e);
        return t;
      }
      let u = false;
      function Hook() {
        if (!u) {
          console.warn(
            '[before-after-hook]: "Hook()" repurposing warning, use "Hook.Collection()". Read more: https://git.io/upgrade-before-after-hook-to-1.4',
          );
          u = true;
        }
        return HookCollection();
      }
      Hook.Singular = HookSingular.bind();
      Hook.Collection = HookCollection.bind();
      e.exports = Hook;
      e.exports.Hook = Hook;
      e.exports.Singular = Hook.Singular;
      e.exports.Collection = Hook.Collection;
    },
    529(e, t, r) {
      const n = r(47);
      e.exports = n();
    },
    536(e, t, r) {
      e.exports = hasFirstPage;
      const n = r(370);
      const i = r(577);
      function hasFirstPage(e) {
        n(
          `octokit.hasFirstPage() – You can use octokit.paginate or async iterators instead: https://github.com/octokit/rest.js#pagination.`,
        );
        return i(e).first;
      }
    },
    550(e, t, r) {
      e.exports = getNextPage;
      const n = r(265);
      function getNextPage(e, t, r) {
        return n(e, t, 'next', r);
      }
    },
    558(e, t, r) {
      e.exports = hasPreviousPage;
      const n = r(370);
      const i = r(577);
      function hasPreviousPage(e) {
        n(
          `octokit.hasPreviousPage() – You can use octokit.paginate or async iterators instead: https://github.com/octokit/rest.js#pagination.`,
        );
        return i(e).prev;
      }
    },
    562(e, t, r) {
      Object.defineProperty(t, '__esModule', { value: true });
      function _interopDefault(e) {
        return e && typeof e === 'object' && 'default' in e ? e.default : e;
      }
      const n = _interopDefault(r(2));
      function getUserAgent() {
        try {
          return `Node.js/${process.version.substr(1)} (${n()}; ${
            process.arch
          })`;
        } catch (e) {
          if (/wmic os get Caption/.test(e.message)) {
            return 'Windows <version undetectable>';
          }
          throw e;
        }
      }
      t.getUserAgent = getUserAgent;
    },
    563(e, t, r) {
      e.exports = getPreviousPage;
      const n = r(265);
      function getPreviousPage(e, t, r) {
        return n(e, t, 'prev', r);
      }
    },
    568(e, t, r) {
      const n = r(622);
      const i = r(948);
      const s = r(489);
      const o = r(462);
      const a = r(389);
      const u = r(280);
      const p = process.platform === 'win32';
      const c = /\.(?:com|exe)$/i;
      const d = /node_modules[\\\/].bin[\\\/][^\\\/]+\.cmd$/i;
      const l =
        i(() =>
          u.satisfies(process.version, '^4.8.0 || ^5.7.0 || >= 6.0.0', true),
        ) || false;
      function detectShebang(e) {
        e.file = s(e);
        const t = e.file && a(e.file);
        if (t) {
          e.args.unshift(e.file);
          e.command = t;
          return s(e);
        }
        return e.file;
      }
      function parseNonShell(e) {
        if (!p) {
          return e;
        }
        const t = detectShebang(e);
        const r = !c.test(t);
        if (e.options.forceShell || r) {
          const r = d.test(t);
          e.command = n.normalize(e.command);
          e.command = o.command(e.command);
          e.args = e.args.map(e => o.argument(e, r));
          const i = [e.command].concat(e.args).join(' ');
          e.args = ['/d', '/s', '/c', `"${i}"`];
          e.command = process.env.comspec || 'cmd.exe';
          e.options.windowsVerbatimArguments = true;
        }
        return e;
      }
      function parseShell(e) {
        if (l) {
          return e;
        }
        const t = [e.command].concat(e.args).join(' ');
        if (p) {
          e.command =
            typeof e.options.shell === 'string'
              ? e.options.shell
              : process.env.comspec || 'cmd.exe';
          e.args = ['/d', '/s', '/c', `"${t}"`];
          e.options.windowsVerbatimArguments = true;
        } else {
          if (typeof e.options.shell === 'string') {
            e.command = e.options.shell;
          } else if (process.platform === 'android') {
            e.command = '/system/bin/sh';
          } else {
            e.command = '/bin/sh';
          }
          e.args = ['-c', t];
        }
        return e;
      }
      function parse(e, t, r) {
        if (t && !Array.isArray(t)) {
          r = t;
          t = null;
        }
        t = t ? t.slice(0) : [];
        r = { ...r };
        const n = {
          command: e,
          args: t,
          options: r,
          file: undefined,
          original: { command: e, args: t },
        };
        return r.shell ? parseShell(n) : parseNonShell(n);
      }
      e.exports = parse;
    },
    577(e) {
      e.exports = getPageLinks;
      function getPageLinks(e) {
        e = e.link || e.headers.link || '';
        const t = {};
        e.replace(/<([^>]*)>;\s*rel="([\w]*)"/g, (e, r, n) => {
          t[n] = r;
        });
        return t;
      }
    },
    586(e, t, r) {
      e.exports = octokitRestApiEndpoints;
      const n = r(705);
      function octokitRestApiEndpoints(e) {
        n.gitdata = n.git;
        n.authorization = n.oauthAuthorizations;
        n.pullRequests = n.pulls;
        e.registerEndpoints(n);
      }
    },
    605(e) {
      e.exports = require('http');
    },
    613(e, t, r) {
      const n = r(529);
      const i = [r(372), r(19), r(190), r(148), r(248), r(586), r(430), r(850)];
      e.exports = n.plugin(i);
    },
    614(e) {
      e.exports = require('events');
    },
    619(e, t, r) {
      Object.defineProperty(t, '__esModule', { value: true });
      function _interopDefault(e) {
        return e && typeof e === 'object' && 'default' in e ? e.default : e;
      }
      const n = _interopDefault(r(2));
      function getUserAgent() {
        try {
          return `Node.js/${process.version.substr(1)} (${n()}; ${
            process.arch
          })`;
        } catch (e) {
          if (/wmic os get Caption/.test(e.message)) {
            return 'Windows <version undetectable>';
          }
          throw e;
        }
      }
      t.getUserAgent = getUserAgent;
    },
    621(e, t, r) {
      const n = r(622);
      const i = r(39);
      e.exports = e => {
        e = { cwd: process.cwd(), path: process.env[i()], ...e };
        let t;
        let r = n.resolve(e.cwd);
        const s = [];
        while (t !== r) {
          s.push(n.join(r, 'node_modules/.bin'));
          t = r;
          r = n.resolve(r, '..');
        }
        s.push(n.dirname(process.execPath));
        return s.concat(e.path).join(n.delimiter);
      };
      e.exports.env = t => {
        t = { env: process.env, ...t };
        const r = { ...t.env };
        const n = i({ env: r });
        t.path = r[n];
        r[n] = e.exports(t);
        return r;
      };
    },
    622(e) {
      e.exports = require('path');
    },
    649(e, t, r) {
      e.exports = getLastPage;
      const n = r(265);
      function getLastPage(e, t, r) {
        return n(e, t, 'last', r);
      }
    },
    654(e) {
      e.exports = ['SIGABRT', 'SIGALRM', 'SIGHUP', 'SIGINT', 'SIGTERM'];
      if (process.platform !== 'win32') {
        e.exports.push(
          'SIGVTALRM',
          'SIGXCPU',
          'SIGXFSZ',
          'SIGUSR2',
          'SIGTRAP',
          'SIGSYS',
          'SIGQUIT',
          'SIGIOT',
        );
      }
      if (process.platform === 'linux') {
        e.exports.push('SIGIO', 'SIGPOLL', 'SIGPWR', 'SIGSTKFLT', 'SIGUNUSED');
      }
    },
    669(e) {
      e.exports = require('util');
    },
    674(e, t, r) {
      e.exports = authenticate;
      const { Deprecation: n } = r(692);
      const i = r(969);
      const s = i((e, t) => e.warn(t));
      function authenticate(e, t) {
        s(
          e.octokit.log,
          new n(
            '[@octokit/rest] octokit.authenticate() is deprecated. Use "auth" constructor option instead.',
          ),
        );
        if (!t) {
          e.auth = false;
          return;
        }
        switch (t.type) {
          case 'basic':
            if (!t.username || !t.password) {
              throw new Error(
                'Basic authentication requires both a username and password to be set',
              );
            }
            break;
          case 'oauth':
            if (!t.token && !(t.key && t.secret)) {
              throw new Error(
                'OAuth2 authentication requires a token or key & secret to be set',
              );
            }
            break;
          case 'token':
          case 'app':
            if (!t.token) {
              throw new Error(
                'Token authentication requires a token to be set',
              );
            }
            break;
          default:
            throw new Error(
              "Invalid authentication type, must be 'basic', 'oauth', 'token' or 'app'",
            );
        }
        e.auth = t;
      }
    },
    675(e) {
      e.exports = function btoa(e) {
        return new Buffer(e).toString('base64');
      };
    },
    692(e, t) {
      Object.defineProperty(t, '__esModule', { value: true });
      class Deprecation extends Error {
        constructor(e) {
          super(e);
          if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
          }
          this.name = 'Deprecation';
        }
      }
      t.Deprecation = Deprecation;
    },
    696(e) {
      function isObject(e) {
        return e != null && typeof e === 'object' && Array.isArray(e) === false;
      }
      function isObjectObject(e) {
        return (
          isObject(e) === true &&
          Object.prototype.toString.call(e) === '[object Object]'
        );
      }
      function isPlainObject(e) {
        let t;
        let r;
        if (isObjectObject(e) === false) return false;
        t = e.constructor;
        if (typeof t !== 'function') return false;
        r = t.prototype;
        if (isObjectObject(r) === false) return false;
        if (r.hasOwnProperty('isPrototypeOf') === false) {
          return false;
        }
        return true;
      }
      e.exports = isPlainObject;
    },
    697(e) {
      e.exports = (e, t) => {
        t = t || (() => {});
        return e.then(
          e =>
            new Promise(e => {
              e(t());
            }).then(() => e),
          e =>
            new Promise(e => {
              e(t());
            }).then(() => {
              throw e;
            }),
        );
      };
    },
    705(e) {
      e.exports = {
        activity: {
          checkStarringRepo: {
            method: 'GET',
            params: {
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/user/starred/:owner/:repo',
          },
          deleteRepoSubscription: {
            method: 'DELETE',
            params: {
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/subscription',
          },
          deleteThreadSubscription: {
            method: 'DELETE',
            params: { thread_id: { required: true, type: 'integer' } },
            url: '/notifications/threads/:thread_id/subscription',
          },
          getRepoSubscription: {
            method: 'GET',
            params: {
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/subscription',
          },
          getThread: {
            method: 'GET',
            params: { thread_id: { required: true, type: 'integer' } },
            url: '/notifications/threads/:thread_id',
          },
          getThreadSubscription: {
            method: 'GET',
            params: { thread_id: { required: true, type: 'integer' } },
            url: '/notifications/threads/:thread_id/subscription',
          },
          listEventsForOrg: {
            method: 'GET',
            params: {
              org: { required: true, type: 'string' },
              page: { type: 'integer' },
              per_page: { type: 'integer' },
              username: { required: true, type: 'string' },
            },
            url: '/users/:username/events/orgs/:org',
          },
          listEventsForUser: {
            method: 'GET',
            params: {
              page: { type: 'integer' },
              per_page: { type: 'integer' },
              username: { required: true, type: 'string' },
            },
            url: '/users/:username/events',
          },
          listFeeds: { method: 'GET', params: {}, url: '/feeds' },
          listNotifications: {
            method: 'GET',
            params: {
              all: { type: 'boolean' },
              before: { type: 'string' },
              page: { type: 'integer' },
              participating: { type: 'boolean' },
              per_page: { type: 'integer' },
              since: { type: 'string' },
            },
            url: '/notifications',
          },
          listNotificationsForRepo: {
            method: 'GET',
            params: {
              all: { type: 'boolean' },
              before: { type: 'string' },
              owner: { required: true, type: 'string' },
              page: { type: 'integer' },
              participating: { type: 'boolean' },
              per_page: { type: 'integer' },
              repo: { required: true, type: 'string' },
              since: { type: 'string' },
            },
            url: '/repos/:owner/:repo/notifications',
          },
          listPublicEvents: {
            method: 'GET',
            params: {
              page: { type: 'integer' },
              per_page: { type: 'integer' },
            },
            url: '/events',
          },
          listPublicEventsForOrg: {
            method: 'GET',
            params: {
              org: { required: true, type: 'string' },
              page: { type: 'integer' },
              per_page: { type: 'integer' },
            },
            url: '/orgs/:org/events',
          },
          listPublicEventsForRepoNetwork: {
            method: 'GET',
            params: {
              owner: { required: true, type: 'string' },
              page: { type: 'integer' },
              per_page: { type: 'integer' },
              repo: { required: true, type: 'string' },
            },
            url: '/networks/:owner/:repo/events',
          },
          listPublicEventsForUser: {
            method: 'GET',
            params: {
              page: { type: 'integer' },
              per_page: { type: 'integer' },
              username: { required: true, type: 'string' },
            },
            url: '/users/:username/events/public',
          },
          listReceivedEventsForUser: {
            method: 'GET',
            params: {
              page: { type: 'integer' },
              per_page: { type: 'integer' },
              username: { required: true, type: 'string' },
            },
            url: '/users/:username/received_events',
          },
          listReceivedPublicEventsForUser: {
            method: 'GET',
            params: {
              page: { type: 'integer' },
              per_page: { type: 'integer' },
              username: { required: true, type: 'string' },
            },
            url: '/users/:username/received_events/public',
          },
          listRepoEvents: {
            method: 'GET',
            params: {
              owner: { required: true, type: 'string' },
              page: { type: 'integer' },
              per_page: { type: 'integer' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/events',
          },
          listReposStarredByAuthenticatedUser: {
            method: 'GET',
            params: {
              direction: { enum: ['asc', 'desc'], type: 'string' },
              page: { type: 'integer' },
              per_page: { type: 'integer' },
              sort: { enum: ['created', 'updated'], type: 'string' },
            },
            url: '/user/starred',
          },
          listReposStarredByUser: {
            method: 'GET',
            params: {
              direction: { enum: ['asc', 'desc'], type: 'string' },
              page: { type: 'integer' },
              per_page: { type: 'integer' },
              sort: { enum: ['created', 'updated'], type: 'string' },
              username: { required: true, type: 'string' },
            },
            url: '/users/:username/starred',
          },
          listReposWatchedByUser: {
            method: 'GET',
            params: {
              page: { type: 'integer' },
              per_page: { type: 'integer' },
              username: { required: true, type: 'string' },
            },
            url: '/users/:username/subscriptions',
          },
          listStargazersForRepo: {
            method: 'GET',
            params: {
              owner: { required: true, type: 'string' },
              page: { type: 'integer' },
              per_page: { type: 'integer' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/stargazers',
          },
          listWatchedReposForAuthenticatedUser: {
            method: 'GET',
            params: {
              page: { type: 'integer' },
              per_page: { type: 'integer' },
            },
            url: '/user/subscriptions',
          },
          listWatchersForRepo: {
            method: 'GET',
            params: {
              owner: { required: true, type: 'string' },
              page: { type: 'integer' },
              per_page: { type: 'integer' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/subscribers',
          },
          markAsRead: {
            method: 'PUT',
            params: { last_read_at: { type: 'string' } },
            url: '/notifications',
          },
          markNotificationsAsReadForRepo: {
            method: 'PUT',
            params: {
              last_read_at: { type: 'string' },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/notifications',
          },
          markThreadAsRead: {
            method: 'PATCH',
            params: { thread_id: { required: true, type: 'integer' } },
            url: '/notifications/threads/:thread_id',
          },
          setRepoSubscription: {
            method: 'PUT',
            params: {
              ignored: { type: 'boolean' },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
              subscribed: { type: 'boolean' },
            },
            url: '/repos/:owner/:repo/subscription',
          },
          setThreadSubscription: {
            method: 'PUT',
            params: {
              ignored: { type: 'boolean' },
              thread_id: { required: true, type: 'integer' },
            },
            url: '/notifications/threads/:thread_id/subscription',
          },
          starRepo: {
            method: 'PUT',
            params: {
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/user/starred/:owner/:repo',
          },
          unstarRepo: {
            method: 'DELETE',
            params: {
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/user/starred/:owner/:repo',
          },
        },
        apps: {
          addRepoToInstallation: {
            headers: {
              accept: 'application/vnd.github.machine-man-preview+json',
            },
            method: 'PUT',
            params: {
              installation_id: { required: true, type: 'integer' },
              repository_id: { required: true, type: 'integer' },
            },
            url:
              '/user/installations/:installation_id/repositories/:repository_id',
          },
          checkAccountIsAssociatedWithAny: {
            method: 'GET',
            params: {
              account_id: { required: true, type: 'integer' },
              page: { type: 'integer' },
              per_page: { type: 'integer' },
            },
            url: '/marketplace_listing/accounts/:account_id',
          },
          checkAccountIsAssociatedWithAnyStubbed: {
            method: 'GET',
            params: {
              account_id: { required: true, type: 'integer' },
              page: { type: 'integer' },
              per_page: { type: 'integer' },
            },
            url: '/marketplace_listing/stubbed/accounts/:account_id',
          },
          checkAuthorization: {
            deprecated:
              'octokit.oauthAuthorizations.checkAuthorization() has been renamed to octokit.apps.checkAuthorization() (2019-11-05)',
            method: 'GET',
            params: {
              access_token: { required: true, type: 'string' },
              client_id: { required: true, type: 'string' },
            },
            url: '/applications/:client_id/tokens/:access_token',
          },
          checkToken: {
            headers: {
              accept: 'application/vnd.github.doctor-strange-preview+json',
            },
            method: 'POST',
            params: {
              access_token: { type: 'string' },
              client_id: { required: true, type: 'string' },
            },
            url: '/applications/:client_id/token',
          },
          createContentAttachment: {
            headers: { accept: 'application/vnd.github.corsair-preview+json' },
            method: 'POST',
            params: {
              body: { required: true, type: 'string' },
              content_reference_id: { required: true, type: 'integer' },
              title: { required: true, type: 'string' },
            },
            url: '/content_references/:content_reference_id/attachments',
          },
          createFromManifest: {
            headers: { accept: 'application/vnd.github.fury-preview+json' },
            method: 'POST',
            params: { code: { required: true, type: 'string' } },
            url: '/app-manifests/:code/conversions',
          },
          createInstallationToken: {
            headers: {
              accept: 'application/vnd.github.machine-man-preview+json',
            },
            method: 'POST',
            params: {
              installation_id: { required: true, type: 'integer' },
              permissions: { type: 'object' },
              repository_ids: { type: 'integer[]' },
            },
            url: '/app/installations/:installation_id/access_tokens',
          },
          deleteAuthorization: {
            headers: {
              accept: 'application/vnd.github.doctor-strange-preview+json',
            },
            method: 'DELETE',
            params: {
              access_token: { type: 'string' },
              client_id: { required: true, type: 'string' },
            },
            url: '/applications/:client_id/grant',
          },
          deleteInstallation: {
            headers: {
              accept:
                'application/vnd.github.gambit-preview+json,application/vnd.github.machine-man-preview+json',
            },
            method: 'DELETE',
            params: { installation_id: { required: true, type: 'integer' } },
            url: '/app/installations/:installation_id',
          },
          deleteToken: {
            headers: {
              accept: 'application/vnd.github.doctor-strange-preview+json',
            },
            method: 'DELETE',
            params: {
              access_token: { type: 'string' },
              client_id: { required: true, type: 'string' },
            },
            url: '/applications/:client_id/token',
          },
          findOrgInstallation: {
            deprecated:
              'octokit.apps.findOrgInstallation() has been renamed to octokit.apps.getOrgInstallation() (2019-04-10)',
            headers: {
              accept: 'application/vnd.github.machine-man-preview+json',
            },
            method: 'GET',
            params: { org: { required: true, type: 'string' } },
            url: '/orgs/:org/installation',
          },
          findRepoInstallation: {
            deprecated:
              'octokit.apps.findRepoInstallation() has been renamed to octokit.apps.getRepoInstallation() (2019-04-10)',
            headers: {
              accept: 'application/vnd.github.machine-man-preview+json',
            },
            method: 'GET',
            params: {
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/installation',
          },
          findUserInstallation: {
            deprecated:
              'octokit.apps.findUserInstallation() has been renamed to octokit.apps.getUserInstallation() (2019-04-10)',
            headers: {
              accept: 'application/vnd.github.machine-man-preview+json',
            },
            method: 'GET',
            params: { username: { required: true, type: 'string' } },
            url: '/users/:username/installation',
          },
          getAuthenticated: {
            headers: {
              accept: 'application/vnd.github.machine-man-preview+json',
            },
            method: 'GET',
            params: {},
            url: '/app',
          },
          getBySlug: {
            headers: {
              accept: 'application/vnd.github.machine-man-preview+json',
            },
            method: 'GET',
            params: { app_slug: { required: true, type: 'string' } },
            url: '/apps/:app_slug',
          },
          getInstallation: {
            headers: {
              accept: 'application/vnd.github.machine-man-preview+json',
            },
            method: 'GET',
            params: { installation_id: { required: true, type: 'integer' } },
            url: '/app/installations/:installation_id',
          },
          getOrgInstallation: {
            headers: {
              accept: 'application/vnd.github.machine-man-preview+json',
            },
            method: 'GET',
            params: { org: { required: true, type: 'string' } },
            url: '/orgs/:org/installation',
          },
          getRepoInstallation: {
            headers: {
              accept: 'application/vnd.github.machine-man-preview+json',
            },
            method: 'GET',
            params: {
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/installation',
          },
          getUserInstallation: {
            headers: {
              accept: 'application/vnd.github.machine-man-preview+json',
            },
            method: 'GET',
            params: { username: { required: true, type: 'string' } },
            url: '/users/:username/installation',
          },
          listAccountsUserOrOrgOnPlan: {
            method: 'GET',
            params: {
              direction: { enum: ['asc', 'desc'], type: 'string' },
              page: { type: 'integer' },
              per_page: { type: 'integer' },
              plan_id: { required: true, type: 'integer' },
              sort: { enum: ['created', 'updated'], type: 'string' },
            },
            url: '/marketplace_listing/plans/:plan_id/accounts',
          },
          listAccountsUserOrOrgOnPlanStubbed: {
            method: 'GET',
            params: {
              direction: { enum: ['asc', 'desc'], type: 'string' },
              page: { type: 'integer' },
              per_page: { type: 'integer' },
              plan_id: { required: true, type: 'integer' },
              sort: { enum: ['created', 'updated'], type: 'string' },
            },
            url: '/marketplace_listing/stubbed/plans/:plan_id/accounts',
          },
          listInstallationReposForAuthenticatedUser: {
            headers: {
              accept: 'application/vnd.github.machine-man-preview+json',
            },
            method: 'GET',
            params: {
              installation_id: { required: true, type: 'integer' },
              page: { type: 'integer' },
              per_page: { type: 'integer' },
            },
            url: '/user/installations/:installation_id/repositories',
          },
          listInstallations: {
            headers: {
              accept: 'application/vnd.github.machine-man-preview+json',
            },
            method: 'GET',
            params: {
              page: { type: 'integer' },
              per_page: { type: 'integer' },
            },
            url: '/app/installations',
          },
          listInstallationsForAuthenticatedUser: {
            headers: {
              accept: 'application/vnd.github.machine-man-preview+json',
            },
            method: 'GET',
            params: {
              page: { type: 'integer' },
              per_page: { type: 'integer' },
            },
            url: '/user/installations',
          },
          listMarketplacePurchasesForAuthenticatedUser: {
            method: 'GET',
            params: {
              page: { type: 'integer' },
              per_page: { type: 'integer' },
            },
            url: '/user/marketplace_purchases',
          },
          listMarketplacePurchasesForAuthenticatedUserStubbed: {
            method: 'GET',
            params: {
              page: { type: 'integer' },
              per_page: { type: 'integer' },
            },
            url: '/user/marketplace_purchases/stubbed',
          },
          listPlans: {
            method: 'GET',
            params: {
              page: { type: 'integer' },
              per_page: { type: 'integer' },
            },
            url: '/marketplace_listing/plans',
          },
          listPlansStubbed: {
            method: 'GET',
            params: {
              page: { type: 'integer' },
              per_page: { type: 'integer' },
            },
            url: '/marketplace_listing/stubbed/plans',
          },
          listRepos: {
            headers: {
              accept: 'application/vnd.github.machine-man-preview+json',
            },
            method: 'GET',
            params: {
              page: { type: 'integer' },
              per_page: { type: 'integer' },
            },
            url: '/installation/repositories',
          },
          removeRepoFromInstallation: {
            headers: {
              accept: 'application/vnd.github.machine-man-preview+json',
            },
            method: 'DELETE',
            params: {
              installation_id: { required: true, type: 'integer' },
              repository_id: { required: true, type: 'integer' },
            },
            url:
              '/user/installations/:installation_id/repositories/:repository_id',
          },
          resetAuthorization: {
            deprecated:
              'octokit.oauthAuthorizations.resetAuthorization() has been renamed to octokit.apps.resetAuthorization() (2019-11-05)',
            method: 'POST',
            params: {
              access_token: { required: true, type: 'string' },
              client_id: { required: true, type: 'string' },
            },
            url: '/applications/:client_id/tokens/:access_token',
          },
          resetToken: {
            headers: {
              accept: 'application/vnd.github.doctor-strange-preview+json',
            },
            method: 'PATCH',
            params: {
              access_token: { type: 'string' },
              client_id: { required: true, type: 'string' },
            },
            url: '/applications/:client_id/token',
          },
          revokeAuthorizationForApplication: {
            deprecated:
              'octokit.oauthAuthorizations.revokeAuthorizationForApplication() has been renamed to octokit.apps.revokeAuthorizationForApplication() (2019-11-05)',
            method: 'DELETE',
            params: {
              access_token: { required: true, type: 'string' },
              client_id: { required: true, type: 'string' },
            },
            url: '/applications/:client_id/tokens/:access_token',
          },
          revokeGrantForApplication: {
            deprecated:
              'octokit.oauthAuthorizations.revokeGrantForApplication() has been renamed to octokit.apps.revokeGrantForApplication() (2019-11-05)',
            method: 'DELETE',
            params: {
              access_token: { required: true, type: 'string' },
              client_id: { required: true, type: 'string' },
            },
            url: '/applications/:client_id/grants/:access_token',
          },
        },
        checks: {
          create: {
            headers: { accept: 'application/vnd.github.antiope-preview+json' },
            method: 'POST',
            params: {
              actions: { type: 'object[]' },
              'actions[].description': { required: true, type: 'string' },
              'actions[].identifier': { required: true, type: 'string' },
              'actions[].label': { required: true, type: 'string' },
              completed_at: { type: 'string' },
              conclusion: {
                enum: [
                  'success',
                  'failure',
                  'neutral',
                  'cancelled',
                  'timed_out',
                  'action_required',
                ],
                type: 'string',
              },
              details_url: { type: 'string' },
              external_id: { type: 'string' },
              head_sha: { required: true, type: 'string' },
              name: { required: true, type: 'string' },
              output: { type: 'object' },
              'output.annotations': { type: 'object[]' },
              'output.annotations[].annotation_level': {
                enum: ['notice', 'warning', 'failure'],
                required: true,
                type: 'string',
              },
              'output.annotations[].end_column': { type: 'integer' },
              'output.annotations[].end_line': {
                required: true,
                type: 'integer',
              },
              'output.annotations[].message': {
                required: true,
                type: 'string',
              },
              'output.annotations[].path': { required: true, type: 'string' },
              'output.annotations[].raw_details': { type: 'string' },
              'output.annotations[].start_column': { type: 'integer' },
              'output.annotations[].start_line': {
                required: true,
                type: 'integer',
              },
              'output.annotations[].title': { type: 'string' },
              'output.images': { type: 'object[]' },
              'output.images[].alt': { required: true, type: 'string' },
              'output.images[].caption': { type: 'string' },
              'output.images[].image_url': { required: true, type: 'string' },
              'output.summary': { required: true, type: 'string' },
              'output.text': { type: 'string' },
              'output.title': { required: true, type: 'string' },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
              started_at: { type: 'string' },
              status: {
                enum: ['queued', 'in_progress', 'completed'],
                type: 'string',
              },
            },
            url: '/repos/:owner/:repo/check-runs',
          },
          createSuite: {
            headers: { accept: 'application/vnd.github.antiope-preview+json' },
            method: 'POST',
            params: {
              head_sha: { required: true, type: 'string' },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/check-suites',
          },
          get: {
            headers: { accept: 'application/vnd.github.antiope-preview+json' },
            method: 'GET',
            params: {
              check_run_id: { required: true, type: 'integer' },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/check-runs/:check_run_id',
          },
          getSuite: {
            headers: { accept: 'application/vnd.github.antiope-preview+json' },
            method: 'GET',
            params: {
              check_suite_id: { required: true, type: 'integer' },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/check-suites/:check_suite_id',
          },
          listAnnotations: {
            headers: { accept: 'application/vnd.github.antiope-preview+json' },
            method: 'GET',
            params: {
              check_run_id: { required: true, type: 'integer' },
              owner: { required: true, type: 'string' },
              page: { type: 'integer' },
              per_page: { type: 'integer' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/check-runs/:check_run_id/annotations',
          },
          listForRef: {
            headers: { accept: 'application/vnd.github.antiope-preview+json' },
            method: 'GET',
            params: {
              check_name: { type: 'string' },
              filter: { enum: ['latest', 'all'], type: 'string' },
              owner: { required: true, type: 'string' },
              page: { type: 'integer' },
              per_page: { type: 'integer' },
              ref: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
              status: {
                enum: ['queued', 'in_progress', 'completed'],
                type: 'string',
              },
            },
            url: '/repos/:owner/:repo/commits/:ref/check-runs',
          },
          listForSuite: {
            headers: { accept: 'application/vnd.github.antiope-preview+json' },
            method: 'GET',
            params: {
              check_name: { type: 'string' },
              check_suite_id: { required: true, type: 'integer' },
              filter: { enum: ['latest', 'all'], type: 'string' },
              owner: { required: true, type: 'string' },
              page: { type: 'integer' },
              per_page: { type: 'integer' },
              repo: { required: true, type: 'string' },
              status: {
                enum: ['queued', 'in_progress', 'completed'],
                type: 'string',
              },
            },
            url: '/repos/:owner/:repo/check-suites/:check_suite_id/check-runs',
          },
          listSuitesForRef: {
            headers: { accept: 'application/vnd.github.antiope-preview+json' },
            method: 'GET',
            params: {
              app_id: { type: 'integer' },
              check_name: { type: 'string' },
              owner: { required: true, type: 'string' },
              page: { type: 'integer' },
              per_page: { type: 'integer' },
              ref: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/commits/:ref/check-suites',
          },
          rerequestSuite: {
            headers: { accept: 'application/vnd.github.antiope-preview+json' },
            method: 'POST',
            params: {
              check_suite_id: { required: true, type: 'integer' },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/check-suites/:check_suite_id/rerequest',
          },
          setSuitesPreferences: {
            headers: { accept: 'application/vnd.github.antiope-preview+json' },
            method: 'PATCH',
            params: {
              auto_trigger_checks: { type: 'object[]' },
              'auto_trigger_checks[].app_id': {
                required: true,
                type: 'integer',
              },
              'auto_trigger_checks[].setting': {
                required: true,
                type: 'boolean',
              },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/check-suites/preferences',
          },
          update: {
            headers: { accept: 'application/vnd.github.antiope-preview+json' },
            method: 'PATCH',
            params: {
              actions: { type: 'object[]' },
              'actions[].description': { required: true, type: 'string' },
              'actions[].identifier': { required: true, type: 'string' },
              'actions[].label': { required: true, type: 'string' },
              check_run_id: { required: true, type: 'integer' },
              completed_at: { type: 'string' },
              conclusion: {
                enum: [
                  'success',
                  'failure',
                  'neutral',
                  'cancelled',
                  'timed_out',
                  'action_required',
                ],
                type: 'string',
              },
              details_url: { type: 'string' },
              external_id: { type: 'string' },
              name: { type: 'string' },
              output: { type: 'object' },
              'output.annotations': { type: 'object[]' },
              'output.annotations[].annotation_level': {
                enum: ['notice', 'warning', 'failure'],
                required: true,
                type: 'string',
              },
              'output.annotations[].end_column': { type: 'integer' },
              'output.annotations[].end_line': {
                required: true,
                type: 'integer',
              },
              'output.annotations[].message': {
                required: true,
                type: 'string',
              },
              'output.annotations[].path': { required: true, type: 'string' },
              'output.annotations[].raw_details': { type: 'string' },
              'output.annotations[].start_column': { type: 'integer' },
              'output.annotations[].start_line': {
                required: true,
                type: 'integer',
              },
              'output.annotations[].title': { type: 'string' },
              'output.images': { type: 'object[]' },
              'output.images[].alt': { required: true, type: 'string' },
              'output.images[].caption': { type: 'string' },
              'output.images[].image_url': { required: true, type: 'string' },
              'output.summary': { required: true, type: 'string' },
              'output.text': { type: 'string' },
              'output.title': { type: 'string' },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
              started_at: { type: 'string' },
              status: {
                enum: ['queued', 'in_progress', 'completed'],
                type: 'string',
              },
            },
            url: '/repos/:owner/:repo/check-runs/:check_run_id',
          },
        },
        codesOfConduct: {
          getConductCode: {
            headers: {
              accept: 'application/vnd.github.scarlet-witch-preview+json',
            },
            method: 'GET',
            params: { key: { required: true, type: 'string' } },
            url: '/codes_of_conduct/:key',
          },
          getForRepo: {
            headers: {
              accept: 'application/vnd.github.scarlet-witch-preview+json',
            },
            method: 'GET',
            params: {
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/community/code_of_conduct',
          },
          listConductCodes: {
            headers: {
              accept: 'application/vnd.github.scarlet-witch-preview+json',
            },
            method: 'GET',
            params: {},
            url: '/codes_of_conduct',
          },
        },
        emojis: { get: { method: 'GET', params: {}, url: '/emojis' } },
        gists: {
          checkIsStarred: {
            method: 'GET',
            params: { gist_id: { required: true, type: 'string' } },
            url: '/gists/:gist_id/star',
          },
          create: {
            method: 'POST',
            params: {
              description: { type: 'string' },
              files: { required: true, type: 'object' },
              'files.content': { type: 'string' },
              public: { type: 'boolean' },
            },
            url: '/gists',
          },
          createComment: {
            method: 'POST',
            params: {
              body: { required: true, type: 'string' },
              gist_id: { required: true, type: 'string' },
            },
            url: '/gists/:gist_id/comments',
          },
          delete: {
            method: 'DELETE',
            params: { gist_id: { required: true, type: 'string' } },
            url: '/gists/:gist_id',
          },
          deleteComment: {
            method: 'DELETE',
            params: {
              comment_id: { required: true, type: 'integer' },
              gist_id: { required: true, type: 'string' },
            },
            url: '/gists/:gist_id/comments/:comment_id',
          },
          fork: {
            method: 'POST',
            params: { gist_id: { required: true, type: 'string' } },
            url: '/gists/:gist_id/forks',
          },
          get: {
            method: 'GET',
            params: { gist_id: { required: true, type: 'string' } },
            url: '/gists/:gist_id',
          },
          getComment: {
            method: 'GET',
            params: {
              comment_id: { required: true, type: 'integer' },
              gist_id: { required: true, type: 'string' },
            },
            url: '/gists/:gist_id/comments/:comment_id',
          },
          getRevision: {
            method: 'GET',
            params: {
              gist_id: { required: true, type: 'string' },
              sha: { required: true, type: 'string' },
            },
            url: '/gists/:gist_id/:sha',
          },
          list: {
            method: 'GET',
            params: {
              page: { type: 'integer' },
              per_page: { type: 'integer' },
              since: { type: 'string' },
            },
            url: '/gists',
          },
          listComments: {
            method: 'GET',
            params: {
              gist_id: { required: true, type: 'string' },
              page: { type: 'integer' },
              per_page: { type: 'integer' },
            },
            url: '/gists/:gist_id/comments',
          },
          listCommits: {
            method: 'GET',
            params: {
              gist_id: { required: true, type: 'string' },
              page: { type: 'integer' },
              per_page: { type: 'integer' },
            },
            url: '/gists/:gist_id/commits',
          },
          listForks: {
            method: 'GET',
            params: {
              gist_id: { required: true, type: 'string' },
              page: { type: 'integer' },
              per_page: { type: 'integer' },
            },
            url: '/gists/:gist_id/forks',
          },
          listPublic: {
            method: 'GET',
            params: {
              page: { type: 'integer' },
              per_page: { type: 'integer' },
              since: { type: 'string' },
            },
            url: '/gists/public',
          },
          listPublicForUser: {
            method: 'GET',
            params: {
              page: { type: 'integer' },
              per_page: { type: 'integer' },
              since: { type: 'string' },
              username: { required: true, type: 'string' },
            },
            url: '/users/:username/gists',
          },
          listStarred: {
            method: 'GET',
            params: {
              page: { type: 'integer' },
              per_page: { type: 'integer' },
              since: { type: 'string' },
            },
            url: '/gists/starred',
          },
          star: {
            method: 'PUT',
            params: { gist_id: { required: true, type: 'string' } },
            url: '/gists/:gist_id/star',
          },
          unstar: {
            method: 'DELETE',
            params: { gist_id: { required: true, type: 'string' } },
            url: '/gists/:gist_id/star',
          },
          update: {
            method: 'PATCH',
            params: {
              description: { type: 'string' },
              files: { type: 'object' },
              'files.content': { type: 'string' },
              'files.filename': { type: 'string' },
              gist_id: { required: true, type: 'string' },
            },
            url: '/gists/:gist_id',
          },
          updateComment: {
            method: 'PATCH',
            params: {
              body: { required: true, type: 'string' },
              comment_id: { required: true, type: 'integer' },
              gist_id: { required: true, type: 'string' },
            },
            url: '/gists/:gist_id/comments/:comment_id',
          },
        },
        git: {
          createBlob: {
            method: 'POST',
            params: {
              content: { required: true, type: 'string' },
              encoding: { type: 'string' },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/git/blobs',
          },
          createCommit: {
            method: 'POST',
            params: {
              author: { type: 'object' },
              'author.date': { type: 'string' },
              'author.email': { type: 'string' },
              'author.name': { type: 'string' },
              committer: { type: 'object' },
              'committer.date': { type: 'string' },
              'committer.email': { type: 'string' },
              'committer.name': { type: 'string' },
              message: { required: true, type: 'string' },
              owner: { required: true, type: 'string' },
              parents: { required: true, type: 'string[]' },
              repo: { required: true, type: 'string' },
              signature: { type: 'string' },
              tree: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/git/commits',
          },
          createRef: {
            method: 'POST',
            params: {
              owner: { required: true, type: 'string' },
              ref: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
              sha: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/git/refs',
          },
          createTag: {
            method: 'POST',
            params: {
              message: { required: true, type: 'string' },
              object: { required: true, type: 'string' },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
              tag: { required: true, type: 'string' },
              tagger: { type: 'object' },
              'tagger.date': { type: 'string' },
              'tagger.email': { type: 'string' },
              'tagger.name': { type: 'string' },
              type: {
                enum: ['commit', 'tree', 'blob'],
                required: true,
                type: 'string',
              },
            },
            url: '/repos/:owner/:repo/git/tags',
          },
          createTree: {
            method: 'POST',
            params: {
              base_tree: { type: 'string' },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
              tree: { required: true, type: 'object[]' },
              'tree[].content': { type: 'string' },
              'tree[].mode': {
                enum: ['100644', '100755', '040000', '160000', '120000'],
                type: 'string',
              },
              'tree[].path': { type: 'string' },
              'tree[].sha': { allowNull: true, type: 'string' },
              'tree[].type': {
                enum: ['blob', 'tree', 'commit'],
                type: 'string',
              },
            },
            url: '/repos/:owner/:repo/git/trees',
          },
          deleteRef: {
            method: 'DELETE',
            params: {
              owner: { required: true, type: 'string' },
              ref: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/git/refs/:ref',
          },
          getBlob: {
            method: 'GET',
            params: {
              file_sha: { required: true, type: 'string' },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/git/blobs/:file_sha',
          },
          getCommit: {
            method: 'GET',
            params: {
              commit_sha: { required: true, type: 'string' },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/git/commits/:commit_sha',
          },
          getRef: {
            method: 'GET',
            params: {
              owner: { required: true, type: 'string' },
              ref: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/git/ref/:ref',
          },
          getTag: {
            method: 'GET',
            params: {
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
              tag_sha: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/git/tags/:tag_sha',
          },
          getTree: {
            method: 'GET',
            params: {
              owner: { required: true, type: 'string' },
              recursive: { enum: ['1'], type: 'integer' },
              repo: { required: true, type: 'string' },
              tree_sha: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/git/trees/:tree_sha',
          },
          listMatchingRefs: {
            method: 'GET',
            params: {
              owner: { required: true, type: 'string' },
              page: { type: 'integer' },
              per_page: { type: 'integer' },
              ref: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/git/matching-refs/:ref',
          },
          listRefs: {
            method: 'GET',
            params: {
              namespace: { type: 'string' },
              owner: { required: true, type: 'string' },
              page: { type: 'integer' },
              per_page: { type: 'integer' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/git/refs/:namespace',
          },
          updateRef: {
            method: 'PATCH',
            params: {
              force: { type: 'boolean' },
              owner: { required: true, type: 'string' },
              ref: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
              sha: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/git/refs/:ref',
          },
        },
        gitignore: {
          getTemplate: {
            method: 'GET',
            params: { name: { required: true, type: 'string' } },
            url: '/gitignore/templates/:name',
          },
          listTemplates: {
            method: 'GET',
            params: {},
            url: '/gitignore/templates',
          },
        },
        interactions: {
          addOrUpdateRestrictionsForOrg: {
            headers: { accept: 'application/vnd.github.sombra-preview+json' },
            method: 'PUT',
            params: {
              limit: {
                enum: [
                  'existing_users',
                  'contributors_only',
                  'collaborators_only',
                ],
                required: true,
                type: 'string',
              },
              org: { required: true, type: 'string' },
            },
            url: '/orgs/:org/interaction-limits',
          },
          addOrUpdateRestrictionsForRepo: {
            headers: { accept: 'application/vnd.github.sombra-preview+json' },
            method: 'PUT',
            params: {
              limit: {
                enum: [
                  'existing_users',
                  'contributors_only',
                  'collaborators_only',
                ],
                required: true,
                type: 'string',
              },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/interaction-limits',
          },
          getRestrictionsForOrg: {
            headers: { accept: 'application/vnd.github.sombra-preview+json' },
            method: 'GET',
            params: { org: { required: true, type: 'string' } },
            url: '/orgs/:org/interaction-limits',
          },
          getRestrictionsForRepo: {
            headers: { accept: 'application/vnd.github.sombra-preview+json' },
            method: 'GET',
            params: {
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/interaction-limits',
          },
          removeRestrictionsForOrg: {
            headers: { accept: 'application/vnd.github.sombra-preview+json' },
            method: 'DELETE',
            params: { org: { required: true, type: 'string' } },
            url: '/orgs/:org/interaction-limits',
          },
          removeRestrictionsForRepo: {
            headers: { accept: 'application/vnd.github.sombra-preview+json' },
            method: 'DELETE',
            params: {
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/interaction-limits',
          },
        },
        issues: {
          addAssignees: {
            method: 'POST',
            params: {
              assignees: { type: 'string[]' },
              issue_number: { required: true, type: 'integer' },
              number: {
                alias: 'issue_number',
                deprecated: true,
                type: 'integer',
              },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/issues/:issue_number/assignees',
          },
          addLabels: {
            method: 'POST',
            params: {
              issue_number: { required: true, type: 'integer' },
              labels: { required: true, type: 'string[]' },
              number: {
                alias: 'issue_number',
                deprecated: true,
                type: 'integer',
              },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/issues/:issue_number/labels',
          },
          checkAssignee: {
            method: 'GET',
            params: {
              assignee: { required: true, type: 'string' },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/assignees/:assignee',
          },
          create: {
            method: 'POST',
            params: {
              assignee: { type: 'string' },
              assignees: { type: 'string[]' },
              body: { type: 'string' },
              labels: { type: 'string[]' },
              milestone: { type: 'integer' },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
              title: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/issues',
          },
          createComment: {
            method: 'POST',
            params: {
              body: { required: true, type: 'string' },
              issue_number: { required: true, type: 'integer' },
              number: {
                alias: 'issue_number',
                deprecated: true,
                type: 'integer',
              },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/issues/:issue_number/comments',
          },
          createLabel: {
            method: 'POST',
            params: {
              color: { required: true, type: 'string' },
              description: { type: 'string' },
              name: { required: true, type: 'string' },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/labels',
          },
          createMilestone: {
            method: 'POST',
            params: {
              description: { type: 'string' },
              due_on: { type: 'string' },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
              state: { enum: ['open', 'closed'], type: 'string' },
              title: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/milestones',
          },
          deleteComment: {
            method: 'DELETE',
            params: {
              comment_id: { required: true, type: 'integer' },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/issues/comments/:comment_id',
          },
          deleteLabel: {
            method: 'DELETE',
            params: {
              name: { required: true, type: 'string' },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/labels/:name',
          },
          deleteMilestone: {
            method: 'DELETE',
            params: {
              milestone_number: { required: true, type: 'integer' },
              number: {
                alias: 'milestone_number',
                deprecated: true,
                type: 'integer',
              },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/milestones/:milestone_number',
          },
          get: {
            method: 'GET',
            params: {
              issue_number: { required: true, type: 'integer' },
              number: {
                alias: 'issue_number',
                deprecated: true,
                type: 'integer',
              },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/issues/:issue_number',
          },
          getComment: {
            method: 'GET',
            params: {
              comment_id: { required: true, type: 'integer' },
              owner: { required: true, type: 'string' },
              page: { type: 'integer' },
              per_page: { type: 'integer' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/issues/comments/:comment_id',
          },
          getEvent: {
            method: 'GET',
            params: {
              event_id: { required: true, type: 'integer' },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/issues/events/:event_id',
          },
          getLabel: {
            method: 'GET',
            params: {
              name: { required: true, type: 'string' },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/labels/:name',
          },
          getMilestone: {
            method: 'GET',
            params: {
              milestone_number: { required: true, type: 'integer' },
              number: {
                alias: 'milestone_number',
                deprecated: true,
                type: 'integer',
              },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/milestones/:milestone_number',
          },
          list: {
            method: 'GET',
            params: {
              direction: { enum: ['asc', 'desc'], type: 'string' },
              filter: {
                enum: ['assigned', 'created', 'mentioned', 'subscribed', 'all'],
                type: 'string',
              },
              labels: { type: 'string' },
              page: { type: 'integer' },
              per_page: { type: 'integer' },
              since: { type: 'string' },
              sort: {
                enum: ['created', 'updated', 'comments'],
                type: 'string',
              },
              state: { enum: ['open', 'closed', 'all'], type: 'string' },
            },
            url: '/issues',
          },
          listAssignees: {
            method: 'GET',
            params: {
              owner: { required: true, type: 'string' },
              page: { type: 'integer' },
              per_page: { type: 'integer' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/assignees',
          },
          listComments: {
            method: 'GET',
            params: {
              issue_number: { required: true, type: 'integer' },
              number: {
                alias: 'issue_number',
                deprecated: true,
                type: 'integer',
              },
              owner: { required: true, type: 'string' },
              page: { type: 'integer' },
              per_page: { type: 'integer' },
              repo: { required: true, type: 'string' },
              since: { type: 'string' },
            },
            url: '/repos/:owner/:repo/issues/:issue_number/comments',
          },
          listCommentsForRepo: {
            method: 'GET',
            params: {
              direction: { enum: ['asc', 'desc'], type: 'string' },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
              since: { type: 'string' },
              sort: { enum: ['created', 'updated'], type: 'string' },
            },
            url: '/repos/:owner/:repo/issues/comments',
          },
          listEvents: {
            method: 'GET',
            params: {
              issue_number: { required: true, type: 'integer' },
              number: {
                alias: 'issue_number',
                deprecated: true,
                type: 'integer',
              },
              owner: { required: true, type: 'string' },
              page: { type: 'integer' },
              per_page: { type: 'integer' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/issues/:issue_number/events',
          },
          listEventsForRepo: {
            method: 'GET',
            params: {
              owner: { required: true, type: 'string' },
              page: { type: 'integer' },
              per_page: { type: 'integer' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/issues/events',
          },
          listEventsForTimeline: {
            headers: {
              accept: 'application/vnd.github.mockingbird-preview+json',
            },
            method: 'GET',
            params: {
              issue_number: { required: true, type: 'integer' },
              number: {
                alias: 'issue_number',
                deprecated: true,
                type: 'integer',
              },
              owner: { required: true, type: 'string' },
              page: { type: 'integer' },
              per_page: { type: 'integer' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/issues/:issue_number/timeline',
          },
          listForAuthenticatedUser: {
            method: 'GET',
            params: {
              direction: { enum: ['asc', 'desc'], type: 'string' },
              filter: {
                enum: ['assigned', 'created', 'mentioned', 'subscribed', 'all'],
                type: 'string',
              },
              labels: { type: 'string' },
              page: { type: 'integer' },
              per_page: { type: 'integer' },
              since: { type: 'string' },
              sort: {
                enum: ['created', 'updated', 'comments'],
                type: 'string',
              },
              state: { enum: ['open', 'closed', 'all'], type: 'string' },
            },
            url: '/user/issues',
          },
          listForOrg: {
            method: 'GET',
            params: {
              direction: { enum: ['asc', 'desc'], type: 'string' },
              filter: {
                enum: ['assigned', 'created', 'mentioned', 'subscribed', 'all'],
                type: 'string',
              },
              labels: { type: 'string' },
              org: { required: true, type: 'string' },
              page: { type: 'integer' },
              per_page: { type: 'integer' },
              since: { type: 'string' },
              sort: {
                enum: ['created', 'updated', 'comments'],
                type: 'string',
              },
              state: { enum: ['open', 'closed', 'all'], type: 'string' },
            },
            url: '/orgs/:org/issues',
          },
          listForRepo: {
            method: 'GET',
            params: {
              assignee: { type: 'string' },
              creator: { type: 'string' },
              direction: { enum: ['asc', 'desc'], type: 'string' },
              labels: { type: 'string' },
              mentioned: { type: 'string' },
              milestone: { type: 'string' },
              owner: { required: true, type: 'string' },
              page: { type: 'integer' },
              per_page: { type: 'integer' },
              repo: { required: true, type: 'string' },
              since: { type: 'string' },
              sort: {
                enum: ['created', 'updated', 'comments'],
                type: 'string',
              },
              state: { enum: ['open', 'closed', 'all'], type: 'string' },
            },
            url: '/repos/:owner/:repo/issues',
          },
          listLabelsForMilestone: {
            method: 'GET',
            params: {
              milestone_number: { required: true, type: 'integer' },
              number: {
                alias: 'milestone_number',
                deprecated: true,
                type: 'integer',
              },
              owner: { required: true, type: 'string' },
              page: { type: 'integer' },
              per_page: { type: 'integer' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/milestones/:milestone_number/labels',
          },
          listLabelsForRepo: {
            method: 'GET',
            params: {
              owner: { required: true, type: 'string' },
              page: { type: 'integer' },
              per_page: { type: 'integer' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/labels',
          },
          listLabelsOnIssue: {
            method: 'GET',
            params: {
              issue_number: { required: true, type: 'integer' },
              number: {
                alias: 'issue_number',
                deprecated: true,
                type: 'integer',
              },
              owner: { required: true, type: 'string' },
              page: { type: 'integer' },
              per_page: { type: 'integer' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/issues/:issue_number/labels',
          },
          listMilestonesForRepo: {
            method: 'GET',
            params: {
              direction: { enum: ['asc', 'desc'], type: 'string' },
              owner: { required: true, type: 'string' },
              page: { type: 'integer' },
              per_page: { type: 'integer' },
              repo: { required: true, type: 'string' },
              sort: { enum: ['due_on', 'completeness'], type: 'string' },
              state: { enum: ['open', 'closed', 'all'], type: 'string' },
            },
            url: '/repos/:owner/:repo/milestones',
          },
          lock: {
            method: 'PUT',
            params: {
              issue_number: { required: true, type: 'integer' },
              lock_reason: {
                enum: ['off-topic', 'too heated', 'resolved', 'spam'],
                type: 'string',
              },
              number: {
                alias: 'issue_number',
                deprecated: true,
                type: 'integer',
              },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/issues/:issue_number/lock',
          },
          removeAssignees: {
            method: 'DELETE',
            params: {
              assignees: { type: 'string[]' },
              issue_number: { required: true, type: 'integer' },
              number: {
                alias: 'issue_number',
                deprecated: true,
                type: 'integer',
              },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/issues/:issue_number/assignees',
          },
          removeLabel: {
            method: 'DELETE',
            params: {
              issue_number: { required: true, type: 'integer' },
              name: { required: true, type: 'string' },
              number: {
                alias: 'issue_number',
                deprecated: true,
                type: 'integer',
              },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/issues/:issue_number/labels/:name',
          },
          removeLabels: {
            method: 'DELETE',
            params: {
              issue_number: { required: true, type: 'integer' },
              number: {
                alias: 'issue_number',
                deprecated: true,
                type: 'integer',
              },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/issues/:issue_number/labels',
          },
          replaceLabels: {
            method: 'PUT',
            params: {
              issue_number: { required: true, type: 'integer' },
              labels: { type: 'string[]' },
              number: {
                alias: 'issue_number',
                deprecated: true,
                type: 'integer',
              },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/issues/:issue_number/labels',
          },
          unlock: {
            method: 'DELETE',
            params: {
              issue_number: { required: true, type: 'integer' },
              number: {
                alias: 'issue_number',
                deprecated: true,
                type: 'integer',
              },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/issues/:issue_number/lock',
          },
          update: {
            method: 'PATCH',
            params: {
              assignee: { type: 'string' },
              assignees: { type: 'string[]' },
              body: { type: 'string' },
              issue_number: { required: true, type: 'integer' },
              labels: { type: 'string[]' },
              milestone: { allowNull: true, type: 'integer' },
              number: {
                alias: 'issue_number',
                deprecated: true,
                type: 'integer',
              },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
              state: { enum: ['open', 'closed'], type: 'string' },
              title: { type: 'string' },
            },
            url: '/repos/:owner/:repo/issues/:issue_number',
          },
          updateComment: {
            method: 'PATCH',
            params: {
              body: { required: true, type: 'string' },
              comment_id: { required: true, type: 'integer' },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/issues/comments/:comment_id',
          },
          updateLabel: {
            method: 'PATCH',
            params: {
              color: { type: 'string' },
              current_name: { required: true, type: 'string' },
              description: { type: 'string' },
              name: { type: 'string' },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/labels/:current_name',
          },
          updateMilestone: {
            method: 'PATCH',
            params: {
              description: { type: 'string' },
              due_on: { type: 'string' },
              milestone_number: { required: true, type: 'integer' },
              number: {
                alias: 'milestone_number',
                deprecated: true,
                type: 'integer',
              },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
              state: { enum: ['open', 'closed'], type: 'string' },
              title: { type: 'string' },
            },
            url: '/repos/:owner/:repo/milestones/:milestone_number',
          },
        },
        licenses: {
          get: {
            method: 'GET',
            params: { license: { required: true, type: 'string' } },
            url: '/licenses/:license',
          },
          getForRepo: {
            method: 'GET',
            params: {
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/license',
          },
          list: {
            deprecated:
              'octokit.licenses.list() has been renamed to octokit.licenses.listCommonlyUsed() (2019-03-05)',
            method: 'GET',
            params: {},
            url: '/licenses',
          },
          listCommonlyUsed: { method: 'GET', params: {}, url: '/licenses' },
        },
        markdown: {
          render: {
            method: 'POST',
            params: {
              context: { type: 'string' },
              mode: { enum: ['markdown', 'gfm'], type: 'string' },
              text: { required: true, type: 'string' },
            },
            url: '/markdown',
          },
          renderRaw: {
            headers: { 'content-type': 'text/plain; charset=utf-8' },
            method: 'POST',
            params: { data: { mapTo: 'data', required: true, type: 'string' } },
            url: '/markdown/raw',
          },
        },
        meta: { get: { method: 'GET', params: {}, url: '/meta' } },
        migrations: {
          cancelImport: {
            headers: {
              accept: 'application/vnd.github.barred-rock-preview+json',
            },
            method: 'DELETE',
            params: {
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/import',
          },
          deleteArchiveForAuthenticatedUser: {
            headers: {
              accept: 'application/vnd.github.wyandotte-preview+json',
            },
            method: 'DELETE',
            params: { migration_id: { required: true, type: 'integer' } },
            url: '/user/migrations/:migration_id/archive',
          },
          deleteArchiveForOrg: {
            headers: {
              accept: 'application/vnd.github.wyandotte-preview+json',
            },
            method: 'DELETE',
            params: {
              migration_id: { required: true, type: 'integer' },
              org: { required: true, type: 'string' },
            },
            url: '/orgs/:org/migrations/:migration_id/archive',
          },
          getArchiveForAuthenticatedUser: {
            headers: {
              accept: 'application/vnd.github.wyandotte-preview+json',
            },
            method: 'GET',
            params: { migration_id: { required: true, type: 'integer' } },
            url: '/user/migrations/:migration_id/archive',
          },
          getArchiveForOrg: {
            headers: {
              accept: 'application/vnd.github.wyandotte-preview+json',
            },
            method: 'GET',
            params: {
              migration_id: { required: true, type: 'integer' },
              org: { required: true, type: 'string' },
            },
            url: '/orgs/:org/migrations/:migration_id/archive',
          },
          getCommitAuthors: {
            headers: {
              accept: 'application/vnd.github.barred-rock-preview+json',
            },
            method: 'GET',
            params: {
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
              since: { type: 'string' },
            },
            url: '/repos/:owner/:repo/import/authors',
          },
          getImportProgress: {
            headers: {
              accept: 'application/vnd.github.barred-rock-preview+json',
            },
            method: 'GET',
            params: {
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/import',
          },
          getLargeFiles: {
            headers: {
              accept: 'application/vnd.github.barred-rock-preview+json',
            },
            method: 'GET',
            params: {
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/import/large_files',
          },
          getStatusForAuthenticatedUser: {
            headers: {
              accept: 'application/vnd.github.wyandotte-preview+json',
            },
            method: 'GET',
            params: { migration_id: { required: true, type: 'integer' } },
            url: '/user/migrations/:migration_id',
          },
          getStatusForOrg: {
            headers: {
              accept: 'application/vnd.github.wyandotte-preview+json',
            },
            method: 'GET',
            params: {
              migration_id: { required: true, type: 'integer' },
              org: { required: true, type: 'string' },
            },
            url: '/orgs/:org/migrations/:migration_id',
          },
          listForAuthenticatedUser: {
            headers: {
              accept: 'application/vnd.github.wyandotte-preview+json',
            },
            method: 'GET',
            params: {
              page: { type: 'integer' },
              per_page: { type: 'integer' },
            },
            url: '/user/migrations',
          },
          listForOrg: {
            headers: {
              accept: 'application/vnd.github.wyandotte-preview+json',
            },
            method: 'GET',
            params: {
              org: { required: true, type: 'string' },
              page: { type: 'integer' },
              per_page: { type: 'integer' },
            },
            url: '/orgs/:org/migrations',
          },
          mapCommitAuthor: {
            headers: {
              accept: 'application/vnd.github.barred-rock-preview+json',
            },
            method: 'PATCH',
            params: {
              author_id: { required: true, type: 'integer' },
              email: { type: 'string' },
              name: { type: 'string' },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/import/authors/:author_id',
          },
          setLfsPreference: {
            headers: {
              accept: 'application/vnd.github.barred-rock-preview+json',
            },
            method: 'PATCH',
            params: {
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
              use_lfs: {
                enum: ['opt_in', 'opt_out'],
                required: true,
                type: 'string',
              },
            },
            url: '/repos/:owner/:repo/import/lfs',
          },
          startForAuthenticatedUser: {
            method: 'POST',
            params: {
              exclude_attachments: { type: 'boolean' },
              lock_repositories: { type: 'boolean' },
              repositories: { required: true, type: 'string[]' },
            },
            url: '/user/migrations',
          },
          startForOrg: {
            method: 'POST',
            params: {
              exclude_attachments: { type: 'boolean' },
              lock_repositories: { type: 'boolean' },
              org: { required: true, type: 'string' },
              repositories: { required: true, type: 'string[]' },
            },
            url: '/orgs/:org/migrations',
          },
          startImport: {
            headers: {
              accept: 'application/vnd.github.barred-rock-preview+json',
            },
            method: 'PUT',
            params: {
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
              tfvc_project: { type: 'string' },
              vcs: {
                enum: ['subversion', 'git', 'mercurial', 'tfvc'],
                type: 'string',
              },
              vcs_password: { type: 'string' },
              vcs_url: { required: true, type: 'string' },
              vcs_username: { type: 'string' },
            },
            url: '/repos/:owner/:repo/import',
          },
          unlockRepoForAuthenticatedUser: {
            headers: {
              accept: 'application/vnd.github.wyandotte-preview+json',
            },
            method: 'DELETE',
            params: {
              migration_id: { required: true, type: 'integer' },
              repo_name: { required: true, type: 'string' },
            },
            url: '/user/migrations/:migration_id/repos/:repo_name/lock',
          },
          unlockRepoForOrg: {
            headers: {
              accept: 'application/vnd.github.wyandotte-preview+json',
            },
            method: 'DELETE',
            params: {
              migration_id: { required: true, type: 'integer' },
              org: { required: true, type: 'string' },
              repo_name: { required: true, type: 'string' },
            },
            url: '/orgs/:org/migrations/:migration_id/repos/:repo_name/lock',
          },
          updateImport: {
            headers: {
              accept: 'application/vnd.github.barred-rock-preview+json',
            },
            method: 'PATCH',
            params: {
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
              vcs_password: { type: 'string' },
              vcs_username: { type: 'string' },
            },
            url: '/repos/:owner/:repo/import',
          },
        },
        oauthAuthorizations: {
          checkAuthorization: {
            deprecated:
              'octokit.oauthAuthorizations.checkAuthorization() has been renamed to octokit.apps.checkAuthorization() (2019-11-05)',
            method: 'GET',
            params: {
              access_token: { required: true, type: 'string' },
              client_id: { required: true, type: 'string' },
            },
            url: '/applications/:client_id/tokens/:access_token',
          },
          createAuthorization: {
            deprecated:
              'octokit.oauthAuthorizations.createAuthorization() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#create-a-new-authorization',
            method: 'POST',
            params: {
              client_id: { type: 'string' },
              client_secret: { type: 'string' },
              fingerprint: { type: 'string' },
              note: { required: true, type: 'string' },
              note_url: { type: 'string' },
              scopes: { type: 'string[]' },
            },
            url: '/authorizations',
          },
          deleteAuthorization: {
            deprecated:
              'octokit.oauthAuthorizations.deleteAuthorization() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#delete-an-authorization',
            method: 'DELETE',
            params: { authorization_id: { required: true, type: 'integer' } },
            url: '/authorizations/:authorization_id',
          },
          deleteGrant: {
            deprecated:
              'octokit.oauthAuthorizations.deleteGrant() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#delete-a-grant',
            method: 'DELETE',
            params: { grant_id: { required: true, type: 'integer' } },
            url: '/applications/grants/:grant_id',
          },
          getAuthorization: {
            deprecated:
              'octokit.oauthAuthorizations.getAuthorization() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#get-a-single-authorization',
            method: 'GET',
            params: { authorization_id: { required: true, type: 'integer' } },
            url: '/authorizations/:authorization_id',
          },
          getGrant: {
            deprecated:
              'octokit.oauthAuthorizations.getGrant() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#get-a-single-grant',
            method: 'GET',
            params: { grant_id: { required: true, type: 'integer' } },
            url: '/applications/grants/:grant_id',
          },
          getOrCreateAuthorizationForApp: {
            deprecated:
              'octokit.oauthAuthorizations.getOrCreateAuthorizationForApp() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#get-or-create-an-authorization-for-a-specific-app',
            method: 'PUT',
            params: {
              client_id: { required: true, type: 'string' },
              client_secret: { required: true, type: 'string' },
              fingerprint: { type: 'string' },
              note: { type: 'string' },
              note_url: { type: 'string' },
              scopes: { type: 'string[]' },
            },
            url: '/authorizations/clients/:client_id',
          },
          getOrCreateAuthorizationForAppAndFingerprint: {
            deprecated:
              'octokit.oauthAuthorizations.getOrCreateAuthorizationForAppAndFingerprint() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#get-or-create-an-authorization-for-a-specific-app-and-fingerprint',
            method: 'PUT',
            params: {
              client_id: { required: true, type: 'string' },
              client_secret: { required: true, type: 'string' },
              fingerprint: { required: true, type: 'string' },
              note: { type: 'string' },
              note_url: { type: 'string' },
              scopes: { type: 'string[]' },
            },
            url: '/authorizations/clients/:client_id/:fingerprint',
          },
          getOrCreateAuthorizationForAppFingerprint: {
            deprecated:
              'octokit.oauthAuthorizations.getOrCreateAuthorizationForAppFingerprint() has been renamed to octokit.oauthAuthorizations.getOrCreateAuthorizationForAppAndFingerprint() (2018-12-27)',
            method: 'PUT',
            params: {
              client_id: { required: true, type: 'string' },
              client_secret: { required: true, type: 'string' },
              fingerprint: { required: true, type: 'string' },
              note: { type: 'string' },
              note_url: { type: 'string' },
              scopes: { type: 'string[]' },
            },
            url: '/authorizations/clients/:client_id/:fingerprint',
          },
          listAuthorizations: {
            deprecated:
              'octokit.oauthAuthorizations.listAuthorizations() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#list-your-authorizations',
            method: 'GET',
            params: {
              page: { type: 'integer' },
              per_page: { type: 'integer' },
            },
            url: '/authorizations',
          },
          listGrants: {
            deprecated:
              'octokit.oauthAuthorizations.listGrants() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#list-your-grants',
            method: 'GET',
            params: {
              page: { type: 'integer' },
              per_page: { type: 'integer' },
            },
            url: '/applications/grants',
          },
          resetAuthorization: {
            deprecated:
              'octokit.oauthAuthorizations.resetAuthorization() has been renamed to octokit.apps.resetAuthorization() (2019-11-05)',
            method: 'POST',
            params: {
              access_token: { required: true, type: 'string' },
              client_id: { required: true, type: 'string' },
            },
            url: '/applications/:client_id/tokens/:access_token',
          },
          revokeAuthorizationForApplication: {
            deprecated:
              'octokit.oauthAuthorizations.revokeAuthorizationForApplication() has been renamed to octokit.apps.revokeAuthorizationForApplication() (2019-11-05)',
            method: 'DELETE',
            params: {
              access_token: { required: true, type: 'string' },
              client_id: { required: true, type: 'string' },
            },
            url: '/applications/:client_id/tokens/:access_token',
          },
          revokeGrantForApplication: {
            deprecated:
              'octokit.oauthAuthorizations.revokeGrantForApplication() has been renamed to octokit.apps.revokeGrantForApplication() (2019-11-05)',
            method: 'DELETE',
            params: {
              access_token: { required: true, type: 'string' },
              client_id: { required: true, type: 'string' },
            },
            url: '/applications/:client_id/grants/:access_token',
          },
          updateAuthorization: {
            deprecated:
              'octokit.oauthAuthorizations.updateAuthorization() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#update-an-existing-authorization',
            method: 'PATCH',
            params: {
              add_scopes: { type: 'string[]' },
              authorization_id: { required: true, type: 'integer' },
              fingerprint: { type: 'string' },
              note: { type: 'string' },
              note_url: { type: 'string' },
              remove_scopes: { type: 'string[]' },
              scopes: { type: 'string[]' },
            },
            url: '/authorizations/:authorization_id',
          },
        },
        orgs: {
          addOrUpdateMembership: {
            method: 'PUT',
            params: {
              org: { required: true, type: 'string' },
              role: { enum: ['admin', 'member'], type: 'string' },
              username: { required: true, type: 'string' },
            },
            url: '/orgs/:org/memberships/:username',
          },
          blockUser: {
            method: 'PUT',
            params: {
              org: { required: true, type: 'string' },
              username: { required: true, type: 'string' },
            },
            url: '/orgs/:org/blocks/:username',
          },
          checkBlockedUser: {
            method: 'GET',
            params: {
              org: { required: true, type: 'string' },
              username: { required: true, type: 'string' },
            },
            url: '/orgs/:org/blocks/:username',
          },
          checkMembership: {
            method: 'GET',
            params: {
              org: { required: true, type: 'string' },
              username: { required: true, type: 'string' },
            },
            url: '/orgs/:org/members/:username',
          },
          checkPublicMembership: {
            method: 'GET',
            params: {
              org: { required: true, type: 'string' },
              username: { required: true, type: 'string' },
            },
            url: '/orgs/:org/public_members/:username',
          },
          concealMembership: {
            method: 'DELETE',
            params: {
              org: { required: true, type: 'string' },
              username: { required: true, type: 'string' },
            },
            url: '/orgs/:org/public_members/:username',
          },
          convertMemberToOutsideCollaborator: {
            method: 'PUT',
            params: {
              org: { required: true, type: 'string' },
              username: { required: true, type: 'string' },
            },
            url: '/orgs/:org/outside_collaborators/:username',
          },
          createHook: {
            method: 'POST',
            params: {
              active: { type: 'boolean' },
              config: { required: true, type: 'object' },
              'config.content_type': { type: 'string' },
              'config.insecure_ssl': { type: 'string' },
              'config.secret': { type: 'string' },
              'config.url': { required: true, type: 'string' },
              events: { type: 'string[]' },
              name: { required: true, type: 'string' },
              org: { required: true, type: 'string' },
            },
            url: '/orgs/:org/hooks',
          },
          createInvitation: {
            method: 'POST',
            params: {
              email: { type: 'string' },
              invitee_id: { type: 'integer' },
              org: { required: true, type: 'string' },
              role: {
                enum: ['admin', 'direct_member', 'billing_manager'],
                type: 'string',
              },
              team_ids: { type: 'integer[]' },
            },
            url: '/orgs/:org/invitations',
          },
          deleteHook: {
            method: 'DELETE',
            params: {
              hook_id: { required: true, type: 'integer' },
              org: { required: true, type: 'string' },
            },
            url: '/orgs/:org/hooks/:hook_id',
          },
          get: {
            method: 'GET',
            params: { org: { required: true, type: 'string' } },
            url: '/orgs/:org',
          },
          getHook: {
            method: 'GET',
            params: {
              hook_id: { required: true, type: 'integer' },
              org: { required: true, type: 'string' },
            },
            url: '/orgs/:org/hooks/:hook_id',
          },
          getMembership: {
            method: 'GET',
            params: {
              org: { required: true, type: 'string' },
              username: { required: true, type: 'string' },
            },
            url: '/orgs/:org/memberships/:username',
          },
          getMembershipForAuthenticatedUser: {
            method: 'GET',
            params: { org: { required: true, type: 'string' } },
            url: '/user/memberships/orgs/:org',
          },
          list: {
            method: 'GET',
            params: {
              page: { type: 'integer' },
              per_page: { type: 'integer' },
              since: { type: 'string' },
            },
            url: '/organizations',
          },
          listBlockedUsers: {
            method: 'GET',
            params: { org: { required: true, type: 'string' } },
            url: '/orgs/:org/blocks',
          },
          listForAuthenticatedUser: {
            method: 'GET',
            params: {
              page: { type: 'integer' },
              per_page: { type: 'integer' },
            },
            url: '/user/orgs',
          },
          listForUser: {
            method: 'GET',
            params: {
              page: { type: 'integer' },
              per_page: { type: 'integer' },
              username: { required: true, type: 'string' },
            },
            url: '/users/:username/orgs',
          },
          listHooks: {
            method: 'GET',
            params: {
              org: { required: true, type: 'string' },
              page: { type: 'integer' },
              per_page: { type: 'integer' },
            },
            url: '/orgs/:org/hooks',
          },
          listInstallations: {
            headers: {
              accept: 'application/vnd.github.machine-man-preview+json',
            },
            method: 'GET',
            params: {
              org: { required: true, type: 'string' },
              page: { type: 'integer' },
              per_page: { type: 'integer' },
            },
            url: '/orgs/:org/installations',
          },
          listInvitationTeams: {
            method: 'GET',
            params: {
              invitation_id: { required: true, type: 'integer' },
              org: { required: true, type: 'string' },
              page: { type: 'integer' },
              per_page: { type: 'integer' },
            },
            url: '/orgs/:org/invitations/:invitation_id/teams',
          },
          listMembers: {
            method: 'GET',
            params: {
              filter: { enum: ['2fa_disabled', 'all'], type: 'string' },
              org: { required: true, type: 'string' },
              page: { type: 'integer' },
              per_page: { type: 'integer' },
              role: { enum: ['all', 'admin', 'member'], type: 'string' },
            },
            url: '/orgs/:org/members',
          },
          listMemberships: {
            method: 'GET',
            params: {
              page: { type: 'integer' },
              per_page: { type: 'integer' },
              state: { enum: ['active', 'pending'], type: 'string' },
            },
            url: '/user/memberships/orgs',
          },
          listOutsideCollaborators: {
            method: 'GET',
            params: {
              filter: { enum: ['2fa_disabled', 'all'], type: 'string' },
              org: { required: true, type: 'string' },
              page: { type: 'integer' },
              per_page: { type: 'integer' },
            },
            url: '/orgs/:org/outside_collaborators',
          },
          listPendingInvitations: {
            method: 'GET',
            params: {
              org: { required: true, type: 'string' },
              page: { type: 'integer' },
              per_page: { type: 'integer' },
            },
            url: '/orgs/:org/invitations',
          },
          listPublicMembers: {
            method: 'GET',
            params: {
              org: { required: true, type: 'string' },
              page: { type: 'integer' },
              per_page: { type: 'integer' },
            },
            url: '/orgs/:org/public_members',
          },
          pingHook: {
            method: 'POST',
            params: {
              hook_id: { required: true, type: 'integer' },
              org: { required: true, type: 'string' },
            },
            url: '/orgs/:org/hooks/:hook_id/pings',
          },
          publicizeMembership: {
            method: 'PUT',
            params: {
              org: { required: true, type: 'string' },
              username: { required: true, type: 'string' },
            },
            url: '/orgs/:org/public_members/:username',
          },
          removeMember: {
            method: 'DELETE',
            params: {
              org: { required: true, type: 'string' },
              username: { required: true, type: 'string' },
            },
            url: '/orgs/:org/members/:username',
          },
          removeMembership: {
            method: 'DELETE',
            params: {
              org: { required: true, type: 'string' },
              username: { required: true, type: 'string' },
            },
            url: '/orgs/:org/memberships/:username',
          },
          removeOutsideCollaborator: {
            method: 'DELETE',
            params: {
              org: { required: true, type: 'string' },
              username: { required: true, type: 'string' },
            },
            url: '/orgs/:org/outside_collaborators/:username',
          },
          unblockUser: {
            method: 'DELETE',
            params: {
              org: { required: true, type: 'string' },
              username: { required: true, type: 'string' },
            },
            url: '/orgs/:org/blocks/:username',
          },
          update: {
            method: 'PATCH',
            params: {
              billing_email: { type: 'string' },
              company: { type: 'string' },
              default_repository_permission: {
                enum: ['read', 'write', 'admin', 'none'],
                type: 'string',
              },
              description: { type: 'string' },
              email: { type: 'string' },
              has_organization_projects: { type: 'boolean' },
              has_repository_projects: { type: 'boolean' },
              location: { type: 'string' },
              members_allowed_repository_creation_type: {
                enum: ['all', 'private', 'none'],
                type: 'string',
              },
              members_can_create_repositories: { type: 'boolean' },
              name: { type: 'string' },
              org: { required: true, type: 'string' },
            },
            url: '/orgs/:org',
          },
          updateHook: {
            method: 'PATCH',
            params: {
              active: { type: 'boolean' },
              config: { type: 'object' },
              'config.content_type': { type: 'string' },
              'config.insecure_ssl': { type: 'string' },
              'config.secret': { type: 'string' },
              'config.url': { required: true, type: 'string' },
              events: { type: 'string[]' },
              hook_id: { required: true, type: 'integer' },
              org: { required: true, type: 'string' },
            },
            url: '/orgs/:org/hooks/:hook_id',
          },
          updateMembership: {
            method: 'PATCH',
            params: {
              org: { required: true, type: 'string' },
              state: { enum: ['active'], required: true, type: 'string' },
            },
            url: '/user/memberships/orgs/:org',
          },
        },
        projects: {
          addCollaborator: {
            headers: { accept: 'application/vnd.github.inertia-preview+json' },
            method: 'PUT',
            params: {
              permission: { enum: ['read', 'write', 'admin'], type: 'string' },
              project_id: { required: true, type: 'integer' },
              username: { required: true, type: 'string' },
            },
            url: '/projects/:project_id/collaborators/:username',
          },
          createCard: {
            headers: { accept: 'application/vnd.github.inertia-preview+json' },
            method: 'POST',
            params: {
              column_id: { required: true, type: 'integer' },
              content_id: { type: 'integer' },
              content_type: { type: 'string' },
              note: { type: 'string' },
            },
            url: '/projects/columns/:column_id/cards',
          },
          createColumn: {
            headers: { accept: 'application/vnd.github.inertia-preview+json' },
            method: 'POST',
            params: {
              name: { required: true, type: 'string' },
              project_id: { required: true, type: 'integer' },
            },
            url: '/projects/:project_id/columns',
          },
          createForAuthenticatedUser: {
            headers: { accept: 'application/vnd.github.inertia-preview+json' },
            method: 'POST',
            params: {
              body: { type: 'string' },
              name: { required: true, type: 'string' },
            },
            url: '/user/projects',
          },
          createForOrg: {
            headers: { accept: 'application/vnd.github.inertia-preview+json' },
            method: 'POST',
            params: {
              body: { type: 'string' },
              name: { required: true, type: 'string' },
              org: { required: true, type: 'string' },
            },
            url: '/orgs/:org/projects',
          },
          createForRepo: {
            headers: { accept: 'application/vnd.github.inertia-preview+json' },
            method: 'POST',
            params: {
              body: { type: 'string' },
              name: { required: true, type: 'string' },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/projects',
          },
          delete: {
            headers: { accept: 'application/vnd.github.inertia-preview+json' },
            method: 'DELETE',
            params: { project_id: { required: true, type: 'integer' } },
            url: '/projects/:project_id',
          },
          deleteCard: {
            headers: { accept: 'application/vnd.github.inertia-preview+json' },
            method: 'DELETE',
            params: { card_id: { required: true, type: 'integer' } },
            url: '/projects/columns/cards/:card_id',
          },
          deleteColumn: {
            headers: { accept: 'application/vnd.github.inertia-preview+json' },
            method: 'DELETE',
            params: { column_id: { required: true, type: 'integer' } },
            url: '/projects/columns/:column_id',
          },
          get: {
            headers: { accept: 'application/vnd.github.inertia-preview+json' },
            method: 'GET',
            params: {
              page: { type: 'integer' },
              per_page: { type: 'integer' },
              project_id: { required: true, type: 'integer' },
            },
            url: '/projects/:project_id',
          },
          getCard: {
            headers: { accept: 'application/vnd.github.inertia-preview+json' },
            method: 'GET',
            params: { card_id: { required: true, type: 'integer' } },
            url: '/projects/columns/cards/:card_id',
          },
          getColumn: {
            headers: { accept: 'application/vnd.github.inertia-preview+json' },
            method: 'GET',
            params: { column_id: { required: true, type: 'integer' } },
            url: '/projects/columns/:column_id',
          },
          listCards: {
            headers: { accept: 'application/vnd.github.inertia-preview+json' },
            method: 'GET',
            params: {
              archived_state: {
                enum: ['all', 'archived', 'not_archived'],
                type: 'string',
              },
              column_id: { required: true, type: 'integer' },
              page: { type: 'integer' },
              per_page: { type: 'integer' },
            },
            url: '/projects/columns/:column_id/cards',
          },
          listCollaborators: {
            headers: { accept: 'application/vnd.github.inertia-preview+json' },
            method: 'GET',
            params: {
              affiliation: {
                enum: ['outside', 'direct', 'all'],
                type: 'string',
              },
              page: { type: 'integer' },
              per_page: { type: 'integer' },
              project_id: { required: true, type: 'integer' },
            },
            url: '/projects/:project_id/collaborators',
          },
          listColumns: {
            headers: { accept: 'application/vnd.github.inertia-preview+json' },
            method: 'GET',
            params: {
              page: { type: 'integer' },
              per_page: { type: 'integer' },
              project_id: { required: true, type: 'integer' },
            },
            url: '/projects/:project_id/columns',
          },
          listForOrg: {
            headers: { accept: 'application/vnd.github.inertia-preview+json' },
            method: 'GET',
            params: {
              org: { required: true, type: 'string' },
              page: { type: 'integer' },
              per_page: { type: 'integer' },
              state: { enum: ['open', 'closed', 'all'], type: 'string' },
            },
            url: '/orgs/:org/projects',
          },
          listForRepo: {
            headers: { accept: 'application/vnd.github.inertia-preview+json' },
            method: 'GET',
            params: {
              owner: { required: true, type: 'string' },
              page: { type: 'integer' },
              per_page: { type: 'integer' },
              repo: { required: true, type: 'string' },
              state: { enum: ['open', 'closed', 'all'], type: 'string' },
            },
            url: '/repos/:owner/:repo/projects',
          },
          listForUser: {
            headers: { accept: 'application/vnd.github.inertia-preview+json' },
            method: 'GET',
            params: {
              page: { type: 'integer' },
              per_page: { type: 'integer' },
              state: { enum: ['open', 'closed', 'all'], type: 'string' },
              username: { required: true, type: 'string' },
            },
            url: '/users/:username/projects',
          },
          moveCard: {
            headers: { accept: 'application/vnd.github.inertia-preview+json' },
            method: 'POST',
            params: {
              card_id: { required: true, type: 'integer' },
              column_id: { type: 'integer' },
              position: {
                required: true,
                type: 'string',
                validation: '^(top|bottom|after:\\d+)$',
              },
            },
            url: '/projects/columns/cards/:card_id/moves',
          },
          moveColumn: {
            headers: { accept: 'application/vnd.github.inertia-preview+json' },
            method: 'POST',
            params: {
              column_id: { required: true, type: 'integer' },
              position: {
                required: true,
                type: 'string',
                validation: '^(first|last|after:\\d+)$',
              },
            },
            url: '/projects/columns/:column_id/moves',
          },
          removeCollaborator: {
            headers: { accept: 'application/vnd.github.inertia-preview+json' },
            method: 'DELETE',
            params: {
              project_id: { required: true, type: 'integer' },
              username: { required: true, type: 'string' },
            },
            url: '/projects/:project_id/collaborators/:username',
          },
          reviewUserPermissionLevel: {
            headers: { accept: 'application/vnd.github.inertia-preview+json' },
            method: 'GET',
            params: {
              project_id: { required: true, type: 'integer' },
              username: { required: true, type: 'string' },
            },
            url: '/projects/:project_id/collaborators/:username/permission',
          },
          update: {
            headers: { accept: 'application/vnd.github.inertia-preview+json' },
            method: 'PATCH',
            params: {
              body: { type: 'string' },
              name: { type: 'string' },
              organization_permission: { type: 'string' },
              private: { type: 'boolean' },
              project_id: { required: true, type: 'integer' },
              state: { enum: ['open', 'closed'], type: 'string' },
            },
            url: '/projects/:project_id',
          },
          updateCard: {
            headers: { accept: 'application/vnd.github.inertia-preview+json' },
            method: 'PATCH',
            params: {
              archived: { type: 'boolean' },
              card_id: { required: true, type: 'integer' },
              note: { type: 'string' },
            },
            url: '/projects/columns/cards/:card_id',
          },
          updateColumn: {
            headers: { accept: 'application/vnd.github.inertia-preview+json' },
            method: 'PATCH',
            params: {
              column_id: { required: true, type: 'integer' },
              name: { required: true, type: 'string' },
            },
            url: '/projects/columns/:column_id',
          },
        },
        pulls: {
          checkIfMerged: {
            method: 'GET',
            params: {
              number: {
                alias: 'pull_number',
                deprecated: true,
                type: 'integer',
              },
              owner: { required: true, type: 'string' },
              pull_number: { required: true, type: 'integer' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/pulls/:pull_number/merge',
          },
          create: {
            method: 'POST',
            params: {
              base: { required: true, type: 'string' },
              body: { type: 'string' },
              draft: { type: 'boolean' },
              head: { required: true, type: 'string' },
              maintainer_can_modify: { type: 'boolean' },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
              title: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/pulls',
          },
          createComment: {
            method: 'POST',
            params: {
              body: { required: true, type: 'string' },
              commit_id: { required: true, type: 'string' },
              in_reply_to: {
                deprecated: true,
                description:
                  'The comment ID to reply to. **Note**: This must be the ID of a top-level comment, not a reply to that comment. Replies to replies are not supported.',
                type: 'integer',
              },
              line: { type: 'integer' },
              number: {
                alias: 'pull_number',
                deprecated: true,
                type: 'integer',
              },
              owner: { required: true, type: 'string' },
              path: { required: true, type: 'string' },
              position: { type: 'integer' },
              pull_number: { required: true, type: 'integer' },
              repo: { required: true, type: 'string' },
              side: { enum: ['LEFT', 'RIGHT'], type: 'string' },
              start_line: { type: 'integer' },
              start_side: { enum: ['LEFT', 'RIGHT', 'side'], type: 'string' },
            },
            url: '/repos/:owner/:repo/pulls/:pull_number/comments',
          },
          createCommentReply: {
            deprecated:
              'octokit.pulls.createCommentReply() has been renamed to octokit.pulls.createComment() (2019-09-09)',
            method: 'POST',
            params: {
              body: { required: true, type: 'string' },
              commit_id: { required: true, type: 'string' },
              in_reply_to: {
                deprecated: true,
                description:
                  'The comment ID to reply to. **Note**: This must be the ID of a top-level comment, not a reply to that comment. Replies to replies are not supported.',
                type: 'integer',
              },
              line: { type: 'integer' },
              number: {
                alias: 'pull_number',
                deprecated: true,
                type: 'integer',
              },
              owner: { required: true, type: 'string' },
              path: { required: true, type: 'string' },
              position: { type: 'integer' },
              pull_number: { required: true, type: 'integer' },
              repo: { required: true, type: 'string' },
              side: { enum: ['LEFT', 'RIGHT'], type: 'string' },
              start_line: { type: 'integer' },
              start_side: { enum: ['LEFT', 'RIGHT', 'side'], type: 'string' },
            },
            url: '/repos/:owner/:repo/pulls/:pull_number/comments',
          },
          createFromIssue: {
            deprecated:
              'octokit.pulls.createFromIssue() is deprecated, see https://developer.github.com/v3/pulls/#create-a-pull-request',
            method: 'POST',
            params: {
              base: { required: true, type: 'string' },
              draft: { type: 'boolean' },
              head: { required: true, type: 'string' },
              issue: { required: true, type: 'integer' },
              maintainer_can_modify: { type: 'boolean' },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/pulls',
          },
          createReview: {
            method: 'POST',
            params: {
              body: { type: 'string' },
              comments: { type: 'object[]' },
              'comments[].body': { required: true, type: 'string' },
              'comments[].path': { required: true, type: 'string' },
              'comments[].position': { required: true, type: 'integer' },
              commit_id: { type: 'string' },
              event: {
                enum: ['APPROVE', 'REQUEST_CHANGES', 'COMMENT'],
                type: 'string',
              },
              number: {
                alias: 'pull_number',
                deprecated: true,
                type: 'integer',
              },
              owner: { required: true, type: 'string' },
              pull_number: { required: true, type: 'integer' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/pulls/:pull_number/reviews',
          },
          createReviewCommentReply: {
            method: 'POST',
            params: {
              body: { required: true, type: 'string' },
              comment_id: { required: true, type: 'integer' },
              owner: { required: true, type: 'string' },
              pull_number: { required: true, type: 'integer' },
              repo: { required: true, type: 'string' },
            },
            url:
              '/repos/:owner/:repo/pulls/:pull_number/comments/:comment_id/replies',
          },
          createReviewRequest: {
            method: 'POST',
            params: {
              number: {
                alias: 'pull_number',
                deprecated: true,
                type: 'integer',
              },
              owner: { required: true, type: 'string' },
              pull_number: { required: true, type: 'integer' },
              repo: { required: true, type: 'string' },
              reviewers: { type: 'string[]' },
              team_reviewers: { type: 'string[]' },
            },
            url: '/repos/:owner/:repo/pulls/:pull_number/requested_reviewers',
          },
          deleteComment: {
            method: 'DELETE',
            params: {
              comment_id: { required: true, type: 'integer' },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/pulls/comments/:comment_id',
          },
          deletePendingReview: {
            method: 'DELETE',
            params: {
              number: {
                alias: 'pull_number',
                deprecated: true,
                type: 'integer',
              },
              owner: { required: true, type: 'string' },
              pull_number: { required: true, type: 'integer' },
              repo: { required: true, type: 'string' },
              review_id: { required: true, type: 'integer' },
            },
            url: '/repos/:owner/:repo/pulls/:pull_number/reviews/:review_id',
          },
          deleteReviewRequest: {
            method: 'DELETE',
            params: {
              number: {
                alias: 'pull_number',
                deprecated: true,
                type: 'integer',
              },
              owner: { required: true, type: 'string' },
              pull_number: { required: true, type: 'integer' },
              repo: { required: true, type: 'string' },
              reviewers: { type: 'string[]' },
              team_reviewers: { type: 'string[]' },
            },
            url: '/repos/:owner/:repo/pulls/:pull_number/requested_reviewers',
          },
          dismissReview: {
            method: 'PUT',
            params: {
              message: { required: true, type: 'string' },
              number: {
                alias: 'pull_number',
                deprecated: true,
                type: 'integer',
              },
              owner: { required: true, type: 'string' },
              pull_number: { required: true, type: 'integer' },
              repo: { required: true, type: 'string' },
              review_id: { required: true, type: 'integer' },
            },
            url:
              '/repos/:owner/:repo/pulls/:pull_number/reviews/:review_id/dismissals',
          },
          get: {
            method: 'GET',
            params: {
              number: {
                alias: 'pull_number',
                deprecated: true,
                type: 'integer',
              },
              owner: { required: true, type: 'string' },
              pull_number: { required: true, type: 'integer' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/pulls/:pull_number',
          },
          getComment: {
            method: 'GET',
            params: {
              comment_id: { required: true, type: 'integer' },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/pulls/comments/:comment_id',
          },
          getCommentsForReview: {
            method: 'GET',
            params: {
              number: {
                alias: 'pull_number',
                deprecated: true,
                type: 'integer',
              },
              owner: { required: true, type: 'string' },
              page: { type: 'integer' },
              per_page: { type: 'integer' },
              pull_number: { required: true, type: 'integer' },
              repo: { required: true, type: 'string' },
              review_id: { required: true, type: 'integer' },
            },
            url:
              '/repos/:owner/:repo/pulls/:pull_number/reviews/:review_id/comments',
          },
          getReview: {
            method: 'GET',
            params: {
              number: {
                alias: 'pull_number',
                deprecated: true,
                type: 'integer',
              },
              owner: { required: true, type: 'string' },
              pull_number: { required: true, type: 'integer' },
              repo: { required: true, type: 'string' },
              review_id: { required: true, type: 'integer' },
            },
            url: '/repos/:owner/:repo/pulls/:pull_number/reviews/:review_id',
          },
          list: {
            method: 'GET',
            params: {
              base: { type: 'string' },
              direction: { enum: ['asc', 'desc'], type: 'string' },
              head: { type: 'string' },
              owner: { required: true, type: 'string' },
              page: { type: 'integer' },
              per_page: { type: 'integer' },
              repo: { required: true, type: 'string' },
              sort: {
                enum: ['created', 'updated', 'popularity', 'long-running'],
                type: 'string',
              },
              state: { enum: ['open', 'closed', 'all'], type: 'string' },
            },
            url: '/repos/:owner/:repo/pulls',
          },
          listComments: {
            method: 'GET',
            params: {
              direction: { enum: ['asc', 'desc'], type: 'string' },
              number: {
                alias: 'pull_number',
                deprecated: true,
                type: 'integer',
              },
              owner: { required: true, type: 'string' },
              page: { type: 'integer' },
              per_page: { type: 'integer' },
              pull_number: { required: true, type: 'integer' },
              repo: { required: true, type: 'string' },
              since: { type: 'string' },
              sort: { enum: ['created', 'updated'], type: 'string' },
            },
            url: '/repos/:owner/:repo/pulls/:pull_number/comments',
          },
          listCommentsForRepo: {
            method: 'GET',
            params: {
              direction: { enum: ['asc', 'desc'], type: 'string' },
              owner: { required: true, type: 'string' },
              page: { type: 'integer' },
              per_page: { type: 'integer' },
              repo: { required: true, type: 'string' },
              since: { type: 'string' },
              sort: { enum: ['created', 'updated'], type: 'string' },
            },
            url: '/repos/:owner/:repo/pulls/comments',
          },
          listCommits: {
            method: 'GET',
            params: {
              number: {
                alias: 'pull_number',
                deprecated: true,
                type: 'integer',
              },
              owner: { required: true, type: 'string' },
              page: { type: 'integer' },
              per_page: { type: 'integer' },
              pull_number: { required: true, type: 'integer' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/pulls/:pull_number/commits',
          },
          listFiles: {
            method: 'GET',
            params: {
              number: {
                alias: 'pull_number',
                deprecated: true,
                type: 'integer',
              },
              owner: { required: true, type: 'string' },
              page: { type: 'integer' },
              per_page: { type: 'integer' },
              pull_number: { required: true, type: 'integer' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/pulls/:pull_number/files',
          },
          listReviewRequests: {
            method: 'GET',
            params: {
              number: {
                alias: 'pull_number',
                deprecated: true,
                type: 'integer',
              },
              owner: { required: true, type: 'string' },
              page: { type: 'integer' },
              per_page: { type: 'integer' },
              pull_number: { required: true, type: 'integer' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/pulls/:pull_number/requested_reviewers',
          },
          listReviews: {
            method: 'GET',
            params: {
              number: {
                alias: 'pull_number',
                deprecated: true,
                type: 'integer',
              },
              owner: { required: true, type: 'string' },
              page: { type: 'integer' },
              per_page: { type: 'integer' },
              pull_number: { required: true, type: 'integer' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/pulls/:pull_number/reviews',
          },
          merge: {
            method: 'PUT',
            params: {
              commit_message: { type: 'string' },
              commit_title: { type: 'string' },
              merge_method: {
                enum: ['merge', 'squash', 'rebase'],
                type: 'string',
              },
              number: {
                alias: 'pull_number',
                deprecated: true,
                type: 'integer',
              },
              owner: { required: true, type: 'string' },
              pull_number: { required: true, type: 'integer' },
              repo: { required: true, type: 'string' },
              sha: { type: 'string' },
            },
            url: '/repos/:owner/:repo/pulls/:pull_number/merge',
          },
          submitReview: {
            method: 'POST',
            params: {
              body: { type: 'string' },
              event: {
                enum: ['APPROVE', 'REQUEST_CHANGES', 'COMMENT'],
                required: true,
                type: 'string',
              },
              number: {
                alias: 'pull_number',
                deprecated: true,
                type: 'integer',
              },
              owner: { required: true, type: 'string' },
              pull_number: { required: true, type: 'integer' },
              repo: { required: true, type: 'string' },
              review_id: { required: true, type: 'integer' },
            },
            url:
              '/repos/:owner/:repo/pulls/:pull_number/reviews/:review_id/events',
          },
          update: {
            method: 'PATCH',
            params: {
              base: { type: 'string' },
              body: { type: 'string' },
              maintainer_can_modify: { type: 'boolean' },
              number: {
                alias: 'pull_number',
                deprecated: true,
                type: 'integer',
              },
              owner: { required: true, type: 'string' },
              pull_number: { required: true, type: 'integer' },
              repo: { required: true, type: 'string' },
              state: { enum: ['open', 'closed'], type: 'string' },
              title: { type: 'string' },
            },
            url: '/repos/:owner/:repo/pulls/:pull_number',
          },
          updateBranch: {
            headers: { accept: 'application/vnd.github.lydian-preview+json' },
            method: 'PUT',
            params: {
              expected_head_sha: { type: 'string' },
              owner: { required: true, type: 'string' },
              pull_number: { required: true, type: 'integer' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/pulls/:pull_number/update-branch',
          },
          updateComment: {
            method: 'PATCH',
            params: {
              body: { required: true, type: 'string' },
              comment_id: { required: true, type: 'integer' },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/pulls/comments/:comment_id',
          },
          updateReview: {
            method: 'PUT',
            params: {
              body: { required: true, type: 'string' },
              number: {
                alias: 'pull_number',
                deprecated: true,
                type: 'integer',
              },
              owner: { required: true, type: 'string' },
              pull_number: { required: true, type: 'integer' },
              repo: { required: true, type: 'string' },
              review_id: { required: true, type: 'integer' },
            },
            url: '/repos/:owner/:repo/pulls/:pull_number/reviews/:review_id',
          },
        },
        rateLimit: { get: { method: 'GET', params: {}, url: '/rate_limit' } },
        reactions: {
          createForCommitComment: {
            headers: {
              accept: 'application/vnd.github.squirrel-girl-preview+json',
            },
            method: 'POST',
            params: {
              comment_id: { required: true, type: 'integer' },
              content: {
                enum: [
                  '+1',
                  '-1',
                  'laugh',
                  'confused',
                  'heart',
                  'hooray',
                  'rocket',
                  'eyes',
                ],
                required: true,
                type: 'string',
              },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/comments/:comment_id/reactions',
          },
          createForIssue: {
            headers: {
              accept: 'application/vnd.github.squirrel-girl-preview+json',
            },
            method: 'POST',
            params: {
              content: {
                enum: [
                  '+1',
                  '-1',
                  'laugh',
                  'confused',
                  'heart',
                  'hooray',
                  'rocket',
                  'eyes',
                ],
                required: true,
                type: 'string',
              },
              issue_number: { required: true, type: 'integer' },
              number: {
                alias: 'issue_number',
                deprecated: true,
                type: 'integer',
              },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/issues/:issue_number/reactions',
          },
          createForIssueComment: {
            headers: {
              accept: 'application/vnd.github.squirrel-girl-preview+json',
            },
            method: 'POST',
            params: {
              comment_id: { required: true, type: 'integer' },
              content: {
                enum: [
                  '+1',
                  '-1',
                  'laugh',
                  'confused',
                  'heart',
                  'hooray',
                  'rocket',
                  'eyes',
                ],
                required: true,
                type: 'string',
              },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/issues/comments/:comment_id/reactions',
          },
          createForPullRequestReviewComment: {
            headers: {
              accept: 'application/vnd.github.squirrel-girl-preview+json',
            },
            method: 'POST',
            params: {
              comment_id: { required: true, type: 'integer' },
              content: {
                enum: [
                  '+1',
                  '-1',
                  'laugh',
                  'confused',
                  'heart',
                  'hooray',
                  'rocket',
                  'eyes',
                ],
                required: true,
                type: 'string',
              },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/pulls/comments/:comment_id/reactions',
          },
          createForTeamDiscussion: {
            headers: {
              accept:
                'application/vnd.github.echo-preview+json,application/vnd.github.squirrel-girl-preview+json',
            },
            method: 'POST',
            params: {
              content: {
                enum: [
                  '+1',
                  '-1',
                  'laugh',
                  'confused',
                  'heart',
                  'hooray',
                  'rocket',
                  'eyes',
                ],
                required: true,
                type: 'string',
              },
              discussion_number: { required: true, type: 'integer' },
              team_id: { required: true, type: 'integer' },
            },
            url: '/teams/:team_id/discussions/:discussion_number/reactions',
          },
          createForTeamDiscussionComment: {
            headers: {
              accept:
                'application/vnd.github.echo-preview+json,application/vnd.github.squirrel-girl-preview+json',
            },
            method: 'POST',
            params: {
              comment_number: { required: true, type: 'integer' },
              content: {
                enum: [
                  '+1',
                  '-1',
                  'laugh',
                  'confused',
                  'heart',
                  'hooray',
                  'rocket',
                  'eyes',
                ],
                required: true,
                type: 'string',
              },
              discussion_number: { required: true, type: 'integer' },
              team_id: { required: true, type: 'integer' },
            },
            url:
              '/teams/:team_id/discussions/:discussion_number/comments/:comment_number/reactions',
          },
          delete: {
            headers: {
              accept:
                'application/vnd.github.echo-preview+json,application/vnd.github.squirrel-girl-preview+json',
            },
            method: 'DELETE',
            params: { reaction_id: { required: true, type: 'integer' } },
            url: '/reactions/:reaction_id',
          },
          listForCommitComment: {
            headers: {
              accept: 'application/vnd.github.squirrel-girl-preview+json',
            },
            method: 'GET',
            params: {
              comment_id: { required: true, type: 'integer' },
              content: {
                enum: [
                  '+1',
                  '-1',
                  'laugh',
                  'confused',
                  'heart',
                  'hooray',
                  'rocket',
                  'eyes',
                ],
                type: 'string',
              },
              owner: { required: true, type: 'string' },
              page: { type: 'integer' },
              per_page: { type: 'integer' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/comments/:comment_id/reactions',
          },
          listForIssue: {
            headers: {
              accept: 'application/vnd.github.squirrel-girl-preview+json',
            },
            method: 'GET',
            params: {
              content: {
                enum: [
                  '+1',
                  '-1',
                  'laugh',
                  'confused',
                  'heart',
                  'hooray',
                  'rocket',
                  'eyes',
                ],
                type: 'string',
              },
              issue_number: { required: true, type: 'integer' },
              number: {
                alias: 'issue_number',
                deprecated: true,
                type: 'integer',
              },
              owner: { required: true, type: 'string' },
              page: { type: 'integer' },
              per_page: { type: 'integer' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/issues/:issue_number/reactions',
          },
          listForIssueComment: {
            headers: {
              accept: 'application/vnd.github.squirrel-girl-preview+json',
            },
            method: 'GET',
            params: {
              comment_id: { required: true, type: 'integer' },
              content: {
                enum: [
                  '+1',
                  '-1',
                  'laugh',
                  'confused',
                  'heart',
                  'hooray',
                  'rocket',
                  'eyes',
                ],
                type: 'string',
              },
              owner: { required: true, type: 'string' },
              page: { type: 'integer' },
              per_page: { type: 'integer' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/issues/comments/:comment_id/reactions',
          },
          listForPullRequestReviewComment: {
            headers: {
              accept: 'application/vnd.github.squirrel-girl-preview+json',
            },
            method: 'GET',
            params: {
              comment_id: { required: true, type: 'integer' },
              content: {
                enum: [
                  '+1',
                  '-1',
                  'laugh',
                  'confused',
                  'heart',
                  'hooray',
                  'rocket',
                  'eyes',
                ],
                type: 'string',
              },
              owner: { required: true, type: 'string' },
              page: { type: 'integer' },
              per_page: { type: 'integer' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/pulls/comments/:comment_id/reactions',
          },
          listForTeamDiscussion: {
            headers: {
              accept:
                'application/vnd.github.echo-preview+json,application/vnd.github.squirrel-girl-preview+json',
            },
            method: 'GET',
            params: {
              content: {
                enum: [
                  '+1',
                  '-1',
                  'laugh',
                  'confused',
                  'heart',
                  'hooray',
                  'rocket',
                  'eyes',
                ],
                type: 'string',
              },
              discussion_number: { required: true, type: 'integer' },
              page: { type: 'integer' },
              per_page: { type: 'integer' },
              team_id: { required: true, type: 'integer' },
            },
            url: '/teams/:team_id/discussions/:discussion_number/reactions',
          },
          listForTeamDiscussionComment: {
            headers: {
              accept:
                'application/vnd.github.echo-preview+json,application/vnd.github.squirrel-girl-preview+json',
            },
            method: 'GET',
            params: {
              comment_number: { required: true, type: 'integer' },
              content: {
                enum: [
                  '+1',
                  '-1',
                  'laugh',
                  'confused',
                  'heart',
                  'hooray',
                  'rocket',
                  'eyes',
                ],
                type: 'string',
              },
              discussion_number: { required: true, type: 'integer' },
              page: { type: 'integer' },
              per_page: { type: 'integer' },
              team_id: { required: true, type: 'integer' },
            },
            url:
              '/teams/:team_id/discussions/:discussion_number/comments/:comment_number/reactions',
          },
        },
        repos: {
          acceptInvitation: {
            method: 'PATCH',
            params: { invitation_id: { required: true, type: 'integer' } },
            url: '/user/repository_invitations/:invitation_id',
          },
          addCollaborator: {
            method: 'PUT',
            params: {
              owner: { required: true, type: 'string' },
              permission: { enum: ['pull', 'push', 'admin'], type: 'string' },
              repo: { required: true, type: 'string' },
              username: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/collaborators/:username',
          },
          addDeployKey: {
            method: 'POST',
            params: {
              key: { required: true, type: 'string' },
              owner: { required: true, type: 'string' },
              read_only: { type: 'boolean' },
              repo: { required: true, type: 'string' },
              title: { type: 'string' },
            },
            url: '/repos/:owner/:repo/keys',
          },
          addProtectedBranchAdminEnforcement: {
            method: 'POST',
            params: {
              branch: { required: true, type: 'string' },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url:
              '/repos/:owner/:repo/branches/:branch/protection/enforce_admins',
          },
          addProtectedBranchAppRestrictions: {
            method: 'POST',
            params: {
              apps: { mapTo: 'data', required: true, type: 'string[]' },
              branch: { required: true, type: 'string' },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url:
              '/repos/:owner/:repo/branches/:branch/protection/restrictions/apps',
          },
          addProtectedBranchRequiredSignatures: {
            headers: { accept: 'application/vnd.github.zzzax-preview+json' },
            method: 'POST',
            params: {
              branch: { required: true, type: 'string' },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url:
              '/repos/:owner/:repo/branches/:branch/protection/required_signatures',
          },
          addProtectedBranchRequiredStatusChecksContexts: {
            method: 'POST',
            params: {
              branch: { required: true, type: 'string' },
              contexts: { mapTo: 'data', required: true, type: 'string[]' },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url:
              '/repos/:owner/:repo/branches/:branch/protection/required_status_checks/contexts',
          },
          addProtectedBranchTeamRestrictions: {
            method: 'POST',
            params: {
              branch: { required: true, type: 'string' },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
              teams: { mapTo: 'data', required: true, type: 'string[]' },
            },
            url:
              '/repos/:owner/:repo/branches/:branch/protection/restrictions/teams',
          },
          addProtectedBranchUserRestrictions: {
            method: 'POST',
            params: {
              branch: { required: true, type: 'string' },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
              users: { mapTo: 'data', required: true, type: 'string[]' },
            },
            url:
              '/repos/:owner/:repo/branches/:branch/protection/restrictions/users',
          },
          checkCollaborator: {
            method: 'GET',
            params: {
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
              username: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/collaborators/:username',
          },
          checkVulnerabilityAlerts: {
            headers: { accept: 'application/vnd.github.dorian-preview+json' },
            method: 'GET',
            params: {
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/vulnerability-alerts',
          },
          compareCommits: {
            method: 'GET',
            params: {
              base: { required: true, type: 'string' },
              head: { required: true, type: 'string' },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/compare/:base...:head',
          },
          createCommitComment: {
            method: 'POST',
            params: {
              body: { required: true, type: 'string' },
              commit_sha: { required: true, type: 'string' },
              line: { type: 'integer' },
              owner: { required: true, type: 'string' },
              path: { type: 'string' },
              position: { type: 'integer' },
              repo: { required: true, type: 'string' },
              sha: { alias: 'commit_sha', deprecated: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/commits/:commit_sha/comments',
          },
          createDeployment: {
            method: 'POST',
            params: {
              auto_merge: { type: 'boolean' },
              description: { type: 'string' },
              environment: { type: 'string' },
              owner: { required: true, type: 'string' },
              payload: { type: 'string' },
              production_environment: { type: 'boolean' },
              ref: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
              required_contexts: { type: 'string[]' },
              task: { type: 'string' },
              transient_environment: { type: 'boolean' },
            },
            url: '/repos/:owner/:repo/deployments',
          },
          createDeploymentStatus: {
            method: 'POST',
            params: {
              auto_inactive: { type: 'boolean' },
              deployment_id: { required: true, type: 'integer' },
              description: { type: 'string' },
              environment: {
                enum: ['production', 'staging', 'qa'],
                type: 'string',
              },
              environment_url: { type: 'string' },
              log_url: { type: 'string' },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
              state: {
                enum: [
                  'error',
                  'failure',
                  'inactive',
                  'in_progress',
                  'queued',
                  'pending',
                  'success',
                ],
                required: true,
                type: 'string',
              },
              target_url: { type: 'string' },
            },
            url: '/repos/:owner/:repo/deployments/:deployment_id/statuses',
          },
          createDispatchEvent: {
            headers: { accept: 'application/vnd.github.everest-preview+json' },
            method: 'POST',
            params: {
              client_payload: { type: 'object' },
              event_type: { type: 'string' },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/dispatches',
          },
          createFile: {
            deprecated:
              'octokit.repos.createFile() has been renamed to octokit.repos.createOrUpdateFile() (2019-06-07)',
            method: 'PUT',
            params: {
              author: { type: 'object' },
              'author.email': { required: true, type: 'string' },
              'author.name': { required: true, type: 'string' },
              branch: { type: 'string' },
              committer: { type: 'object' },
              'committer.email': { required: true, type: 'string' },
              'committer.name': { required: true, type: 'string' },
              content: { required: true, type: 'string' },
              message: { required: true, type: 'string' },
              owner: { required: true, type: 'string' },
              path: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
              sha: { type: 'string' },
            },
            url: '/repos/:owner/:repo/contents/:path',
          },
          createForAuthenticatedUser: {
            method: 'POST',
            params: {
              allow_merge_commit: { type: 'boolean' },
              allow_rebase_merge: { type: 'boolean' },
              allow_squash_merge: { type: 'boolean' },
              auto_init: { type: 'boolean' },
              description: { type: 'string' },
              gitignore_template: { type: 'string' },
              has_issues: { type: 'boolean' },
              has_projects: { type: 'boolean' },
              has_wiki: { type: 'boolean' },
              homepage: { type: 'string' },
              is_template: { type: 'boolean' },
              license_template: { type: 'string' },
              name: { required: true, type: 'string' },
              private: { type: 'boolean' },
              team_id: { type: 'integer' },
            },
            url: '/user/repos',
          },
          createFork: {
            method: 'POST',
            params: {
              organization: { type: 'string' },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/forks',
          },
          createHook: {
            method: 'POST',
            params: {
              active: { type: 'boolean' },
              config: { required: true, type: 'object' },
              'config.content_type': { type: 'string' },
              'config.insecure_ssl': { type: 'string' },
              'config.secret': { type: 'string' },
              'config.url': { required: true, type: 'string' },
              events: { type: 'string[]' },
              name: { type: 'string' },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/hooks',
          },
          createInOrg: {
            method: 'POST',
            params: {
              allow_merge_commit: { type: 'boolean' },
              allow_rebase_merge: { type: 'boolean' },
              allow_squash_merge: { type: 'boolean' },
              auto_init: { type: 'boolean' },
              description: { type: 'string' },
              gitignore_template: { type: 'string' },
              has_issues: { type: 'boolean' },
              has_projects: { type: 'boolean' },
              has_wiki: { type: 'boolean' },
              homepage: { type: 'string' },
              is_template: { type: 'boolean' },
              license_template: { type: 'string' },
              name: { required: true, type: 'string' },
              org: { required: true, type: 'string' },
              private: { type: 'boolean' },
              team_id: { type: 'integer' },
            },
            url: '/orgs/:org/repos',
          },
          createOrUpdateFile: {
            method: 'PUT',
            params: {
              author: { type: 'object' },
              'author.email': { required: true, type: 'string' },
              'author.name': { required: true, type: 'string' },
              branch: { type: 'string' },
              committer: { type: 'object' },
              'committer.email': { required: true, type: 'string' },
              'committer.name': { required: true, type: 'string' },
              content: { required: true, type: 'string' },
              message: { required: true, type: 'string' },
              owner: { required: true, type: 'string' },
              path: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
              sha: { type: 'string' },
            },
            url: '/repos/:owner/:repo/contents/:path',
          },
          createRelease: {
            method: 'POST',
            params: {
              body: { type: 'string' },
              draft: { type: 'boolean' },
              name: { type: 'string' },
              owner: { required: true, type: 'string' },
              prerelease: { type: 'boolean' },
              repo: { required: true, type: 'string' },
              tag_name: { required: true, type: 'string' },
              target_commitish: { type: 'string' },
            },
            url: '/repos/:owner/:repo/releases',
          },
          createStatus: {
            method: 'POST',
            params: {
              context: { type: 'string' },
              description: { type: 'string' },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
              sha: { required: true, type: 'string' },
              state: {
                enum: ['error', 'failure', 'pending', 'success'],
                required: true,
                type: 'string',
              },
              target_url: { type: 'string' },
            },
            url: '/repos/:owner/:repo/statuses/:sha',
          },
          createUsingTemplate: {
            headers: { accept: 'application/vnd.github.baptiste-preview+json' },
            method: 'POST',
            params: {
              description: { type: 'string' },
              name: { required: true, type: 'string' },
              owner: { type: 'string' },
              private: { type: 'boolean' },
              template_owner: { required: true, type: 'string' },
              template_repo: { required: true, type: 'string' },
            },
            url: '/repos/:template_owner/:template_repo/generate',
          },
          declineInvitation: {
            method: 'DELETE',
            params: { invitation_id: { required: true, type: 'integer' } },
            url: '/user/repository_invitations/:invitation_id',
          },
          delete: {
            method: 'DELETE',
            params: {
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo',
          },
          deleteCommitComment: {
            method: 'DELETE',
            params: {
              comment_id: { required: true, type: 'integer' },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/comments/:comment_id',
          },
          deleteDownload: {
            method: 'DELETE',
            params: {
              download_id: { required: true, type: 'integer' },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/downloads/:download_id',
          },
          deleteFile: {
            method: 'DELETE',
            params: {
              author: { type: 'object' },
              'author.email': { type: 'string' },
              'author.name': { type: 'string' },
              branch: { type: 'string' },
              committer: { type: 'object' },
              'committer.email': { type: 'string' },
              'committer.name': { type: 'string' },
              message: { required: true, type: 'string' },
              owner: { required: true, type: 'string' },
              path: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
              sha: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/contents/:path',
          },
          deleteHook: {
            method: 'DELETE',
            params: {
              hook_id: { required: true, type: 'integer' },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/hooks/:hook_id',
          },
          deleteInvitation: {
            method: 'DELETE',
            params: {
              invitation_id: { required: true, type: 'integer' },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/invitations/:invitation_id',
          },
          deleteRelease: {
            method: 'DELETE',
            params: {
              owner: { required: true, type: 'string' },
              release_id: { required: true, type: 'integer' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/releases/:release_id',
          },
          deleteReleaseAsset: {
            method: 'DELETE',
            params: {
              asset_id: { required: true, type: 'integer' },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/releases/assets/:asset_id',
          },
          disableAutomatedSecurityFixes: {
            headers: { accept: 'application/vnd.github.london-preview+json' },
            method: 'DELETE',
            params: {
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/automated-security-fixes',
          },
          disablePagesSite: {
            headers: {
              accept: 'application/vnd.github.switcheroo-preview+json',
            },
            method: 'DELETE',
            params: {
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/pages',
          },
          disableVulnerabilityAlerts: {
            headers: { accept: 'application/vnd.github.dorian-preview+json' },
            method: 'DELETE',
            params: {
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/vulnerability-alerts',
          },
          enableAutomatedSecurityFixes: {
            headers: { accept: 'application/vnd.github.london-preview+json' },
            method: 'PUT',
            params: {
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/automated-security-fixes',
          },
          enablePagesSite: {
            headers: {
              accept: 'application/vnd.github.switcheroo-preview+json',
            },
            method: 'POST',
            params: {
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
              source: { type: 'object' },
              'source.branch': { enum: ['master', 'gh-pages'], type: 'string' },
              'source.path': { type: 'string' },
            },
            url: '/repos/:owner/:repo/pages',
          },
          enableVulnerabilityAlerts: {
            headers: { accept: 'application/vnd.github.dorian-preview+json' },
            method: 'PUT',
            params: {
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/vulnerability-alerts',
          },
          get: {
            method: 'GET',
            params: {
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo',
          },
          getAppsWithAccessToProtectedBranch: {
            method: 'GET',
            params: {
              branch: { required: true, type: 'string' },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url:
              '/repos/:owner/:repo/branches/:branch/protection/restrictions/apps',
          },
          getArchiveLink: {
            method: 'GET',
            params: {
              archive_format: { required: true, type: 'string' },
              owner: { required: true, type: 'string' },
              ref: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/:archive_format/:ref',
          },
          getBranch: {
            method: 'GET',
            params: {
              branch: { required: true, type: 'string' },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/branches/:branch',
          },
          getBranchProtection: {
            method: 'GET',
            params: {
              branch: { required: true, type: 'string' },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/branches/:branch/protection',
          },
          getClones: {
            method: 'GET',
            params: {
              owner: { required: true, type: 'string' },
              per: { enum: ['day', 'week'], type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/traffic/clones',
          },
          getCodeFrequencyStats: {
            method: 'GET',
            params: {
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/stats/code_frequency',
          },
          getCollaboratorPermissionLevel: {
            method: 'GET',
            params: {
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
              username: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/collaborators/:username/permission',
          },
          getCombinedStatusForRef: {
            method: 'GET',
            params: {
              owner: { required: true, type: 'string' },
              ref: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/commits/:ref/status',
          },
          getCommit: {
            method: 'GET',
            params: {
              commit_sha: { alias: 'ref', deprecated: true, type: 'string' },
              owner: { required: true, type: 'string' },
              ref: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
              sha: { alias: 'ref', deprecated: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/commits/:ref',
          },
          getCommitActivityStats: {
            method: 'GET',
            params: {
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/stats/commit_activity',
          },
          getCommitComment: {
            method: 'GET',
            params: {
              comment_id: { required: true, type: 'integer' },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/comments/:comment_id',
          },
          getCommitRefSha: {
            deprecated:
              'octokit.repos.getCommitRefSha() is deprecated, see https://developer.github.com/v3/repos/commits/#get-a-single-commit',
            headers: { accept: 'application/vnd.github.v3.sha' },
            method: 'GET',
            params: {
              owner: { required: true, type: 'string' },
              ref: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/commits/:ref',
          },
          getContents: {
            method: 'GET',
            params: {
              owner: { required: true, type: 'string' },
              path: { required: true, type: 'string' },
              ref: { type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/contents/:path',
          },
          getContributorsStats: {
            method: 'GET',
            params: {
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/stats/contributors',
          },
          getDeployKey: {
            method: 'GET',
            params: {
              key_id: { required: true, type: 'integer' },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/keys/:key_id',
          },
          getDeployment: {
            method: 'GET',
            params: {
              deployment_id: { required: true, type: 'integer' },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/deployments/:deployment_id',
          },
          getDeploymentStatus: {
            method: 'GET',
            params: {
              deployment_id: { required: true, type: 'integer' },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
              status_id: { required: true, type: 'integer' },
            },
            url:
              '/repos/:owner/:repo/deployments/:deployment_id/statuses/:status_id',
          },
          getDownload: {
            method: 'GET',
            params: {
              download_id: { required: true, type: 'integer' },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/downloads/:download_id',
          },
          getHook: {
            method: 'GET',
            params: {
              hook_id: { required: true, type: 'integer' },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/hooks/:hook_id',
          },
          getLatestPagesBuild: {
            method: 'GET',
            params: {
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/pages/builds/latest',
          },
          getLatestRelease: {
            method: 'GET',
            params: {
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/releases/latest',
          },
          getPages: {
            method: 'GET',
            params: {
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/pages',
          },
          getPagesBuild: {
            method: 'GET',
            params: {
              build_id: { required: true, type: 'integer' },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/pages/builds/:build_id',
          },
          getParticipationStats: {
            method: 'GET',
            params: {
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/stats/participation',
          },
          getProtectedBranchAdminEnforcement: {
            method: 'GET',
            params: {
              branch: { required: true, type: 'string' },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url:
              '/repos/:owner/:repo/branches/:branch/protection/enforce_admins',
          },
          getProtectedBranchPullRequestReviewEnforcement: {
            method: 'GET',
            params: {
              branch: { required: true, type: 'string' },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url:
              '/repos/:owner/:repo/branches/:branch/protection/required_pull_request_reviews',
          },
          getProtectedBranchRequiredSignatures: {
            headers: { accept: 'application/vnd.github.zzzax-preview+json' },
            method: 'GET',
            params: {
              branch: { required: true, type: 'string' },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url:
              '/repos/:owner/:repo/branches/:branch/protection/required_signatures',
          },
          getProtectedBranchRequiredStatusChecks: {
            method: 'GET',
            params: {
              branch: { required: true, type: 'string' },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url:
              '/repos/:owner/:repo/branches/:branch/protection/required_status_checks',
          },
          getProtectedBranchRestrictions: {
            method: 'GET',
            params: {
              branch: { required: true, type: 'string' },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/branches/:branch/protection/restrictions',
          },
          getPunchCardStats: {
            method: 'GET',
            params: {
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/stats/punch_card',
          },
          getReadme: {
            method: 'GET',
            params: {
              owner: { required: true, type: 'string' },
              ref: { type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/readme',
          },
          getRelease: {
            method: 'GET',
            params: {
              owner: { required: true, type: 'string' },
              release_id: { required: true, type: 'integer' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/releases/:release_id',
          },
          getReleaseAsset: {
            method: 'GET',
            params: {
              asset_id: { required: true, type: 'integer' },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/releases/assets/:asset_id',
          },
          getReleaseByTag: {
            method: 'GET',
            params: {
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
              tag: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/releases/tags/:tag',
          },
          getTeamsWithAccessToProtectedBranch: {
            method: 'GET',
            params: {
              branch: { required: true, type: 'string' },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url:
              '/repos/:owner/:repo/branches/:branch/protection/restrictions/teams',
          },
          getTopPaths: {
            method: 'GET',
            params: {
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/traffic/popular/paths',
          },
          getTopReferrers: {
            method: 'GET',
            params: {
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/traffic/popular/referrers',
          },
          getUsersWithAccessToProtectedBranch: {
            method: 'GET',
            params: {
              branch: { required: true, type: 'string' },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url:
              '/repos/:owner/:repo/branches/:branch/protection/restrictions/users',
          },
          getViews: {
            method: 'GET',
            params: {
              owner: { required: true, type: 'string' },
              per: { enum: ['day', 'week'], type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/traffic/views',
          },
          list: {
            method: 'GET',
            params: {
              affiliation: { type: 'string' },
              direction: { enum: ['asc', 'desc'], type: 'string' },
              page: { type: 'integer' },
              per_page: { type: 'integer' },
              sort: {
                enum: ['created', 'updated', 'pushed', 'full_name'],
                type: 'string',
              },
              type: {
                enum: ['all', 'owner', 'public', 'private', 'member'],
                type: 'string',
              },
              visibility: {
                enum: ['all', 'public', 'private'],
                type: 'string',
              },
            },
            url: '/user/repos',
          },
          listAppsWithAccessToProtectedBranch: {
            deprecated:
              'octokit.repos.listAppsWithAccessToProtectedBranch() has been renamed to octokit.repos.getAppsWithAccessToProtectedBranch() (2019-09-13)',
            method: 'GET',
            params: {
              branch: { required: true, type: 'string' },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url:
              '/repos/:owner/:repo/branches/:branch/protection/restrictions/apps',
          },
          listAssetsForRelease: {
            method: 'GET',
            params: {
              owner: { required: true, type: 'string' },
              page: { type: 'integer' },
              per_page: { type: 'integer' },
              release_id: { required: true, type: 'integer' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/releases/:release_id/assets',
          },
          listBranches: {
            method: 'GET',
            params: {
              owner: { required: true, type: 'string' },
              page: { type: 'integer' },
              per_page: { type: 'integer' },
              protected: { type: 'boolean' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/branches',
          },
          listBranchesForHeadCommit: {
            headers: { accept: 'application/vnd.github.groot-preview+json' },
            method: 'GET',
            params: {
              commit_sha: { required: true, type: 'string' },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/commits/:commit_sha/branches-where-head',
          },
          listCollaborators: {
            method: 'GET',
            params: {
              affiliation: {
                enum: ['outside', 'direct', 'all'],
                type: 'string',
              },
              owner: { required: true, type: 'string' },
              page: { type: 'integer' },
              per_page: { type: 'integer' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/collaborators',
          },
          listCommentsForCommit: {
            method: 'GET',
            params: {
              commit_sha: { required: true, type: 'string' },
              owner: { required: true, type: 'string' },
              page: { type: 'integer' },
              per_page: { type: 'integer' },
              ref: { alias: 'commit_sha', deprecated: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/commits/:commit_sha/comments',
          },
          listCommitComments: {
            method: 'GET',
            params: {
              owner: { required: true, type: 'string' },
              page: { type: 'integer' },
              per_page: { type: 'integer' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/comments',
          },
          listCommits: {
            method: 'GET',
            params: {
              author: { type: 'string' },
              owner: { required: true, type: 'string' },
              page: { type: 'integer' },
              path: { type: 'string' },
              per_page: { type: 'integer' },
              repo: { required: true, type: 'string' },
              sha: { type: 'string' },
              since: { type: 'string' },
              until: { type: 'string' },
            },
            url: '/repos/:owner/:repo/commits',
          },
          listContributors: {
            method: 'GET',
            params: {
              anon: { type: 'string' },
              owner: { required: true, type: 'string' },
              page: { type: 'integer' },
              per_page: { type: 'integer' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/contributors',
          },
          listDeployKeys: {
            method: 'GET',
            params: {
              owner: { required: true, type: 'string' },
              page: { type: 'integer' },
              per_page: { type: 'integer' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/keys',
          },
          listDeploymentStatuses: {
            method: 'GET',
            params: {
              deployment_id: { required: true, type: 'integer' },
              owner: { required: true, type: 'string' },
              page: { type: 'integer' },
              per_page: { type: 'integer' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/deployments/:deployment_id/statuses',
          },
          listDeployments: {
            method: 'GET',
            params: {
              environment: { type: 'string' },
              owner: { required: true, type: 'string' },
              page: { type: 'integer' },
              per_page: { type: 'integer' },
              ref: { type: 'string' },
              repo: { required: true, type: 'string' },
              sha: { type: 'string' },
              task: { type: 'string' },
            },
            url: '/repos/:owner/:repo/deployments',
          },
          listDownloads: {
            method: 'GET',
            params: {
              owner: { required: true, type: 'string' },
              page: { type: 'integer' },
              per_page: { type: 'integer' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/downloads',
          },
          listForOrg: {
            method: 'GET',
            params: {
              direction: { enum: ['asc', 'desc'], type: 'string' },
              org: { required: true, type: 'string' },
              page: { type: 'integer' },
              per_page: { type: 'integer' },
              sort: {
                enum: ['created', 'updated', 'pushed', 'full_name'],
                type: 'string',
              },
              type: {
                enum: [
                  'all',
                  'public',
                  'private',
                  'forks',
                  'sources',
                  'member',
                ],
                type: 'string',
              },
            },
            url: '/orgs/:org/repos',
          },
          listForUser: {
            method: 'GET',
            params: {
              direction: { enum: ['asc', 'desc'], type: 'string' },
              page: { type: 'integer' },
              per_page: { type: 'integer' },
              sort: {
                enum: ['created', 'updated', 'pushed', 'full_name'],
                type: 'string',
              },
              type: { enum: ['all', 'owner', 'member'], type: 'string' },
              username: { required: true, type: 'string' },
            },
            url: '/users/:username/repos',
          },
          listForks: {
            method: 'GET',
            params: {
              owner: { required: true, type: 'string' },
              page: { type: 'integer' },
              per_page: { type: 'integer' },
              repo: { required: true, type: 'string' },
              sort: {
                enum: ['newest', 'oldest', 'stargazers'],
                type: 'string',
              },
            },
            url: '/repos/:owner/:repo/forks',
          },
          listHooks: {
            method: 'GET',
            params: {
              owner: { required: true, type: 'string' },
              page: { type: 'integer' },
              per_page: { type: 'integer' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/hooks',
          },
          listInvitations: {
            method: 'GET',
            params: {
              owner: { required: true, type: 'string' },
              page: { type: 'integer' },
              per_page: { type: 'integer' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/invitations',
          },
          listInvitationsForAuthenticatedUser: {
            method: 'GET',
            params: {
              page: { type: 'integer' },
              per_page: { type: 'integer' },
            },
            url: '/user/repository_invitations',
          },
          listLanguages: {
            method: 'GET',
            params: {
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/languages',
          },
          listPagesBuilds: {
            method: 'GET',
            params: {
              owner: { required: true, type: 'string' },
              page: { type: 'integer' },
              per_page: { type: 'integer' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/pages/builds',
          },
          listProtectedBranchRequiredStatusChecksContexts: {
            method: 'GET',
            params: {
              branch: { required: true, type: 'string' },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url:
              '/repos/:owner/:repo/branches/:branch/protection/required_status_checks/contexts',
          },
          listProtectedBranchTeamRestrictions: {
            deprecated:
              'octokit.repos.listProtectedBranchTeamRestrictions() has been renamed to octokit.repos.getTeamsWithAccessToProtectedBranch() (2019-09-09)',
            method: 'GET',
            params: {
              branch: { required: true, type: 'string' },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url:
              '/repos/:owner/:repo/branches/:branch/protection/restrictions/teams',
          },
          listProtectedBranchUserRestrictions: {
            deprecated:
              'octokit.repos.listProtectedBranchUserRestrictions() has been renamed to octokit.repos.getUsersWithAccessToProtectedBranch() (2019-09-09)',
            method: 'GET',
            params: {
              branch: { required: true, type: 'string' },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url:
              '/repos/:owner/:repo/branches/:branch/protection/restrictions/users',
          },
          listPublic: {
            method: 'GET',
            params: {
              page: { type: 'integer' },
              per_page: { type: 'integer' },
              since: { type: 'string' },
            },
            url: '/repositories',
          },
          listPullRequestsAssociatedWithCommit: {
            headers: { accept: 'application/vnd.github.groot-preview+json' },
            method: 'GET',
            params: {
              commit_sha: { required: true, type: 'string' },
              owner: { required: true, type: 'string' },
              page: { type: 'integer' },
              per_page: { type: 'integer' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/commits/:commit_sha/pulls',
          },
          listReleases: {
            method: 'GET',
            params: {
              owner: { required: true, type: 'string' },
              page: { type: 'integer' },
              per_page: { type: 'integer' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/releases',
          },
          listStatusesForRef: {
            method: 'GET',
            params: {
              owner: { required: true, type: 'string' },
              page: { type: 'integer' },
              per_page: { type: 'integer' },
              ref: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/commits/:ref/statuses',
          },
          listTags: {
            method: 'GET',
            params: {
              owner: { required: true, type: 'string' },
              page: { type: 'integer' },
              per_page: { type: 'integer' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/tags',
          },
          listTeams: {
            method: 'GET',
            params: {
              owner: { required: true, type: 'string' },
              page: { type: 'integer' },
              per_page: { type: 'integer' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/teams',
          },
          listTeamsWithAccessToProtectedBranch: {
            deprecated:
              'octokit.repos.listTeamsWithAccessToProtectedBranch() has been renamed to octokit.repos.getTeamsWithAccessToProtectedBranch() (2019-09-13)',
            method: 'GET',
            params: {
              branch: { required: true, type: 'string' },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url:
              '/repos/:owner/:repo/branches/:branch/protection/restrictions/teams',
          },
          listTopics: {
            headers: { accept: 'application/vnd.github.mercy-preview+json' },
            method: 'GET',
            params: {
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/topics',
          },
          listUsersWithAccessToProtectedBranch: {
            deprecated:
              'octokit.repos.listUsersWithAccessToProtectedBranch() has been renamed to octokit.repos.getUsersWithAccessToProtectedBranch() (2019-09-13)',
            method: 'GET',
            params: {
              branch: { required: true, type: 'string' },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url:
              '/repos/:owner/:repo/branches/:branch/protection/restrictions/users',
          },
          merge: {
            method: 'POST',
            params: {
              base: { required: true, type: 'string' },
              commit_message: { type: 'string' },
              head: { required: true, type: 'string' },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/merges',
          },
          pingHook: {
            method: 'POST',
            params: {
              hook_id: { required: true, type: 'integer' },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/hooks/:hook_id/pings',
          },
          removeBranchProtection: {
            method: 'DELETE',
            params: {
              branch: { required: true, type: 'string' },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/branches/:branch/protection',
          },
          removeCollaborator: {
            method: 'DELETE',
            params: {
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
              username: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/collaborators/:username',
          },
          removeDeployKey: {
            method: 'DELETE',
            params: {
              key_id: { required: true, type: 'integer' },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/keys/:key_id',
          },
          removeProtectedBranchAdminEnforcement: {
            method: 'DELETE',
            params: {
              branch: { required: true, type: 'string' },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url:
              '/repos/:owner/:repo/branches/:branch/protection/enforce_admins',
          },
          removeProtectedBranchAppRestrictions: {
            method: 'DELETE',
            params: {
              apps: { mapTo: 'data', required: true, type: 'string[]' },
              branch: { required: true, type: 'string' },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url:
              '/repos/:owner/:repo/branches/:branch/protection/restrictions/apps',
          },
          removeProtectedBranchPullRequestReviewEnforcement: {
            method: 'DELETE',
            params: {
              branch: { required: true, type: 'string' },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url:
              '/repos/:owner/:repo/branches/:branch/protection/required_pull_request_reviews',
          },
          removeProtectedBranchRequiredSignatures: {
            headers: { accept: 'application/vnd.github.zzzax-preview+json' },
            method: 'DELETE',
            params: {
              branch: { required: true, type: 'string' },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url:
              '/repos/:owner/:repo/branches/:branch/protection/required_signatures',
          },
          removeProtectedBranchRequiredStatusChecks: {
            method: 'DELETE',
            params: {
              branch: { required: true, type: 'string' },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url:
              '/repos/:owner/:repo/branches/:branch/protection/required_status_checks',
          },
          removeProtectedBranchRequiredStatusChecksContexts: {
            method: 'DELETE',
            params: {
              branch: { required: true, type: 'string' },
              contexts: { mapTo: 'data', required: true, type: 'string[]' },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url:
              '/repos/:owner/:repo/branches/:branch/protection/required_status_checks/contexts',
          },
          removeProtectedBranchRestrictions: {
            method: 'DELETE',
            params: {
              branch: { required: true, type: 'string' },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/branches/:branch/protection/restrictions',
          },
          removeProtectedBranchTeamRestrictions: {
            method: 'DELETE',
            params: {
              branch: { required: true, type: 'string' },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
              teams: { mapTo: 'data', required: true, type: 'string[]' },
            },
            url:
              '/repos/:owner/:repo/branches/:branch/protection/restrictions/teams',
          },
          removeProtectedBranchUserRestrictions: {
            method: 'DELETE',
            params: {
              branch: { required: true, type: 'string' },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
              users: { mapTo: 'data', required: true, type: 'string[]' },
            },
            url:
              '/repos/:owner/:repo/branches/:branch/protection/restrictions/users',
          },
          replaceProtectedBranchAppRestrictions: {
            method: 'PUT',
            params: {
              apps: { mapTo: 'data', required: true, type: 'string[]' },
              branch: { required: true, type: 'string' },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url:
              '/repos/:owner/:repo/branches/:branch/protection/restrictions/apps',
          },
          replaceProtectedBranchRequiredStatusChecksContexts: {
            method: 'PUT',
            params: {
              branch: { required: true, type: 'string' },
              contexts: { mapTo: 'data', required: true, type: 'string[]' },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url:
              '/repos/:owner/:repo/branches/:branch/protection/required_status_checks/contexts',
          },
          replaceProtectedBranchTeamRestrictions: {
            method: 'PUT',
            params: {
              branch: { required: true, type: 'string' },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
              teams: { mapTo: 'data', required: true, type: 'string[]' },
            },
            url:
              '/repos/:owner/:repo/branches/:branch/protection/restrictions/teams',
          },
          replaceProtectedBranchUserRestrictions: {
            method: 'PUT',
            params: {
              branch: { required: true, type: 'string' },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
              users: { mapTo: 'data', required: true, type: 'string[]' },
            },
            url:
              '/repos/:owner/:repo/branches/:branch/protection/restrictions/users',
          },
          replaceTopics: {
            headers: { accept: 'application/vnd.github.mercy-preview+json' },
            method: 'PUT',
            params: {
              names: { required: true, type: 'string[]' },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/topics',
          },
          requestPageBuild: {
            method: 'POST',
            params: {
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/pages/builds',
          },
          retrieveCommunityProfileMetrics: {
            method: 'GET',
            params: {
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/community/profile',
          },
          testPushHook: {
            method: 'POST',
            params: {
              hook_id: { required: true, type: 'integer' },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/hooks/:hook_id/tests',
          },
          transfer: {
            headers: {
              accept: 'application/vnd.github.nightshade-preview+json',
            },
            method: 'POST',
            params: {
              new_owner: { type: 'string' },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
              team_ids: { type: 'integer[]' },
            },
            url: '/repos/:owner/:repo/transfer',
          },
          update: {
            method: 'PATCH',
            params: {
              allow_merge_commit: { type: 'boolean' },
              allow_rebase_merge: { type: 'boolean' },
              allow_squash_merge: { type: 'boolean' },
              archived: { type: 'boolean' },
              default_branch: { type: 'string' },
              description: { type: 'string' },
              has_issues: { type: 'boolean' },
              has_projects: { type: 'boolean' },
              has_wiki: { type: 'boolean' },
              homepage: { type: 'string' },
              is_template: { type: 'boolean' },
              name: { type: 'string' },
              owner: { required: true, type: 'string' },
              private: { type: 'boolean' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo',
          },
          updateBranchProtection: {
            method: 'PUT',
            params: {
              branch: { required: true, type: 'string' },
              enforce_admins: {
                allowNull: true,
                required: true,
                type: 'boolean',
              },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
              required_pull_request_reviews: {
                allowNull: true,
                required: true,
                type: 'object',
              },
              'required_pull_request_reviews.dismiss_stale_reviews': {
                type: 'boolean',
              },
              'required_pull_request_reviews.dismissal_restrictions': {
                type: 'object',
              },
              'required_pull_request_reviews.dismissal_restrictions.teams': {
                type: 'string[]',
              },
              'required_pull_request_reviews.dismissal_restrictions.users': {
                type: 'string[]',
              },
              'required_pull_request_reviews.require_code_owner_reviews': {
                type: 'boolean',
              },
              'required_pull_request_reviews.required_approving_review_count': {
                type: 'integer',
              },
              required_status_checks: {
                allowNull: true,
                required: true,
                type: 'object',
              },
              'required_status_checks.contexts': {
                required: true,
                type: 'string[]',
              },
              'required_status_checks.strict': {
                required: true,
                type: 'boolean',
              },
              restrictions: { allowNull: true, required: true, type: 'object' },
              'restrictions.apps': { type: 'string[]' },
              'restrictions.teams': { required: true, type: 'string[]' },
              'restrictions.users': { required: true, type: 'string[]' },
            },
            url: '/repos/:owner/:repo/branches/:branch/protection',
          },
          updateCommitComment: {
            method: 'PATCH',
            params: {
              body: { required: true, type: 'string' },
              comment_id: { required: true, type: 'integer' },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/comments/:comment_id',
          },
          updateFile: {
            deprecated:
              'octokit.repos.updateFile() has been renamed to octokit.repos.createOrUpdateFile() (2019-06-07)',
            method: 'PUT',
            params: {
              author: { type: 'object' },
              'author.email': { required: true, type: 'string' },
              'author.name': { required: true, type: 'string' },
              branch: { type: 'string' },
              committer: { type: 'object' },
              'committer.email': { required: true, type: 'string' },
              'committer.name': { required: true, type: 'string' },
              content: { required: true, type: 'string' },
              message: { required: true, type: 'string' },
              owner: { required: true, type: 'string' },
              path: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
              sha: { type: 'string' },
            },
            url: '/repos/:owner/:repo/contents/:path',
          },
          updateHook: {
            method: 'PATCH',
            params: {
              active: { type: 'boolean' },
              add_events: { type: 'string[]' },
              config: { type: 'object' },
              'config.content_type': { type: 'string' },
              'config.insecure_ssl': { type: 'string' },
              'config.secret': { type: 'string' },
              'config.url': { required: true, type: 'string' },
              events: { type: 'string[]' },
              hook_id: { required: true, type: 'integer' },
              owner: { required: true, type: 'string' },
              remove_events: { type: 'string[]' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/hooks/:hook_id',
          },
          updateInformationAboutPagesSite: {
            method: 'PUT',
            params: {
              cname: { type: 'string' },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
              source: {
                enum: ['"gh-pages"', '"master"', '"master /docs"'],
                type: 'string',
              },
            },
            url: '/repos/:owner/:repo/pages',
          },
          updateInvitation: {
            method: 'PATCH',
            params: {
              invitation_id: { required: true, type: 'integer' },
              owner: { required: true, type: 'string' },
              permissions: { enum: ['read', 'write', 'admin'], type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/invitations/:invitation_id',
          },
          updateProtectedBranchPullRequestReviewEnforcement: {
            method: 'PATCH',
            params: {
              branch: { required: true, type: 'string' },
              dismiss_stale_reviews: { type: 'boolean' },
              dismissal_restrictions: { type: 'object' },
              'dismissal_restrictions.teams': { type: 'string[]' },
              'dismissal_restrictions.users': { type: 'string[]' },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
              require_code_owner_reviews: { type: 'boolean' },
              required_approving_review_count: { type: 'integer' },
            },
            url:
              '/repos/:owner/:repo/branches/:branch/protection/required_pull_request_reviews',
          },
          updateProtectedBranchRequiredStatusChecks: {
            method: 'PATCH',
            params: {
              branch: { required: true, type: 'string' },
              contexts: { type: 'string[]' },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
              strict: { type: 'boolean' },
            },
            url:
              '/repos/:owner/:repo/branches/:branch/protection/required_status_checks',
          },
          updateRelease: {
            method: 'PATCH',
            params: {
              body: { type: 'string' },
              draft: { type: 'boolean' },
              name: { type: 'string' },
              owner: { required: true, type: 'string' },
              prerelease: { type: 'boolean' },
              release_id: { required: true, type: 'integer' },
              repo: { required: true, type: 'string' },
              tag_name: { type: 'string' },
              target_commitish: { type: 'string' },
            },
            url: '/repos/:owner/:repo/releases/:release_id',
          },
          updateReleaseAsset: {
            method: 'PATCH',
            params: {
              asset_id: { required: true, type: 'integer' },
              label: { type: 'string' },
              name: { type: 'string' },
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
            },
            url: '/repos/:owner/:repo/releases/assets/:asset_id',
          },
          uploadReleaseAsset: {
            method: 'POST',
            params: {
              file: { mapTo: 'data', required: true, type: 'string | object' },
              headers: { required: true, type: 'object' },
              'headers.content-length': { required: true, type: 'integer' },
              'headers.content-type': { required: true, type: 'string' },
              label: { type: 'string' },
              name: { required: true, type: 'string' },
              url: { required: true, type: 'string' },
            },
            url: ':url',
          },
        },
        search: {
          code: {
            method: 'GET',
            params: {
              order: { enum: ['desc', 'asc'], type: 'string' },
              page: { type: 'integer' },
              per_page: { type: 'integer' },
              q: { required: true, type: 'string' },
              sort: { enum: ['indexed'], type: 'string' },
            },
            url: '/search/code',
          },
          commits: {
            headers: { accept: 'application/vnd.github.cloak-preview+json' },
            method: 'GET',
            params: {
              order: { enum: ['desc', 'asc'], type: 'string' },
              page: { type: 'integer' },
              per_page: { type: 'integer' },
              q: { required: true, type: 'string' },
              sort: { enum: ['author-date', 'committer-date'], type: 'string' },
            },
            url: '/search/commits',
          },
          issues: {
            deprecated:
              'octokit.search.issues() has been renamed to octokit.search.issuesAndPullRequests() (2018-12-27)',
            method: 'GET',
            params: {
              order: { enum: ['desc', 'asc'], type: 'string' },
              page: { type: 'integer' },
              per_page: { type: 'integer' },
              q: { required: true, type: 'string' },
              sort: {
                enum: [
                  'comments',
                  'reactions',
                  'reactions-+1',
                  'reactions--1',
                  'reactions-smile',
                  'reactions-thinking_face',
                  'reactions-heart',
                  'reactions-tada',
                  'interactions',
                  'created',
                  'updated',
                ],
                type: 'string',
              },
            },
            url: '/search/issues',
          },
          issuesAndPullRequests: {
            method: 'GET',
            params: {
              order: { enum: ['desc', 'asc'], type: 'string' },
              page: { type: 'integer' },
              per_page: { type: 'integer' },
              q: { required: true, type: 'string' },
              sort: {
                enum: [
                  'comments',
                  'reactions',
                  'reactions-+1',
                  'reactions--1',
                  'reactions-smile',
                  'reactions-thinking_face',
                  'reactions-heart',
                  'reactions-tada',
                  'interactions',
                  'created',
                  'updated',
                ],
                type: 'string',
              },
            },
            url: '/search/issues',
          },
          labels: {
            method: 'GET',
            params: {
              order: { enum: ['desc', 'asc'], type: 'string' },
              q: { required: true, type: 'string' },
              repository_id: { required: true, type: 'integer' },
              sort: { enum: ['created', 'updated'], type: 'string' },
            },
            url: '/search/labels',
          },
          repos: {
            method: 'GET',
            params: {
              order: { enum: ['desc', 'asc'], type: 'string' },
              page: { type: 'integer' },
              per_page: { type: 'integer' },
              q: { required: true, type: 'string' },
              sort: {
                enum: ['stars', 'forks', 'help-wanted-issues', 'updated'],
                type: 'string',
              },
            },
            url: '/search/repositories',
          },
          topics: {
            method: 'GET',
            params: { q: { required: true, type: 'string' } },
            url: '/search/topics',
          },
          users: {
            method: 'GET',
            params: {
              order: { enum: ['desc', 'asc'], type: 'string' },
              page: { type: 'integer' },
              per_page: { type: 'integer' },
              q: { required: true, type: 'string' },
              sort: {
                enum: ['followers', 'repositories', 'joined'],
                type: 'string',
              },
            },
            url: '/search/users',
          },
        },
        teams: {
          addMember: {
            deprecated:
              'octokit.teams.addMember() is deprecated, see https://developer.github.com/v3/teams/members/#add-team-member',
            method: 'PUT',
            params: {
              team_id: { required: true, type: 'integer' },
              username: { required: true, type: 'string' },
            },
            url: '/teams/:team_id/members/:username',
          },
          addOrUpdateMembership: {
            method: 'PUT',
            params: {
              role: { enum: ['member', 'maintainer'], type: 'string' },
              team_id: { required: true, type: 'integer' },
              username: { required: true, type: 'string' },
            },
            url: '/teams/:team_id/memberships/:username',
          },
          addOrUpdateProject: {
            headers: { accept: 'application/vnd.github.inertia-preview+json' },
            method: 'PUT',
            params: {
              permission: { enum: ['read', 'write', 'admin'], type: 'string' },
              project_id: { required: true, type: 'integer' },
              team_id: { required: true, type: 'integer' },
            },
            url: '/teams/:team_id/projects/:project_id',
          },
          addOrUpdateRepo: {
            method: 'PUT',
            params: {
              owner: { required: true, type: 'string' },
              permission: { enum: ['pull', 'push', 'admin'], type: 'string' },
              repo: { required: true, type: 'string' },
              team_id: { required: true, type: 'integer' },
            },
            url: '/teams/:team_id/repos/:owner/:repo',
          },
          checkManagesRepo: {
            method: 'GET',
            params: {
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
              team_id: { required: true, type: 'integer' },
            },
            url: '/teams/:team_id/repos/:owner/:repo',
          },
          create: {
            method: 'POST',
            params: {
              description: { type: 'string' },
              maintainers: { type: 'string[]' },
              name: { required: true, type: 'string' },
              org: { required: true, type: 'string' },
              parent_team_id: { type: 'integer' },
              permission: { enum: ['pull', 'push', 'admin'], type: 'string' },
              privacy: { enum: ['secret', 'closed'], type: 'string' },
              repo_names: { type: 'string[]' },
            },
            url: '/orgs/:org/teams',
          },
          createDiscussion: {
            headers: { accept: 'application/vnd.github.echo-preview+json' },
            method: 'POST',
            params: {
              body: { required: true, type: 'string' },
              private: { type: 'boolean' },
              team_id: { required: true, type: 'integer' },
              title: { required: true, type: 'string' },
            },
            url: '/teams/:team_id/discussions',
          },
          createDiscussionComment: {
            headers: { accept: 'application/vnd.github.echo-preview+json' },
            method: 'POST',
            params: {
              body: { required: true, type: 'string' },
              discussion_number: { required: true, type: 'integer' },
              team_id: { required: true, type: 'integer' },
            },
            url: '/teams/:team_id/discussions/:discussion_number/comments',
          },
          delete: {
            method: 'DELETE',
            params: { team_id: { required: true, type: 'integer' } },
            url: '/teams/:team_id',
          },
          deleteDiscussion: {
            headers: { accept: 'application/vnd.github.echo-preview+json' },
            method: 'DELETE',
            params: {
              discussion_number: { required: true, type: 'integer' },
              team_id: { required: true, type: 'integer' },
            },
            url: '/teams/:team_id/discussions/:discussion_number',
          },
          deleteDiscussionComment: {
            headers: { accept: 'application/vnd.github.echo-preview+json' },
            method: 'DELETE',
            params: {
              comment_number: { required: true, type: 'integer' },
              discussion_number: { required: true, type: 'integer' },
              team_id: { required: true, type: 'integer' },
            },
            url:
              '/teams/:team_id/discussions/:discussion_number/comments/:comment_number',
          },
          get: {
            method: 'GET',
            params: { team_id: { required: true, type: 'integer' } },
            url: '/teams/:team_id',
          },
          getByName: {
            method: 'GET',
            params: {
              org: { required: true, type: 'string' },
              team_slug: { required: true, type: 'string' },
            },
            url: '/orgs/:org/teams/:team_slug',
          },
          getDiscussion: {
            headers: { accept: 'application/vnd.github.echo-preview+json' },
            method: 'GET',
            params: {
              discussion_number: { required: true, type: 'integer' },
              team_id: { required: true, type: 'integer' },
            },
            url: '/teams/:team_id/discussions/:discussion_number',
          },
          getDiscussionComment: {
            headers: { accept: 'application/vnd.github.echo-preview+json' },
            method: 'GET',
            params: {
              comment_number: { required: true, type: 'integer' },
              discussion_number: { required: true, type: 'integer' },
              team_id: { required: true, type: 'integer' },
            },
            url:
              '/teams/:team_id/discussions/:discussion_number/comments/:comment_number',
          },
          getMember: {
            deprecated:
              'octokit.teams.getMember() is deprecated, see https://developer.github.com/v3/teams/members/#get-team-member',
            method: 'GET',
            params: {
              team_id: { required: true, type: 'integer' },
              username: { required: true, type: 'string' },
            },
            url: '/teams/:team_id/members/:username',
          },
          getMembership: {
            method: 'GET',
            params: {
              team_id: { required: true, type: 'integer' },
              username: { required: true, type: 'string' },
            },
            url: '/teams/:team_id/memberships/:username',
          },
          list: {
            method: 'GET',
            params: {
              org: { required: true, type: 'string' },
              page: { type: 'integer' },
              per_page: { type: 'integer' },
            },
            url: '/orgs/:org/teams',
          },
          listChild: {
            headers: { accept: 'application/vnd.github.hellcat-preview+json' },
            method: 'GET',
            params: {
              page: { type: 'integer' },
              per_page: { type: 'integer' },
              team_id: { required: true, type: 'integer' },
            },
            url: '/teams/:team_id/teams',
          },
          listDiscussionComments: {
            headers: { accept: 'application/vnd.github.echo-preview+json' },
            method: 'GET',
            params: {
              direction: { enum: ['asc', 'desc'], type: 'string' },
              discussion_number: { required: true, type: 'integer' },
              page: { type: 'integer' },
              per_page: { type: 'integer' },
              team_id: { required: true, type: 'integer' },
            },
            url: '/teams/:team_id/discussions/:discussion_number/comments',
          },
          listDiscussions: {
            headers: { accept: 'application/vnd.github.echo-preview+json' },
            method: 'GET',
            params: {
              direction: { enum: ['asc', 'desc'], type: 'string' },
              page: { type: 'integer' },
              per_page: { type: 'integer' },
              team_id: { required: true, type: 'integer' },
            },
            url: '/teams/:team_id/discussions',
          },
          listForAuthenticatedUser: {
            method: 'GET',
            params: {
              page: { type: 'integer' },
              per_page: { type: 'integer' },
            },
            url: '/user/teams',
          },
          listMembers: {
            method: 'GET',
            params: {
              page: { type: 'integer' },
              per_page: { type: 'integer' },
              role: { enum: ['member', 'maintainer', 'all'], type: 'string' },
              team_id: { required: true, type: 'integer' },
            },
            url: '/teams/:team_id/members',
          },
          listPendingInvitations: {
            method: 'GET',
            params: {
              page: { type: 'integer' },
              per_page: { type: 'integer' },
              team_id: { required: true, type: 'integer' },
            },
            url: '/teams/:team_id/invitations',
          },
          listProjects: {
            headers: { accept: 'application/vnd.github.inertia-preview+json' },
            method: 'GET',
            params: {
              page: { type: 'integer' },
              per_page: { type: 'integer' },
              team_id: { required: true, type: 'integer' },
            },
            url: '/teams/:team_id/projects',
          },
          listRepos: {
            method: 'GET',
            params: {
              page: { type: 'integer' },
              per_page: { type: 'integer' },
              team_id: { required: true, type: 'integer' },
            },
            url: '/teams/:team_id/repos',
          },
          removeMember: {
            deprecated:
              'octokit.teams.removeMember() is deprecated, see https://developer.github.com/v3/teams/members/#remove-team-member',
            method: 'DELETE',
            params: {
              team_id: { required: true, type: 'integer' },
              username: { required: true, type: 'string' },
            },
            url: '/teams/:team_id/members/:username',
          },
          removeMembership: {
            method: 'DELETE',
            params: {
              team_id: { required: true, type: 'integer' },
              username: { required: true, type: 'string' },
            },
            url: '/teams/:team_id/memberships/:username',
          },
          removeProject: {
            method: 'DELETE',
            params: {
              project_id: { required: true, type: 'integer' },
              team_id: { required: true, type: 'integer' },
            },
            url: '/teams/:team_id/projects/:project_id',
          },
          removeRepo: {
            method: 'DELETE',
            params: {
              owner: { required: true, type: 'string' },
              repo: { required: true, type: 'string' },
              team_id: { required: true, type: 'integer' },
            },
            url: '/teams/:team_id/repos/:owner/:repo',
          },
          reviewProject: {
            headers: { accept: 'application/vnd.github.inertia-preview+json' },
            method: 'GET',
            params: {
              project_id: { required: true, type: 'integer' },
              team_id: { required: true, type: 'integer' },
            },
            url: '/teams/:team_id/projects/:project_id',
          },
          update: {
            method: 'PATCH',
            params: {
              description: { type: 'string' },
              name: { required: true, type: 'string' },
              parent_team_id: { type: 'integer' },
              permission: { enum: ['pull', 'push', 'admin'], type: 'string' },
              privacy: { enum: ['secret', 'closed'], type: 'string' },
              team_id: { required: true, type: 'integer' },
            },
            url: '/teams/:team_id',
          },
          updateDiscussion: {
            headers: { accept: 'application/vnd.github.echo-preview+json' },
            method: 'PATCH',
            params: {
              body: { type: 'string' },
              discussion_number: { required: true, type: 'integer' },
              team_id: { required: true, type: 'integer' },
              title: { type: 'string' },
            },
            url: '/teams/:team_id/discussions/:discussion_number',
          },
          updateDiscussionComment: {
            headers: { accept: 'application/vnd.github.echo-preview+json' },
            method: 'PATCH',
            params: {
              body: { required: true, type: 'string' },
              comment_number: { required: true, type: 'integer' },
              discussion_number: { required: true, type: 'integer' },
              team_id: { required: true, type: 'integer' },
            },
            url:
              '/teams/:team_id/discussions/:discussion_number/comments/:comment_number',
          },
        },
        users: {
          addEmails: {
            method: 'POST',
            params: { emails: { required: true, type: 'string[]' } },
            url: '/user/emails',
          },
          block: {
            method: 'PUT',
            params: { username: { required: true, type: 'string' } },
            url: '/user/blocks/:username',
          },
          checkBlocked: {
            method: 'GET',
            params: { username: { required: true, type: 'string' } },
            url: '/user/blocks/:username',
          },
          checkFollowing: {
            method: 'GET',
            params: { username: { required: true, type: 'string' } },
            url: '/user/following/:username',
          },
          checkFollowingForUser: {
            method: 'GET',
            params: {
              target_user: { required: true, type: 'string' },
              username: { required: true, type: 'string' },
            },
            url: '/users/:username/following/:target_user',
          },
          createGpgKey: {
            method: 'POST',
            params: { armored_public_key: { type: 'string' } },
            url: '/user/gpg_keys',
          },
          createPublicKey: {
            method: 'POST',
            params: { key: { type: 'string' }, title: { type: 'string' } },
            url: '/user/keys',
          },
          deleteEmails: {
            method: 'DELETE',
            params: { emails: { required: true, type: 'string[]' } },
            url: '/user/emails',
          },
          deleteGpgKey: {
            method: 'DELETE',
            params: { gpg_key_id: { required: true, type: 'integer' } },
            url: '/user/gpg_keys/:gpg_key_id',
          },
          deletePublicKey: {
            method: 'DELETE',
            params: { key_id: { required: true, type: 'integer' } },
            url: '/user/keys/:key_id',
          },
          follow: {
            method: 'PUT',
            params: { username: { required: true, type: 'string' } },
            url: '/user/following/:username',
          },
          getAuthenticated: { method: 'GET', params: {}, url: '/user' },
          getByUsername: {
            method: 'GET',
            params: { username: { required: true, type: 'string' } },
            url: '/users/:username',
          },
          getContextForUser: {
            headers: { accept: 'application/vnd.github.hagar-preview+json' },
            method: 'GET',
            params: {
              subject_id: { type: 'string' },
              subject_type: {
                enum: ['organization', 'repository', 'issue', 'pull_request'],
                type: 'string',
              },
              username: { required: true, type: 'string' },
            },
            url: '/users/:username/hovercard',
          },
          getGpgKey: {
            method: 'GET',
            params: { gpg_key_id: { required: true, type: 'integer' } },
            url: '/user/gpg_keys/:gpg_key_id',
          },
          getPublicKey: {
            method: 'GET',
            params: { key_id: { required: true, type: 'integer' } },
            url: '/user/keys/:key_id',
          },
          list: {
            method: 'GET',
            params: {
              page: { type: 'integer' },
              per_page: { type: 'integer' },
              since: { type: 'string' },
            },
            url: '/users',
          },
          listBlocked: { method: 'GET', params: {}, url: '/user/blocks' },
          listEmails: {
            method: 'GET',
            params: {
              page: { type: 'integer' },
              per_page: { type: 'integer' },
            },
            url: '/user/emails',
          },
          listFollowersForAuthenticatedUser: {
            method: 'GET',
            params: {
              page: { type: 'integer' },
              per_page: { type: 'integer' },
            },
            url: '/user/followers',
          },
          listFollowersForUser: {
            method: 'GET',
            params: {
              page: { type: 'integer' },
              per_page: { type: 'integer' },
              username: { required: true, type: 'string' },
            },
            url: '/users/:username/followers',
          },
          listFollowingForAuthenticatedUser: {
            method: 'GET',
            params: {
              page: { type: 'integer' },
              per_page: { type: 'integer' },
            },
            url: '/user/following',
          },
          listFollowingForUser: {
            method: 'GET',
            params: {
              page: { type: 'integer' },
              per_page: { type: 'integer' },
              username: { required: true, type: 'string' },
            },
            url: '/users/:username/following',
          },
          listGpgKeys: {
            method: 'GET',
            params: {
              page: { type: 'integer' },
              per_page: { type: 'integer' },
            },
            url: '/user/gpg_keys',
          },
          listGpgKeysForUser: {
            method: 'GET',
            params: {
              page: { type: 'integer' },
              per_page: { type: 'integer' },
              username: { required: true, type: 'string' },
            },
            url: '/users/:username/gpg_keys',
          },
          listPublicEmails: {
            method: 'GET',
            params: {
              page: { type: 'integer' },
              per_page: { type: 'integer' },
            },
            url: '/user/public_emails',
          },
          listPublicKeys: {
            method: 'GET',
            params: {
              page: { type: 'integer' },
              per_page: { type: 'integer' },
            },
            url: '/user/keys',
          },
          listPublicKeysForUser: {
            method: 'GET',
            params: {
              page: { type: 'integer' },
              per_page: { type: 'integer' },
              username: { required: true, type: 'string' },
            },
            url: '/users/:username/keys',
          },
          togglePrimaryEmailVisibility: {
            method: 'PATCH',
            params: {
              email: { required: true, type: 'string' },
              visibility: { required: true, type: 'string' },
            },
            url: '/user/email/visibility',
          },
          unblock: {
            method: 'DELETE',
            params: { username: { required: true, type: 'string' } },
            url: '/user/blocks/:username',
          },
          unfollow: {
            method: 'DELETE',
            params: { username: { required: true, type: 'string' } },
            url: '/user/following/:username',
          },
          updateAuthenticated: {
            method: 'PATCH',
            params: {
              bio: { type: 'string' },
              blog: { type: 'string' },
              company: { type: 'string' },
              email: { type: 'string' },
              hireable: { type: 'boolean' },
              location: { type: 'string' },
              name: { type: 'string' },
            },
            url: '/user',
          },
        },
      };
    },
    742(e, t, r) {
      const n = r(747);
      let i;
      if (process.platform === 'win32' || global.TESTING_WINDOWS) {
        i = r(818);
      } else {
        i = r(197);
      }
      e.exports = isexe;
      isexe.sync = sync;
      function isexe(e, t, r) {
        if (typeof t === 'function') {
          r = t;
          t = {};
        }
        if (!r) {
          if (typeof Promise !== 'function') {
            throw new TypeError('callback not provided');
          }
          return new Promise(function(r, n) {
            isexe(e, t || {}, function(e, t) {
              if (e) {
                n(e);
              } else {
                r(t);
              }
            });
          });
        }
        i(e, t || {}, function(e, n) {
          if (e) {
            if (e.code === 'EACCES' || (t && t.ignoreErrors)) {
              e = null;
              n = false;
            }
          }
          r(e, n);
        });
      }
      function sync(e, t) {
        try {
          return i.sync(e, t || {});
        } catch (e) {
          if ((t && t.ignoreErrors) || e.code === 'EACCES') {
            return false;
          }
          throw e;
        }
      }
    },
    747(e) {
      e.exports = require('fs');
    },
    753(e, t, r) {
      Object.defineProperty(t, '__esModule', { value: true });
      function _interopDefault(e) {
        return e && typeof e === 'object' && 'default' in e ? e.default : e;
      }
      const n = r(385);
      const i = r(211);
      const s = _interopDefault(r(696));
      const o = _interopDefault(r(454));
      const a = r(463);
      const u = '5.3.1';
      function getBufferResponse(e) {
        return e.arrayBuffer();
      }
      function fetchWrapper(e) {
        if (s(e.body) || Array.isArray(e.body)) {
          e.body = JSON.stringify(e.body);
        }
        const t = {};
        let r;
        let n;
        const i = (e.request && e.request.fetch) || o;
        return i(e.url, {
          method: e.method,
          body: e.body,
          headers: e.headers,
          redirect: e.redirect,
          ...e.request,
        })
          .then(i => {
            n = i.url;
            r = i.status;
            for (const e of i.headers) {
              t[e[0]] = e[1];
            }
            if (r === 204 || r === 205) {
              return;
            }
            if (e.method === 'HEAD') {
              if (r < 400) {
                return;
              }
              throw new a.RequestError(i.statusText, r, {
                headers: t,
                request: e,
              });
            }
            if (r === 304) {
              throw new a.RequestError('Not modified', r, {
                headers: t,
                request: e,
              });
            }
            if (r >= 400) {
              return i.text().then(n => {
                const i = new a.RequestError(n, r, { headers: t, request: e });
                try {
                  const e = JSON.parse(i.message);
                  Object.assign(i, e);
                  const t = e.errors;
                  i.message = `${i.message}: ${t
                    .map(JSON.stringify)
                    .join(', ')}`;
                } catch (e) {}
                throw i;
              });
            }
            const s = i.headers.get('content-type');
            if (/application\/json/.test(s)) {
              return i.json();
            }
            if (!s || /^text\/|charset=utf-8$/.test(s)) {
              return i.text();
            }
            return getBufferResponse(i);
          })
          .then(e => ({ status: r, url: n, headers: t, data: e }))
          .catch(r => {
            if (r instanceof a.RequestError) {
              throw r;
            }
            throw new a.RequestError(r.message, 500, {
              headers: t,
              request: e,
            });
          });
      }
      function withDefaults(e, t) {
        const r = e.defaults(t);
        const n = function(e, t) {
          const n = r.merge(e, t);
          if (!n.request || !n.request.hook) {
            return fetchWrapper(r.parse(n));
          }
          const i = (e, t) => fetchWrapper(r.parse(r.merge(e, t)));
          Object.assign(i, {
            endpoint: r,
            defaults: withDefaults.bind(null, r),
          });
          return n.request.hook(i, n);
        };
        return Object.assign(n, {
          endpoint: r,
          defaults: withDefaults.bind(null, r),
        });
      }
      const p = withDefaults(n.endpoint, {
        headers: {
          'user-agent': `octokit-request.js/${u} ${i.getUserAgent()}`,
        },
      });
      t.request = p;
    },
    761(e) {
      e.exports = require('zlib');
    },
    763(e) {
      e.exports = removeHook;
      function removeHook(e, t, r) {
        if (!e.registry[t]) {
          return;
        }
        const n = e.registry[t]
          .map(function(e) {
            return e.orig;
          })
          .indexOf(r);
        if (n === -1) {
          return;
        }
        e.registry[t].splice(n, 1);
      }
    },
    768(e) {
      e.exports = function(e) {
        const t = typeof e === 'string' ? '\n' : '\n'.charCodeAt();
        const r = typeof e === 'string' ? '\r' : '\r'.charCodeAt();
        if (e[e.length - 1] === t) {
          e = e.slice(0, e.length - 1);
        }
        if (e[e.length - 1] === r) {
          e = e.slice(0, e.length - 1);
        }
        return e;
      };
    },
    777(e, t, r) {
      e.exports = getFirstPage;
      const n = r(265);
      function getFirstPage(e, t, r) {
        return n(e, t, 'first', r);
      }
    },
    807(e, t, r) {
      e.exports = paginate;
      const n = r(8);
      function paginate(e, t, r, i) {
        if (typeof r === 'function') {
          i = r;
          r = undefined;
        }
        r = e.request.endpoint.merge(t, r);
        return gather(e, [], n(e, r)[Symbol.asyncIterator](), i);
      }
      function gather(e, t, r, n) {
        return r.next().then(i => {
          if (i.done) {
            return t;
          }
          let s = false;
          function done() {
            s = true;
          }
          t = t.concat(n ? n(i.value, done) : i.value.data);
          if (s) {
            return t;
          }
          return gather(e, t, r, n);
        });
      }
    },
    814(e, t, r) {
      e.exports = which;
      which.sync = whichSync;
      const n =
        process.platform === 'win32' ||
        process.env.OSTYPE === 'cygwin' ||
        process.env.OSTYPE === 'msys';
      const i = r(622);
      const s = n ? ';' : ':';
      const o = r(742);
      function getNotFoundError(e) {
        const t = new Error(`not found: ${e}`);
        t.code = 'ENOENT';
        return t;
      }
      function getPathInfo(e, t) {
        const r = t.colon || s;
        let i = t.path || process.env.PATH || '';
        let o = [''];
        i = i.split(r);
        let a = '';
        if (n) {
          i.unshift(process.cwd());
          a = t.pathExt || process.env.PATHEXT || '.EXE;.CMD;.BAT;.COM';
          o = a.split(r);
          if (e.indexOf('.') !== -1 && o[0] !== '') o.unshift('');
        }
        if (e.match(/\//) || (n && e.match(/\\/))) i = [''];
        return { env: i, ext: o, extExe: a };
      }
      function which(e, t, r) {
        if (typeof t === 'function') {
          r = t;
          t = {};
        }
        const n = getPathInfo(e, t);
        const s = n.env;
        const a = n.ext;
        const u = n.extExe;
        const p = [];
        (function F(n, c) {
          if (n === c) {
            if (t.all && p.length) return r(null, p);
            return r(getNotFoundError(e));
          }
          let d = s[n];
          if (d.charAt(0) === '"' && d.slice(-1) === '"') d = d.slice(1, -1);
          let l = i.join(d, e);
          if (!d && /^\.[\\\/]/.test(e)) {
            l = e.slice(0, 2) + l;
          }
          (function E(e, i) {
            if (e === i) return F(n + 1, c);
            const s = a[e];
            o(l + s, { pathExt: u }, function(n, o) {
              if (!n && o) {
                if (t.all) p.push(l + s);
                else return r(null, l + s);
              }
              return E(e + 1, i);
            });
          })(0, a.length);
        })(0, s.length);
      }
      function whichSync(e, t) {
        t = t || {};
        const r = getPathInfo(e, t);
        const n = r.env;
        const s = r.ext;
        const a = r.extExe;
        const u = [];
        for (let p = 0, c = n.length; p < c; p++) {
          let d = n[p];
          if (d.charAt(0) === '"' && d.slice(-1) === '"') d = d.slice(1, -1);
          let l = i.join(d, e);
          if (!d && /^\.[\\\/]/.test(e)) {
            l = e.slice(0, 2) + l;
          }
          for (let g = 0, m = s.length; g < m; g++) {
            const h = l + s[g];
            var y;
            try {
              y = o.sync(h, { pathExt: a });
              if (y) {
                if (t.all) u.push(h);
                else return h;
              }
            } catch (e) {}
          }
        }
        if (t.all && u.length) return u;
        if (t.nothrow) return null;
        throw getNotFoundError(e);
      }
    },
    816(e) {
      e.exports = /^#!.*/;
    },
    818(e, t, r) {
      e.exports = isexe;
      isexe.sync = sync;
      const n = r(747);
      function checkPathExt(e, t) {
        let r = t.pathExt !== undefined ? t.pathExt : process.env.PATHEXT;
        if (!r) {
          return true;
        }
        r = r.split(';');
        if (r.indexOf('') !== -1) {
          return true;
        }
        for (let n = 0; n < r.length; n++) {
          const i = r[n].toLowerCase();
          if (i && e.substr(-i.length).toLowerCase() === i) {
            return true;
          }
        }
        return false;
      }
      function checkStat(e, t, r) {
        if (!e.isSymbolicLink() && !e.isFile()) {
          return false;
        }
        return checkPathExt(t, r);
      }
      function isexe(e, t, r) {
        n.stat(e, function(n, i) {
          r(n, n ? false : checkStat(i, e, t));
        });
      }
      function sync(e, t) {
        return checkStat(n.statSync(e), e, t);
      }
    },
    835(e) {
      e.exports = require('url');
    },
    850(e, t, r) {
      e.exports = paginationMethodsPlugin;
      function paginationMethodsPlugin(e) {
        e.getFirstPage = r(777).bind(null, e);
        e.getLastPage = r(649).bind(null, e);
        e.getNextPage = r(550).bind(null, e);
        e.getPreviousPage = r(563).bind(null, e);
        e.hasFirstPage = r(536);
        e.hasLastPage = r(336);
        e.hasNextPage = r(929);
        e.hasPreviousPage = r(558);
      }
    },
    854(e) {
      const t = 'Expected a function';
      const r = '__lodash_hash_undefined__';
      const n = 1 / 0;
      const i = '[object Function]';
      const s = '[object GeneratorFunction]';
      const o = '[object Symbol]';
      const a = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/;
      const u = /^\w*$/;
      const p = /^\./;
      const c = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
      const d = /[\\^$.*+?()[\]{}|]/g;
      const l = /\\(\\)?/g;
      const g = /^\[object .+?Constructor\]$/;
      const m =
        typeof global === 'object' &&
        global &&
        global.Object === Object &&
        global;
      const h =
        typeof self === 'object' && self && self.Object === Object && self;
      const y = m || h || Function('return this')();
      function getValue(e, t) {
        return e == null ? undefined : e[t];
      }
      function isHostObject(e) {
        let t = false;
        if (e != null && typeof e.toString !== 'function') {
          try {
            t = !!`${e}`;
          } catch (e) {}
        }
        return t;
      }
      const f = Array.prototype;
      const b = Function.prototype;
      const _ = Object.prototype;
      const q = y['__core-js_shared__'];
      const w = (function() {
        const e = /[^.]+$/.exec((q && q.keys && q.keys.IE_PROTO) || '');
        return e ? `Symbol(src)_1.${e}` : '';
      })();
      const v = b.toString;
      const E = _.hasOwnProperty;
      const T = _.toString;
      const j = RegExp(
        `^${v
          .call(E)
          .replace(d, '\\$&')
          .replace(
            /hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,
            '$1.*?',
          )}$`,
      );
      const k = y.Symbol;
      const S = f.splice;
      const P = getNative(y, 'Map');
      const C = getNative(Object, 'create');
      const O = k ? k.prototype : undefined;
      const x = O ? O.toString : undefined;
      function Hash(e) {
        let t = -1;
        const r = e ? e.length : 0;
        this.clear();
        while (++t < r) {
          const n = e[t];
          this.set(n[0], n[1]);
        }
      }
      function hashClear() {
        this.__data__ = C ? C(null) : {};
      }
      function hashDelete(e) {
        return this.has(e) && delete this.__data__[e];
      }
      function hashGet(e) {
        const t = this.__data__;
        if (C) {
          const n = t[e];
          return n === r ? undefined : n;
        }
        return E.call(t, e) ? t[e] : undefined;
      }
      function hashHas(e) {
        const t = this.__data__;
        return C ? t[e] !== undefined : E.call(t, e);
      }
      function hashSet(e, t) {
        const n = this.__data__;
        n[e] = C && t === undefined ? r : t;
        return this;
      }
      Hash.prototype.clear = hashClear;
      Hash.prototype.delete = hashDelete;
      Hash.prototype.get = hashGet;
      Hash.prototype.has = hashHas;
      Hash.prototype.set = hashSet;
      function ListCache(e) {
        let t = -1;
        const r = e ? e.length : 0;
        this.clear();
        while (++t < r) {
          const n = e[t];
          this.set(n[0], n[1]);
        }
      }
      function listCacheClear() {
        this.__data__ = [];
      }
      function listCacheDelete(e) {
        const t = this.__data__;
        const r = assocIndexOf(t, e);
        if (r < 0) {
          return false;
        }
        const n = t.length - 1;
        if (r == n) {
          t.pop();
        } else {
          S.call(t, r, 1);
        }
        return true;
      }
      function listCacheGet(e) {
        const t = this.__data__;
        const r = assocIndexOf(t, e);
        return r < 0 ? undefined : t[r][1];
      }
      function listCacheHas(e) {
        return assocIndexOf(this.__data__, e) > -1;
      }
      function listCacheSet(e, t) {
        const r = this.__data__;
        const n = assocIndexOf(r, e);
        if (n < 0) {
          r.push([e, t]);
        } else {
          r[n][1] = t;
        }
        return this;
      }
      ListCache.prototype.clear = listCacheClear;
      ListCache.prototype.delete = listCacheDelete;
      ListCache.prototype.get = listCacheGet;
      ListCache.prototype.has = listCacheHas;
      ListCache.prototype.set = listCacheSet;
      function MapCache(e) {
        let t = -1;
        const r = e ? e.length : 0;
        this.clear();
        while (++t < r) {
          const n = e[t];
          this.set(n[0], n[1]);
        }
      }
      function mapCacheClear() {
        this.__data__ = {
          hash: new Hash(),
          map: new (P || ListCache)(),
          string: new Hash(),
        };
      }
      function mapCacheDelete(e) {
        return getMapData(this, e).delete(e);
      }
      function mapCacheGet(e) {
        return getMapData(this, e).get(e);
      }
      function mapCacheHas(e) {
        return getMapData(this, e).has(e);
      }
      function mapCacheSet(e, t) {
        getMapData(this, e).set(e, t);
        return this;
      }
      MapCache.prototype.clear = mapCacheClear;
      MapCache.prototype.delete = mapCacheDelete;
      MapCache.prototype.get = mapCacheGet;
      MapCache.prototype.has = mapCacheHas;
      MapCache.prototype.set = mapCacheSet;
      function assocIndexOf(e, t) {
        let r = e.length;
        while (r--) {
          if (eq(e[r][0], t)) {
            return r;
          }
        }
        return -1;
      }
      function baseGet(e, t) {
        t = isKey(t, e) ? [t] : castPath(t);
        let r = 0;
        const n = t.length;
        while (e != null && r < n) {
          e = e[toKey(t[r++])];
        }
        return r && r == n ? e : undefined;
      }
      function baseIsNative(e) {
        if (!isObject(e) || isMasked(e)) {
          return false;
        }
        const t = isFunction(e) || isHostObject(e) ? j : g;
        return t.test(toSource(e));
      }
      function baseToString(e) {
        if (typeof e === 'string') {
          return e;
        }
        if (isSymbol(e)) {
          return x ? x.call(e) : '';
        }
        const t = `${e}`;
        return t == '0' && 1 / e == -n ? '-0' : t;
      }
      function castPath(e) {
        return A(e) ? e : G(e);
      }
      function getMapData(e, t) {
        const r = e.__data__;
        return isKeyable(t)
          ? r[typeof t === 'string' ? 'string' : 'hash']
          : r.map;
      }
      function getNative(e, t) {
        const r = getValue(e, t);
        return baseIsNative(r) ? r : undefined;
      }
      function isKey(e, t) {
        if (A(e)) {
          return false;
        }
        const r = typeof e;
        if (
          r == 'number' ||
          r == 'symbol' ||
          r == 'boolean' ||
          e == null ||
          isSymbol(e)
        ) {
          return true;
        }
        return u.test(e) || !a.test(e) || (t != null && e in Object(t));
      }
      function isKeyable(e) {
        const t = typeof e;
        return t == 'string' || t == 'number' || t == 'symbol' || t == 'boolean'
          ? e !== '__proto__'
          : e === null;
      }
      function isMasked(e) {
        return !!w && w in e;
      }
      var G = memoize(function(e) {
        e = toString(e);
        const t = [];
        if (p.test(e)) {
          t.push('');
        }
        e.replace(c, function(e, r, n, i) {
          t.push(n ? i.replace(l, '$1') : r || e);
        });
        return t;
      });
      function toKey(e) {
        if (typeof e === 'string' || isSymbol(e)) {
          return e;
        }
        const t = `${e}`;
        return t == '0' && 1 / e == -n ? '-0' : t;
      }
      function toSource(e) {
        if (e != null) {
          try {
            return v.call(e);
          } catch (e) {}
          try {
            return `${e}`;
          } catch (e) {}
        }
        return '';
      }
      function memoize(e, r) {
        if (typeof e !== 'function' || (r && typeof r !== 'function')) {
          throw new TypeError(t);
        }
        var n = function() {
          const t = arguments;
          const i = r ? r.apply(this, t) : t[0];
          const s = n.cache;
          if (s.has(i)) {
            return s.get(i);
          }
          const o = e.apply(this, t);
          n.cache = s.set(i, o);
          return o;
        };
        n.cache = new (memoize.Cache || MapCache)();
        return n;
      }
      memoize.Cache = MapCache;
      function eq(e, t) {
        return e === t || (e !== e && t !== t);
      }
      var A = Array.isArray;
      function isFunction(e) {
        const t = isObject(e) ? T.call(e) : '';
        return t == i || t == s;
      }
      function isObject(e) {
        const t = typeof e;
        return !!e && (t == 'object' || t == 'function');
      }
      function isObjectLike(e) {
        return !!e && typeof e === 'object';
      }
      function isSymbol(e) {
        return typeof e === 'symbol' || (isObjectLike(e) && T.call(e) == o);
      }
      function toString(e) {
        return e == null ? '' : baseToString(e);
      }
      function get(e, t, r) {
        const n = e == null ? undefined : baseGet(e, t);
        return n === undefined ? r : n;
      }
      e.exports = get;
    },
    855(e, t, r) {
      e.exports = registerPlugin;
      const n = r(47);
      function registerPlugin(e, t) {
        return n(e.includes(t) ? e : e.concat(t));
      }
    },
    862(e) {
      e.exports = class GraphqlError extends Error {
        constructor(e, t) {
          const r = t.data.errors[0].message;
          super(r);
          Object.assign(this, t.data);
          this.name = 'GraphqlError';
          this.request = e;
          if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
          }
        }
      };
    },
    863(e, t, r) {
      e.exports = authenticationBeforeRequest;
      const n = r(675);
      const i = r(143);
      function authenticationBeforeRequest(e, t) {
        if (typeof e.auth === 'string') {
          t.headers.authorization = i(e.auth);
          if (
            /^bearer /i.test(e.auth) &&
            !/machine-man/.test(t.headers.accept)
          ) {
            const e = t.headers.accept
              .split(',')
              .concat('application/vnd.github.machine-man-preview+json');
            t.headers.accept = e.filter(Boolean).join(',');
          }
          return;
        }
        if (e.auth.username) {
          const r = n(`${e.auth.username}:${e.auth.password}`);
          t.headers.authorization = `Basic ${r}`;
          if (e.otp) {
            t.headers['x-github-otp'] = e.otp;
          }
          return;
        }
        if (e.auth.clientId) {
          if (/\/applications\/:?[\w_]+\/tokens\/:?[\w_]+($|\?)/.test(t.url)) {
            const r = n(`${e.auth.clientId}:${e.auth.clientSecret}`);
            t.headers.authorization = `Basic ${r}`;
            return;
          }
          t.url += t.url.indexOf('?') === -1 ? '?' : '&';
          t.url += `client_id=${e.auth.clientId}&client_secret=${e.auth.clientSecret}`;
          return;
        }
        return Promise.resolve()
          .then(() => e.auth())
          .then(e => {
            t.headers.authorization = i(e);
          });
      }
    },
    866(e, t, r) {
      const n = r(816);
      e.exports = function(e) {
        const t = e.match(n);
        if (!t) {
          return null;
        }
        const r = t[0].replace(/#! ?/, '').split(' ');
        const i = r[0].split('/').pop();
        const s = r[1];
        return i === 'env' ? s : i + (s ? ` ${s}` : '');
      };
    },
    881(e) {
      const t = process.platform === 'win32';
      function notFoundError(e, t) {
        return Object.assign(new Error(`${t} ${e.command} ENOENT`), {
          code: 'ENOENT',
          errno: 'ENOENT',
          syscall: `${t} ${e.command}`,
          path: e.command,
          spawnargs: e.args,
        });
      }
      function hookChildProcess(e, r) {
        if (!t) {
          return;
        }
        const n = e.emit;
        e.emit = function(t, i) {
          if (t === 'exit') {
            const t = verifyENOENT(i, r, 'spawn');
            if (t) {
              return n.call(e, 'error', t);
            }
          }
          return n.apply(e, arguments);
        };
      }
      function verifyENOENT(e, r) {
        if (t && e === 1 && !r.file) {
          return notFoundError(r.original, 'spawn');
        }
        return null;
      }
      function verifyENOENTSync(e, r) {
        if (t && e === 1 && !r.file) {
          return notFoundError(r.original, 'spawnSync');
        }
        return null;
      }
      e.exports = {
        hookChildProcess,
        verifyENOENT,
        verifyENOENTSync,
        notFoundError,
      };
    },
    883(e) {
      const t = 'Expected a function';
      const r = '__lodash_hash_undefined__';
      const n = 1 / 0;
      const i = 9007199254740991;
      const s = '[object Function]';
      const o = '[object GeneratorFunction]';
      const a = '[object Symbol]';
      const u = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/;
      const p = /^\w*$/;
      const c = /^\./;
      const d = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
      const l = /[\\^$.*+?()[\]{}|]/g;
      const g = /\\(\\)?/g;
      const m = /^\[object .+?Constructor\]$/;
      const h = /^(?:0|[1-9]\d*)$/;
      const y =
        typeof global === 'object' &&
        global &&
        global.Object === Object &&
        global;
      const f =
        typeof self === 'object' && self && self.Object === Object && self;
      const b = y || f || Function('return this')();
      function getValue(e, t) {
        return e == null ? undefined : e[t];
      }
      function isHostObject(e) {
        let t = false;
        if (e != null && typeof e.toString !== 'function') {
          try {
            t = !!`${e}`;
          } catch (e) {}
        }
        return t;
      }
      const _ = Array.prototype;
      const q = Function.prototype;
      const w = Object.prototype;
      const v = b['__core-js_shared__'];
      const E = (function() {
        const e = /[^.]+$/.exec((v && v.keys && v.keys.IE_PROTO) || '');
        return e ? `Symbol(src)_1.${e}` : '';
      })();
      const T = q.toString;
      const j = w.hasOwnProperty;
      const k = w.toString;
      const S = RegExp(
        `^${T.call(j)
          .replace(l, '\\$&')
          .replace(
            /hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,
            '$1.*?',
          )}$`,
      );
      const P = b.Symbol;
      const C = _.splice;
      const O = getNative(b, 'Map');
      const x = getNative(Object, 'create');
      const G = P ? P.prototype : undefined;
      const A = G ? G.toString : undefined;
      function Hash(e) {
        let t = -1;
        const r = e ? e.length : 0;
        this.clear();
        while (++t < r) {
          const n = e[t];
          this.set(n[0], n[1]);
        }
      }
      function hashClear() {
        this.__data__ = x ? x(null) : {};
      }
      function hashDelete(e) {
        return this.has(e) && delete this.__data__[e];
      }
      function hashGet(e) {
        const t = this.__data__;
        if (x) {
          const n = t[e];
          return n === r ? undefined : n;
        }
        return j.call(t, e) ? t[e] : undefined;
      }
      function hashHas(e) {
        const t = this.__data__;
        return x ? t[e] !== undefined : j.call(t, e);
      }
      function hashSet(e, t) {
        const n = this.__data__;
        n[e] = x && t === undefined ? r : t;
        return this;
      }
      Hash.prototype.clear = hashClear;
      Hash.prototype.delete = hashDelete;
      Hash.prototype.get = hashGet;
      Hash.prototype.has = hashHas;
      Hash.prototype.set = hashSet;
      function ListCache(e) {
        let t = -1;
        const r = e ? e.length : 0;
        this.clear();
        while (++t < r) {
          const n = e[t];
          this.set(n[0], n[1]);
        }
      }
      function listCacheClear() {
        this.__data__ = [];
      }
      function listCacheDelete(e) {
        const t = this.__data__;
        const r = assocIndexOf(t, e);
        if (r < 0) {
          return false;
        }
        const n = t.length - 1;
        if (r == n) {
          t.pop();
        } else {
          C.call(t, r, 1);
        }
        return true;
      }
      function listCacheGet(e) {
        const t = this.__data__;
        const r = assocIndexOf(t, e);
        return r < 0 ? undefined : t[r][1];
      }
      function listCacheHas(e) {
        return assocIndexOf(this.__data__, e) > -1;
      }
      function listCacheSet(e, t) {
        const r = this.__data__;
        const n = assocIndexOf(r, e);
        if (n < 0) {
          r.push([e, t]);
        } else {
          r[n][1] = t;
        }
        return this;
      }
      ListCache.prototype.clear = listCacheClear;
      ListCache.prototype.delete = listCacheDelete;
      ListCache.prototype.get = listCacheGet;
      ListCache.prototype.has = listCacheHas;
      ListCache.prototype.set = listCacheSet;
      function MapCache(e) {
        let t = -1;
        const r = e ? e.length : 0;
        this.clear();
        while (++t < r) {
          const n = e[t];
          this.set(n[0], n[1]);
        }
      }
      function mapCacheClear() {
        this.__data__ = {
          hash: new Hash(),
          map: new (O || ListCache)(),
          string: new Hash(),
        };
      }
      function mapCacheDelete(e) {
        return getMapData(this, e).delete(e);
      }
      function mapCacheGet(e) {
        return getMapData(this, e).get(e);
      }
      function mapCacheHas(e) {
        return getMapData(this, e).has(e);
      }
      function mapCacheSet(e, t) {
        getMapData(this, e).set(e, t);
        return this;
      }
      MapCache.prototype.clear = mapCacheClear;
      MapCache.prototype.delete = mapCacheDelete;
      MapCache.prototype.get = mapCacheGet;
      MapCache.prototype.has = mapCacheHas;
      MapCache.prototype.set = mapCacheSet;
      function assignValue(e, t, r) {
        const n = e[t];
        if (!(j.call(e, t) && eq(n, r)) || (r === undefined && !(t in e))) {
          e[t] = r;
        }
      }
      function assocIndexOf(e, t) {
        let r = e.length;
        while (r--) {
          if (eq(e[r][0], t)) {
            return r;
          }
        }
        return -1;
      }
      function baseIsNative(e) {
        if (!isObject(e) || isMasked(e)) {
          return false;
        }
        const t = isFunction(e) || isHostObject(e) ? S : m;
        return t.test(toSource(e));
      }
      function baseSet(e, t, r, n) {
        if (!isObject(e)) {
          return e;
        }
        t = isKey(t, e) ? [t] : castPath(t);
        let i = -1;
        const s = t.length;
        const o = s - 1;
        let a = e;
        while (a != null && ++i < s) {
          const u = toKey(t[i]);
          let p = r;
          if (i != o) {
            const c = a[u];
            p = n ? n(c, u, a) : undefined;
            if (p === undefined) {
              p = isObject(c) ? c : isIndex(t[i + 1]) ? [] : {};
            }
          }
          assignValue(a, u, p);
          a = a[u];
        }
        return e;
      }
      function baseToString(e) {
        if (typeof e === 'string') {
          return e;
        }
        if (isSymbol(e)) {
          return A ? A.call(e) : '';
        }
        const t = `${e}`;
        return t == '0' && 1 / e == -n ? '-0' : t;
      }
      function castPath(e) {
        return D(e) ? e : R(e);
      }
      function getMapData(e, t) {
        const r = e.__data__;
        return isKeyable(t)
          ? r[typeof t === 'string' ? 'string' : 'hash']
          : r.map;
      }
      function getNative(e, t) {
        const r = getValue(e, t);
        return baseIsNative(r) ? r : undefined;
      }
      function isIndex(e, t) {
        t = t == null ? i : t;
        return (
          !!t &&
          (typeof e === 'number' || h.test(e)) &&
          e > -1 &&
          e % 1 == 0 &&
          e < t
        );
      }
      function isKey(e, t) {
        if (D(e)) {
          return false;
        }
        const r = typeof e;
        if (
          r == 'number' ||
          r == 'symbol' ||
          r == 'boolean' ||
          e == null ||
          isSymbol(e)
        ) {
          return true;
        }
        return p.test(e) || !u.test(e) || (t != null && e in Object(t));
      }
      function isKeyable(e) {
        const t = typeof e;
        return t == 'string' || t == 'number' || t == 'symbol' || t == 'boolean'
          ? e !== '__proto__'
          : e === null;
      }
      function isMasked(e) {
        return !!E && E in e;
      }
      var R = memoize(function(e) {
        e = toString(e);
        const t = [];
        if (c.test(e)) {
          t.push('');
        }
        e.replace(d, function(e, r, n, i) {
          t.push(n ? i.replace(g, '$1') : r || e);
        });
        return t;
      });
      function toKey(e) {
        if (typeof e === 'string' || isSymbol(e)) {
          return e;
        }
        const t = `${e}`;
        return t == '0' && 1 / e == -n ? '-0' : t;
      }
      function toSource(e) {
        if (e != null) {
          try {
            return T.call(e);
          } catch (e) {}
          try {
            return `${e}`;
          } catch (e) {}
        }
        return '';
      }
      function memoize(e, r) {
        if (typeof e !== 'function' || (r && typeof r !== 'function')) {
          throw new TypeError(t);
        }
        var n = function() {
          const t = arguments;
          const i = r ? r.apply(this, t) : t[0];
          const s = n.cache;
          if (s.has(i)) {
            return s.get(i);
          }
          const o = e.apply(this, t);
          n.cache = s.set(i, o);
          return o;
        };
        n.cache = new (memoize.Cache || MapCache)();
        return n;
      }
      memoize.Cache = MapCache;
      function eq(e, t) {
        return e === t || (e !== e && t !== t);
      }
      var D = Array.isArray;
      function isFunction(e) {
        const t = isObject(e) ? k.call(e) : '';
        return t == s || t == o;
      }
      function isObject(e) {
        const t = typeof e;
        return !!e && (t == 'object' || t == 'function');
      }
      function isObjectLike(e) {
        return !!e && typeof e === 'object';
      }
      function isSymbol(e) {
        return typeof e === 'symbol' || (isObjectLike(e) && k.call(e) == a);
      }
      function toString(e) {
        return e == null ? '' : baseToString(e);
      }
      function set(e, t, r) {
        return e == null ? e : baseSet(e, t, r);
      }
      e.exports = set;
    },
    899(e, t, r) {
      e.exports = registerEndpoints;
      const { Deprecation: n } = r(692);
      function registerEndpoints(e, t) {
        Object.keys(t).forEach(r => {
          if (!e[r]) {
            e[r] = {};
          }
          Object.keys(t[r]).forEach(i => {
            const s = t[r][i];
            const o = ['method', 'url', 'headers'].reduce((e, t) => {
              if (typeof s[t] !== 'undefined') {
                e[t] = s[t];
              }
              return e;
            }, {});
            o.request = { validate: s.params };
            let a = e.request.defaults(o);
            const u = Object.keys(s.params || {}).find(
              e => s.params[e].deprecated,
            );
            if (u) {
              const t = patchForDeprecation.bind(null, e, s);
              a = t(e.request.defaults(o), `.${r}.${i}()`);
              a.endpoint = t(a.endpoint, `.${r}.${i}.endpoint()`);
              a.endpoint.merge = t(
                a.endpoint.merge,
                `.${r}.${i}.endpoint.merge()`,
              );
            }
            if (s.deprecated) {
              e[r][i] = function deprecatedEndpointMethod() {
                e.log.warn(new n(`[@octokit/rest] ${s.deprecated}`));
                e[r][i] = a;
                return a.apply(null, arguments);
              };
              return;
            }
            e[r][i] = a;
          });
        });
      }
      function patchForDeprecation(e, t, r, i) {
        const s = s => {
          s = { ...s };
          Object.keys(s).forEach(r => {
            if (t.params[r] && t.params[r].deprecated) {
              const o = t.params[r].alias;
              e.log.warn(
                new n(
                  `[@octokit/rest] "${r}" parameter is deprecated for "${i}". Use "${o}" instead`,
                ),
              );
              if (!(o in s)) {
                s[o] = s[r];
              }
              delete s[r];
            }
          });
          return r(s);
        };
        Object.keys(r).forEach(e => {
          s[e] = r[e];
        });
        return s;
      }
    },
    929(e, t, r) {
      e.exports = hasNextPage;
      const n = r(370);
      const i = r(577);
      function hasNextPage(e) {
        n(
          `octokit.hasNextPage() – You can use octokit.paginate or async iterators instead: https://github.com/octokit/rest.js#pagination.`,
        );
        return i(e).next;
      }
    },
    948(e) {
      e.exports = function(e) {
        try {
          return e();
        } catch (e) {}
      };
    },
    954(e) {
      e.exports = validateAuth;
      function validateAuth(e) {
        if (typeof e === 'string') {
          return;
        }
        if (typeof e === 'function') {
          return;
        }
        if (e.username && e.password) {
          return;
        }
        if (e.clientId && e.clientSecret) {
          return;
        }
        throw new Error(`Invalid "auth" option: ${JSON.stringify(e)}`);
      }
    },
    955(e, t, r) {
      const n = r(622);
      const i = r(129);
      const s = r(20);
      const o = r(768);
      const a = r(621);
      const u = r(323);
      const p = r(145);
      const c = r(697);
      const d = r(260);
      const l = r(427);
      const g = r(168);
      const m = 1e3 * 1e3 * 10;
      function handleArgs(e, t, r) {
        let i;
        r = { extendEnv: true, env: {}, ...r };
        if (r.extendEnv) {
          r.env = { ...process.env, ...r.env };
        }
        if (r.__winShell === true) {
          delete r.__winShell;
          i = {
            command: e,
            args: t,
            options: r,
            file: e,
            original: { cmd: e, args: t },
          };
        } else {
          i = s._parse(e, t, r);
        }
        r = {
          maxBuffer: m,
          buffer: true,
          stripEof: true,
          preferLocal: true,
          localDir: i.options.cwd || process.cwd(),
          encoding: 'utf8',
          reject: true,
          cleanup: true,
          ...i.options,
        };
        r.stdio = g(r);
        if (r.preferLocal) {
          r.env = a.env({ ...r, cwd: r.localDir });
        }
        if (r.detached) {
          r.cleanup = false;
        }
        if (
          process.platform === 'win32' &&
          n.basename(i.command) === 'cmd.exe'
        ) {
          i.args.unshift('/q');
        }
        return { cmd: i.command, args: i.args, opts: r, parsed: i };
      }
      function handleInput(e, t) {
        if (t === null || t === undefined) {
          return;
        }
        if (u(t)) {
          t.pipe(e.stdin);
        } else {
          e.stdin.end(t);
        }
      }
      function handleOutput(e, t) {
        if (t && e.stripEof) {
          t = o(t);
        }
        return t;
      }
      function handleShell(e, t, r) {
        let n = '/bin/sh';
        let i = ['-c', t];
        r = { ...r };
        if (process.platform === 'win32') {
          r.__winShell = true;
          n = process.env.comspec || 'cmd.exe';
          i = ['/s', '/c', `"${t}"`];
          r.windowsVerbatimArguments = true;
        }
        if (r.shell) {
          n = r.shell;
          delete r.shell;
        }
        return e(n, i, r);
      }
      function getStream(e, t, { encoding: r, buffer: n, maxBuffer: i }) {
        if (!e[t]) {
          return null;
        }
        let s;
        if (!n) {
          s = new Promise((r, n) => {
            e[t].once('end', r).once('error', n);
          });
        } else if (r) {
          s = p(e[t], { encoding: r, maxBuffer: i });
        } else {
          s = p.buffer(e[t], { maxBuffer: i });
        }
        return s.catch(e => {
          e.stream = t;
          e.message = `${t} ${e.message}`;
          throw e;
        });
      }
      function makeError(e, t) {
        const { stdout: r, stderr: n } = e;
        let i = e.error;
        const { code: s, signal: o } = e;
        const { parsed: a, joinedCmd: u } = t;
        const p = t.timedOut || false;
        if (!i) {
          let e = '';
          if (Array.isArray(a.opts.stdio)) {
            if (a.opts.stdio[2] !== 'inherit') {
              e += e.length > 0 ? n : `\n${n}`;
            }
            if (a.opts.stdio[1] !== 'inherit') {
              e += `\n${r}`;
            }
          } else if (a.opts.stdio !== 'inherit') {
            e = `\n${n}${r}`;
          }
          i = new Error(`Command failed: ${u}${e}`);
          i.code = s < 0 ? l(s) : s;
        }
        i.stdout = r;
        i.stderr = n;
        i.failed = true;
        i.signal = o || null;
        i.cmd = u;
        i.timedOut = p;
        return i;
      }
      function joinCmd(e, t) {
        let r = e;
        if (Array.isArray(t) && t.length > 0) {
          r += ` ${t.join(' ')}`;
        }
        return r;
      }
      e.exports = (e, t, r) => {
        const n = handleArgs(e, t, r);
        const { encoding: o, buffer: a, maxBuffer: u } = n.opts;
        const p = joinCmd(e, t);
        let l;
        try {
          l = i.spawn(n.cmd, n.args, n.opts);
        } catch (e) {
          return Promise.reject(e);
        }
        let g;
        if (n.opts.cleanup) {
          g = d(() => {
            l.kill();
          });
        }
        let m = null;
        let h = false;
        const y = () => {
          if (m) {
            clearTimeout(m);
            m = null;
          }
          if (g) {
            g();
          }
        };
        if (n.opts.timeout > 0) {
          m = setTimeout(() => {
            m = null;
            h = true;
            l.kill(n.opts.killSignal);
          }, n.opts.timeout);
        }
        const f = new Promise(e => {
          l.on('exit', (t, r) => {
            y();
            e({ code: t, signal: r });
          });
          l.on('error', t => {
            y();
            e({ error: t });
          });
          if (l.stdin) {
            l.stdin.on('error', t => {
              y();
              e({ error: t });
            });
          }
        });
        function destroy() {
          if (l.stdout) {
            l.stdout.destroy();
          }
          if (l.stderr) {
            l.stderr.destroy();
          }
        }
        const b = () =>
          c(
            Promise.all([
              f,
              getStream(l, 'stdout', { encoding: o, buffer: a, maxBuffer: u }),
              getStream(l, 'stderr', { encoding: o, buffer: a, maxBuffer: u }),
            ]).then(e => {
              const t = e[0];
              t.stdout = e[1];
              t.stderr = e[2];
              if (t.error || t.code !== 0 || t.signal !== null) {
                const e = makeError(t, {
                  joinedCmd: p,
                  parsed: n,
                  timedOut: h,
                });
                e.killed = e.killed || l.killed;
                if (!n.opts.reject) {
                  return e;
                }
                throw e;
              }
              return {
                stdout: handleOutput(n.opts, t.stdout),
                stderr: handleOutput(n.opts, t.stderr),
                code: 0,
                failed: false,
                killed: false,
                signal: null,
                cmd: p,
                timedOut: false,
              };
            }),
            destroy,
          );
        s._enoent.hookChildProcess(l, n.parsed);
        handleInput(l, n.opts.input);
        l.then = (e, t) => b().then(e, t);
        l.catch = e => b().catch(e);
        return l;
      };
      e.exports.stdout = (...t) => e.exports(...t).then(e => e.stdout);
      e.exports.stderr = (...t) => e.exports(...t).then(e => e.stderr);
      e.exports.shell = (t, r) => handleShell(e.exports, t, r);
      e.exports.sync = (e, t, r) => {
        const n = handleArgs(e, t, r);
        const s = joinCmd(e, t);
        if (u(n.opts.input)) {
          throw new TypeError(
            'The `input` option cannot be a stream in sync mode',
          );
        }
        const o = i.spawnSync(n.cmd, n.args, n.opts);
        o.code = o.status;
        if (o.error || o.status !== 0 || o.signal !== null) {
          const e = makeError(o, { joinedCmd: s, parsed: n });
          if (!n.opts.reject) {
            return e;
          }
          throw e;
        }
        return {
          stdout: handleOutput(n.opts, o.stdout),
          stderr: handleOutput(n.opts, o.stderr),
          code: 0,
          failed: false,
          signal: null,
          cmd: s,
          timedOut: false,
        };
      };
      e.exports.shellSync = (t, r) => handleShell(e.exports.sync, t, r);
    },
    966(e, t, r) {
      const { PassThrough: n } = r(413);
      e.exports = e => {
        e = { ...e };
        const { array: t } = e;
        let { encoding: r } = e;
        const i = r === 'buffer';
        let s = false;
        if (t) {
          s = !(r || i);
        } else {
          r = r || 'utf8';
        }
        if (i) {
          r = null;
        }
        let o = 0;
        const a = [];
        const u = new n({ objectMode: s });
        if (r) {
          u.setEncoding(r);
        }
        u.on('data', e => {
          a.push(e);
          if (s) {
            o = a.length;
          } else {
            o += e.length;
          }
        });
        u.getBufferedValue = () => {
          if (t) {
            return a;
          }
          return i ? Buffer.concat(a, o) : a.join('');
        };
        u.getBufferedLength = () => o;
        return u;
      };
    },
    969(e, t, r) {
      const n = r(11);
      e.exports = n(once);
      e.exports.strict = n(onceStrict);
      once.proto = once(function() {
        Object.defineProperty(Function.prototype, 'once', {
          value() {
            return once(this);
          },
          configurable: true,
        });
        Object.defineProperty(Function.prototype, 'onceStrict', {
          value() {
            return onceStrict(this);
          },
          configurable: true,
        });
      });
      function once(e) {
        var t = function() {
          if (t.called) return t.value;
          t.called = true;
          return (t.value = e.apply(this, arguments));
        };
        t.called = false;
        return t;
      }
      function onceStrict(e) {
        var t = function() {
          if (t.called) throw new Error(t.onceError);
          t.called = true;
          return (t.value = e.apply(this, arguments));
        };
        const r = e.name || 'Function wrapped with `once`';
        t.onceError = `${r} shouldn't be called more than once`;
        t.called = false;
        return t;
      }
    },
  },
  function(e) {
    !(function() {
      e.r = function(e) {
        if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
          Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' });
        }
        Object.defineProperty(e, '__esModule', { value: true });
      };
    })();
    !(function() {
      const t = Object.prototype.hasOwnProperty;
      e.d = function(e, r, n) {
        if (!t.call(e, r)) {
          Object.defineProperty(e, r, { enumerable: true, get: n });
        }
      };
    })();
  },
);
