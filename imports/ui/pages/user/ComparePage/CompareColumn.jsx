import React, { Component } from 'react';
import PropTypes from 'prop-types';

import classnames from 'classnames';

import cleanMethod from '/imports/api/cleanMethods';

import CompareColumnFooter from './CompareColumnFooter';
import CompareColumnField from './CompareColumnField';
import CompareColumnEditingField from './CompareColumnEditingField';

export default class CompareColumn extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editing: false,
    };
  }

  startEditing = () => {
    const { property, fields } = this.props;
    const values = {};

    // Set state with all the current values
    fields.forEach((field) => {
      if (!field.noEdit) {
        if (field.custom) {
          values[field.id] = property.fields[field.id];
        } else {
          values[field.id] = property[field.id];
        }
      }
    });

    this.setState({
      editing: true,
      name: property.name,
      value: property.value,
      ...values,
    });
  };

  cancelEditing = () => {
    // Wipe state, careful if more state stuff is added in the future
    this.state = { editing: false };
  };

  stopEditing = () => {
    const { property } = this.props;
    const customFields = { ...this.state };
    delete customFields.editing;
    delete customFields.name;
    delete customFields.value;

    const readyForDB = {};
    Object.keys(customFields).forEach((key) => {
      readyForDB[`fields.${key}`] = customFields[key];
    });

    cleanMethod(
      'updateProperty',
      {
        name: this.state.name || property.name,
        value: this.state.value || property.value,
        ...readyForDB,
      },
      property._id,
    ).then(() =>
      // reset state
      this.setState({ editing: false }),
    );
  };

  handleChange = (key, value) => this.setState({ [key]: value });

  render() {
    const {
      property,
      style,
      fields,
      onHoverEnter,
      onHoverLeave,
      hovered,
      deleteProperty,
    } = this.props;
    const { editing } = this.state;

    return (
      <ul
        className={classnames({
          'mask1 compare-column default-column': true,
          [`${property.errorClass}-border`]: !property.isValid,
          'success-border': property.isValid,
        })}
        style={style}
      >
        {fields.map(field =>
          (<li
            key={field.id}
            className={classnames({
              'text-ellipsis': true,
              hovered: hovered === field.id,
            })}
            onMouseEnter={() => onHoverEnter(field.id)}
            onMouseLeave={onHoverLeave}
          >
            {editing && !field.noEdit
              ? <CompareColumnEditingField
                {...this.props}
                field={field}
                parentState={this.state}
                handleChange={this.handleChange}
              />
              : <CompareColumnField field={field} property={property} />}
          </li>),
        )}
        <CompareColumnFooter
          id={property._id}
          deleteProperty={deleteProperty}
          startEditing={this.startEditing}
          stopEditing={this.stopEditing}
          cancelEditing={this.cancelEditing}
          editing={editing}
        />
      </ul>
    );
  }
}

CompareColumn.propTypes = {
  property: PropTypes.objectOf(PropTypes.any).isRequired,
  fields: PropTypes.arrayOf(PropTypes.object).isRequired,
  style: PropTypes.objectOf(PropTypes.any),
  onHoverEnter: PropTypes.func.isRequired,
  onHoverLeave: PropTypes.func.isRequired,
  hovered: PropTypes.string,
  deleteProperty: PropTypes.func.isRequired,
};

CompareColumn.defaultProps = {
  style: {},
  hovered: undefined,
};
