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
var chai = Package['practicalmeteor:chai'].chai;
var assert = Package['practicalmeteor:chai'].assert;
var expect = Package['practicalmeteor:chai'].expect;
var should = Package['practicalmeteor:chai'].should;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var sinon, lolex, sinonChai, __coffeescriptShare, spies, stubs;

(function(){

//////////////////////////////////////////////////////////////////////////////////////////
//                                                                                      //
// packages/practicalmeteor_sinon/packages/practicalmeteor_sinon.js                     //
//                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////
                                                                                        //
(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/practicalmeteor:sinon/sinon-1.14.1.js                                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/**                                                                                                                    // 1
 * Sinon.JS 1.14.1, 2015/04/24                                                                                         // 2
 *                                                                                                                     // 3
 * @author Christian Johansen (christian@cjohansen.no)                                                                 // 4
 * @author Contributors: https://github.com/cjohansen/Sinon.JS/blob/master/AUTHORS                                     // 5
 *                                                                                                                     // 6
 * (The BSD License)                                                                                                   // 7
 *                                                                                                                     // 8
 * Copyright (c) 2010-2014, Christian Johansen, christian@cjohansen.no                                                 // 9
 * All rights reserved.                                                                                                // 10
 *                                                                                                                     // 11
 * Redistribution and use in source and binary forms, with or without modification,                                    // 12
 * are permitted provided that the following conditions are met:                                                       // 13
 *                                                                                                                     // 14
 *     * Redistributions of source code must retain the above copyright notice,                                        // 15
 *       this list of conditions and the following disclaimer.                                                         // 16
 *     * Redistributions in binary form must reproduce the above copyright notice,                                     // 17
 *       this list of conditions and the following disclaimer in the documentation                                     // 18
 *       and/or other materials provided with the distribution.                                                        // 19
 *     * Neither the name of Christian Johansen nor the names of his contributors                                      // 20
 *       may be used to endorse or promote products derived from this software                                         // 21
 *       without specific prior written permission.                                                                    // 22
 *                                                                                                                     // 23
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND                                     // 24
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED                                       // 25
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE                                              // 26
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE                                        // 27
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL                                          // 28
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR                                          // 29
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER                                          // 30
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,                                       // 31
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF                                    // 32
 * THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.                                                   // 33
 */                                                                                                                    // 34
                                                                                                                       // 35
sinon = this.sinon = (function () {                                                                                    // 36
  var samsam, formatio;                                                                                                // 37
  (function () {                                                                                                       // 38
                function define(mod, deps, fn) {                                                                       // 39
                  if (mod == "samsam") {                                                                               // 40
                    samsam = deps();                                                                                   // 41
                  } else if (typeof deps === "function" && mod.length === 0) {                                         // 42
                    lolex = deps();                                                                                    // 43
                  } else if (typeof fn === "function") {                                                               // 44
                    formatio = fn(samsam);                                                                             // 45
                  }                                                                                                    // 46
                }                                                                                                      // 47
    define.amd = {};                                                                                                   // 48
((typeof define === "function" && define.amd && function (m) { define("samsam", m); }) ||                              // 49
 (typeof module === "object" &&                                                                                        // 50
      function (m) { module.exports = m(); }) || // Node                                                               // 51
 function (m) { this.samsam = m(); } // Browser globals                                                                // 52
)(function () {                                                                                                        // 53
    var o = Object.prototype;                                                                                          // 54
    var div = typeof document !== "undefined" && document.createElement("div");                                        // 55
                                                                                                                       // 56
    function isNaN(value) {                                                                                            // 57
        // Unlike global isNaN, this avoids type coercion                                                              // 58
        // typeof check avoids IE host object issues, hat tip to                                                       // 59
        // lodash                                                                                                      // 60
        var val = value; // JsLint thinks value !== value is "weird"                                                   // 61
        return typeof value === "number" && value !== val;                                                             // 62
    }                                                                                                                  // 63
                                                                                                                       // 64
    function getClass(value) {                                                                                         // 65
        // Returns the internal [[Class]] by calling Object.prototype.toString                                         // 66
        // with the provided value as this. Return value is a string, naming the                                       // 67
        // internal class, e.g. "Array"                                                                                // 68
        return o.toString.call(value).split(/[ \]]/)[1];                                                               // 69
    }                                                                                                                  // 70
                                                                                                                       // 71
    /**                                                                                                                // 72
     * @name samsam.isArguments                                                                                        // 73
     * @param Object object                                                                                            // 74
     *                                                                                                                 // 75
     * Returns ``true`` if ``object`` is an ``arguments`` object,                                                      // 76
     * ``false`` otherwise.                                                                                            // 77
     */                                                                                                                // 78
    function isArguments(object) {                                                                                     // 79
        if (getClass(object) === 'Arguments') { return true; }                                                         // 80
        if (typeof object !== "object" || typeof object.length !== "number" ||                                         // 81
                getClass(object) === "Array") {                                                                        // 82
            return false;                                                                                              // 83
        }                                                                                                              // 84
        if (typeof object.callee == "function") { return true; }                                                       // 85
        try {                                                                                                          // 86
            object[object.length] = 6;                                                                                 // 87
            delete object[object.length];                                                                              // 88
        } catch (e) {                                                                                                  // 89
            return true;                                                                                               // 90
        }                                                                                                              // 91
        return false;                                                                                                  // 92
    }                                                                                                                  // 93
                                                                                                                       // 94
    /**                                                                                                                // 95
     * @name samsam.isElement                                                                                          // 96
     * @param Object object                                                                                            // 97
     *                                                                                                                 // 98
     * Returns ``true`` if ``object`` is a DOM element node. Unlike                                                    // 99
     * Underscore.js/lodash, this function will return ``false`` if ``object``                                         // 100
     * is an *element-like* object, i.e. a regular object with a ``nodeType``                                          // 101
     * property that holds the value ``1``.                                                                            // 102
     */                                                                                                                // 103
    function isElement(object) {                                                                                       // 104
        if (!object || object.nodeType !== 1 || !div) { return false; }                                                // 105
        try {                                                                                                          // 106
            object.appendChild(div);                                                                                   // 107
            object.removeChild(div);                                                                                   // 108
        } catch (e) {                                                                                                  // 109
            return false;                                                                                              // 110
        }                                                                                                              // 111
        return true;                                                                                                   // 112
    }                                                                                                                  // 113
                                                                                                                       // 114
    /**                                                                                                                // 115
     * @name samsam.keys                                                                                               // 116
     * @param Object object                                                                                            // 117
     *                                                                                                                 // 118
     * Return an array of own property names.                                                                          // 119
     */                                                                                                                // 120
    function keys(object) {                                                                                            // 121
        var ks = [], prop;                                                                                             // 122
        for (prop in object) {                                                                                         // 123
            if (o.hasOwnProperty.call(object, prop)) { ks.push(prop); }                                                // 124
        }                                                                                                              // 125
        return ks;                                                                                                     // 126
    }                                                                                                                  // 127
                                                                                                                       // 128
    /**                                                                                                                // 129
     * @name samsam.isDate                                                                                             // 130
     * @param Object value                                                                                             // 131
     *                                                                                                                 // 132
     * Returns true if the object is a ``Date``, or *date-like*. Duck typing                                           // 133
     * of date objects work by checking that the object has a ``getTime``                                              // 134
     * function whose return value equals the return value from the object's                                           // 135
     * ``valueOf``.                                                                                                    // 136
     */                                                                                                                // 137
    function isDate(value) {                                                                                           // 138
        return typeof value.getTime == "function" &&                                                                   // 139
            value.getTime() == value.valueOf();                                                                        // 140
    }                                                                                                                  // 141
                                                                                                                       // 142
    /**                                                                                                                // 143
     * @name samsam.isNegZero                                                                                          // 144
     * @param Object value                                                                                             // 145
     *                                                                                                                 // 146
     * Returns ``true`` if ``value`` is ``-0``.                                                                        // 147
     */                                                                                                                // 148
    function isNegZero(value) {                                                                                        // 149
        return value === 0 && 1 / value === -Infinity;                                                                 // 150
    }                                                                                                                  // 151
                                                                                                                       // 152
    /**                                                                                                                // 153
     * @name samsam.equal                                                                                              // 154
     * @param Object obj1                                                                                              // 155
     * @param Object obj2                                                                                              // 156
     *                                                                                                                 // 157
     * Returns ``true`` if two objects are strictly equal. Compared to                                                 // 158
     * ``===`` there are two exceptions:                                                                               // 159
     *                                                                                                                 // 160
     *   - NaN is considered equal to NaN                                                                              // 161
     *   - -0 and +0 are not considered equal                                                                          // 162
     */                                                                                                                // 163
    function identical(obj1, obj2) {                                                                                   // 164
        if (obj1 === obj2 || (isNaN(obj1) && isNaN(obj2))) {                                                           // 165
            return obj1 !== 0 || isNegZero(obj1) === isNegZero(obj2);                                                  // 166
        }                                                                                                              // 167
    }                                                                                                                  // 168
                                                                                                                       // 169
                                                                                                                       // 170
    /**                                                                                                                // 171
     * @name samsam.deepEqual                                                                                          // 172
     * @param Object obj1                                                                                              // 173
     * @param Object obj2                                                                                              // 174
     *                                                                                                                 // 175
     * Deep equal comparison. Two values are "deep equal" if:                                                          // 176
     *                                                                                                                 // 177
     *   - They are equal, according to samsam.identical                                                               // 178
     *   - They are both date objects representing the same time                                                       // 179
     *   - They are both arrays containing elements that are all deepEqual                                             // 180
     *   - They are objects with the same set of properties, and each property                                         // 181
     *     in ``obj1`` is deepEqual to the corresponding property in ``obj2``                                          // 182
     *                                                                                                                 // 183
     * Supports cyclic objects.                                                                                        // 184
     */                                                                                                                // 185
    function deepEqualCyclic(obj1, obj2) {                                                                             // 186
                                                                                                                       // 187
        // used for cyclic comparison                                                                                  // 188
        // contain already visited objects                                                                             // 189
        var objects1 = [],                                                                                             // 190
            objects2 = [],                                                                                             // 191
        // contain pathes (position in the object structure)                                                           // 192
        // of the already visited objects                                                                              // 193
        // indexes same as in objects arrays                                                                           // 194
            paths1 = [],                                                                                               // 195
            paths2 = [],                                                                                               // 196
        // contains combinations of already compared objects                                                           // 197
        // in the manner: { "$1['ref']$2['ref']": true }                                                               // 198
            compared = {};                                                                                             // 199
                                                                                                                       // 200
        /**                                                                                                            // 201
         * used to check, if the value of a property is an object                                                      // 202
         * (cyclic logic is only needed for objects)                                                                   // 203
         * only needed for cyclic logic                                                                                // 204
         */                                                                                                            // 205
        function isObject(value) {                                                                                     // 206
                                                                                                                       // 207
            if (typeof value === 'object' && value !== null &&                                                         // 208
                    !(value instanceof Boolean) &&                                                                     // 209
                    !(value instanceof Date)    &&                                                                     // 210
                    !(value instanceof Number)  &&                                                                     // 211
                    !(value instanceof RegExp)  &&                                                                     // 212
                    !(value instanceof String)) {                                                                      // 213
                                                                                                                       // 214
                return true;                                                                                           // 215
            }                                                                                                          // 216
                                                                                                                       // 217
            return false;                                                                                              // 218
        }                                                                                                              // 219
                                                                                                                       // 220
        /**                                                                                                            // 221
         * returns the index of the given object in the                                                                // 222
         * given objects array, -1 if not contained                                                                    // 223
         * only needed for cyclic logic                                                                                // 224
         */                                                                                                            // 225
        function getIndex(objects, obj) {                                                                              // 226
                                                                                                                       // 227
            var i;                                                                                                     // 228
            for (i = 0; i < objects.length; i++) {                                                                     // 229
                if (objects[i] === obj) {                                                                              // 230
                    return i;                                                                                          // 231
                }                                                                                                      // 232
            }                                                                                                          // 233
                                                                                                                       // 234
            return -1;                                                                                                 // 235
        }                                                                                                              // 236
                                                                                                                       // 237
        // does the recursion for the deep equal check                                                                 // 238
        return (function deepEqual(obj1, obj2, path1, path2) {                                                         // 239
            var type1 = typeof obj1;                                                                                   // 240
            var type2 = typeof obj2;                                                                                   // 241
                                                                                                                       // 242
            // == null also matches undefined                                                                          // 243
            if (obj1 === obj2 ||                                                                                       // 244
                    isNaN(obj1) || isNaN(obj2) ||                                                                      // 245
                    obj1 == null || obj2 == null ||                                                                    // 246
                    type1 !== "object" || type2 !== "object") {                                                        // 247
                                                                                                                       // 248
                return identical(obj1, obj2);                                                                          // 249
            }                                                                                                          // 250
                                                                                                                       // 251
            // Elements are only equal if identical(expected, actual)                                                  // 252
            if (isElement(obj1) || isElement(obj2)) { return false; }                                                  // 253
                                                                                                                       // 254
            var isDate1 = isDate(obj1), isDate2 = isDate(obj2);                                                        // 255
            if (isDate1 || isDate2) {                                                                                  // 256
                if (!isDate1 || !isDate2 || obj1.getTime() !== obj2.getTime()) {                                       // 257
                    return false;                                                                                      // 258
                }                                                                                                      // 259
            }                                                                                                          // 260
                                                                                                                       // 261
            if (obj1 instanceof RegExp && obj2 instanceof RegExp) {                                                    // 262
                if (obj1.toString() !== obj2.toString()) { return false; }                                             // 263
            }                                                                                                          // 264
                                                                                                                       // 265
            var class1 = getClass(obj1);                                                                               // 266
            var class2 = getClass(obj2);                                                                               // 267
            var keys1 = keys(obj1);                                                                                    // 268
            var keys2 = keys(obj2);                                                                                    // 269
                                                                                                                       // 270
            if (isArguments(obj1) || isArguments(obj2)) {                                                              // 271
                if (obj1.length !== obj2.length) { return false; }                                                     // 272
            } else {                                                                                                   // 273
                if (type1 !== type2 || class1 !== class2 ||                                                            // 274
                        keys1.length !== keys2.length) {                                                               // 275
                    return false;                                                                                      // 276
                }                                                                                                      // 277
            }                                                                                                          // 278
                                                                                                                       // 279
            var key, i, l,                                                                                             // 280
                // following vars are used for the cyclic logic                                                        // 281
                value1, value2,                                                                                        // 282
                isObject1, isObject2,                                                                                  // 283
                index1, index2,                                                                                        // 284
                newPath1, newPath2;                                                                                    // 285
                                                                                                                       // 286
            for (i = 0, l = keys1.length; i < l; i++) {                                                                // 287
                key = keys1[i];                                                                                        // 288
                if (!o.hasOwnProperty.call(obj2, key)) {                                                               // 289
                    return false;                                                                                      // 290
                }                                                                                                      // 291
                                                                                                                       // 292
                // Start of the cyclic logic                                                                           // 293
                                                                                                                       // 294
                value1 = obj1[key];                                                                                    // 295
                value2 = obj2[key];                                                                                    // 296
                                                                                                                       // 297
                isObject1 = isObject(value1);                                                                          // 298
                isObject2 = isObject(value2);                                                                          // 299
                                                                                                                       // 300
                // determine, if the objects were already visited                                                      // 301
                // (it's faster to check for isObject first, than to                                                   // 302
                // get -1 from getIndex for non objects)                                                               // 303
                index1 = isObject1 ? getIndex(objects1, value1) : -1;                                                  // 304
                index2 = isObject2 ? getIndex(objects2, value2) : -1;                                                  // 305
                                                                                                                       // 306
                // determine the new pathes of the objects                                                             // 307
                // - for non cyclic objects the current path will be extended                                          // 308
                //   by current property name                                                                          // 309
                // - for cyclic objects the stored path is taken                                                       // 310
                newPath1 = index1 !== -1                                                                               // 311
                    ? paths1[index1]                                                                                   // 312
                    : path1 + '[' + JSON.stringify(key) + ']';                                                         // 313
                newPath2 = index2 !== -1                                                                               // 314
                    ? paths2[index2]                                                                                   // 315
                    : path2 + '[' + JSON.stringify(key) + ']';                                                         // 316
                                                                                                                       // 317
                // stop recursion if current objects are already compared                                              // 318
                if (compared[newPath1 + newPath2]) {                                                                   // 319
                    return true;                                                                                       // 320
                }                                                                                                      // 321
                                                                                                                       // 322
                // remember the current objects and their pathes                                                       // 323
                if (index1 === -1 && isObject1) {                                                                      // 324
                    objects1.push(value1);                                                                             // 325
                    paths1.push(newPath1);                                                                             // 326
                }                                                                                                      // 327
                if (index2 === -1 && isObject2) {                                                                      // 328
                    objects2.push(value2);                                                                             // 329
                    paths2.push(newPath2);                                                                             // 330
                }                                                                                                      // 331
                                                                                                                       // 332
                // remember that the current objects are already compared                                              // 333
                if (isObject1 && isObject2) {                                                                          // 334
                    compared[newPath1 + newPath2] = true;                                                              // 335
                }                                                                                                      // 336
                                                                                                                       // 337
                // End of cyclic logic                                                                                 // 338
                                                                                                                       // 339
                // neither value1 nor value2 is a cycle                                                                // 340
                // continue with next level                                                                            // 341
                if (!deepEqual(value1, value2, newPath1, newPath2)) {                                                  // 342
                    return false;                                                                                      // 343
                }                                                                                                      // 344
            }                                                                                                          // 345
                                                                                                                       // 346
            return true;                                                                                               // 347
                                                                                                                       // 348
        }(obj1, obj2, '$1', '$2'));                                                                                    // 349
    }                                                                                                                  // 350
                                                                                                                       // 351
    var match;                                                                                                         // 352
                                                                                                                       // 353
    function arrayContains(array, subset) {                                                                            // 354
        if (subset.length === 0) { return true; }                                                                      // 355
        var i, l, j, k;                                                                                                // 356
        for (i = 0, l = array.length; i < l; ++i) {                                                                    // 357
            if (match(array[i], subset[0])) {                                                                          // 358
                for (j = 0, k = subset.length; j < k; ++j) {                                                           // 359
                    if (!match(array[i + j], subset[j])) { return false; }                                             // 360
                }                                                                                                      // 361
                return true;                                                                                           // 362
            }                                                                                                          // 363
        }                                                                                                              // 364
        return false;                                                                                                  // 365
    }                                                                                                                  // 366
                                                                                                                       // 367
    /**                                                                                                                // 368
     * @name samsam.match                                                                                              // 369
     * @param Object object                                                                                            // 370
     * @param Object matcher                                                                                           // 371
     *                                                                                                                 // 372
     * Compare arbitrary value ``object`` with matcher.                                                                // 373
     */                                                                                                                // 374
    match = function match(object, matcher) {                                                                          // 375
        if (matcher && typeof matcher.test === "function") {                                                           // 376
            return matcher.test(object);                                                                               // 377
        }                                                                                                              // 378
                                                                                                                       // 379
        if (typeof matcher === "function") {                                                                           // 380
            return matcher(object) === true;                                                                           // 381
        }                                                                                                              // 382
                                                                                                                       // 383
        if (typeof matcher === "string") {                                                                             // 384
            matcher = matcher.toLowerCase();                                                                           // 385
            var notNull = typeof object === "string" || !!object;                                                      // 386
            return notNull &&                                                                                          // 387
                (String(object)).toLowerCase().indexOf(matcher) >= 0;                                                  // 388
        }                                                                                                              // 389
                                                                                                                       // 390
        if (typeof matcher === "number") {                                                                             // 391
            return matcher === object;                                                                                 // 392
        }                                                                                                              // 393
                                                                                                                       // 394
        if (typeof matcher === "boolean") {                                                                            // 395
            return matcher === object;                                                                                 // 396
        }                                                                                                              // 397
                                                                                                                       // 398
        if (typeof(matcher) === "undefined") {                                                                         // 399
            return typeof(object) === "undefined";                                                                     // 400
        }                                                                                                              // 401
                                                                                                                       // 402
        if (matcher === null) {                                                                                        // 403
            return object === null;                                                                                    // 404
        }                                                                                                              // 405
                                                                                                                       // 406
        if (getClass(object) === "Array" && getClass(matcher) === "Array") {                                           // 407
            return arrayContains(object, matcher);                                                                     // 408
        }                                                                                                              // 409
                                                                                                                       // 410
        if (matcher && typeof matcher === "object") {                                                                  // 411
            if (matcher === object) {                                                                                  // 412
                return true;                                                                                           // 413
            }                                                                                                          // 414
            var prop;                                                                                                  // 415
            for (prop in matcher) {                                                                                    // 416
                var value = object[prop];                                                                              // 417
                if (typeof value === "undefined" &&                                                                    // 418
                        typeof object.getAttribute === "function") {                                                   // 419
                    value = object.getAttribute(prop);                                                                 // 420
                }                                                                                                      // 421
                if (matcher[prop] === null || typeof matcher[prop] === 'undefined') {                                  // 422
                    if (value !== matcher[prop]) {                                                                     // 423
                        return false;                                                                                  // 424
                    }                                                                                                  // 425
                } else if (typeof  value === "undefined" || !match(value, matcher[prop])) {                            // 426
                    return false;                                                                                      // 427
                }                                                                                                      // 428
            }                                                                                                          // 429
            return true;                                                                                               // 430
        }                                                                                                              // 431
                                                                                                                       // 432
        throw new Error("Matcher was not a string, a number, a " +                                                     // 433
                        "function, a boolean or an object");                                                           // 434
    };                                                                                                                 // 435
                                                                                                                       // 436
    return {                                                                                                           // 437
        isArguments: isArguments,                                                                                      // 438
        isElement: isElement,                                                                                          // 439
        isDate: isDate,                                                                                                // 440
        isNegZero: isNegZero,                                                                                          // 441
        identical: identical,                                                                                          // 442
        deepEqual: deepEqualCyclic,                                                                                    // 443
        match: match,                                                                                                  // 444
        keys: keys                                                                                                     // 445
    };                                                                                                                 // 446
});                                                                                                                    // 447
((typeof define === "function" && define.amd && function (m) {                                                         // 448
    define("formatio", ["samsam"], m);                                                                                 // 449
}) || (typeof module === "object" && function (m) {                                                                    // 450
    module.exports = m(require("samsam"));                                                                             // 451
}) || function (m) { this.formatio = m(this.samsam); }                                                                 // 452
)(function (samsam) {                                                                                                  // 453
                                                                                                                       // 454
    var formatio = {                                                                                                   // 455
        excludeConstructors: ["Object", /^.$/],                                                                        // 456
        quoteStrings: true,                                                                                            // 457
        limitChildrenCount: 0                                                                                          // 458
    };                                                                                                                 // 459
                                                                                                                       // 460
    var hasOwn = Object.prototype.hasOwnProperty;                                                                      // 461
                                                                                                                       // 462
    var specialObjects = [];                                                                                           // 463
    if (typeof global !== "undefined") {                                                                               // 464
        specialObjects.push({ object: global, value: "[object global]" });                                             // 465
    }                                                                                                                  // 466
    if (typeof document !== "undefined") {                                                                             // 467
        specialObjects.push({                                                                                          // 468
            object: document,                                                                                          // 469
            value: "[object HTMLDocument]"                                                                             // 470
        });                                                                                                            // 471
    }                                                                                                                  // 472
    if (typeof window !== "undefined") {                                                                               // 473
        specialObjects.push({ object: window, value: "[object Window]" });                                             // 474
    }                                                                                                                  // 475
                                                                                                                       // 476
    function functionName(func) {                                                                                      // 477
        if (!func) { return ""; }                                                                                      // 478
        if (func.displayName) { return func.displayName; }                                                             // 479
        if (func.name) { return func.name; }                                                                           // 480
        var matches = func.toString().match(/function\s+([^\(]+)/m);                                                   // 481
        return (matches && matches[1]) || "";                                                                          // 482
    }                                                                                                                  // 483
                                                                                                                       // 484
    function constructorName(f, object) {                                                                              // 485
        var name = functionName(object && object.constructor);                                                         // 486
        var excludes = f.excludeConstructors ||                                                                        // 487
                formatio.excludeConstructors || [];                                                                    // 488
                                                                                                                       // 489
        var i, l;                                                                                                      // 490
        for (i = 0, l = excludes.length; i < l; ++i) {                                                                 // 491
            if (typeof excludes[i] === "string" && excludes[i] === name) {                                             // 492
                return "";                                                                                             // 493
            } else if (excludes[i].test && excludes[i].test(name)) {                                                   // 494
                return "";                                                                                             // 495
            }                                                                                                          // 496
        }                                                                                                              // 497
                                                                                                                       // 498
        return name;                                                                                                   // 499
    }                                                                                                                  // 500
                                                                                                                       // 501
    function isCircular(object, objects) {                                                                             // 502
        if (typeof object !== "object") { return false; }                                                              // 503
        var i, l;                                                                                                      // 504
        for (i = 0, l = objects.length; i < l; ++i) {                                                                  // 505
            if (objects[i] === object) { return true; }                                                                // 506
        }                                                                                                              // 507
        return false;                                                                                                  // 508
    }                                                                                                                  // 509
                                                                                                                       // 510
    function ascii(f, object, processed, indent) {                                                                     // 511
        if (typeof object === "string") {                                                                              // 512
            var qs = f.quoteStrings;                                                                                   // 513
            var quote = typeof qs !== "boolean" || qs;                                                                 // 514
            return processed || quote ? '"' + object + '"' : object;                                                   // 515
        }                                                                                                              // 516
                                                                                                                       // 517
        if (typeof object === "function" && !(object instanceof RegExp)) {                                             // 518
            return ascii.func(object);                                                                                 // 519
        }                                                                                                              // 520
                                                                                                                       // 521
        processed = processed || [];                                                                                   // 522
                                                                                                                       // 523
        if (isCircular(object, processed)) { return "[Circular]"; }                                                    // 524
                                                                                                                       // 525
        if (Object.prototype.toString.call(object) === "[object Array]") {                                             // 526
            return ascii.array.call(f, object, processed);                                                             // 527
        }                                                                                                              // 528
                                                                                                                       // 529
        if (!object) { return String((1/object) === -Infinity ? "-0" : object); }                                      // 530
        if (samsam.isElement(object)) { return ascii.element(object); }                                                // 531
                                                                                                                       // 532
        if (typeof object.toString === "function" &&                                                                   // 533
                object.toString !== Object.prototype.toString) {                                                       // 534
            return object.toString();                                                                                  // 535
        }                                                                                                              // 536
                                                                                                                       // 537
        var i, l;                                                                                                      // 538
        for (i = 0, l = specialObjects.length; i < l; i++) {                                                           // 539
            if (object === specialObjects[i].object) {                                                                 // 540
                return specialObjects[i].value;                                                                        // 541
            }                                                                                                          // 542
        }                                                                                                              // 543
                                                                                                                       // 544
        return ascii.object.call(f, object, processed, indent);                                                        // 545
    }                                                                                                                  // 546
                                                                                                                       // 547
    ascii.func = function (func) {                                                                                     // 548
        return "function " + functionName(func) + "() {}";                                                             // 549
    };                                                                                                                 // 550
                                                                                                                       // 551
    ascii.array = function (array, processed) {                                                                        // 552
        processed = processed || [];                                                                                   // 553
        processed.push(array);                                                                                         // 554
        var pieces = [];                                                                                               // 555
        var i, l;                                                                                                      // 556
        l = (this.limitChildrenCount > 0) ?                                                                            // 557
            Math.min(this.limitChildrenCount, array.length) : array.length;                                            // 558
                                                                                                                       // 559
        for (i = 0; i < l; ++i) {                                                                                      // 560
            pieces.push(ascii(this, array[i], processed));                                                             // 561
        }                                                                                                              // 562
                                                                                                                       // 563
        if(l < array.length)                                                                                           // 564
            pieces.push("[... " + (array.length - l) + " more elements]");                                             // 565
                                                                                                                       // 566
        return "[" + pieces.join(", ") + "]";                                                                          // 567
    };                                                                                                                 // 568
                                                                                                                       // 569
    ascii.object = function (object, processed, indent) {                                                              // 570
        processed = processed || [];                                                                                   // 571
        processed.push(object);                                                                                        // 572
        indent = indent || 0;                                                                                          // 573
        var pieces = [], properties = samsam.keys(object).sort();                                                      // 574
        var length = 3;                                                                                                // 575
        var prop, str, obj, i, k, l;                                                                                   // 576
        l = (this.limitChildrenCount > 0) ?                                                                            // 577
            Math.min(this.limitChildrenCount, properties.length) : properties.length;                                  // 578
                                                                                                                       // 579
        for (i = 0; i < l; ++i) {                                                                                      // 580
            prop = properties[i];                                                                                      // 581
            obj = object[prop];                                                                                        // 582
                                                                                                                       // 583
            if (isCircular(obj, processed)) {                                                                          // 584
                str = "[Circular]";                                                                                    // 585
            } else {                                                                                                   // 586
                str = ascii(this, obj, processed, indent + 2);                                                         // 587
            }                                                                                                          // 588
                                                                                                                       // 589
            str = (/\s/.test(prop) ? '"' + prop + '"' : prop) + ": " + str;                                            // 590
            length += str.length;                                                                                      // 591
            pieces.push(str);                                                                                          // 592
        }                                                                                                              // 593
                                                                                                                       // 594
        var cons = constructorName(this, object);                                                                      // 595
        var prefix = cons ? "[" + cons + "] " : "";                                                                    // 596
        var is = "";                                                                                                   // 597
        for (i = 0, k = indent; i < k; ++i) { is += " "; }                                                             // 598
                                                                                                                       // 599
        if(l < properties.length)                                                                                      // 600
            pieces.push("[... " + (properties.length - l) + " more elements]");                                        // 601
                                                                                                                       // 602
        if (length + indent > 80) {                                                                                    // 603
            return prefix + "{\n  " + is + pieces.join(",\n  " + is) + "\n" +                                          // 604
                is + "}";                                                                                              // 605
        }                                                                                                              // 606
        return prefix + "{ " + pieces.join(", ") + " }";                                                               // 607
    };                                                                                                                 // 608
                                                                                                                       // 609
    ascii.element = function (element) {                                                                               // 610
        var tagName = element.tagName.toLowerCase();                                                                   // 611
        var attrs = element.attributes, attr, pairs = [], attrName, i, l, val;                                         // 612
                                                                                                                       // 613
        for (i = 0, l = attrs.length; i < l; ++i) {                                                                    // 614
            attr = attrs.item(i);                                                                                      // 615
            attrName = attr.nodeName.toLowerCase().replace("html:", "");                                               // 616
            val = attr.nodeValue;                                                                                      // 617
            if (attrName !== "contenteditable" || val !== "inherit") {                                                 // 618
                if (!!val) { pairs.push(attrName + "=\"" + val + "\""); }                                              // 619
            }                                                                                                          // 620
        }                                                                                                              // 621
                                                                                                                       // 622
        var formatted = "<" + tagName + (pairs.length > 0 ? " " : "");                                                 // 623
        var content = element.innerHTML;                                                                               // 624
                                                                                                                       // 625
        if (content.length > 20) {                                                                                     // 626
            content = content.substr(0, 20) + "[...]";                                                                 // 627
        }                                                                                                              // 628
                                                                                                                       // 629
        var res = formatted + pairs.join(" ") + ">" + content +                                                        // 630
                "</" + tagName + ">";                                                                                  // 631
                                                                                                                       // 632
        return res.replace(/ contentEditable="inherit"/, "");                                                          // 633
    };                                                                                                                 // 634
                                                                                                                       // 635
    function Formatio(options) {                                                                                       // 636
        for (var opt in options) {                                                                                     // 637
            this[opt] = options[opt];                                                                                  // 638
        }                                                                                                              // 639
    }                                                                                                                  // 640
                                                                                                                       // 641
    Formatio.prototype = {                                                                                             // 642
        functionName: functionName,                                                                                    // 643
                                                                                                                       // 644
        configure: function (options) {                                                                                // 645
            return new Formatio(options);                                                                              // 646
        },                                                                                                             // 647
                                                                                                                       // 648
        constructorName: function (object) {                                                                           // 649
            return constructorName(this, object);                                                                      // 650
        },                                                                                                             // 651
                                                                                                                       // 652
        ascii: function (object, processed, indent) {                                                                  // 653
            return ascii(this, object, processed, indent);                                                             // 654
        }                                                                                                              // 655
    };                                                                                                                 // 656
                                                                                                                       // 657
    return Formatio.prototype;                                                                                         // 658
});                                                                                                                    // 659
!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.lolex=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){                                                                                                    // 661
/*jslint eqeqeq: false, plusplus: false, evil: true, onevar: false, browser: true, forin: false*/                      // 662
/*global global*/                                                                                                      // 663
/**                                                                                                                    // 664
 * @author Christian Johansen (christian@cjohansen.no) and contributors                                                // 665
 * @license BSD                                                                                                        // 666
 *                                                                                                                     // 667
 * Copyright (c) 2010-2014 Christian Johansen                                                                          // 668
 */                                                                                                                    // 669
                                                                                                                       // 670
// node expects setTimeout/setInterval to return a fn object w/ .ref()/.unref()                                        // 671
// browsers, a number.                                                                                                 // 672
// see https://github.com/cjohansen/Sinon.JS/pull/436                                                                  // 673
var timeoutResult = setTimeout(function() {}, 0);                                                                      // 674
var addTimerReturnsObject = typeof timeoutResult === "object";                                                         // 675
clearTimeout(timeoutResult);                                                                                           // 676
                                                                                                                       // 677
var NativeDate = Date;                                                                                                 // 678
var id = 1;                                                                                                            // 679
                                                                                                                       // 680
/**                                                                                                                    // 681
 * Parse strings like "01:10:00" (meaning 1 hour, 10 minutes, 0 seconds) into                                          // 682
 * number of milliseconds. This is used to support human-readable strings passed                                       // 683
 * to clock.tick()                                                                                                     // 684
 */                                                                                                                    // 685
function parseTime(str) {                                                                                              // 686
    if (!str) {                                                                                                        // 687
        return 0;                                                                                                      // 688
    }                                                                                                                  // 689
                                                                                                                       // 690
    var strings = str.split(":");                                                                                      // 691
    var l = strings.length, i = l;                                                                                     // 692
    var ms = 0, parsed;                                                                                                // 693
                                                                                                                       // 694
    if (l > 3 || !/^(\d\d:){0,2}\d\d?$/.test(str)) {                                                                   // 695
        throw new Error("tick only understands numbers and 'h:m:s'");                                                  // 696
    }                                                                                                                  // 697
                                                                                                                       // 698
    while (i--) {                                                                                                      // 699
        parsed = parseInt(strings[i], 10);                                                                             // 700
                                                                                                                       // 701
        if (parsed >= 60) {                                                                                            // 702
            throw new Error("Invalid time " + str);                                                                    // 703
        }                                                                                                              // 704
                                                                                                                       // 705
        ms += parsed * Math.pow(60, (l - i - 1));                                                                      // 706
    }                                                                                                                  // 707
                                                                                                                       // 708
    return ms * 1000;                                                                                                  // 709
}                                                                                                                      // 710
                                                                                                                       // 711
/**                                                                                                                    // 712
 * Used to grok the `now` parameter to createClock.                                                                    // 713
 */                                                                                                                    // 714
function getEpoch(epoch) {                                                                                             // 715
    if (!epoch) { return 0; }                                                                                          // 716
    if (typeof epoch.getTime === "function") { return epoch.getTime(); }                                               // 717
    if (typeof epoch === "number") { return epoch; }                                                                   // 718
    throw new TypeError("now should be milliseconds since UNIX epoch");                                                // 719
}                                                                                                                      // 720
                                                                                                                       // 721
function inRange(from, to, timer) {                                                                                    // 722
    return timer && timer.callAt >= from && timer.callAt <= to;                                                        // 723
}                                                                                                                      // 724
                                                                                                                       // 725
function mirrorDateProperties(target, source) {                                                                        // 726
    if (source.now) {                                                                                                  // 727
        target.now = function now() {                                                                                  // 728
            return target.clock.now;                                                                                   // 729
        };                                                                                                             // 730
    } else {                                                                                                           // 731
        delete target.now;                                                                                             // 732
    }                                                                                                                  // 733
                                                                                                                       // 734
    if (source.toSource) {                                                                                             // 735
        target.toSource = function toSource() {                                                                        // 736
            return source.toSource();                                                                                  // 737
        };                                                                                                             // 738
    } else {                                                                                                           // 739
        delete target.toSource;                                                                                        // 740
    }                                                                                                                  // 741
                                                                                                                       // 742
    target.toString = function toString() {                                                                            // 743
        return source.toString();                                                                                      // 744
    };                                                                                                                 // 745
                                                                                                                       // 746
    target.prototype = source.prototype;                                                                               // 747
    target.parse = source.parse;                                                                                       // 748
    target.UTC = source.UTC;                                                                                           // 749
    target.prototype.toUTCString = source.prototype.toUTCString;                                                       // 750
                                                                                                                       // 751
    for (var prop in source) {                                                                                         // 752
        if (source.hasOwnProperty(prop)) {                                                                             // 753
            target[prop] = source[prop];                                                                               // 754
        }                                                                                                              // 755
    }                                                                                                                  // 756
                                                                                                                       // 757
    return target;                                                                                                     // 758
}                                                                                                                      // 759
                                                                                                                       // 760
function createDate() {                                                                                                // 761
    function ClockDate(year, month, date, hour, minute, second, ms) {                                                  // 762
        // Defensive and verbose to avoid potential harm in passing                                                    // 763
        // explicit undefined when user does not pass argument                                                         // 764
        switch (arguments.length) {                                                                                    // 765
        case 0:                                                                                                        // 766
            return new NativeDate(ClockDate.clock.now);                                                                // 767
        case 1:                                                                                                        // 768
            return new NativeDate(year);                                                                               // 769
        case 2:                                                                                                        // 770
            return new NativeDate(year, month);                                                                        // 771
        case 3:                                                                                                        // 772
            return new NativeDate(year, month, date);                                                                  // 773
        case 4:                                                                                                        // 774
            return new NativeDate(year, month, date, hour);                                                            // 775
        case 5:                                                                                                        // 776
            return new NativeDate(year, month, date, hour, minute);                                                    // 777
        case 6:                                                                                                        // 778
            return new NativeDate(year, month, date, hour, minute, second);                                            // 779
        default:                                                                                                       // 780
            return new NativeDate(year, month, date, hour, minute, second, ms);                                        // 781
        }                                                                                                              // 782
    }                                                                                                                  // 783
                                                                                                                       // 784
    return mirrorDateProperties(ClockDate, NativeDate);                                                                // 785
}                                                                                                                      // 786
                                                                                                                       // 787
function addTimer(clock, timer) {                                                                                      // 788
    if (typeof timer.func === "undefined") {                                                                           // 789
        throw new Error("Callback must be provided to timer calls");                                                   // 790
    }                                                                                                                  // 791
                                                                                                                       // 792
    if (!clock.timers) {                                                                                               // 793
        clock.timers = {};                                                                                             // 794
    }                                                                                                                  // 795
                                                                                                                       // 796
    timer.id = id++;                                                                                                   // 797
    timer.createdAt = clock.now;                                                                                       // 798
    timer.callAt = clock.now + (timer.delay || 0);                                                                     // 799
                                                                                                                       // 800
    clock.timers[timer.id] = timer;                                                                                    // 801
                                                                                                                       // 802
    if (addTimerReturnsObject) {                                                                                       // 803
        return {                                                                                                       // 804
            id: timer.id,                                                                                              // 805
            ref: function() {},                                                                                        // 806
            unref: function() {}                                                                                       // 807
        };                                                                                                             // 808
    }                                                                                                                  // 809
    else {                                                                                                             // 810
        return timer.id;                                                                                               // 811
    }                                                                                                                  // 812
}                                                                                                                      // 813
                                                                                                                       // 814
function firstTimerInRange(clock, from, to) {                                                                          // 815
    var timers = clock.timers, timer = null;                                                                           // 816
                                                                                                                       // 817
    for (var id in timers) {                                                                                           // 818
        if (!inRange(from, to, timers[id])) {                                                                          // 819
            continue;                                                                                                  // 820
        }                                                                                                              // 821
                                                                                                                       // 822
        if (!timer || ~compareTimers(timer, timers[id])) {                                                             // 823
            timer = timers[id];                                                                                        // 824
        }                                                                                                              // 825
    }                                                                                                                  // 826
                                                                                                                       // 827
    return timer;                                                                                                      // 828
}                                                                                                                      // 829
                                                                                                                       // 830
function compareTimers(a, b) {                                                                                         // 831
    // Sort first by absolute timing                                                                                   // 832
    if (a.callAt < b.callAt) {                                                                                         // 833
        return -1;                                                                                                     // 834
    }                                                                                                                  // 835
    if (a.callAt > b.callAt) {                                                                                         // 836
        return 1;                                                                                                      // 837
    }                                                                                                                  // 838
                                                                                                                       // 839
    // Sort next by immediate, immediate timers take precedence                                                        // 840
    if (a.immediate && !b.immediate) {                                                                                 // 841
        return -1;                                                                                                     // 842
    }                                                                                                                  // 843
    if (!a.immediate && b.immediate) {                                                                                 // 844
        return 1;                                                                                                      // 845
    }                                                                                                                  // 846
                                                                                                                       // 847
    // Sort next by creation time, earlier-created timers take precedence                                              // 848
    if (a.createdAt < b.createdAt) {                                                                                   // 849
        return -1;                                                                                                     // 850
    }                                                                                                                  // 851
    if (a.createdAt > b.createdAt) {                                                                                   // 852
        return 1;                                                                                                      // 853
    }                                                                                                                  // 854
                                                                                                                       // 855
    // Sort next by id, lower-id timers take precedence                                                                // 856
    if (a.id < b.id) {                                                                                                 // 857
        return -1;                                                                                                     // 858
    }                                                                                                                  // 859
    if (a.id > b.id) {                                                                                                 // 860
        return 1;                                                                                                      // 861
    }                                                                                                                  // 862
                                                                                                                       // 863
    // As timer ids are unique, no fallback `0` is necessary                                                           // 864
}                                                                                                                      // 865
                                                                                                                       // 866
function callTimer(clock, timer) {                                                                                     // 867
    if (typeof timer.interval == "number") {                                                                           // 868
        clock.timers[timer.id].callAt += timer.interval;                                                               // 869
    } else {                                                                                                           // 870
        delete clock.timers[timer.id];                                                                                 // 871
    }                                                                                                                  // 872
                                                                                                                       // 873
    try {                                                                                                              // 874
        if (typeof timer.func == "function") {                                                                         // 875
            timer.func.apply(null, timer.args);                                                                        // 876
        } else {                                                                                                       // 877
            eval(timer.func);                                                                                          // 878
        }                                                                                                              // 879
    } catch (e) {                                                                                                      // 880
        var exception = e;                                                                                             // 881
    }                                                                                                                  // 882
                                                                                                                       // 883
    if (!clock.timers[timer.id]) {                                                                                     // 884
        if (exception) {                                                                                               // 885
            throw exception;                                                                                           // 886
        }                                                                                                              // 887
        return;                                                                                                        // 888
    }                                                                                                                  // 889
                                                                                                                       // 890
    if (exception) {                                                                                                   // 891
        throw exception;                                                                                               // 892
    }                                                                                                                  // 893
}                                                                                                                      // 894
                                                                                                                       // 895
function uninstall(clock, target) {                                                                                    // 896
    var method;                                                                                                        // 897
                                                                                                                       // 898
    for (var i = 0, l = clock.methods.length; i < l; i++) {                                                            // 899
        method = clock.methods[i];                                                                                     // 900
                                                                                                                       // 901
        if (target[method].hadOwnProperty) {                                                                           // 902
            target[method] = clock["_" + method];                                                                      // 903
        } else {                                                                                                       // 904
            try {                                                                                                      // 905
                delete target[method];                                                                                 // 906
            } catch (e) {}                                                                                             // 907
        }                                                                                                              // 908
    }                                                                                                                  // 909
                                                                                                                       // 910
    // Prevent multiple executions which will completely remove these props                                            // 911
    clock.methods = [];                                                                                                // 912
}                                                                                                                      // 913
                                                                                                                       // 914
function hijackMethod(target, method, clock) {                                                                         // 915
    clock[method].hadOwnProperty = Object.prototype.hasOwnProperty.call(target, method);                               // 916
    clock["_" + method] = target[method];                                                                              // 917
                                                                                                                       // 918
    if (method == "Date") {                                                                                            // 919
        var date = mirrorDateProperties(clock[method], target[method]);                                                // 920
        target[method] = date;                                                                                         // 921
    } else {                                                                                                           // 922
        target[method] = function () {                                                                                 // 923
            return clock[method].apply(clock, arguments);                                                              // 924
        };                                                                                                             // 925
                                                                                                                       // 926
        for (var prop in clock[method]) {                                                                              // 927
            if (clock[method].hasOwnProperty(prop)) {                                                                  // 928
                target[method][prop] = clock[method][prop];                                                            // 929
            }                                                                                                          // 930
        }                                                                                                              // 931
    }                                                                                                                  // 932
                                                                                                                       // 933
    target[method].clock = clock;                                                                                      // 934
}                                                                                                                      // 935
                                                                                                                       // 936
var timers = {                                                                                                         // 937
    setTimeout: setTimeout,                                                                                            // 938
    clearTimeout: clearTimeout,                                                                                        // 939
    setImmediate: (typeof setImmediate !== "undefined" ? setImmediate : undefined),                                    // 940
    clearImmediate: (typeof clearImmediate !== "undefined" ? clearImmediate: undefined),                               // 941
    setInterval: setInterval,                                                                                          // 942
    clearInterval: clearInterval,                                                                                      // 943
    Date: Date                                                                                                         // 944
};                                                                                                                     // 945
                                                                                                                       // 946
var keys = Object.keys || function (obj) {                                                                             // 947
    var ks = [];                                                                                                       // 948
    for (var key in obj) {                                                                                             // 949
        ks.push(key);                                                                                                  // 950
    }                                                                                                                  // 951
    return ks;                                                                                                         // 952
};                                                                                                                     // 953
                                                                                                                       // 954
exports.timers = timers;                                                                                               // 955
                                                                                                                       // 956
var createClock = exports.createClock = function (now) {                                                               // 957
    var clock = {                                                                                                      // 958
        now: getEpoch(now),                                                                                            // 959
        timeouts: {},                                                                                                  // 960
        Date: createDate()                                                                                             // 961
    };                                                                                                                 // 962
                                                                                                                       // 963
    clock.Date.clock = clock;                                                                                          // 964
                                                                                                                       // 965
    clock.setTimeout = function setTimeout(func, timeout) {                                                            // 966
        return addTimer(clock, {                                                                                       // 967
            func: func,                                                                                                // 968
            args: Array.prototype.slice.call(arguments, 2),                                                            // 969
            delay: timeout                                                                                             // 970
        });                                                                                                            // 971
    };                                                                                                                 // 972
                                                                                                                       // 973
    clock.clearTimeout = function clearTimeout(timerId) {                                                              // 974
        if (!timerId) {                                                                                                // 975
            // null appears to be allowed in most browsers, and appears to be                                          // 976
            // relied upon by some libraries, like Bootstrap carousel                                                  // 977
            return;                                                                                                    // 978
        }                                                                                                              // 979
        if (!clock.timers) {                                                                                           // 980
            clock.timers = [];                                                                                         // 981
        }                                                                                                              // 982
        // in Node, timerId is an object with .ref()/.unref(), and                                                     // 983
        // its .id field is the actual timer id.                                                                       // 984
        if (typeof timerId === "object") {                                                                             // 985
            timerId = timerId.id                                                                                       // 986
        }                                                                                                              // 987
        if (timerId in clock.timers) {                                                                                 // 988
            delete clock.timers[timerId];                                                                              // 989
        }                                                                                                              // 990
    };                                                                                                                 // 991
                                                                                                                       // 992
    clock.setInterval = function setInterval(func, timeout) {                                                          // 993
        return addTimer(clock, {                                                                                       // 994
            func: func,                                                                                                // 995
            args: Array.prototype.slice.call(arguments, 2),                                                            // 996
            delay: timeout,                                                                                            // 997
            interval: timeout                                                                                          // 998
        });                                                                                                            // 999
    };                                                                                                                 // 1000
                                                                                                                       // 1001
    clock.clearInterval = function clearInterval(timerId) {                                                            // 1002
        clock.clearTimeout(timerId);                                                                                   // 1003
    };                                                                                                                 // 1004
                                                                                                                       // 1005
    clock.setImmediate = function setImmediate(func) {                                                                 // 1006
        return addTimer(clock, {                                                                                       // 1007
            func: func,                                                                                                // 1008
            args: Array.prototype.slice.call(arguments, 1),                                                            // 1009
            immediate: true                                                                                            // 1010
        });                                                                                                            // 1011
    };                                                                                                                 // 1012
                                                                                                                       // 1013
    clock.clearImmediate = function clearImmediate(timerId) {                                                          // 1014
        clock.clearTimeout(timerId);                                                                                   // 1015
    };                                                                                                                 // 1016
                                                                                                                       // 1017
    clock.tick = function tick(ms) {                                                                                   // 1018
        ms = typeof ms == "number" ? ms : parseTime(ms);                                                               // 1019
        var tickFrom = clock.now, tickTo = clock.now + ms, previous = clock.now;                                       // 1020
        var timer = firstTimerInRange(clock, tickFrom, tickTo);                                                        // 1021
                                                                                                                       // 1022
        var firstException;                                                                                            // 1023
        while (timer && tickFrom <= tickTo) {                                                                          // 1024
            if (clock.timers[timer.id]) {                                                                              // 1025
                tickFrom = clock.now = timer.callAt;                                                                   // 1026
                try {                                                                                                  // 1027
                    callTimer(clock, timer);                                                                           // 1028
                } catch (e) {                                                                                          // 1029
                    firstException = firstException || e;                                                              // 1030
                }                                                                                                      // 1031
            }                                                                                                          // 1032
                                                                                                                       // 1033
            timer = firstTimerInRange(clock, previous, tickTo);                                                        // 1034
            previous = tickFrom;                                                                                       // 1035
        }                                                                                                              // 1036
                                                                                                                       // 1037
        clock.now = tickTo;                                                                                            // 1038
                                                                                                                       // 1039
        if (firstException) {                                                                                          // 1040
            throw firstException;                                                                                      // 1041
        }                                                                                                              // 1042
                                                                                                                       // 1043
        return clock.now;                                                                                              // 1044
    };                                                                                                                 // 1045
                                                                                                                       // 1046
    clock.reset = function reset() {                                                                                   // 1047
        clock.timers = {};                                                                                             // 1048
    };                                                                                                                 // 1049
                                                                                                                       // 1050
    return clock;                                                                                                      // 1051
};                                                                                                                     // 1052
                                                                                                                       // 1053
exports.install = function install(target, now, toFake) {                                                              // 1054
    if (typeof target === "number") {                                                                                  // 1055
        toFake = now;                                                                                                  // 1056
        now = target;                                                                                                  // 1057
        target = null;                                                                                                 // 1058
    }                                                                                                                  // 1059
                                                                                                                       // 1060
    if (!target) {                                                                                                     // 1061
        target = global;                                                                                               // 1062
    }                                                                                                                  // 1063
                                                                                                                       // 1064
    var clock = createClock(now);                                                                                      // 1065
                                                                                                                       // 1066
    clock.uninstall = function () {                                                                                    // 1067
        uninstall(clock, target);                                                                                      // 1068
    };                                                                                                                 // 1069
                                                                                                                       // 1070
    clock.methods = toFake || [];                                                                                      // 1071
                                                                                                                       // 1072
    if (clock.methods.length === 0) {                                                                                  // 1073
        clock.methods = keys(timers);                                                                                  // 1074
    }                                                                                                                  // 1075
                                                                                                                       // 1076
    for (var i = 0, l = clock.methods.length; i < l; i++) {                                                            // 1077
        hijackMethod(target, clock.methods[i], clock);                                                                 // 1078
    }                                                                                                                  // 1079
                                                                                                                       // 1080
    return clock;                                                                                                      // 1081
};                                                                                                                     // 1082
                                                                                                                       // 1083
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1])(1)                                                                                                      // 1085
});                                                                                                                    // 1086
  })();                                                                                                                // 1087
  var define;                                                                                                          // 1088
/**                                                                                                                    // 1089
 * Sinon core utilities. For internal use only.                                                                        // 1090
 *                                                                                                                     // 1091
 * @author Christian Johansen (christian@cjohansen.no)                                                                 // 1092
 * @license BSD                                                                                                        // 1093
 *                                                                                                                     // 1094
 * Copyright (c) 2010-2013 Christian Johansen                                                                          // 1095
 */                                                                                                                    // 1096
                                                                                                                       // 1097
var sinon = (function () {                                                                                             // 1098
"use strict";                                                                                                          // 1099
                                                                                                                       // 1100
    var sinon;                                                                                                         // 1101
    var isNode = typeof module !== "undefined" && module.exports && typeof require === "function";                     // 1102
    var isAMD = typeof define === "function" && typeof define.amd === "object" && define.amd;                          // 1103
                                                                                                                       // 1104
    function loadDependencies(require, exports, module) {                                                              // 1105
        sinon = module.exports = require("./sinon/util/core");                                                         // 1106
        require("./sinon/extend");                                                                                     // 1107
        require("./sinon/typeOf");                                                                                     // 1108
        require("./sinon/times_in_words");                                                                             // 1109
        require("./sinon/spy");                                                                                        // 1110
        require("./sinon/call");                                                                                       // 1111
        require("./sinon/behavior");                                                                                   // 1112
        require("./sinon/stub");                                                                                       // 1113
        require("./sinon/mock");                                                                                       // 1114
        require("./sinon/collection");                                                                                 // 1115
        require("./sinon/assert");                                                                                     // 1116
        require("./sinon/sandbox");                                                                                    // 1117
        require("./sinon/test");                                                                                       // 1118
        require("./sinon/test_case");                                                                                  // 1119
        require("./sinon/match");                                                                                      // 1120
        require("./sinon/format");                                                                                     // 1121
        require("./sinon/log_error");                                                                                  // 1122
    }                                                                                                                  // 1123
                                                                                                                       // 1124
    if (isAMD) {                                                                                                       // 1125
        define(loadDependencies);                                                                                      // 1126
    } else if (isNode) {                                                                                               // 1127
        loadDependencies(require, module.exports, module);                                                             // 1128
        sinon = module.exports;                                                                                        // 1129
    } else {                                                                                                           // 1130
        sinon = {};                                                                                                    // 1131
    }                                                                                                                  // 1132
                                                                                                                       // 1133
    return sinon;                                                                                                      // 1134
}());                                                                                                                  // 1135
                                                                                                                       // 1136
/**                                                                                                                    // 1137
 * @depend ../../sinon.js                                                                                              // 1138
 */                                                                                                                    // 1139
/**                                                                                                                    // 1140
 * Sinon core utilities. For internal use only.                                                                        // 1141
 *                                                                                                                     // 1142
 * @author Christian Johansen (christian@cjohansen.no)                                                                 // 1143
 * @license BSD                                                                                                        // 1144
 *                                                                                                                     // 1145
 * Copyright (c) 2010-2013 Christian Johansen                                                                          // 1146
 */                                                                                                                    // 1147
                                                                                                                       // 1148
(function (sinon) {                                                                                                    // 1149
    var div = typeof document != "undefined" && document.createElement("div");                                         // 1150
    var hasOwn = Object.prototype.hasOwnProperty;                                                                      // 1151
                                                                                                                       // 1152
    function isDOMNode(obj) {                                                                                          // 1153
        var success = false;                                                                                           // 1154
                                                                                                                       // 1155
        try {                                                                                                          // 1156
            obj.appendChild(div);                                                                                      // 1157
            success = div.parentNode == obj;                                                                           // 1158
        } catch (e) {                                                                                                  // 1159
            return false;                                                                                              // 1160
        } finally {                                                                                                    // 1161
            try {                                                                                                      // 1162
                obj.removeChild(div);                                                                                  // 1163
            } catch (e) {                                                                                              // 1164
                // Remove failed, not much we can do about that                                                        // 1165
            }                                                                                                          // 1166
        }                                                                                                              // 1167
                                                                                                                       // 1168
        return success;                                                                                                // 1169
    }                                                                                                                  // 1170
                                                                                                                       // 1171
    function isElement(obj) {                                                                                          // 1172
        return div && obj && obj.nodeType === 1 && isDOMNode(obj);                                                     // 1173
    }                                                                                                                  // 1174
                                                                                                                       // 1175
    function isFunction(obj) {                                                                                         // 1176
        return typeof obj === "function" || !!(obj && obj.constructor && obj.call && obj.apply);                       // 1177
    }                                                                                                                  // 1178
                                                                                                                       // 1179
    function isReallyNaN(val) {                                                                                        // 1180
        return typeof val === "number" && isNaN(val);                                                                  // 1181
    }                                                                                                                  // 1182
                                                                                                                       // 1183
    function mirrorProperties(target, source) {                                                                        // 1184
        for (var prop in source) {                                                                                     // 1185
            if (!hasOwn.call(target, prop)) {                                                                          // 1186
                target[prop] = source[prop];                                                                           // 1187
            }                                                                                                          // 1188
        }                                                                                                              // 1189
    }                                                                                                                  // 1190
                                                                                                                       // 1191
    function isRestorable(obj) {                                                                                       // 1192
        return typeof obj === "function" && typeof obj.restore === "function" && obj.restore.sinon;                    // 1193
    }                                                                                                                  // 1194
                                                                                                                       // 1195
    // Cheap way to detect if we have ES5 support.                                                                     // 1196
    var hasES5Support = "keys" in Object;                                                                              // 1197
                                                                                                                       // 1198
    function makeApi(sinon) {                                                                                          // 1199
        sinon.wrapMethod = function wrapMethod(object, property, method) {                                             // 1200
            if (!object) {                                                                                             // 1201
                throw new TypeError("Should wrap property of object");                                                 // 1202
            }                                                                                                          // 1203
                                                                                                                       // 1204
            if (typeof method != "function" && typeof method != "object") {                                            // 1205
                throw new TypeError("Method wrapper should be a function or a property descriptor");                   // 1206
            }                                                                                                          // 1207
                                                                                                                       // 1208
            function checkWrappedMethod(wrappedMethod) {                                                               // 1209
                if (!isFunction(wrappedMethod)) {                                                                      // 1210
                    error = new TypeError("Attempted to wrap " + (typeof wrappedMethod) + " property " +               // 1211
                                        property + " as function");                                                    // 1212
                } else if (wrappedMethod.restore && wrappedMethod.restore.sinon) {                                     // 1213
                    error = new TypeError("Attempted to wrap " + property + " which is already wrapped");              // 1214
                } else if (wrappedMethod.calledBefore) {                                                               // 1215
                    var verb = !!wrappedMethod.returns ? "stubbed" : "spied on";                                       // 1216
                    error = new TypeError("Attempted to wrap " + property + " which is already " + verb);              // 1217
                }                                                                                                      // 1218
                                                                                                                       // 1219
                if (error) {                                                                                           // 1220
                    if (wrappedMethod && wrappedMethod.stackTrace) {                                                   // 1221
                        error.stack += "\n--------------\n" + wrappedMethod.stackTrace;                                // 1222
                    }                                                                                                  // 1223
                    throw error;                                                                                       // 1224
                }                                                                                                      // 1225
            }                                                                                                          // 1226
                                                                                                                       // 1227
            var error, wrappedMethod;                                                                                  // 1228
                                                                                                                       // 1229
            // IE 8 does not support hasOwnProperty on the window object and Firefox has a problem                     // 1230
            // when using hasOwn.call on objects from other frames.                                                    // 1231
            var owned = object.hasOwnProperty ? object.hasOwnProperty(property) : hasOwn.call(object, property);       // 1232
                                                                                                                       // 1233
            if (hasES5Support) {                                                                                       // 1234
                var methodDesc = (typeof method == "function") ? {value: method} : method,                             // 1235
                    wrappedMethodDesc = sinon.getPropertyDescriptor(object, property),                                 // 1236
                    i;                                                                                                 // 1237
                                                                                                                       // 1238
                if (!wrappedMethodDesc) {                                                                              // 1239
                    error = new TypeError("Attempted to wrap " + (typeof wrappedMethod) + " property " +               // 1240
                                        property + " as function");                                                    // 1241
                } else if (wrappedMethodDesc.restore && wrappedMethodDesc.restore.sinon) {                             // 1242
                    error = new TypeError("Attempted to wrap " + property + " which is already wrapped");              // 1243
                }                                                                                                      // 1244
                if (error) {                                                                                           // 1245
                    if (wrappedMethodDesc && wrappedMethodDesc.stackTrace) {                                           // 1246
                        error.stack += "\n--------------\n" + wrappedMethodDesc.stackTrace;                            // 1247
                    }                                                                                                  // 1248
                    throw error;                                                                                       // 1249
                }                                                                                                      // 1250
                                                                                                                       // 1251
                var types = sinon.objectKeys(methodDesc);                                                              // 1252
                for (i = 0; i < types.length; i++) {                                                                   // 1253
                    wrappedMethod = wrappedMethodDesc[types[i]];                                                       // 1254
                    checkWrappedMethod(wrappedMethod);                                                                 // 1255
                }                                                                                                      // 1256
                                                                                                                       // 1257
                mirrorProperties(methodDesc, wrappedMethodDesc);                                                       // 1258
                for (i = 0; i < types.length; i++) {                                                                   // 1259
                    mirrorProperties(methodDesc[types[i]], wrappedMethodDesc[types[i]]);                               // 1260
                }                                                                                                      // 1261
                Object.defineProperty(object, property, methodDesc);                                                   // 1262
            } else {                                                                                                   // 1263
                wrappedMethod = object[property];                                                                      // 1264
                checkWrappedMethod(wrappedMethod);                                                                     // 1265
                object[property] = method;                                                                             // 1266
                method.displayName = property;                                                                         // 1267
            }                                                                                                          // 1268
                                                                                                                       // 1269
            method.displayName = property;                                                                             // 1270
                                                                                                                       // 1271
            // Set up a stack trace which can be used later to find what line of                                       // 1272
            // code the original method was created on.                                                                // 1273
            method.stackTrace = (new Error("Stack Trace for original")).stack;                                         // 1274
                                                                                                                       // 1275
            method.restore = function () {                                                                             // 1276
                // For prototype properties try to reset by delete first.                                              // 1277
                // If this fails (ex: localStorage on mobile safari) then force a reset                                // 1278
                // via direct assignment.                                                                              // 1279
                if (!owned) {                                                                                          // 1280
                    try {                                                                                              // 1281
                        delete object[property];                                                                       // 1282
                    } catch (e) {}                                                                                     // 1283
                    // For native code functions `delete` fails without throwing an error                              // 1284
                    // on Chrome < 43, PhantomJS, etc.                                                                 // 1285
                    // Use strict equality comparison to check failures then force a reset                             // 1286
                    // via direct assignment.                                                                          // 1287
                    if (object[property] === method) {                                                                 // 1288
                        object[property] = wrappedMethod;                                                              // 1289
                    }                                                                                                  // 1290
                } else if (hasES5Support) {                                                                            // 1291
                    Object.defineProperty(object, property, wrappedMethodDesc);                                        // 1292
                }                                                                                                      // 1293
                                                                                                                       // 1294
                if (!hasES5Support && object[property] === method) {                                                   // 1295
                    object[property] = wrappedMethod;                                                                  // 1296
                }                                                                                                      // 1297
            };                                                                                                         // 1298
                                                                                                                       // 1299
            method.restore.sinon = true;                                                                               // 1300
                                                                                                                       // 1301
            if (!hasES5Support) {                                                                                      // 1302
                mirrorProperties(method, wrappedMethod);                                                               // 1303
            }                                                                                                          // 1304
                                                                                                                       // 1305
            return method;                                                                                             // 1306
        };                                                                                                             // 1307
                                                                                                                       // 1308
        sinon.create = function create(proto) {                                                                        // 1309
            var F = function () {};                                                                                    // 1310
            F.prototype = proto;                                                                                       // 1311
            return new F();                                                                                            // 1312
        };                                                                                                             // 1313
                                                                                                                       // 1314
        sinon.deepEqual = function deepEqual(a, b) {                                                                   // 1315
            if (sinon.match && sinon.match.isMatcher(a)) {                                                             // 1316
                return a.test(b);                                                                                      // 1317
            }                                                                                                          // 1318
                                                                                                                       // 1319
            if (typeof a != "object" || typeof b != "object") {                                                        // 1320
                if (isReallyNaN(a) && isReallyNaN(b)) {                                                                // 1321
                    return true;                                                                                       // 1322
                } else {                                                                                               // 1323
                    return a === b;                                                                                    // 1324
                }                                                                                                      // 1325
            }                                                                                                          // 1326
                                                                                                                       // 1327
            if (isElement(a) || isElement(b)) {                                                                        // 1328
                return a === b;                                                                                        // 1329
            }                                                                                                          // 1330
                                                                                                                       // 1331
            if (a === b) {                                                                                             // 1332
                return true;                                                                                           // 1333
            }                                                                                                          // 1334
                                                                                                                       // 1335
            if ((a === null && b !== null) || (a !== null && b === null)) {                                            // 1336
                return false;                                                                                          // 1337
            }                                                                                                          // 1338
                                                                                                                       // 1339
            if (a instanceof RegExp && b instanceof RegExp) {                                                          // 1340
                return (a.source === b.source) && (a.global === b.global) &&                                           // 1341
                    (a.ignoreCase === b.ignoreCase) && (a.multiline === b.multiline);                                  // 1342
            }                                                                                                          // 1343
                                                                                                                       // 1344
            var aString = Object.prototype.toString.call(a);                                                           // 1345
            if (aString != Object.prototype.toString.call(b)) {                                                        // 1346
                return false;                                                                                          // 1347
            }                                                                                                          // 1348
                                                                                                                       // 1349
            if (aString == "[object Date]") {                                                                          // 1350
                return a.valueOf() === b.valueOf();                                                                    // 1351
            }                                                                                                          // 1352
                                                                                                                       // 1353
            var prop, aLength = 0, bLength = 0;                                                                        // 1354
                                                                                                                       // 1355
            if (aString == "[object Array]" && a.length !== b.length) {                                                // 1356
                return false;                                                                                          // 1357
            }                                                                                                          // 1358
                                                                                                                       // 1359
            for (prop in a) {                                                                                          // 1360
                aLength += 1;                                                                                          // 1361
                                                                                                                       // 1362
                if (!(prop in b)) {                                                                                    // 1363
                    return false;                                                                                      // 1364
                }                                                                                                      // 1365
                                                                                                                       // 1366
                if (!deepEqual(a[prop], b[prop])) {                                                                    // 1367
                    return false;                                                                                      // 1368
                }                                                                                                      // 1369
            }                                                                                                          // 1370
                                                                                                                       // 1371
            for (prop in b) {                                                                                          // 1372
                bLength += 1;                                                                                          // 1373
            }                                                                                                          // 1374
                                                                                                                       // 1375
            return aLength == bLength;                                                                                 // 1376
        };                                                                                                             // 1377
                                                                                                                       // 1378
        sinon.functionName = function functionName(func) {                                                             // 1379
            var name = func.displayName || func.name;                                                                  // 1380
                                                                                                                       // 1381
            // Use function decomposition as a last resort to get function                                             // 1382
            // name. Does not rely on function decomposition to work - if it                                           // 1383
            // doesn't debugging will be slightly less informative                                                     // 1384
            // (i.e. toString will say 'spy' rather than 'myFunc').                                                    // 1385
            if (!name) {                                                                                               // 1386
                var matches = func.toString().match(/function ([^\s\(]+)/);                                            // 1387
                name = matches && matches[1];                                                                          // 1388
            }                                                                                                          // 1389
                                                                                                                       // 1390
            return name;                                                                                               // 1391
        };                                                                                                             // 1392
                                                                                                                       // 1393
        sinon.functionToString = function toString() {                                                                 // 1394
            if (this.getCall && this.callCount) {                                                                      // 1395
                var thisValue, prop, i = this.callCount;                                                               // 1396
                                                                                                                       // 1397
                while (i--) {                                                                                          // 1398
                    thisValue = this.getCall(i).thisValue;                                                             // 1399
                                                                                                                       // 1400
                    for (prop in thisValue) {                                                                          // 1401
                        if (thisValue[prop] === this) {                                                                // 1402
                            return prop;                                                                               // 1403
                        }                                                                                              // 1404
                    }                                                                                                  // 1405
                }                                                                                                      // 1406
            }                                                                                                          // 1407
                                                                                                                       // 1408
            return this.displayName || "sinon fake";                                                                   // 1409
        };                                                                                                             // 1410
                                                                                                                       // 1411
        sinon.objectKeys = function objectKeys(obj) {                                                                  // 1412
            if (obj !== Object(obj)) {                                                                                 // 1413
                throw new TypeError("sinon.objectKeys called on a non-object");                                        // 1414
            }                                                                                                          // 1415
                                                                                                                       // 1416
            var keys = [];                                                                                             // 1417
            var key;                                                                                                   // 1418
            for (key in obj) {                                                                                         // 1419
                if (hasOwn.call(obj, key)) {                                                                           // 1420
                    keys.push(key);                                                                                    // 1421
                }                                                                                                      // 1422
            }                                                                                                          // 1423
                                                                                                                       // 1424
            return keys;                                                                                               // 1425
        };                                                                                                             // 1426
                                                                                                                       // 1427
        sinon.getPropertyDescriptor = function getPropertyDescriptor(object, property) {                               // 1428
            var proto = object, descriptor;                                                                            // 1429
            while (proto && !(descriptor = Object.getOwnPropertyDescriptor(proto, property))) {                        // 1430
                proto = Object.getPrototypeOf(proto);                                                                  // 1431
            }                                                                                                          // 1432
            return descriptor;                                                                                         // 1433
        }                                                                                                              // 1434
                                                                                                                       // 1435
        sinon.getConfig = function (custom) {                                                                          // 1436
            var config = {};                                                                                           // 1437
            custom = custom || {};                                                                                     // 1438
            var defaults = sinon.defaultConfig;                                                                        // 1439
                                                                                                                       // 1440
            for (var prop in defaults) {                                                                               // 1441
                if (defaults.hasOwnProperty(prop)) {                                                                   // 1442
                    config[prop] = custom.hasOwnProperty(prop) ? custom[prop] : defaults[prop];                        // 1443
                }                                                                                                      // 1444
            }                                                                                                          // 1445
                                                                                                                       // 1446
            return config;                                                                                             // 1447
        };                                                                                                             // 1448
                                                                                                                       // 1449
        sinon.defaultConfig = {                                                                                        // 1450
            injectIntoThis: true,                                                                                      // 1451
            injectInto: null,                                                                                          // 1452
            properties: ["spy", "stub", "mock", "clock", "server", "requests"],                                        // 1453
            useFakeTimers: true,                                                                                       // 1454
            useFakeServer: true                                                                                        // 1455
        };                                                                                                             // 1456
                                                                                                                       // 1457
        sinon.timesInWords = function timesInWords(count) {                                                            // 1458
            return count == 1 && "once" ||                                                                             // 1459
                count == 2 && "twice" ||                                                                               // 1460
                count == 3 && "thrice" ||                                                                              // 1461
                (count || 0) + " times";                                                                               // 1462
        };                                                                                                             // 1463
                                                                                                                       // 1464
        sinon.calledInOrder = function (spies) {                                                                       // 1465
            for (var i = 1, l = spies.length; i < l; i++) {                                                            // 1466
                if (!spies[i - 1].calledBefore(spies[i]) || !spies[i].called) {                                        // 1467
                    return false;                                                                                      // 1468
                }                                                                                                      // 1469
            }                                                                                                          // 1470
                                                                                                                       // 1471
            return true;                                                                                               // 1472
        };                                                                                                             // 1473
                                                                                                                       // 1474
        sinon.orderByFirstCall = function (spies) {                                                                    // 1475
            return spies.sort(function (a, b) {                                                                        // 1476
                // uuid, won't ever be equal                                                                           // 1477
                var aCall = a.getCall(0);                                                                              // 1478
                var bCall = b.getCall(0);                                                                              // 1479
                var aId = aCall && aCall.callId || -1;                                                                 // 1480
                var bId = bCall && bCall.callId || -1;                                                                 // 1481
                                                                                                                       // 1482
                return aId < bId ? -1 : 1;                                                                             // 1483
            });                                                                                                        // 1484
        };                                                                                                             // 1485
                                                                                                                       // 1486
        sinon.createStubInstance = function (constructor) {                                                            // 1487
            if (typeof constructor !== "function") {                                                                   // 1488
                throw new TypeError("The constructor should be a function.");                                          // 1489
            }                                                                                                          // 1490
            return sinon.stub(sinon.create(constructor.prototype));                                                    // 1491
        };                                                                                                             // 1492
                                                                                                                       // 1493
        sinon.restore = function (object) {                                                                            // 1494
            if (object !== null && typeof object === "object") {                                                       // 1495
                for (var prop in object) {                                                                             // 1496
                    if (isRestorable(object[prop])) {                                                                  // 1497
                        object[prop].restore();                                                                        // 1498
                    }                                                                                                  // 1499
                }                                                                                                      // 1500
            } else if (isRestorable(object)) {                                                                         // 1501
                object.restore();                                                                                      // 1502
            }                                                                                                          // 1503
        };                                                                                                             // 1504
                                                                                                                       // 1505
        return sinon;                                                                                                  // 1506
    }                                                                                                                  // 1507
                                                                                                                       // 1508
    var isNode = typeof module !== "undefined" && module.exports && typeof require == "function";                      // 1509
    var isAMD = typeof define === "function" && typeof define.amd === "object" && define.amd;                          // 1510
                                                                                                                       // 1511
    function loadDependencies(require, exports) {                                                                      // 1512
        makeApi(exports);                                                                                              // 1513
    }                                                                                                                  // 1514
                                                                                                                       // 1515
    if (isAMD) {                                                                                                       // 1516
        define(loadDependencies);                                                                                      // 1517
    } else if (isNode) {                                                                                               // 1518
        loadDependencies(require, module.exports);                                                                     // 1519
    } else if (!sinon) {                                                                                               // 1520
        return;                                                                                                        // 1521
    } else {                                                                                                           // 1522
        makeApi(sinon);                                                                                                // 1523
    }                                                                                                                  // 1524
}(typeof sinon == "object" && sinon || null));                                                                         // 1525
                                                                                                                       // 1526
/**                                                                                                                    // 1527
 * @depend util/core.js                                                                                                // 1528
 */                                                                                                                    // 1529
                                                                                                                       // 1530
(function (sinon) {                                                                                                    // 1531
    function makeApi(sinon) {                                                                                          // 1532
                                                                                                                       // 1533
        // Adapted from https://developer.mozilla.org/en/docs/ECMAScript_DontEnum_attribute#JScript_DontEnum_Bug       // 1534
        var hasDontEnumBug = (function () {                                                                            // 1535
            var obj = {                                                                                                // 1536
                constructor: function () {                                                                             // 1537
                    return "0";                                                                                        // 1538
                },                                                                                                     // 1539
                toString: function () {                                                                                // 1540
                    return "1";                                                                                        // 1541
                },                                                                                                     // 1542
                valueOf: function () {                                                                                 // 1543
                    return "2";                                                                                        // 1544
                },                                                                                                     // 1545
                toLocaleString: function () {                                                                          // 1546
                    return "3";                                                                                        // 1547
                },                                                                                                     // 1548
                prototype: function () {                                                                               // 1549
                    return "4";                                                                                        // 1550
                },                                                                                                     // 1551
                isPrototypeOf: function () {                                                                           // 1552
                    return "5";                                                                                        // 1553
                },                                                                                                     // 1554
                propertyIsEnumerable: function () {                                                                    // 1555
                    return "6";                                                                                        // 1556
                },                                                                                                     // 1557
                hasOwnProperty: function () {                                                                          // 1558
                    return "7";                                                                                        // 1559
                },                                                                                                     // 1560
                length: function () {                                                                                  // 1561
                    return "8";                                                                                        // 1562
                },                                                                                                     // 1563
                unique: function () {                                                                                  // 1564
                    return "9"                                                                                         // 1565
                }                                                                                                      // 1566
            };                                                                                                         // 1567
                                                                                                                       // 1568
            var result = [];                                                                                           // 1569
            for (var prop in obj) {                                                                                    // 1570
                result.push(obj[prop]());                                                                              // 1571
            }                                                                                                          // 1572
            return result.join("") !== "0123456789";                                                                   // 1573
        })();                                                                                                          // 1574
                                                                                                                       // 1575
        /* Public: Extend target in place with all (own) properties from sources in-order. Thus, last source will      // 1576
         *         override properties in previous sources.                                                            // 1577
         *                                                                                                             // 1578
         * target - The Object to extend                                                                               // 1579
         * sources - Objects to copy properties from.                                                                  // 1580
         *                                                                                                             // 1581
         * Returns the extended target                                                                                 // 1582
         */                                                                                                            // 1583
        function extend(target /*, sources */) {                                                                       // 1584
            var sources = Array.prototype.slice.call(arguments, 1),                                                    // 1585
                source, i, prop;                                                                                       // 1586
                                                                                                                       // 1587
            for (i = 0; i < sources.length; i++) {                                                                     // 1588
                source = sources[i];                                                                                   // 1589
                                                                                                                       // 1590
                for (prop in source) {                                                                                 // 1591
                    if (source.hasOwnProperty(prop)) {                                                                 // 1592
                        target[prop] = source[prop];                                                                   // 1593
                    }                                                                                                  // 1594
                }                                                                                                      // 1595
                                                                                                                       // 1596
                // Make sure we copy (own) toString method even when in JScript with DontEnum bug                      // 1597
                // See https://developer.mozilla.org/en/docs/ECMAScript_DontEnum_attribute#JScript_DontEnum_Bug        // 1598
                if (hasDontEnumBug && source.hasOwnProperty("toString") && source.toString !== target.toString) {      // 1599
                    target.toString = source.toString;                                                                 // 1600
                }                                                                                                      // 1601
            }                                                                                                          // 1602
                                                                                                                       // 1603
            return target;                                                                                             // 1604
        };                                                                                                             // 1605
                                                                                                                       // 1606
        sinon.extend = extend;                                                                                         // 1607
        return sinon.extend;                                                                                           // 1608
    }                                                                                                                  // 1609
                                                                                                                       // 1610
    function loadDependencies(require, exports, module) {                                                              // 1611
        var sinon = require("./util/core");                                                                            // 1612
        module.exports = makeApi(sinon);                                                                               // 1613
    }                                                                                                                  // 1614
                                                                                                                       // 1615
    var isNode = typeof module !== "undefined" && module.exports && typeof require == "function";                      // 1616
    var isAMD = typeof define === "function" && typeof define.amd === "object" && define.amd;                          // 1617
                                                                                                                       // 1618
    if (isAMD) {                                                                                                       // 1619
        define(loadDependencies);                                                                                      // 1620
    } else if (isNode) {                                                                                               // 1621
        loadDependencies(require, module.exports, module);                                                             // 1622
    } else if (!sinon) {                                                                                               // 1623
        return;                                                                                                        // 1624
    } else {                                                                                                           // 1625
        makeApi(sinon);                                                                                                // 1626
    }                                                                                                                  // 1627
}(typeof sinon == "object" && sinon || null));                                                                         // 1628
                                                                                                                       // 1629
/**                                                                                                                    // 1630
 * @depend util/core.js                                                                                                // 1631
 */                                                                                                                    // 1632
                                                                                                                       // 1633
(function (sinon) {                                                                                                    // 1634
    function makeApi(sinon) {                                                                                          // 1635
                                                                                                                       // 1636
        function timesInWords(count) {                                                                                 // 1637
            switch (count) {                                                                                           // 1638
                case 1:                                                                                                // 1639
                    return "once";                                                                                     // 1640
                case 2:                                                                                                // 1641
                    return "twice";                                                                                    // 1642
                case 3:                                                                                                // 1643
                    return "thrice";                                                                                   // 1644
                default:                                                                                               // 1645
                    return (count || 0) + " times";                                                                    // 1646
            }                                                                                                          // 1647
        }                                                                                                              // 1648
                                                                                                                       // 1649
        sinon.timesInWords = timesInWords;                                                                             // 1650
        return sinon.timesInWords;                                                                                     // 1651
    }                                                                                                                  // 1652
                                                                                                                       // 1653
    function loadDependencies(require, exports, module) {                                                              // 1654
        var sinon = require("./util/core");                                                                            // 1655
        module.exports = makeApi(sinon);                                                                               // 1656
    }                                                                                                                  // 1657
                                                                                                                       // 1658
    var isNode = typeof module !== "undefined" && module.exports && typeof require == "function";                      // 1659
    var isAMD = typeof define === "function" && typeof define.amd === "object" && define.amd;                          // 1660
                                                                                                                       // 1661
    if (isAMD) {                                                                                                       // 1662
        define(loadDependencies);                                                                                      // 1663
    } else if (isNode) {                                                                                               // 1664
        loadDependencies(require, module.exports, module);                                                             // 1665
    } else if (!sinon) {                                                                                               // 1666
        return;                                                                                                        // 1667
    } else {                                                                                                           // 1668
        makeApi(sinon);                                                                                                // 1669
    }                                                                                                                  // 1670
}(typeof sinon == "object" && sinon || null));                                                                         // 1671
                                                                                                                       // 1672
/**                                                                                                                    // 1673
 * @depend util/core.js                                                                                                // 1674
 */                                                                                                                    // 1675
/**                                                                                                                    // 1676
 * Format functions                                                                                                    // 1677
 *                                                                                                                     // 1678
 * @author Christian Johansen (christian@cjohansen.no)                                                                 // 1679
 * @license BSD                                                                                                        // 1680
 *                                                                                                                     // 1681
 * Copyright (c) 2010-2014 Christian Johansen                                                                          // 1682
 */                                                                                                                    // 1683
                                                                                                                       // 1684
(function (sinon, formatio) {                                                                                          // 1685
    function makeApi(sinon) {                                                                                          // 1686
        function typeOf(value) {                                                                                       // 1687
            if (value === null) {                                                                                      // 1688
                return "null";                                                                                         // 1689
            } else if (value === undefined) {                                                                          // 1690
                return "undefined";                                                                                    // 1691
            }                                                                                                          // 1692
            var string = Object.prototype.toString.call(value);                                                        // 1693
            return string.substring(8, string.length - 1).toLowerCase();                                               // 1694
        };                                                                                                             // 1695
                                                                                                                       // 1696
        sinon.typeOf = typeOf;                                                                                         // 1697
        return sinon.typeOf;                                                                                           // 1698
    }                                                                                                                  // 1699
                                                                                                                       // 1700
    function loadDependencies(require, exports, module) {                                                              // 1701
        var sinon = require("./util/core");                                                                            // 1702
        module.exports = makeApi(sinon);                                                                               // 1703
    }                                                                                                                  // 1704
                                                                                                                       // 1705
    var isNode = typeof module !== "undefined" && module.exports && typeof require == "function";                      // 1706
    var isAMD = typeof define === "function" && typeof define.amd === "object" && define.amd;                          // 1707
                                                                                                                       // 1708
    if (isAMD) {                                                                                                       // 1709
        define(loadDependencies);                                                                                      // 1710
    } else if (isNode) {                                                                                               // 1711
        loadDependencies(require, module.exports, module);                                                             // 1712
    } else if (!sinon) {                                                                                               // 1713
        return;                                                                                                        // 1714
    } else {                                                                                                           // 1715
        makeApi(sinon);                                                                                                // 1716
    }                                                                                                                  // 1717
}(                                                                                                                     // 1718
    (typeof sinon == "object" && sinon || null),                                                                       // 1719
    (typeof formatio == "object" && formatio)                                                                          // 1720
));                                                                                                                    // 1721
                                                                                                                       // 1722
/**                                                                                                                    // 1723
 * @depend util/core.js                                                                                                // 1724
 * @depend typeOf.js                                                                                                   // 1725
 */                                                                                                                    // 1726
/*jslint eqeqeq: false, onevar: false, plusplus: false*/                                                               // 1727
/*global module, require, sinon*/                                                                                      // 1728
/**                                                                                                                    // 1729
 * Match functions                                                                                                     // 1730
 *                                                                                                                     // 1731
 * @author Maximilian Antoni (mail@maxantoni.de)                                                                       // 1732
 * @license BSD                                                                                                        // 1733
 *                                                                                                                     // 1734
 * Copyright (c) 2012 Maximilian Antoni                                                                                // 1735
 */                                                                                                                    // 1736
                                                                                                                       // 1737
(function (sinon) {                                                                                                    // 1738
    function makeApi(sinon) {                                                                                          // 1739
        function assertType(value, type, name) {                                                                       // 1740
            var actual = sinon.typeOf(value);                                                                          // 1741
            if (actual !== type) {                                                                                     // 1742
                throw new TypeError("Expected type of " + name + " to be " +                                           // 1743
                    type + ", but was " + actual);                                                                     // 1744
            }                                                                                                          // 1745
        }                                                                                                              // 1746
                                                                                                                       // 1747
        var matcher = {                                                                                                // 1748
            toString: function () {                                                                                    // 1749
                return this.message;                                                                                   // 1750
            }                                                                                                          // 1751
        };                                                                                                             // 1752
                                                                                                                       // 1753
        function isMatcher(object) {                                                                                   // 1754
            return matcher.isPrototypeOf(object);                                                                      // 1755
        }                                                                                                              // 1756
                                                                                                                       // 1757
        function matchObject(expectation, actual) {                                                                    // 1758
            if (actual === null || actual === undefined) {                                                             // 1759
                return false;                                                                                          // 1760
            }                                                                                                          // 1761
            for (var key in expectation) {                                                                             // 1762
                if (expectation.hasOwnProperty(key)) {                                                                 // 1763
                    var exp = expectation[key];                                                                        // 1764
                    var act = actual[key];                                                                             // 1765
                    if (match.isMatcher(exp)) {                                                                        // 1766
                        if (!exp.test(act)) {                                                                          // 1767
                            return false;                                                                              // 1768
                        }                                                                                              // 1769
                    } else if (sinon.typeOf(exp) === "object") {                                                       // 1770
                        if (!matchObject(exp, act)) {                                                                  // 1771
                            return false;                                                                              // 1772
                        }                                                                                              // 1773
                    } else if (!sinon.deepEqual(exp, act)) {                                                           // 1774
                        return false;                                                                                  // 1775
                    }                                                                                                  // 1776
                }                                                                                                      // 1777
            }                                                                                                          // 1778
            return true;                                                                                               // 1779
        }                                                                                                              // 1780
                                                                                                                       // 1781
        matcher.or = function (m2) {                                                                                   // 1782
            if (!arguments.length) {                                                                                   // 1783
                throw new TypeError("Matcher expected");                                                               // 1784
            } else if (!isMatcher(m2)) {                                                                               // 1785
                m2 = match(m2);                                                                                        // 1786
            }                                                                                                          // 1787
            var m1 = this;                                                                                             // 1788
            var or = sinon.create(matcher);                                                                            // 1789
            or.test = function (actual) {                                                                              // 1790
                return m1.test(actual) || m2.test(actual);                                                             // 1791
            };                                                                                                         // 1792
            or.message = m1.message + ".or(" + m2.message + ")";                                                       // 1793
            return or;                                                                                                 // 1794
        };                                                                                                             // 1795
                                                                                                                       // 1796
        matcher.and = function (m2) {                                                                                  // 1797
            if (!arguments.length) {                                                                                   // 1798
                throw new TypeError("Matcher expected");                                                               // 1799
            } else if (!isMatcher(m2)) {                                                                               // 1800
                m2 = match(m2);                                                                                        // 1801
            }                                                                                                          // 1802
            var m1 = this;                                                                                             // 1803
            var and = sinon.create(matcher);                                                                           // 1804
            and.test = function (actual) {                                                                             // 1805
                return m1.test(actual) && m2.test(actual);                                                             // 1806
            };                                                                                                         // 1807
            and.message = m1.message + ".and(" + m2.message + ")";                                                     // 1808
            return and;                                                                                                // 1809
        };                                                                                                             // 1810
                                                                                                                       // 1811
        var match = function (expectation, message) {                                                                  // 1812
            var m = sinon.create(matcher);                                                                             // 1813
            var type = sinon.typeOf(expectation);                                                                      // 1814
            switch (type) {                                                                                            // 1815
            case "object":                                                                                             // 1816
                if (typeof expectation.test === "function") {                                                          // 1817
                    m.test = function (actual) {                                                                       // 1818
                        return expectation.test(actual) === true;                                                      // 1819
                    };                                                                                                 // 1820
                    m.message = "match(" + sinon.functionName(expectation.test) + ")";                                 // 1821
                    return m;                                                                                          // 1822
                }                                                                                                      // 1823
                var str = [];                                                                                          // 1824
                for (var key in expectation) {                                                                         // 1825
                    if (expectation.hasOwnProperty(key)) {                                                             // 1826
                        str.push(key + ": " + expectation[key]);                                                       // 1827
                    }                                                                                                  // 1828
                }                                                                                                      // 1829
                m.test = function (actual) {                                                                           // 1830
                    return matchObject(expectation, actual);                                                           // 1831
                };                                                                                                     // 1832
                m.message = "match(" + str.join(", ") + ")";                                                           // 1833
                break;                                                                                                 // 1834
            case "number":                                                                                             // 1835
                m.test = function (actual) {                                                                           // 1836
                    return expectation == actual;                                                                      // 1837
                };                                                                                                     // 1838
                break;                                                                                                 // 1839
            case "string":                                                                                             // 1840
                m.test = function (actual) {                                                                           // 1841
                    if (typeof actual !== "string") {                                                                  // 1842
                        return false;                                                                                  // 1843
                    }                                                                                                  // 1844
                    return actual.indexOf(expectation) !== -1;                                                         // 1845
                };                                                                                                     // 1846
                m.message = "match(\"" + expectation + "\")";                                                          // 1847
                break;                                                                                                 // 1848
            case "regexp":                                                                                             // 1849
                m.test = function (actual) {                                                                           // 1850
                    if (typeof actual !== "string") {                                                                  // 1851
                        return false;                                                                                  // 1852
                    }                                                                                                  // 1853
                    return expectation.test(actual);                                                                   // 1854
                };                                                                                                     // 1855
                break;                                                                                                 // 1856
            case "function":                                                                                           // 1857
                m.test = expectation;                                                                                  // 1858
                if (message) {                                                                                         // 1859
                    m.message = message;                                                                               // 1860
                } else {                                                                                               // 1861
                    m.message = "match(" + sinon.functionName(expectation) + ")";                                      // 1862
                }                                                                                                      // 1863
                break;                                                                                                 // 1864
            default:                                                                                                   // 1865
                m.test = function (actual) {                                                                           // 1866
                    return sinon.deepEqual(expectation, actual);                                                       // 1867
                };                                                                                                     // 1868
            }                                                                                                          // 1869
            if (!m.message) {                                                                                          // 1870
                m.message = "match(" + expectation + ")";                                                              // 1871
            }                                                                                                          // 1872
            return m;                                                                                                  // 1873
        };                                                                                                             // 1874
                                                                                                                       // 1875
        match.isMatcher = isMatcher;                                                                                   // 1876
                                                                                                                       // 1877
        match.any = match(function () {                                                                                // 1878
            return true;                                                                                               // 1879
        }, "any");                                                                                                     // 1880
                                                                                                                       // 1881
        match.defined = match(function (actual) {                                                                      // 1882
            return actual !== null && actual !== undefined;                                                            // 1883
        }, "defined");                                                                                                 // 1884
                                                                                                                       // 1885
        match.truthy = match(function (actual) {                                                                       // 1886
            return !!actual;                                                                                           // 1887
        }, "truthy");                                                                                                  // 1888
                                                                                                                       // 1889
        match.falsy = match(function (actual) {                                                                        // 1890
            return !actual;                                                                                            // 1891
        }, "falsy");                                                                                                   // 1892
                                                                                                                       // 1893
        match.same = function (expectation) {                                                                          // 1894
            return match(function (actual) {                                                                           // 1895
                return expectation === actual;                                                                         // 1896
            }, "same(" + expectation + ")");                                                                           // 1897
        };                                                                                                             // 1898
                                                                                                                       // 1899
        match.typeOf = function (type) {                                                                               // 1900
            assertType(type, "string", "type");                                                                        // 1901
            return match(function (actual) {                                                                           // 1902
                return sinon.typeOf(actual) === type;                                                                  // 1903
            }, "typeOf(\"" + type + "\")");                                                                            // 1904
        };                                                                                                             // 1905
                                                                                                                       // 1906
        match.instanceOf = function (type) {                                                                           // 1907
            assertType(type, "function", "type");                                                                      // 1908
            return match(function (actual) {                                                                           // 1909
                return actual instanceof type;                                                                         // 1910
            }, "instanceOf(" + sinon.functionName(type) + ")");                                                        // 1911
        };                                                                                                             // 1912
                                                                                                                       // 1913
        function createPropertyMatcher(propertyTest, messagePrefix) {                                                  // 1914
            return function (property, value) {                                                                        // 1915
                assertType(property, "string", "property");                                                            // 1916
                var onlyProperty = arguments.length === 1;                                                             // 1917
                var message = messagePrefix + "(\"" + property + "\"";                                                 // 1918
                if (!onlyProperty) {                                                                                   // 1919
                    message += ", " + value;                                                                           // 1920
                }                                                                                                      // 1921
                message += ")";                                                                                        // 1922
                return match(function (actual) {                                                                       // 1923
                    if (actual === undefined || actual === null ||                                                     // 1924
                            !propertyTest(actual, property)) {                                                         // 1925
                        return false;                                                                                  // 1926
                    }                                                                                                  // 1927
                    return onlyProperty || sinon.deepEqual(value, actual[property]);                                   // 1928
                }, message);                                                                                           // 1929
            };                                                                                                         // 1930
        }                                                                                                              // 1931
                                                                                                                       // 1932
        match.has = createPropertyMatcher(function (actual, property) {                                                // 1933
            if (typeof actual === "object") {                                                                          // 1934
                return property in actual;                                                                             // 1935
            }                                                                                                          // 1936
            return actual[property] !== undefined;                                                                     // 1937
        }, "has");                                                                                                     // 1938
                                                                                                                       // 1939
        match.hasOwn = createPropertyMatcher(function (actual, property) {                                             // 1940
            return actual.hasOwnProperty(property);                                                                    // 1941
        }, "hasOwn");                                                                                                  // 1942
                                                                                                                       // 1943
        match.bool = match.typeOf("boolean");                                                                          // 1944
        match.number = match.typeOf("number");                                                                         // 1945
        match.string = match.typeOf("string");                                                                         // 1946
        match.object = match.typeOf("object");                                                                         // 1947
        match.func = match.typeOf("function");                                                                         // 1948
        match.array = match.typeOf("array");                                                                           // 1949
        match.regexp = match.typeOf("regexp");                                                                         // 1950
        match.date = match.typeOf("date");                                                                             // 1951
                                                                                                                       // 1952
        sinon.match = match;                                                                                           // 1953
        return match;                                                                                                  // 1954
    }                                                                                                                  // 1955
                                                                                                                       // 1956
    var isNode = typeof module !== "undefined" && module.exports && typeof require == "function";                      // 1957
    var isAMD = typeof define === "function" && typeof define.amd === "object" && define.amd;                          // 1958
                                                                                                                       // 1959
    function loadDependencies(require, exports, module) {                                                              // 1960
        var sinon = require("./util/core");                                                                            // 1961
        require("./typeOf");                                                                                           // 1962
        module.exports = makeApi(sinon);                                                                               // 1963
    }                                                                                                                  // 1964
                                                                                                                       // 1965
    if (isAMD) {                                                                                                       // 1966
        define(loadDependencies);                                                                                      // 1967
    } else if (isNode) {                                                                                               // 1968
        loadDependencies(require, module.exports, module);                                                             // 1969
    } else if (!sinon) {                                                                                               // 1970
        return;                                                                                                        // 1971
    } else {                                                                                                           // 1972
        makeApi(sinon);                                                                                                // 1973
    }                                                                                                                  // 1974
}(typeof sinon == "object" && sinon || null));                                                                         // 1975
                                                                                                                       // 1976
/**                                                                                                                    // 1977
 * @depend util/core.js                                                                                                // 1978
 */                                                                                                                    // 1979
/**                                                                                                                    // 1980
 * Format functions                                                                                                    // 1981
 *                                                                                                                     // 1982
 * @author Christian Johansen (christian@cjohansen.no)                                                                 // 1983
 * @license BSD                                                                                                        // 1984
 *                                                                                                                     // 1985
 * Copyright (c) 2010-2014 Christian Johansen                                                                          // 1986
 */                                                                                                                    // 1987
                                                                                                                       // 1988
(function (sinon, formatio) {                                                                                          // 1989
    function makeApi(sinon) {                                                                                          // 1990
        function valueFormatter(value) {                                                                               // 1991
            return "" + value;                                                                                         // 1992
        }                                                                                                              // 1993
                                                                                                                       // 1994
        function getFormatioFormatter() {                                                                              // 1995
            var formatter = formatio.configure({                                                                       // 1996
                    quoteStrings: false,                                                                               // 1997
                    limitChildrenCount: 250                                                                            // 1998
                });                                                                                                    // 1999
                                                                                                                       // 2000
            function format() {                                                                                        // 2001
                return formatter.ascii.apply(formatter, arguments);                                                    // 2002
            };                                                                                                         // 2003
                                                                                                                       // 2004
            return format;                                                                                             // 2005
        }                                                                                                              // 2006
                                                                                                                       // 2007
        function getNodeFormatter(value) {                                                                             // 2008
            function format(value) {                                                                                   // 2009
                return typeof value == "object" && value.toString === Object.prototype.toString ? util.inspect(value) : value;
            };                                                                                                         // 2011
                                                                                                                       // 2012
            try {                                                                                                      // 2013
                var util = require("util");                                                                            // 2014
            } catch (e) {                                                                                              // 2015
                /* Node, but no util module - would be very old, but better safe than sorry */                         // 2016
            }                                                                                                          // 2017
                                                                                                                       // 2018
            return util ? format : valueFormatter;                                                                     // 2019
        }                                                                                                              // 2020
                                                                                                                       // 2021
        var isNode = typeof module !== "undefined" && module.exports && typeof require == "function",                  // 2022
            formatter;                                                                                                 // 2023
                                                                                                                       // 2024
        if (isNode) {                                                                                                  // 2025
            try {                                                                                                      // 2026
                formatio = require("formatio");                                                                        // 2027
            } catch (e) {}                                                                                             // 2028
        }                                                                                                              // 2029
                                                                                                                       // 2030
        if (formatio) {                                                                                                // 2031
            formatter = getFormatioFormatter()                                                                         // 2032
        } else if (isNode) {                                                                                           // 2033
            formatter = getNodeFormatter();                                                                            // 2034
        } else {                                                                                                       // 2035
            formatter = valueFormatter;                                                                                // 2036
        }                                                                                                              // 2037
                                                                                                                       // 2038
        sinon.format = formatter;                                                                                      // 2039
        return sinon.format;                                                                                           // 2040
    }                                                                                                                  // 2041
                                                                                                                       // 2042
    function loadDependencies(require, exports, module) {                                                              // 2043
        var sinon = require("./util/core");                                                                            // 2044
        module.exports = makeApi(sinon);                                                                               // 2045
    }                                                                                                                  // 2046
                                                                                                                       // 2047
    var isNode = typeof module !== "undefined" && module.exports && typeof require == "function";                      // 2048
    var isAMD = typeof define === "function" && typeof define.amd === "object" && define.amd;                          // 2049
                                                                                                                       // 2050
    if (isAMD) {                                                                                                       // 2051
        define(loadDependencies);                                                                                      // 2052
    } else if (isNode) {                                                                                               // 2053
        loadDependencies(require, module.exports, module);                                                             // 2054
    } else if (!sinon) {                                                                                               // 2055
        return;                                                                                                        // 2056
    } else {                                                                                                           // 2057
        makeApi(sinon);                                                                                                // 2058
    }                                                                                                                  // 2059
}(                                                                                                                     // 2060
    (typeof sinon == "object" && sinon || null),                                                                       // 2061
    (typeof formatio == "object" && formatio)                                                                          // 2062
));                                                                                                                    // 2063
                                                                                                                       // 2064
/**                                                                                                                    // 2065
  * @depend util/core.js                                                                                               // 2066
  * @depend match.js                                                                                                   // 2067
  * @depend format.js                                                                                                  // 2068
  */                                                                                                                   // 2069
/**                                                                                                                    // 2070
  * Spy calls                                                                                                          // 2071
  *                                                                                                                    // 2072
  * @author Christian Johansen (christian@cjohansen.no)                                                                // 2073
  * @author Maximilian Antoni (mail@maxantoni.de)                                                                      // 2074
  * @license BSD                                                                                                       // 2075
  *                                                                                                                    // 2076
  * Copyright (c) 2010-2013 Christian Johansen                                                                         // 2077
  * Copyright (c) 2013 Maximilian Antoni                                                                               // 2078
  */                                                                                                                   // 2079
                                                                                                                       // 2080
(function (sinon) {                                                                                                    // 2081
    function makeApi(sinon) {                                                                                          // 2082
        function throwYieldError(proxy, text, args) {                                                                  // 2083
            var msg = sinon.functionName(proxy) + text;                                                                // 2084
            if (args.length) {                                                                                         // 2085
                msg += " Received [" + slice.call(args).join(", ") + "]";                                              // 2086
            }                                                                                                          // 2087
            throw new Error(msg);                                                                                      // 2088
        }                                                                                                              // 2089
                                                                                                                       // 2090
        var slice = Array.prototype.slice;                                                                             // 2091
                                                                                                                       // 2092
        var callProto = {                                                                                              // 2093
            calledOn: function calledOn(thisValue) {                                                                   // 2094
                if (sinon.match && sinon.match.isMatcher(thisValue)) {                                                 // 2095
                    return thisValue.test(this.thisValue);                                                             // 2096
                }                                                                                                      // 2097
                return this.thisValue === thisValue;                                                                   // 2098
            },                                                                                                         // 2099
                                                                                                                       // 2100
            calledWith: function calledWith() {                                                                        // 2101
                var l = arguments.length;                                                                              // 2102
                if (l > this.args.length) {                                                                            // 2103
                    return false;                                                                                      // 2104
                }                                                                                                      // 2105
                for (var i = 0; i < l; i += 1) {                                                                       // 2106
                    if (!sinon.deepEqual(arguments[i], this.args[i])) {                                                // 2107
                        return false;                                                                                  // 2108
                    }                                                                                                  // 2109
                }                                                                                                      // 2110
                                                                                                                       // 2111
                return true;                                                                                           // 2112
            },                                                                                                         // 2113
                                                                                                                       // 2114
            calledWithMatch: function calledWithMatch() {                                                              // 2115
                var l = arguments.length;                                                                              // 2116
                if (l > this.args.length) {                                                                            // 2117
                    return false;                                                                                      // 2118
                }                                                                                                      // 2119
                for (var i = 0; i < l; i += 1) {                                                                       // 2120
                    var actual = this.args[i];                                                                         // 2121
                    var expectation = arguments[i];                                                                    // 2122
                    if (!sinon.match || !sinon.match(expectation).test(actual)) {                                      // 2123
                        return false;                                                                                  // 2124
                    }                                                                                                  // 2125
                }                                                                                                      // 2126
                return true;                                                                                           // 2127
            },                                                                                                         // 2128
                                                                                                                       // 2129
            calledWithExactly: function calledWithExactly() {                                                          // 2130
                return arguments.length == this.args.length &&                                                         // 2131
                    this.calledWith.apply(this, arguments);                                                            // 2132
            },                                                                                                         // 2133
                                                                                                                       // 2134
            notCalledWith: function notCalledWith() {                                                                  // 2135
                return !this.calledWith.apply(this, arguments);                                                        // 2136
            },                                                                                                         // 2137
                                                                                                                       // 2138
            notCalledWithMatch: function notCalledWithMatch() {                                                        // 2139
                return !this.calledWithMatch.apply(this, arguments);                                                   // 2140
            },                                                                                                         // 2141
                                                                                                                       // 2142
            returned: function returned(value) {                                                                       // 2143
                return sinon.deepEqual(value, this.returnValue);                                                       // 2144
            },                                                                                                         // 2145
                                                                                                                       // 2146
            threw: function threw(error) {                                                                             // 2147
                if (typeof error === "undefined" || !this.exception) {                                                 // 2148
                    return !!this.exception;                                                                           // 2149
                }                                                                                                      // 2150
                                                                                                                       // 2151
                return this.exception === error || this.exception.name === error;                                      // 2152
            },                                                                                                         // 2153
                                                                                                                       // 2154
            calledWithNew: function calledWithNew() {                                                                  // 2155
                return this.proxy.prototype && this.thisValue instanceof this.proxy;                                   // 2156
            },                                                                                                         // 2157
                                                                                                                       // 2158
            calledBefore: function (other) {                                                                           // 2159
                return this.callId < other.callId;                                                                     // 2160
            },                                                                                                         // 2161
                                                                                                                       // 2162
            calledAfter: function (other) {                                                                            // 2163
                return this.callId > other.callId;                                                                     // 2164
            },                                                                                                         // 2165
                                                                                                                       // 2166
            callArg: function (pos) {                                                                                  // 2167
                this.args[pos]();                                                                                      // 2168
            },                                                                                                         // 2169
                                                                                                                       // 2170
            callArgOn: function (pos, thisValue) {                                                                     // 2171
                this.args[pos].apply(thisValue);                                                                       // 2172
            },                                                                                                         // 2173
                                                                                                                       // 2174
            callArgWith: function (pos) {                                                                              // 2175
                this.callArgOnWith.apply(this, [pos, null].concat(slice.call(arguments, 1)));                          // 2176
            },                                                                                                         // 2177
                                                                                                                       // 2178
            callArgOnWith: function (pos, thisValue) {                                                                 // 2179
                var args = slice.call(arguments, 2);                                                                   // 2180
                this.args[pos].apply(thisValue, args);                                                                 // 2181
            },                                                                                                         // 2182
                                                                                                                       // 2183
            yield: function () {                                                                                       // 2184
                this.yieldOn.apply(this, [null].concat(slice.call(arguments, 0)));                                     // 2185
            },                                                                                                         // 2186
                                                                                                                       // 2187
            yieldOn: function (thisValue) {                                                                            // 2188
                var args = this.args;                                                                                  // 2189
                for (var i = 0, l = args.length; i < l; ++i) {                                                         // 2190
                    if (typeof args[i] === "function") {                                                               // 2191
                        args[i].apply(thisValue, slice.call(arguments, 1));                                            // 2192
                        return;                                                                                        // 2193
                    }                                                                                                  // 2194
                }                                                                                                      // 2195
                throwYieldError(this.proxy, " cannot yield since no callback was passed.", args);                      // 2196
            },                                                                                                         // 2197
                                                                                                                       // 2198
            yieldTo: function (prop) {                                                                                 // 2199
                this.yieldToOn.apply(this, [prop, null].concat(slice.call(arguments, 1)));                             // 2200
            },                                                                                                         // 2201
                                                                                                                       // 2202
            yieldToOn: function (prop, thisValue) {                                                                    // 2203
                var args = this.args;                                                                                  // 2204
                for (var i = 0, l = args.length; i < l; ++i) {                                                         // 2205
                    if (args[i] && typeof args[i][prop] === "function") {                                              // 2206
                        args[i][prop].apply(thisValue, slice.call(arguments, 2));                                      // 2207
                        return;                                                                                        // 2208
                    }                                                                                                  // 2209
                }                                                                                                      // 2210
                throwYieldError(this.proxy, " cannot yield to '" + prop +                                              // 2211
                    "' since no callback was passed.", args);                                                          // 2212
            },                                                                                                         // 2213
                                                                                                                       // 2214
            toString: function () {                                                                                    // 2215
                var callStr = this.proxy.toString() + "(";                                                             // 2216
                var args = [];                                                                                         // 2217
                                                                                                                       // 2218
                for (var i = 0, l = this.args.length; i < l; ++i) {                                                    // 2219
                    args.push(sinon.format(this.args[i]));                                                             // 2220
                }                                                                                                      // 2221
                                                                                                                       // 2222
                callStr = callStr + args.join(", ") + ")";                                                             // 2223
                                                                                                                       // 2224
                if (typeof this.returnValue != "undefined") {                                                          // 2225
                    callStr += " => " + sinon.format(this.returnValue);                                                // 2226
                }                                                                                                      // 2227
                                                                                                                       // 2228
                if (this.exception) {                                                                                  // 2229
                    callStr += " !" + this.exception.name;                                                             // 2230
                                                                                                                       // 2231
                    if (this.exception.message) {                                                                      // 2232
                        callStr += "(" + this.exception.message + ")";                                                 // 2233
                    }                                                                                                  // 2234
                }                                                                                                      // 2235
                                                                                                                       // 2236
                return callStr;                                                                                        // 2237
            }                                                                                                          // 2238
        };                                                                                                             // 2239
                                                                                                                       // 2240
        callProto.invokeCallback = callProto.yield;                                                                    // 2241
                                                                                                                       // 2242
        function createSpyCall(spy, thisValue, args, returnValue, exception, id) {                                     // 2243
            if (typeof id !== "number") {                                                                              // 2244
                throw new TypeError("Call id is not a number");                                                        // 2245
            }                                                                                                          // 2246
            var proxyCall = sinon.create(callProto);                                                                   // 2247
            proxyCall.proxy = spy;                                                                                     // 2248
            proxyCall.thisValue = thisValue;                                                                           // 2249
            proxyCall.args = args;                                                                                     // 2250
            proxyCall.returnValue = returnValue;                                                                       // 2251
            proxyCall.exception = exception;                                                                           // 2252
            proxyCall.callId = id;                                                                                     // 2253
                                                                                                                       // 2254
            return proxyCall;                                                                                          // 2255
        }                                                                                                              // 2256
        createSpyCall.toString = callProto.toString; // used by mocks                                                  // 2257
                                                                                                                       // 2258
        sinon.spyCall = createSpyCall;                                                                                 // 2259
        return createSpyCall;                                                                                          // 2260
    }                                                                                                                  // 2261
                                                                                                                       // 2262
    var isNode = typeof module !== "undefined" && module.exports && typeof require == "function";                      // 2263
    var isAMD = typeof define === "function" && typeof define.amd === "object" && define.amd;                          // 2264
                                                                                                                       // 2265
    function loadDependencies(require, exports, module) {                                                              // 2266
        var sinon = require("./util/core");                                                                            // 2267
        require("./match");                                                                                            // 2268
        require("./format");                                                                                           // 2269
        module.exports = makeApi(sinon);                                                                               // 2270
    }                                                                                                                  // 2271
                                                                                                                       // 2272
    if (isAMD) {                                                                                                       // 2273
        define(loadDependencies);                                                                                      // 2274
    } else if (isNode) {                                                                                               // 2275
        loadDependencies(require, module.exports, module);                                                             // 2276
    } else if (!sinon) {                                                                                               // 2277
        return;                                                                                                        // 2278
    } else {                                                                                                           // 2279
        makeApi(sinon);                                                                                                // 2280
    }                                                                                                                  // 2281
}(typeof sinon == "object" && sinon || null));                                                                         // 2282
                                                                                                                       // 2283
/**                                                                                                                    // 2284
  * @depend times_in_words.js                                                                                          // 2285
  * @depend util/core.js                                                                                               // 2286
  * @depend extend.js                                                                                                  // 2287
  * @depend call.js                                                                                                    // 2288
  * @depend format.js                                                                                                  // 2289
  */                                                                                                                   // 2290
/**                                                                                                                    // 2291
  * Spy functions                                                                                                      // 2292
  *                                                                                                                    // 2293
  * @author Christian Johansen (christian@cjohansen.no)                                                                // 2294
  * @license BSD                                                                                                       // 2295
  *                                                                                                                    // 2296
  * Copyright (c) 2010-2013 Christian Johansen                                                                         // 2297
  */                                                                                                                   // 2298
                                                                                                                       // 2299
(function (sinon) {                                                                                                    // 2300
                                                                                                                       // 2301
    function makeApi(sinon) {                                                                                          // 2302
        var push = Array.prototype.push;                                                                               // 2303
        var slice = Array.prototype.slice;                                                                             // 2304
        var callId = 0;                                                                                                // 2305
                                                                                                                       // 2306
        function spy(object, property, types) {                                                                        // 2307
            if (!property && typeof object == "function") {                                                            // 2308
                return spy.create(object);                                                                             // 2309
            }                                                                                                          // 2310
                                                                                                                       // 2311
            if (!object && !property) {                                                                                // 2312
                return spy.create(function () { });                                                                    // 2313
            }                                                                                                          // 2314
                                                                                                                       // 2315
            if (types) {                                                                                               // 2316
                var methodDesc = sinon.getPropertyDescriptor(object, property);                                        // 2317
                for (var i = 0; i < types.length; i++) {                                                               // 2318
                    methodDesc[types[i]] = spy.create(methodDesc[types[i]]);                                           // 2319
                }                                                                                                      // 2320
                return sinon.wrapMethod(object, property, methodDesc);                                                 // 2321
            } else {                                                                                                   // 2322
                var method = object[property];                                                                         // 2323
                return sinon.wrapMethod(object, property, spy.create(method));                                         // 2324
            }                                                                                                          // 2325
        }                                                                                                              // 2326
                                                                                                                       // 2327
        function matchingFake(fakes, args, strict) {                                                                   // 2328
            if (!fakes) {                                                                                              // 2329
                return;                                                                                                // 2330
            }                                                                                                          // 2331
                                                                                                                       // 2332
            for (var i = 0, l = fakes.length; i < l; i++) {                                                            // 2333
                if (fakes[i].matches(args, strict)) {                                                                  // 2334
                    return fakes[i];                                                                                   // 2335
                }                                                                                                      // 2336
            }                                                                                                          // 2337
        }                                                                                                              // 2338
                                                                                                                       // 2339
        function incrementCallCount() {                                                                                // 2340
            this.called = true;                                                                                        // 2341
            this.callCount += 1;                                                                                       // 2342
            this.notCalled = false;                                                                                    // 2343
            this.calledOnce = this.callCount == 1;                                                                     // 2344
            this.calledTwice = this.callCount == 2;                                                                    // 2345
            this.calledThrice = this.callCount == 3;                                                                   // 2346
        }                                                                                                              // 2347
                                                                                                                       // 2348
        function createCallProperties() {                                                                              // 2349
            this.firstCall = this.getCall(0);                                                                          // 2350
            this.secondCall = this.getCall(1);                                                                         // 2351
            this.thirdCall = this.getCall(2);                                                                          // 2352
            this.lastCall = this.getCall(this.callCount - 1);                                                          // 2353
        }                                                                                                              // 2354
                                                                                                                       // 2355
        var vars = "a,b,c,d,e,f,g,h,i,j,k,l";                                                                          // 2356
        function createProxy(func, proxyLength) {                                                                      // 2357
            // Retain the function length:                                                                             // 2358
            var p;                                                                                                     // 2359
            if (proxyLength) {                                                                                         // 2360
                eval("p = (function proxy(" + vars.substring(0, proxyLength * 2 - 1) +                                 // 2361
                    ") { return p.invoke(func, this, slice.call(arguments)); });");                                    // 2362
            } else {                                                                                                   // 2363
                p = function proxy() {                                                                                 // 2364
                    return p.invoke(func, this, slice.call(arguments));                                                // 2365
                };                                                                                                     // 2366
            }                                                                                                          // 2367
            return p;                                                                                                  // 2368
        }                                                                                                              // 2369
                                                                                                                       // 2370
        var uuid = 0;                                                                                                  // 2371
                                                                                                                       // 2372
        // Public API                                                                                                  // 2373
        var spyApi = {                                                                                                 // 2374
            reset: function () {                                                                                       // 2375
                if (this.invoking) {                                                                                   // 2376
                    var err = new Error("Cannot reset Sinon function while invoking it. " +                            // 2377
                                        "Move the call to .reset outside of the callback.");                           // 2378
                    err.name = "InvalidResetException";                                                                // 2379
                    throw err;                                                                                         // 2380
                }                                                                                                      // 2381
                                                                                                                       // 2382
                this.called = false;                                                                                   // 2383
                this.notCalled = true;                                                                                 // 2384
                this.calledOnce = false;                                                                               // 2385
                this.calledTwice = false;                                                                              // 2386
                this.calledThrice = false;                                                                             // 2387
                this.callCount = 0;                                                                                    // 2388
                this.firstCall = null;                                                                                 // 2389
                this.secondCall = null;                                                                                // 2390
                this.thirdCall = null;                                                                                 // 2391
                this.lastCall = null;                                                                                  // 2392
                this.args = [];                                                                                        // 2393
                this.returnValues = [];                                                                                // 2394
                this.thisValues = [];                                                                                  // 2395
                this.exceptions = [];                                                                                  // 2396
                this.callIds = [];                                                                                     // 2397
                if (this.fakes) {                                                                                      // 2398
                    for (var i = 0; i < this.fakes.length; i++) {                                                      // 2399
                        this.fakes[i].reset();                                                                         // 2400
                    }                                                                                                  // 2401
                }                                                                                                      // 2402
                                                                                                                       // 2403
                return this;                                                                                           // 2404
            },                                                                                                         // 2405
                                                                                                                       // 2406
            create: function create(func, spyLength) {                                                                 // 2407
                var name;                                                                                              // 2408
                                                                                                                       // 2409
                if (typeof func != "function") {                                                                       // 2410
                    func = function () { };                                                                            // 2411
                } else {                                                                                               // 2412
                    name = sinon.functionName(func);                                                                   // 2413
                }                                                                                                      // 2414
                                                                                                                       // 2415
                if (!spyLength) {                                                                                      // 2416
                    spyLength = func.length;                                                                           // 2417
                }                                                                                                      // 2418
                                                                                                                       // 2419
                var proxy = createProxy(func, spyLength);                                                              // 2420
                                                                                                                       // 2421
                sinon.extend(proxy, spy);                                                                              // 2422
                delete proxy.create;                                                                                   // 2423
                sinon.extend(proxy, func);                                                                             // 2424
                                                                                                                       // 2425
                proxy.reset();                                                                                         // 2426
                proxy.prototype = func.prototype;                                                                      // 2427
                proxy.displayName = name || "spy";                                                                     // 2428
                proxy.toString = sinon.functionToString;                                                               // 2429
                proxy.instantiateFake = sinon.spy.create;                                                              // 2430
                proxy.id = "spy#" + uuid++;                                                                            // 2431
                                                                                                                       // 2432
                return proxy;                                                                                          // 2433
            },                                                                                                         // 2434
                                                                                                                       // 2435
            invoke: function invoke(func, thisValue, args) {                                                           // 2436
                var matching = matchingFake(this.fakes, args);                                                         // 2437
                var exception, returnValue;                                                                            // 2438
                                                                                                                       // 2439
                incrementCallCount.call(this);                                                                         // 2440
                push.call(this.thisValues, thisValue);                                                                 // 2441
                push.call(this.args, args);                                                                            // 2442
                push.call(this.callIds, callId++);                                                                     // 2443
                                                                                                                       // 2444
                // Make call properties available from within the spied function:                                      // 2445
                createCallProperties.call(this);                                                                       // 2446
                                                                                                                       // 2447
                try {                                                                                                  // 2448
                    this.invoking = true;                                                                              // 2449
                                                                                                                       // 2450
                    if (matching) {                                                                                    // 2451
                        returnValue = matching.invoke(func, thisValue, args);                                          // 2452
                    } else {                                                                                           // 2453
                        returnValue = (this.func || func).apply(thisValue, args);                                      // 2454
                    }                                                                                                  // 2455
                                                                                                                       // 2456
                    var thisCall = this.getCall(this.callCount - 1);                                                   // 2457
                    if (thisCall.calledWithNew() && typeof returnValue !== "object") {                                 // 2458
                        returnValue = thisValue;                                                                       // 2459
                    }                                                                                                  // 2460
                } catch (e) {                                                                                          // 2461
                    exception = e;                                                                                     // 2462
                } finally {                                                                                            // 2463
                    delete this.invoking;                                                                              // 2464
                }                                                                                                      // 2465
                                                                                                                       // 2466
                push.call(this.exceptions, exception);                                                                 // 2467
                push.call(this.returnValues, returnValue);                                                             // 2468
                                                                                                                       // 2469
                // Make return value and exception available in the calls:                                             // 2470
                createCallProperties.call(this);                                                                       // 2471
                                                                                                                       // 2472
                if (exception !== undefined) {                                                                         // 2473
                    throw exception;                                                                                   // 2474
                }                                                                                                      // 2475
                                                                                                                       // 2476
                return returnValue;                                                                                    // 2477
            },                                                                                                         // 2478
                                                                                                                       // 2479
            named: function named(name) {                                                                              // 2480
                this.displayName = name;                                                                               // 2481
                return this;                                                                                           // 2482
            },                                                                                                         // 2483
                                                                                                                       // 2484
            getCall: function getCall(i) {                                                                             // 2485
                if (i < 0 || i >= this.callCount) {                                                                    // 2486
                    return null;                                                                                       // 2487
                }                                                                                                      // 2488
                                                                                                                       // 2489
                return sinon.spyCall(this, this.thisValues[i], this.args[i],                                           // 2490
                                        this.returnValues[i], this.exceptions[i],                                      // 2491
                                        this.callIds[i]);                                                              // 2492
            },                                                                                                         // 2493
                                                                                                                       // 2494
            getCalls: function () {                                                                                    // 2495
                var calls = [];                                                                                        // 2496
                var i;                                                                                                 // 2497
                                                                                                                       // 2498
                for (i = 0; i < this.callCount; i++) {                                                                 // 2499
                    calls.push(this.getCall(i));                                                                       // 2500
                }                                                                                                      // 2501
                                                                                                                       // 2502
                return calls;                                                                                          // 2503
            },                                                                                                         // 2504
                                                                                                                       // 2505
            calledBefore: function calledBefore(spyFn) {                                                               // 2506
                if (!this.called) {                                                                                    // 2507
                    return false;                                                                                      // 2508
                }                                                                                                      // 2509
                                                                                                                       // 2510
                if (!spyFn.called) {                                                                                   // 2511
                    return true;                                                                                       // 2512
                }                                                                                                      // 2513
                                                                                                                       // 2514
                return this.callIds[0] < spyFn.callIds[spyFn.callIds.length - 1];                                      // 2515
            },                                                                                                         // 2516
                                                                                                                       // 2517
            calledAfter: function calledAfter(spyFn) {                                                                 // 2518
                if (!this.called || !spyFn.called) {                                                                   // 2519
                    return false;                                                                                      // 2520
                }                                                                                                      // 2521
                                                                                                                       // 2522
                return this.callIds[this.callCount - 1] > spyFn.callIds[spyFn.callCount - 1];                          // 2523
            },                                                                                                         // 2524
                                                                                                                       // 2525
            withArgs: function () {                                                                                    // 2526
                var args = slice.call(arguments);                                                                      // 2527
                                                                                                                       // 2528
                if (this.fakes) {                                                                                      // 2529
                    var match = matchingFake(this.fakes, args, true);                                                  // 2530
                                                                                                                       // 2531
                    if (match) {                                                                                       // 2532
                        return match;                                                                                  // 2533
                    }                                                                                                  // 2534
                } else {                                                                                               // 2535
                    this.fakes = [];                                                                                   // 2536
                }                                                                                                      // 2537
                                                                                                                       // 2538
                var original = this;                                                                                   // 2539
                var fake = this.instantiateFake();                                                                     // 2540
                fake.matchingAguments = args;                                                                          // 2541
                fake.parent = this;                                                                                    // 2542
                push.call(this.fakes, fake);                                                                           // 2543
                                                                                                                       // 2544
                fake.withArgs = function () {                                                                          // 2545
                    return original.withArgs.apply(original, arguments);                                               // 2546
                };                                                                                                     // 2547
                                                                                                                       // 2548
                for (var i = 0; i < this.args.length; i++) {                                                           // 2549
                    if (fake.matches(this.args[i])) {                                                                  // 2550
                        incrementCallCount.call(fake);                                                                 // 2551
                        push.call(fake.thisValues, this.thisValues[i]);                                                // 2552
                        push.call(fake.args, this.args[i]);                                                            // 2553
                        push.call(fake.returnValues, this.returnValues[i]);                                            // 2554
                        push.call(fake.exceptions, this.exceptions[i]);                                                // 2555
                        push.call(fake.callIds, this.callIds[i]);                                                      // 2556
                    }                                                                                                  // 2557
                }                                                                                                      // 2558
                createCallProperties.call(fake);                                                                       // 2559
                                                                                                                       // 2560
                return fake;                                                                                           // 2561
            },                                                                                                         // 2562
                                                                                                                       // 2563
            matches: function (args, strict) {                                                                         // 2564
                var margs = this.matchingAguments;                                                                     // 2565
                                                                                                                       // 2566
                if (margs.length <= args.length &&                                                                     // 2567
                    sinon.deepEqual(margs, args.slice(0, margs.length))) {                                             // 2568
                    return !strict || margs.length == args.length;                                                     // 2569
                }                                                                                                      // 2570
            },                                                                                                         // 2571
                                                                                                                       // 2572
            printf: function (format) {                                                                                // 2573
                var spy = this;                                                                                        // 2574
                var args = slice.call(arguments, 1);                                                                   // 2575
                var formatter;                                                                                         // 2576
                                                                                                                       // 2577
                return (format || "").replace(/%(.)/g, function (match, specifyer) {                                   // 2578
                    formatter = spyApi.formatters[specifyer];                                                          // 2579
                                                                                                                       // 2580
                    if (typeof formatter == "function") {                                                              // 2581
                        return formatter.call(null, spy, args);                                                        // 2582
                    } else if (!isNaN(parseInt(specifyer, 10))) {                                                      // 2583
                        return sinon.format(args[specifyer - 1]);                                                      // 2584
                    }                                                                                                  // 2585
                                                                                                                       // 2586
                    return "%" + specifyer;                                                                            // 2587
                });                                                                                                    // 2588
            }                                                                                                          // 2589
        };                                                                                                             // 2590
                                                                                                                       // 2591
        function delegateToCalls(method, matchAny, actual, notCalled) {                                                // 2592
            spyApi[method] = function () {                                                                             // 2593
                if (!this.called) {                                                                                    // 2594
                    if (notCalled) {                                                                                   // 2595
                        return notCalled.apply(this, arguments);                                                       // 2596
                    }                                                                                                  // 2597
                    return false;                                                                                      // 2598
                }                                                                                                      // 2599
                                                                                                                       // 2600
                var currentCall;                                                                                       // 2601
                var matches = 0;                                                                                       // 2602
                                                                                                                       // 2603
                for (var i = 0, l = this.callCount; i < l; i += 1) {                                                   // 2604
                    currentCall = this.getCall(i);                                                                     // 2605
                                                                                                                       // 2606
                    if (currentCall[actual || method].apply(currentCall, arguments)) {                                 // 2607
                        matches += 1;                                                                                  // 2608
                                                                                                                       // 2609
                        if (matchAny) {                                                                                // 2610
                            return true;                                                                               // 2611
                        }                                                                                              // 2612
                    }                                                                                                  // 2613
                }                                                                                                      // 2614
                                                                                                                       // 2615
                return matches === this.callCount;                                                                     // 2616
            };                                                                                                         // 2617
        }                                                                                                              // 2618
                                                                                                                       // 2619
        delegateToCalls("calledOn", true);                                                                             // 2620
        delegateToCalls("alwaysCalledOn", false, "calledOn");                                                          // 2621
        delegateToCalls("calledWith", true);                                                                           // 2622
        delegateToCalls("calledWithMatch", true);                                                                      // 2623
        delegateToCalls("alwaysCalledWith", false, "calledWith");                                                      // 2624
        delegateToCalls("alwaysCalledWithMatch", false, "calledWithMatch");                                            // 2625
        delegateToCalls("calledWithExactly", true);                                                                    // 2626
        delegateToCalls("alwaysCalledWithExactly", false, "calledWithExactly");                                        // 2627
        delegateToCalls("neverCalledWith", false, "notCalledWith",                                                     // 2628
            function () { return true; });                                                                             // 2629
        delegateToCalls("neverCalledWithMatch", false, "notCalledWithMatch",                                           // 2630
            function () { return true; });                                                                             // 2631
        delegateToCalls("threw", true);                                                                                // 2632
        delegateToCalls("alwaysThrew", false, "threw");                                                                // 2633
        delegateToCalls("returned", true);                                                                             // 2634
        delegateToCalls("alwaysReturned", false, "returned");                                                          // 2635
        delegateToCalls("calledWithNew", true);                                                                        // 2636
        delegateToCalls("alwaysCalledWithNew", false, "calledWithNew");                                                // 2637
        delegateToCalls("callArg", false, "callArgWith", function () {                                                 // 2638
            throw new Error(this.toString() + " cannot call arg since it was not yet invoked.");                       // 2639
        });                                                                                                            // 2640
        spyApi.callArgWith = spyApi.callArg;                                                                           // 2641
        delegateToCalls("callArgOn", false, "callArgOnWith", function () {                                             // 2642
            throw new Error(this.toString() + " cannot call arg since it was not yet invoked.");                       // 2643
        });                                                                                                            // 2644
        spyApi.callArgOnWith = spyApi.callArgOn;                                                                       // 2645
        delegateToCalls("yield", false, "yield", function () {                                                         // 2646
            throw new Error(this.toString() + " cannot yield since it was not yet invoked.");                          // 2647
        });                                                                                                            // 2648
        // "invokeCallback" is an alias for "yield" since "yield" is invalid in strict mode.                           // 2649
        spyApi.invokeCallback = spyApi.yield;                                                                          // 2650
        delegateToCalls("yieldOn", false, "yieldOn", function () {                                                     // 2651
            throw new Error(this.toString() + " cannot yield since it was not yet invoked.");                          // 2652
        });                                                                                                            // 2653
        delegateToCalls("yieldTo", false, "yieldTo", function (property) {                                             // 2654
            throw new Error(this.toString() + " cannot yield to '" + property +                                        // 2655
                "' since it was not yet invoked.");                                                                    // 2656
        });                                                                                                            // 2657
        delegateToCalls("yieldToOn", false, "yieldToOn", function (property) {                                         // 2658
            throw new Error(this.toString() + " cannot yield to '" + property +                                        // 2659
                "' since it was not yet invoked.");                                                                    // 2660
        });                                                                                                            // 2661
                                                                                                                       // 2662
        spyApi.formatters = {                                                                                          // 2663
            c: function (spy) {                                                                                        // 2664
                return sinon.timesInWords(spy.callCount);                                                              // 2665
            },                                                                                                         // 2666
                                                                                                                       // 2667
            n: function (spy) {                                                                                        // 2668
                return spy.toString();                                                                                 // 2669
            },                                                                                                         // 2670
                                                                                                                       // 2671
            C: function (spy) {                                                                                        // 2672
                var calls = [];                                                                                        // 2673
                                                                                                                       // 2674
                for (var i = 0, l = spy.callCount; i < l; ++i) {                                                       // 2675
                    var stringifiedCall = "    " + spy.getCall(i).toString();                                          // 2676
                    if (/\n/.test(calls[i - 1])) {                                                                     // 2677
                        stringifiedCall = "\n" + stringifiedCall;                                                      // 2678
                    }                                                                                                  // 2679
                    push.call(calls, stringifiedCall);                                                                 // 2680
                }                                                                                                      // 2681
                                                                                                                       // 2682
                return calls.length > 0 ? "\n" + calls.join("\n") : "";                                                // 2683
            },                                                                                                         // 2684
                                                                                                                       // 2685
            t: function (spy) {                                                                                        // 2686
                var objects = [];                                                                                      // 2687
                                                                                                                       // 2688
                for (var i = 0, l = spy.callCount; i < l; ++i) {                                                       // 2689
                    push.call(objects, sinon.format(spy.thisValues[i]));                                               // 2690
                }                                                                                                      // 2691
                                                                                                                       // 2692
                return objects.join(", ");                                                                             // 2693
            },                                                                                                         // 2694
                                                                                                                       // 2695
            "*": function (spy, args) {                                                                                // 2696
                var formatted = [];                                                                                    // 2697
                                                                                                                       // 2698
                for (var i = 0, l = args.length; i < l; ++i) {                                                         // 2699
                    push.call(formatted, sinon.format(args[i]));                                                       // 2700
                }                                                                                                      // 2701
                                                                                                                       // 2702
                return formatted.join(", ");                                                                           // 2703
            }                                                                                                          // 2704
        };                                                                                                             // 2705
                                                                                                                       // 2706
        sinon.extend(spy, spyApi);                                                                                     // 2707
                                                                                                                       // 2708
        spy.spyCall = sinon.spyCall;                                                                                   // 2709
        sinon.spy = spy;                                                                                               // 2710
                                                                                                                       // 2711
        return spy;                                                                                                    // 2712
    }                                                                                                                  // 2713
                                                                                                                       // 2714
    var isNode = typeof module !== "undefined" && module.exports && typeof require == "function";                      // 2715
    var isAMD = typeof define === "function" && typeof define.amd === "object" && define.amd;                          // 2716
                                                                                                                       // 2717
    function loadDependencies(require, exports, module) {                                                              // 2718
        var sinon = require("./util/core");                                                                            // 2719
        require("./call");                                                                                             // 2720
        require("./extend");                                                                                           // 2721
        require("./times_in_words");                                                                                   // 2722
        require("./format");                                                                                           // 2723
        module.exports = makeApi(sinon);                                                                               // 2724
    }                                                                                                                  // 2725
                                                                                                                       // 2726
    if (isAMD) {                                                                                                       // 2727
        define(loadDependencies);                                                                                      // 2728
    } else if (isNode) {                                                                                               // 2729
        loadDependencies(require, module.exports, module);                                                             // 2730
    } else if (!sinon) {                                                                                               // 2731
        return;                                                                                                        // 2732
    } else {                                                                                                           // 2733
        makeApi(sinon);                                                                                                // 2734
    }                                                                                                                  // 2735
}(typeof sinon == "object" && sinon || null));                                                                         // 2736
                                                                                                                       // 2737
/**                                                                                                                    // 2738
 * @depend util/core.js                                                                                                // 2739
 * @depend extend.js                                                                                                   // 2740
 */                                                                                                                    // 2741
/**                                                                                                                    // 2742
 * Stub behavior                                                                                                       // 2743
 *                                                                                                                     // 2744
 * @author Christian Johansen (christian@cjohansen.no)                                                                 // 2745
 * @author Tim Fischbach (mail@timfischbach.de)                                                                        // 2746
 * @license BSD                                                                                                        // 2747
 *                                                                                                                     // 2748
 * Copyright (c) 2010-2013 Christian Johansen                                                                          // 2749
 */                                                                                                                    // 2750
                                                                                                                       // 2751
(function (sinon) {                                                                                                    // 2752
    var slice = Array.prototype.slice;                                                                                 // 2753
    var join = Array.prototype.join;                                                                                   // 2754
    var useLeftMostCallback = -1;                                                                                      // 2755
    var useRightMostCallback = -2;                                                                                     // 2756
                                                                                                                       // 2757
    var nextTick = (function () {                                                                                      // 2758
        if (typeof process === "object" && typeof process.nextTick === "function") {                                   // 2759
            return process.nextTick;                                                                                   // 2760
        } else if (typeof setImmediate === "function") {                                                               // 2761
            return setImmediate;                                                                                       // 2762
        } else {                                                                                                       // 2763
            return function (callback) {                                                                               // 2764
                setTimeout(callback, 0);                                                                               // 2765
            };                                                                                                         // 2766
        }                                                                                                              // 2767
    })();                                                                                                              // 2768
                                                                                                                       // 2769
    function throwsException(error, message) {                                                                         // 2770
        if (typeof error == "string") {                                                                                // 2771
            this.exception = new Error(message || "");                                                                 // 2772
            this.exception.name = error;                                                                               // 2773
        } else if (!error) {                                                                                           // 2774
            this.exception = new Error("Error");                                                                       // 2775
        } else {                                                                                                       // 2776
            this.exception = error;                                                                                    // 2777
        }                                                                                                              // 2778
                                                                                                                       // 2779
        return this;                                                                                                   // 2780
    }                                                                                                                  // 2781
                                                                                                                       // 2782
    function getCallback(behavior, args) {                                                                             // 2783
        var callArgAt = behavior.callArgAt;                                                                            // 2784
                                                                                                                       // 2785
        if (callArgAt >= 0) {                                                                                          // 2786
            return args[callArgAt];                                                                                    // 2787
        }                                                                                                              // 2788
                                                                                                                       // 2789
        var argumentList;                                                                                              // 2790
                                                                                                                       // 2791
        if (callArgAt === useLeftMostCallback) {                                                                       // 2792
            argumentList = args;                                                                                       // 2793
        }                                                                                                              // 2794
                                                                                                                       // 2795
        if (callArgAt === useRightMostCallback) {                                                                      // 2796
            argumentList = slice.call(args).reverse();                                                                 // 2797
        }                                                                                                              // 2798
                                                                                                                       // 2799
        var callArgProp = behavior.callArgProp;                                                                        // 2800
                                                                                                                       // 2801
        for (var i = 0, l = argumentList.length; i < l; ++i) {                                                         // 2802
            if (!callArgProp && typeof argumentList[i] == "function") {                                                // 2803
                return argumentList[i];                                                                                // 2804
            }                                                                                                          // 2805
                                                                                                                       // 2806
            if (callArgProp && argumentList[i] &&                                                                      // 2807
                typeof argumentList[i][callArgProp] == "function") {                                                   // 2808
                return argumentList[i][callArgProp];                                                                   // 2809
            }                                                                                                          // 2810
        }                                                                                                              // 2811
                                                                                                                       // 2812
        return null;                                                                                                   // 2813
    }                                                                                                                  // 2814
                                                                                                                       // 2815
    function makeApi(sinon) {                                                                                          // 2816
        function getCallbackError(behavior, func, args) {                                                              // 2817
            if (behavior.callArgAt < 0) {                                                                              // 2818
                var msg;                                                                                               // 2819
                                                                                                                       // 2820
                if (behavior.callArgProp) {                                                                            // 2821
                    msg = sinon.functionName(behavior.stub) +                                                          // 2822
                        " expected to yield to '" + behavior.callArgProp +                                             // 2823
                        "', but no object with such a property was passed.";                                           // 2824
                } else {                                                                                               // 2825
                    msg = sinon.functionName(behavior.stub) +                                                          // 2826
                        " expected to yield, but no callback was passed.";                                             // 2827
                }                                                                                                      // 2828
                                                                                                                       // 2829
                if (args.length > 0) {                                                                                 // 2830
                    msg += " Received [" + join.call(args, ", ") + "]";                                                // 2831
                }                                                                                                      // 2832
                                                                                                                       // 2833
                return msg;                                                                                            // 2834
            }                                                                                                          // 2835
                                                                                                                       // 2836
            return "argument at index " + behavior.callArgAt + " is not a function: " + func;                          // 2837
        }                                                                                                              // 2838
                                                                                                                       // 2839
        function callCallback(behavior, args) {                                                                        // 2840
            if (typeof behavior.callArgAt == "number") {                                                               // 2841
                var func = getCallback(behavior, args);                                                                // 2842
                                                                                                                       // 2843
                if (typeof func != "function") {                                                                       // 2844
                    throw new TypeError(getCallbackError(behavior, func, args));                                       // 2845
                }                                                                                                      // 2846
                                                                                                                       // 2847
                if (behavior.callbackAsync) {                                                                          // 2848
                    nextTick(function () {                                                                             // 2849
                        func.apply(behavior.callbackContext, behavior.callbackArguments);                              // 2850
                    });                                                                                                // 2851
                } else {                                                                                               // 2852
                    func.apply(behavior.callbackContext, behavior.callbackArguments);                                  // 2853
                }                                                                                                      // 2854
            }                                                                                                          // 2855
        }                                                                                                              // 2856
                                                                                                                       // 2857
        var proto = {                                                                                                  // 2858
            create: function create(stub) {                                                                            // 2859
                var behavior = sinon.extend({}, sinon.behavior);                                                       // 2860
                delete behavior.create;                                                                                // 2861
                behavior.stub = stub;                                                                                  // 2862
                                                                                                                       // 2863
                return behavior;                                                                                       // 2864
            },                                                                                                         // 2865
                                                                                                                       // 2866
            isPresent: function isPresent() {                                                                          // 2867
                return (typeof this.callArgAt == "number" ||                                                           // 2868
                        this.exception ||                                                                              // 2869
                        typeof this.returnArgAt == "number" ||                                                         // 2870
                        this.returnThis ||                                                                             // 2871
                        this.returnValueDefined);                                                                      // 2872
            },                                                                                                         // 2873
                                                                                                                       // 2874
            invoke: function invoke(context, args) {                                                                   // 2875
                callCallback(this, args);                                                                              // 2876
                                                                                                                       // 2877
                if (this.exception) {                                                                                  // 2878
                    throw this.exception;                                                                              // 2879
                } else if (typeof this.returnArgAt == "number") {                                                      // 2880
                    return args[this.returnArgAt];                                                                     // 2881
                } else if (this.returnThis) {                                                                          // 2882
                    return context;                                                                                    // 2883
                }                                                                                                      // 2884
                                                                                                                       // 2885
                return this.returnValue;                                                                               // 2886
            },                                                                                                         // 2887
                                                                                                                       // 2888
            onCall: function onCall(index) {                                                                           // 2889
                return this.stub.onCall(index);                                                                        // 2890
            },                                                                                                         // 2891
                                                                                                                       // 2892
            onFirstCall: function onFirstCall() {                                                                      // 2893
                return this.stub.onFirstCall();                                                                        // 2894
            },                                                                                                         // 2895
                                                                                                                       // 2896
            onSecondCall: function onSecondCall() {                                                                    // 2897
                return this.stub.onSecondCall();                                                                       // 2898
            },                                                                                                         // 2899
                                                                                                                       // 2900
            onThirdCall: function onThirdCall() {                                                                      // 2901
                return this.stub.onThirdCall();                                                                        // 2902
            },                                                                                                         // 2903
                                                                                                                       // 2904
            withArgs: function withArgs(/* arguments */) {                                                             // 2905
                throw new Error("Defining a stub by invoking \"stub.onCall(...).withArgs(...)\" is not supported. " +  // 2906
                                "Use \"stub.withArgs(...).onCall(...)\" to define sequential behavior for calls with certain arguments.");
            },                                                                                                         // 2908
                                                                                                                       // 2909
            callsArg: function callsArg(pos) {                                                                         // 2910
                if (typeof pos != "number") {                                                                          // 2911
                    throw new TypeError("argument index is not number");                                               // 2912
                }                                                                                                      // 2913
                                                                                                                       // 2914
                this.callArgAt = pos;                                                                                  // 2915
                this.callbackArguments = [];                                                                           // 2916
                this.callbackContext = undefined;                                                                      // 2917
                this.callArgProp = undefined;                                                                          // 2918
                this.callbackAsync = false;                                                                            // 2919
                                                                                                                       // 2920
                return this;                                                                                           // 2921
            },                                                                                                         // 2922
                                                                                                                       // 2923
            callsArgOn: function callsArgOn(pos, context) {                                                            // 2924
                if (typeof pos != "number") {                                                                          // 2925
                    throw new TypeError("argument index is not number");                                               // 2926
                }                                                                                                      // 2927
                if (typeof context != "object") {                                                                      // 2928
                    throw new TypeError("argument context is not an object");                                          // 2929
                }                                                                                                      // 2930
                                                                                                                       // 2931
                this.callArgAt = pos;                                                                                  // 2932
                this.callbackArguments = [];                                                                           // 2933
                this.callbackContext = context;                                                                        // 2934
                this.callArgProp = undefined;                                                                          // 2935
                this.callbackAsync = false;                                                                            // 2936
                                                                                                                       // 2937
                return this;                                                                                           // 2938
            },                                                                                                         // 2939
                                                                                                                       // 2940
            callsArgWith: function callsArgWith(pos) {                                                                 // 2941
                if (typeof pos != "number") {                                                                          // 2942
                    throw new TypeError("argument index is not number");                                               // 2943
                }                                                                                                      // 2944
                                                                                                                       // 2945
                this.callArgAt = pos;                                                                                  // 2946
                this.callbackArguments = slice.call(arguments, 1);                                                     // 2947
                this.callbackContext = undefined;                                                                      // 2948
                this.callArgProp = undefined;                                                                          // 2949
                this.callbackAsync = false;                                                                            // 2950
                                                                                                                       // 2951
                return this;                                                                                           // 2952
            },                                                                                                         // 2953
                                                                                                                       // 2954
            callsArgOnWith: function callsArgWith(pos, context) {                                                      // 2955
                if (typeof pos != "number") {                                                                          // 2956
                    throw new TypeError("argument index is not number");                                               // 2957
                }                                                                                                      // 2958
                if (typeof context != "object") {                                                                      // 2959
                    throw new TypeError("argument context is not an object");                                          // 2960
                }                                                                                                      // 2961
                                                                                                                       // 2962
                this.callArgAt = pos;                                                                                  // 2963
                this.callbackArguments = slice.call(arguments, 2);                                                     // 2964
                this.callbackContext = context;                                                                        // 2965
                this.callArgProp = undefined;                                                                          // 2966
                this.callbackAsync = false;                                                                            // 2967
                                                                                                                       // 2968
                return this;                                                                                           // 2969
            },                                                                                                         // 2970
                                                                                                                       // 2971
            yields: function () {                                                                                      // 2972
                this.callArgAt = useLeftMostCallback;                                                                  // 2973
                this.callbackArguments = slice.call(arguments, 0);                                                     // 2974
                this.callbackContext = undefined;                                                                      // 2975
                this.callArgProp = undefined;                                                                          // 2976
                this.callbackAsync = false;                                                                            // 2977
                                                                                                                       // 2978
                return this;                                                                                           // 2979
            },                                                                                                         // 2980
                                                                                                                       // 2981
            yieldsRight: function () {                                                                                 // 2982
                this.callArgAt = useRightMostCallback;                                                                 // 2983
                this.callbackArguments = slice.call(arguments, 0);                                                     // 2984
                this.callbackContext = undefined;                                                                      // 2985
                this.callArgProp = undefined;                                                                          // 2986
                this.callbackAsync = false;                                                                            // 2987
                                                                                                                       // 2988
                return this;                                                                                           // 2989
            },                                                                                                         // 2990
                                                                                                                       // 2991
            yieldsOn: function (context) {                                                                             // 2992
                if (typeof context != "object") {                                                                      // 2993
                    throw new TypeError("argument context is not an object");                                          // 2994
                }                                                                                                      // 2995
                                                                                                                       // 2996
                this.callArgAt = useLeftMostCallback;                                                                  // 2997
                this.callbackArguments = slice.call(arguments, 1);                                                     // 2998
                this.callbackContext = context;                                                                        // 2999
                this.callArgProp = undefined;                                                                          // 3000
                this.callbackAsync = false;                                                                            // 3001
                                                                                                                       // 3002
                return this;                                                                                           // 3003
            },                                                                                                         // 3004
                                                                                                                       // 3005
            yieldsTo: function (prop) {                                                                                // 3006
                this.callArgAt = useLeftMostCallback;                                                                  // 3007
                this.callbackArguments = slice.call(arguments, 1);                                                     // 3008
                this.callbackContext = undefined;                                                                      // 3009
                this.callArgProp = prop;                                                                               // 3010
                this.callbackAsync = false;                                                                            // 3011
                                                                                                                       // 3012
                return this;                                                                                           // 3013
            },                                                                                                         // 3014
                                                                                                                       // 3015
            yieldsToOn: function (prop, context) {                                                                     // 3016
                if (typeof context != "object") {                                                                      // 3017
                    throw new TypeError("argument context is not an object");                                          // 3018
                }                                                                                                      // 3019
                                                                                                                       // 3020
                this.callArgAt = useLeftMostCallback;                                                                  // 3021
                this.callbackArguments = slice.call(arguments, 2);                                                     // 3022
                this.callbackContext = context;                                                                        // 3023
                this.callArgProp = prop;                                                                               // 3024
                this.callbackAsync = false;                                                                            // 3025
                                                                                                                       // 3026
                return this;                                                                                           // 3027
            },                                                                                                         // 3028
                                                                                                                       // 3029
            throws: throwsException,                                                                                   // 3030
            throwsException: throwsException,                                                                          // 3031
                                                                                                                       // 3032
            returns: function returns(value) {                                                                         // 3033
                this.returnValue = value;                                                                              // 3034
                this.returnValueDefined = true;                                                                        // 3035
                                                                                                                       // 3036
                return this;                                                                                           // 3037
            },                                                                                                         // 3038
                                                                                                                       // 3039
            returnsArg: function returnsArg(pos) {                                                                     // 3040
                if (typeof pos != "number") {                                                                          // 3041
                    throw new TypeError("argument index is not number");                                               // 3042
                }                                                                                                      // 3043
                                                                                                                       // 3044
                this.returnArgAt = pos;                                                                                // 3045
                                                                                                                       // 3046
                return this;                                                                                           // 3047
            },                                                                                                         // 3048
                                                                                                                       // 3049
            returnsThis: function returnsThis() {                                                                      // 3050
                this.returnThis = true;                                                                                // 3051
                                                                                                                       // 3052
                return this;                                                                                           // 3053
            }                                                                                                          // 3054
        };                                                                                                             // 3055
                                                                                                                       // 3056
        // create asynchronous versions of callsArg* and yields* methods                                               // 3057
        for (var method in proto) {                                                                                    // 3058
            // need to avoid creating anotherasync versions of the newly added async methods                           // 3059
            if (proto.hasOwnProperty(method) &&                                                                        // 3060
                method.match(/^(callsArg|yields)/) &&                                                                  // 3061
                !method.match(/Async/)) {                                                                              // 3062
                proto[method + "Async"] = (function (syncFnName) {                                                     // 3063
                    return function () {                                                                               // 3064
                        var result = this[syncFnName].apply(this, arguments);                                          // 3065
                        this.callbackAsync = true;                                                                     // 3066
                        return result;                                                                                 // 3067
                    };                                                                                                 // 3068
                })(method);                                                                                            // 3069
            }                                                                                                          // 3070
        }                                                                                                              // 3071
                                                                                                                       // 3072
        sinon.behavior = proto;                                                                                        // 3073
        return proto;                                                                                                  // 3074
    }                                                                                                                  // 3075
                                                                                                                       // 3076
    var isNode = typeof module !== "undefined" && module.exports && typeof require == "function";                      // 3077
    var isAMD = typeof define === "function" && typeof define.amd === "object" && define.amd;                          // 3078
                                                                                                                       // 3079
    function loadDependencies(require, exports, module) {                                                              // 3080
        var sinon = require("./util/core");                                                                            // 3081
        require("./extend");                                                                                           // 3082
        module.exports = makeApi(sinon);                                                                               // 3083
    }                                                                                                                  // 3084
                                                                                                                       // 3085
    if (isAMD) {                                                                                                       // 3086
        define(loadDependencies);                                                                                      // 3087
    } else if (isNode) {                                                                                               // 3088
        loadDependencies(require, module.exports, module);                                                             // 3089
    } else if (!sinon) {                                                                                               // 3090
        return;                                                                                                        // 3091
    } else {                                                                                                           // 3092
        makeApi(sinon);                                                                                                // 3093
    }                                                                                                                  // 3094
}(typeof sinon == "object" && sinon || null));                                                                         // 3095
                                                                                                                       // 3096
/**                                                                                                                    // 3097
 * @depend util/core.js                                                                                                // 3098
 * @depend extend.js                                                                                                   // 3099
 * @depend spy.js                                                                                                      // 3100
 * @depend behavior.js                                                                                                 // 3101
 */                                                                                                                    // 3102
/**                                                                                                                    // 3103
 * Stub functions                                                                                                      // 3104
 *                                                                                                                     // 3105
 * @author Christian Johansen (christian@cjohansen.no)                                                                 // 3106
 * @license BSD                                                                                                        // 3107
 *                                                                                                                     // 3108
 * Copyright (c) 2010-2013 Christian Johansen                                                                          // 3109
 */                                                                                                                    // 3110
                                                                                                                       // 3111
(function (sinon) {                                                                                                    // 3112
    function makeApi(sinon) {                                                                                          // 3113
        function stub(object, property, func) {                                                                        // 3114
            if (!!func && typeof func != "function" && typeof func != "object") {                                      // 3115
                throw new TypeError("Custom stub should be a function or a property descriptor");                      // 3116
            }                                                                                                          // 3117
                                                                                                                       // 3118
            var wrapper;                                                                                               // 3119
                                                                                                                       // 3120
            if (func) {                                                                                                // 3121
                if (typeof func == "function") {                                                                       // 3122
                    wrapper = sinon.spy && sinon.spy.create ? sinon.spy.create(func) : func;                           // 3123
                } else {                                                                                               // 3124
                    wrapper = func;                                                                                    // 3125
                    if (sinon.spy && sinon.spy.create) {                                                               // 3126
                        var types = sinon.objectKeys(wrapper);                                                         // 3127
                        for (var i = 0; i < types.length; i++) {                                                       // 3128
                            wrapper[types[i]] = sinon.spy.create(wrapper[types[i]]);                                   // 3129
                        }                                                                                              // 3130
                    }                                                                                                  // 3131
                }                                                                                                      // 3132
            } else {                                                                                                   // 3133
                var stubLength = 0;                                                                                    // 3134
                if (typeof object == "object" && typeof object[property] == "function") {                              // 3135
                    stubLength = object[property].length;                                                              // 3136
                }                                                                                                      // 3137
                wrapper = stub.create(stubLength);                                                                     // 3138
            }                                                                                                          // 3139
                                                                                                                       // 3140
            if (!object && typeof property === "undefined") {                                                          // 3141
                return sinon.stub.create();                                                                            // 3142
            }                                                                                                          // 3143
                                                                                                                       // 3144
            if (typeof property === "undefined" && typeof object == "object") {                                        // 3145
                for (var prop in object) {                                                                             // 3146
                    if (typeof object[prop] === "function") {                                                          // 3147
                        stub(object, prop);                                                                            // 3148
                    }                                                                                                  // 3149
                }                                                                                                      // 3150
                                                                                                                       // 3151
                return object;                                                                                         // 3152
            }                                                                                                          // 3153
                                                                                                                       // 3154
            return sinon.wrapMethod(object, property, wrapper);                                                        // 3155
        }                                                                                                              // 3156
                                                                                                                       // 3157
        function getDefaultBehavior(stub) {                                                                            // 3158
            return stub.defaultBehavior || getParentBehaviour(stub) || sinon.behavior.create(stub);                    // 3159
        }                                                                                                              // 3160
                                                                                                                       // 3161
        function getParentBehaviour(stub) {                                                                            // 3162
            return (stub.parent && getCurrentBehavior(stub.parent));                                                   // 3163
        }                                                                                                              // 3164
                                                                                                                       // 3165
        function getCurrentBehavior(stub) {                                                                            // 3166
            var behavior = stub.behaviors[stub.callCount - 1];                                                         // 3167
            return behavior && behavior.isPresent() ? behavior : getDefaultBehavior(stub);                             // 3168
        }                                                                                                              // 3169
                                                                                                                       // 3170
        var uuid = 0;                                                                                                  // 3171
                                                                                                                       // 3172
        var proto = {                                                                                                  // 3173
            create: function create(stubLength) {                                                                      // 3174
                var functionStub = function () {                                                                       // 3175
                    return getCurrentBehavior(functionStub).invoke(this, arguments);                                   // 3176
                };                                                                                                     // 3177
                                                                                                                       // 3178
                functionStub.id = "stub#" + uuid++;                                                                    // 3179
                var orig = functionStub;                                                                               // 3180
                functionStub = sinon.spy.create(functionStub, stubLength);                                             // 3181
                functionStub.func = orig;                                                                              // 3182
                                                                                                                       // 3183
                sinon.extend(functionStub, stub);                                                                      // 3184
                functionStub.instantiateFake = sinon.stub.create;                                                      // 3185
                functionStub.displayName = "stub";                                                                     // 3186
                functionStub.toString = sinon.functionToString;                                                        // 3187
                                                                                                                       // 3188
                functionStub.defaultBehavior = null;                                                                   // 3189
                functionStub.behaviors = [];                                                                           // 3190
                                                                                                                       // 3191
                return functionStub;                                                                                   // 3192
            },                                                                                                         // 3193
                                                                                                                       // 3194
            resetBehavior: function () {                                                                               // 3195
                var i;                                                                                                 // 3196
                                                                                                                       // 3197
                this.defaultBehavior = null;                                                                           // 3198
                this.behaviors = [];                                                                                   // 3199
                                                                                                                       // 3200
                delete this.returnValue;                                                                               // 3201
                delete this.returnArgAt;                                                                               // 3202
                this.returnThis = false;                                                                               // 3203
                                                                                                                       // 3204
                if (this.fakes) {                                                                                      // 3205
                    for (i = 0; i < this.fakes.length; i++) {                                                          // 3206
                        this.fakes[i].resetBehavior();                                                                 // 3207
                    }                                                                                                  // 3208
                }                                                                                                      // 3209
            },                                                                                                         // 3210
                                                                                                                       // 3211
            onCall: function onCall(index) {                                                                           // 3212
                if (!this.behaviors[index]) {                                                                          // 3213
                    this.behaviors[index] = sinon.behavior.create(this);                                               // 3214
                }                                                                                                      // 3215
                                                                                                                       // 3216
                return this.behaviors[index];                                                                          // 3217
            },                                                                                                         // 3218
                                                                                                                       // 3219
            onFirstCall: function onFirstCall() {                                                                      // 3220
                return this.onCall(0);                                                                                 // 3221
            },                                                                                                         // 3222
                                                                                                                       // 3223
            onSecondCall: function onSecondCall() {                                                                    // 3224
                return this.onCall(1);                                                                                 // 3225
            },                                                                                                         // 3226
                                                                                                                       // 3227
            onThirdCall: function onThirdCall() {                                                                      // 3228
                return this.onCall(2);                                                                                 // 3229
            }                                                                                                          // 3230
        };                                                                                                             // 3231
                                                                                                                       // 3232
        for (var method in sinon.behavior) {                                                                           // 3233
            if (sinon.behavior.hasOwnProperty(method) &&                                                               // 3234
                !proto.hasOwnProperty(method) &&                                                                       // 3235
                method != "create" &&                                                                                  // 3236
                method != "withArgs" &&                                                                                // 3237
                method != "invoke") {                                                                                  // 3238
                proto[method] = (function (behaviorMethod) {                                                           // 3239
                    return function () {                                                                               // 3240
                        this.defaultBehavior = this.defaultBehavior || sinon.behavior.create(this);                    // 3241
                        this.defaultBehavior[behaviorMethod].apply(this.defaultBehavior, arguments);                   // 3242
                        return this;                                                                                   // 3243
                    };                                                                                                 // 3244
                }(method));                                                                                            // 3245
            }                                                                                                          // 3246
        }                                                                                                              // 3247
                                                                                                                       // 3248
        sinon.extend(stub, proto);                                                                                     // 3249
        sinon.stub = stub;                                                                                             // 3250
                                                                                                                       // 3251
        return stub;                                                                                                   // 3252
    }                                                                                                                  // 3253
                                                                                                                       // 3254
    var isNode = typeof module !== "undefined" && module.exports && typeof require == "function";                      // 3255
    var isAMD = typeof define === "function" && typeof define.amd === "object" && define.amd;                          // 3256
                                                                                                                       // 3257
    function loadDependencies(require, exports, module) {                                                              // 3258
        var sinon = require("./util/core");                                                                            // 3259
        require("./behavior");                                                                                         // 3260
        require("./spy");                                                                                              // 3261
        require("./extend");                                                                                           // 3262
        module.exports = makeApi(sinon);                                                                               // 3263
    }                                                                                                                  // 3264
                                                                                                                       // 3265
    if (isAMD) {                                                                                                       // 3266
        define(loadDependencies);                                                                                      // 3267
    } else if (isNode) {                                                                                               // 3268
        loadDependencies(require, module.exports, module);                                                             // 3269
    } else if (!sinon) {                                                                                               // 3270
        return;                                                                                                        // 3271
    } else {                                                                                                           // 3272
        makeApi(sinon);                                                                                                // 3273
    }                                                                                                                  // 3274
}(typeof sinon == "object" && sinon || null));                                                                         // 3275
                                                                                                                       // 3276
/**                                                                                                                    // 3277
 * @depend times_in_words.js                                                                                           // 3278
 * @depend util/core.js                                                                                                // 3279
 * @depend call.js                                                                                                     // 3280
 * @depend extend.js                                                                                                   // 3281
 * @depend match.js                                                                                                    // 3282
 * @depend spy.js                                                                                                      // 3283
 * @depend stub.js                                                                                                     // 3284
 * @depend format.js                                                                                                   // 3285
 */                                                                                                                    // 3286
/**                                                                                                                    // 3287
 * Mock functions.                                                                                                     // 3288
 *                                                                                                                     // 3289
 * @author Christian Johansen (christian@cjohansen.no)                                                                 // 3290
 * @license BSD                                                                                                        // 3291
 *                                                                                                                     // 3292
 * Copyright (c) 2010-2013 Christian Johansen                                                                          // 3293
 */                                                                                                                    // 3294
                                                                                                                       // 3295
(function (sinon) {                                                                                                    // 3296
    function makeApi(sinon) {                                                                                          // 3297
        var push = [].push;                                                                                            // 3298
        var match = sinon.match;                                                                                       // 3299
                                                                                                                       // 3300
        function mock(object) {                                                                                        // 3301
            if (!object) {                                                                                             // 3302
                return sinon.expectation.create("Anonymous mock");                                                     // 3303
            }                                                                                                          // 3304
                                                                                                                       // 3305
            return mock.create(object);                                                                                // 3306
        }                                                                                                              // 3307
                                                                                                                       // 3308
        function each(collection, callback) {                                                                          // 3309
            if (!collection) {                                                                                         // 3310
                return;                                                                                                // 3311
            }                                                                                                          // 3312
                                                                                                                       // 3313
            for (var i = 0, l = collection.length; i < l; i += 1) {                                                    // 3314
                callback(collection[i]);                                                                               // 3315
            }                                                                                                          // 3316
        }                                                                                                              // 3317
                                                                                                                       // 3318
        sinon.extend(mock, {                                                                                           // 3319
            create: function create(object) {                                                                          // 3320
                if (!object) {                                                                                         // 3321
                    throw new TypeError("object is null");                                                             // 3322
                }                                                                                                      // 3323
                                                                                                                       // 3324
                var mockObject = sinon.extend({}, mock);                                                               // 3325
                mockObject.object = object;                                                                            // 3326
                delete mockObject.create;                                                                              // 3327
                                                                                                                       // 3328
                return mockObject;                                                                                     // 3329
            },                                                                                                         // 3330
                                                                                                                       // 3331
            expects: function expects(method) {                                                                        // 3332
                if (!method) {                                                                                         // 3333
                    throw new TypeError("method is falsy");                                                            // 3334
                }                                                                                                      // 3335
                                                                                                                       // 3336
                if (!this.expectations) {                                                                              // 3337
                    this.expectations = {};                                                                            // 3338
                    this.proxies = [];                                                                                 // 3339
                }                                                                                                      // 3340
                                                                                                                       // 3341
                if (!this.expectations[method]) {                                                                      // 3342
                    this.expectations[method] = [];                                                                    // 3343
                    var mockObject = this;                                                                             // 3344
                                                                                                                       // 3345
                    sinon.wrapMethod(this.object, method, function () {                                                // 3346
                        return mockObject.invokeMethod(method, this, arguments);                                       // 3347
                    });                                                                                                // 3348
                                                                                                                       // 3349
                    push.call(this.proxies, method);                                                                   // 3350
                }                                                                                                      // 3351
                                                                                                                       // 3352
                var expectation = sinon.expectation.create(method);                                                    // 3353
                push.call(this.expectations[method], expectation);                                                     // 3354
                                                                                                                       // 3355
                return expectation;                                                                                    // 3356
            },                                                                                                         // 3357
                                                                                                                       // 3358
            restore: function restore() {                                                                              // 3359
                var object = this.object;                                                                              // 3360
                                                                                                                       // 3361
                each(this.proxies, function (proxy) {                                                                  // 3362
                    if (typeof object[proxy].restore == "function") {                                                  // 3363
                        object[proxy].restore();                                                                       // 3364
                    }                                                                                                  // 3365
                });                                                                                                    // 3366
            },                                                                                                         // 3367
                                                                                                                       // 3368
            verify: function verify() {                                                                                // 3369
                var expectations = this.expectations || {};                                                            // 3370
                var messages = [], met = [];                                                                           // 3371
                                                                                                                       // 3372
                each(this.proxies, function (proxy) {                                                                  // 3373
                    each(expectations[proxy], function (expectation) {                                                 // 3374
                        if (!expectation.met()) {                                                                      // 3375
                            push.call(messages, expectation.toString());                                               // 3376
                        } else {                                                                                       // 3377
                            push.call(met, expectation.toString());                                                    // 3378
                        }                                                                                              // 3379
                    });                                                                                                // 3380
                });                                                                                                    // 3381
                                                                                                                       // 3382
                this.restore();                                                                                        // 3383
                                                                                                                       // 3384
                if (messages.length > 0) {                                                                             // 3385
                    sinon.expectation.fail(messages.concat(met).join("\n"));                                           // 3386
                } else if (met.length > 0) {                                                                           // 3387
                    sinon.expectation.pass(messages.concat(met).join("\n"));                                           // 3388
                }                                                                                                      // 3389
                                                                                                                       // 3390
                return true;                                                                                           // 3391
            },                                                                                                         // 3392
                                                                                                                       // 3393
            invokeMethod: function invokeMethod(method, thisValue, args) {                                             // 3394
                var expectations = this.expectations && this.expectations[method];                                     // 3395
                var length = expectations && expectations.length || 0, i;                                              // 3396
                                                                                                                       // 3397
                for (i = 0; i < length; i += 1) {                                                                      // 3398
                    if (!expectations[i].met() &&                                                                      // 3399
                        expectations[i].allowsCall(thisValue, args)) {                                                 // 3400
                        return expectations[i].apply(thisValue, args);                                                 // 3401
                    }                                                                                                  // 3402
                }                                                                                                      // 3403
                                                                                                                       // 3404
                var messages = [], available, exhausted = 0;                                                           // 3405
                                                                                                                       // 3406
                for (i = 0; i < length; i += 1) {                                                                      // 3407
                    if (expectations[i].allowsCall(thisValue, args)) {                                                 // 3408
                        available = available || expectations[i];                                                      // 3409
                    } else {                                                                                           // 3410
                        exhausted += 1;                                                                                // 3411
                    }                                                                                                  // 3412
                    push.call(messages, "    " + expectations[i].toString());                                          // 3413
                }                                                                                                      // 3414
                                                                                                                       // 3415
                if (exhausted === 0) {                                                                                 // 3416
                    return available.apply(thisValue, args);                                                           // 3417
                }                                                                                                      // 3418
                                                                                                                       // 3419
                messages.unshift("Unexpected call: " + sinon.spyCall.toString.call({                                   // 3420
                    proxy: method,                                                                                     // 3421
                    args: args                                                                                         // 3422
                }));                                                                                                   // 3423
                                                                                                                       // 3424
                sinon.expectation.fail(messages.join("\n"));                                                           // 3425
            }                                                                                                          // 3426
        });                                                                                                            // 3427
                                                                                                                       // 3428
        var times = sinon.timesInWords;                                                                                // 3429
        var slice = Array.prototype.slice;                                                                             // 3430
                                                                                                                       // 3431
        function callCountInWords(callCount) {                                                                         // 3432
            if (callCount == 0) {                                                                                      // 3433
                return "never called";                                                                                 // 3434
            } else {                                                                                                   // 3435
                return "called " + times(callCount);                                                                   // 3436
            }                                                                                                          // 3437
        }                                                                                                              // 3438
                                                                                                                       // 3439
        function expectedCallCountInWords(expectation) {                                                               // 3440
            var min = expectation.minCalls;                                                                            // 3441
            var max = expectation.maxCalls;                                                                            // 3442
                                                                                                                       // 3443
            if (typeof min == "number" && typeof max == "number") {                                                    // 3444
                var str = times(min);                                                                                  // 3445
                                                                                                                       // 3446
                if (min != max) {                                                                                      // 3447
                    str = "at least " + str + " and at most " + times(max);                                            // 3448
                }                                                                                                      // 3449
                                                                                                                       // 3450
                return str;                                                                                            // 3451
            }                                                                                                          // 3452
                                                                                                                       // 3453
            if (typeof min == "number") {                                                                              // 3454
                return "at least " + times(min);                                                                       // 3455
            }                                                                                                          // 3456
                                                                                                                       // 3457
            return "at most " + times(max);                                                                            // 3458
        }                                                                                                              // 3459
                                                                                                                       // 3460
        function receivedMinCalls(expectation) {                                                                       // 3461
            var hasMinLimit = typeof expectation.minCalls == "number";                                                 // 3462
            return !hasMinLimit || expectation.callCount >= expectation.minCalls;                                      // 3463
        }                                                                                                              // 3464
                                                                                                                       // 3465
        function receivedMaxCalls(expectation) {                                                                       // 3466
            if (typeof expectation.maxCalls != "number") {                                                             // 3467
                return false;                                                                                          // 3468
            }                                                                                                          // 3469
                                                                                                                       // 3470
            return expectation.callCount == expectation.maxCalls;                                                      // 3471
        }                                                                                                              // 3472
                                                                                                                       // 3473
        function verifyMatcher(possibleMatcher, arg) {                                                                 // 3474
            if (match && match.isMatcher(possibleMatcher)) {                                                           // 3475
                return possibleMatcher.test(arg);                                                                      // 3476
            } else {                                                                                                   // 3477
                return true;                                                                                           // 3478
            }                                                                                                          // 3479
        }                                                                                                              // 3480
                                                                                                                       // 3481
        sinon.expectation = {                                                                                          // 3482
            minCalls: 1,                                                                                               // 3483
            maxCalls: 1,                                                                                               // 3484
                                                                                                                       // 3485
            create: function create(methodName) {                                                                      // 3486
                var expectation = sinon.extend(sinon.stub.create(), sinon.expectation);                                // 3487
                delete expectation.create;                                                                             // 3488
                expectation.method = methodName;                                                                       // 3489
                                                                                                                       // 3490
                return expectation;                                                                                    // 3491
            },                                                                                                         // 3492
                                                                                                                       // 3493
            invoke: function invoke(func, thisValue, args) {                                                           // 3494
                this.verifyCallAllowed(thisValue, args);                                                               // 3495
                                                                                                                       // 3496
                return sinon.spy.invoke.apply(this, arguments);                                                        // 3497
            },                                                                                                         // 3498
                                                                                                                       // 3499
            atLeast: function atLeast(num) {                                                                           // 3500
                if (typeof num != "number") {                                                                          // 3501
                    throw new TypeError("'" + num + "' is not number");                                                // 3502
                }                                                                                                      // 3503
                                                                                                                       // 3504
                if (!this.limitsSet) {                                                                                 // 3505
                    this.maxCalls = null;                                                                              // 3506
                    this.limitsSet = true;                                                                             // 3507
                }                                                                                                      // 3508
                                                                                                                       // 3509
                this.minCalls = num;                                                                                   // 3510
                                                                                                                       // 3511
                return this;                                                                                           // 3512
            },                                                                                                         // 3513
                                                                                                                       // 3514
            atMost: function atMost(num) {                                                                             // 3515
                if (typeof num != "number") {                                                                          // 3516
                    throw new TypeError("'" + num + "' is not number");                                                // 3517
                }                                                                                                      // 3518
                                                                                                                       // 3519
                if (!this.limitsSet) {                                                                                 // 3520
                    this.minCalls = null;                                                                              // 3521
                    this.limitsSet = true;                                                                             // 3522
                }                                                                                                      // 3523
                                                                                                                       // 3524
                this.maxCalls = num;                                                                                   // 3525
                                                                                                                       // 3526
                return this;                                                                                           // 3527
            },                                                                                                         // 3528
                                                                                                                       // 3529
            never: function never() {                                                                                  // 3530
                return this.exactly(0);                                                                                // 3531
            },                                                                                                         // 3532
                                                                                                                       // 3533
            once: function once() {                                                                                    // 3534
                return this.exactly(1);                                                                                // 3535
            },                                                                                                         // 3536
                                                                                                                       // 3537
            twice: function twice() {                                                                                  // 3538
                return this.exactly(2);                                                                                // 3539
            },                                                                                                         // 3540
                                                                                                                       // 3541
            thrice: function thrice() {                                                                                // 3542
                return this.exactly(3);                                                                                // 3543
            },                                                                                                         // 3544
                                                                                                                       // 3545
            exactly: function exactly(num) {                                                                           // 3546
                if (typeof num != "number") {                                                                          // 3547
                    throw new TypeError("'" + num + "' is not a number");                                              // 3548
                }                                                                                                      // 3549
                                                                                                                       // 3550
                this.atLeast(num);                                                                                     // 3551
                return this.atMost(num);                                                                               // 3552
            },                                                                                                         // 3553
                                                                                                                       // 3554
            met: function met() {                                                                                      // 3555
                return !this.failed && receivedMinCalls(this);                                                         // 3556
            },                                                                                                         // 3557
                                                                                                                       // 3558
            verifyCallAllowed: function verifyCallAllowed(thisValue, args) {                                           // 3559
                if (receivedMaxCalls(this)) {                                                                          // 3560
                    this.failed = true;                                                                                // 3561
                    sinon.expectation.fail(this.method + " already called " + times(this.maxCalls));                   // 3562
                }                                                                                                      // 3563
                                                                                                                       // 3564
                if ("expectedThis" in this && this.expectedThis !== thisValue) {                                       // 3565
                    sinon.expectation.fail(this.method + " called with " + thisValue + " as thisValue, expected " +    // 3566
                        this.expectedThis);                                                                            // 3567
                }                                                                                                      // 3568
                                                                                                                       // 3569
                if (!("expectedArguments" in this)) {                                                                  // 3570
                    return;                                                                                            // 3571
                }                                                                                                      // 3572
                                                                                                                       // 3573
                if (!args) {                                                                                           // 3574
                    sinon.expectation.fail(this.method + " received no arguments, expected " +                         // 3575
                        sinon.format(this.expectedArguments));                                                         // 3576
                }                                                                                                      // 3577
                                                                                                                       // 3578
                if (args.length < this.expectedArguments.length) {                                                     // 3579
                    sinon.expectation.fail(this.method + " received too few arguments (" + sinon.format(args) +        // 3580
                        "), expected " + sinon.format(this.expectedArguments));                                        // 3581
                }                                                                                                      // 3582
                                                                                                                       // 3583
                if (this.expectsExactArgCount &&                                                                       // 3584
                    args.length != this.expectedArguments.length) {                                                    // 3585
                    sinon.expectation.fail(this.method + " received too many arguments (" + sinon.format(args) +       // 3586
                        "), expected " + sinon.format(this.expectedArguments));                                        // 3587
                }                                                                                                      // 3588
                                                                                                                       // 3589
                for (var i = 0, l = this.expectedArguments.length; i < l; i += 1) {                                    // 3590
                                                                                                                       // 3591
                    if (!verifyMatcher(this.expectedArguments[i], args[i])) {                                          // 3592
                        sinon.expectation.fail(this.method + " received wrong arguments " + sinon.format(args) +       // 3593
                            ", didn't match " + this.expectedArguments.toString());                                    // 3594
                    }                                                                                                  // 3595
                                                                                                                       // 3596
                    if (!sinon.deepEqual(this.expectedArguments[i], args[i])) {                                        // 3597
                        sinon.expectation.fail(this.method + " received wrong arguments " + sinon.format(args) +       // 3598
                            ", expected " + sinon.format(this.expectedArguments));                                     // 3599
                    }                                                                                                  // 3600
                }                                                                                                      // 3601
            },                                                                                                         // 3602
                                                                                                                       // 3603
            allowsCall: function allowsCall(thisValue, args) {                                                         // 3604
                if (this.met() && receivedMaxCalls(this)) {                                                            // 3605
                    return false;                                                                                      // 3606
                }                                                                                                      // 3607
                                                                                                                       // 3608
                if ("expectedThis" in this && this.expectedThis !== thisValue) {                                       // 3609
                    return false;                                                                                      // 3610
                }                                                                                                      // 3611
                                                                                                                       // 3612
                if (!("expectedArguments" in this)) {                                                                  // 3613
                    return true;                                                                                       // 3614
                }                                                                                                      // 3615
                                                                                                                       // 3616
                args = args || [];                                                                                     // 3617
                                                                                                                       // 3618
                if (args.length < this.expectedArguments.length) {                                                     // 3619
                    return false;                                                                                      // 3620
                }                                                                                                      // 3621
                                                                                                                       // 3622
                if (this.expectsExactArgCount &&                                                                       // 3623
                    args.length != this.expectedArguments.length) {                                                    // 3624
                    return false;                                                                                      // 3625
                }                                                                                                      // 3626
                                                                                                                       // 3627
                for (var i = 0, l = this.expectedArguments.length; i < l; i += 1) {                                    // 3628
                    if (!verifyMatcher(this.expectedArguments[i], args[i])) {                                          // 3629
                        return false;                                                                                  // 3630
                    }                                                                                                  // 3631
                                                                                                                       // 3632
                    if (!sinon.deepEqual(this.expectedArguments[i], args[i])) {                                        // 3633
                        return false;                                                                                  // 3634
                    }                                                                                                  // 3635
                }                                                                                                      // 3636
                                                                                                                       // 3637
                return true;                                                                                           // 3638
            },                                                                                                         // 3639
                                                                                                                       // 3640
            withArgs: function withArgs() {                                                                            // 3641
                this.expectedArguments = slice.call(arguments);                                                        // 3642
                return this;                                                                                           // 3643
            },                                                                                                         // 3644
                                                                                                                       // 3645
            withExactArgs: function withExactArgs() {                                                                  // 3646
                this.withArgs.apply(this, arguments);                                                                  // 3647
                this.expectsExactArgCount = true;                                                                      // 3648
                return this;                                                                                           // 3649
            },                                                                                                         // 3650
                                                                                                                       // 3651
            on: function on(thisValue) {                                                                               // 3652
                this.expectedThis = thisValue;                                                                         // 3653
                return this;                                                                                           // 3654
            },                                                                                                         // 3655
                                                                                                                       // 3656
            toString: function () {                                                                                    // 3657
                var args = (this.expectedArguments || []).slice();                                                     // 3658
                                                                                                                       // 3659
                if (!this.expectsExactArgCount) {                                                                      // 3660
                    push.call(args, "[...]");                                                                          // 3661
                }                                                                                                      // 3662
                                                                                                                       // 3663
                var callStr = sinon.spyCall.toString.call({                                                            // 3664
                    proxy: this.method || "anonymous mock expectation",                                                // 3665
                    args: args                                                                                         // 3666
                });                                                                                                    // 3667
                                                                                                                       // 3668
                var message = callStr.replace(", [...", "[, ...") + " " +                                              // 3669
                    expectedCallCountInWords(this);                                                                    // 3670
                                                                                                                       // 3671
                if (this.met()) {                                                                                      // 3672
                    return "Expectation met: " + message;                                                              // 3673
                }                                                                                                      // 3674
                                                                                                                       // 3675
                return "Expected " + message + " (" +                                                                  // 3676
                    callCountInWords(this.callCount) + ")";                                                            // 3677
            },                                                                                                         // 3678
                                                                                                                       // 3679
            verify: function verify() {                                                                                // 3680
                if (!this.met()) {                                                                                     // 3681
                    sinon.expectation.fail(this.toString());                                                           // 3682
                } else {                                                                                               // 3683
                    sinon.expectation.pass(this.toString());                                                           // 3684
                }                                                                                                      // 3685
                                                                                                                       // 3686
                return true;                                                                                           // 3687
            },                                                                                                         // 3688
                                                                                                                       // 3689
            pass: function pass(message) {                                                                             // 3690
                sinon.assert.pass(message);                                                                            // 3691
            },                                                                                                         // 3692
                                                                                                                       // 3693
            fail: function fail(message) {                                                                             // 3694
                var exception = new Error(message);                                                                    // 3695
                exception.name = "ExpectationError";                                                                   // 3696
                                                                                                                       // 3697
                throw exception;                                                                                       // 3698
            }                                                                                                          // 3699
        };                                                                                                             // 3700
                                                                                                                       // 3701
        sinon.mock = mock;                                                                                             // 3702
        return mock;                                                                                                   // 3703
    }                                                                                                                  // 3704
                                                                                                                       // 3705
    var isNode = typeof module !== "undefined" && module.exports && typeof require == "function";                      // 3706
    var isAMD = typeof define === "function" && typeof define.amd === "object" && define.amd;                          // 3707
                                                                                                                       // 3708
    function loadDependencies(require, exports, module) {                                                              // 3709
        var sinon = require("./util/core");                                                                            // 3710
        require("./times_in_words");                                                                                   // 3711
        require("./call");                                                                                             // 3712
        require("./extend");                                                                                           // 3713
        require("./match");                                                                                            // 3714
        require("./spy");                                                                                              // 3715
        require("./stub");                                                                                             // 3716
        require("./format");                                                                                           // 3717
                                                                                                                       // 3718
        module.exports = makeApi(sinon);                                                                               // 3719
    }                                                                                                                  // 3720
                                                                                                                       // 3721
    if (isAMD) {                                                                                                       // 3722
        define(loadDependencies);                                                                                      // 3723
    } else if (isNode) {                                                                                               // 3724
        loadDependencies(require, module.exports, module);                                                             // 3725
    } else if (!sinon) {                                                                                               // 3726
        return;                                                                                                        // 3727
    } else {                                                                                                           // 3728
        makeApi(sinon);                                                                                                // 3729
    }                                                                                                                  // 3730
}(typeof sinon == "object" && sinon || null));                                                                         // 3731
                                                                                                                       // 3732
/**                                                                                                                    // 3733
 * @depend util/core.js                                                                                                // 3734
 * @depend spy.js                                                                                                      // 3735
 * @depend stub.js                                                                                                     // 3736
 * @depend mock.js                                                                                                     // 3737
 */                                                                                                                    // 3738
/**                                                                                                                    // 3739
 * Collections of stubs, spies and mocks.                                                                              // 3740
 *                                                                                                                     // 3741
 * @author Christian Johansen (christian@cjohansen.no)                                                                 // 3742
 * @license BSD                                                                                                        // 3743
 *                                                                                                                     // 3744
 * Copyright (c) 2010-2013 Christian Johansen                                                                          // 3745
 */                                                                                                                    // 3746
                                                                                                                       // 3747
(function (sinon) {                                                                                                    // 3748
    var push = [].push;                                                                                                // 3749
    var hasOwnProperty = Object.prototype.hasOwnProperty;                                                              // 3750
                                                                                                                       // 3751
    function getFakes(fakeCollection) {                                                                                // 3752
        if (!fakeCollection.fakes) {                                                                                   // 3753
            fakeCollection.fakes = [];                                                                                 // 3754
        }                                                                                                              // 3755
                                                                                                                       // 3756
        return fakeCollection.fakes;                                                                                   // 3757
    }                                                                                                                  // 3758
                                                                                                                       // 3759
    function each(fakeCollection, method) {                                                                            // 3760
        var fakes = getFakes(fakeCollection);                                                                          // 3761
                                                                                                                       // 3762
        for (var i = 0, l = fakes.length; i < l; i += 1) {                                                             // 3763
            if (typeof fakes[i][method] == "function") {                                                               // 3764
                fakes[i][method]();                                                                                    // 3765
            }                                                                                                          // 3766
        }                                                                                                              // 3767
    }                                                                                                                  // 3768
                                                                                                                       // 3769
    function compact(fakeCollection) {                                                                                 // 3770
        var fakes = getFakes(fakeCollection);                                                                          // 3771
        var i = 0;                                                                                                     // 3772
        while (i < fakes.length) {                                                                                     // 3773
            fakes.splice(i, 1);                                                                                        // 3774
        }                                                                                                              // 3775
    }                                                                                                                  // 3776
                                                                                                                       // 3777
    function makeApi(sinon) {                                                                                          // 3778
        var collection = {                                                                                             // 3779
            verify: function resolve() {                                                                               // 3780
                each(this, "verify");                                                                                  // 3781
            },                                                                                                         // 3782
                                                                                                                       // 3783
            restore: function restore() {                                                                              // 3784
                each(this, "restore");                                                                                 // 3785
                compact(this);                                                                                         // 3786
            },                                                                                                         // 3787
                                                                                                                       // 3788
            reset: function restore() {                                                                                // 3789
                each(this, "reset");                                                                                   // 3790
            },                                                                                                         // 3791
                                                                                                                       // 3792
            verifyAndRestore: function verifyAndRestore() {                                                            // 3793
                var exception;                                                                                         // 3794
                                                                                                                       // 3795
                try {                                                                                                  // 3796
                    this.verify();                                                                                     // 3797
                } catch (e) {                                                                                          // 3798
                    exception = e;                                                                                     // 3799
                }                                                                                                      // 3800
                                                                                                                       // 3801
                this.restore();                                                                                        // 3802
                                                                                                                       // 3803
                if (exception) {                                                                                       // 3804
                    throw exception;                                                                                   // 3805
                }                                                                                                      // 3806
            },                                                                                                         // 3807
                                                                                                                       // 3808
            add: function add(fake) {                                                                                  // 3809
                push.call(getFakes(this), fake);                                                                       // 3810
                return fake;                                                                                           // 3811
            },                                                                                                         // 3812
                                                                                                                       // 3813
            spy: function spy() {                                                                                      // 3814
                return this.add(sinon.spy.apply(sinon, arguments));                                                    // 3815
            },                                                                                                         // 3816
                                                                                                                       // 3817
            stub: function stub(object, property, value) {                                                             // 3818
                if (property) {                                                                                        // 3819
                    var original = object[property];                                                                   // 3820
                                                                                                                       // 3821
                    if (typeof original != "function") {                                                               // 3822
                        if (!hasOwnProperty.call(object, property)) {                                                  // 3823
                            throw new TypeError("Cannot stub non-existent own property " + property);                  // 3824
                        }                                                                                              // 3825
                                                                                                                       // 3826
                        object[property] = value;                                                                      // 3827
                                                                                                                       // 3828
                        return this.add({                                                                              // 3829
                            restore: function () {                                                                     // 3830
                                object[property] = original;                                                           // 3831
                            }                                                                                          // 3832
                        });                                                                                            // 3833
                    }                                                                                                  // 3834
                }                                                                                                      // 3835
                if (!property && !!object && typeof object == "object") {                                              // 3836
                    var stubbedObj = sinon.stub.apply(sinon, arguments);                                               // 3837
                                                                                                                       // 3838
                    for (var prop in stubbedObj) {                                                                     // 3839
                        if (typeof stubbedObj[prop] === "function") {                                                  // 3840
                            this.add(stubbedObj[prop]);                                                                // 3841
                        }                                                                                              // 3842
                    }                                                                                                  // 3843
                                                                                                                       // 3844
                    return stubbedObj;                                                                                 // 3845
                }                                                                                                      // 3846
                                                                                                                       // 3847
                return this.add(sinon.stub.apply(sinon, arguments));                                                   // 3848
            },                                                                                                         // 3849
                                                                                                                       // 3850
            mock: function mock() {                                                                                    // 3851
                return this.add(sinon.mock.apply(sinon, arguments));                                                   // 3852
            },                                                                                                         // 3853
                                                                                                                       // 3854
            inject: function inject(obj) {                                                                             // 3855
                var col = this;                                                                                        // 3856
                                                                                                                       // 3857
                obj.spy = function () {                                                                                // 3858
                    return col.spy.apply(col, arguments);                                                              // 3859
                };                                                                                                     // 3860
                                                                                                                       // 3861
                obj.stub = function () {                                                                               // 3862
                    return col.stub.apply(col, arguments);                                                             // 3863
                };                                                                                                     // 3864
                                                                                                                       // 3865
                obj.mock = function () {                                                                               // 3866
                    return col.mock.apply(col, arguments);                                                             // 3867
                };                                                                                                     // 3868
                                                                                                                       // 3869
                return obj;                                                                                            // 3870
            }                                                                                                          // 3871
        };                                                                                                             // 3872
                                                                                                                       // 3873
        sinon.collection = collection;                                                                                 // 3874
        return collection;                                                                                             // 3875
    }                                                                                                                  // 3876
                                                                                                                       // 3877
    var isNode = typeof module !== "undefined" && module.exports && typeof require == "function";                      // 3878
    var isAMD = typeof define === "function" && typeof define.amd === "object" && define.amd;                          // 3879
                                                                                                                       // 3880
    function loadDependencies(require, exports, module) {                                                              // 3881
        var sinon = require("./util/core");                                                                            // 3882
        require("./mock");                                                                                             // 3883
        require("./spy");                                                                                              // 3884
        require("./stub");                                                                                             // 3885
        module.exports = makeApi(sinon);                                                                               // 3886
    }                                                                                                                  // 3887
                                                                                                                       // 3888
    if (isAMD) {                                                                                                       // 3889
        define(loadDependencies);                                                                                      // 3890
    } else if (isNode) {                                                                                               // 3891
        loadDependencies(require, module.exports, module);                                                             // 3892
    } else if (!sinon) {                                                                                               // 3893
        return;                                                                                                        // 3894
    } else {                                                                                                           // 3895
        makeApi(sinon);                                                                                                // 3896
    }                                                                                                                  // 3897
}(typeof sinon == "object" && sinon || null));                                                                         // 3898
                                                                                                                       // 3899
/*global lolex */                                                                                                      // 3900
                                                                                                                       // 3901
/**                                                                                                                    // 3902
 * Fake timer API                                                                                                      // 3903
 * setTimeout                                                                                                          // 3904
 * setInterval                                                                                                         // 3905
 * clearTimeout                                                                                                        // 3906
 * clearInterval                                                                                                       // 3907
 * tick                                                                                                                // 3908
 * reset                                                                                                               // 3909
 * Date                                                                                                                // 3910
 *                                                                                                                     // 3911
 * Inspired by jsUnitMockTimeOut from JsUnit                                                                           // 3912
 *                                                                                                                     // 3913
 * @author Christian Johansen (christian@cjohansen.no)                                                                 // 3914
 * @license BSD                                                                                                        // 3915
 *                                                                                                                     // 3916
 * Copyright (c) 2010-2013 Christian Johansen                                                                          // 3917
 */                                                                                                                    // 3918
                                                                                                                       // 3919
if (typeof sinon == "undefined") {                                                                                     // 3920
    var sinon = {};                                                                                                    // 3921
}                                                                                                                      // 3922
                                                                                                                       // 3923
(function (global) {                                                                                                   // 3924
    function makeApi(sinon, lol) {                                                                                     // 3925
        var llx = typeof lolex !== "undefined" ? lolex : lol;                                                          // 3926
                                                                                                                       // 3927
        sinon.useFakeTimers = function () {                                                                            // 3928
            var now, methods = Array.prototype.slice.call(arguments);                                                  // 3929
                                                                                                                       // 3930
            if (typeof methods[0] === "string") {                                                                      // 3931
                now = 0;                                                                                               // 3932
            } else {                                                                                                   // 3933
                now = methods.shift();                                                                                 // 3934
            }                                                                                                          // 3935
                                                                                                                       // 3936
            var clock = llx.install(now || 0, methods);                                                                // 3937
            clock.restore = clock.uninstall;                                                                           // 3938
            return clock;                                                                                              // 3939
        };                                                                                                             // 3940
                                                                                                                       // 3941
        sinon.clock = {                                                                                                // 3942
            create: function (now) {                                                                                   // 3943
                return llx.createClock(now);                                                                           // 3944
            }                                                                                                          // 3945
        };                                                                                                             // 3946
                                                                                                                       // 3947
        sinon.timers = {                                                                                               // 3948
            setTimeout: setTimeout,                                                                                    // 3949
            clearTimeout: clearTimeout,                                                                                // 3950
            setImmediate: (typeof setImmediate !== "undefined" ? setImmediate : undefined),                            // 3951
            clearImmediate: (typeof clearImmediate !== "undefined" ? clearImmediate : undefined),                      // 3952
            setInterval: setInterval,                                                                                  // 3953
            clearInterval: clearInterval,                                                                              // 3954
            Date: Date                                                                                                 // 3955
        };                                                                                                             // 3956
    }                                                                                                                  // 3957
                                                                                                                       // 3958
    var isNode = typeof module !== "undefined" && module.exports && typeof require == "function";                      // 3959
    var isAMD = typeof define === "function" && typeof define.amd === "object" && define.amd;                          // 3960
                                                                                                                       // 3961
    function loadDependencies(require, epxorts, module, lolex) {                                                       // 3962
        var sinon = require("./core");                                                                                 // 3963
        makeApi(sinon, lolex);                                                                                         // 3964
        module.exports = sinon;                                                                                        // 3965
    }                                                                                                                  // 3966
                                                                                                                       // 3967
    if (isAMD) {                                                                                                       // 3968
        define(loadDependencies);                                                                                      // 3969
    } else if (isNode) {                                                                                               // 3970
        loadDependencies(require, module.exports, module, require("lolex"));                                           // 3971
    } else {                                                                                                           // 3972
        makeApi(sinon);                                                                                                // 3973
    }                                                                                                                  // 3974
}(typeof global != "undefined" && typeof global !== "function" ? global : this));                                      // 3975
                                                                                                                       // 3976
/**                                                                                                                    // 3977
 * Minimal Event interface implementation                                                                              // 3978
 *                                                                                                                     // 3979
 * Original implementation by Sven Fuchs: https://gist.github.com/995028                                               // 3980
 * Modifications and tests by Christian Johansen.                                                                      // 3981
 *                                                                                                                     // 3982
 * @author Sven Fuchs (svenfuchs@artweb-design.de)                                                                     // 3983
 * @author Christian Johansen (christian@cjohansen.no)                                                                 // 3984
 * @license BSD                                                                                                        // 3985
 *                                                                                                                     // 3986
 * Copyright (c) 2011 Sven Fuchs, Christian Johansen                                                                   // 3987
 */                                                                                                                    // 3988
                                                                                                                       // 3989
if (typeof sinon == "undefined") {                                                                                     // 3990
    this.sinon = {};                                                                                                   // 3991
}                                                                                                                      // 3992
                                                                                                                       // 3993
(function () {                                                                                                         // 3994
    var push = [].push;                                                                                                // 3995
                                                                                                                       // 3996
    function makeApi(sinon) {                                                                                          // 3997
        sinon.Event = function Event(type, bubbles, cancelable, target) {                                              // 3998
            this.initEvent(type, bubbles, cancelable, target);                                                         // 3999
        };                                                                                                             // 4000
                                                                                                                       // 4001
        sinon.Event.prototype = {                                                                                      // 4002
            initEvent: function (type, bubbles, cancelable, target) {                                                  // 4003
                this.type = type;                                                                                      // 4004
                this.bubbles = bubbles;                                                                                // 4005
                this.cancelable = cancelable;                                                                          // 4006
                this.target = target;                                                                                  // 4007
            },                                                                                                         // 4008
                                                                                                                       // 4009
            stopPropagation: function () {},                                                                           // 4010
                                                                                                                       // 4011
            preventDefault: function () {                                                                              // 4012
                this.defaultPrevented = true;                                                                          // 4013
            }                                                                                                          // 4014
        };                                                                                                             // 4015
                                                                                                                       // 4016
        sinon.ProgressEvent = function ProgressEvent(type, progressEventRaw, target) {                                 // 4017
            this.initEvent(type, false, false, target);                                                                // 4018
            this.loaded = progressEventRaw.loaded || null;                                                             // 4019
            this.total = progressEventRaw.total || null;                                                               // 4020
            this.lengthComputable = !!progressEventRaw.total;                                                          // 4021
        };                                                                                                             // 4022
                                                                                                                       // 4023
        sinon.ProgressEvent.prototype = new sinon.Event();                                                             // 4024
                                                                                                                       // 4025
        sinon.ProgressEvent.prototype.constructor =  sinon.ProgressEvent;                                              // 4026
                                                                                                                       // 4027
        sinon.CustomEvent = function CustomEvent(type, customData, target) {                                           // 4028
            this.initEvent(type, false, false, target);                                                                // 4029
            this.detail = customData.detail || null;                                                                   // 4030
        };                                                                                                             // 4031
                                                                                                                       // 4032
        sinon.CustomEvent.prototype = new sinon.Event();                                                               // 4033
                                                                                                                       // 4034
        sinon.CustomEvent.prototype.constructor =  sinon.CustomEvent;                                                  // 4035
                                                                                                                       // 4036
        sinon.EventTarget = {                                                                                          // 4037
            addEventListener: function addEventListener(event, listener) {                                             // 4038
                this.eventListeners = this.eventListeners || {};                                                       // 4039
                this.eventListeners[event] = this.eventListeners[event] || [];                                         // 4040
                push.call(this.eventListeners[event], listener);                                                       // 4041
            },                                                                                                         // 4042
                                                                                                                       // 4043
            removeEventListener: function removeEventListener(event, listener) {                                       // 4044
                var listeners = this.eventListeners && this.eventListeners[event] || [];                               // 4045
                                                                                                                       // 4046
                for (var i = 0, l = listeners.length; i < l; ++i) {                                                    // 4047
                    if (listeners[i] == listener) {                                                                    // 4048
                        return listeners.splice(i, 1);                                                                 // 4049
                    }                                                                                                  // 4050
                }                                                                                                      // 4051
            },                                                                                                         // 4052
                                                                                                                       // 4053
            dispatchEvent: function dispatchEvent(event) {                                                             // 4054
                var type = event.type;                                                                                 // 4055
                var listeners = this.eventListeners && this.eventListeners[type] || [];                                // 4056
                                                                                                                       // 4057
                for (var i = 0; i < listeners.length; i++) {                                                           // 4058
                    if (typeof listeners[i] == "function") {                                                           // 4059
                        listeners[i].call(this, event);                                                                // 4060
                    } else {                                                                                           // 4061
                        listeners[i].handleEvent(event);                                                               // 4062
                    }                                                                                                  // 4063
                }                                                                                                      // 4064
                                                                                                                       // 4065
                return !!event.defaultPrevented;                                                                       // 4066
            }                                                                                                          // 4067
        };                                                                                                             // 4068
    }                                                                                                                  // 4069
                                                                                                                       // 4070
    var isNode = typeof module !== "undefined" && module.exports && typeof require == "function";                      // 4071
    var isAMD = typeof define === "function" && typeof define.amd === "object" && define.amd;                          // 4072
                                                                                                                       // 4073
    function loadDependencies(require) {                                                                               // 4074
        var sinon = require("./core");                                                                                 // 4075
        makeApi(sinon);                                                                                                // 4076
    }                                                                                                                  // 4077
                                                                                                                       // 4078
    if (isAMD) {                                                                                                       // 4079
        define(loadDependencies);                                                                                      // 4080
    } else if (isNode) {                                                                                               // 4081
        loadDependencies(require);                                                                                     // 4082
    } else {                                                                                                           // 4083
        makeApi(sinon);                                                                                                // 4084
    }                                                                                                                  // 4085
}());                                                                                                                  // 4086
                                                                                                                       // 4087
/**                                                                                                                    // 4088
 * @depend util/core.js                                                                                                // 4089
 */                                                                                                                    // 4090
/**                                                                                                                    // 4091
 * Logs errors                                                                                                         // 4092
 *                                                                                                                     // 4093
 * @author Christian Johansen (christian@cjohansen.no)                                                                 // 4094
 * @license BSD                                                                                                        // 4095
 *                                                                                                                     // 4096
 * Copyright (c) 2010-2014 Christian Johansen                                                                          // 4097
 */                                                                                                                    // 4098
                                                                                                                       // 4099
(function (sinon) {                                                                                                    // 4100
    // cache a reference to setTimeout, so that our reference won't be stubbed out                                     // 4101
    // when using fake timers and errors will still get logged                                                         // 4102
    // https://github.com/cjohansen/Sinon.JS/issues/381                                                                // 4103
    var realSetTimeout = setTimeout;                                                                                   // 4104
                                                                                                                       // 4105
    function makeApi(sinon) {                                                                                          // 4106
                                                                                                                       // 4107
        function log() {}                                                                                              // 4108
                                                                                                                       // 4109
        function logError(label, err) {                                                                                // 4110
            var msg = label + " threw exception: ";                                                                    // 4111
                                                                                                                       // 4112
            sinon.log(msg + "[" + err.name + "] " + err.message);                                                      // 4113
                                                                                                                       // 4114
            if (err.stack) {                                                                                           // 4115
                sinon.log(err.stack);                                                                                  // 4116
            }                                                                                                          // 4117
                                                                                                                       // 4118
            logError.setTimeout(function () {                                                                          // 4119
                err.message = msg + err.message;                                                                       // 4120
                throw err;                                                                                             // 4121
            }, 0);                                                                                                     // 4122
        };                                                                                                             // 4123
                                                                                                                       // 4124
        // wrap realSetTimeout with something we can stub in tests                                                     // 4125
        logError.setTimeout = function (func, timeout) {                                                               // 4126
            realSetTimeout(func, timeout);                                                                             // 4127
        }                                                                                                              // 4128
                                                                                                                       // 4129
        var exports = {};                                                                                              // 4130
        exports.log = sinon.log = log;                                                                                 // 4131
        exports.logError = sinon.logError = logError;                                                                  // 4132
                                                                                                                       // 4133
        return exports;                                                                                                // 4134
    }                                                                                                                  // 4135
                                                                                                                       // 4136
    function loadDependencies(require, exports, module) {                                                              // 4137
        var sinon = require("./util/core");                                                                            // 4138
        module.exports = makeApi(sinon);                                                                               // 4139
    }                                                                                                                  // 4140
                                                                                                                       // 4141
    var isNode = typeof module !== "undefined" && module.exports && typeof require == "function";                      // 4142
    var isAMD = typeof define === "function" && typeof define.amd === "object" && define.amd;                          // 4143
                                                                                                                       // 4144
    if (isAMD) {                                                                                                       // 4145
        define(loadDependencies);                                                                                      // 4146
    } else if (isNode) {                                                                                               // 4147
        loadDependencies(require, module.exports, module);                                                             // 4148
    } else if (!sinon) {                                                                                               // 4149
        return;                                                                                                        // 4150
    } else {                                                                                                           // 4151
        makeApi(sinon);                                                                                                // 4152
    }                                                                                                                  // 4153
}(typeof sinon == "object" && sinon || null));                                                                         // 4154
                                                                                                                       // 4155
/**                                                                                                                    // 4156
 * @depend core.js                                                                                                     // 4157
 * @depend ../extend.js                                                                                                // 4158
 * @depend event.js                                                                                                    // 4159
 * @depend ../log_error.js                                                                                             // 4160
 */                                                                                                                    // 4161
/**                                                                                                                    // 4162
 * Fake XDomainRequest object                                                                                          // 4163
 */                                                                                                                    // 4164
                                                                                                                       // 4165
if (typeof sinon == "undefined") {                                                                                     // 4166
    this.sinon = {};                                                                                                   // 4167
}                                                                                                                      // 4168
                                                                                                                       // 4169
// wrapper for global                                                                                                  // 4170
(function (global) {                                                                                                   // 4171
    var xdr = { XDomainRequest: global.XDomainRequest };                                                               // 4172
    xdr.GlobalXDomainRequest = global.XDomainRequest;                                                                  // 4173
    xdr.supportsXDR = typeof xdr.GlobalXDomainRequest != "undefined";                                                  // 4174
    xdr.workingXDR = xdr.supportsXDR ? xdr.GlobalXDomainRequest :  false;                                              // 4175
                                                                                                                       // 4176
    function makeApi(sinon) {                                                                                          // 4177
        sinon.xdr = xdr;                                                                                               // 4178
                                                                                                                       // 4179
        function FakeXDomainRequest() {                                                                                // 4180
            this.readyState = FakeXDomainRequest.UNSENT;                                                               // 4181
            this.requestBody = null;                                                                                   // 4182
            this.requestHeaders = {};                                                                                  // 4183
            this.status = 0;                                                                                           // 4184
            this.timeout = null;                                                                                       // 4185
                                                                                                                       // 4186
            if (typeof FakeXDomainRequest.onCreate == "function") {                                                    // 4187
                FakeXDomainRequest.onCreate(this);                                                                     // 4188
            }                                                                                                          // 4189
        }                                                                                                              // 4190
                                                                                                                       // 4191
        function verifyState(xdr) {                                                                                    // 4192
            if (xdr.readyState !== FakeXDomainRequest.OPENED) {                                                        // 4193
                throw new Error("INVALID_STATE_ERR");                                                                  // 4194
            }                                                                                                          // 4195
                                                                                                                       // 4196
            if (xdr.sendFlag) {                                                                                        // 4197
                throw new Error("INVALID_STATE_ERR");                                                                  // 4198
            }                                                                                                          // 4199
        }                                                                                                              // 4200
                                                                                                                       // 4201
        function verifyRequestSent(xdr) {                                                                              // 4202
            if (xdr.readyState == FakeXDomainRequest.UNSENT) {                                                         // 4203
                throw new Error("Request not sent");                                                                   // 4204
            }                                                                                                          // 4205
            if (xdr.readyState == FakeXDomainRequest.DONE) {                                                           // 4206
                throw new Error("Request done");                                                                       // 4207
            }                                                                                                          // 4208
        }                                                                                                              // 4209
                                                                                                                       // 4210
        function verifyResponseBodyType(body) {                                                                        // 4211
            if (typeof body != "string") {                                                                             // 4212
                var error = new Error("Attempted to respond to fake XDomainRequest with " +                            // 4213
                                    body + ", which is not a string.");                                                // 4214
                error.name = "InvalidBodyException";                                                                   // 4215
                throw error;                                                                                           // 4216
            }                                                                                                          // 4217
        }                                                                                                              // 4218
                                                                                                                       // 4219
        sinon.extend(FakeXDomainRequest.prototype, sinon.EventTarget, {                                                // 4220
            open: function open(method, url) {                                                                         // 4221
                this.method = method;                                                                                  // 4222
                this.url = url;                                                                                        // 4223
                                                                                                                       // 4224
                this.responseText = null;                                                                              // 4225
                this.sendFlag = false;                                                                                 // 4226
                                                                                                                       // 4227
                this.readyStateChange(FakeXDomainRequest.OPENED);                                                      // 4228
            },                                                                                                         // 4229
                                                                                                                       // 4230
            readyStateChange: function readyStateChange(state) {                                                       // 4231
                this.readyState = state;                                                                               // 4232
                var eventName = "";                                                                                    // 4233
                switch (this.readyState) {                                                                             // 4234
                case FakeXDomainRequest.UNSENT:                                                                        // 4235
                    break;                                                                                             // 4236
                case FakeXDomainRequest.OPENED:                                                                        // 4237
                    break;                                                                                             // 4238
                case FakeXDomainRequest.LOADING:                                                                       // 4239
                    if (this.sendFlag) {                                                                               // 4240
                        //raise the progress event                                                                     // 4241
                        eventName = "onprogress";                                                                      // 4242
                    }                                                                                                  // 4243
                    break;                                                                                             // 4244
                case FakeXDomainRequest.DONE:                                                                          // 4245
                    if (this.isTimeout) {                                                                              // 4246
                        eventName = "ontimeout"                                                                        // 4247
                    } else if (this.errorFlag || (this.status < 200 || this.status > 299)) {                           // 4248
                        eventName = "onerror";                                                                         // 4249
                    } else {                                                                                           // 4250
                        eventName = "onload"                                                                           // 4251
                    }                                                                                                  // 4252
                    break;                                                                                             // 4253
                }                                                                                                      // 4254
                                                                                                                       // 4255
                // raising event (if defined)                                                                          // 4256
                if (eventName) {                                                                                       // 4257
                    if (typeof this[eventName] == "function") {                                                        // 4258
                        try {                                                                                          // 4259
                            this[eventName]();                                                                         // 4260
                        } catch (e) {                                                                                  // 4261
                            sinon.logError("Fake XHR " + eventName + " handler", e);                                   // 4262
                        }                                                                                              // 4263
                    }                                                                                                  // 4264
                }                                                                                                      // 4265
            },                                                                                                         // 4266
                                                                                                                       // 4267
            send: function send(data) {                                                                                // 4268
                verifyState(this);                                                                                     // 4269
                                                                                                                       // 4270
                if (!/^(get|head)$/i.test(this.method)) {                                                              // 4271
                    this.requestBody = data;                                                                           // 4272
                }                                                                                                      // 4273
                this.requestHeaders["Content-Type"] = "text/plain;charset=utf-8";                                      // 4274
                                                                                                                       // 4275
                this.errorFlag = false;                                                                                // 4276
                this.sendFlag = true;                                                                                  // 4277
                this.readyStateChange(FakeXDomainRequest.OPENED);                                                      // 4278
                                                                                                                       // 4279
                if (typeof this.onSend == "function") {                                                                // 4280
                    this.onSend(this);                                                                                 // 4281
                }                                                                                                      // 4282
            },                                                                                                         // 4283
                                                                                                                       // 4284
            abort: function abort() {                                                                                  // 4285
                this.aborted = true;                                                                                   // 4286
                this.responseText = null;                                                                              // 4287
                this.errorFlag = true;                                                                                 // 4288
                                                                                                                       // 4289
                if (this.readyState > sinon.FakeXDomainRequest.UNSENT && this.sendFlag) {                              // 4290
                    this.readyStateChange(sinon.FakeXDomainRequest.DONE);                                              // 4291
                    this.sendFlag = false;                                                                             // 4292
                }                                                                                                      // 4293
            },                                                                                                         // 4294
                                                                                                                       // 4295
            setResponseBody: function setResponseBody(body) {                                                          // 4296
                verifyRequestSent(this);                                                                               // 4297
                verifyResponseBodyType(body);                                                                          // 4298
                                                                                                                       // 4299
                var chunkSize = this.chunkSize || 10;                                                                  // 4300
                var index = 0;                                                                                         // 4301
                this.responseText = "";                                                                                // 4302
                                                                                                                       // 4303
                do {                                                                                                   // 4304
                    this.readyStateChange(FakeXDomainRequest.LOADING);                                                 // 4305
                    this.responseText += body.substring(index, index + chunkSize);                                     // 4306
                    index += chunkSize;                                                                                // 4307
                } while (index < body.length);                                                                         // 4308
                                                                                                                       // 4309
                this.readyStateChange(FakeXDomainRequest.DONE);                                                        // 4310
            },                                                                                                         // 4311
                                                                                                                       // 4312
            respond: function respond(status, contentType, body) {                                                     // 4313
                // content-type ignored, since XDomainRequest does not carry this                                      // 4314
                // we keep the same syntax for respond(...) as for FakeXMLHttpRequest to ease                          // 4315
                // test integration across browsers                                                                    // 4316
                this.status = typeof status == "number" ? status : 200;                                                // 4317
                this.setResponseBody(body || "");                                                                      // 4318
            },                                                                                                         // 4319
                                                                                                                       // 4320
            simulatetimeout: function simulatetimeout() {                                                              // 4321
                this.status = 0;                                                                                       // 4322
                this.isTimeout = true;                                                                                 // 4323
                // Access to this should actually throw an error                                                       // 4324
                this.responseText = undefined;                                                                         // 4325
                this.readyStateChange(FakeXDomainRequest.DONE);                                                        // 4326
            }                                                                                                          // 4327
        });                                                                                                            // 4328
                                                                                                                       // 4329
        sinon.extend(FakeXDomainRequest, {                                                                             // 4330
            UNSENT: 0,                                                                                                 // 4331
            OPENED: 1,                                                                                                 // 4332
            LOADING: 3,                                                                                                // 4333
            DONE: 4                                                                                                    // 4334
        });                                                                                                            // 4335
                                                                                                                       // 4336
        sinon.useFakeXDomainRequest = function useFakeXDomainRequest() {                                               // 4337
            sinon.FakeXDomainRequest.restore = function restore(keepOnCreate) {                                        // 4338
                if (xdr.supportsXDR) {                                                                                 // 4339
                    global.XDomainRequest = xdr.GlobalXDomainRequest;                                                  // 4340
                }                                                                                                      // 4341
                                                                                                                       // 4342
                delete sinon.FakeXDomainRequest.restore;                                                               // 4343
                                                                                                                       // 4344
                if (keepOnCreate !== true) {                                                                           // 4345
                    delete sinon.FakeXDomainRequest.onCreate;                                                          // 4346
                }                                                                                                      // 4347
            };                                                                                                         // 4348
            if (xdr.supportsXDR) {                                                                                     // 4349
                global.XDomainRequest = sinon.FakeXDomainRequest;                                                      // 4350
            }                                                                                                          // 4351
            return sinon.FakeXDomainRequest;                                                                           // 4352
        };                                                                                                             // 4353
                                                                                                                       // 4354
        sinon.FakeXDomainRequest = FakeXDomainRequest;                                                                 // 4355
    }                                                                                                                  // 4356
                                                                                                                       // 4357
    var isNode = typeof module !== "undefined" && module.exports && typeof require == "function";                      // 4358
    var isAMD = typeof define === "function" && typeof define.amd === "object" && define.amd;                          // 4359
                                                                                                                       // 4360
    function loadDependencies(require, exports, module) {                                                              // 4361
        var sinon = require("./core");                                                                                 // 4362
        require("../extend");                                                                                          // 4363
        require("./event");                                                                                            // 4364
        require("../log_error");                                                                                       // 4365
        makeApi(sinon);                                                                                                // 4366
        module.exports = sinon;                                                                                        // 4367
    }                                                                                                                  // 4368
                                                                                                                       // 4369
    if (isAMD) {                                                                                                       // 4370
        define(loadDependencies);                                                                                      // 4371
    } else if (isNode) {                                                                                               // 4372
        loadDependencies(require, module.exports, module);                                                             // 4373
    } else {                                                                                                           // 4374
        makeApi(sinon);                                                                                                // 4375
    }                                                                                                                  // 4376
})(this);                                                                                                              // 4377
                                                                                                                       // 4378
/**                                                                                                                    // 4379
 * @depend core.js                                                                                                     // 4380
 * @depend ../extend.js                                                                                                // 4381
 * @depend event.js                                                                                                    // 4382
 * @depend ../log_error.js                                                                                             // 4383
 */                                                                                                                    // 4384
/**                                                                                                                    // 4385
 * Fake XMLHttpRequest object                                                                                          // 4386
 *                                                                                                                     // 4387
 * @author Christian Johansen (christian@cjohansen.no)                                                                 // 4388
 * @license BSD                                                                                                        // 4389
 *                                                                                                                     // 4390
 * Copyright (c) 2010-2013 Christian Johansen                                                                          // 4391
 */                                                                                                                    // 4392
                                                                                                                       // 4393
(function (global) {                                                                                                   // 4394
                                                                                                                       // 4395
    var supportsProgress = typeof ProgressEvent !== "undefined";                                                       // 4396
    var supportsCustomEvent = typeof CustomEvent !== "undefined";                                                      // 4397
    var sinonXhr = { XMLHttpRequest: global.XMLHttpRequest };                                                          // 4398
    sinonXhr.GlobalXMLHttpRequest = global.XMLHttpRequest;                                                             // 4399
    sinonXhr.GlobalActiveXObject = global.ActiveXObject;                                                               // 4400
    sinonXhr.supportsActiveX = typeof sinonXhr.GlobalActiveXObject != "undefined";                                     // 4401
    sinonXhr.supportsXHR = typeof sinonXhr.GlobalXMLHttpRequest != "undefined";                                        // 4402
    sinonXhr.workingXHR = sinonXhr.supportsXHR ? sinonXhr.GlobalXMLHttpRequest : sinonXhr.supportsActiveX              // 4403
                                     ? function () { return new sinonXhr.GlobalActiveXObject("MSXML2.XMLHTTP.3.0") } : false;
    sinonXhr.supportsCORS = sinonXhr.supportsXHR && "withCredentials" in (new sinonXhr.GlobalXMLHttpRequest());        // 4405
                                                                                                                       // 4406
    /*jsl:ignore*/                                                                                                     // 4407
    var unsafeHeaders = {                                                                                              // 4408
        "Accept-Charset": true,                                                                                        // 4409
        "Accept-Encoding": true,                                                                                       // 4410
        Connection: true,                                                                                              // 4411
        "Content-Length": true,                                                                                        // 4412
        Cookie: true,                                                                                                  // 4413
        Cookie2: true,                                                                                                 // 4414
        "Content-Transfer-Encoding": true,                                                                             // 4415
        Date: true,                                                                                                    // 4416
        Expect: true,                                                                                                  // 4417
        Host: true,                                                                                                    // 4418
        "Keep-Alive": true,                                                                                            // 4419
        Referer: true,                                                                                                 // 4420
        TE: true,                                                                                                      // 4421
        Trailer: true,                                                                                                 // 4422
        "Transfer-Encoding": true,                                                                                     // 4423
        Upgrade: true,                                                                                                 // 4424
        "User-Agent": true,                                                                                            // 4425
        Via: true                                                                                                      // 4426
    };                                                                                                                 // 4427
    /*jsl:end*/                                                                                                        // 4428
                                                                                                                       // 4429
    function FakeXMLHttpRequest() {                                                                                    // 4430
        this.readyState = FakeXMLHttpRequest.UNSENT;                                                                   // 4431
        this.requestHeaders = {};                                                                                      // 4432
        this.requestBody = null;                                                                                       // 4433
        this.status = 0;                                                                                               // 4434
        this.statusText = "";                                                                                          // 4435
        this.upload = new UploadProgress();                                                                            // 4436
        if (sinonXhr.supportsCORS) {                                                                                   // 4437
            this.withCredentials = false;                                                                              // 4438
        }                                                                                                              // 4439
                                                                                                                       // 4440
        var xhr = this;                                                                                                // 4441
        var events = ["loadstart", "load", "abort", "loadend"];                                                        // 4442
                                                                                                                       // 4443
        function addEventListener(eventName) {                                                                         // 4444
            xhr.addEventListener(eventName, function (event) {                                                         // 4445
                var listener = xhr["on" + eventName];                                                                  // 4446
                                                                                                                       // 4447
                if (listener && typeof listener == "function") {                                                       // 4448
                    listener.call(this, event);                                                                        // 4449
                }                                                                                                      // 4450
            });                                                                                                        // 4451
        }                                                                                                              // 4452
                                                                                                                       // 4453
        for (var i = events.length - 1; i >= 0; i--) {                                                                 // 4454
            addEventListener(events[i]);                                                                               // 4455
        }                                                                                                              // 4456
                                                                                                                       // 4457
        if (typeof FakeXMLHttpRequest.onCreate == "function") {                                                        // 4458
            FakeXMLHttpRequest.onCreate(this);                                                                         // 4459
        }                                                                                                              // 4460
    }                                                                                                                  // 4461
                                                                                                                       // 4462
    // An upload object is created for each                                                                            // 4463
    // FakeXMLHttpRequest and allows upload                                                                            // 4464
    // events to be simulated using uploadProgress                                                                     // 4465
    // and uploadError.                                                                                                // 4466
    function UploadProgress() {                                                                                        // 4467
        this.eventListeners = {                                                                                        // 4468
            progress: [],                                                                                              // 4469
            load: [],                                                                                                  // 4470
            abort: [],                                                                                                 // 4471
            error: []                                                                                                  // 4472
        }                                                                                                              // 4473
    }                                                                                                                  // 4474
                                                                                                                       // 4475
    UploadProgress.prototype.addEventListener = function addEventListener(event, listener) {                           // 4476
        this.eventListeners[event].push(listener);                                                                     // 4477
    };                                                                                                                 // 4478
                                                                                                                       // 4479
    UploadProgress.prototype.removeEventListener = function removeEventListener(event, listener) {                     // 4480
        var listeners = this.eventListeners[event] || [];                                                              // 4481
                                                                                                                       // 4482
        for (var i = 0, l = listeners.length; i < l; ++i) {                                                            // 4483
            if (listeners[i] == listener) {                                                                            // 4484
                return listeners.splice(i, 1);                                                                         // 4485
            }                                                                                                          // 4486
        }                                                                                                              // 4487
    };                                                                                                                 // 4488
                                                                                                                       // 4489
    UploadProgress.prototype.dispatchEvent = function dispatchEvent(event) {                                           // 4490
        var listeners = this.eventListeners[event.type] || [];                                                         // 4491
                                                                                                                       // 4492
        for (var i = 0, listener; (listener = listeners[i]) != null; i++) {                                            // 4493
            listener(event);                                                                                           // 4494
        }                                                                                                              // 4495
    };                                                                                                                 // 4496
                                                                                                                       // 4497
    function verifyState(xhr) {                                                                                        // 4498
        if (xhr.readyState !== FakeXMLHttpRequest.OPENED) {                                                            // 4499
            throw new Error("INVALID_STATE_ERR");                                                                      // 4500
        }                                                                                                              // 4501
                                                                                                                       // 4502
        if (xhr.sendFlag) {                                                                                            // 4503
            throw new Error("INVALID_STATE_ERR");                                                                      // 4504
        }                                                                                                              // 4505
    }                                                                                                                  // 4506
                                                                                                                       // 4507
    function getHeader(headers, header) {                                                                              // 4508
        header = header.toLowerCase();                                                                                 // 4509
                                                                                                                       // 4510
        for (var h in headers) {                                                                                       // 4511
            if (h.toLowerCase() == header) {                                                                           // 4512
                return h;                                                                                              // 4513
            }                                                                                                          // 4514
        }                                                                                                              // 4515
                                                                                                                       // 4516
        return null;                                                                                                   // 4517
    }                                                                                                                  // 4518
                                                                                                                       // 4519
    // filtering to enable a white-list version of Sinon FakeXhr,                                                      // 4520
    // where whitelisted requests are passed through to real XHR                                                       // 4521
    function each(collection, callback) {                                                                              // 4522
        if (!collection) {                                                                                             // 4523
            return;                                                                                                    // 4524
        }                                                                                                              // 4525
                                                                                                                       // 4526
        for (var i = 0, l = collection.length; i < l; i += 1) {                                                        // 4527
            callback(collection[i]);                                                                                   // 4528
        }                                                                                                              // 4529
    }                                                                                                                  // 4530
    function some(collection, callback) {                                                                              // 4531
        for (var index = 0; index < collection.length; index++) {                                                      // 4532
            if (callback(collection[index]) === true) {                                                                // 4533
                return true;                                                                                           // 4534
            }                                                                                                          // 4535
        }                                                                                                              // 4536
        return false;                                                                                                  // 4537
    }                                                                                                                  // 4538
    // largest arity in XHR is 5 - XHR#open                                                                            // 4539
    var apply = function (obj, method, args) {                                                                         // 4540
        switch (args.length) {                                                                                         // 4541
        case 0: return obj[method]();                                                                                  // 4542
        case 1: return obj[method](args[0]);                                                                           // 4543
        case 2: return obj[method](args[0], args[1]);                                                                  // 4544
        case 3: return obj[method](args[0], args[1], args[2]);                                                         // 4545
        case 4: return obj[method](args[0], args[1], args[2], args[3]);                                                // 4546
        case 5: return obj[method](args[0], args[1], args[2], args[3], args[4]);                                       // 4547
        }                                                                                                              // 4548
    };                                                                                                                 // 4549
                                                                                                                       // 4550
    FakeXMLHttpRequest.filters = [];                                                                                   // 4551
    FakeXMLHttpRequest.addFilter = function addFilter(fn) {                                                            // 4552
        this.filters.push(fn)                                                                                          // 4553
    };                                                                                                                 // 4554
    var IE6Re = /MSIE 6/;                                                                                              // 4555
    FakeXMLHttpRequest.defake = function defake(fakeXhr, xhrArgs) {                                                    // 4556
        var xhr = new sinonXhr.workingXHR();                                                                           // 4557
        each([                                                                                                         // 4558
            "open",                                                                                                    // 4559
            "setRequestHeader",                                                                                        // 4560
            "send",                                                                                                    // 4561
            "abort",                                                                                                   // 4562
            "getResponseHeader",                                                                                       // 4563
            "getAllResponseHeaders",                                                                                   // 4564
            "addEventListener",                                                                                        // 4565
            "overrideMimeType",                                                                                        // 4566
            "removeEventListener"                                                                                      // 4567
        ], function (method) {                                                                                         // 4568
            fakeXhr[method] = function () {                                                                            // 4569
                return apply(xhr, method, arguments);                                                                  // 4570
            };                                                                                                         // 4571
        });                                                                                                            // 4572
                                                                                                                       // 4573
        var copyAttrs = function (args) {                                                                              // 4574
            each(args, function (attr) {                                                                               // 4575
                try {                                                                                                  // 4576
                    fakeXhr[attr] = xhr[attr]                                                                          // 4577
                } catch (e) {                                                                                          // 4578
                    if (!IE6Re.test(navigator.userAgent)) {                                                            // 4579
                        throw e;                                                                                       // 4580
                    }                                                                                                  // 4581
                }                                                                                                      // 4582
            });                                                                                                        // 4583
        };                                                                                                             // 4584
                                                                                                                       // 4585
        var stateChange = function stateChange() {                                                                     // 4586
            fakeXhr.readyState = xhr.readyState;                                                                       // 4587
            if (xhr.readyState >= FakeXMLHttpRequest.HEADERS_RECEIVED) {                                               // 4588
                copyAttrs(["status", "statusText"]);                                                                   // 4589
            }                                                                                                          // 4590
            if (xhr.readyState >= FakeXMLHttpRequest.LOADING) {                                                        // 4591
                copyAttrs(["responseText", "response"]);                                                               // 4592
            }                                                                                                          // 4593
            if (xhr.readyState === FakeXMLHttpRequest.DONE) {                                                          // 4594
                copyAttrs(["responseXML"]);                                                                            // 4595
            }                                                                                                          // 4596
            if (fakeXhr.onreadystatechange) {                                                                          // 4597
                fakeXhr.onreadystatechange.call(fakeXhr, { target: fakeXhr });                                         // 4598
            }                                                                                                          // 4599
        };                                                                                                             // 4600
                                                                                                                       // 4601
        if (xhr.addEventListener) {                                                                                    // 4602
            for (var event in fakeXhr.eventListeners) {                                                                // 4603
                if (fakeXhr.eventListeners.hasOwnProperty(event)) {                                                    // 4604
                    each(fakeXhr.eventListeners[event], function (handler) {                                           // 4605
                        xhr.addEventListener(event, handler);                                                          // 4606
                    });                                                                                                // 4607
                }                                                                                                      // 4608
            }                                                                                                          // 4609
            xhr.addEventListener("readystatechange", stateChange);                                                     // 4610
        } else {                                                                                                       // 4611
            xhr.onreadystatechange = stateChange;                                                                      // 4612
        }                                                                                                              // 4613
        apply(xhr, "open", xhrArgs);                                                                                   // 4614
    };                                                                                                                 // 4615
    FakeXMLHttpRequest.useFilters = false;                                                                             // 4616
                                                                                                                       // 4617
    function verifyRequestOpened(xhr) {                                                                                // 4618
        if (xhr.readyState != FakeXMLHttpRequest.OPENED) {                                                             // 4619
            throw new Error("INVALID_STATE_ERR - " + xhr.readyState);                                                  // 4620
        }                                                                                                              // 4621
    }                                                                                                                  // 4622
                                                                                                                       // 4623
    function verifyRequestSent(xhr) {                                                                                  // 4624
        if (xhr.readyState == FakeXMLHttpRequest.DONE) {                                                               // 4625
            throw new Error("Request done");                                                                           // 4626
        }                                                                                                              // 4627
    }                                                                                                                  // 4628
                                                                                                                       // 4629
    function verifyHeadersReceived(xhr) {                                                                              // 4630
        if (xhr.async && xhr.readyState != FakeXMLHttpRequest.HEADERS_RECEIVED) {                                      // 4631
            throw new Error("No headers received");                                                                    // 4632
        }                                                                                                              // 4633
    }                                                                                                                  // 4634
                                                                                                                       // 4635
    function verifyResponseBodyType(body) {                                                                            // 4636
        if (typeof body != "string") {                                                                                 // 4637
            var error = new Error("Attempted to respond to fake XMLHttpRequest with " +                                // 4638
                                 body + ", which is not a string.");                                                   // 4639
            error.name = "InvalidBodyException";                                                                       // 4640
            throw error;                                                                                               // 4641
        }                                                                                                              // 4642
    }                                                                                                                  // 4643
                                                                                                                       // 4644
    FakeXMLHttpRequest.parseXML = function parseXML(text) {                                                            // 4645
        var xmlDoc;                                                                                                    // 4646
                                                                                                                       // 4647
        if (typeof DOMParser != "undefined") {                                                                         // 4648
            var parser = new DOMParser();                                                                              // 4649
            xmlDoc = parser.parseFromString(text, "text/xml");                                                         // 4650
        } else {                                                                                                       // 4651
            xmlDoc = new ActiveXObject("Microsoft.XMLDOM");                                                            // 4652
            xmlDoc.async = "false";                                                                                    // 4653
            xmlDoc.loadXML(text);                                                                                      // 4654
        }                                                                                                              // 4655
                                                                                                                       // 4656
        return xmlDoc;                                                                                                 // 4657
    };                                                                                                                 // 4658
                                                                                                                       // 4659
    FakeXMLHttpRequest.statusCodes = {                                                                                 // 4660
        100: "Continue",                                                                                               // 4661
        101: "Switching Protocols",                                                                                    // 4662
        200: "OK",                                                                                                     // 4663
        201: "Created",                                                                                                // 4664
        202: "Accepted",                                                                                               // 4665
        203: "Non-Authoritative Information",                                                                          // 4666
        204: "No Content",                                                                                             // 4667
        205: "Reset Content",                                                                                          // 4668
        206: "Partial Content",                                                                                        // 4669
        207: "Multi-Status",                                                                                           // 4670
        300: "Multiple Choice",                                                                                        // 4671
        301: "Moved Permanently",                                                                                      // 4672
        302: "Found",                                                                                                  // 4673
        303: "See Other",                                                                                              // 4674
        304: "Not Modified",                                                                                           // 4675
        305: "Use Proxy",                                                                                              // 4676
        307: "Temporary Redirect",                                                                                     // 4677
        400: "Bad Request",                                                                                            // 4678
        401: "Unauthorized",                                                                                           // 4679
        402: "Payment Required",                                                                                       // 4680
        403: "Forbidden",                                                                                              // 4681
        404: "Not Found",                                                                                              // 4682
        405: "Method Not Allowed",                                                                                     // 4683
        406: "Not Acceptable",                                                                                         // 4684
        407: "Proxy Authentication Required",                                                                          // 4685
        408: "Request Timeout",                                                                                        // 4686
        409: "Conflict",                                                                                               // 4687
        410: "Gone",                                                                                                   // 4688
        411: "Length Required",                                                                                        // 4689
        412: "Precondition Failed",                                                                                    // 4690
        413: "Request Entity Too Large",                                                                               // 4691
        414: "Request-URI Too Long",                                                                                   // 4692
        415: "Unsupported Media Type",                                                                                 // 4693
        416: "Requested Range Not Satisfiable",                                                                        // 4694
        417: "Expectation Failed",                                                                                     // 4695
        422: "Unprocessable Entity",                                                                                   // 4696
        500: "Internal Server Error",                                                                                  // 4697
        501: "Not Implemented",                                                                                        // 4698
        502: "Bad Gateway",                                                                                            // 4699
        503: "Service Unavailable",                                                                                    // 4700
        504: "Gateway Timeout",                                                                                        // 4701
        505: "HTTP Version Not Supported"                                                                              // 4702
    };                                                                                                                 // 4703
                                                                                                                       // 4704
    function makeApi(sinon) {                                                                                          // 4705
        sinon.xhr = sinonXhr;                                                                                          // 4706
                                                                                                                       // 4707
        sinon.extend(FakeXMLHttpRequest.prototype, sinon.EventTarget, {                                                // 4708
            async: true,                                                                                               // 4709
                                                                                                                       // 4710
            open: function open(method, url, async, username, password) {                                              // 4711
                this.method = method;                                                                                  // 4712
                this.url = url;                                                                                        // 4713
                this.async = typeof async == "boolean" ? async : true;                                                 // 4714
                this.username = username;                                                                              // 4715
                this.password = password;                                                                              // 4716
                this.responseText = null;                                                                              // 4717
                this.responseXML = null;                                                                               // 4718
                this.requestHeaders = {};                                                                              // 4719
                this.sendFlag = false;                                                                                 // 4720
                                                                                                                       // 4721
                if (FakeXMLHttpRequest.useFilters === true) {                                                          // 4722
                    var xhrArgs = arguments;                                                                           // 4723
                    var defake = some(FakeXMLHttpRequest.filters, function (filter) {                                  // 4724
                        return filter.apply(this, xhrArgs)                                                             // 4725
                    });                                                                                                // 4726
                    if (defake) {                                                                                      // 4727
                        return FakeXMLHttpRequest.defake(this, arguments);                                             // 4728
                    }                                                                                                  // 4729
                }                                                                                                      // 4730
                this.readyStateChange(FakeXMLHttpRequest.OPENED);                                                      // 4731
            },                                                                                                         // 4732
                                                                                                                       // 4733
            readyStateChange: function readyStateChange(state) {                                                       // 4734
                this.readyState = state;                                                                               // 4735
                                                                                                                       // 4736
                if (typeof this.onreadystatechange == "function") {                                                    // 4737
                    try {                                                                                              // 4738
                        this.onreadystatechange();                                                                     // 4739
                    } catch (e) {                                                                                      // 4740
                        sinon.logError("Fake XHR onreadystatechange handler", e);                                      // 4741
                    }                                                                                                  // 4742
                }                                                                                                      // 4743
                                                                                                                       // 4744
                this.dispatchEvent(new sinon.Event("readystatechange"));                                               // 4745
                                                                                                                       // 4746
                switch (this.readyState) {                                                                             // 4747
                    case FakeXMLHttpRequest.DONE:                                                                      // 4748
                        this.dispatchEvent(new sinon.Event("load", false, false, this));                               // 4749
                        this.dispatchEvent(new sinon.Event("loadend", false, false, this));                            // 4750
                        this.upload.dispatchEvent(new sinon.Event("load", false, false, this));                        // 4751
                        if (supportsProgress) {                                                                        // 4752
                            this.upload.dispatchEvent(new sinon.ProgressEvent("progress", {loaded: 100, total: 100})); // 4753
                            this.dispatchEvent(new sinon.ProgressEvent("progress", {loaded: 100, total: 100}));        // 4754
                        }                                                                                              // 4755
                        break;                                                                                         // 4756
                }                                                                                                      // 4757
            },                                                                                                         // 4758
                                                                                                                       // 4759
            setRequestHeader: function setRequestHeader(header, value) {                                               // 4760
                verifyState(this);                                                                                     // 4761
                                                                                                                       // 4762
                if (unsafeHeaders[header] || /^(Sec-|Proxy-)/.test(header)) {                                          // 4763
                    throw new Error("Refused to set unsafe header \"" + header + "\"");                                // 4764
                }                                                                                                      // 4765
                                                                                                                       // 4766
                if (this.requestHeaders[header]) {                                                                     // 4767
                    this.requestHeaders[header] += "," + value;                                                        // 4768
                } else {                                                                                               // 4769
                    this.requestHeaders[header] = value;                                                               // 4770
                }                                                                                                      // 4771
            },                                                                                                         // 4772
                                                                                                                       // 4773
            // Helps testing                                                                                           // 4774
            setResponseHeaders: function setResponseHeaders(headers) {                                                 // 4775
                verifyRequestOpened(this);                                                                             // 4776
                this.responseHeaders = {};                                                                             // 4777
                                                                                                                       // 4778
                for (var header in headers) {                                                                          // 4779
                    if (headers.hasOwnProperty(header)) {                                                              // 4780
                        this.responseHeaders[header] = headers[header];                                                // 4781
                    }                                                                                                  // 4782
                }                                                                                                      // 4783
                                                                                                                       // 4784
                if (this.async) {                                                                                      // 4785
                    this.readyStateChange(FakeXMLHttpRequest.HEADERS_RECEIVED);                                        // 4786
                } else {                                                                                               // 4787
                    this.readyState = FakeXMLHttpRequest.HEADERS_RECEIVED;                                             // 4788
                }                                                                                                      // 4789
            },                                                                                                         // 4790
                                                                                                                       // 4791
            // Currently treats ALL data as a DOMString (i.e. no Document)                                             // 4792
            send: function send(data) {                                                                                // 4793
                verifyState(this);                                                                                     // 4794
                                                                                                                       // 4795
                if (!/^(get|head)$/i.test(this.method)) {                                                              // 4796
                    var contentType = getHeader(this.requestHeaders, "Content-Type");                                  // 4797
                    if (this.requestHeaders[contentType]) {                                                            // 4798
                        var value = this.requestHeaders[contentType].split(";");                                       // 4799
                        this.requestHeaders[contentType] = value[0] + ";charset=utf-8";                                // 4800
                    } else if (!(data instanceof FormData)) {                                                          // 4801
                        this.requestHeaders["Content-Type"] = "text/plain;charset=utf-8";                              // 4802
                    }                                                                                                  // 4803
                                                                                                                       // 4804
                    this.requestBody = data;                                                                           // 4805
                }                                                                                                      // 4806
                                                                                                                       // 4807
                this.errorFlag = false;                                                                                // 4808
                this.sendFlag = this.async;                                                                            // 4809
                this.readyStateChange(FakeXMLHttpRequest.OPENED);                                                      // 4810
                                                                                                                       // 4811
                if (typeof this.onSend == "function") {                                                                // 4812
                    this.onSend(this);                                                                                 // 4813
                }                                                                                                      // 4814
                                                                                                                       // 4815
                this.dispatchEvent(new sinon.Event("loadstart", false, false, this));                                  // 4816
            },                                                                                                         // 4817
                                                                                                                       // 4818
            abort: function abort() {                                                                                  // 4819
                this.aborted = true;                                                                                   // 4820
                this.responseText = null;                                                                              // 4821
                this.errorFlag = true;                                                                                 // 4822
                this.requestHeaders = {};                                                                              // 4823
                                                                                                                       // 4824
                if (this.readyState > FakeXMLHttpRequest.UNSENT && this.sendFlag) {                                    // 4825
                    this.readyStateChange(FakeXMLHttpRequest.DONE);                                                    // 4826
                    this.sendFlag = false;                                                                             // 4827
                }                                                                                                      // 4828
                                                                                                                       // 4829
                this.readyState = FakeXMLHttpRequest.UNSENT;                                                           // 4830
                                                                                                                       // 4831
                this.dispatchEvent(new sinon.Event("abort", false, false, this));                                      // 4832
                                                                                                                       // 4833
                this.upload.dispatchEvent(new sinon.Event("abort", false, false, this));                               // 4834
                                                                                                                       // 4835
                if (typeof this.onerror === "function") {                                                              // 4836
                    this.onerror();                                                                                    // 4837
                }                                                                                                      // 4838
            },                                                                                                         // 4839
                                                                                                                       // 4840
            getResponseHeader: function getResponseHeader(header) {                                                    // 4841
                if (this.readyState < FakeXMLHttpRequest.HEADERS_RECEIVED) {                                           // 4842
                    return null;                                                                                       // 4843
                }                                                                                                      // 4844
                                                                                                                       // 4845
                if (/^Set-Cookie2?$/i.test(header)) {                                                                  // 4846
                    return null;                                                                                       // 4847
                }                                                                                                      // 4848
                                                                                                                       // 4849
                header = getHeader(this.responseHeaders, header);                                                      // 4850
                                                                                                                       // 4851
                return this.responseHeaders[header] || null;                                                           // 4852
            },                                                                                                         // 4853
                                                                                                                       // 4854
            getAllResponseHeaders: function getAllResponseHeaders() {                                                  // 4855
                if (this.readyState < FakeXMLHttpRequest.HEADERS_RECEIVED) {                                           // 4856
                    return "";                                                                                         // 4857
                }                                                                                                      // 4858
                                                                                                                       // 4859
                var headers = "";                                                                                      // 4860
                                                                                                                       // 4861
                for (var header in this.responseHeaders) {                                                             // 4862
                    if (this.responseHeaders.hasOwnProperty(header) &&                                                 // 4863
                        !/^Set-Cookie2?$/i.test(header)) {                                                             // 4864
                        headers += header + ": " + this.responseHeaders[header] + "\r\n";                              // 4865
                    }                                                                                                  // 4866
                }                                                                                                      // 4867
                                                                                                                       // 4868
                return headers;                                                                                        // 4869
            },                                                                                                         // 4870
                                                                                                                       // 4871
            setResponseBody: function setResponseBody(body) {                                                          // 4872
                verifyRequestSent(this);                                                                               // 4873
                verifyHeadersReceived(this);                                                                           // 4874
                verifyResponseBodyType(body);                                                                          // 4875
                                                                                                                       // 4876
                var chunkSize = this.chunkSize || 10;                                                                  // 4877
                var index = 0;                                                                                         // 4878
                this.responseText = "";                                                                                // 4879
                                                                                                                       // 4880
                do {                                                                                                   // 4881
                    if (this.async) {                                                                                  // 4882
                        this.readyStateChange(FakeXMLHttpRequest.LOADING);                                             // 4883
                    }                                                                                                  // 4884
                                                                                                                       // 4885
                    this.responseText += body.substring(index, index + chunkSize);                                     // 4886
                    index += chunkSize;                                                                                // 4887
                } while (index < body.length);                                                                         // 4888
                                                                                                                       // 4889
                var type = this.getResponseHeader("Content-Type");                                                     // 4890
                                                                                                                       // 4891
                if (this.responseText &&                                                                               // 4892
                    (!type || /(text\/xml)|(application\/xml)|(\+xml)/.test(type))) {                                  // 4893
                    try {                                                                                              // 4894
                        this.responseXML = FakeXMLHttpRequest.parseXML(this.responseText);                             // 4895
                    } catch (e) {                                                                                      // 4896
                        // Unable to parse XML - no biggie                                                             // 4897
                    }                                                                                                  // 4898
                }                                                                                                      // 4899
                                                                                                                       // 4900
                this.readyStateChange(FakeXMLHttpRequest.DONE);                                                        // 4901
            },                                                                                                         // 4902
                                                                                                                       // 4903
            respond: function respond(status, headers, body) {                                                         // 4904
                this.status = typeof status == "number" ? status : 200;                                                // 4905
                this.statusText = FakeXMLHttpRequest.statusCodes[this.status];                                         // 4906
                this.setResponseHeaders(headers || {});                                                                // 4907
                this.setResponseBody(body || "");                                                                      // 4908
            },                                                                                                         // 4909
                                                                                                                       // 4910
            uploadProgress: function uploadProgress(progressEventRaw) {                                                // 4911
                if (supportsProgress) {                                                                                // 4912
                    this.upload.dispatchEvent(new sinon.ProgressEvent("progress", progressEventRaw));                  // 4913
                }                                                                                                      // 4914
            },                                                                                                         // 4915
                                                                                                                       // 4916
            downloadProgress: function downloadProgress(progressEventRaw) {                                            // 4917
                if (supportsProgress) {                                                                                // 4918
                    this.dispatchEvent(new sinon.ProgressEvent("progress", progressEventRaw));                         // 4919
                }                                                                                                      // 4920
            },                                                                                                         // 4921
                                                                                                                       // 4922
            uploadError: function uploadError(error) {                                                                 // 4923
                if (supportsCustomEvent) {                                                                             // 4924
                    this.upload.dispatchEvent(new sinon.CustomEvent("error", {detail: error}));                        // 4925
                }                                                                                                      // 4926
            }                                                                                                          // 4927
        });                                                                                                            // 4928
                                                                                                                       // 4929
        sinon.extend(FakeXMLHttpRequest, {                                                                             // 4930
            UNSENT: 0,                                                                                                 // 4931
            OPENED: 1,                                                                                                 // 4932
            HEADERS_RECEIVED: 2,                                                                                       // 4933
            LOADING: 3,                                                                                                // 4934
            DONE: 4                                                                                                    // 4935
        });                                                                                                            // 4936
                                                                                                                       // 4937
        sinon.useFakeXMLHttpRequest = function () {                                                                    // 4938
            FakeXMLHttpRequest.restore = function restore(keepOnCreate) {                                              // 4939
                if (sinonXhr.supportsXHR) {                                                                            // 4940
                    global.XMLHttpRequest = sinonXhr.GlobalXMLHttpRequest;                                             // 4941
                }                                                                                                      // 4942
                                                                                                                       // 4943
                if (sinonXhr.supportsActiveX) {                                                                        // 4944
                    global.ActiveXObject = sinonXhr.GlobalActiveXObject;                                               // 4945
                }                                                                                                      // 4946
                                                                                                                       // 4947
                delete FakeXMLHttpRequest.restore;                                                                     // 4948
                                                                                                                       // 4949
                if (keepOnCreate !== true) {                                                                           // 4950
                    delete FakeXMLHttpRequest.onCreate;                                                                // 4951
                }                                                                                                      // 4952
            };                                                                                                         // 4953
            if (sinonXhr.supportsXHR) {                                                                                // 4954
                global.XMLHttpRequest = FakeXMLHttpRequest;                                                            // 4955
            }                                                                                                          // 4956
                                                                                                                       // 4957
            if (sinonXhr.supportsActiveX) {                                                                            // 4958
                global.ActiveXObject = function ActiveXObject(objId) {                                                 // 4959
                    if (objId == "Microsoft.XMLHTTP" || /^Msxml2\.XMLHTTP/i.test(objId)) {                             // 4960
                                                                                                                       // 4961
                        return new FakeXMLHttpRequest();                                                               // 4962
                    }                                                                                                  // 4963
                                                                                                                       // 4964
                    return new sinonXhr.GlobalActiveXObject(objId);                                                    // 4965
                };                                                                                                     // 4966
            }                                                                                                          // 4967
                                                                                                                       // 4968
            return FakeXMLHttpRequest;                                                                                 // 4969
        };                                                                                                             // 4970
                                                                                                                       // 4971
        sinon.FakeXMLHttpRequest = FakeXMLHttpRequest;                                                                 // 4972
    }                                                                                                                  // 4973
                                                                                                                       // 4974
    var isNode = typeof module !== "undefined" && module.exports && typeof require == "function";                      // 4975
    var isAMD = typeof define === "function" && typeof define.amd === "object" && define.amd;                          // 4976
                                                                                                                       // 4977
    function loadDependencies(require, exports, module) {                                                              // 4978
        var sinon = require("./core");                                                                                 // 4979
        require("../extend");                                                                                          // 4980
        require("./event");                                                                                            // 4981
        require("../log_error");                                                                                       // 4982
        makeApi(sinon);                                                                                                // 4983
        module.exports = sinon;                                                                                        // 4984
    }                                                                                                                  // 4985
                                                                                                                       // 4986
    if (isAMD) {                                                                                                       // 4987
        define(loadDependencies);                                                                                      // 4988
    } else if (isNode) {                                                                                               // 4989
        loadDependencies(require, module.exports, module);                                                             // 4990
    } else if (typeof sinon === "undefined") {                                                                         // 4991
        return;                                                                                                        // 4992
    } else {                                                                                                           // 4993
        makeApi(sinon);                                                                                                // 4994
    }                                                                                                                  // 4995
                                                                                                                       // 4996
})(typeof global !== "undefined" ? global : this);                                                                     // 4997
                                                                                                                       // 4998
/**                                                                                                                    // 4999
 * @depend fake_xdomain_request.js                                                                                     // 5000
 * @depend fake_xml_http_request.js                                                                                    // 5001
 * @depend ../format.js                                                                                                // 5002
 * @depend ../log_error.js                                                                                             // 5003
 */                                                                                                                    // 5004
/**                                                                                                                    // 5005
 * The Sinon "server" mimics a web server that receives requests from                                                  // 5006
 * sinon.FakeXMLHttpRequest and provides an API to respond to those requests,                                          // 5007
 * both synchronously and asynchronously. To respond synchronuously, canned                                            // 5008
 * answers have to be provided upfront.                                                                                // 5009
 *                                                                                                                     // 5010
 * @author Christian Johansen (christian@cjohansen.no)                                                                 // 5011
 * @license BSD                                                                                                        // 5012
 *                                                                                                                     // 5013
 * Copyright (c) 2010-2013 Christian Johansen                                                                          // 5014
 */                                                                                                                    // 5015
                                                                                                                       // 5016
if (typeof sinon == "undefined") {                                                                                     // 5017
    var sinon = {};                                                                                                    // 5018
}                                                                                                                      // 5019
                                                                                                                       // 5020
(function () {                                                                                                         // 5021
    var push = [].push;                                                                                                // 5022
    function F() {}                                                                                                    // 5023
                                                                                                                       // 5024
    function create(proto) {                                                                                           // 5025
        F.prototype = proto;                                                                                           // 5026
        return new F();                                                                                                // 5027
    }                                                                                                                  // 5028
                                                                                                                       // 5029
    function responseArray(handler) {                                                                                  // 5030
        var response = handler;                                                                                        // 5031
                                                                                                                       // 5032
        if (Object.prototype.toString.call(handler) != "[object Array]") {                                             // 5033
            response = [200, {}, handler];                                                                             // 5034
        }                                                                                                              // 5035
                                                                                                                       // 5036
        if (typeof response[2] != "string") {                                                                          // 5037
            throw new TypeError("Fake server response body should be string, but was " +                               // 5038
                                typeof response[2]);                                                                   // 5039
        }                                                                                                              // 5040
                                                                                                                       // 5041
        return response;                                                                                               // 5042
    }                                                                                                                  // 5043
                                                                                                                       // 5044
    var wloc = typeof window !== "undefined" ? window.location : {};                                                   // 5045
    var rCurrLoc = new RegExp("^" + wloc.protocol + "//" + wloc.host);                                                 // 5046
                                                                                                                       // 5047
    function matchOne(response, reqMethod, reqUrl) {                                                                   // 5048
        var rmeth = response.method;                                                                                   // 5049
        var matchMethod = !rmeth || rmeth.toLowerCase() == reqMethod.toLowerCase();                                    // 5050
        var url = response.url;                                                                                        // 5051
        var matchUrl = !url || url == reqUrl || (typeof url.test == "function" && url.test(reqUrl));                   // 5052
                                                                                                                       // 5053
        return matchMethod && matchUrl;                                                                                // 5054
    }                                                                                                                  // 5055
                                                                                                                       // 5056
    function match(response, request) {                                                                                // 5057
        var requestUrl = request.url;                                                                                  // 5058
                                                                                                                       // 5059
        if (!/^https?:\/\//.test(requestUrl) || rCurrLoc.test(requestUrl)) {                                           // 5060
            requestUrl = requestUrl.replace(rCurrLoc, "");                                                             // 5061
        }                                                                                                              // 5062
                                                                                                                       // 5063
        if (matchOne(response, this.getHTTPMethod(request), requestUrl)) {                                             // 5064
            if (typeof response.response == "function") {                                                              // 5065
                var ru = response.url;                                                                                 // 5066
                var args = [request].concat(ru && typeof ru.exec == "function" ? ru.exec(requestUrl).slice(1) : []);   // 5067
                return response.response.apply(response, args);                                                        // 5068
            }                                                                                                          // 5069
                                                                                                                       // 5070
            return true;                                                                                               // 5071
        }                                                                                                              // 5072
                                                                                                                       // 5073
        return false;                                                                                                  // 5074
    }                                                                                                                  // 5075
                                                                                                                       // 5076
    function makeApi(sinon) {                                                                                          // 5077
        sinon.fakeServer = {                                                                                           // 5078
            create: function () {                                                                                      // 5079
                var server = create(this);                                                                             // 5080
                if (!sinon.xhr.supportsCORS) {                                                                         // 5081
                    this.xhr = sinon.useFakeXDomainRequest();                                                          // 5082
                } else {                                                                                               // 5083
                    this.xhr = sinon.useFakeXMLHttpRequest();                                                          // 5084
                }                                                                                                      // 5085
                server.requests = [];                                                                                  // 5086
                                                                                                                       // 5087
                this.xhr.onCreate = function (xhrObj) {                                                                // 5088
                    server.addRequest(xhrObj);                                                                         // 5089
                };                                                                                                     // 5090
                                                                                                                       // 5091
                return server;                                                                                         // 5092
            },                                                                                                         // 5093
                                                                                                                       // 5094
            addRequest: function addRequest(xhrObj) {                                                                  // 5095
                var server = this;                                                                                     // 5096
                push.call(this.requests, xhrObj);                                                                      // 5097
                                                                                                                       // 5098
                xhrObj.onSend = function () {                                                                          // 5099
                    server.handleRequest(this);                                                                        // 5100
                                                                                                                       // 5101
                    if (server.respondImmediately) {                                                                   // 5102
                        server.respond();                                                                              // 5103
                    } else if (server.autoRespond && !server.responding) {                                             // 5104
                        setTimeout(function () {                                                                       // 5105
                            server.responding = false;                                                                 // 5106
                            server.respond();                                                                          // 5107
                        }, server.autoRespondAfter || 10);                                                             // 5108
                                                                                                                       // 5109
                        server.responding = true;                                                                      // 5110
                    }                                                                                                  // 5111
                };                                                                                                     // 5112
            },                                                                                                         // 5113
                                                                                                                       // 5114
            getHTTPMethod: function getHTTPMethod(request) {                                                           // 5115
                if (this.fakeHTTPMethods && /post/i.test(request.method)) {                                            // 5116
                    var matches = (request.requestBody || "").match(/_method=([^\b;]+)/);                              // 5117
                    return !!matches ? matches[1] : request.method;                                                    // 5118
                }                                                                                                      // 5119
                                                                                                                       // 5120
                return request.method;                                                                                 // 5121
            },                                                                                                         // 5122
                                                                                                                       // 5123
            handleRequest: function handleRequest(xhr) {                                                               // 5124
                if (xhr.async) {                                                                                       // 5125
                    if (!this.queue) {                                                                                 // 5126
                        this.queue = [];                                                                               // 5127
                    }                                                                                                  // 5128
                                                                                                                       // 5129
                    push.call(this.queue, xhr);                                                                        // 5130
                } else {                                                                                               // 5131
                    this.processRequest(xhr);                                                                          // 5132
                }                                                                                                      // 5133
            },                                                                                                         // 5134
                                                                                                                       // 5135
            log: function log(response, request) {                                                                     // 5136
                var str;                                                                                               // 5137
                                                                                                                       // 5138
                str =  "Request:\n"  + sinon.format(request)  + "\n\n";                                                // 5139
                str += "Response:\n" + sinon.format(response) + "\n\n";                                                // 5140
                                                                                                                       // 5141
                sinon.log(str);                                                                                        // 5142
            },                                                                                                         // 5143
                                                                                                                       // 5144
            respondWith: function respondWith(method, url, body) {                                                     // 5145
                if (arguments.length == 1 && typeof method != "function") {                                            // 5146
                    this.response = responseArray(method);                                                             // 5147
                    return;                                                                                            // 5148
                }                                                                                                      // 5149
                                                                                                                       // 5150
                if (!this.responses) { this.responses = []; }                                                          // 5151
                                                                                                                       // 5152
                if (arguments.length == 1) {                                                                           // 5153
                    body = method;                                                                                     // 5154
                    url = method = null;                                                                               // 5155
                }                                                                                                      // 5156
                                                                                                                       // 5157
                if (arguments.length == 2) {                                                                           // 5158
                    body = url;                                                                                        // 5159
                    url = method;                                                                                      // 5160
                    method = null;                                                                                     // 5161
                }                                                                                                      // 5162
                                                                                                                       // 5163
                push.call(this.responses, {                                                                            // 5164
                    method: method,                                                                                    // 5165
                    url: url,                                                                                          // 5166
                    response: typeof body == "function" ? body : responseArray(body)                                   // 5167
                });                                                                                                    // 5168
            },                                                                                                         // 5169
                                                                                                                       // 5170
            respond: function respond() {                                                                              // 5171
                if (arguments.length > 0) {                                                                            // 5172
                    this.respondWith.apply(this, arguments);                                                           // 5173
                }                                                                                                      // 5174
                                                                                                                       // 5175
                var queue = this.queue || [];                                                                          // 5176
                var requests = queue.splice(0, queue.length);                                                          // 5177
                var request;                                                                                           // 5178
                                                                                                                       // 5179
                while (request = requests.shift()) {                                                                   // 5180
                    this.processRequest(request);                                                                      // 5181
                }                                                                                                      // 5182
            },                                                                                                         // 5183
                                                                                                                       // 5184
            processRequest: function processRequest(request) {                                                         // 5185
                try {                                                                                                  // 5186
                    if (request.aborted) {                                                                             // 5187
                        return;                                                                                        // 5188
                    }                                                                                                  // 5189
                                                                                                                       // 5190
                    var response = this.response || [404, {}, ""];                                                     // 5191
                                                                                                                       // 5192
                    if (this.responses) {                                                                              // 5193
                        for (var l = this.responses.length, i = l - 1; i >= 0; i--) {                                  // 5194
                            if (match.call(this, this.responses[i], request)) {                                        // 5195
                                response = this.responses[i].response;                                                 // 5196
                                break;                                                                                 // 5197
                            }                                                                                          // 5198
                        }                                                                                              // 5199
                    }                                                                                                  // 5200
                                                                                                                       // 5201
                    if (request.readyState != 4) {                                                                     // 5202
                        this.log(response, request);                                                                   // 5203
                                                                                                                       // 5204
                        request.respond(response[0], response[1], response[2]);                                        // 5205
                    }                                                                                                  // 5206
                } catch (e) {                                                                                          // 5207
                    sinon.logError("Fake server request processing", e);                                               // 5208
                }                                                                                                      // 5209
            },                                                                                                         // 5210
                                                                                                                       // 5211
            restore: function restore() {                                                                              // 5212
                return this.xhr.restore && this.xhr.restore.apply(this.xhr, arguments);                                // 5213
            }                                                                                                          // 5214
        };                                                                                                             // 5215
    }                                                                                                                  // 5216
                                                                                                                       // 5217
    var isNode = typeof module !== "undefined" && module.exports && typeof require == "function";                      // 5218
    var isAMD = typeof define === "function" && typeof define.amd === "object" && define.amd;                          // 5219
                                                                                                                       // 5220
    function loadDependencies(require, exports, module) {                                                              // 5221
        var sinon = require("./core");                                                                                 // 5222
        require("./fake_xdomain_request");                                                                             // 5223
        require("./fake_xml_http_request");                                                                            // 5224
        require("../format");                                                                                          // 5225
        makeApi(sinon);                                                                                                // 5226
        module.exports = sinon;                                                                                        // 5227
    }                                                                                                                  // 5228
                                                                                                                       // 5229
    if (isAMD) {                                                                                                       // 5230
        define(loadDependencies);                                                                                      // 5231
    } else if (isNode) {                                                                                               // 5232
        loadDependencies(require, module.exports, module);                                                             // 5233
    } else {                                                                                                           // 5234
        makeApi(sinon);                                                                                                // 5235
    }                                                                                                                  // 5236
}());                                                                                                                  // 5237
                                                                                                                       // 5238
/**                                                                                                                    // 5239
 * @depend fake_server.js                                                                                              // 5240
 * @depend fake_timers.js                                                                                              // 5241
 */                                                                                                                    // 5242
/**                                                                                                                    // 5243
 * Add-on for sinon.fakeServer that automatically handles a fake timer along with                                      // 5244
 * the FakeXMLHttpRequest. The direct inspiration for this add-on is jQuery                                            // 5245
 * 1.3.x, which does not use xhr object's onreadystatehandler at all - instead,                                        // 5246
 * it polls the object for completion with setInterval. Dispite the direct                                             // 5247
 * motivation, there is nothing jQuery-specific in this file, so it can be used                                        // 5248
 * in any environment where the ajax implementation depends on setInterval or                                          // 5249
 * setTimeout.                                                                                                         // 5250
 *                                                                                                                     // 5251
 * @author Christian Johansen (christian@cjohansen.no)                                                                 // 5252
 * @license BSD                                                                                                        // 5253
 *                                                                                                                     // 5254
 * Copyright (c) 2010-2013 Christian Johansen                                                                          // 5255
 */                                                                                                                    // 5256
                                                                                                                       // 5257
(function () {                                                                                                         // 5258
    function makeApi(sinon) {                                                                                          // 5259
        function Server() {}                                                                                           // 5260
        Server.prototype = sinon.fakeServer;                                                                           // 5261
                                                                                                                       // 5262
        sinon.fakeServerWithClock = new Server();                                                                      // 5263
                                                                                                                       // 5264
        sinon.fakeServerWithClock.addRequest = function addRequest(xhr) {                                              // 5265
            if (xhr.async) {                                                                                           // 5266
                if (typeof setTimeout.clock == "object") {                                                             // 5267
                    this.clock = setTimeout.clock;                                                                     // 5268
                } else {                                                                                               // 5269
                    this.clock = sinon.useFakeTimers();                                                                // 5270
                    this.resetClock = true;                                                                            // 5271
                }                                                                                                      // 5272
                                                                                                                       // 5273
                if (!this.longestTimeout) {                                                                            // 5274
                    var clockSetTimeout = this.clock.setTimeout;                                                       // 5275
                    var clockSetInterval = this.clock.setInterval;                                                     // 5276
                    var server = this;                                                                                 // 5277
                                                                                                                       // 5278
                    this.clock.setTimeout = function (fn, timeout) {                                                   // 5279
                        server.longestTimeout = Math.max(timeout, server.longestTimeout || 0);                         // 5280
                                                                                                                       // 5281
                        return clockSetTimeout.apply(this, arguments);                                                 // 5282
                    };                                                                                                 // 5283
                                                                                                                       // 5284
                    this.clock.setInterval = function (fn, timeout) {                                                  // 5285
                        server.longestTimeout = Math.max(timeout, server.longestTimeout || 0);                         // 5286
                                                                                                                       // 5287
                        return clockSetInterval.apply(this, arguments);                                                // 5288
                    };                                                                                                 // 5289
                }                                                                                                      // 5290
            }                                                                                                          // 5291
                                                                                                                       // 5292
            return sinon.fakeServer.addRequest.call(this, xhr);                                                        // 5293
        };                                                                                                             // 5294
                                                                                                                       // 5295
        sinon.fakeServerWithClock.respond = function respond() {                                                       // 5296
            var returnVal = sinon.fakeServer.respond.apply(this, arguments);                                           // 5297
                                                                                                                       // 5298
            if (this.clock) {                                                                                          // 5299
                this.clock.tick(this.longestTimeout || 0);                                                             // 5300
                this.longestTimeout = 0;                                                                               // 5301
                                                                                                                       // 5302
                if (this.resetClock) {                                                                                 // 5303
                    this.clock.restore();                                                                              // 5304
                    this.resetClock = false;                                                                           // 5305
                }                                                                                                      // 5306
            }                                                                                                          // 5307
                                                                                                                       // 5308
            return returnVal;                                                                                          // 5309
        };                                                                                                             // 5310
                                                                                                                       // 5311
        sinon.fakeServerWithClock.restore = function restore() {                                                       // 5312
            if (this.clock) {                                                                                          // 5313
                this.clock.restore();                                                                                  // 5314
            }                                                                                                          // 5315
                                                                                                                       // 5316
            return sinon.fakeServer.restore.apply(this, arguments);                                                    // 5317
        };                                                                                                             // 5318
    }                                                                                                                  // 5319
                                                                                                                       // 5320
    var isNode = typeof module !== "undefined" && module.exports && typeof require == "function";                      // 5321
    var isAMD = typeof define === "function" && typeof define.amd === "object" && define.amd;                          // 5322
                                                                                                                       // 5323
    function loadDependencies(require) {                                                                               // 5324
        var sinon = require("./core");                                                                                 // 5325
        require("./fake_server");                                                                                      // 5326
        require("./fake_timers");                                                                                      // 5327
        makeApi(sinon);                                                                                                // 5328
    }                                                                                                                  // 5329
                                                                                                                       // 5330
    if (isAMD) {                                                                                                       // 5331
        define(loadDependencies);                                                                                      // 5332
    } else if (isNode) {                                                                                               // 5333
        loadDependencies(require);                                                                                     // 5334
    } else {                                                                                                           // 5335
        makeApi(sinon);                                                                                                // 5336
    }                                                                                                                  // 5337
}());                                                                                                                  // 5338
                                                                                                                       // 5339
/**                                                                                                                    // 5340
 * @depend util/core.js                                                                                                // 5341
 * @depend extend.js                                                                                                   // 5342
 * @depend collection.js                                                                                               // 5343
 * @depend util/fake_timers.js                                                                                         // 5344
 * @depend util/fake_server_with_clock.js                                                                              // 5345
 */                                                                                                                    // 5346
/**                                                                                                                    // 5347
 * Manages fake collections as well as fake utilities such as Sinon's                                                  // 5348
 * timers and fake XHR implementation in one convenient object.                                                        // 5349
 *                                                                                                                     // 5350
 * @author Christian Johansen (christian@cjohansen.no)                                                                 // 5351
 * @license BSD                                                                                                        // 5352
 *                                                                                                                     // 5353
 * Copyright (c) 2010-2013 Christian Johansen                                                                          // 5354
 */                                                                                                                    // 5355
                                                                                                                       // 5356
(function () {                                                                                                         // 5357
    function makeApi(sinon) {                                                                                          // 5358
        var push = [].push;                                                                                            // 5359
                                                                                                                       // 5360
        function exposeValue(sandbox, config, key, value) {                                                            // 5361
            if (!value) {                                                                                              // 5362
                return;                                                                                                // 5363
            }                                                                                                          // 5364
                                                                                                                       // 5365
            if (config.injectInto && !(key in config.injectInto)) {                                                    // 5366
                config.injectInto[key] = value;                                                                        // 5367
                sandbox.injectedKeys.push(key);                                                                        // 5368
            } else {                                                                                                   // 5369
                push.call(sandbox.args, value);                                                                        // 5370
            }                                                                                                          // 5371
        }                                                                                                              // 5372
                                                                                                                       // 5373
        function prepareSandboxFromConfig(config) {                                                                    // 5374
            var sandbox = sinon.create(sinon.sandbox);                                                                 // 5375
                                                                                                                       // 5376
            if (config.useFakeServer) {                                                                                // 5377
                if (typeof config.useFakeServer == "object") {                                                         // 5378
                    sandbox.serverPrototype = config.useFakeServer;                                                    // 5379
                }                                                                                                      // 5380
                                                                                                                       // 5381
                sandbox.useFakeServer();                                                                               // 5382
            }                                                                                                          // 5383
                                                                                                                       // 5384
            if (config.useFakeTimers) {                                                                                // 5385
                if (typeof config.useFakeTimers == "object") {                                                         // 5386
                    sandbox.useFakeTimers.apply(sandbox, config.useFakeTimers);                                        // 5387
                } else {                                                                                               // 5388
                    sandbox.useFakeTimers();                                                                           // 5389
                }                                                                                                      // 5390
            }                                                                                                          // 5391
                                                                                                                       // 5392
            return sandbox;                                                                                            // 5393
        }                                                                                                              // 5394
                                                                                                                       // 5395
        sinon.sandbox = sinon.extend(sinon.create(sinon.collection), {                                                 // 5396
            useFakeTimers: function useFakeTimers() {                                                                  // 5397
                this.clock = sinon.useFakeTimers.apply(sinon, arguments);                                              // 5398
                                                                                                                       // 5399
                return this.add(this.clock);                                                                           // 5400
            },                                                                                                         // 5401
                                                                                                                       // 5402
            serverPrototype: sinon.fakeServer,                                                                         // 5403
                                                                                                                       // 5404
            useFakeServer: function useFakeServer() {                                                                  // 5405
                var proto = this.serverPrototype || sinon.fakeServer;                                                  // 5406
                                                                                                                       // 5407
                if (!proto || !proto.create) {                                                                         // 5408
                    return null;                                                                                       // 5409
                }                                                                                                      // 5410
                                                                                                                       // 5411
                this.server = proto.create();                                                                          // 5412
                return this.add(this.server);                                                                          // 5413
            },                                                                                                         // 5414
                                                                                                                       // 5415
            inject: function (obj) {                                                                                   // 5416
                sinon.collection.inject.call(this, obj);                                                               // 5417
                                                                                                                       // 5418
                if (this.clock) {                                                                                      // 5419
                    obj.clock = this.clock;                                                                            // 5420
                }                                                                                                      // 5421
                                                                                                                       // 5422
                if (this.server) {                                                                                     // 5423
                    obj.server = this.server;                                                                          // 5424
                    obj.requests = this.server.requests;                                                               // 5425
                }                                                                                                      // 5426
                                                                                                                       // 5427
                obj.match = sinon.match;                                                                               // 5428
                                                                                                                       // 5429
                return obj;                                                                                            // 5430
            },                                                                                                         // 5431
                                                                                                                       // 5432
            restore: function () {                                                                                     // 5433
                sinon.collection.restore.apply(this, arguments);                                                       // 5434
                this.restoreContext();                                                                                 // 5435
            },                                                                                                         // 5436
                                                                                                                       // 5437
            restoreContext: function () {                                                                              // 5438
                if (this.injectedKeys) {                                                                               // 5439
                    for (var i = 0, j = this.injectedKeys.length; i < j; i++) {                                        // 5440
                        delete this.injectInto[this.injectedKeys[i]];                                                  // 5441
                    }                                                                                                  // 5442
                    this.injectedKeys = [];                                                                            // 5443
                }                                                                                                      // 5444
            },                                                                                                         // 5445
                                                                                                                       // 5446
            create: function (config) {                                                                                // 5447
                if (!config) {                                                                                         // 5448
                    return sinon.create(sinon.sandbox);                                                                // 5449
                }                                                                                                      // 5450
                                                                                                                       // 5451
                var sandbox = prepareSandboxFromConfig(config);                                                        // 5452
                sandbox.args = sandbox.args || [];                                                                     // 5453
                sandbox.injectedKeys = [];                                                                             // 5454
                sandbox.injectInto = config.injectInto;                                                                // 5455
                var prop, value, exposed = sandbox.inject({});                                                         // 5456
                                                                                                                       // 5457
                if (config.properties) {                                                                               // 5458
                    for (var i = 0, l = config.properties.length; i < l; i++) {                                        // 5459
                        prop = config.properties[i];                                                                   // 5460
                        value = exposed[prop] || prop == "sandbox" && sandbox;                                         // 5461
                        exposeValue(sandbox, config, prop, value);                                                     // 5462
                    }                                                                                                  // 5463
                } else {                                                                                               // 5464
                    exposeValue(sandbox, config, "sandbox", value);                                                    // 5465
                }                                                                                                      // 5466
                                                                                                                       // 5467
                return sandbox;                                                                                        // 5468
            },                                                                                                         // 5469
                                                                                                                       // 5470
            match: sinon.match                                                                                         // 5471
        });                                                                                                            // 5472
                                                                                                                       // 5473
        sinon.sandbox.useFakeXMLHttpRequest = sinon.sandbox.useFakeServer;                                             // 5474
                                                                                                                       // 5475
        return sinon.sandbox;                                                                                          // 5476
    }                                                                                                                  // 5477
                                                                                                                       // 5478
    var isNode = typeof module !== "undefined" && module.exports && typeof require == "function";                      // 5479
    var isAMD = typeof define === "function" && typeof define.amd === "object" && define.amd;                          // 5480
                                                                                                                       // 5481
    function loadDependencies(require, exports, module) {                                                              // 5482
        var sinon = require("./util/core");                                                                            // 5483
        require("./extend");                                                                                           // 5484
        require("./util/fake_server_with_clock");                                                                      // 5485
        require("./util/fake_timers");                                                                                 // 5486
        require("./collection");                                                                                       // 5487
        module.exports = makeApi(sinon);                                                                               // 5488
    }                                                                                                                  // 5489
                                                                                                                       // 5490
    if (isAMD) {                                                                                                       // 5491
        define(loadDependencies);                                                                                      // 5492
    } else if (isNode) {                                                                                               // 5493
        loadDependencies(require, module.exports, module);                                                             // 5494
    } else if (!sinon) {                                                                                               // 5495
        return;                                                                                                        // 5496
    } else {                                                                                                           // 5497
        makeApi(sinon);                                                                                                // 5498
    }                                                                                                                  // 5499
}());                                                                                                                  // 5500
                                                                                                                       // 5501
/**                                                                                                                    // 5502
 * @depend util/core.js                                                                                                // 5503
 * @depend sandbox.js                                                                                                  // 5504
 */                                                                                                                    // 5505
/**                                                                                                                    // 5506
 * Test function, sandboxes fakes                                                                                      // 5507
 *                                                                                                                     // 5508
 * @author Christian Johansen (christian@cjohansen.no)                                                                 // 5509
 * @license BSD                                                                                                        // 5510
 *                                                                                                                     // 5511
 * Copyright (c) 2010-2013 Christian Johansen                                                                          // 5512
 */                                                                                                                    // 5513
                                                                                                                       // 5514
(function (sinon) {                                                                                                    // 5515
    function makeApi(sinon) {                                                                                          // 5516
        var slice = Array.prototype.slice;                                                                             // 5517
                                                                                                                       // 5518
        function test(callback) {                                                                                      // 5519
            var type = typeof callback;                                                                                // 5520
                                                                                                                       // 5521
            if (type != "function") {                                                                                  // 5522
                throw new TypeError("sinon.test needs to wrap a test function, got " + type);                          // 5523
            }                                                                                                          // 5524
                                                                                                                       // 5525
            function sinonSandboxedTest() {                                                                            // 5526
                var config = sinon.getConfig(sinon.config);                                                            // 5527
                config.injectInto = config.injectIntoThis && this || config.injectInto;                                // 5528
                var sandbox = sinon.sandbox.create(config);                                                            // 5529
                var args = slice.call(arguments);                                                                      // 5530
                var oldDone = args.length && args[args.length - 1];                                                    // 5531
                var exception, result;                                                                                 // 5532
                                                                                                                       // 5533
                if (typeof oldDone == "function") {                                                                    // 5534
                    args[args.length - 1] = function sinonDone(result) {                                               // 5535
                        if (result) {                                                                                  // 5536
                            sandbox.restore();                                                                         // 5537
                            throw exception;                                                                           // 5538
                        } else {                                                                                       // 5539
                            sandbox.verifyAndRestore();                                                                // 5540
                        }                                                                                              // 5541
                        oldDone(result);                                                                               // 5542
                    };                                                                                                 // 5543
                }                                                                                                      // 5544
                                                                                                                       // 5545
                try {                                                                                                  // 5546
                    result = callback.apply(this, args.concat(sandbox.args));                                          // 5547
                } catch (e) {                                                                                          // 5548
                    exception = e;                                                                                     // 5549
                }                                                                                                      // 5550
                                                                                                                       // 5551
                if (typeof oldDone != "function") {                                                                    // 5552
                    if (typeof exception !== "undefined") {                                                            // 5553
                        sandbox.restore();                                                                             // 5554
                        throw exception;                                                                               // 5555
                    } else {                                                                                           // 5556
                        sandbox.verifyAndRestore();                                                                    // 5557
                    }                                                                                                  // 5558
                }                                                                                                      // 5559
                                                                                                                       // 5560
                return result;                                                                                         // 5561
            }                                                                                                          // 5562
                                                                                                                       // 5563
            if (callback.length) {                                                                                     // 5564
                return function sinonAsyncSandboxedTest(callback) {                                                    // 5565
                    return sinonSandboxedTest.apply(this, arguments);                                                  // 5566
                };                                                                                                     // 5567
            }                                                                                                          // 5568
                                                                                                                       // 5569
            return sinonSandboxedTest;                                                                                 // 5570
        }                                                                                                              // 5571
                                                                                                                       // 5572
        test.config = {                                                                                                // 5573
            injectIntoThis: true,                                                                                      // 5574
            injectInto: null,                                                                                          // 5575
            properties: ["spy", "stub", "mock", "clock", "server", "requests"],                                        // 5576
            useFakeTimers: true,                                                                                       // 5577
            useFakeServer: true                                                                                        // 5578
        };                                                                                                             // 5579
                                                                                                                       // 5580
        sinon.test = test;                                                                                             // 5581
        return test;                                                                                                   // 5582
    }                                                                                                                  // 5583
                                                                                                                       // 5584
    var isNode = typeof module !== "undefined" && module.exports && typeof require == "function";                      // 5585
    var isAMD = typeof define === "function" && typeof define.amd === "object" && define.amd;                          // 5586
                                                                                                                       // 5587
    function loadDependencies(require, exports, module) {                                                              // 5588
        var sinon = require("./util/core");                                                                            // 5589
        require("./sandbox");                                                                                          // 5590
        module.exports = makeApi(sinon);                                                                               // 5591
    }                                                                                                                  // 5592
                                                                                                                       // 5593
    if (isAMD) {                                                                                                       // 5594
        define(loadDependencies);                                                                                      // 5595
    } else if (isNode) {                                                                                               // 5596
        loadDependencies(require, module.exports, module);                                                             // 5597
    } else if (sinon) {                                                                                                // 5598
        makeApi(sinon);                                                                                                // 5599
    }                                                                                                                  // 5600
}(typeof sinon == "object" && sinon || null));                                                                         // 5601
                                                                                                                       // 5602
/**                                                                                                                    // 5603
 * @depend util/core.js                                                                                                // 5604
 * @depend test.js                                                                                                     // 5605
 */                                                                                                                    // 5606
/**                                                                                                                    // 5607
 * Test case, sandboxes all test functions                                                                             // 5608
 *                                                                                                                     // 5609
 * @author Christian Johansen (christian@cjohansen.no)                                                                 // 5610
 * @license BSD                                                                                                        // 5611
 *                                                                                                                     // 5612
 * Copyright (c) 2010-2013 Christian Johansen                                                                          // 5613
 */                                                                                                                    // 5614
                                                                                                                       // 5615
(function (sinon) {                                                                                                    // 5616
    function createTest(property, setUp, tearDown) {                                                                   // 5617
        return function () {                                                                                           // 5618
            if (setUp) {                                                                                               // 5619
                setUp.apply(this, arguments);                                                                          // 5620
            }                                                                                                          // 5621
                                                                                                                       // 5622
            var exception, result;                                                                                     // 5623
                                                                                                                       // 5624
            try {                                                                                                      // 5625
                result = property.apply(this, arguments);                                                              // 5626
            } catch (e) {                                                                                              // 5627
                exception = e;                                                                                         // 5628
            }                                                                                                          // 5629
                                                                                                                       // 5630
            if (tearDown) {                                                                                            // 5631
                tearDown.apply(this, arguments);                                                                       // 5632
            }                                                                                                          // 5633
                                                                                                                       // 5634
            if (exception) {                                                                                           // 5635
                throw exception;                                                                                       // 5636
            }                                                                                                          // 5637
                                                                                                                       // 5638
            return result;                                                                                             // 5639
        };                                                                                                             // 5640
    }                                                                                                                  // 5641
                                                                                                                       // 5642
    function makeApi(sinon) {                                                                                          // 5643
        function testCase(tests, prefix) {                                                                             // 5644
            /*jsl:ignore*/                                                                                             // 5645
            if (!tests || typeof tests != "object") {                                                                  // 5646
                throw new TypeError("sinon.testCase needs an object with test functions");                             // 5647
            }                                                                                                          // 5648
            /*jsl:end*/                                                                                                // 5649
                                                                                                                       // 5650
            prefix = prefix || "test";                                                                                 // 5651
            var rPrefix = new RegExp("^" + prefix);                                                                    // 5652
            var methods = {}, testName, property, method;                                                              // 5653
            var setUp = tests.setUp;                                                                                   // 5654
            var tearDown = tests.tearDown;                                                                             // 5655
                                                                                                                       // 5656
            for (testName in tests) {                                                                                  // 5657
                if (tests.hasOwnProperty(testName)) {                                                                  // 5658
                    property = tests[testName];                                                                        // 5659
                                                                                                                       // 5660
                    if (/^(setUp|tearDown)$/.test(testName)) {                                                         // 5661
                        continue;                                                                                      // 5662
                    }                                                                                                  // 5663
                                                                                                                       // 5664
                    if (typeof property == "function" && rPrefix.test(testName)) {                                     // 5665
                        method = property;                                                                             // 5666
                                                                                                                       // 5667
                        if (setUp || tearDown) {                                                                       // 5668
                            method = createTest(property, setUp, tearDown);                                            // 5669
                        }                                                                                              // 5670
                                                                                                                       // 5671
                        methods[testName] = sinon.test(method);                                                        // 5672
                    } else {                                                                                           // 5673
                        methods[testName] = tests[testName];                                                           // 5674
                    }                                                                                                  // 5675
                }                                                                                                      // 5676
            }                                                                                                          // 5677
                                                                                                                       // 5678
            return methods;                                                                                            // 5679
        }                                                                                                              // 5680
                                                                                                                       // 5681
        sinon.testCase = testCase;                                                                                     // 5682
        return testCase;                                                                                               // 5683
    }                                                                                                                  // 5684
                                                                                                                       // 5685
    var isNode = typeof module !== "undefined" && module.exports && typeof require == "function";                      // 5686
    var isAMD = typeof define === "function" && typeof define.amd === "object" && define.amd;                          // 5687
                                                                                                                       // 5688
    function loadDependencies(require, exports, module) {                                                              // 5689
        var sinon = require("./util/core");                                                                            // 5690
        require("./test");                                                                                             // 5691
        module.exports = makeApi(sinon);                                                                               // 5692
    }                                                                                                                  // 5693
                                                                                                                       // 5694
    if (isAMD) {                                                                                                       // 5695
        define(loadDependencies);                                                                                      // 5696
    } else if (isNode) {                                                                                               // 5697
        loadDependencies(require, module.exports, module);                                                             // 5698
    } else if (!sinon) {                                                                                               // 5699
        return;                                                                                                        // 5700
    } else {                                                                                                           // 5701
        makeApi(sinon);                                                                                                // 5702
    }                                                                                                                  // 5703
}(typeof sinon == "object" && sinon || null));                                                                         // 5704
                                                                                                                       // 5705
/**                                                                                                                    // 5706
 * @depend times_in_words.js                                                                                           // 5707
 * @depend util/core.js                                                                                                // 5708
 * @depend match.js                                                                                                    // 5709
 * @depend format.js                                                                                                   // 5710
 */                                                                                                                    // 5711
/**                                                                                                                    // 5712
 * Assertions matching the test spy retrieval interface.                                                               // 5713
 *                                                                                                                     // 5714
 * @author Christian Johansen (christian@cjohansen.no)                                                                 // 5715
 * @license BSD                                                                                                        // 5716
 *                                                                                                                     // 5717
 * Copyright (c) 2010-2013 Christian Johansen                                                                          // 5718
 */                                                                                                                    // 5719
                                                                                                                       // 5720
(function (sinon, global) {                                                                                            // 5721
    var slice = Array.prototype.slice;                                                                                 // 5722
                                                                                                                       // 5723
    function makeApi(sinon) {                                                                                          // 5724
        var assert;                                                                                                    // 5725
                                                                                                                       // 5726
        function verifyIsStub() {                                                                                      // 5727
            var method;                                                                                                // 5728
                                                                                                                       // 5729
            for (var i = 0, l = arguments.length; i < l; ++i) {                                                        // 5730
                method = arguments[i];                                                                                 // 5731
                                                                                                                       // 5732
                if (!method) {                                                                                         // 5733
                    assert.fail("fake is not a spy");                                                                  // 5734
                }                                                                                                      // 5735
                                                                                                                       // 5736
                if (method.proxy) {                                                                                    // 5737
                    verifyIsStub(method.proxy);                                                                        // 5738
                } else {                                                                                               // 5739
                    if (typeof method != "function") {                                                                 // 5740
                        assert.fail(method + " is not a function");                                                    // 5741
                    }                                                                                                  // 5742
                                                                                                                       // 5743
                    if (typeof method.getCall != "function") {                                                         // 5744
                        assert.fail(method + " is not stubbed");                                                       // 5745
                    }                                                                                                  // 5746
                }                                                                                                      // 5747
                                                                                                                       // 5748
            }                                                                                                          // 5749
        }                                                                                                              // 5750
                                                                                                                       // 5751
        function failAssertion(object, msg) {                                                                          // 5752
            object = object || global;                                                                                 // 5753
            var failMethod = object.fail || assert.fail;                                                               // 5754
            failMethod.call(object, msg);                                                                              // 5755
        }                                                                                                              // 5756
                                                                                                                       // 5757
        function mirrorPropAsAssertion(name, method, message) {                                                        // 5758
            if (arguments.length == 2) {                                                                               // 5759
                message = method;                                                                                      // 5760
                method = name;                                                                                         // 5761
            }                                                                                                          // 5762
                                                                                                                       // 5763
            assert[name] = function (fake) {                                                                           // 5764
                verifyIsStub(fake);                                                                                    // 5765
                                                                                                                       // 5766
                var args = slice.call(arguments, 1);                                                                   // 5767
                var failed = false;                                                                                    // 5768
                                                                                                                       // 5769
                if (typeof method == "function") {                                                                     // 5770
                    failed = !method(fake);                                                                            // 5771
                } else {                                                                                               // 5772
                    failed = typeof fake[method] == "function" ?                                                       // 5773
                        !fake[method].apply(fake, args) : !fake[method];                                               // 5774
                }                                                                                                      // 5775
                                                                                                                       // 5776
                if (failed) {                                                                                          // 5777
                    failAssertion(this, (fake.printf || fake.proxy.printf).apply(fake, [message].concat(args)));       // 5778
                } else {                                                                                               // 5779
                    assert.pass(name);                                                                                 // 5780
                }                                                                                                      // 5781
            };                                                                                                         // 5782
        }                                                                                                              // 5783
                                                                                                                       // 5784
        function exposedName(prefix, prop) {                                                                           // 5785
            return !prefix || /^fail/.test(prop) ? prop :                                                              // 5786
                prefix + prop.slice(0, 1).toUpperCase() + prop.slice(1);                                               // 5787
        }                                                                                                              // 5788
                                                                                                                       // 5789
        assert = {                                                                                                     // 5790
            failException: "AssertError",                                                                              // 5791
                                                                                                                       // 5792
            fail: function fail(message) {                                                                             // 5793
                var error = new Error(message);                                                                        // 5794
                error.name = this.failException || assert.failException;                                               // 5795
                                                                                                                       // 5796
                throw error;                                                                                           // 5797
            },                                                                                                         // 5798
                                                                                                                       // 5799
            pass: function pass(assertion) {},                                                                         // 5800
                                                                                                                       // 5801
            callOrder: function assertCallOrder() {                                                                    // 5802
                verifyIsStub.apply(null, arguments);                                                                   // 5803
                var expected = "", actual = "";                                                                        // 5804
                                                                                                                       // 5805
                if (!sinon.calledInOrder(arguments)) {                                                                 // 5806
                    try {                                                                                              // 5807
                        expected = [].join.call(arguments, ", ");                                                      // 5808
                        var calls = slice.call(arguments);                                                             // 5809
                        var i = calls.length;                                                                          // 5810
                        while (i) {                                                                                    // 5811
                            if (!calls[--i].called) {                                                                  // 5812
                                calls.splice(i, 1);                                                                    // 5813
                            }                                                                                          // 5814
                        }                                                                                              // 5815
                        actual = sinon.orderByFirstCall(calls).join(", ");                                             // 5816
                    } catch (e) {                                                                                      // 5817
                        // If this fails, we'll just fall back to the blank string                                     // 5818
                    }                                                                                                  // 5819
                                                                                                                       // 5820
                    failAssertion(this, "expected " + expected + " to be " +                                           // 5821
                                "called in order but were called as " + actual);                                       // 5822
                } else {                                                                                               // 5823
                    assert.pass("callOrder");                                                                          // 5824
                }                                                                                                      // 5825
            },                                                                                                         // 5826
                                                                                                                       // 5827
            callCount: function assertCallCount(method, count) {                                                       // 5828
                verifyIsStub(method);                                                                                  // 5829
                                                                                                                       // 5830
                if (method.callCount != count) {                                                                       // 5831
                    var msg = "expected %n to be called " + sinon.timesInWords(count) +                                // 5832
                        " but was called %c%C";                                                                        // 5833
                    failAssertion(this, method.printf(msg));                                                           // 5834
                } else {                                                                                               // 5835
                    assert.pass("callCount");                                                                          // 5836
                }                                                                                                      // 5837
            },                                                                                                         // 5838
                                                                                                                       // 5839
            expose: function expose(target, options) {                                                                 // 5840
                if (!target) {                                                                                         // 5841
                    throw new TypeError("target is null or undefined");                                                // 5842
                }                                                                                                      // 5843
                                                                                                                       // 5844
                var o = options || {};                                                                                 // 5845
                var prefix = typeof o.prefix == "undefined" && "assert" || o.prefix;                                   // 5846
                var includeFail = typeof o.includeFail == "undefined" || !!o.includeFail;                              // 5847
                                                                                                                       // 5848
                for (var method in this) {                                                                             // 5849
                    if (method != "expose" && (includeFail || !/^(fail)/.test(method))) {                              // 5850
                        target[exposedName(prefix, method)] = this[method];                                            // 5851
                    }                                                                                                  // 5852
                }                                                                                                      // 5853
                                                                                                                       // 5854
                return target;                                                                                         // 5855
            },                                                                                                         // 5856
                                                                                                                       // 5857
            match: function match(actual, expectation) {                                                               // 5858
                var matcher = sinon.match(expectation);                                                                // 5859
                if (matcher.test(actual)) {                                                                            // 5860
                    assert.pass("match");                                                                              // 5861
                } else {                                                                                               // 5862
                    var formatted = [                                                                                  // 5863
                        "expected value to match",                                                                     // 5864
                        "    expected = " + sinon.format(expectation),                                                 // 5865
                        "    actual = " + sinon.format(actual)                                                         // 5866
                    ]                                                                                                  // 5867
                    failAssertion(this, formatted.join("\n"));                                                         // 5868
                }                                                                                                      // 5869
            }                                                                                                          // 5870
        };                                                                                                             // 5871
                                                                                                                       // 5872
        mirrorPropAsAssertion("called", "expected %n to have been called at least once but was never called");         // 5873
        mirrorPropAsAssertion("notCalled", function (spy) { return !spy.called; },                                     // 5874
                            "expected %n to not have been called but was called %c%C");                                // 5875
        mirrorPropAsAssertion("calledOnce", "expected %n to be called once but was called %c%C");                      // 5876
        mirrorPropAsAssertion("calledTwice", "expected %n to be called twice but was called %c%C");                    // 5877
        mirrorPropAsAssertion("calledThrice", "expected %n to be called thrice but was called %c%C");                  // 5878
        mirrorPropAsAssertion("calledOn", "expected %n to be called with %1 as this but was called with %t");          // 5879
        mirrorPropAsAssertion("alwaysCalledOn", "expected %n to always be called with %1 as this but was called with %t");
        mirrorPropAsAssertion("calledWithNew", "expected %n to be called with new");                                   // 5881
        mirrorPropAsAssertion("alwaysCalledWithNew", "expected %n to always be called with new");                      // 5882
        mirrorPropAsAssertion("calledWith", "expected %n to be called with arguments %*%C");                           // 5883
        mirrorPropAsAssertion("calledWithMatch", "expected %n to be called with match %*%C");                          // 5884
        mirrorPropAsAssertion("alwaysCalledWith", "expected %n to always be called with arguments %*%C");              // 5885
        mirrorPropAsAssertion("alwaysCalledWithMatch", "expected %n to always be called with match %*%C");             // 5886
        mirrorPropAsAssertion("calledWithExactly", "expected %n to be called with exact arguments %*%C");              // 5887
        mirrorPropAsAssertion("alwaysCalledWithExactly", "expected %n to always be called with exact arguments %*%C"); // 5888
        mirrorPropAsAssertion("neverCalledWith", "expected %n to never be called with arguments %*%C");                // 5889
        mirrorPropAsAssertion("neverCalledWithMatch", "expected %n to never be called with match %*%C");               // 5890
        mirrorPropAsAssertion("threw", "%n did not throw exception%C");                                                // 5891
        mirrorPropAsAssertion("alwaysThrew", "%n did not always throw exception%C");                                   // 5892
                                                                                                                       // 5893
        sinon.assert = assert;                                                                                         // 5894
        return assert;                                                                                                 // 5895
    }                                                                                                                  // 5896
                                                                                                                       // 5897
    var isNode = typeof module !== "undefined" && module.exports && typeof require == "function";                      // 5898
    var isAMD = typeof define === "function" && typeof define.amd === "object" && define.amd;                          // 5899
                                                                                                                       // 5900
    function loadDependencies(require, exports, module) {                                                              // 5901
        var sinon = require("./util/core");                                                                            // 5902
        require("./match");                                                                                            // 5903
        require("./format");                                                                                           // 5904
        module.exports = makeApi(sinon);                                                                               // 5905
    }                                                                                                                  // 5906
                                                                                                                       // 5907
    if (isAMD) {                                                                                                       // 5908
        define(loadDependencies);                                                                                      // 5909
    } else if (isNode) {                                                                                               // 5910
        loadDependencies(require, module.exports, module);                                                             // 5911
    } else if (!sinon) {                                                                                               // 5912
        return;                                                                                                        // 5913
    } else {                                                                                                           // 5914
        makeApi(sinon);                                                                                                // 5915
    }                                                                                                                  // 5916
                                                                                                                       // 5917
}(typeof sinon == "object" && sinon || null, typeof window != "undefined" ? window : (typeof self != "undefined") ? self : global));
                                                                                                                       // 5919
  return sinon;                                                                                                        // 5920
}.call(this));                                                                                                         // 5921
                                                                                                                       // 5922
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/practicalmeteor:sinon/sinon-chai-2.6.0.js                                                                  //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
sinonChai = this.sinonChai = function(chai, utils) {                                                                   // 1
    "use strict";                                                                                                      // 2
                                                                                                                       // 3
    var slice = Array.prototype.slice;                                                                                 // 4
                                                                                                                       // 5
    function isSpy(putativeSpy) {                                                                                      // 6
        return typeof putativeSpy === "function" &&                                                                    // 7
               typeof putativeSpy.getCall === "function" &&                                                            // 8
               typeof putativeSpy.calledWithExactly === "function";                                                    // 9
    }                                                                                                                  // 10
                                                                                                                       // 11
    function timesInWords(count) {                                                                                     // 12
        return count === 1 ? "once" :                                                                                  // 13
               count === 2 ? "twice" :                                                                                 // 14
               count === 3 ? "thrice" :                                                                                // 15
               (count || 0) + " times";                                                                                // 16
    }                                                                                                                  // 17
                                                                                                                       // 18
    function isCall(putativeCall) {                                                                                    // 19
        return putativeCall && isSpy(putativeCall.proxy);                                                              // 20
    }                                                                                                                  // 21
                                                                                                                       // 22
    function assertCanWorkWith(assertion) {                                                                            // 23
        if (!isSpy(assertion._obj) && !isCall(assertion._obj)) {                                                       // 24
            throw new TypeError(utils.inspect(assertion._obj) + " is not a spy or a call to a spy!");                  // 25
        }                                                                                                              // 26
    }                                                                                                                  // 27
                                                                                                                       // 28
    function getMessages(spy, action, nonNegatedSuffix, always, args) {                                                // 29
        var verbPhrase = always ? "always have " : "have ";                                                            // 30
        nonNegatedSuffix = nonNegatedSuffix || "";                                                                     // 31
        if (isSpy(spy.proxy)) {                                                                                        // 32
            spy = spy.proxy;                                                                                           // 33
        }                                                                                                              // 34
                                                                                                                       // 35
        function printfArray(array) {                                                                                  // 36
            return spy.printf.apply(spy, array);                                                                       // 37
        }                                                                                                              // 38
                                                                                                                       // 39
        return {                                                                                                       // 40
            affirmative: function () {                                                                                 // 41
                return printfArray(["expected %n to " + verbPhrase + action + nonNegatedSuffix].concat(args));         // 42
            },                                                                                                         // 43
            negative: function () {                                                                                    // 44
                return printfArray(["expected %n to not " + verbPhrase + action].concat(args));                        // 45
            }                                                                                                          // 46
        };                                                                                                             // 47
    }                                                                                                                  // 48
                                                                                                                       // 49
    function sinonProperty(name, action, nonNegatedSuffix) {                                                           // 50
        utils.addProperty(chai.Assertion.prototype, name, function () {                                                // 51
            assertCanWorkWith(this);                                                                                   // 52
                                                                                                                       // 53
            var messages = getMessages(this._obj, action, nonNegatedSuffix, false);                                    // 54
            this.assert(this._obj[name], messages.affirmative, messages.negative);                                     // 55
        });                                                                                                            // 56
    }                                                                                                                  // 57
                                                                                                                       // 58
    function sinonPropertyAsBooleanMethod(name, action, nonNegatedSuffix) {                                            // 59
        utils.addMethod(chai.Assertion.prototype, name, function (arg) {                                               // 60
            assertCanWorkWith(this);                                                                                   // 61
                                                                                                                       // 62
            var messages = getMessages(this._obj, action, nonNegatedSuffix, false, [timesInWords(arg)]);               // 63
            this.assert(this._obj[name] === arg, messages.affirmative, messages.negative);                             // 64
        });                                                                                                            // 65
    }                                                                                                                  // 66
                                                                                                                       // 67
    function createSinonMethodHandler(sinonName, action, nonNegatedSuffix) {                                           // 68
        return function () {                                                                                           // 69
            assertCanWorkWith(this);                                                                                   // 70
                                                                                                                       // 71
            var alwaysSinonMethod = "always" + sinonName[0].toUpperCase() + sinonName.substring(1);                    // 72
            var shouldBeAlways = utils.flag(this, "always") && typeof this._obj[alwaysSinonMethod] === "function";     // 73
            var sinonMethod = shouldBeAlways ? alwaysSinonMethod : sinonName;                                          // 74
                                                                                                                       // 75
            var messages = getMessages(this._obj, action, nonNegatedSuffix, shouldBeAlways, slice.call(arguments));    // 76
            this.assert(this._obj[sinonMethod].apply(this._obj, arguments), messages.affirmative, messages.negative);  // 77
        };                                                                                                             // 78
    }                                                                                                                  // 79
                                                                                                                       // 80
    function sinonMethodAsProperty(name, action, nonNegatedSuffix) {                                                   // 81
        var handler = createSinonMethodHandler(name, action, nonNegatedSuffix);                                        // 82
        utils.addProperty(chai.Assertion.prototype, name, handler);                                                    // 83
    }                                                                                                                  // 84
                                                                                                                       // 85
    function exceptionalSinonMethod(chaiName, sinonName, action, nonNegatedSuffix) {                                   // 86
        var handler = createSinonMethodHandler(sinonName, action, nonNegatedSuffix);                                   // 87
        utils.addMethod(chai.Assertion.prototype, chaiName, handler);                                                  // 88
    }                                                                                                                  // 89
                                                                                                                       // 90
    function sinonMethod(name, action, nonNegatedSuffix) {                                                             // 91
        exceptionalSinonMethod(name, name, action, nonNegatedSuffix);                                                  // 92
    }                                                                                                                  // 93
                                                                                                                       // 94
    utils.addProperty(chai.Assertion.prototype, "always", function () {                                                // 95
        utils.flag(this, "always", true);                                                                              // 96
    });                                                                                                                // 97
                                                                                                                       // 98
    sinonProperty("called", "been called", " at least once, but it was never called");                                 // 99
    sinonPropertyAsBooleanMethod("callCount", "been called exactly %1", ", but it was called %c%C");                   // 100
    sinonProperty("calledOnce", "been called exactly once", ", but it was called %c%C");                               // 101
    sinonProperty("calledTwice", "been called exactly twice", ", but it was called %c%C");                             // 102
    sinonProperty("calledThrice", "been called exactly thrice", ", but it was called %c%C");                           // 103
    sinonMethodAsProperty("calledWithNew", "been called with new");                                                    // 104
    sinonMethod("calledBefore", "been called before %1");                                                              // 105
    sinonMethod("calledAfter", "been called after %1");                                                                // 106
    sinonMethod("calledOn", "been called with %1 as this", ", but it was called with %t instead");                     // 107
    sinonMethod("calledWith", "been called with arguments %*", "%C");                                                  // 108
    sinonMethod("calledWithExactly", "been called with exact arguments %*", "%C");                                     // 109
    sinonMethod("calledWithMatch", "been called with arguments matching %*", "%C");                                    // 110
    sinonMethod("returned", "returned %1");                                                                            // 111
    exceptionalSinonMethod("thrown", "threw", "thrown %1");                                                            // 112
}                                                                                                                      // 113
                                                                                                                       // 114
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/practicalmeteor:sinon/install-sinonChai.js                                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
// If the chai package is installed use it                                                                             // 1
if(Package['practicalmeteor:chai']){                                                                                   // 2
  chai.use(sinonChai);                                                                                                 // 3
}                                                                                                                      // 4
                                                                                                                       // 5
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/practicalmeteor:sinon/Helpers.coffee.js                                                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var SinonObjects, SinonSpies, SinonStubs,              
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

