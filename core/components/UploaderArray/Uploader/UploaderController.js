import { Meteor } from 'meteor/meteor';

import { compose, withStateHandlers, withProps, lifecycle } from 'recompose';
import { injectIntl } from 'react-intl';
import uniqBy from 'lodash/uniqBy';

import {
  FILE_STATUS,
  ALLOWED_FILE_TYPES,
  MAX_FILE_SIZE,
} from '../../../api/constants';
import ClientEventService, {
  MODIFIED_FILES_EVENT,
} from '../../../api/events/ClientEventService';
import { notifyOfUpload } from '../../../api/slack/methodDefinitions';
import withMatchParam from '../../../containers/withMatchParam';

const checkFile = (file, currentValue = [], tempFiles = []) => {
  if (ALLOWED_FILE_TYPES.indexOf(file.type) < 0) {
    return 'fileType';
  }
  if (file.size > MAX_FILE_SIZE) {
    return 'fileSize';
  }
  if (
    currentValue.some(({ name }) => name === file.name)
    || tempFiles.some(({ name }) => name === file.name)
  ) {
    return 'sameName';
  }
  return true;
};

const filesExistAndAreValid = files =>
  files
  && files.length > 0
  && files.every(file => file.status === FILE_STATUS.VALID);

export const propHasChanged = (oldProp, newProp) =>
  !!(
    (!oldProp && newProp)
    || (oldProp && !newProp)
    || (oldProp && newProp && oldProp.length !== newProp.length)
  );

const displayFullState = withStateHandlers(
  ({ currentValue }) => ({
    displayFull:
      Meteor.microservice === 'admin' || !filesExistAndAreValid(currentValue),
  }),
  {
    showFull: () => () => ({ displayFull: true }),
    hideFull: () => () => ({ displayFull: false }),
  },
);

const tempFileState = withStateHandlers(
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

const props = withProps(({
  deleteFile,
  addTempFiles,
  addTempSuccessFile,
  intl: { formatMessage: f },
  handleSuccess,
  currentValue = [],
  tempFiles,
  tempSuccessFiles,
  fileMeta: { id, label },
  loanId,
  setTempSuccessFiles,
  docId,
  collection,
}) => ({
  handleAddFiles: (files) => {
    const fileArray = [];
    let showError = false;

    files.forEach((file) => {
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
        import('../../../utils/notification').then(({ default: notification }) => {
          notification.error({
            message: f({ id: `errors.${showError}.title` }),
            description: f({ id: `errors.${showError}.description` }),
          });
        });
        return;
    }

    addTempFiles(files);
  },
  handleUploadComplete: (file, url) => {
    addTempSuccessFile(file);
    ClientEventService.emit(MODIFIED_FILES_EVENT);
    notifyOfUpload.run({
      fileName: file.name,
      docLabel: label || f({ id: `files.${id}` }),
      loanId,
    });
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
  handleMoveFile: ({
    Key,
    name,
    oldDocId,
    oldCollection,
    oldId,
  }) => {
    console.log('move', { Key, name, oldDocId, oldCollection, oldId });
    console.log('to', { docId, collection, id });
  },
}));

const willReceiveProps = lifecycle({
  componentWillReceiveProps({ currentValue: nextValue = [] }) {
    const {
      currentValue = [],
      tempSuccessFiles,
      setTempSuccessFiles,
    } = this.props;

    if (
      propHasChanged(currentValue, nextValue)
      && tempSuccessFiles.length > 0
    ) {
      const nonDuplicateFiles = tempSuccessFiles.filter(({ name }) => !nextValue.find(file => file.name === name));
      setTempSuccessFiles(nonDuplicateFiles);
    }
  },
});

const withMergedSuccessfulFiles = withProps(({ currentValue = [], tempSuccessFiles }) => ({
  currentValue: uniqBy([...currentValue, ...tempSuccessFiles], 'name'),
}));

export default compose(
  injectIntl,
  displayFullState,
  tempFileState,
  withMatchParam('loanId'),
  props,
  willReceiveProps,
  withMergedSuccessfulFiles,
);
