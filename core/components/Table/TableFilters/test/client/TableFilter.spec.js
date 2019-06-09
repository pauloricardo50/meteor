/* eslint-env mocha */
import { expect } from 'chai';
import Select from 'react-select';
import { shallow } from 'enzyme';

import { getMountedComponent } from '../../../../../utils/testHelpers';
import T from '../../../../Translation';
import TableFilter from '../../TableFilter';
import messagesFR from '../../../../../lang/fr.json';
import { TASK_STATUS } from '../../../../../api/tasks/taskConstants';

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
      options: ['blue', 'green', 'black', 'yellow'],
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
      prop based on the input 'options' prop`, () => {
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
    const filter = { path: ['userInput'] };
    const data = [];
    const expectedOptions = [
      { label: 'true', value: true },
      { label: 'false', value: false },
      { label: 'null', value: null },
      { label: '24', value: 24 },
    ];

    expect(component({ data, filter, options: [true, false, null, 24] })
      .find(Select)
      .first()
      .prop('options')).to.deep.equal(expectedOptions);
  });

  it(`removes duplicate options with before passing them
      to the 'Select' component`, () => {
    const filter = { path: ['name'], value: true };
    const options = ['Name 1', 'Name 2', 'Name 1'];

    const expectedOptions = [
      { label: 'Name 1', value: 'Name 1' },
      { label: 'Name 2', value: 'Name 2' },
    ];

    expect(component({ filter, options })
      .find(Select)
      .first()
      .prop('options')).to.deep.equal(expectedOptions);
  });

  it(`keeps only an undefined option at the end when there are
      one or more undefined options passed to Select`, () => {
    const filter = { path: ['name'], value: true };
    const options = ['Name 1', undefined, undefined, 'Name 4'];

    const expectedOptions = [
      { label: 'Name 1', value: 'Name 1' },
      { label: 'Name 4', value: 'Name 4' },
    ];

    const renderedOptions = component({ filter, options })
      .find(Select)
      .first()
      .prop('options');

    expect(renderedOptions.length).to.equal(3);
    expect(renderedOptions[0]).to.deep.equal(expectedOptions[0]);
    expect(renderedOptions[1]).to.deep.equal(expectedOptions[1]);

    const undefinedValueTranslation = 'TableFilters.noneLabels.name';
    expect(renderedOptions[2].value).to.equal(undefinedValueTranslation);
  });

  it("adds a specific 'None' label when undefined 'options' are passed", () => {
    const data = [{ name: 'John' }];
    const filter = { path: ['name'], value: true };
    const optionValues = ['Name 1', 'Name 2', undefined];

    const optionsProp = component({ data, filter, options: optionValues })
      .find(Select)
      .first()
      .prop('options');

    const noneLabelWrapper = shallow(optionsProp[2].label);
    expect(noneLabelWrapper.prop('id')).to.equal('TableFilters.noneLabels.name');
  });

  it('fills `Select` input with the default filter values', () => {
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

  it(`does not fill the 'Select' input with any values when the
      default filters are non-array`, () => {
    expect(component({ data: [], filter: { path: ['name'], value: true } })
      .find(Select)
      .first()
      .prop('value')).to.deep.equal([]);
  });

  it(`does not fill the 'Select' input with any values
      when the default filters are an empty array`, () => {
    expect(component({ data: [], filter: { path: ['name'], value: [] } })
      .find(Select)
      .first()
      .prop('value')).to.deep.equal([]);
  });

  it('renders the translation for the filter label', () => {
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

  it(`renders the Select.Async component
      when passed 'options' of type Promise`, () => {
    const filter = { path: ['name'], value: 1 };
    const wrapper = component({ data: [], options: Promise.resolve(), filter });
    expect(wrapper.find(Select.Async).length).to.equal(1);
  });

  it(`passes 'loadOptions' prop to Select.Async
      when passed 'options' of type Promise`, () => {
    const filter = { path: ['name'], value: 1 };
    const selectAsyncComponent = component({
      data: [],
      options: Promise.resolve(),
      filter,
    }).find(Select.Async);
    expect(selectAsyncComponent.prop('loadOptions')).to.be.a('function');
  });

  it(`asynchronously loads the correct options
      when passed 'options' of type Promise`, (done) => {
    const props = {
      data: [{ name: 'John' }],
      options: Promise.resolve(['value1', 'value2']),
      filter: { path: ['name'], value: 1 },
    };

    const asyncSelectComponent = component(props).find(Select.Async);
    const loadOptionsProp = asyncSelectComponent.prop('loadOptions');

    loadOptionsProp().then((result) => {
      const expectedAsyncOptions = {
        options: [
          { label: 'value1', value: 'value1' },
          { label: 'value2', value: 'value2' },
        ],
        complete: true,
      };

      expect(result).to.deep.equal(expectedAsyncOptions);
      done();
    });
  });

  it(`translates each undefined option value to a specific translation
      based on the filter path`, () => {
    const filter = { path: ['prefs', 'language'], value: true };

    const renderedOptions = component({ filter, options: [undefined] })
      .find(Select)
      .first()
      .prop('options');

    expect(renderedOptions[0].value).to.equal('TableFilters.noneLabels.prefs.language');
  });

  // Not working during meteor tests
  it.skip('translates option values for a specific filter path when it was decided to do so', () => {
    // we chose to translate the 'status' path
    const filter = { path: ['status'], value: true };

    const renderedOptions = component({
      filter,
      options: [TASK_STATUS.COMPLETED],
    })
      .find(Select)
      .first()
      .prop('options');

    const translation = messagesFR[`TaskStatusSetter.${TASK_STATUS.COMPLETED}`];
    expect(renderedOptions[0].value).to.equal(translation);
  });

  it(`does not translate an option value
      when it was not decided to do so in the code`, () => {
    // we chose to translate the 'status' path
    const filter = { path: ['someField'], value: true };

    const renderedOptions = component({
      filter,
      options: ['a value'],
    })
      .find(Select)
      .first()
      .prop('options');

    expect(renderedOptions[0].value).to.equal('a value');
  });
});
