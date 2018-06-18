/* eslint-env mocha */
import { expect } from 'chai';
import filterArrayOfObjects from '../filterArrayOfObjects';

const car1 = {
  name: 'Car 1',
  properties: { color: 'red', options: 'full' },
  tests: [{ type: 'crash', result: 5 }, { type: 'speed', result: 6 }],
  type: 'small',
};

const car2 = {
  name: 'Car 2',
  properties: { color: 'blue', options: 'full' },
  tests: [{ type: 'crash', result: 5 }, { type: 'speed', result: 5 }],
  type: 'compact',
};

const car3 = {
  name: 'Car 3',
  properties: { color: 'white', options: undefined },
  tests: [{ type: 'speed', result: 7 }],
  type: 'compact',
};

const data = [car1, car2, car3];

describe.only('filterArrayOfObjects', () => {
  it('filters data by a root property', () => {
    const filters = { type: ['compact'] };
    expect(filterArrayOfObjects(filters, data)).to.deep.equal([car2, car3]);
  });

  it('filters data by a nested object property', () => {
    const filters = { properties: { color: ['blue'] } };
    expect(filterArrayOfObjects(filters, data)).to.deep.equal([car2]);
  });

  it('filters data by a nested array property', () => {
    const filters = { tests: [{ result: [7] }] };
    expect(filterArrayOfObjects(filters, data)).to.deep.equal([car3]);
  });

  it('filters data by root, object and array filters', () => {
    const filters = {
      type: ['compact'],
      properties: { color: ['red', 'blue'] },
      tests: [{ type: ['crash'], result: [5] }],
    };
    expect(filterArrayOfObjects(filters, data)).to.deep.equal([car2]);
  });

  it('filters data by multiple array items', () => {
    const filters = {
      tests: [{ type: ['crash'] }, { type: ['speed'], result: [5, 7] }],
    };
    expect(filterArrayOfObjects(filters, data)).to.deep.equal([car2]);
  });

  it('filters data by any array item at a given index', () => {
    const filters = {
      tests: { 1: { type: ['speed'], result: [5] } },
    };
    expect(filterArrayOfObjects(filters, data)).to.deep.equal([car2]);
  });

  it('does not filter a data item when unless it matches all filters', () => {
    const filters = { name: ['Car 2'], properties: { color: ['red'] } };
    expect(filterArrayOfObjects(filters, data)).to.deep.equal([]);
  });

  it('returns an empty array when no data is matched', () => {
    const filters = {
      type: ['inexistent type'],
    };
    expect(filterArrayOfObjects(filters, data)).to.deep.equal([]);
  });

  it('filters by `undefined` filters');

  it('filters by interger filters');

  it('filters by string filters');

  it('does not filter data by a filter of which value is something other than an array');

  it('does not filter data by a filter of which value is an empty array');
});
