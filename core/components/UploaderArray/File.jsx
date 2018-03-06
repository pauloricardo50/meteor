import React from 'react';
import PropTypes from 'prop-types';

import { T } from 'core/components/Translation';
import IconButton from 'core/components/IconButton';
import { FILE_STATUS } from 'core/api/constants';

import Download from './Download';

const File = ({ file, disabled, handleRemove }) => {
  const { initialName, key, status, error } = file;

  return (
    <div className="flex-col">
      <div className="file">
        <h5 className="secondary bold">{initialName}</h5>
        <div className="flex center">
          <span className={`${status} bold`}>
            <T id={`File.status.${status}`} />
          </span>
          {!!(!disabled && status !== FILE_STATUS.VALID) && (
            <IconButton
              type="close"
              tooltip={<T id="general.delete" />}
              onClick={() => handleRemove(key)}
            />
          )}
          <Download fileKey={key} fileName={initialName} />
        </div>
      </div>
      {error &&
        status === FILE_STATUS.ERROR && <p className="error">{error}</p>}
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
