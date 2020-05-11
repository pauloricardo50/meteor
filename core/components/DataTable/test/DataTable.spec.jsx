/* eslint-env mocha */
import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { expect } from 'chai';

import DataTable from '..';

describe.only('DataTable', () => {
  it('works', async () => {
    const { getByText, findByText, ...rest } = render(<DataTable />);
    console.log('rest:', rest);
    const result1 = await findByText('Hello');
    console.log('result1:', result1);
    const result2 = getByText('Hello');
    console.log('result2:', result2);
    // Test code
  });
});
