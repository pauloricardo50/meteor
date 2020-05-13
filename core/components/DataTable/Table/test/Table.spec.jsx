/* eslint-env mocha */
import React from 'react';
import { cleanup, fireEvent, render, within } from '@testing-library/react';
import { expect } from 'chai';

import Table from '..';

describe('Table', () => {
  beforeEach(() => {
    cleanup();
  });

  it('renders all columns and rows ', () => {
    const columns = [
      { Header: 'Column 1', accessor: 'col1' },
      { Header: 'Column 2', accessor: 'col2', Cell: ({ value }) => value * 2 },
    ];
    const data = [
      { col1: 'A', col2: 1 },
      { col1: 'B', col2: 2 },
    ];

    const { queryAllByRole } = render(<Table data={data} columns={columns} />);

    const rows = queryAllByRole('row');
    expect(rows.length).to.equal(3);
    const [header, row1, row2] = rows;

    expect(!!within(header).queryByText('Column 1')).to.equal(true);
    expect(!!within(header).queryByText('Column 2')).to.equal(true);

    expect(!!within(row1).queryByText('A')).to.equal(true);
    expect(!!within(row1).queryByText('2')).to.equal(true);

    expect(!!within(row2).queryByText('B')).to.equal(true);
    expect(!!within(row2).queryByText('4')).to.equal(true);
  });

  describe('sorting', () => {
    it('Sorts rows client-side', () => {
      const columns = [
        { Header: 'Column 1', accessor: 'col1' },
        { Header: 'Column 2', accessor: 'col2' },
      ];
      const data = [
        { col1: 'A', col2: '1' },
        { col1: 'B', col2: '2' },
      ];

      const { queryAllByRole, getByText } = render(
        <Table data={data} columns={columns} />,
      );

      let [header, row1, row2] = queryAllByRole('row');

      expect(!!within(row1).queryByText('A')).to.equal(true);
      expect(!!within(row2).queryByText('B')).to.equal(true);

      fireEvent.click(getByText('Column 1'));
      fireEvent.click(getByText('Column 1'));
      row1 = queryAllByRole('row')[1];
      row2 = queryAllByRole('row')[2];

      // Rows are inverted
      expect(!!within(row2).queryByText('A')).to.equal(true);
      expect(!!within(row1).queryByText('B')).to.equal(true);
    });

    it('disabled sorting if necessary', () => {
      const columns = [
        { Header: 'Column 1', accessor: 'col1', disableSortBy: true },
        { Header: 'Column 2', accessor: 'col2' },
      ];
      const data = [
        { col1: 'A', col2: '1' },
        { col1: 'B', col2: '2' },
      ];

      const { queryAllByRole, getByText } = render(
        <Table data={data} columns={columns} />,
      );

      let [header, row1, row2] = queryAllByRole('row');

      expect(!!within(row1).queryByText('A')).to.equal(true);
      expect(!!within(row2).queryByText('B')).to.equal(true);

      fireEvent.click(getByText('Column 1'));
      fireEvent.click(getByText('Column 1'));
      row1 = queryAllByRole('row')[1];
      row2 = queryAllByRole('row')[2];

      // Rows are not inverted
      expect(!!within(row1).queryByText('A')).to.equal(true);
      expect(!!within(row2).queryByText('B')).to.equal(true);
    });

    it('sets initial sorting', () => {
      const columns = [
        { Header: 'Column 1', accessor: 'col1' },
        { Header: 'Column 2', accessor: 'col2' },
      ];
      const data = [
        { col1: 'A', col2: '1' },
        { col1: 'B', col2: '2' },
      ];

      const { queryAllByRole } = render(
        <Table
          data={data}
          columns={columns}
          initialSort={{ id: 'col1', desc: true }}
        />,
      );

      const [header, row1, row2] = queryAllByRole('row');

      expect(!!within(row1).queryByText('B')).to.equal(true);
      expect(!!within(row2).queryByText('A')).to.equal(true);
    });
  });

  describe('Pagination', () => {
    it('Paginates rows', () => {
      const columns = [
        { Header: 'Column 1', accessor: 'col1' },
        { Header: 'Column 2', accessor: 'col2' },
      ];
      const data = Array.from({ length: 100 }, (_, i) => ({
        col1: i,
        col2: i,
      }));

      const { queryAllByRole } = render(
        <Table data={data} columns={columns} />,
      );

      const rows = queryAllByRole('row');
      expect(rows.length).to.equal(27);
    });

    it('allows different page sizes', () => {
      const columns = [
        { Header: 'Column 1', accessor: 'col1' },
        { Header: 'Column 2', accessor: 'col2' },
      ];
      const data = Array.from({ length: 100 }, (_, i) => ({
        col1: i,
        col2: i,
      }));

      const { queryAllByRole } = render(
        <Table data={data} columns={columns} pageSize={34} />,
      );

      const rows = queryAllByRole('row');
      expect(rows.length).to.equal(36);
    });

    it('shows pagination when there are more rows than the smallest pagination option', () => {
      const columns = [
        { Header: 'Column 1', accessor: 'col1' },
        { Header: 'Column 2', accessor: 'col2' },
      ];
      const data = Array.from({ length: 5 }, (_, i) => ({
        col1: i,
        col2: i,
      }));

      const { queryAllByRole } = render(
        <Table
          data={data}
          columns={columns}
          // Imagine this is the 2nd page of 30 total results
          tableOptions={{ pageCount: 2, manualPagination: true }}
        />,
      );

      const rows = queryAllByRole('row');
      expect(rows.length).to.equal(7);
    });

    it('can do client-side pagination', () => {
      const columns = [
        { Header: 'Column 1', accessor: 'col1' },
        { Header: 'Column 2', accessor: 'col2' },
      ];
      const data = Array.from({ length: 100 }, (_, i) => ({
        col1: i,
        col2: `${i}-2`,
      }));

      const { queryAllByRole, getByTitle } = render(
        <Table data={data} columns={columns} />,
      );

      let [header, row1] = queryAllByRole('row');
      expect(!!within(row1).queryByText('0')).to.equal(true);

      const next = getByTitle('Next page');
      fireEvent.click(next);

      [header, row1] = queryAllByRole('row');
      expect(!!within(row1).queryByText('0')).to.equal(false);
      expect(!!within(row1).queryByText('25')).to.equal(true);
    });

    it('can change pagination size', () => {
      const columns = [
        { Header: 'Column 1', accessor: 'col1' },
        { Header: 'Column 2', accessor: 'col2' },
      ];
      const data = Array.from({ length: 100 }, (_, i) => ({
        col1: i,
        col2: `${i}-2`,
      }));

      const { queryAllByRole, getByLabelText, getAllByRole } = render(
        <Table data={data} columns={columns} />,
      );

      let rows = queryAllByRole('row');
      expect(rows.length).to.equal(27);

      const select = getByLabelText('Rows per page:');

      fireEvent.mouseDown(select);
      const options = getAllByRole('option');
      fireEvent.click(options[0]);

      rows = queryAllByRole('row');
      expect(rows.length).to.equal(12);
    });
  });

  describe('Row selection', () => {
    it('can select all rows at once', () => {
      const columns = [
        { Header: 'Column 1', accessor: 'col1' },
        { Header: 'Column 2', accessor: 'col2' },
      ];
      const data = [
        { col1: 'A', col2: '1' },
        { col1: 'B', col2: '2' },
      ];

      const { queryAllByRole } = render(
        <Table data={data} columns={columns} selectable />,
      );

      let checkboxes = queryAllByRole('checkbox');
      expect(checkboxes.length).to.equal(3);

      checkboxes.forEach(checkbox => {
        expect(checkbox.checked).to.equal(false);
      });

      const [selectAll] = checkboxes;

      fireEvent.click(selectAll);

      checkboxes = queryAllByRole('checkbox');

      checkboxes.forEach(checkbox => {
        expect(checkbox.checked).to.equal(true);
      });
    });

    it('can select individual rows', () => {
      const columns = [
        { Header: 'Column 1', accessor: 'col1' },
        { Header: 'Column 2', accessor: 'col2' },
      ];
      const data = [
        { col1: 'A', col2: '1' },
        { col1: 'B', col2: '2' },
      ];

      const { queryAllByRole } = render(
        <Table data={data} columns={columns} selectable />,
      );

      let [selectAll, select1, select2] = queryAllByRole('checkbox');

      fireEvent.click(select1);

      [selectAll, select1, select2] = queryAllByRole('checkbox');

      expect(select1.checked).to.equal(true);
      expect(select2.checked).to.equal(false);
    });
  });
});