SinonObjects = (function() {
  function SinonObjects() {}

  SinonObjects.prototype.forbiddenNames = ['create', 'get', 'restore', 'restoreAll'];

  SinonObjects.prototype.get = function(name) {
    return this[name];
  };

  SinonObjects.prototype.restore = function(name) {
    if (!this[name]) {
      console.warn("Trying to restore a non-existing spy/stub with name: " + name);
      return;
    }
    if (this[name].restore) {
      this[name].restore();
      delete this[name];
    }
  };

  SinonObjects.prototype.restoreAll = function() {
    var key, _results;
    _results = [];
    for (key in this) {
      _results.push(this.restore(key));
    }
    return _results;
  };

  return SinonObjects;

})();

SinonSpies = (function(_super) {
  __extends(SinonSpies, _super);

  function SinonSpies() {
    return SinonSpies.__super__.constructor.apply(this, arguments);
  }

  SinonSpies.prototype.create = function(name, obj, method) {
    expect(name).to.be.a("string");
    if (this.forbiddenNames.indexOf(name) >= 0) {
      throw Error("A spy can't be named '" + name + "'. Please choose another name.");
    }
    if (!obj && !method) {
      return this[name] = sinon.spy();
    }
    if (!method) {
      expect(obj).to.be.a("function");
      return this[name] = sinon.spy(obj);
    }
    expect(method).to.be.a("string");
    if (this[name]) {
      this.restore(name);
    }
    return this[name] = sinon.spy(obj, method);
  };

  return SinonSpies;

})(SinonObjects);

SinonStubs = (function(_super) {
  __extends(SinonStubs, _super);

  function SinonStubs() {
    return SinonStubs.__super__.constructor.apply(this, arguments);
  }

  SinonStubs.prototype.create = function(name, obj, method, func) {
    expect(name).to.be.a("string");
    if (this.forbiddenNames.indexOf(name) >= 0) {
      throw Error("A stub can't be named '" + name + "'. Please choose another name.");
    }
    if (!obj && !method) {
      return this[name] = sinon.stub();
    }
    expect(method).to.be.a("string");
    if (this[name]) {
      this.restore(name);
    }
    return this[name] = sinon.stub(obj, method, func);
  };

  return SinonStubs;

})(SinonObjects);

spies = this.spies = new SinonSpies();

stubs = this.stubs = new SinonStubs();
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);

//////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package['practicalmeteor:sinon'] = {}, {
  sinon: sinon,
  sinonChai: sinonChai,
  spies: spies,
  stubs: stubs
});

})();
