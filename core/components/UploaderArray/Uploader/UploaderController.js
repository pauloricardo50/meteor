import { Meteor } from 'meteor/meteor';
import { compose, withStateHandlers, withProps, lifecycle } from 'recompose';
import { injectIntl } from 'react-intl';
import notification from 'core/utils/notification';
import {
  FILE_STATUS,
  ALLOWED_FILE_TYPES,
  MAX_FILE_SIZE,
} from '../../../api/constants';
import ClientEventService, {
  MODIFIED_FILES_EVENT,
} from '../../../api/events/ClientEventService';
import SlackService from '../../../api/slack';

const checkFile = (file) => {
  if (ALLOWED_FILE_TYPES.indexOf(file.type) < 0) {
    return 'fileType';
  }
  if (file.size > MAX_FILE_SIZE) {
    return 'fileSize';
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
      Meteor.microservice !== 'admin' && !filesExistAndAreValid(currentValue),
  }),
  {
    showFull: () => () => ({ displayFull: true }),
    hideFull: () => () => ({ displayFull: false }),
  },
);

const tempFileState = withStateHandlers(
  { tempFiles: [] },
  {
    addTempFiles: ({ tempFiles }) => (files = []) => ({
      tempFiles: [...tempFiles, ...files],
    }),
    filterTempFiles: ({ tempFiles }) => filterFunction => ({
      tempFiles: tempFiles.filter(filterFunction),
    }),
  },
);

const props = withProps(({
  deleteFile,
  addTempFiles,
  intl: { formatMessage: f },
  currentUser,
  handleSuccess,
}) => ({
  handleAddFiles: (files) => {
    const fileArray = [];
    let showError = false;

    files.forEach((file) => {
      const isValid = checkFile(file);
      if (isValid === true) {
        fileArray.push(file);
      } else {
        showError = isValid;
      }
    });

    if (showError) {
      notification.error({
        message: f({ id: `error.${showError}.title` }),
        description: f({ id: `error.${showError}.description` }),
      });
      return;
    }

    addTempFiles(files);
  },
  handleUploadComplete: (file, url) => {
    ClientEventService.emit(MODIFIED_FILES_EVENT);
    SlackService.notifyOfUpload(currentUser, file.name);
    if (handleSuccess) {
      handleSuccess(file, url);
    }
  },
  handleRemove: key =>
    deleteFile(key).then(() => {
      setTimeout(() => {
        ClientEventService.emit(MODIFIED_FILES_EVENT);
      }, 0);
    }),
}));

const willReceiveProps = lifecycle({
  // Remove temp files from state when they are saved to the DB, and appear in
  // props.
  // FIXME: This prevents someone from uploading a file with the same name twice
  componentWillReceiveProps({ currentValue: nextValue }) {
    const { currentValue, tempFiles, filterTempFiles } = this.props;

    // Lazy check to see if they are of different size
    if (propHasChanged(currentValue, nextValue)) {
      if (tempFiles && tempFiles.length) {
        // Loop over the new props to see if they match any of the temp files
        // Remove the ones that match
        nextValue.forEach(file =>
          tempFiles.forEach(temp =>
            temp.name === file.name
              && filterTempFiles(tempFile => tempFile.name !== file.name)));
      }
    }
  },
});

export default compose(
  injectIntl,
  displayFullState,
  tempFileState,
  props,
  willReceiveProps,
);
