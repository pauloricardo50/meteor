import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';

import UploaderContainer from './UploaderContainer';
import FileDropper from './FileDropper.jsx';
import UploaderTop from './UploaderTop.jsx';
import UploaderBottom from './UploaderBottom.jsx';
import Checkbox from '../../Checkbox/Checkbox';
import { setAdditionalDoc } from '../../../api';

const Uploader = (props) => {
  const {
    handleAddFiles,
    displayFull,
    showFull,
    collection,
    docId,
    fileMeta: { id },
  } = props;
  console.log('props', props);

  return (
    <>
      {Meteor.microservice === 'admin' && (
        <Checkbox
          checked={false}
          onChange={(event) => {
            console.log('event', event);
            setAdditionalDoc.run({
              collection,
              id: docId,
              additionalDocId: id,
              requiredByAdmin: event.target.checked,
            });
          }}
          id={id}
        />
      )}
      <FileDropper handleAddFiles={handleAddFiles} showFull={showFull} id={id}>
        <UploaderTop {...props} />
        {displayFull && <UploaderBottom {...props} />}
      </FileDropper>
    </>
  );
};

Uploader.propTypes = {
  displayFull: PropTypes.bool.isRequired,
  handleAddFiles: PropTypes.func.isRequired,
  showFull: PropTypes.func.isRequired,
};

export default UploaderContainer(Uploader);
