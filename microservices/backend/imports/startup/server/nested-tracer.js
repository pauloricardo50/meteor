/* eslint-disable */
/* Copied from https://github.com/monti-apm/monti-apm-agent/blob/6eaa2a16b0163a4577ece7d8b5c8a252672bf4ea/lib/tracer/tracer.js
 * Modified to:
 * 1. Support an infinite level of nested events instead of one
 * 2. Save traces for certain methods or publications to a file
 * 3. Wrap Publication._publishChildrenOf from publish-composite to preserve kadira info in new fibers
 * 
 * Usage:
 * 1. Set the env variabe SAVE_TRACE_PATH, for example to `/home/<user>/backend-trace.json
 * 2. Update SAVED_TRACE_TYPE and SAVED_TRACE_NAME. The type can be `sub` or `method`, and
 *    the name is the name of the method or publication
 * 3. Run the backend. Each time a trace is finalized with the correct type and name,
 *    it is saved to the file, overwriting any previously saved traces.
 * 4. The `analyze-trace` and `aggregate-trace` scripts in the root `scripts` folder
 *    can be used to analyze the trace.
 */

// Controls which trace is stored in the file
const SAVED_TRACE_TYPE = 'sub'
const SAVED_TRACE_NAME = 'exposure_loans'
const SAVED_TRACE_PATH = process.env.SAVE_TRACE_PATH;

// Modified code
var Publication = require('meteor/reywood:publish-composite/lib/publication').default;

var oldPublish = Publication.prototype._publishChildrenOf;
Publication.prototype._publishChildrenOf = function () {
  Kadira._setInfo(this.subscription.meteorSub.__kadiraInfo);
  return oldPublish.apply(this, arguments);
}

// End of modified code

var eventLogger = Npm.require('debug')('kadira:tracer');
var REPETITIVE_EVENTS = { 'db': true, 'http': true, 'email': true, 'wait': true, 'async': true, 'custom': true, 'fs': true };
var TRACE_TYPES = ['sub', 'method', 'http'];
var MAX_TRACE_EVENTS = 1500;
import { _ } from 'meteor/underscore';
const fs = require('fs');

Tracer = function Tracer() {
  this._filters = [];
};

//In the future, we might wan't to track inner fiber events too.
//Then we can't serialize the object with methods
//That's why we use this method of returning the data
Tracer.prototype.start = function (name, type, {
  sessionId,
  msgId,
  userId
} = {}) {

  // for backward compatibility
  if (typeof name === 'object' && typeof type === 'object') {
    let session = name;
    let msg = type;
    sessionId = session.id;
    msgId = msg.id;
    userId = session.userId;

    if (msg.msg == 'method') {
      type = 'method';
      name = msg.method;
    } else if (msg.msg == 'sub') {
      type = 'sub';
      name = msg.name;
    } else {
      return null;
    }
  }

  if (TRACE_TYPES.indexOf(type) === -1) {
    console.warn(`Monti APM: unknown trace type "${type}"`);
    return null;
  }


  var traceInfo = {
    _id: `${sessionId}::${msgId || DefaultUniqueId.get()}`,
    type,
    name,
    session: sessionId,
    id: msgId,
    events: [],
    userId,
  };

  return traceInfo;
};

Tracer.prototype.event = function (traceInfo, type, data, metaData) {
  // do not allow to proceed, if already completed or errored
  var lastEvent = this.getLastEvent(traceInfo);

  if (
    // trace completed but has not been processed
    lastEvent &&
    ['complete', 'error'].indexOf(lastEvent.type) >= 0 ||
    // trace completed and processed.
    traceInfo.isEventsProcessed
  ) {
    return false;
  }

  var event = {
    type,
    at: Date.now(),
    endAt: null,
    nested: [],
  };

  // special handling for events that are not repetitive
  if (!REPETITIVE_EVENTS[type]) {
    event.endAt = event.at;
  }

  if (data) {
    var info = _.pick(traceInfo, 'type', 'name')
    event.data = this._applyFilters(type, data, info, "start");
  }

  if (metaData && metaData.name) {
    event.name = metaData.name
  }

  if (Kadira.options.eventStackTrace) {
    event.stack = CreateUserStack()
  }

  eventLogger("%s %s", type, traceInfo._id);

  // Modified code
  function addNested(events) {
    var lastNested = events[events.length - 1];
    if (!lastNested  || lastNested.endAt) {
      events.push(event);
      return event;
    }

    return addNested(lastNested.nested);
  }

  if (lastEvent && !lastEvent.endAt) {
    return addNested(lastEvent.nested);
  }
  // End of modified code

  traceInfo.events.push(event);

  return event;
};

Tracer.prototype.eventEnd = function (traceInfo, event, data) {
  if (event.endAt) {
    // Event already ended or is not a repititive event
    return false;
  }

  event.endAt = Date.now();
  event._duration = event.endAt - event.at;

  if (data) {
    var info = _.pick(traceInfo, 'type', 'name')
    event.data = Object.assign(
      event.data || {},
      this._applyFilters(`${event.type}end`, data, info, 'end')
    );
  }
  eventLogger("%s %s", event.type + 'end', traceInfo._id);

  return true;
};

