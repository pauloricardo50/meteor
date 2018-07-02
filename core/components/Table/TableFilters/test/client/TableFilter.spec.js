/* eslint-env mocha */
import { expect } from 'chai';
import Select from 'react-select';
import { shallow } from 'enzyme';

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
      value: ['blue', 'green', 'black', 'yellow'],
      onChange: () => {},
    };
  });

  it('renders the `Select` component with a true `multi` prop', () => {
    expect(component(defaultProps)
      .find(Select)
      .first()
      .prop('multi')).to.equal(true);
  });

  it('renders the `Select` component with a false `simpleValue` prop', () => {
    expect(component(defaultProps)
      .find(Select)
      .first()
      .prop('simpleValue')).to.equal(false);
  });

  it(`renders the 'Select' component with the correct 'options'
      prop based on the passed value prop`, () => {
    const expectedOptions = [
      { label: 'blue', value: 'blue' },
      { label: 'green', value: 'green' },
      { label: 'black', value: 'black' },
      { label: 'yellow', value: 'yellow' },
    ];
    expect(component(defaultProps)
      .find(Select)
      .first()
      .prop('options')).to.deep.equal(expectedOptions);
  });

  it(`converts the option labels with no translation
      to strings before passing them to 'Select'`, () => {
    const filter = { path: ['userInput'], value: [true, false, 24] };
    const data = [];
    const expectedOptions = [
      { label: 'true', value: true },
      { label: 'false', value: false },
      { label: '24', value: 24 },
    ];

    expect(component({ data, filter })
      .find(Select)
      .first()
      .prop('value')).to.deep.equal(expectedOptions);
  });

  it(`removes duplicate options with before passing them
      to the 'Select' component`, () => {
    const filter = { path: ['name'], value: true };
    const optionValues = ['Name 1', 'Name 2', 'Name 1'];

    const expectedOptions = [
      { label: 'Name 1', value: 'Name 1' },
      { label: 'Name 2', value: 'Name 2' },
    ];

    expect(component({ filter, value: optionValues })
      .find(Select)
      .first()
      .prop('options')).to.deep.equal(expectedOptions);
  });

  it(`removes options which have undefined or null values
      before passing them to the 'Select' component`, () => {
    const filter = { path: ['name'], value: true };
    const optionValues = ['Name 1', null, undefined, 'Name 4'];

    const expectedOptions = [
      { label: 'Name 1', value: 'Name 1' },
      { label: 'Name 4', value: 'Name 4' },
    ];

    expect(component({ filter, value: optionValues })
      .find(Select)
      .first()
      .prop('options')).to.deep.equal(expectedOptions);
  });

  it("adds a 'None' label when there are undefined values in the data", () => {
    const data = [{ name: 'John' }, { name: undefined }];
    const filter = { path: ['name'], value: true };
    const optionValues = ['Name 1', 'Name 2'];

    const optionsProp = component({ data, filter, value: optionValues })
      .find(Select)
      .first()
      .prop('options');

    const noneLabelWrapper = shallow(optionsProp[2].label);

    expect(noneLabelWrapper.prop('id')).to.equal('TableFilters.none');
    expect(optionsProp[2].value).to.equal(undefined);
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
