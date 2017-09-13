import React from 'react';
import PropTypes from 'prop-types';

import { T } from '/imports/ui/components/general/Translation';
import IconButton from '/imports/ui/components/general/IconButton';

const File = ({ file, disabled, handleRemove }) => {
  const { name, key, status, error } = file;

  return (
    <div className="flex-col">
      <div className="file">
        <h5 className="secondary bold">{name}</h5>
        <div className="flex center">
          <span className={`${status} bold`}>
            <T id={`Files.status.${status}`} />
          </span>
          {!disabled && (
            <IconButton
              touch={false}
              type="close"
              tooltip={<T id="general.delete" />}
              onClick={() => handleRemove(key)}
            />
          )}
        </div>
      </div>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

File.propTypes = {
  file: PropTypes.objectOf(PropTypes.any).isRequired,
  disabled: PropTypes.bool.isRequired,
  handleRemove: PropTypes.func.isRequired,
};

File.defaultProps = {
  error: '',
};

export default File;
