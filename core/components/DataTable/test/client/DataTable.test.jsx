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
    console.log('DataTable - start beforeEach');
    await cleanup();
    console.log('resetDatabase start');
    await callMethod('resetDatabase');
    console.log('resetDatabase finished');
    console.log('DataTable - finished beforeEach');
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

    await waitFor(() =>
      expect(within(table).getAllByRole('row').length).to.equal(4),
    );
  });

  it('shows the right amount of pages', async () => {
    await callMethod('generateScenario', {
      scenario: { interestRates: Array.from({ length: 15 }, () => ({})) },
    });
    const columns = [
      { Header: 'Column 1', accessor: 'interest10.rateLow' },
      { Header: 'Column 2', accessor: 'interest15.rateLow' },
    ];

    const { getByTestId, queryByText } = render(
      <DataTable queryConfig={{ query: interestRates }} columns={columns} />,
    );

    const table = getByTestId('data-table');

    await waitFor(() =>
      expect(within(table).getAllByRole('row').length).to.equal(12),
    );

    expect(!!queryByText('1-10 of 15')).to.equal(true);
  });
});
