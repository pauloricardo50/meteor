import React from 'react';
import PropTypes from 'prop-types';

import Uploader from './Uploader';

const UploaderArray = props =>
  (<div className="flex-col center">
    {props.fileArray.map(
      file =>
        file.condition !== false &&
        <Uploader {...props} file={file} key={file.id} />,
    )}
  </div>);

UploaderArray.propTypes = {
  fileArray: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default UploaderArray;
