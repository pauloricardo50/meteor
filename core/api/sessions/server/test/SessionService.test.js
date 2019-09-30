/* eslint-env mocha */
import { resetDatabase } from 'meteor/xolvio:cleaner';

import { expect } from 'chai';
import moment from 'moment';

import SessionService from '../SessionService';

describe('SessionService', () => {
  beforeEach(() => {
    resetDatabase();
  });

  it('removes old sessions', async () => {
    const promises = [];
    for (let index = 10; index < 20; index++) {
      promises.push(SessionService.rawCollection.insert({
        _id: index,
        connectionId: index,
        updatedAt: moment()
          .subtract(index, 'minutes')
          .toDate(),
      }));
    }

    await Promise.all(promises);

    expect(SessionService.removeOldSessions()).to.equal(5);
  });
});
