/* eslint-env mocha */
import { expect } from 'chai';

import { sortData, ORDER } from '../tableHelpers';

describe('<Table />', () => {
  describe('sortData', () => {
    let order = ORDER.ASC;
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
        data = [{ columns: ['3'] }, { columns: ['2'] }];
      });

      it('sorts 2 rows of data ascending', () => {
        const { data: sortedData } = sortData({
          data,
          newOrderBy: column,
          order,
          orderBy,
        });
        expect(data[0].columns[column]).to.equal(sortedData[0].columns[column]);
      });

      it('sorts 2 rows of data descending when clicked again', () => {
        orderBy = column;

        const { data: sortedData } = sortData({
          data,
          newOrderBy: column,
          order,
          orderBy,
        });
        expect(data[0].columns[column]).to.equal(sortedData[1].columns[column]);
      });

      it('sorts 3 rows of data ascending', () => {
        data = [
          { columns: ['test 3'] },
          { columns: ['test 2'] },
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
        expect(data[0].columns[column]).to.equal(sortedData[0].columns[column]);
      });

      it('sorts 2 rows of data descending', () => {
        orderBy = column;

        const { data: sortedData } = sortData({
          data,
          newOrderBy: column,
          order,
          orderBy,
        });
        expect(data[0].columns[column]).to.equal(sortedData[1].columns[column]);
      });
    });
  });
});
