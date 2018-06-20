/* eslint-env mocha */
import { expect } from 'chai';

import withTableFilters from '../withTableFilters';
import TableFilters from '../../components/Table/TableFilters';

import { getMountedComponent } from '../../utils/testHelpers';

const WrappedComponent = () => null;

const mountedComponent = props =>
  getMountedComponent({
    Component: withTableFilters(WrappedComponent),
    props,
    withRouter: false,
  });

describe('withTableFilters', () => {
  beforeEach(() => {
    getMountedComponent.reset();
  });

  it('should wrap the given component with the TableFilters component', () => {
    const props = {
      tableFilters: { name: ['Alex'] },
      data: [{ name: 'John' }, { name: 'Alex' }],
      otherProps: 1,
    };

    expect(mountedComponent(props)
      .find(TableFilters)
      .first()
      .find(WrappedComponent).length).to.equal(1);
  });

  it(`passes the 'tableFilters' as 'filters' and the 'data' props
      to the TableFilters component`, () => {
    const props = {
      tableFilters: { name: ['Alex'] },
      data: [{ name: 'John' }, { name: 'Alex' }],
      otherProps: 1,
    };

    const wrapperProps = mountedComponent(props)
      .find(TableFilters)
      .first()
      .props();

    expect(Object.keys(wrapperProps)).to.deep.equal([
      'filters',
      'data',
      'children',
    ]);
    expect(wrapperProps.filters).to.equal(props.tableFilters);
    expect(wrapperProps.data).to.equal(props.data);
  });

  it('should wrap the given component with the correct props', () => {
    const props = {
      tableFilters: { name: ['Alex'] },
      data: [{ name: 'John' }, { name: 'Alex' }],
      otherProps: 1,
    };

    const propsWithFilteredData = { ...props, data: [{ name: 'Alex' }] };

    const wrapper = mountedComponent(props);
    expect(wrapper.find(WrappedComponent).length).to.equal(1);
    expect(wrapper
      .find(WrappedComponent)
      .first()
      .props()).to.deep.equal(propsWithFilteredData);
  });
});
