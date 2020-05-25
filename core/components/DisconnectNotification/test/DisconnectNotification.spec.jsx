/* eslint-env mocha */

import React from 'react';
import { expect } from 'chai';

import {
  cleanup,
  render,
  waitFor,
} from '../../../utils/testHelpers/testing-library';
import { DisconnectNotification } from '../DisconnectNotification';

describe('DisconnectNotification', () => {
  beforeEach(() => cleanup());

  it('changes to open if a disconnection happens, after TIMEOUT', async () => {
    const { queryByText, rerender } = render(
      <DisconnectNotification status={{ connected: true }} timeout={500} />,
    );
    expect(queryByText('Il semble que vous soyiez déconnecté')).to.equal(null);

    rerender(
      <DisconnectNotification status={{ connected: false }} timeout={500} />,
    );
    expect(queryByText('Il semble que vous soyiez déconnecté')).to.equal(null);

    await waitFor(() =>
      expect(!!queryByText('Il semble que vous soyiez déconnecté')).to.equal(
        true,
      ),
    );
  });

  it('takes TIMEOUT to open if it starts disconnected, then changes back to closed instantly if connection is made', async () => {
    const { queryByText, rerender } = render(
      <DisconnectNotification status={{ connected: false }} timeout={500} />,
    );
    expect(queryByText('Il semble que vous soyiez déconnecté')).to.equal(null);

    await waitFor(() =>
      expect(!!queryByText('Il semble que vous soyiez déconnecté')).to.equal(
        true,
      ),
    );

    rerender(
      <DisconnectNotification status={{ connected: true }} timeout={500} />,
    );

    await waitFor(() =>
      expect(!!queryByText('Il semble que vous soyiez déconnecté')).to.equal(
        false,
      ),
    );
  });
});
