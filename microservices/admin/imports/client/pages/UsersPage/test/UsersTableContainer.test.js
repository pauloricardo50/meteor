/* eslint-env mocha */
import { expect } from 'chai';
import { compose } from 'recompose';

import withTableFilters from 'core/containers/withTableFilters';
import { withUsersQuery } from '../UsersTableContainer';

describe('UsersTableContainer', () => {
  it('composes HoCs in the correct order', () => {
    const hocs = [withUsersQuery, withTableFilters];
    expect(compose.calledWith(...hocs)).to.equal(true);
  });
});
