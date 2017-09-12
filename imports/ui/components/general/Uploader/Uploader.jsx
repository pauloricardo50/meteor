import React from 'react';
import PropTypes from 'prop-types';

import Title from './Title';
import File from './File';
import FileAdder from './FileAdder';

const Uploader = (props) => {
  const { file, doc } = props;
  const { id } = file;

  // All files are always stored at the root of an object in 'files'
  const currentValue = doc.files[id];

  return (
    <div className="uploader">
      <Title {...file} currentValue={currentValue} />
      {currentValue && currentValue.map(f => <File key={f.key} {...f} />)}
      <FileAdder />
    </div>
  );
};

Uploader.propTypes = {
  file: PropTypes.objectOf(PropTypes.any).isRequired,
  doc: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default Uploader;
