const os = require('os');
const monitoring = require('@google-cloud/monitoring');

const { METRICS_CREDENTIALS } = process.env;
const projectId = 'e-potek-1499177443071';
const FIVE_SECONDS = 1000 * 5;
const metrics = ['rss', 'heapTotal', 'heapUsed', 'external'];

if (!METRICS_CREDENTIALS) {
  console.log('Memory monitoring is disabled');
  return;
}

console.log('Memory monitoring is enabled');

// Creates a client
const client = new monitoring.MetricServiceClient({
  credentials: JSON.parse(METRICS_CREDENTIALS),
});

function prepareSeries(metric, point) {
  return {
    metric: {
      type: `custom.googleapis.com/backend/memory-${metric}`,
      labels: {
        host: os.hostname(),
      },
    },
    resource: {
      type: 'global',
      labels: {
        // eslint-disable-next-line
        project_id: projectId,
      },
    },
    points: [
      {
        interval: {
          endTime: {
            seconds: point.time / 1000,
          },
        },
        value: {
          doubleValue: point[metric],
        },
      },
    ],
  };
}

async function send(point) {
  const request = {
    name: client.projectPath(projectId),
    timeSeries: metrics.map(metricName => prepareSeries(metricName, point)),
  };

  await client.createTimeSeries(request);
}

function record() {
  setTimeout(record, FIVE_SECONDS);

  const { rss, heapTotal, heapUsed, external } = process.memoryUsage();
  const point = {
    time: Date.now(),
    rss,
    heapTotal,
    heapUsed,
    external,
  };

  send(point);
}

record();
