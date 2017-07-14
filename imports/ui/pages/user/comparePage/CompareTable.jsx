import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Meteor } from 'meteor/meteor';

import orderBy from 'lodash/orderBy';

import FlatButton from 'material-ui/FlatButton';
import ArrowLeft from 'material-ui/svg-icons/hardware/keyboard-arrow-left';
import ArrowRight from 'material-ui/svg-icons/hardware/keyboard-arrow-right';

import { easeOut } from '/imports/js/helpers/browserFunctions';

import CompareHeader from './CompareHeader.jsx';
import CompareTableContent from './CompareTableContent.jsx';

export const sortFunc = (array, sorting) =>
  orderBy(
    array,
    sorting.map(item => item.id),
    sorting.map(item => (item.ascending ? 'asc' : 'desc')),
  );

export const filterFunc = (array, filtering) =>
  array.filter(item =>
    filtering.every(
      filterObject => item[filterObject.id] === filterObject.show,
    ),
  );

export const getProperties = (properties, filtering, sorting) =>
  sortFunc(filterFunc(properties, filtering), sorting);

export default class CompareTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sorting: [],
      filtering: [],
    };

    this.interval = undefined;
  }

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

  handleReset = () => {
    this.setState({
      sorting: [],
      filtering: [],
    });
  };

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
    const { properties, addCustomField, fields } = this.props;
    const { sorting, filtering } = this.state;

    const sortedProperties = getProperties(properties, filtering, sorting);

    return (
      <div className="flex-col center" style={{ width: '100%' }}>
        <div style={{ marginBottom: 8 }}>
          <FlatButton
            icon={<ArrowLeft />}
            onTouchTap={() => this.handleScroll(false)}
            primary
          />
          <FlatButton
            icon={<ArrowRight />}
            onTouchTap={() => this.handleScroll(true)}
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
          />

          <CompareTableContent
            properties={sortedProperties}
            fields={fields}
            onHoverEnter={this.onHoverEnter}
            onHoverLeave={this.onHoverLeave}
            hovered={this.state.hovered}
          />
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
};

CompareTable.defaultProps = {
  customFields: [],
};
