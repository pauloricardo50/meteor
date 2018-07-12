/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'core/utils/testHelpers/enzyme';

import withTableFilters, {
  makeTableFiltersContainer,
} from '../../withTableFilters';
import TableFilters from '../../../components/Table/TableFilters';

import { getMountedComponent } from '../../../utils/testHelpers';

const WrappedComponent = () => null;

const mountedComponent = (props, generateFiltersFromProps) =>
  getMountedComponent({
    Component: makeTableFiltersContainer(generateFiltersFromProps)(WrappedComponent),
    props,
    withRouter: false,
  });

describe('withTableFilters', () => {
  beforeEach(() => {
    getMountedComponent.reset();
  });

  it('passes the tableFilters prop to the TableFilters component', () => {
    const tableFilters = {
      filters: { name: ['James'] },
      options: { name: ['James', 'John'] },
    };

    const Component = withTableFilters(() => null);
    const wrapper = shallow(<Component tableFilters={tableFilters} />);

    expect(wrapper
      .find(TableFilters)
      .first()
      .prop('filters')).to.deep.equal(tableFilters);
  });
});

describe('makeTableFiltersContainer', () => {
  let wrapper;
  let props;
  let filtersGeneratorFunction;

  beforeEach(() => {
    getMountedComponent.reset();

    props = {
      data: [{ name: 'John' }, { name: 'Alex' }],
      otherProps: 1,
    };

    filtersGeneratorFunction = ({ data }) => ({
      filters: { name: ['Alex'] },
      options: { name: data.map(({ name }) => name) },
    });

    wrapper = mountedComponent(props, filtersGeneratorFunction)
      .find(TableFilters)
      .first();
  });

  it('passes filters based on props to the TableFilters component', () => {
    const generatedFilters = filtersGeneratorFunction(props);
    expect(wrapper.prop('filters')).to.deep.equal(generatedFilters);
  });

  it('passes the correct data prop to the TableFilters component', () => {
    expect(wrapper.prop('data')).to.equal(props.data);
  });

  it('passes the correct children to the TableFilters component', () => {
    expect(wrapper.find(WrappedComponent).length).to.equal(1);
  });

  it('passes only the `data`, `filters` and `children` props to TableFilters component', () => {
    expect(Object.keys(wrapper.props())).to.deep.equal([
      'filters',
      'data',
      'children',
    ]);
  });

  it('passes the correct props to the wrapped component', () => {
    const propsWithFilteredData = { ...props, data: [{ name: 'Alex' }] };
    expect(wrapper.find(WrappedComponent).props()).to.deep.equal(propsWithFilteredData);
  });
});
