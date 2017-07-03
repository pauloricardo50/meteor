import React, { Component } from 'react';
import PropTypes from 'prop-types';

import CompareColumn from './CompareColumn.jsx';

export default class CompareTableContent extends Component {
  render() {
    const { properties, fields } = this.props;
    return (
      <div style={{ display: 'flex' }}>
        {properties.map(property =>
          (<CompareColumn
            property={property}
            key={property.name}
            fields={fields}
          />),
        )}
      </div>
    );
  }
}

CompareTableContent.propTypes = {
  properties: PropTypes.arrayOf(PropTypes.object).isRequired,
  fields: PropTypes.arrayOf(PropTypes.object).isRequired,
};
