import React from 'react';
import PropTypes from 'prop-types';
import Widget1SingleInputContainer from './Widget1SingleInputContainer';

const Widget1SingleInput = ({ value, auto, name, setValue }) => (
  <div className="widget1-single-input">
    {name}
    <input type="text" value={value} onChange={setValue} />
  </div>
);

Widget1SingleInput.propTypes = {
  value: PropTypes.number,
  auto: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
};

Widget1SingleInput.defaultProps = {
  value: undefined,
};

export default Widget1SingleInputContainer(Widget1SingleInput);
