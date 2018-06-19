/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';

import { shallow } from '../../../../../utils/testHelpers/enzyme';
import { getMountedComponent } from '../../../../../utils/testHelpers';
import TableFiltersWithState, { TableFilters } from '../../TableFilters';
import TableFilter from '../../TableFilter';
import { flattenObjectTreeToArrays } from '../../../../../utils/general';

let defaultProps;

const component = props =>
  shallow(<TableFilters {...props}>
    {filteredData =>
      filteredData.map(({ name }) => (
        <div className="person" key={name}>
          {name}
        </div>
      ))
    }
          </TableFilters>);

const mountedComponent = props =>
  getMountedComponent({
    Component: TableFiltersWithState,
    props,
    withRouter: false,
  });

describe('TableFilters', () => {
  beforeEach(() => {
    getMountedComponent.reset();

    defaultProps = {
      data: [
        { name: 'John', city: 'London', eyesColor: 'blue', age: 24 },
        { name: 'Alex', city: 'London', eyesColor: 'green', age: 20 },
        { name: 'Rebecca', city: 'Portland', eyesColor: 'black', age: 24 },
      ],
      filters: { eyesColor: ['black'], age: [24, 20] },
      children: filteredData =>
        filteredData.map(({ name }) => (
          <div className="person" key={name}>
            {name}
          </div>
        )),
      handleOnChange: () => {},
    };
  });

  it('renders a `TableFilter` component for each filter', () => {
    expect(component(defaultProps).find(TableFilter).length).to.equal(2);
  });

  it('passes the `data` prop to all `TableFilter` components', () => {
    const { data } = defaultProps;
    component(defaultProps)
      .find(TableFilter)
      .forEach(tableFilter =>
        expect(tableFilter.prop('data')).to.deep.equal(data));
  });

  it('passes the correct `filter` prop each `TableFilter` component', () => {
    const flattenedFilters = flattenObjectTreeToArrays(defaultProps.filters);

    const componentFilters = component(defaultProps)
      .find(TableFilter)
      .map(tableFilter => tableFilter.prop('filter'));

    expect(componentFilters).to.deep.equal(flattenedFilters);
  });

  it('passes the correct `onChange` prop to each `TableFilter` component', () => {
    const obj = { handleOnChange: () => {} };
    sinon.stub(obj, 'handleOnChange');

    const flattenedFilters = flattenObjectTreeToArrays(defaultProps.filters);
    const wrapper = component({
      ...defaultProps,
      handleOnChange: obj.handleOnChange,
    });

    wrapper.find(TableFilter).forEach((tableFilter, index) => {
      const selectedOptions = [{ label: 'Name', value: 'name' }];
      const onChangeProp = tableFilter.prop('onChange');

      onChangeProp(selectedOptions);

      expect(obj.handleOnChange.getCall(index).args).to.deep.equal([
        flattenedFilters[index].path,
        selectedOptions,
      ]);
    });

    obj.handleOnChange.restore();
  });

  it('renders only the filtered children', () => {
    expect(component(defaultProps).find('.person').length).to.equal(1);
  });

  it('returns null when no filters are passed', () => {
    expect(component({}).getElement()).to.equal(null);
  });

  it('renders new filtered children after filters state changes', () => {
    const  { data, children } = defaultProps;
    const initialProps = {data, children, filters: { city: ['London'], age: [24] } };
    const filterComponent = mountedComponent(initialProps);

    expect(filterComponent.find('.person').map(item => item.text())).to.deep.equal(['John']);

    const handleChangeAgeFilter = filterComponent
      .find(TableFilter)
      .at(1)
      .prop('onChange');

    const newFilterOptions = [
      { label: 24, value: 24 },
      { label: 20, value: 20 },
    ];
    handleChangeAgeFilter(newFilterOptions);

    expect(filterComponent
      .update()
      .find('.person')
      .map(item => item.text())).to.deep.equal(['John', 'Alex']);
  });
});
