/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import Select from 'react-select';

import { getMountedComponent } from '../../../../../utils/testHelpers';
import T from '../../../../Translation';
import TableFilter from '../../TableFilter';

let defaultProps;

const component = props =>
  getMountedComponent({
    Component: TableFilter,
    props,
    withRouter: false,
  });

describe('TableFilter', () => {
  beforeEach(() => {
    getMountedComponent.reset();

    defaultProps = {
      data: [
        { name: 'John', city: 'London', eyesColor: 'blue', age: 24 },
        { name: 'Alex', city: 'London', eyesColor: 'green', age: 20 },
        { name: 'Rebecca', city: 'Portland', eyesColor: 'black', age: 24 },
      ],
      filter: { path: ['eyesColor'], value: ['blue', 'black'] },
      onChange: () => {},
    };
  });

  it('renders the `Select` component with a `true` multi prop', () => {
    expect(component(defaultProps)
      .find(Select)
      .first()
      .prop('multi')).to.equal(true);
  });

  it('renders the `Select` component with a `false` simpleValue prop', () => {
    expect(component(defaultProps)
      .find(Select)
      .first()
      .prop('simpleValue')).to.equal(false);
  });

  it('renders the `Select` component with the correct `options` prop for the current filter', () => {
    const expectedOptions = [
      { label: 'blue', value: 'blue' },
      { label: 'green', value: 'green' },
      { label: 'black', value: 'black' },
    ];
    expect(component(defaultProps)
      .find(Select)
      .first()
      .prop('options')).to.deep.equal(expectedOptions);
  });

  it(`removes duplicate options before passing them
      to the 'Select' component`, () => {
    const data = [{ name: 'Name 1' }, { name: 'Name 1' }, { name: 'Name 2' }];
    const filter = { path: ['name'], value: 1 };

    const expectedOptions = [
      { label: 'Name 1', value: 'Name 1' },
      { label: 'Name 2', value: 'Name 2' },
    ];

    expect(component({ data, filter })
      .find(Select)
      .first()
      .prop('options')).to.deep.equal(expectedOptions);
  });

  it('renders the `Select` component with the correct `value` prop', () => {
    const filter = { path: ['name'], value: ['Name 2', 'Name 3'] };
    const data = [];
    const expectedOptions = [
      { label: 'Name 2', value: 'Name 2' },
      { label: 'Name 3', value: 'Name 3' },
    ];

    expect(component({ data, filter })
      .find(Select)
      .first()
      .prop('value')).to.deep.equal(expectedOptions);
  });

  it('renders no values in the `Select` component when the filter value is not an array', () => {
    expect(component({ data: [], filter: { path: ['name'], value: 1 } })
      .find(Select)
      .first()
      .prop('value')).to.deep.equal([]);
  });

  it(`renders no values in the 'Select' component
      when the filter value is an empty array`, () => {
    expect(component({ data: [], filter: { path: ['name'], value: [] } })
      .find(Select)
      .first()
      .prop('value')).to.deep.equal([]);
  });

  it(`renders the 'Select' component
      with the 'onChange' prop passed from above`, () => {
    const filter = { path: ['name'], value: [] };
    const data = [];
    const onChange = () => {};

    expect(component({ data, filter, onChange })
      .find(Select)
      .first()
      .prop('onChange')).to.equal(onChange);
  });

  it('renders the translation for the filter', () => {
    expect(component({
      data: [],
      filter: { path: ['preferences', '0', 'food'], value: 1 },
    })
      .find('.table-filter-label')
      .first()
      .find(T)
      .first()
      .prop('id')).to.equal('TableFilters.filterLabels.preferences.0.food');
  });
});
