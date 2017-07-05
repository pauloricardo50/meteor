import React from 'react';
import { expect } from 'chai';
import { describe, it } from 'meteor/practicalmeteor:mocha';
import { shallow } from 'enzyme';

import CompareTable, {
  sortFunc,
  filterFunc,
  getProperties,
} from '../CompareTable.jsx';
import CompareHeader from '../CompareHeader.jsx';
import CompareTableContent from '../CompareTableContent.jsx';

describe('<CompareTable />', () => {
  it('renders', () => {
    const wrapper = shallow(<CompareTable properties={[]} />);

    expect(wrapper.exists()).to.be.true;
  });

  it('always renders a CompareHeader and CompareTableContent', () => {
    const wrapper = shallow(<CompareTable properties={[]} />);

    expect(wrapper.find(CompareHeader).exists()).to.be.true;
    expect(wrapper.find(CompareTableContent).exists()).to.be.true;
  });

  it('keeps the name field at the top, even with custom fields', () => {
    const wrapper = shallow(
      <CompareTable
        properties={[]}
        customFields={[{ custom: true, name: 'test', id: 'custom1' }]}
      />,
    );
    const childWrapper = wrapper.find(CompareHeader).dive();

    expect(childWrapper.instance().props.fields[0].id).to.equal('name');
  });

  describe('handleSort', () => {
    it('sorts in ascending order on first call', (done) => {
      const wrapper = shallow(<CompareTable properties={[{}, {}]} />);

      expect(wrapper.state().sorting).to.deep.equal([]);

      wrapper.instance().handleSort('test', () => {
        expect(wrapper.state().sorting).to.deep.equal([
          { id: 'test', ascending: true },
        ]);
        done();
      });
    });

    it('sorts in descending order on second call', (done) => {
      const wrapper = shallow(<CompareTable properties={[{}, {}]} />);

      wrapper.setState(
        {
          sorting: [{ id: 'test', ascending: true }],
        },
        () => {
          wrapper.instance().handleSort('test', () => {
            expect(wrapper.state().sorting).to.deep.equal([
              { id: 'test', ascending: false },
            ]);
            done();
          });
        },
      );
    });

    it('removes sorting on third call', (done) => {
      const wrapper = shallow(<CompareTable properties={[{}, {}]} />);

      wrapper.setState(
        {
          sorting: [{ id: 'test', ascending: false }],
        },
        () => {
          wrapper.instance().handleSort('test', () => {
            expect(wrapper.state().sorting).to.deep.equal([]);
            done();
          });
        },
      );
    });
  });

  describe('handleFilter', () => {
    it('filters to show true on first call', (done) => {
      const wrapper = shallow(<CompareTable properties={[{}, {}]} />);

      expect(wrapper.state().filtering).to.deep.equal([]);

      wrapper.instance().handleFilter('test', () => {
        expect(wrapper.state().filtering).to.deep.equal([
          { id: 'test', show: true },
        ]);
        done();
      });
    });

    it('sorts in descending order on second call', (done) => {
      const wrapper = shallow(<CompareTable properties={[{}, {}]} />);

      wrapper.setState(
        {
          filtering: [{ id: 'test', show: true }],
        },
        () => {
          wrapper.instance().handleFilter('test', () => {
            expect(wrapper.state().filtering).to.deep.equal([
              { id: 'test', show: false },
            ]);
            done();
          });
        },
      );
    });

    it('removes filtering on third call', (done) => {
      const wrapper = shallow(<CompareTable properties={[{}, {}]} />);

      wrapper.setState(
        {
          filtering: [{ id: 'test', show: false }],
        },
        () => {
          wrapper.instance().handleFilter('test', () => {
            expect(wrapper.state().filtering).to.deep.equal([]);
            done();
          });
        },
      );
    });
  });

  describe('functions', () => {
    const properties = [
      { id: 0, createdAt: new Date(1000), test: true, value: 100 },
      { id: 1, createdAt: new Date(100), test: false, value: 200 },
      { id: 2, createdAt: new Date(10), test: true, value: 300 },
      { id: 3, createdAt: new Date(10), test: true, value: 0 },
    ];
    const getIds = arr => arr.map(val => val.id);

    it('filters by boolean true', () => {
      const propz = filterFunc(properties, [{ id: 'test', show: true }]);

      expect(getIds(propz)).to.deep.equal([0, 2, 3]);
    });

    it('filters by boolean false', () => {
      const propz = filterFunc(properties, [{ id: 'test', show: false }]);

      expect(getIds(propz)).to.deep.equal([1]);
    });

    it('sorts in ascending order', () => {
      const propz = sortFunc(properties, [{ id: 'value', ascending: true }]);

      expect(getIds(propz)).to.deep.equal([3, 0, 1, 2]);
    });

    it('sorts in descending order', () => {
      const propz = sortFunc(properties, [{ id: 'value', ascending: false }]);

      expect(getIds(propz)).to.deep.equal([2, 1, 0, 3]);
    });

    it('sorts by multiple values', () => {
      const propz = sortFunc(properties, [
        { id: 'createdAt', ascending: true },
        { id: 'value', ascending: false },
      ]);

      expect(getIds(propz)).to.deep.equal([2, 3, 1, 0]);
    });

    it('does both', () => {
      const propz = getProperties(
        properties,
        [{ id: 'test', show: true }],
        [{ id: 'value', ascending: true }],
      );

      expect(getIds(propz)).to.deep.equal([3, 0, 2]);
    });
  });
});
