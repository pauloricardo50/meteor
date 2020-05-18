/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';

import { interestRates } from '../../../../api/interestRates/queries';
import { callMethod } from '../../../../utils/testHelpers';
import {
  cleanup,
  render,
  waitFor,
  within,
} from '../../../../utils/testHelpers/testing-library';
import DataTable from '../..';

describe('DataTable', () => {
  beforeEach(async () => {
    await cleanup();
    await callMethod('resetDatabase');
  });

  it('queries and displays data', async () => {
    await callMethod('generateScenario', {
      scenario: { interestRates: [{}, {}] },
    });
    const columns = [
      { Header: 'Column 1', accessor: 'interest10.rateLow' },
      { Header: 'Column 2', accessor: 'interest15.rateLow' },
    ];

    const { getByTestId } = render(
      <DataTable queryConfig={{ query: interestRates }} columns={columns} />,
    );

    const table = getByTestId('data-table');

    expect(!!within(table).getByTestId('loading')).to.equal(true);

    await waitFor(() =>
      expect(within(table).getAllByRole('row').length).to.equal(4),
    );
  });

  it('shows the right amount of pages', async () => {
    await callMethod('generateScenario', {
      scenario: { interestRates: Array.from({ length: 28 }, () => ({})) },
    });
    const columns = [
      { Header: 'Column 1', accessor: 'interest10.rateLow' },
      { Header: 'Column 2', accessor: 'interest15.rateLow' },
    ];

    const { getByTestId, queryByText } = render(
      <DataTable queryConfig={{ query: interestRates }} columns={columns} />,
    );

    const table = getByTestId('data-table');

    expect(!!within(table).getByTestId('loading')).to.equal(true);

    await waitFor(() =>
      expect(within(table).getAllByRole('row').length).to.equal(27),
    );

    expect(!!queryByText('1-25 of 28')).to.equal(true);
  });
});
