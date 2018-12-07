import { SyncedCron } from 'meteor/littledata:synced-cron';

import '../shared-startup';

import { Inject } from 'meteor/meteorhacks:inject-initial';

import 'core/fixtures';
import 'core/api/api';
import 'core/api/api-server';

import '../accounts-config';
import './kadira';

import { irs10yFetch } from 'core/api/irs10y/server/methods';

const getRandomMinute = () => Math.floor(Math.random() * 59);

SyncedCron.add({
  name: 'Fetch IRS 10 Y',
  schedule(parser) {
    return parser.text(`at 6:${getRandomMinute()}`);
  },
  job() {
    irs10yFetch.run({});
  },
});

SyncedCron.start();

// Inject a loader before client is ready, is removed in the on startup function on the client
Inject.rawHead('loader', Assets.getText('loader.html'));
