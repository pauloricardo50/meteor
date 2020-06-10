/**
 * Script to aggregate stats for traces. Traces are generated by the
 * backend microservice when the env var SAVE_TRACE_PATH is set
 * usage:
 *   node aggregate-trace.js ./path/to/trace.json
 */

const [, , tracePath] = process.argv;
// eslint-disable-next-line import/no-dynamic-require
const trace = require(tracePath);

console.log('Loaded trace with id', trace._id);

const sums = {};

function aggregateEvents(events, depth = 0, path = []) {
  for (let i = 0; i < events.length; i += 1) {
    const event = events[i];

    if (event.type === 'async' && event.nested.length === 0) {
      // eslint-disable-next-line no-continue
      continue;
    }

    if (event.nested && event.nested.length) {
      if (
        !event.nested.every(
          nestedEvent =>
            nestedEvent.type === 'async' &&
            nestedEvent.nested &&
            nestedEvent.nested.length,
        )
      ) {
        const newPath = [...path];
        const coll = event.data && event.data.coll ? event.data.coll : ' ';
        if (coll !== path[path.length - 1]) {
          newPath.push(coll);

          if (event.type === 'db') {
            const key = newPath.join('->');
            sums[key] = sums[key] || { total: 0, count: 0 };
            sums[key].total += event._duration;
            sums[key].count += 1;
          }
        }
        aggregateEvents(event.nested, depth + 1, newPath);
      }
    }
  }
}

aggregateEvents(trace.events);

console.dir(sums);
