/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import Sinon from 'sinon';

import {
  cleanup,
  fireEvent,
  prettyDOM,
  render,
  waitFor,
  within,
} from '../../../../../utils/testHelpers/testing-library';
import T from '../../../../Translation';
import Link from '../../../Link';
import Table from '../..';

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
      { col1: 'A ', col2: 1 },
      { col1: 'B', col2: 2 },
    ];

    const { queryAllByRole } = render(<Table data={data} columns={columns} />);

    const rows = queryAllByRole('row');
    expect(rows.length).to.equal(3);
    const [header, row1, row2] = rows;

    const cells = within(header).queryAllByRole('columnheader');
    expect(cells.length).to.equal(2);
    const [cell1, cell2] = cells;

    expect(!!within(cell1).queryByText('Column 1')).to.equal(true);
    expect(!!within(cell2).queryByText('Column 2')).to.equal(true);

    expect(!!within(header).queryByText('Column 1')).to.equal(true);
    expect(!!within(header).queryByText('Column 2')).to.equal(true);

    expect(!!within(row1).queryByText('A')).to.equal(true);
    expect(!!within(row1).queryByText('2')).to.equal(true);

    expect(!!within(row2).queryByText('B')).to.equal(true);
    expect(!!within(row2).queryByText('4')).to.equal(true);
  });

  // FIXME: Will probably work in meteor tests when we upgrade react-intl
  it.skip('works with i18n', () => {
    const columns = [
      { Header: <T id="general.yes" />, accessor: 'col1' },
      {
        Header: <T id="general.no" />,
        accessor: 'col2',
      },
    ];
    const data = [{ col1: 'A ', col2: 1 }];

    const { queryByText, debug, queryByRole } = render(
      <Table data={data} columns={columns} />,
    );

    expect(!!queryByText('Oui')).to.equal(true);
    expect(!!queryByText('Non')).to.equal(true);
  });

  it('aligns cells right, left or center, in the body and header', () => {
    const columns = [
      { Header: 'Column 1', accessor: 'col1', align: 'right' },
      { Header: 'Column 2', accessor: 'col2', align: 'center' },
    ];
    const data = [{ col1: 'A ', col2: 1 }];

    const { queryByText, debug, queryByRole } = render(
      <Table data={data} columns={columns} />,
    );

    // TODO: Write this test
  });

  it('adds a link on each row', () => {
    const columns = [
      { Header: 'Column 1', accessor: 'col1', align: 'right' },
      { Header: 'Column 2', accessor: 'col2', align: 'center' },
    ];
    const data = [{ col1: 'A ', col2: 1 }];

    const { queryAllByRole } = render(
      <Table
        data={data}
        columns={columns}
        addRowProps={({ original: { col1, col2 } }) => ({
          component: Link,
          to: `/${col1}${col2}`,
        })}
      />,
    );

    const rows = queryAllByRole('row');
    const [header, row1] = rows;

    fireEvent.click(row1);

    // TODO: Write this test
    // Expect routing to have worked somehow
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
      [header, row1, row2] = queryAllByRole('row');

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
      [header, row1, row2] = queryAllByRole('row');

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
        <Table data={data} columns={columns} initialPageSize={34} />,
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

      const { queryAllByRole, getByTitle, queryByText } = render(
        <Table data={data} columns={columns} />,
      );

      let [header, row1] = queryAllByRole('row');
      expect(!!within(row1).queryByText('0')).to.equal(true);
      expect(!!queryByText('1-25 of 100')).to.equal(true);

      const next = getByTitle('Next page');
      fireEvent.click(next);

      expect(!!queryByText('26-50 of 100')).to.equal(true);
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

      const select = getByLabelText('Rows per page', { exact: false });

      fireEvent.mouseDown(select);
      const options = getAllByRole('option');
      fireEvent.click(options[0]);

      rows = queryAllByRole('row');
      expect(rows.length).to.equal(12);
    });

    it('does server-side pagination', () => {
      const columns = [
        { Header: 'Column 1', accessor: 'col1' },
        { Header: 'Column 2', accessor: 'col2' },
      ];
      const data = Array.from({ length: 10 }, (_, i) => ({
        col1: i,
        col2: `${i}-2`,
      }));

      const { queryByText, getByTitle } = render(
        <Table
          data={data}
          columns={columns}
          tableOptions={{
            manualPagination: true,
            pageCount: 5,
          }}
          initialPageSize={10}
          allRowsCount={45}
        />,
      );
      expect(!!queryByText('1-10 of 45')).to.equal(true);

      const next = getByTitle('Next page');
      fireEvent.click(next);

      expect(!!queryByText('11-20 of 45')).to.equal(true);
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

      const checkboxes = queryAllByRole('checkbox');
      expect(checkboxes.length).to.equal(3);

      checkboxes.forEach(checkbox => {
        expect(checkbox.checked).to.equal(false);
      });

      const [selectAll] = checkboxes;

      fireEvent.click(selectAll);

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

  describe('onStateChange', () => {
    it('Provides a hook when changing the table state after mounting', async () => {
      const columns = [
        { Header: 'Column 1', accessor: 'col1' },
        { Header: 'Column 2', accessor: 'col2' },
      ];
      const data = [
        { col1: 'A', col2: '1' },
        { col1: 'B', col2: '2' },
      ];
      const onStateChange = Sinon.spy();

      const { getByText } = render(
        <Table data={data} columns={columns} onStateChange={onStateChange} />,
      );

      // Sort
      fireEvent.click(getByText('Column 1'));

      await waitFor(() => expect(onStateChange.calledOnce).to.equal(true));

      // Should not run on mount, only on subsequent changes
      expect(onStateChange.calledOnce).to.equal(true);
      expect(onStateChange.firstCall.args[0].sortBy[0]).to.deep.equal({
        id: 'col1',
        desc: false,
      });
    });

    it('It is only called once when react-table performs multiple state changes', async () => {
      const columns = [
        { Header: 'Column 1', accessor: 'col1' },
        { Header: 'Column 2', accessor: 'col2' },
      ];
      const data = Array.from({ length: 25 }, (_, i) => ({
        col1: i,
        col2: `${i}-2`,
      }));
      const onStateChange = Sinon.spy();

      const { getByText } = render(
        <Table
          data={data}
          columns={columns}
          onStateChange={onStateChange}
          tableOptions={{
            manualPagination: true,
            manualSortBy: true,
          }}
        />,
      );

      // Sort, renders twice, as it resets pagination to 0
      fireEvent.click(getByText('Column 1'));
      fireEvent.click(getByText('Column 1'));

      await waitFor(() => expect(onStateChange.calledOnce).to.equal(true));

      expect(onStateChange.firstCall.args[0].sortBy[0]).to.deep.equal({
        id: 'col1',
        desc: true,
      });
    });
  });
});
