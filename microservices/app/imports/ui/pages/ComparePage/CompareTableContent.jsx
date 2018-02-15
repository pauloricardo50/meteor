import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Motion, spring, presets } from 'react-motion';

import { T } from 'core/components/Translation';
import CompareColumn from './CompareColumn';
import ColumnTransition from './ColumnTransition';

// When combining TransitionMotion and Motion, weird stuff happens
// TransitionMotion keeps the elements in memory, even if they aren't there
// anymore, so the index will be false until the transitionMotion willLeave
// animation is over.
// Therefore the real index needs to be found through this function
const getIndexForName = (properties, name) =>
  Math.max(properties.findIndex(property => property.name === name), 0);

const CompareTableContent = ({
  properties,
  fields,
  hovered,
  onHoverEnter,
  onHoverLeave,
  deleteProperty,
}) => {
  if (properties.length === 0) {
    return (
      <h2 className="secondary">
        <T id="CompareTableContent.empty" />
      </h2>
    );
  }

  return (
    <div>
      <ul
        style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 0 }}
      >
        {properties.map(property => (
          <CompareColumn
            key={property._id}
            property={property}
            fields={fields}
            hovered={hovered}
            onHoverEnter={onHoverEnter}
            onHoverLeave={onHoverLeave}
            deleteProperty={deleteProperty}
          />
        ))}
      </ul>
    </div>
  );
};

CompareTableContent.propTypes = {
  properties: PropTypes.arrayOf(PropTypes.object).isRequired,
  fields: PropTypes.arrayOf(PropTypes.object).isRequired,
  onHoverEnter: PropTypes.func.isRequired,
  onHoverLeave: PropTypes.func.isRequired,
  hovered: PropTypes.string,
  deleteProperty: PropTypes.func.isRequired,
};

CompareTableContent.defaultProps = {
  hovered: undefined,
};

export default CompareTableContent;
