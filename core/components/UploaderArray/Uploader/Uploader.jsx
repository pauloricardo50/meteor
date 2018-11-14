import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';

import UploaderContainer from './UploaderContainer';
import FileDropper from './FileDropper.jsx';
import UploaderTop from './UploaderTop.jsx';
import UploaderBottom from './UploaderBottom.jsx';
import Checkbox from '../../Checkbox/Checkbox';
import { setAdditionalDoc } from '../../../api';
import { DOCUMENTS } from '../../../api/constants';

const Uploader = (props) => {
  const {
    handleAddFiles,
    displayFull,
    showFull,
    collection,
    docId,
    fileMeta: { id, requiredByAdmin },
    isDocumentToHide,
    allowRequireByAdmin = true,
  } = props;
  console.log('props', props);

  return (
    <div className="uploader-admin">
      {Meteor.microservice === 'admin'
        && allowRequireByAdmin && (
        <Checkbox
          value={requiredByAdmin !== false && !isDocumentToHide}
          onChange={(event) => {
            setAdditionalDoc.run({
              collection,
              id: docId,
              additionalDocId: id,
              requiredByAdmin: event.target.checked,
            });
          }}
          id={id}
          className={id === DOCUMENTS.OTHER && 'visibility-hidden'}
        />
      )}
      <FileDropper handleAddFiles={handleAddFiles} showFull={showFull} id={id}>
        <UploaderTop {...props} />
        {displayFull && <UploaderBottom {...props} />}
      </FileDropper>
    </div>
  );
};

Uploader.propTypes = {
  displayFull: PropTypes.bool.isRequired,
  handleAddFiles: PropTypes.func.isRequired,
  showFull: PropTypes.func.isRequired,
};

export default UploaderContainer(Uploader);
