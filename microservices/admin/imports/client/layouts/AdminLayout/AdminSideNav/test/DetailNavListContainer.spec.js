/* eslint-env mocha */
import { expect } from 'chai';
import { withRouter } from 'react-router-dom';

import { compose } from 'core/api';
import withDataFilterAndSort from 'core/api/containerToolkit/withDataFilterAndSort';

import {
  withTotalCountState,
  withSetTotalCountLifecycle,
  withSideNavQuery,
  withIsEndProp,
} from '../DetailSideNavListContainer';

describe.only('DetailSideNavListContainer', () => {
  it('composes HoCs in the correct order', () => {
    const hocs = [
      withTotalCountState,
      withSetTotalCountLifecycle,
      withSideNavQuery,
      withIsEndProp,
      withDataFilterAndSort,
      withRouter,
    ];
    expect(compose.calledWith(...hocs)).to.equal(true);
  });
});
