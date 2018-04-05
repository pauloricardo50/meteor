import React from 'react';
import PropTypes from 'prop-types';

import IconButton from 'core/components/IconButton';

const Widget1SingleInputInput = ({ value, setValue }) => (
  <div className="widget1-input">
    <span className="currency">CHF</span>
    <input type="text" value={value} onChange={e => setValue(e.target.value)} />
    <IconButton type="close" onClick={() => setValue(0)} />
  </div>
);

Widget1SingleInputInput.propTypes = {};

export default Widget1SingleInputInput;
