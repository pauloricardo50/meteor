//////////////////////////////////////////////////////////////////////////
//                                                                      //
// This is a generated file. You can view the original                  //
// source in your browser if your browser supports source maps.         //
// Source maps are supported by all recent versions of Chrome, Safari,  //
// and Firefox, and by Internet Explorer 11.                            //
//                                                                      //
//////////////////////////////////////////////////////////////////////////


(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var _ = Package.underscore._;
var check = Package.check.check;
var Match = Package.check.Match;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var ReactiveVar = Package['reactive-var'].ReactiveVar;

/* Package-scope variables */
var Slingshot, matchAllowedFileTypes;

(function(){

/////////////////////////////////////////////////////////////////////////////////////////
//                                                                                     //
// packages/edgee_slingshot/packages/edgee_slingshot.js                                //
//                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////
                                                                                       //
(function () {

//////////////////////////////////////////////////////////////////////////////////
//                                                                              //
// packages/edgee:slingshot/lib/restrictions.js                                 //
//                                                                              //
//////////////////////////////////////////////////////////////////////////////////
                                                                                //
/**                                                                             // 1
 * @module meteor-slingshot                                                     // 2
 */                                                                             // 3
                                                                                // 4
Slingshot = {};                                                                 // 5
                                                                                // 6
/* global matchAllowedFileTypes: true */                                        // 7
matchAllowedFileTypes = Match.OneOf(String, [String], RegExp, null);            // 8
                                                                                // 9
/**                                                                             // 10
 * List of configured restrictions by name.                                     // 11
 *                                                                              // 12
 * @type {Object.<String, Function>}                                            // 13
 * @private                                                                     // 14
 */                                                                             // 15
                                                                                // 16
Slingshot._restrictions = {};                                                   // 17
                                                                                // 18
/**                                                                             // 19
 * Creates file upload restrictions for a specific directive.                   // 20
 *                                                                              // 21
 * @param {string} name - A unique identifier of the directive.                 // 22
 * @param {Object} restrictions - The file upload restrictions.                 // 23
 * @returns {Object}                                                            // 24
 */                                                                             // 25
                                                                                // 26
Slingshot.fileRestrictions = function (name, restrictions) {                    // 27
  check(restrictions, {                                                         // 28
    authorize: Match.Optional(Function),                                        // 29
    maxSize: Match.Optional(Match.OneOf(Number, null)),                         // 30
    allowedFileTypes: Match.Optional(matchAllowedFileTypes)                     // 31
  });                                                                           // 32
                                                                                // 33
  if (Meteor.isServer) {                                                        // 34
    var directive = Slingshot.getDirective(name);                               // 35
    if (directive) {                                                            // 36
      _.extend(directive._directive, restrictions);                             // 37
    }                                                                           // 38
  }                                                                             // 39
                                                                                // 40
  return (Slingshot._restrictions[name] =                                       // 41
    _.extend(Slingshot._restrictions[name] || {}, restrictions));               // 42
};                                                                              // 43
                                                                                // 44
/**                                                                             // 45
 * @param {string} name - The unique identifier of the directive to             // 46
 * retrieve the restrictions for.                                               // 47
 * @returns {Object}                                                            // 48
 */                                                                             // 49
                                                                                // 50
Slingshot.getRestrictions = function (name) {                                   // 51
  return this._restrictions[name] || {};                                        // 52
};                                                                              // 53
                                                                                // 54
//////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////
//                                                                              //
// packages/edgee:slingshot/lib/validators.js                                   //
//                                                                              //
//////////////////////////////////////////////////////////////////////////////////
                                                                                //
Slingshot.Validators = {                                                        // 1
                                                                                // 2
 /**                                                                            // 3
  *                                                                             // 4
  * @method checkAll                                                            // 5
  *                                                                             // 6
  * @throws Meteor.Error                                                        // 7
  *                                                                             // 8
  * @param {Object} context                                                     // 9
  * @param {FileInfo} file                                                      // 10
  * @param {Object} [meta]                                                      // 11
  * @param {Object} [restrictions]                                              // 12
  *                                                                             // 13
  * @returns {Boolean}                                                          // 14
  */                                                                            // 15
                                                                                // 16
  checkAll: function (context, file, meta, restrictions) {                      // 17
    return this.checkFileSize(file.size, restrictions.maxSize) &&               // 18
      this.checkFileType(file.type, restrictions.allowedFileTypes) &&           // 19
      (typeof restrictions.authorize !== 'function' ||                          // 20
        restrictions.authorize.call(context, file, meta));                      // 21
  },                                                                            // 22
                                                                                // 23
  /**                                                                           // 24
   * @throws Meteor.Error                                                       // 25
   *                                                                            // 26
   * @param {Number} size - Size of file in bytes.                              // 27
   * @param {Number} maxSize - Max size of file in bytes.                       // 28
   * @returns {boolean}                                                         // 29
   */                                                                           // 30
                                                                                // 31
  checkFileSize: function (size, maxSize) {                                     // 32
    maxSize = Math.min(maxSize, Infinity);                                      // 33
                                                                                // 34
    if (maxSize && size > maxSize)                                              // 35
      throw new Meteor.Error("Upload denied", "File exceeds allowed size of " + // 36
      formatBytes(maxSize));                                                    // 37
                                                                                // 38
    return true;                                                                // 39
  },                                                                            // 40
                                                                                // 41
  /**                                                                           // 42
   *                                                                            // 43
   * @throws Meteor.Error                                                       // 44
   *                                                                            // 45
   * @param {String} type - Mime type                                           // 46
   * @param {(RegExp|Array|String)} [allowed] - Allowed file type(s)            // 47
   * @returns {boolean}                                                         // 48
   */                                                                           // 49
                                                                                // 50
  checkFileType: function (type, allowed) {                                     // 51
    if (allowed instanceof RegExp) {                                            // 52
                                                                                // 53
      if (!allowed.test(type))                                                  // 54
        throw new Meteor.Error("Upload denied",                                 // 55
          type + " is not an allowed file type");                               // 56
                                                                                // 57
      return true;                                                              // 58
    }                                                                           // 59
                                                                                // 60
    if (_.isArray(allowed)) {                                                   // 61
      if (allowed.indexOf(type) < 0) {                                          // 62
        throw new Meteor.Error("Upload denied",                                 // 63
          type + " is not one of the followed allowed file types: " +           // 64
          allowed.join(", "));                                                  // 65
      }                                                                         // 66
                                                                                // 67
      return true;                                                              // 68
    }                                                                           // 69
                                                                                // 70
    if (allowed && allowed !== type) {                                          // 71
      throw new Meteor.Error("Upload denied", "Only files of type " + allowed + // 72
        " can be uploaded");                                                    // 73
    }                                                                           // 74
                                                                                // 75
    return true;                                                                // 76
  }                                                                             // 77
};                                                                              // 78
                                                                                // 79
/** Human readable data-size in bytes.                                          // 80
 *                                                                              // 81
 * @param size {Number}                                                         // 82
 * @returns {string}                                                            // 83
 */                                                                             // 84
                                                                                // 85
function formatBytes(size) {                                                    // 86
  var units = ['Bytes', 'KB', 'MB', 'GB', 'TB'],                                // 87
      unit = units.shift();                                                     // 88
                                                                                // 89
  while (size >= 0x400 && units.length) {                                       // 90
    size /= 0x400;                                                              // 91
    unit = units.shift();                                                       // 92
  }                                                                             // 93
                                                                                // 94
  return (Math.round(size * 100) / 100) + " " + unit;                           // 95
}                                                                               // 96
                                                                                // 97
//////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////
//                                                                              //
// packages/edgee:slingshot/lib/upload.js                                       //
//                                                                              //
//////////////////////////////////////////////////////////////////////////////////
                                                                                //
/**                                                                             // 1
 * @fileOverview Defines client side API in which files can be uploaded.        // 2
 */                                                                             // 3
                                                                                // 4
/**                                                                             // 5
 *                                                                              // 6
 * @param {string} directive - Name of server-directive to use.                 // 7
 * @param {object} [metaData] - Data to be sent to directive.                   // 8
 * @constructor                                                                 // 9
 */                                                                             // 10
                                                                                // 11
Slingshot.Upload = function (directive, metaData) {                             // 12
                                                                                // 13
  if (!window.File || !window.FormData) {                                       // 14
    throw new Error("Browser does not support HTML5 uploads");                  // 15
  }                                                                             // 16
                                                                                // 17
  var self = this,                                                              // 18
      loaded = new ReactiveVar(),                                               // 19
      total = new ReactiveVar(),                                                // 20
      status = new ReactiveVar("idle"),                                         // 21
      dataUri,                                                                  // 22
      preloaded;                                                                // 23
                                                                                // 24
  function buildFormData() {                                                    // 25
    var formData = new window.FormData();                                       // 26
                                                                                // 27
    _.each(self.instructions.postData, function (field) {                       // 28
      formData.append(field.name, field.value);                                 // 29
    });                                                                         // 30
                                                                                // 31
    formData.append("file", self.file);                                         // 32
                                                                                // 33
    return formData;                                                            // 34
  }                                                                             // 35
                                                                                // 36
  _.extend(self, {                                                              // 37
                                                                                // 38
    /**                                                                         // 39
     * @returns {string}                                                        // 40
     */                                                                         // 41
                                                                                // 42
    status: function () {                                                       // 43
      return status.get();                                                      // 44
    },                                                                          // 45
                                                                                // 46
    /**                                                                         // 47
     * @returns {number}                                                        // 48
     */                                                                         // 49
                                                                                // 50
    progress: function () {                                                     // 51
      return self.uploaded() / total.get();                                     // 52
    },                                                                          // 53
                                                                                // 54
    /**                                                                         // 55
     * @returns {number}                                                        // 56
     */                                                                         // 57
                                                                                // 58
    uploaded: function () {                                                     // 59
      return loaded.get();                                                      // 60
    },                                                                          // 61
                                                                                // 62
   /**                                                                          // 63
    * @param {File} file                                                        // 64
    * @returns {null|Error} Returns null on success, Error on failure.          // 65
    */                                                                          // 66
                                                                                // 67
    validate: function(file) {                                                  // 68
      var context = {                                                           // 69
        userId: Meteor.userId && Meteor.userId()                                // 70
      };                                                                        // 71
      try {                                                                     // 72
        var validators = Slingshot.Validators,                                  // 73
            restrictions = Slingshot.getRestrictions(directive);                // 74
                                                                                // 75
        validators.checkAll(context, file, metaData, restrictions) && null;     // 76
      } catch(error) {                                                          // 77
        return error;                                                           // 78
      }                                                                         // 79
    },                                                                          // 80
                                                                                // 81
    /**                                                                         // 82
     * @param {(File|Blob)} file                                                // 83
     * @param {Function} [callback]                                             // 84
     * @returns {Slingshot.Upload}                                              // 85
     */                                                                         // 86
                                                                                // 87
    send: function (file, callback) {                                           // 88
      if (! (file instanceof window.File) && ! (file instanceof window.Blob))   // 89
        throw new Error("Not a file");                                          // 90
                                                                                // 91
      self.file = file;                                                         // 92
                                                                                // 93
      self.request(function (error, instructions) {                             // 94
        if (error) {                                                            // 95
          return callback(error);                                               // 96
        }                                                                       // 97
                                                                                // 98
        self.instructions = instructions;                                       // 99
                                                                                // 100
        self.transfer(callback);                                                // 101
      });                                                                       // 102
                                                                                // 103
      return self;                                                              // 104
    },                                                                          // 105
                                                                                // 106
    /**                                                                         // 107
     * @param {Function} [callback]                                             // 108
     * @returns {Slingshot.Upload}                                              // 109
     */                                                                         // 110
                                                                                // 111
    request: function (callback) {                                              // 112
                                                                                // 113
      if (!self.file) {                                                         // 114
        callback(new Error("No file to request upload for"));                   // 115
      }                                                                         // 116
                                                                                // 117
      var file = _.pick(self.file, "name", "size", "type");                     // 118
                                                                                // 119
      status.set("authorizing");                                                // 120
                                                                                // 121
      var error = this.validate(file);                                          // 122
      if (error) {                                                              // 123
        status.set("failed");                                                   // 124
        callback(error);                                                        // 125
        return self;                                                            // 126
      }                                                                         // 127
                                                                                // 128
      Meteor.call("slingshot/uploadRequest", directive,                         // 129
        file, metaData, function (error, instructions) {                        // 130
          status.set(error ? "failed" : "authorized");                          // 131
          callback(error, instructions);                                        // 132
        });                                                                     // 133
                                                                                // 134
      return self;                                                              // 135
    },                                                                          // 136
                                                                                // 137
    /**                                                                         // 138
     * @param {Function} [callback]                                             // 139
     *                                                                          // 140
     * @returns {Slingshot.Upload}                                              // 141
     */                                                                         // 142
                                                                                // 143
    transfer: function (callback) {                                             // 144
      if (status.curValue !== "authorized") {                                   // 145
        throw new Error("Cannot transfer file at upload status: " +             // 146
          status.curValue);                                                     // 147
      }                                                                         // 148
                                                                                // 149
      status.set("transferring");                                               // 150
      loaded.set(0);                                                            // 151
                                                                                // 152
      var xhr = new XMLHttpRequest();                                           // 153
                                                                                // 154
      xhr.upload.addEventListener("progress", function (event) {                // 155
        if (event.lengthComputable) {                                           // 156
          loaded.set(event.loaded);                                             // 157
          total.set(event.total);                                               // 158
        }                                                                       // 159
      }, false);                                                                // 160
                                                                                // 161
      function getError() {                                                     // 162
        return new Meteor.Error(xhr.statusText + " - " + xhr.status,            // 163
            "Failed to upload file to cloud storage");                          // 164
      }                                                                         // 165
                                                                                // 166
      xhr.addEventListener("load", function () {                                // 167
                                                                                // 168
        if (xhr.status < 400) {                                                 // 169
          status.set("done");                                                   // 170
          loaded.set(total.get());                                              // 171
          callback(null, self.instructions.download);                           // 172
        }                                                                       // 173
        else {                                                                  // 174
          status.set("failed");                                                 // 175
          callback(getError());                                                 // 176
        }                                                                       // 177
      });                                                                       // 178
                                                                                // 179
      xhr.addEventListener("error", function () {                               // 180
        status.set("failed");                                                   // 181
        callback(getError());                                                   // 182
      });                                                                       // 183
                                                                                // 184
      xhr.addEventListener("abort", function () {                               // 185
        status.set("aborted");                                                  // 186
        callback(new Meteor.Error("Aborted",                                    // 187
          "The upload has been aborted by the user"));                          // 188
      });                                                                       // 189
                                                                                // 190
      xhr.open("POST", self.instructions.upload, true);                         // 191
                                                                                // 192
      _.each(self.instructions.headers, function (value, key) {                 // 193
        xhr.setRequestHeader(key, value);                                       // 194
      });                                                                       // 195
                                                                                // 196
      xhr.send(buildFormData());                                                // 197
      self.xhr = xhr;                                                           // 198
                                                                                // 199
      return self;                                                              // 200
    },                                                                          // 201
                                                                                // 202
    /**                                                                         // 203
     * @returns {boolean}                                                       // 204
     */                                                                         // 205
                                                                                // 206
    isImage: function () {                                                      // 207
      self.status(); //React to status change.                                  // 208
      return Boolean(self.file && self.file.type.split("/")[0] === "image");    // 209
    },                                                                          // 210
                                                                                // 211
    /**                                                                         // 212
     * Latency compensated url of the file to be uploaded.                      // 213
     *                                                                          // 214
     * @param {boolean} preload                                                 // 215
     *                                                                          // 216
     * @returns {string}                                                        // 217
     */                                                                         // 218
                                                                                // 219
    url: function (preload) {                                                   // 220
      if (!dataUri) {                                                           // 221
        var localUrl = new ReactiveVar(),                                       // 222
            URL = (window.URL || window.webkitURL);                             // 223
                                                                                // 224
        dataUri = new ReactiveVar();                                            // 225
                                                                                // 226
        Tracker.nonreactive(function () {                                       // 227
                                                                                // 228
          /*                                                                    // 229
           It is important that we generate the local url not more than once    // 230
           throughout the entire lifecycle of `self` to prevent flickering.     // 231
           */                                                                   // 232
                                                                                // 233
          var previewRequirement = new Tracker.Dependency();                    // 234
                                                                                // 235
          Tracker.autorun(function (computation) {                              // 236
            if (self.file) {                                                    // 237
              if (URL) {                                                        // 238
                localUrl.set(URL.createObjectURL(self.file));                   // 239
                computation.stop();                                             // 240
              }                                                                 // 241
              else if (Tracker.active && window.FileReader) {                   // 242
                readDataUrl(self.file, function (result) {                      // 243
                  localUrl.set(result);                                         // 244
                  computation.stop();                                           // 245
                });                                                             // 246
              }                                                                 // 247
            }                                                                   // 248
            else {                                                              // 249
              previewRequirement.depend();                                      // 250
            }                                                                   // 251
          });                                                                   // 252
                                                                                // 253
          Tracker.autorun(function (computation) {                              // 254
            var status = self.status();                                         // 255
                                                                                // 256
            if (self.instructions && status === "done") {                       // 257
              computation.stop();                                               // 258
              dataUri.set(self.instructions.download);                          // 259
            }                                                                   // 260
            else if (status === "failed" || status === "aborted") {             // 261
              computation.stop();                                               // 262
            }                                                                   // 263
            else if (self.file && !dataUri.curValue) {                          // 264
              previewRequirement.changed();                                     // 265
              dataUri.set(localUrl.get());                                      // 266
            }                                                                   // 267
          });                                                                   // 268
        });                                                                     // 269
      }                                                                         // 270
                                                                                // 271
      if (preload) {                                                            // 272
                                                                                // 273
        if (self.file && !self.isImage())                                       // 274
          throw new Error("Cannot pre-load anything other than images");        // 275
                                                                                // 276
        if (!preloaded) {                                                       // 277
          Tracker.nonreactive(function () {                                     // 278
            preloaded = new ReactiveVar();                                      // 279
                                                                                // 280
            Tracker.autorun(function (computation) {                            // 281
              var url = dataUri.get();                                          // 282
                                                                                // 283
              if (self.instructions) {                                          // 284
                preloadImage(url, function () {                                 // 285
                  computation.stop();                                           // 286
                  preloaded.set(url);                                           // 287
                });                                                             // 288
              }                                                                 // 289
              else                                                              // 290
                preloaded.set(url);                                             // 291
            });                                                                 // 292
          });                                                                   // 293
        }                                                                       // 294
                                                                                // 295
        return preloaded.get();                                                 // 296
      }                                                                         // 297
      else                                                                      // 298
        return dataUri.get();                                                   // 299
    },                                                                          // 300
                                                                                // 301
    /** Gets an upload parameter for the directive.                             // 302
     *                                                                          // 303
     * @param {String} name                                                     // 304
     * @returns {String|Number|Undefined}                                       // 305
     */                                                                         // 306
                                                                                // 307
    param: function (name) {                                                    // 308
      self.status(); //React to status changes.                                 // 309
                                                                                // 310
      var data = self.instructions && self.instructions.postData,               // 311
          field = data && _.findWhere(data, {name: name});                      // 312
                                                                                // 313
      return field && field.value;                                              // 314
    }                                                                           // 315
                                                                                // 316
  });                                                                           // 317
};                                                                              // 318
                                                                                // 319
/**                                                                             // 320
 *                                                                              // 321
 * @param {String} image - URL of image to preload.                             // 322
 * @param {Function} callback                                                   // 323
 */                                                                             // 324
                                                                                // 325
function preloadImage(image, callback) {                                        // 326
  var preloader = new window.Image();                                           // 327
                                                                                // 328
  preloader.onload = callback;                                                  // 329
                                                                                // 330
  preloader.src = image;                                                        // 331
}                                                                               // 332
                                                                                // 333
function readDataUrl(file, callback) {                                          // 334
  var reader = new window.FileReader();                                         // 335
                                                                                // 336
  reader.onloadend = function () {                                              // 337
    callback(reader.result);                                                    // 338
  };                                                                            // 339
                                                                                // 340
  reader.readAsDataURL(file);                                                   // 341
}                                                                               // 342
                                                                                // 343
//////////////////////////////////////////////////////////////////////////////////

}).call(this);

/////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
Package._define("edgee:slingshot", {
  Slingshot: Slingshot
});

})();
