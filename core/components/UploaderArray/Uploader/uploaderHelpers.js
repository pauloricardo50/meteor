import { Meteor } from 'meteor/meteor';

import { withStateHandlers, withProps, lifecycle } from 'recompose';
import uniqBy from 'lodash/uniqBy';

import {
  FILE_STATUS,
  ALLOWED_FILE_TYPES,
  MAX_FILE_SIZE,
} from '../../../api/constants';
import ClientEventService, {
  MODIFIED_FILES_EVENT,
} from '../../../api/events/ClientEventService';

const checkFile = (file, currentValue = [], tempFiles = []) => {
  if (ALLOWED_FILE_TYPES.indexOf(file.type) < 0) {
    return 'fileType';
  }
  if (file.size > MAX_FILE_SIZE) {
    return 'fileSize';
  }
  if (
    currentValue.some(({ name }) => name === file.name) ||
    tempFiles.some(({ name }) => name === file.name)
  ) {
    return 'sameName';
  }
  return true;
};

const filesExistAndAreValid = files =>
  files &&
  files.length > 0 &&
  files.every(file => file.status === FILE_STATUS.VALID);

export const displayFullState = withStateHandlers(
  ({ currentValue }) => ({
    displayFull:
      Meteor.microservice === 'admin' || !filesExistAndAreValid(currentValue),
  }),
  {
    toggleDisplayFull: ({ displayFull }) => override => ({
      displayFull: override || !displayFull,
    }),
  },
);

export const tempFileState = withStateHandlers(
  { tempFiles: [], tempSuccessFiles: [] },
  {
    addTempSuccessFile: ({ tempSuccessFiles, tempFiles }) => file => ({
      tempSuccessFiles: [...tempSuccessFiles, file],
      tempFiles: tempFiles.filter(({ name }) => name !== file.name),
    }),
    addTempFiles: ({ tempFiles }) => (files = []) => ({
      tempFiles: [...tempFiles, ...files],
    }),
    setTempSuccessFiles: () => (files = []) => ({
      tempSuccessFiles: files,
    }),
  },
);

export const addProps = withProps(
  ({
    addTempFiles,
    currentValue = [],
    tempFiles,
    tempSuccessFiles,
    deleteFile,
    setTempSuccessFiles,
    handleSuccess,
    addTempSuccessFile,
    intl: { formatMessage: f },
  }) => ({
    handleAddFiles: files => {
      const fileArray = [];
      let showError = false;

      files.forEach(file => {
        const isValid = checkFile(
          file,
          [...currentValue, ...tempSuccessFiles],
          tempFiles,
        );
        if (isValid === true) {
          fileArray.push(file);
        } else {
          showError = isValid;
        }
      });

      if (showError) {
        import('../../../utils/notification').then(
          ({ default: notification }) => {
            notification.error({
              message: f({ id: `errors.${showError}.title` }),
              description: f({ id: `errors.${showError}.description` }),
            });
          },
        );
        return;
      }

      addTempFiles(files);
    },
    handleUploadComplete: (file, url) => {
      addTempSuccessFile(file);
      if (handleSuccess) {
        handleSuccess(file, url);
      }
    },
    handleRemove: key =>
      deleteFile(key).then(() => {
        // Filter temp files if this is not a real file from the DB
        setTempSuccessFiles(tempSuccessFiles.filter(({ Key }) => Key !== key));

        // Wait for a sec before pinging the DB again
        setTimeout(() => {
          ClientEventService.emit(MODIFIED_FILES_EVENT);
        }, 0);
      }),
  }),
);

export const propHasChanged = (oldProp, newProp) =>
  !!(
    (!oldProp && newProp) ||
    (oldProp && !newProp) ||
    (oldProp && newProp && oldProp.length !== newProp.length)
  );

export const willReceiveProps = lifecycle({
  componentWillReceiveProps({ currentValue: nextValue = [] }) {
    const {
      currentValue = [],
      tempSuccessFiles,
      setTempSuccessFiles,
    } = this.props;

    if (
      propHasChanged(currentValue, nextValue) &&
      tempSuccessFiles.length > 0
    ) {
      const nonDuplicateFiles = tempSuccessFiles.filter(
        ({ name }) => !nextValue.find(file => file.name === name),
      );
      setTempSuccessFiles(nonDuplicateFiles);
    }
  },
});

export const withMergedSuccessfulFiles = withProps(
  ({ currentValue = [], tempSuccessFiles }) => ({
    currentValue: uniqBy([...currentValue, ...tempSuccessFiles], 'name'),
  }),
);
