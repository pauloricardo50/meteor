(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var _ = Package.underscore._;
var check = Package.check.check;
var Match = Package.check.Match;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;
var Log = Package.logging.Log;
var meteorInstall = Package.modules.meteorInstall;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var Migrations;

var require = meteorInstall({"node_modules":{"meteor":{"percolate:migrations":{"migrations_server.js":function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/percolate_migrations/migrations_server.js                                                           //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
/*
  Adds migration capabilities. Migrations are defined like:

  Migrations.add({
    up: function() {}, //*required* code to run to migrate upwards
    version: 1, //*required* number to identify migration order
    down: function() {}, //*optional* code to run to migrate downwards
    name: 'Something' //*optional* display name for the migration
  });

  The ordering of migrations is determined by the version you set.

  To run the migrations, set the MIGRATE environment variable to either
  'latest' or the version number you want to migrate to. Optionally, append
  ',exit' if you want the migrations to exit the meteor process, e.g if you're
  migrating from a script (remember to pass the --once parameter).

  e.g:
  MIGRATE="latest" mrt # ensure we'll be at the latest version and run the app
  MIGRATE="latest,exit" mrt --once # ensure we'll be at the latest version and exit
  MIGRATE="2,exit" mrt --once # migrate to version 2 and exit

  Note: Migrations will lock ensuring only 1 app can be migrating at once. If
  a migration crashes, the control record in the migrations collection will
  remain locked and at the version it was at previously, however the db could
  be in an inconsistant state.
*/
// since we'll be at version 0 by default, we should have a migration set for
// it.
var DefaultMigration = {
  version: 0,
  up: function () {}
};
Migrations = {
  _list: [DefaultMigration],
  options: {
    // false disables logging
    log: true,
    // null or a function
    logger: null,
    // enable/disable info log "already at latest."
    logIfLatest: true,
    // migrations collection name
    collectionName: 'migrations'
  },
  config: function (opts) {
    this.options = _.extend({}, this.options, opts);
  }
};
/*
  Logger factory function. Takes a prefix string and options object
  and uses an injected `logger` if provided, else falls back to
  Meteor's `Log` package.
  Will send a log object to the injected logger, on the following form:
    message: String
    level: String (info, warn, error, debug)
    tag: 'Migrations'
*/

function createLogger(prefix) {
  check(prefix, String); // Return noop if logging is disabled.

  if (Migrations.options.log === false) {
    return function () {};
  }

  return function (level, message) {
    check(level, Match.OneOf('info', 'error', 'warn', 'debug'));
    check(message, String);
    var logger = Migrations.options && Migrations.options.logger;

    if (logger && _.isFunction(logger)) {
      logger({
        level: level,
        message: message,
        tag: prefix
      });
    } else {
      Log[level]({
        message: prefix + ': ' + message
      });
    }
  };
}

var log;
Meteor.startup(function () {
  var options = Migrations.options; // collection holding the control record

  Migrations._collection = new Mongo.Collection(options.collectionName);
  log = createLogger('Migrations');
  ['info', 'warn', 'error', 'debug'].forEach(function (level) {
    log[level] = _.partial(log, level);
  });
  if (process.env.MIGRATE) Migrations.migrateTo(process.env.MIGRATE);
}); // Add a new migration:
// {up: function *required
//  version: Number *required
//  down: function *optional
//  name: String *optional
// }

Migrations.add = function (migration) {
  if (typeof migration.up !== 'function') throw new Meteor.Error('Migration must supply an up function.');
  if (typeof migration.version !== 'number') throw new Meteor.Error('Migration must supply a version number.');
  if (migration.version <= 0) throw new Meteor.Error('Migration version must be greater than 0'); // Freeze the migration object to make it hereafter immutable

  Object.freeze(migration);

  this._list.push(migration);

  this._list = _.sortBy(this._list, function (m) {
    return m.version;
  });
}; // Attempts to run the migrations using command in the form of:
// e.g 'latest', 'latest,exit', 2
// use 'XX,rerun' to re-run the migration at that version


Migrations.migrateTo = function (command) {
  if (_.isUndefined(command) || command === '' || this._list.length === 0) throw new Error('Cannot migrate using invalid command: ' + command);

  if (typeof command === 'number') {
    var version = command;
  } else {
    var version = command.split(',')[0]; //.trim();

    var subcommand = command.split(',')[1]; //.trim();
  }

  if (version === 'latest') {
    this._migrateTo(_.last(this._list).version);
  } else {
    this._migrateTo(parseInt(version), subcommand === 'rerun');
  } // remember to run meteor with --once otherwise it will restart


  if (subcommand === 'exit') process.exit(0);
}; // just returns the current version


Migrations.getVersion = function () {
  return this._getControl().version;
}; // migrates to the specific version passed in


Migrations._migrateTo = function (version, rerun) {
  var self = this;

  var control = this._getControl(); // Side effect: upserts control document.


  var currentVersion = control.version;

  if (lock() === false) {
    log.info('Not migrating, control is locked.');
    return;
  }

  if (rerun) {
    log.info('Rerunning version ' + version);
    migrate('up', this._findIndexByVersion(version));
    log.info('Finished migrating.');
    unlock();
    return;
  }

  if (currentVersion === version) {
    if (Migrations.options.logIfLatest) {
      log.info('Not migrating, already at version ' + version);
    }

    unlock();
    return;
  }

  var startIdx = this._findIndexByVersion(currentVersion);

  var endIdx = this._findIndexByVersion(version); // log.info('startIdx:' + startIdx + ' endIdx:' + endIdx);


  log.info('Migrating from version ' + this._list[startIdx].version + ' -> ' + this._list[endIdx].version); // run the actual migration

  function migrate(direction, idx) {
    var migration = self._list[idx];

    if (typeof migration[direction] !== 'function') {
      unlock();
      throw new Meteor.Error('Cannot migrate ' + direction + ' on version ' + migration.version);
    }

    function maybeName() {
      return migration.name ? ' (' + migration.name + ')' : '';
    }

    log.info('Running ' + direction + '() on version ' + migration.version + maybeName());
    migration[direction](migration);
  } // Returns true if lock was acquired.


  function lock() {
    // This is atomic. The selector ensures only one caller at a time will see
    // the unlocked control, and locking occurs in the same update's modifier.
    // All other simultaneous callers will get false back from the update.
    return self._collection.update({
      _id: 'control',
      locked: false
    }, {
      $set: {
        locked: true,
        lockedAt: new Date()
      }
    }) === 1;
  } // Side effect: saves version.


  function unlock() {
    self._setControl({
      locked: false,
      version: currentVersion
    });
  }

  if (currentVersion < version) {
    for (var i = startIdx; i < endIdx; i++) {
      migrate('up', i + 1);
      currentVersion = self._list[i + 1].version;
    }
  } else {
    for (var i = startIdx; i > endIdx; i--) {
      migrate('down', i);
      currentVersion = self._list[i - 1].version;
    }
  }

  unlock();
  log.info('Finished migrating.');
}; // gets the current control record, optionally creating it if non-existant


Migrations._getControl = function () {
  var control = this._collection.findOne({
    _id: 'control'
  });

  return control || this._setControl({
    version: 0,
    locked: false
  });
}; // sets the control record


Migrations._setControl = function (control) {
  // be quite strict
  check(control.version, Number);
  check(control.locked, Boolean);

  this._collection.update({
    _id: 'control'
  }, {
    $set: {
      version: control.version,
      locked: control.locked
    }
  }, {
    upsert: true
  });

  return control;
}; // returns the migration index in _list or throws if not found


Migrations._findIndexByVersion = function (version) {
  for (var i = 0; i < this._list.length; i++) {
    if (this._list[i].version === version) return i;
  }

  throw new Meteor.Error("Can't find migration version " + version);
}; //reset (mainly intended for tests)


Migrations._reset = function () {
  this._list = [{
    version: 0,
    up: function () {}
  }];

  this._collection.remove({});
}; // unlock control


Migrations.unlock = function () {
  this._collection.update({
    _id: 'control'
  }, {
    $set: {
      locked: false
    }
  });
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});

require("/node_modules/meteor/percolate:migrations/migrations_server.js");

/* Exports */
Package._define("percolate:migrations", {
  Migrations: Migrations
});

})();

//# sourceURL=meteor://💻app/packages/percolate_migrations.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvcGVyY29sYXRlOm1pZ3JhdGlvbnMvbWlncmF0aW9uc19zZXJ2ZXIuanMiXSwibmFtZXMiOlsiRGVmYXVsdE1pZ3JhdGlvbiIsInZlcnNpb24iLCJ1cCIsIk1pZ3JhdGlvbnMiLCJfbGlzdCIsIm9wdGlvbnMiLCJsb2ciLCJsb2dnZXIiLCJsb2dJZkxhdGVzdCIsImNvbGxlY3Rpb25OYW1lIiwiY29uZmlnIiwib3B0cyIsIl8iLCJleHRlbmQiLCJjcmVhdGVMb2dnZXIiLCJwcmVmaXgiLCJjaGVjayIsIlN0cmluZyIsImxldmVsIiwibWVzc2FnZSIsIk1hdGNoIiwiT25lT2YiLCJpc0Z1bmN0aW9uIiwidGFnIiwiTG9nIiwiTWV0ZW9yIiwic3RhcnR1cCIsIl9jb2xsZWN0aW9uIiwiTW9uZ28iLCJDb2xsZWN0aW9uIiwiZm9yRWFjaCIsInBhcnRpYWwiLCJwcm9jZXNzIiwiZW52IiwiTUlHUkFURSIsIm1pZ3JhdGVUbyIsImFkZCIsIm1pZ3JhdGlvbiIsIkVycm9yIiwiT2JqZWN0IiwiZnJlZXplIiwicHVzaCIsInNvcnRCeSIsIm0iLCJjb21tYW5kIiwiaXNVbmRlZmluZWQiLCJsZW5ndGgiLCJzcGxpdCIsInN1YmNvbW1hbmQiLCJfbWlncmF0ZVRvIiwibGFzdCIsInBhcnNlSW50IiwiZXhpdCIsImdldFZlcnNpb24iLCJfZ2V0Q29udHJvbCIsInJlcnVuIiwic2VsZiIsImNvbnRyb2wiLCJjdXJyZW50VmVyc2lvbiIsImxvY2siLCJpbmZvIiwibWlncmF0ZSIsIl9maW5kSW5kZXhCeVZlcnNpb24iLCJ1bmxvY2siLCJzdGFydElkeCIsImVuZElkeCIsImRpcmVjdGlvbiIsImlkeCIsIm1heWJlTmFtZSIsIm5hbWUiLCJ1cGRhdGUiLCJfaWQiLCJsb2NrZWQiLCIkc2V0IiwibG9ja2VkQXQiLCJEYXRlIiwiX3NldENvbnRyb2wiLCJpIiwiZmluZE9uZSIsIk51bWJlciIsIkJvb2xlYW4iLCJ1cHNlcnQiLCJf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T0FBOUIsRUFBdUMsT0FBTzRFLENBQVA7QUFDeEM7O0FBRUQsUUFBTSxJQUFJcEQsTUFBTSxDQUFDYSxLQUFYLENBQWlCLGtDQUFrQ3JDLE9BQW5ELENBQU47QUFDRCxDQU5ELEMsQ0FRQTs7O0FBQ0FFLFVBQVUsQ0FBQytFLE1BQVgsR0FBb0IsWUFBVztBQUM3QixPQUFLOUUsS0FBTCxHQUFhLENBQUM7QUFBRUgsV0FBTyxFQUFFLENBQVg7QUFBY0MsTUFBRSxFQUFFLFlBQVcsQ0FBRTtBQUEvQixHQUFELENBQWI7O0FBQ0EsT0FBS3lCLFdBQUwsQ0FBaUJ3RCxNQUFqQixDQUF3QixFQUF4QjtBQUNELENBSEQsQyxDQUtBOzs7QUFDQWhGLFVBQVUsQ0FBQzRELE1BQVgsR0FBb0IsWUFBVztBQUM3QixPQUFLcEMsV0FBTCxDQUFpQjJDLE1BQWpCLENBQXdCO0FBQUVDLE9BQUcsRUFBRTtBQUFQLEdBQXhCLEVBQTRDO0FBQUVFLFFBQUksRUFBRTtBQUFFRCxZQUFNLEVBQUU7QUFBVjtBQUFSLEdBQTVDO0FBQ0QsQ0FGRCxDIiwiZmlsZSI6Ii9wYWNrYWdlcy9wZXJjb2xhdGVfbWlncmF0aW9ucy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gIEFkZHMgbWlncmF0aW9uIGNhcGFiaWxpdGllcy4gTWlncmF0aW9ucyBhcmUgZGVmaW5lZCBsaWtlOlxuXG4gIE1pZ3JhdGlvbnMuYWRkKHtcbiAgICB1cDogZnVuY3Rpb24oKSB7fSwgLy8qcmVxdWlyZWQqIGNvZGUgdG8gcnVuIHRvIG1pZ3JhdGUgdXB3YXJkc1xuICAgIHZlcnNpb246IDEsIC8vKnJlcXVpcmVkKiBudW1iZXIgdG8gaWRlbnRpZnkgbWlncmF0aW9uIG9yZGVyXG4gICAgZG93bjogZnVuY3Rpb24oKSB7fSwgLy8qb3B0aW9uYWwqIGNvZGUgdG8gcnVuIHRvIG1pZ3JhdGUgZG93bndhcmRzXG4gICAgbmFtZTogJ1NvbWV0aGluZycgLy8qb3B0aW9uYWwqIGRpc3BsYXkgbmFtZSBmb3IgdGhlIG1pZ3JhdGlvblxuICB9KTtcblxuICBUaGUgb3JkZXJpbmcgb2YgbWlncmF0aW9ucyBpcyBkZXRlcm1pbmVkIGJ5IHRoZSB2ZXJzaW9uIHlvdSBzZXQuXG5cbiAgVG8gcnVuIHRoZSBtaWdyYXRpb25zLCBzZXQgdGhlIE1JR1JBVEUgZW52aXJvbm1lbnQgdmFyaWFibGUgdG8gZWl0aGVyXG4gICdsYXRlc3QnIG9yIHRoZSB2ZXJzaW9uIG51bWJlciB5b3Ugd2FudCB0byBtaWdyYXRlIHRvLiBPcHRpb25hbGx5LCBhcHBlbmRcbiAgJyxleGl0JyBpZiB5b3Ugd2FudCB0aGUgbWlncmF0aW9ucyB0byBleGl0IHRoZSBtZXRlb3IgcHJvY2VzcywgZS5nIGlmIHlvdSdyZVxuICBtaWdyYXRpbmcgZnJvbSBhIHNjcmlwdCAocmVtZW1iZXIgdG8gcGFzcyB0aGUgLS1vbmNlIHBhcmFtZXRlcikuXG5cbiAgZS5nOlxuICBNSUdSQVRFPVwibGF0ZXN0XCIgbXJ0ICMgZW5zdXJlIHdlJ2xsIGJlIGF0IHRoZSBsYXRlc3QgdmVyc2lvbiBhbmQgcnVuIHRoZSBhcHBcbiAgTUlHUkFURT1cImxhdGVzdCxleGl0XCIgbXJ0IC0tb25jZSAjIGVuc3VyZSB3ZSdsbCBiZSBhdCB0aGUgbGF0ZXN0IHZlcnNpb24gYW5kIGV4aXRcbiAgTUlHUkFURT1cIjIsZXhpdFwiIG1ydCAtLW9uY2UgIyBtaWdyYXRlIHRvIHZlcnNpb24gMiBhbmQgZXhpdFxuXG4gIE5vdGU6IE1pZ3JhdGlvbnMgd2lsbCBsb2NrIGVuc3VyaW5nIG9ubHkgMSBhcHAgY2FuIGJlIG1pZ3JhdGluZyBhdCBvbmNlLiBJZlxuICBhIG1pZ3JhdGlvbiBjcmFzaGVzLCB0aGUgY29udHJvbCByZWNvcmQgaW4gdGhlIG1pZ3JhdGlvbnMgY29sbGVjdGlvbiB3aWxsXG4gIHJlbWFpbiBsb2NrZWQgYW5kIGF0IHRoZSB2ZXJzaW9uIGl0IHdhcyBhdCBwcmV2aW91c2x5LCBob3dldmVyIHRoZSBkYiBjb3VsZFxuICBiZSBpbiBhbiBpbmNvbnNpc3RhbnQgc3RhdGUuXG4qL1xuXG4vLyBzaW5jZSB3ZSdsbCBiZSBhdCB2ZXJzaW9uIDAgYnkgZGVmYXVsdCwgd2Ugc2hvdWxkIGhhdmUgYSBtaWdyYXRpb24gc2V0IGZvclxuLy8gaXQuXG52YXIgRGVmYXVsdE1pZ3JhdGlvbiA9IHsgdmVyc2lvbjogMCwgdXA6IGZ1bmN0aW9uKCkge30gfTtcblxuTWlncmF0aW9ucyA9IHtcbiAgX2xpc3Q6IFtEZWZhdWx0TWlncmF0aW9uXSxcbiAgb3B0aW9uczoge1xuICAgIC8vIGZhbHNlIGRpc2FibGVzIGxvZ2dpbmdcbiAgICBsb2c6IHRydWUsXG4gICAgLy8gbnVsbCBvciBhIGZ1bmN0aW9uXG4gICAgbG9nZ2VyOiBudWxsLFxuICAgIC8vIGVuYWJsZS9kaXNhYmxlIGluZm8gbG9nIFwiYWxyZWFkeSBhdCBsYXRlc3QuXCJcbiAgICBsb2dJZkxhdGVzdDogdHJ1ZSxcbiAgICAvLyBtaWdyYXRpb25zIGNvbGxlY3Rpb24gbmFtZVxuICAgIGNvbGxlY3Rpb25OYW1lOiAnbWlncmF0aW9ucycsXG4gIH0sXG4gIGNvbmZpZzogZnVuY3Rpb24ob3B0cykge1xuICAgIHRoaXMub3B0aW9ucyA9IF8uZXh0ZW5kKHt9LCB0aGlzLm9wdGlvbnMsIG9wdHMpO1xuICB9LFxufTtcblxuLypcbiAgTG9nZ2VyIGZhY3RvcnkgZnVuY3Rpb24uIFRha2VzIGEgcHJlZml4IHN0cmluZyBhbmQgb3B0aW9ucyBvYmplY3RcbiAgYW5kIHVzZXMgYW4gaW5qZWN0ZWQgYGxvZ2dlcmAgaWYgcHJvdmlkZWQsIGVsc2UgZmFsbHMgYmFjayB0b1xuICBNZXRlb3IncyBgTG9nYCBwYWNrYWdlLlxuICBXaWxsIHNlbmQgYSBsb2cgb2JqZWN0IHRvIHRoZSBpbmplY3RlZCBsb2dnZXIsIG9uIHRoZSBmb2xsb3dpbmcgZm9ybTpcbiAgICBtZXNzYWdlOiBTdHJpbmdcbiAgICBsZXZlbDogU3RyaW5nIChpbmZvLCB3YXJuLCBlcnJvciwgZGVidWcpXG4gICAgdGFnOiAnTWlncmF0aW9ucydcbiovXG5mdW5jdGlvbiBjcmVhdGVMb2dnZXIocHJlZml4KSB7XG4gIGNoZWNrKHByZWZpeCwgU3RyaW5nKTtcblxuICAvLyBSZXR1cm4gbm9vcCBpZiBsb2dnaW5nIGlzIGRpc2FibGVkLlxuICBpZiAoTWlncmF0aW9ucy5vcHRpb25zLmxvZyA9PT0gZmFsc2UpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7fTtcbiAgfVxuXG4gIHJldHVybiBmdW5jdGlvbihsZXZlbCwgbWVzc2FnZSkge1xuICAgIGNoZWNrKGxldmVsLCBNYXRjaC5PbmVPZignaW5mbycsICdlcnJvcicsICd3YXJuJywgJ2RlYnVnJykpO1xuICAgIGNoZWNrKG1lc3NhZ2UsIFN0cmluZyk7XG5cbiAgICB2YXIgbG9nZ2VyID0gTWlncmF0aW9ucy5vcHRpb25zICYmIE1pZ3JhdGlvbnMub3B0aW9ucy5sb2dnZXI7XG5cbiAgICBpZiAobG9nZ2VyICYmIF8uaXNGdW5jdGlvbihsb2dnZXIpKSB7XG4gICAgICBsb2dnZXIoe1xuICAgICAgICBsZXZlbDogbGV2ZWwsXG4gICAgICAgIG1lc3NhZ2U6IG1lc3NhZ2UsXG4gICAgICAgIHRhZzogcHJlZml4LFxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIExvZ1tsZXZlbF0oeyBtZXNzYWdlOiBwcmVmaXggKyAnOiAnICsgbWVzc2FnZSB9KTtcbiAgICB9XG4gIH07XG59XG5cbnZhciBsb2c7XG5cbk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICB2YXIgb3B0aW9ucyA9IE1pZ3JhdGlvbnMub3B0aW9ucztcblxuICAvLyBjb2xsZWN0aW9uIGhvbGRpbmcgdGhlIGNvbnRyb2wgcmVjb3JkXG4gIE1pZ3JhdGlvbnMuX2NvbGxlY3Rpb24gPSBuZXcgTW9uZ28uQ29sbGVjdGlvbihvcHRpb25zLmNvbGxlY3Rpb25OYW1lKTtcblxuICBsb2cgPSBjcmVhdGVMb2dnZXIoJ01pZ3JhdGlvbnMnKTtcblxuICBbJ2luZm8nLCAnd2FybicsICdlcnJvcicsICdkZWJ1ZyddLmZvckVhY2goZnVuY3Rpb24obGV2ZWwpIHtcbiAgICBsb2dbbGV2ZWxdID0gXy5wYXJ0aWFsKGxvZywgbGV2ZWwpO1xuICB9KTtcblxuICBpZiAocHJvY2Vzcy5lbnYuTUlHUkFURSkgTWlncmF0aW9ucy5taWdyYXRlVG8ocHJvY2Vzcy5lbnYuTUlHUkFURSk7XG59KTtcblxuLy8gQWRkIGEgbmV3IG1pZ3JhdGlvbjpcbi8vIHt1cDogZnVuY3Rpb24gKnJlcXVpcmVkXG4vLyAgdmVyc2lvbjogTnVtYmVyICpyZXF1aXJlZFxuLy8gIGRvd246IGZ1bmN0aW9uICpvcHRpb25hbFxuLy8gIG5hbWU6IFN0cmluZyAqb3B0aW9uYWxcbi8vIH1cbk1pZ3JhdGlvbnMuYWRkID0gZnVuY3Rpb24obWlncmF0aW9uKSB7XG4gIGlmICh0eXBlb2YgbWlncmF0aW9uLnVwICE9PSAnZnVuY3Rpb24nKVxuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ01pZ3JhdGlvbiBtdXN0IHN1cHBseSBhbiB1cCBmdW5jdGlvbi4nKTtcblxuICBpZiAodHlwZW9mIG1pZ3JhdGlvbi52ZXJzaW9uICE9PSAnbnVtYmVyJylcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdNaWdyYXRpb24gbXVzdCBzdXBwbHkgYSB2ZXJzaW9uIG51bWJlci4nKTtcblxuICBpZiAobWlncmF0aW9uLnZlcnNpb24gPD0gMClcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdNaWdyYXRpb24gdmVyc2lvbiBtdXN0IGJlIGdyZWF0ZXIgdGhhbiAwJyk7XG5cbiAgLy8gRnJlZXplIHRoZSBtaWdyYXRpb24gb2JqZWN0IHRvIG1ha2UgaXQgaGVyZWFmdGVyIGltbXV0YWJsZVxuICBPYmplY3QuZnJlZXplKG1pZ3JhdGlvbik7XG5cbiAgdGhpcy5fbGlzdC5wdXNoKG1pZ3JhdGlvbik7XG4gIHRoaXMuX2xpc3QgPSBfLnNvcnRCeSh0aGlzLl9saXN0LCBmdW5jdGlvbihtKSB7XG4gICAgcmV0dXJuIG0udmVyc2lvbjtcbiAgfSk7XG59O1xuXG4vLyBBdHRlbXB0cyB0byBydW4gdGhlIG1pZ3JhdGlvbnMgdXNpbmcgY29tbWFuZCBpbiB0aGUgZm9ybSBvZjpcbi8vIGUuZyAnbGF0ZXN0JywgJ2xhdGVzdCxleGl0JywgMlxuLy8gdXNlICdYWCxyZXJ1bicgdG8gcmUtcnVuIHRoZSBtaWdyYXRpb24gYXQgdGhhdCB2ZXJzaW9uXG5NaWdyYXRpb25zLm1pZ3JhdGVUbyA9IGZ1bmN0aW9uKGNvbW1hbmQpIHtcbiAgaWYgKF8uaXNVbmRlZmluZWQoY29tbWFuZCkgfHwgY29tbWFuZCA9PT0gJycgfHwgdGhpcy5fbGlzdC5sZW5ndGggPT09IDApXG4gICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgbWlncmF0ZSB1c2luZyBpbnZhbGlkIGNvbW1hbmQ6ICcgKyBjb21tYW5kKTtcblxuICBpZiAodHlwZW9mIGNvbW1hbmQgPT09ICdudW1iZXInKSB7XG4gICAgdmFyIHZlcnNpb24gPSBjb21tYW5kO1xuICB9IGVsc2Uge1xuICAgIHZhciB2ZXJzaW9uID0gY29tbWFuZC5zcGxpdCgnLCcpWzBdOyAvLy50cmltKCk7XG4gICAgdmFyIHN1YmNvbW1hbmQgPSBjb21tYW5kLnNwbGl0KCcsJylbMV07IC8vLnRyaW0oKTtcbiAgfVxuXG4gIGlmICh2ZXJzaW9uID09PSAnbGF0ZXN0Jykge1xuICAgIHRoaXMuX21pZ3JhdGVUbyhfLmxhc3QodGhpcy5fbGlzdCkudmVyc2lvbik7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5fbWlncmF0ZVRvKHBhcnNlSW50KHZlcnNpb24pLCBzdWJjb21tYW5kID09PSAncmVydW4nKTtcbiAgfVxuXG4gIC8vIHJlbWVtYmVyIHRvIHJ1biBtZXRlb3Igd2l0aCAtLW9uY2Ugb3RoZXJ3aXNlIGl0IHdpbGwgcmVzdGFydFxuICBpZiAoc3ViY29tbWFuZCA9PT0gJ2V4aXQnKSBwcm9jZXNzLmV4aXQoMCk7XG59O1xuXG4vLyBqdXN0IHJldHVybnMgdGhlIGN1cnJlbnQgdmVyc2lvblxuTWlncmF0aW9ucy5nZXRWZXJzaW9uID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLl9nZXRDb250cm9sKCkudmVyc2lvbjtcbn07XG5cbi8vIG1pZ3JhdGVzIHRvIHRoZSBzcGVjaWZpYyB2ZXJzaW9uIHBhc3NlZCBpblxuTWlncmF0aW9ucy5fbWlncmF0ZVRvID0gZnVuY3Rpb24odmVyc2lvbiwgcmVydW4pIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICB2YXIgY29udHJvbCA9IHRoaXMuX2dldENvbnRyb2woKTsgLy8gU2lkZSBlZmZlY3Q6IHVwc2VydHMgY29udHJvbCBkb2N1bWVudC5cbiAgdmFyIGN1cnJlbnRWZXJzaW9uID0gY29udHJvbC52ZXJzaW9uO1xuXG4gIGlmIChsb2NrKCkgPT09IGZhbHNlKSB7XG4gICAgbG9nLmluZm8oJ05vdCBtaWdyYXRpbmcsIGNvbnRyb2wgaXMgbG9ja2VkLicpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmIChyZXJ1bikge1xuICAgIGxvZy5pbmZvKCdSZXJ1bm5pbmcgdmVyc2lvbiAnICsgdmVyc2lvbik7XG4gICAgbWlncmF0ZSgndXAnLCB0aGlzLl9maW5kSW5kZXhCeVZlcnNpb24odmVyc2lvbikpO1xuICAgIGxvZy5pbmZvKCdGaW5pc2hlZCBtaWdyYXRpbmcuJyk7XG4gICAgdW5sb2NrKCk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKGN1cnJlbnRWZXJzaW9uID09PSB2ZXJzaW9uKSB7XG4gICAgaWYgKE1pZ3JhdGlvbnMub3B0aW9ucy5sb2dJZkxhdGVzdCkge1xuICAgICAgbG9nLmluZm8oJ05vdCBtaWdyYXRpbmcsIGFscmVhZHkgYXQgdmVyc2lvbiAnICsgdmVyc2lvbik7XG4gICAgfVxuICAgIHVubG9jaygpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHZhciBzdGFydElkeCA9IHRoaXMuX2ZpbmRJbmRleEJ5VmVyc2lvbihjdXJyZW50VmVyc2lvbik7XG4gIHZhciBlbmRJZHggPSB0aGlzLl9maW5kSW5kZXhCeVZlcnNpb24odmVyc2lvbik7XG5cbiAgLy8gbG9nLmluZm8oJ3N0YXJ0SWR4OicgKyBzdGFydElkeCArICcgZW5kSWR4OicgKyBlbmRJZHgpO1xuICBsb2cuaW5mbyhcbiAgICAnTWlncmF0aW5nIGZyb20gdmVyc2lvbiAnICtcbiAgICAgIHRoaXMuX2xpc3Rbc3RhcnRJZHhdLnZlcnNpb24gK1xuICAgICAgJyAtPiAnICtcbiAgICAgIHRoaXMuX2xpc3RbZW5kSWR4XS52ZXJzaW9uLFxuICApO1xuXG4gIC8vIHJ1biB0aGUgYWN0dWFsIG1pZ3JhdGlvblxuICBmdW5jdGlvbiBtaWdyYXRlKGRpcmVjdGlvbiwgaWR4KSB7XG4gICAgdmFyIG1pZ3JhdGlvbiA9IHNlbGYuX2xpc3RbaWR4XTtcblxuICAgIGlmICh0eXBlb2YgbWlncmF0aW9uW2RpcmVjdGlvbl0gIT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHVubG9jaygpO1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcihcbiAgICAgICAgJ0Nhbm5vdCBtaWdyYXRlICcgKyBkaXJlY3Rpb24gKyAnIG9uIHZlcnNpb24gJyArIG1pZ3JhdGlvbi52ZXJzaW9uLFxuICAgICAgKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtYXliZU5hbWUoKSB7XG4gICAgICByZXR1cm4gbWlncmF0aW9uLm5hbWUgPyAnICgnICsgbWlncmF0aW9uLm5hbWUgKyAnKScgOiAnJztcbiAgICB9XG5cbiAgICBsb2cuaW5mbyhcbiAgICAgICdSdW5uaW5nICcgK1xuICAgICAgICBkaXJlY3Rpb24gK1xuICAgICAgICAnKCkgb24gdmVyc2lvbiAnICtcbiAgICAgICAgbWlncmF0aW9uLnZlcnNpb24gK1xuICAgICAgICBtYXliZU5hbWUoKSxcbiAgICApO1xuXG4gICAgbWlncmF0aW9uW2RpcmVjdGlvbl0obWlncmF0aW9uKTtcbiAgfVxuXG4gIC8vIFJldHVybnMgdHJ1ZSBpZiBsb2NrIHdhcyBhY3F1aXJlZC5cbiAgZnVuY3Rpb24gbG9jaygpIHtcbiAgICAvLyBUaGlzIGlzIGF0b21pYy4gVGhlIHNlbGVjdG9yIGVuc3VyZXMgb25seSBvbmUgY2FsbGVyIGF0IGEgdGltZSB3aWxsIHNlZVxuICAgIC8vIHRoZSB1bmxvY2tlZCBjb250cm9sLCBhbmQgbG9ja2luZyBvY2N1cnMgaW4gdGhlIHNhbWUgdXBkYXRlJ3MgbW9kaWZpZXIuXG4gICAgLy8gQWxsIG90aGVyIHNpbXVsdGFuZW91cyBjYWxsZXJzIHdpbGwgZ2V0IGZhbHNlIGJhY2sgZnJvbSB0aGUgdXBkYXRlLlxuICAgIHJldHVybiAoXG4gICAgICBzZWxmLl9jb2xsZWN0aW9uLnVwZGF0ZShcbiAgICAgICAgeyBfaWQ6ICdjb250cm9sJywgbG9ja2VkOiBmYWxzZSB9LFxuICAgICAgICB7ICRzZXQ6IHsgbG9ja2VkOiB0cnVlLCBsb2NrZWRBdDogbmV3IERhdGUoKSB9IH0sXG4gICAgICApID09PSAxXG4gICAgKTtcbiAgfVxuXG4gIC8vIFNpZGUgZWZmZWN0OiBzYXZlcyB2ZXJzaW9uLlxuICBmdW5jdGlvbiB1bmxvY2soKSB7XG4gICAgc2VsZi5fc2V0Q29udHJvbCh7IGxvY2tlZDogZmFsc2UsIHZlcnNpb246IGN1cnJlbnRWZXJzaW9uIH0pO1xuICB9XG5cbiAgaWYgKGN1cnJlbnRWZXJzaW9uIDwgdmVyc2lvbikge1xuICAgIGZvciAodmFyIGkgPSBzdGFydElkeDsgaSA8IGVuZElkeDsgaSsrKSB7XG4gICAgICBtaWdyYXRlKCd1cCcsIGkgKyAxKTtcbiAgICAgIGN1cnJlbnRWZXJzaW9uID0gc2VsZi5fbGlzdFtpICsgMV0udmVyc2lvbjtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgZm9yICh2YXIgaSA9IHN0YXJ0SWR4OyBpID4gZW5kSWR4OyBpLS0pIHtcbiAgICAgIG1pZ3JhdGUoJ2Rvd24nLCBpKTtcbiAgICAgIGN1cnJlbnRWZXJzaW9uID0gc2VsZi5fbGlzdFtpIC0gMV0udmVyc2lvbjtcbiAgICB9XG4gIH1cblxuICB1bmxvY2soKTtcbiAgbG9nLmluZm8oJ0ZpbmlzaGVkIG1pZ3JhdGluZy4nKTtcbn07XG5cbi8vIGdldHMgdGhlIGN1cnJlbnQgY29udHJvbCByZWNvcmQsIG9wdGlvbmFsbHkgY3JlYXRpbmcgaXQgaWYgbm9uLWV4aXN0YW50XG5NaWdyYXRpb25zLl9nZXRDb250cm9sID0gZnVuY3Rpb24oKSB7XG4gIHZhciBjb250cm9sID0gdGhpcy5fY29sbGVjdGlvbi5maW5kT25lKHsgX2lkOiAnY29udHJvbCcgfSk7XG5cbiAgcmV0dXJuIGNvbnRyb2wgfHwgdGhpcy5fc2V0Q29udHJvbCh7IHZlcnNpb246IDAsIGxvY2tlZDogZmFsc2UgfSk7XG59O1xuXG4vLyBzZXRzIHRoZSBjb250cm9sIHJlY29yZFxuTWlncmF0aW9ucy5fc2V0Q29udHJvbCA9IGZ1bmN0aW9uKGNvbnRyb2wpIHtcbiAgLy8gYmUgcXVpdGUgc3RyaWN0XG4gIGNoZWNrKGNvbnRyb2wudmVyc2lvbiwgTnVtYmVyKTtcbiAgY2hlY2soY29udHJvbC5sb2NrZWQsIEJvb2xlYW4pO1xuXG4gIHRoaXMuX2NvbGxlY3Rpb24udXBkYXRlKFxuICAgIHsgX2lkOiAnY29udHJvbCcgfSxcbiAgICB7ICRzZXQ6IHsgdmVyc2lvbjogY29udHJvbC52ZXJzaW9uLCBsb2NrZWQ6IGNvbnRyb2wubG9ja2VkIH0gfSxcbiAgICB7IHVwc2VydDogdHJ1ZSB9LFxuICApO1xuXG4gIHJldHVybiBjb250cm9sO1xufTtcblxuLy8gcmV0dXJucyB0aGUgbWlncmF0aW9uIGluZGV4IGluIF9saXN0IG9yIHRocm93cyBpZiBub3QgZm91bmRcbk1pZ3JhdGlvbnMuX2ZpbmRJbmRleEJ5VmVyc2lvbiA9IGZ1bmN0aW9uKHZlcnNpb24pIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLl9saXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHRoaXMuX2xpc3RbaV0udmVyc2lvbiA9PT0gdmVyc2lvbikgcmV0dXJuIGk7XG4gIH1cblxuICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFwiQ2FuJ3QgZmluZCBtaWdyYXRpb24gdmVyc2lvbiBcIiArIHZlcnNpb24pO1xufTtcblxuLy9yZXNldCAobWFpbmx5IGludGVuZGVkIGZvciB0ZXN0cylcbk1pZ3JhdGlvbnMuX3Jlc2V0ID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuX2xpc3QgPSBbeyB2ZXJzaW9uOiAwLCB1cDogZnVuY3Rpb24oKSB7fSB9XTtcbiAgdGhpcy5fY29sbGVjdGlvbi5yZW1vdmUoe30pO1xufTtcblxuLy8gdW5sb2NrIGNvbnRyb2xcbk1pZ3JhdGlvbnMudW5sb2NrID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuX2NvbGxlY3Rpb24udXBkYXRlKHsgX2lkOiAnY29udHJvbCcgfSwgeyAkc2V0OiB7IGxvY2tlZDogZmFsc2UgfSB9KTtcbn07XG4iXX0=
