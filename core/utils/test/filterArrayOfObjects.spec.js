/* eslint-env mocha */
import { expect } from 'chai';
import filterArrayOfObjects from '../filterArrayOfObjects';

const car1 = {
  name: 'Car 1',
  properties: { color: 'red', options: 'full' },
  tests: [{ type: 'crash', result: 5 }, { type: 'speed', result: 6 }],
  type: 'small',
  tags: ['reddish'],
};

const car2 = {
  name: 'Car 2',
  properties: { color: 'blue', options: 'full' },
  tests: [{ type: 'crash', result: 5 }, { type: 'speed', result: 5 }],
  type: 'compact',
  fuelConsumtion: undefined,
  tags: ['sport'],
};

const car3 = {
  name: 'Car 3',
  properties: { color: 'white', options: undefined },
  tests: [{ type: 'speed', result: 7 }],
  type: 'compact',
  fuelConsumtion: 8,
  tags: ['sport', 'rally'],
};

const data = [car1, car2, car3];

describe('filterArrayOfObjects', () => {
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

  it('filters data by an array item at any given index', () => {
    const filters = { tests: { 1: { type: ['speed'], result: [5] } } };
    expect(filterArrayOfObjects(filters, data)).to.deep.equal([car2]);
  });

  it('filters by `undefined` filters', () => {
    const filters = { fuelConsumtion: [undefined] };
    expect(filterArrayOfObjects(filters, data)).to.deep.equal([car1, car2]);
  });

  it('filters by integer filters', () => {
    const filters = { fuelConsumtion: [8, 9] };
    expect(filterArrayOfObjects(filters, data)).to.deep.equal([car3]);
  });

  it('filters by string filters', () => {
    const filters = { name: ['Car 2', 'Car 3'] };
    expect(filterArrayOfObjects(filters, data)).to.deep.equal([car2, car3]);
  });

  it('filters data items by their array fields', () => {
    const filters = { tags: ['rally', 'reddish'] };
    expect(filterArrayOfObjects(filters, data)).to.deep.equal([car1, car3]);
  });

  it('returns an empty array when no data is matched', () => {
    const filters = { type: ['inexistent type'] };
    expect(filterArrayOfObjects(filters, data)).to.deep.equal([]);
  });

  it("removes the data items that don't match all filters", () => {
    const filters = { name: ['Car 2'], properties: { color: ['red'] } };
    expect(filterArrayOfObjects(filters, data)).to.deep.equal([]);
  });

  it(`does not filter data by a filter of which value
      is something other than an array`, () => {
    const filters = { name: 'Car 2' };
    expect(filterArrayOfObjects(filters, data)).to.deep.equal(data);
  });

  it(`does not filter data by a filter of which value
      is an empty array`, () => {
    const filters = { name: [] };
    expect(filterArrayOfObjects(filters, data)).to.deep.equal(data);
  });
});
