import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';

import T from 'core/components/Translation';
import IconButton from 'core/components/IconButton';
import { FILE_STATUS } from 'core/api/constants';

import Downloader from '../../Downloader';

const isAllowedToDelete = (disabled, status) => {
  const currentUser = Meteor.user();
  if (
    currentUser.roles.includes('dev')
    || currentUser.roles.includes('admin')
  ) {
    return true;
  }

  return !disabled && status !== FILE_STATUS.VALID;
};

const File = ({
  file: { name, Key, status = FILE_STATUS.VALID, message },
  disabled,
  handleRemove,
}) => (
  <div className="flex-col">
    <div className="file">
      <h5 className="secondary bold">{name}</h5>
      <div className="flex center">
        <span className={`${status} bold`}>
          <T id={`File.status.${status}`} />
        </span>
        {isAllowedToDelete(disabled, status) && (
          <IconButton
            type="close"
            tooltip={<T id="general.delete" />}
            onClick={(event) => {
              event.preventDefault();
              handleRemove(Key);
            }}
          />
        )}
        <Downloader fileKey={Key} fileName={name} />
      </div>
    </div>
    {message
      && status === FILE_STATUS.ERROR && <p className="error">{message}</p>}
  </div>
);

File.propTypes = {
  disabled: PropTypes.bool.isRequired,
  file: PropTypes.objectOf(PropTypes.any).isRequired,
  handleRemove: PropTypes.func.isRequired,
};

File.defaultProps = {
  message: '',
};

export default File;
