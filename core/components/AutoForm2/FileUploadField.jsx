//      
import { Random } from 'meteor/random';

import React, { useState, useEffect } from 'react';
import { compose } from 'recompose';
import { connectField } from 'uniforms';
import { injectIntl } from 'react-intl';

import { SLINGSHOT_DIRECTIVE_NAME_TEMP, FILE_STATUS } from 'core/api/constants';
import { deleteTempFile } from 'core/api/methods';
import BaseUploader from '../UploaderArray/Uploader/BaseUploader';
import {
  displayFullState,
  tempFileState,
  willReceiveProps,
  withMergedSuccessfulFiles,
  addProps,
} from '../UploaderArray/Uploader/uploaderHelpers';

export default compose(
  connectField,
  Component => ({ onChange, value = [], name, ...rest }) => {
    const [id] = useState(Random.id());
    const [currentValue, setCurrentValue] = useState([]);

    // Always keep the uploader in sync with the form value,
    // sometimes value is changed to an empty array again
    useEffect(() => {
      if (currentValue.some(({ Key }) => !value.includes(Key))) {
        setCurrentValue(currentValue.filter(({ Key }) => value.includes(Key)));
      }
    }, [value, currentValue]);

    const handleUploadFailed = () => {};

    const handleSuccess = file => {
      onChange([...value, file.Key]);
      setCurrentValue([
        ...currentValue,
        { ...file, status: FILE_STATUS.VALID },
      ]);
    };

    const deleteFile = key =>
      deleteTempFile.run({ fileKey: key }).then(() => {
        onChange(value.filter(url => !url.endsWith(key)));
        setCurrentValue(currentValue.filter(({ Key }) => Key !== key));
      });

    return (
      <Component
        handleSuccess={handleSuccess}
        currentValue={currentValue}
        handleUploadFailed={handleUploadFailed}
        deleteFile={deleteFile}
        fileMeta={{ id: name }}
        uploadDirective={SLINGSHOT_DIRECTIVE_NAME_TEMP}
        displayFull
        showFull
        uploadDirectiveProps={{ id }}
        {...rest}
      />
    );
  },
  injectIntl,
  displayFullState,
  tempFileState,
  addProps,
  willReceiveProps,
  withMergedSuccessfulFiles,
)(BaseUploader);
