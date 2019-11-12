import { Random } from 'meteor/random';

import React, { useState } from 'react';
import PropTypes from 'prop-types';

import T from 'core/components/Translation';
import Button from 'core/components/Button';

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

const FileAdder = ({ handleAddFiles }) => {
  const [uniqueId] = useState(Random.id());

  return (
    <a>
      {/* Hide the input, and make the label interactive */}
      <input
        type="file"
        id={uniqueId}
        style={styles.input}
        multiple
        onChange={event => {
          handleAddFiles(Array.from(event.target.files));
          // Clear the input after upload to be able to upload the same file
          // twice: https://stackoverflow.com/questions/42192346/how-to-reset-reactjs-file-input
          event.target.value = null;
        }}
      />
      {/* Use label component, so that the htmlFor triggers the file input */}
      <Button htmlFor={uniqueId} style={styles.label} primary component="label">
        <T id="FileAdder.title" />
      </Button>
    </a>
  );
};

FileAdder.propTypes = {
  handleAddFiles: PropTypes.func.isRequired,
};

export default FileAdder;
