/* eslint-env mocha */

import React from 'react';
import { expect } from 'chai';
import { Autoupdate } from 'meteor/autoupdate';

import { cleanup, render } from '../../../../utils/testHelpers/testing-library';
import UpdateNotification from '../../UpdateNotification';

describe('UpdateNotification', () => {
  const oldNewClientAvailable = Autoupdate.newClientAvailable;

  beforeEach(() => cleanup());
  afterEach(() => {
    Autoupdate.newClientAvailable = oldNewClientAvailable;
  });

  it('should render nothing by default', () => {
    const { queryByText } = render(<UpdateNotification />);

    expect(queryByText('Update')).to.equal(null);
  });

  it('should show notification when update is available', async () => {
    Autoupdate.newClientAvailable = () => true;

    const { findByText } = render(<UpdateNotification />);
    await findByText('Update available!', { exact: false });
  });
});
