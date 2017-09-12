import React from 'react';
import PropTypes from 'prop-types';

import { T } from '/imports/ui/components/general/Translation.jsx';

const styles = {
  input: {
    width: 0.1,
    height: 0.1,
    opacity: 0,
    overflow: 'hidden',
    position: 'absolute',
    zIndex: -1,
  },
  label: {
    cursor: 'pointer',
  },
};

const FileAdder = ({ id, handleDrop }) => (
  <a>
    {/* Hide the input, and make the label interactive */}
    <input
      type="file"
      id={id}
      style={styles.input}
      multiple
      onChange={handleDrop}
    />
    <label htmlFor={id} style={styles.label}>
      <T id="FileAdder.title" />
    </label>
  </a>
);

FileAdder.propTypes = {
  handleDrop: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
};

export default FileAdder;
