import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';

import React from 'react';
import PropTypes from 'prop-types';
import { withState } from 'recompose';

import T from 'core/components/Translation';
import IconButton from 'core/components/IconButton';
import { FILE_STATUS } from 'core/api/constants';

import Downloader from '../../Downloader';
import { ROLES } from '../../../api/constants';

const isAllowedToDelete = (disabled) => {
  const currentUser = Meteor.user();
  const userIsDev = Roles.userIsInRole(currentUser, ROLES.DEV);
  const userIsAdmin = Roles.userIsInRole(currentUser, ROLES.ADMIN);
  const userIsPro = Roles.userIsInRole(currentUser, ROLES.PRO);
  if (userIsDev || userIsAdmin || userIsPro) {
    return true;
  }

  return !disabled;
};

const File = ({
  file: { name, Key, status = FILE_STATUS.VALID, message },
  disabled,
  handleRemove,
  deleting,
  setDeleting,
}) => (
  <div className="flex-col">
    <div className="file">
      <h5 className="secondary bold">{name}</h5>
      <div className="flex center">
        <span className={`${status} bold`}>
          <T id={`File.status.${status}`} />
        </span>
        {isAllowedToDelete(disabled) && (
          <IconButton
            disabled={deleting}
            type={deleting ? 'loop-spin' : 'close'}
            tooltip={<T id="general.delete" />}
            onClick={(event) => {
              event.preventDefault();
              setDeleting(true);
              return handleRemove(Key).catch((error) => {
                // Only stop the loader if deleting fails
                // This component will be deleted anyways when the deletion worked
                setDeleting(false);
                throw error;
              });
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

export default withState('deleting', 'setDeleting', false)(File);