Tracer.prototype.getLastEvent = function (traceInfo) {
  return traceInfo.events[traceInfo.events.length - 1]
};

Tracer.prototype.endLastEvent = function (traceInfo) {
  var lastEvent = this.getLastEvent(traceInfo);

  if (!lastEvent.endAt) {
    this.eventEnd(traceInfo, lastEvent);
    lastEvent.forcedEnd = true;
    return true;
  }
  return false;
};

// Most of the time, all of the nested events are async
// which is not helpful. This returns true if
// there are nested events other than async.
Tracer.prototype._hasUsefulNested = function (event) {
  return !event.nested.every(event => {
    return event.type === 'async';
  });
}

Tracer.prototype.buildEvent = function (event, depth = 0, trace) {
  var elapsedTimeForEvent = event.endAt - event.at;
  var builtEvent = [event.type];
  var nested = [];

  builtEvent.push(elapsedTimeForEvent);
  builtEvent.push(event.data || {});

  if (event.nested.length && this._hasUsefulNested(event)) {
    let prevEnd = event.at;
    for (let i = 0; i < event.nested.length; i++) {
      var nestedEvent = event.nested[i];
      if (!nestedEvent.endAt) {
        this.eventEnd(trace, nestedEvent);
        nestedEvent.forcedEnd = true;
      }

      var computeTime = nestedEvent.at - prevEnd;
      if (computeTime > 0) {
        nested.push(['compute', computeTime]);
      }

      nested.push(this.buildEvent(nestedEvent, depth + 1, trace));
      prevEnd = nestedEvent.endAt;
    }
  }


  if (
    nested.length ||
    event.stack ||
    event.forcedEnd ||
    event.name
  ) {
    builtEvent.push({
      stack: event.stack,
      nested: nested.length ? nested : undefined,
      forcedEnd: event.forcedEnd,
      name: event.name
    });
  }

  return builtEvent;
}

Tracer.prototype.buildTrace = function (traceInfo) {
  // Modified code
  if (traceInfo.name === SAVED_TRACE_NAME && traceInfo.type === SAVED_TRACE_TYPE) {
    const result = JSON.stringify(traceInfo);
    fs.writeFile(SAVED_TRACE_PATH, result, (e) => {
      console.log('wrote file', e)
    });
  }
  // End of modified code

  var firstEvent = traceInfo.events[0];
  var lastEvent = traceInfo.events[traceInfo.events.length - 1];
  var processedEvents = [];

  if (firstEvent.type !== 'start') {
    console.warn('Monti APM: trace has not started yet');
    return null;
  } else if (lastEvent.type !== 'complete' && lastEvent.type !== 'error') {
    //trace is not completed or errored yet
    console.warn('Monti APM: trace has not completed or errored yet');
    return null;
  } else {
    //build the metrics
    traceInfo.errored = lastEvent.type === 'error';
    traceInfo.at = firstEvent.at;

    var metrics = {
      total: lastEvent.at - firstEvent.at,
    };

    var totalNonCompute = 0;

    firstEvent = ['start', 0];
    if (traceInfo.events[0].data) {
      firstEvent.push(traceInfo.events[0].data);
    }
    processedEvents.push(firstEvent);

    for (var lc = 1; lc < traceInfo.events.length - 1; lc += 1) {
      var prevEvent = traceInfo.events[lc - 1];
      var event = traceInfo.events[lc];

      if (!event.endAt) {
        console.error('Monti APM: no end event for type: ', event.type);
        return null;
      }

      var computeTime = event.at - prevEvent.endAt;
      if (computeTime > 0) {
        processedEvents.push(['compute', computeTime]);
      }
      var builtEvent = this.buildEvent(event, 0, traceInfo);
      processedEvents.push(builtEvent);

      metrics[event.type] = metrics[event.type] || 0;
      metrics[event.type] += builtEvent[1];
      totalNonCompute += builtEvent[1];
    }
  }

  computeTime = lastEvent.at - traceInfo.events[traceInfo.events.length - 2].endAt;
  if (computeTime > 0) processedEvents.push(['compute', computeTime]);

  var lastEventData = [lastEvent.type, 0];
  if (lastEvent.data) lastEventData.push(lastEvent.data);
  processedEvents.push(lastEventData);

  if (processedEvents.length > MAX_TRACE_EVENTS) {
    const removeCount = processedEvents.length - MAX_TRACE_EVENTS
    processedEvents.splice(MAX_TRACE_EVENTS, removeCount);
  }

  metrics.compute = metrics.total - totalNonCompute;
  traceInfo.metrics = metrics;
  traceInfo.events = processedEvents;
  traceInfo.isEventsProcessed = true;

  console.log('built trace', traceInfo.name, traceInfo.type, metrics.total)
  return traceInfo;
};

Tracer.prototype.addFilter = function (filterFn) {
  this._filters.push(filterFn);
};

Tracer.prototype._applyFilters = function (eventType, data, info) {
  this._filters.forEach(function (filterFn) {
    data = filterFn(eventType, _.clone(data), info);
  });

  return data;
};

Kadira.tracer = new Tracer();
// need to expose Tracer to provide default set of filters
Kadira.Tracer = Tracer;
