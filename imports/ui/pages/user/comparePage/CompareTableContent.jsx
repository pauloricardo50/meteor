import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Motion, spring, presets } from 'react-motion';

import CompareColumn from './CompareColumn.jsx';
import ColumnTransition from './ColumnTransition.jsx';

// When combining TransitionMotion and Motion, weird stuff happens
// TransitionMotion keeps the elements in memory, even if they aren't there
// anymore, so the index will be false until the transitionMotion willLeave
// animation is over.
// Therefore the real index needs to be found through this function
const getIndexForName = (properties, name) =>
  Math.max(properties.findIndex(property => property.name === name), 0);

const CompareTableContent = (props) => {
  const { properties, fields, hovered } = props;
  return (
    <div>
      <ColumnTransition properties={properties}>
        {styles =>
          (<ul style={{ display: 'flex', position: 'relative' }}>
            {styles.map(({ key, style, data: { property } }, i) =>
              (<Motion
                defaultStyle={{ x: 0 }}
                style={{
                  // Don't use 'i' here, it will not represent the proper
                  // index of this element after elements are transitioning out
                  x: spring(getIndexForName(properties, property.name) * 256),
                }}
                key={key}
              >
                {motionStyles =>
                  (<CompareColumn
                    style={{
                      ...style,
                      left: motionStyles.x,
                      position: 'absolute',
                    }}
                    property={property}
                    fields={fields}
                    hovered={hovered}
                  />)}
              </Motion>),
            )}
          </ul>)}
      </ColumnTransition>
    </div>
  );
};

CompareTableContent.propTypes = {
  properties: PropTypes.arrayOf(PropTypes.object).isRequired,
  fields: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default CompareTableContent;
