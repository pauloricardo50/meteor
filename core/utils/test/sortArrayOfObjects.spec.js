/* eslint-env mocha */
import { expect } from 'chai';
import cloneDeep from 'lodash/cloneDeep';

import sortArrayOfObjects, { ORDER } from '../sortArrayOfObjects';

describe('sortArrayOfObjects', () => {
  it('sorts objects ascending by root values', () => {
    const input = [
      { someValue: 3, anotherValue: 2 },
      { someValue: 1, anotherValue: 5 },
      { someValue: -2, anotherValue: 0 },
      { someValue: 0, anotherValue: 2 },
      { someValue: -2, anotherValue: 2 },
    ];
    const expectedOutput = [
      { someValue: -2, anotherValue: 0 },
      { someValue: -2, anotherValue: 2 },
      { someValue: 0, anotherValue: 2 },
      { someValue: 1, anotherValue: 5 },
      { someValue: 3, anotherValue: 2 },
    ];
    expect(sortArrayOfObjects(input, 'someValue', ORDER.ASC)).to.deep.equal(
      expectedOutput,
    );
  });

  it('sorts objects descending by root values', () => {
    const input = [
      { someValue: 3, anotherValue: 2 },
      { someValue: 1, anotherValue: 5 },
      { someValue: -2, anotherValue: 0 },
      { someValue: 0, anotherValue: 2 },
      { someValue: -2, anotherValue: 2 },
    ];
    const expectedOutput = [
      { someValue: 3, anotherValue: 2 },
      { someValue: 1, anotherValue: 5 },
      { someValue: 0, anotherValue: 2 },
      { someValue: -2, anotherValue: 0 },
      { someValue: -2, anotherValue: 2 },
    ];
    expect(sortArrayOfObjects(input, 'someValue', ORDER.DESC)).to.deep.equal(
      expectedOutput,
    );
  });

  it('sorts objects ascending by nested values', () => {
    const input = [
      { someValue: -3, anotherVal: 'val', a: { b: 'x' } },
      { someValue: 2, anotherVal: 'val', a: { b: 'a' } },
      { someValue: 4, a: { b: 'z' } },
      { someValue: 1, a: { b: 'cc' } },
      { a: { b: 'dd' }, someValue: 4 },
    ];
    const expectedOutput = [
      { someValue: 2, anotherVal: 'val', a: { b: 'a' } },
      { someValue: 1, a: { b: 'cc' } },
      { a: { b: 'dd' }, someValue: 4 },
      { someValue: -3, anotherVal: 'val', a: { b: 'x' } },
      { someValue: 4, a: { b: 'z' } },
    ];
    expect(sortArrayOfObjects(input, 'a.b', ORDER.ASC)).to.deep.equal(
      expectedOutput,
    );
  });

  it('sorts objects descending by nested values', () => {
    const input = [
      { someValue: -3, anotherVal: 'val', a: { b: 'x' } },
      { someValue: 2, anotherVal: 'val', a: { b: 'a' } },
      { someValue: 4, a: { b: 'z' } },
      { someValue: 1, a: { b: 'cc' } },
      { a: { b: 'dd' }, someValue: 4 },
    ];
    const expectedOutput = [
      { someValue: 4, a: { b: 'z' } },
      { someValue: -3, anotherVal: 'val', a: { b: 'x' } },
      { a: { b: 'dd' }, someValue: 4 },
      { someValue: 1, a: { b: 'cc' } },
      { someValue: 2, anotherVal: 'val', a: { b: 'a' } },
    ];
    expect(sortArrayOfObjects(input, 'a.b', ORDER.DESC)).to.deep.equal(
      expectedOutput,
    );
  });

  it('sorts objects by case-insensitive string values', () => {
    const input = [{ a: 'ba' }, { a: 'aa' }, { a: 'Aa' }, { a: 'Zz' }];
    const expectedOutput = [{ a: 'aa' }, { a: 'Aa' }, { a: 'ba' }, { a: 'Zz' }];
    expect(sortArrayOfObjects(input, 'a', ORDER.ASC)).to.deep.equal(
      expectedOutput,
    );
  });

  it('sorts objects ascending by default', () => {
    const input = [{ a: 2 }, { a: 1 }];
    const expectedOutput = [{ a: 1 }, { a: 2 }];
    expect(sortArrayOfObjects(input, 'a')).to.deep.equal(expectedOutput);
  });

  it('does not mutate the input array', () => {
    const input = [{ a: 2 }, { a: 1 }];
    const inputClone = cloneDeep(input);
    sortArrayOfObjects(input, 'a', ORDER.ASC);
    expect(input).to.deep.equal(inputClone);
  });

  it('returns the same input when the sort field is undefined', () => {
    const input = [{ a: 2 }, { a: 1 }];
    expect(sortArrayOfObjects(input, undefined, ORDER.ASC)).to.equal(input);
  });

  it('returns the same input when the sort field is an empty string', () => {
    const input = [{ a: 2 }, { a: 1 }];
    expect(sortArrayOfObjects(input, '', ORDER.ASC)).to.equal(input);
  });
});
