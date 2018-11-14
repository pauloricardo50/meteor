// @flow
/* eslint-env mocha */
import { expect } from 'chai';

import { SlackService } from '../../SlackService';

const TEST_CHANNEL = 'test';

describe('SlackService - client', () => {
  it('should not throw from client', () => {
    const slack = new SlackService({ serverSide: false });

    return slack
      .send({ channel: TEST_CHANNEL, text: 'should not throw from client' })
      .catch((err) => {
        expect(err).to.equal(undefined);
      });
  });
});
