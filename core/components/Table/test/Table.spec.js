/* eslint-env mocha */
import { expect } from 'chai';

import { sortData, ORDER } from '../tableHelpers';

describe('<Table />', () => {
  describe('sortData', () => {
    let order;
    let orderBy;
    let data;
    let column;

    beforeEach(() => {
      order = ORDER.ASC;
      orderBy = undefined;
      column = 0;
    });

    describe('when data is strings', () => {
      beforeEach(() => {
        data = [{ columns: ['3'] }, { columns: ['1'] }, { columns: ['2'] }];
      });

      it('sorts 2 rows of data ascending', () => {
        const { data: sortedData } = sortData({
          data,
          newOrderBy: column,
          order,
          orderBy,
        });
        expect(sortedData).to.deep.equal([
          { columns: ['1'] },
          { columns: ['2'] },
          { columns: ['3'] },
        ]);
      });

      it('sorts 2 rows of data descending when the same column is sorted again', () => {
        // Initially, the data is already sorted by "column"
        orderBy = column;

        const { data: sortedData } = sortData({
          data,
          // Sort it again by "column"
          newOrderBy: column,
          order,
          orderBy,
        });

        expect(sortedData).to.deep.equal([
          { columns: ['3'] },
          { columns: ['2'] },
          { columns: ['1'] },
        ]);
      });

      it('sorts 3 rows of data ascending', () => {
        data = [
          { columns: ['test 2'] },
          { columns: ['test 3'] },
          { columns: ['test 1'] },
        ];
        const { data: sortedData } = sortData({
          data,
          newOrderBy: column,
          order,
          orderBy,
        });
        expect(sortedData).to.deep.equal([
          { columns: ['test 1'] },
          { columns: ['test 2'] },
          { columns: ['test 3'] },
        ]);
      });
    });

    describe('when data is numbers', () => {
      beforeEach(() => {
        order = ORDER.ASC;
        data = [{ columns: [3] }, { columns: [2] }];
      });

      it('sorts 2 rows of data ascending', () => {
        const { data: sortedData } = sortData({
          data,
          newOrderBy: column,
          order,
          orderBy,
        });

        expect(sortedData).to.deep.equal([{ columns: [2] }, { columns: [3] }]);
      });

      it('sorts 2 rows of data descending', () => {
        orderBy = column;

        const { data: sortedData } = sortData({
          data,
          newOrderBy: column,
          order,
          orderBy,
        });

        expect(sortedData).to.deep.equal([{ columns: [3] }, { columns: [2] }]);
      });
    });

    describe('when data is an object', () => {
      beforeEach(() => {
        order = ORDER.ASC;
        data = [
          { columns: [{ label: 'one', raw: 10 }] },
          { columns: [{ label: 'three', raw: -2 }] },
          { columns: [{ label: 'four', raw: 5 }] },
        ];
      });

      it('sorts 3 rows of data ascending', () => {
        const { data: sortedData } = sortData({
          data,
          newOrderBy: column,
          order,
          orderBy,
        });

        expect(sortedData).to.deep.equal([
          { columns: [{ label: 'three', raw: -2 }] },
          { columns: [{ label: 'four', raw: 5 }] },
          { columns: [{ label: 'one', raw: 10 }] },
        ]);
      });

      it('sorts 3 rows of data descending', () => {
        orderBy = column;
        const { data: sortedData } = sortData({
          data,
          newOrderBy: column,
          order,
          orderBy,
        });

        expect(sortedData).to.deep.equal([
          { columns: [{ label: 'one', raw: 10 }] },
          { columns: [{ label: 'four', raw: 5 }] },
          { columns: [{ label: 'three', raw: -2 }] },
        ]);
      });
    });
  });
});
