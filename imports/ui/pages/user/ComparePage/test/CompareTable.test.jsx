/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { Factory } from 'meteor/dburles:factory';
import { stubCollections } from '/imports/js/helpers/testHelpers';

import CompareTable, {
  sortFunc,
  filterFunc,
  getProperties,
} from '../CompareTable';
import CompareHeader from '../CompareHeader';
import CompareTableContent from '../CompareTableContent';

describe('<CompareTable />', () => {
  let properties;
  let wrapper;

  beforeEach(() => {
    stubCollections();
    properties = [Factory.create('property'), Factory.create('property')];
    wrapper = shallow(
      <CompareTable
        properties={properties}
        addCustomField={() => {}}
        fields={[]}
        deleteProperty={() => {}}
      />,
    );
  });

  afterEach(() => {
    stubCollections.restore();
  });

  it('renders', () => {
    expect(wrapper.exists()).to.equal(true);
  });

  it('always renders a CompareHeader and CompareTableContent', () => {
    expect(wrapper.find(CompareHeader).exists()).to.equal(true);
    expect(wrapper.find(CompareTableContent).exists()).to.equal(true);
  });

  describe('handleSort', () => {
    it('sorts in ascending order on first call', (done) => {
      expect(wrapper.state().sorting).to.deep.equal([]);

      wrapper.instance().handleSort('test', () => {
        expect(wrapper.state().sorting).to.deep.equal([
          { id: 'test', ascending: true },
        ]);
        done();
      });
    });

    it('sorts in descending order on second call', (done) => {
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
      expect(wrapper.state().filtering).to.deep.equal([]);

      wrapper.instance().handleFilter('test', () => {
        expect(wrapper.state().filtering).to.deep.equal([
          { id: 'test', show: true },
        ]);
        done();
      });
    });

    it('sorts in descending order on second call', (done) => {
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
