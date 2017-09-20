import React from 'react';
import PropTypes from 'prop-types';

import { T } from '/imports/ui/components/general/Translation';

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
    paddingTop: 8,
  },
};

const FileAdder = ({ docId, id, handleAddFiles }) => (
  <a>
    {/* Hide the input, and make the label interactive */}
    <input
      type="file"
      id={id}
      style={styles.input}
      multiple
      onChange={handleAddFiles}
      // This piece of shit is important or inputs will get mixed up...
      key={docId + id}
    />
    <label htmlFor={id} style={styles.label}>
      <T id="FileAdder.title" />
    </label>
  </a>
);

FileAdder.propTypes = {
  handleAddFiles: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  docId: PropTypes.string.isRequired,
};

export default FileAdder;
