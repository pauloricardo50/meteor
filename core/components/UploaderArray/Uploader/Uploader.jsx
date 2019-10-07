import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Checkbox from '../../Checkbox';
import { setAdditionalDoc } from '../../../api';
import { DOCUMENTS } from '../../../api/constants';
import BaseUploader from './BaseUploader';
import UploaderContainer from './UploaderContainer';

export const Uploader = ({
  isDocumentToHide,
  allowRequireByAdmin,
  ...rest
}) => {
  const {
    collection,
    docId,
    fileMeta: { id, requiredByAdmin, category },
  } = rest;

  return (
    <div className="uploader-admin">
      {Meteor.microservice === 'admin' && allowRequireByAdmin && (
        <Checkbox
          value={requiredByAdmin !== false && !isDocumentToHide}
          onChange={(event) => {
            setAdditionalDoc.run({
              collection,
              id: docId,
              additionalDocId: id,
              requiredByAdmin: event.target.checked,
              category,
            });
          }}
          id={id}
          className={cx({ 'visibility-hidden': id === DOCUMENTS.OTHER })}
        />
      )}
      <BaseUploader {...rest} />
    </div>
  );
};

Uploader.propTypes = {
  displayFull: PropTypes.bool.isRequired,
  handleAddFiles: PropTypes.func.isRequired,
  showFull: PropTypes.func.isRequired,
};

export default UploaderContainer(Uploader);
