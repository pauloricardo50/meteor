/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';

import { shallow } from '../../../../../utils/testHelpers/enzyme';
import { getMountedComponent } from '../../../../../utils/testHelpers';
import TableFilters from '../../TableFilters';
import TableFilter from '../../TableFilter';
import { flattenObjectTreeToArrays } from '../../../../../utils/general';

let defaultProps;

const component = (props) => {
  const wrapper = shallow(<TableFilters {...props}>
    {filteredData =>
      filteredData.map(({ name }) => (
        <div className="person" key={name}>
          {name}
        </div>
      ))
    }
  </TableFilters>);

  return wrapper
    .dive()
    .dive()
    .dive();
};

const mountedComponent = props =>
  getMountedComponent({
    Component: TableFilters,
    props,
    withRouter: false,
  });

describe('TableFilters', () => {
  beforeEach(() => {
    getMountedComponent.reset();

    // don't change this as it could compromise the tests that are based on it
    defaultProps = {
      data: [
        { name: 'John', city: 'London', eyesColor: 'blue', age: 24 },
        { name: 'Alex', city: 'London', eyesColor: 'green', age: 20 },
        { name: 'Rebecca', city: 'Portland', eyesColor: 'black', age: 24 },
      ],

      filters: {
        filters: { eyesColor: ['black'], age: [24, 20] },
        options: { eyesColor: ['black', 'red', 'green'], age: [24, 25, 26] },
      },

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

  it('passes the `data` prop to each `TableFilter` component', () => {
    const { data } = defaultProps;
    component(defaultProps)
      .find(TableFilter)
      .forEach(tableFilter =>
        expect(tableFilter.prop('data')).to.deep.equal(data));
  });

  it('passes the correct `filter` prop each `TableFilter` component', () => {
    const {
      filters: { filters },
    } = defaultProps;
    const flattenedFilters = flattenObjectTreeToArrays(filters);

    const componentFilters = component(defaultProps)
      .find(TableFilter)
      .map(tableFilter => tableFilter.prop('filter'));

    expect(componentFilters).to.deep.equal(flattenedFilters);
  });

  it(`passes the correct 'value' prop to TableFilter
      based on the given options and filters`, () => {
    const data = [
      { firstName: 'James', lastName: 'Berg', info: { weight: 68, age: 20 } },
      {
        firstName: 'Sebastian',
        lastName: 'Bach',
        info: { weight: 90, age: 29 },
      },
    ];

    const filters = {
      filters: {
        firstName: true,
        lastName: true,
        info: { weight: [70], age: [24, 20] },
      },
      options: { age: [21, 15, 20, 29], firstName: ['James', 'Sebastian'] },
    };

    const props = { ...defaultProps, data, filters };
    const tableFilterComponents = component(props).find(TableFilter);

    const firstNameFilter = tableFilterComponents.at(0);
    expect(firstNameFilter.prop('value')).to.deep.equal([
      'James',
      'Sebastian',
    ]);

    const lastNameFilter = tableFilterComponents.at(1);
    expect(lastNameFilter.prop('value')).to.equal(undefined);

    const weightFilter = tableFilterComponents.at(2);
    expect(weightFilter.prop('value')).to.equal(undefined);

    const ageFilter = tableFilterComponents.at(3);
    expect(ageFilter.prop('value')).to.deep.equal([21, 15, 20, 29]);
  });

  it('renders only the filtered children', () => {
    expect(component(defaultProps).find('.person').length).to.equal(1);
  });

  it('renders all children when filters are undefined', () => {
    const props = { ...defaultProps, filters: { filters: undefined } };
    expect(component(props).find('.person').length).to.equal(props.data.length);
  });

  it('renders all children when filters are empty', () => {
    const props = { ...defaultProps, filters: { filters: {} } };
    expect(component(props).find('.person').length).to.equal(props.data.length);
  });

  it('does not render the filters UI when filters are undefined', () => {
    const props = { ...defaultProps, filters: { filters: undefined } };
    expect(component(props).find('.table-filters').length).to.equal(0);
  });

  it('does not render the filters UI when filters are empty', () => {
    const props = { ...defaultProps, filters: { filters: {} } };
    expect(component(props).find('.table-filters').length).to.equal(0);
  });

  it('renders the new filtered children after filters state changes', () => {
    const { data, children } = defaultProps;
    const initialProps = {
      data,
      children,
      filters: { filters: { city: ['London'], age: [24] } },
    };
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

  it("renders the new filters children when filters' props change", () => {
    const filtersComponent = component(defaultProps);
    expect(filtersComponent.find('.person').length).to.equal(1);

    expect(filtersComponent
      .setProps({
        filters: { filters: { city: ['London'] } },
      })
      .find('.person').length).to.equal(2);
  });

  it("updates the filters UI when filters' props change", () => {
    const filtersComponent = component(defaultProps);
    expect(filtersComponent.find(TableFilter).length).to.equal(2);

    expect(filtersComponent
      .setProps({
        filters: { filters: { city: ['London'] } },
      })
      .find(TableFilter).length).to.equal(1);
  });

  it("updates the filtered data when data' props change", () => {
    const props = {
      ...defaultProps,
      filters: { filters: { city: ['London'] } },
    };
    const filtersComponent = component(props);
    expect(filtersComponent.find('.person').map(node => node.text())).to.deep.equal(['John', 'Alex']);

    expect(filtersComponent
      .setProps({
        data: [...props.data, { name: 'James', city: 'London' }],
      })
      .find('.person')
      .map(node => node.text())).to.deep.equal(['John', 'Alex', 'James']);
  });
});
