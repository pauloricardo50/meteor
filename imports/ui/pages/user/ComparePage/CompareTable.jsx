import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Meteor } from 'meteor/meteor';

import orderBy from 'lodash/orderBy';
import debounce from 'lodash/debounce';

import Button from '/imports/ui/components/general/Button';
import Icon from '/imports/ui/components/general/Icon';

import { easeOut } from '/imports/js/helpers/browserFunctions';
import { T } from '/imports/ui/components/general/Translation';
import CompareHeader from './CompareHeader';
import CompareTableContent from './CompareTableContent';

export const sortFunc = (properties, sorting) =>
  orderBy(
    properties,
    sorting.map(item => item.id),
    sorting.map(item => (item.ascending ? 'asc' : 'desc')),
  );

export const filterFunc = (properties, filtering) =>
  properties.filter(item =>
    filtering.every(
      filterObject => item[filterObject.id] === filterObject.show,
    ),
  );

// Spread the custom property fields inside the object so that they are sorted and filtered properly
export const getProperties = (properties, filtering, sorting) =>
  sortFunc(
    filterFunc(
      properties.map(property => ({ ...property, ...property.fields })),
      filtering,
    ),
    sorting,
  );

export default class CompareTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sorting: [],
      filtering: [],
      scrollLeft: 0,
      hovered: undefined,
    };

    this.interval = undefined;
  }

  componentDidMount() {
    // The third parameter is important, so that it listens to the nested
    // scroll event as well
    window.addEventListener('scroll', this.setScroll, true);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.setScroll);
  }

  setScroll = debounce(
    () => !!this.ref && this.setState({ scrollLeft: this.ref.scrollLeft }),
    50,
  );

  handleScroll = (toLeft) => {
    Meteor.clearInterval(this.interval);

    if (this.ref) {
      const pos = this.ref.scrollLeft;
      const maxScroll = this.ref.scrollWidth - this.ref.clientWidth;
      let prevScroll;
      let nextScroll;
      let i = 0;
      const curve = easeOut(pos, toLeft ? pos + 256 : pos - 256, 15);

      const frame = () => {
        if (!this.ref) {
          return;
        }
        // 256 = column width + 16px margin
        if (
          Math.abs(pos - this.ref.scrollLeft) > 256 ||
          (prevScroll > 0 && nextScroll === 0) ||
          (prevScroll < maxScroll && nextScroll === maxScroll) ||
          (!toLeft && this.ref.scrollLeft === 0) ||
          (toLeft && this.ref.scrollLeft === maxScroll)
        ) {
          Meteor.clearInterval(this.interval);
        } else if (i < curve.length) {
          this.ref.scrollLeft = curve[i];
          prevScroll = nextScroll;
          nextScroll = this.ref.scrollLeft;
        } else {
          Meteor.clearInterval(this.interval);
        }
        i += 1;
      };

      this.interval = Meteor.setInterval(frame, 15);
    }
  };

  handleReset = () => this.setState({ sorting: [], filtering: [] });

  handleSort = (id, callback) => {
    const sorter = this.state.sorting.find(item => item.id === id);
    let nextState = () => {};

    if (sorter && sorter.ascending === true) {
      // change sort to descending order
      nextState = prev => ({
        sorting: [
          ...prev.sorting.filter(f => f.id !== id),
          { id, ascending: false },
        ],
      });
    } else if (sorter && sorter.ascending === false) {
      // remove sorting
      nextState = prev => ({
        sorting: prev.sorting.filter(f => f.id !== id),
      });
    } else {
      // new sort in ascending order
      nextState = prev => ({
        sorting: [...prev.sorting, { id, ascending: true }],
      });
    }

    this.setState(nextState, callback);
  };

  handleFilter = (id, callback) => {
    const filterer = this.state.filtering.find(item => item.id === id);
    let nextState = () => {};

    if (filterer && filterer.show === true) {
      // change filter to show those that are false
      nextState = prev => ({
        filtering: [
          ...prev.filtering.filter(f => f.id !== id),
          { id, show: false },
        ],
      });
    } else if (filterer && filterer.show === false) {
      // remove filtering
      nextState = prev => ({
        filtering: prev.filtering.filter(f => f.id !== id),
      });
    } else {
      // show only those which are true
      nextState = prev => ({
        filtering: [...prev.filtering, { id, show: true }],
      });
    }

    this.setState(nextState, callback);
  };

  onHoverEnter = fieldId => this.setState({ hovered: fieldId });

  onHoverLeave = () => this.setState({ hovered: undefined });

  render() {
    const { properties, addCustomField, fields, deleteProperty } = this.props;
    const { sorting, filtering, scrollLeft } = this.state;

    const sortedProperties = getProperties(properties, filtering, sorting);

    return (
      <div className="flex-col center" style={{ width: '100%' }}>
        <div style={{ marginBottom: 8 }}>
          <Button
            dense
            icon={<Icon type="left" />}
            onClick={() => this.handleScroll(false)}
            primary
          />
          <Button
            dense
            icon={<Icon type="right" />}
            onClick={() => this.handleScroll(true)}
            primary
          />
        </div>
        <div
          className="compare-table"
          ref={(c) => {
            this.ref = c;
          }}
        >
          <CompareHeader
            fields={fields}
            sorting={sorting}
            filtering={filtering}
            handleSort={this.handleSort}
            handleFilter={this.handleFilter}
            handleReset={this.handleReset}
            addCustomField={addCustomField}
            onHoverEnter={this.onHoverEnter}
            onHoverLeave={this.onHoverLeave}
            hovered={this.state.hovered}
            scrollLeft={scrollLeft}
            noProperties={sortedProperties.length === 0}
          />

          {/* Empty div to position things properly */}
          <div className="empty-compare-header" />

          {properties.length ? (
            <CompareTableContent
              properties={sortedProperties}
              fields={fields}
              onHoverEnter={this.onHoverEnter}
              onHoverLeave={this.onHoverLeave}
              hovered={this.state.hovered}
              deleteProperty={deleteProperty}
            />
          ) : (
            <h2 className="flex center">
              <T id="CompareTable.empty" />
            </h2>
          )}
        </div>
      </div>
    );
  }
}

CompareTable.propTypes = {
  properties: PropTypes.arrayOf(PropTypes.object).isRequired,
  customFields: PropTypes.arrayOf(PropTypes.object),
  addCustomField: PropTypes.func.isRequired,
  fields: PropTypes.arrayOf(PropTypes.object).isRequired,
  deleteProperty: PropTypes.func.isRequired,
};

CompareTable.defaultProps = {
  customFields: [],
};
