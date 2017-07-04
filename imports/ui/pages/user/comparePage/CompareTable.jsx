import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { _ } from 'lodash';
import { TransitionMotion, spring, presets } from 'react-motion';

import CompareHeader from './CompareHeader.jsx';
import CompareTableContent from './CompareTableContent.jsx';

const defaultFields = [
  { id: 'name', type: 'text' },
  { id: 'value', type: 'money' },
  { id: 'loan', type: 'money' },
  { id: 'ownFunds', type: 'money' },
  { id: 'monthly', type: 'money' },
  { id: 'createdAt', type: 'date' },
  { id: 'bool', type: 'boolean' },
];

export const sortFunc = (array, sorting) =>
  _.orderBy(
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
      fields: [...this.props.customFields, ...defaultFields],
      sorting: [],
      filtering: [],
    };
  }

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
    const { properties, addCustomField } = this.props;
    const { fields, sorting, filtering } = this.state;

    const sortedProperties = getProperties(properties, filtering, sorting);

    return (
      <div style={{ display: 'flex', overflowX: 'scroll' }}>
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
    );
  }
}

CompareTable.propTypes = {
  properties: PropTypes.arrayOf(PropTypes.object).isRequired,
  customFields: PropTypes.arrayOf(PropTypes.object),
  addCustomField: PropTypes.func.isRequired,
};

CompareTable.defaultProps = {
  customFields: [],
};
