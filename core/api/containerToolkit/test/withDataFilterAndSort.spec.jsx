/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';

import { shallow } from '../../../utils/testHelpers/enzyme';

import withDataFilterAndSort, {
  makeDataFilterAndSort,
} from '../withDataFilterAndSort';
import { ORDER } from '../../../utils/sortArrayOfObjects';

let WrappedComponent;
let data;

const component = (props) => {
  const withDataFilterAndSortHOC = makeDataFilterAndSort({});
  const FinalComponent = withDataFilterAndSortHOC(WrappedComponent);
  return shallow(<FinalComponent {...props} />);
};

describe('withDataFilterAndSort', () => {
  beforeEach(() => {
    WrappedComponent = () => null;

    data = [
      { name: 'James', age: 23 },
      { name: 'John', age: 20 },
      { name: 'Alex', age: 26 },
    ];
  });

  it('is a default product of the makeDataFilterAndSort factory', () => {
    expect(withDataFilterAndSort.toString()).to.equal(makeDataFilterAndSort({}).toString());
  });

  it('passes a filtered data prop to the wrapper component', () => {
    const props = {
      data,
      filterOptions: { age: { $gt: 22 } },
    };

    const wrapper = component(props).find(WrappedComponent);

    expect(wrapper.prop('data')).to.deep.equal([
      { name: 'James', age: 23 },
      { name: 'Alex', age: 26 },
    ]);
  });

  it('passes a sorted data prop to the wrapper component', () => {
    const props = {
      data,
      sortOption: { field: 'age', order: ORDER.DESC },
    };

    const wrapper = component(props).find(WrappedComponent);

    expect(wrapper.prop('data')).to.deep.equal([
      { name: 'Alex', age: 26 },
      { name: 'James', age: 23 },
      { name: 'John', age: 20 },
    ]);
  });

  it(`passes a both sorted and filtered data prop
      to the wrapper component`, () => {
    const props = {
      data,
      filterOptions: { age: { $in: [20, 26] } },
      sortOption: { field: 'name', order: ORDER.ASC },
    };

    const wrapper = component(props).find(WrappedComponent);

    expect(wrapper.prop('data')).to.deep.equal([
      { name: 'Alex', age: 26 },
      { name: 'John', age: 20 },
    ]);
  });
});
