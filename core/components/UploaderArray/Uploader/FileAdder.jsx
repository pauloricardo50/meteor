import React from 'react';
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

const FileAdder = ({ docId, id, handleAddFiles }) => (
  <a>
    {/* Hide the input, and make the label interactive */}
    <input
      type="file"
      id={id}
      style={styles.input}
      multiple
      // Do Array.from to extract file from the FileList object
      onChange={(event) => {
        handleAddFiles(Array.from(event.target.files));
        // Clear the input after upload to be able to upload the same file
        // twice: https://stackoverflow.com/questions/42192346/how-to-reset-reactjs-file-input
        event.target.value = null;
      }}
      // value={null}
      // This piece of shit is important or inputs will get mixed up...
      key={docId + id}
    />
    {/* Use label component, so that the htmlFor triggers the file input */}
    <Button htmlFor={id} style={styles.label} primary component="label">
      <T id="FileAdder.title" />
    </Button>
  </a>
);

FileAdder.propTypes = {
  handleAddFiles: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  docId: PropTypes.string.isRequired,
};

export default FileAdder;
