import { Autoupdate } from 'meteor/autoupdate';

import React from 'react';
import { expect } from 'chai';

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

    expect(queryByText('Nouvelle version', { exact: false })).to.equal(null);
  });

  it('should show notification when update is available', async () => {
    Autoupdate.newClientAvailable = () => true;

    const { findAllByText } = render(<UpdateNotification />);
    await findAllByText('Nouvelle version', { exact: false });
  });
});
