/* eslint-env mocha */
import { expect } from 'chai';
import { EventEmitter } from 'events';

import EventService from '../../EventService';

let TestEventService;

describe('EventService', () => {
  beforeEach(() => {
    TestEventService = new EventService({
      emmitter: new EventEmitter(),
    });
  });

  describe('getListenerFunctions', () => {
    it('returns an array of listeners for a given event', () => {
      const listener = () => {};

      TestEventService.addListener('listener1', listener);
      expect(TestEventService.getListenerFunctions('listener1').includes(listener)).to.equal(true);
    });

    it(`returns an empty array
        when the event doesn't have any listeners`, () => {
      expect(TestEventService.getListenerFunctions('listener1')).to.deep.equal([]);
    });
  });
});
