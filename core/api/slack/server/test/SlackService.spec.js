// @flow
/* eslint-env mocha */
import { expect } from 'chai';

import { SlackService } from '../../SlackService';

const TEST_CHANNEL = 'test';

describe('SlackService - server', () => {
  it('should not throw from server', () => {
    const slack = new SlackService({ serverSide: true });

    return slack
      .send({ channel: TEST_CHANNEL, text: 'should not throw from server' })
      .catch((err) => {
        expect(err).to.equal(undefined);
      });
  });
});
