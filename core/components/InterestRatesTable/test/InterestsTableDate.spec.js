/* eslint-env mocha */
import { expect } from 'chai';

import { getLastFriday } from '../InterestsTableDate';

describe('InterestsTableDate getLastFriday', () => {
  it('should return a friday', () => {
    expect(getLastFriday('June 14, 2018 12:00:00 UTC+2').getDay()).to.equal(5);
    expect(getLastFriday('June 19, 2018 12:00:00 UTC+2').getDay()).to.equal(5);
    expect(getLastFriday('June 30, 2018 12:00:00 UTC+2').getDay()).to.equal(5);
    expect(getLastFriday('June 1, 2018 12:00:00 UTC+2').getDay()).to.equal(5);
  });

  it('should return the previous friday on a friday', () => {
    expect(getLastFriday('June 15, 2018 18:00:00 UTC+2').getDate()).to.equal(8);
  });
});
