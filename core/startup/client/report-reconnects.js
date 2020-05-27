import { DDP } from 'meteor/ddp-client';
import { Meteor } from 'meteor/meteor';
import { Monti } from 'meteor/montiapm:agent';
import { Tracker } from 'meteor/tracker';

const FIVE_MINUTES = 1000 * 60 * 5;

let wasConnected = false;
let disconnectTime = null;

Tracker.autorun(() => {
  const { connected } = Meteor.status();

  if (!connected && !disconnectTime) {
    disconnectTime = new Date();
  }
});

DDP.onReconnect(() => {
  // onReconnect is called during the
  // initial connection
  if (!wasConnected) {
    wasConnected = true;
    return;
  }

  // We only care about when the client
  // frequently disconnects and immediately reconnects.
  // If the delay was longer than 5 minutes, it is unlikely to be
  // that situation.
  if (disconnectTime && Date.now() - disconnectTime.getTime() < FIVE_MINUTES) {
    Monti.trackError('websockets', 'quick reconnect');
    disconnectTime = null;
  }
});
