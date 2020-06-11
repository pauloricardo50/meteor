import { Meteor } from 'meteor/meteor';

import uniqBy from 'lodash/uniqBy';
import { useIntl } from 'react-intl';
import { lifecycle, withProps, withStateHandlers } from 'recompose';

import ClientEventService, {
  MODIFIED_FILES_EVENT,
} from '../../../api/events/ClientEventService';
import {
  ALLOWED_FILE_TYPES,
  FILE_STATUS,
  MAX_DISPLAYABLE_FILE_SIZE,
  MAX_FILE_SIZE,
  ONE_KB,
} from '../../../api/files/fileConstants';

export const getMaxSize = ({ displayableFile, maxSize, maxSizeOverride }) => {
  if (maxSizeOverride) {
    return maxSizeOverride;
  }

  if (maxSize) {
    return displayableFile
      ? Math.min(MAX_DISPLAYABLE_FILE_SIZE, maxSize)
      : Math.min(MAX_FILE_SIZE, maxSize);
  }

  return displayableFile ? MAX_DISPLAYABLE_FILE_SIZE : MAX_FILE_SIZE;
};

export const checkFile = ({
  file,
  currentValue = [],
  tempFiles = [],
  allowedFileTypes = ALLOWED_FILE_TYPES,
  displayableFile = false,
  maxSize,
  maxSizeOverride,
}) => {
  if (file.type && allowedFileTypes.indexOf(file.type) < 0) {
    return 'fileType';
  }

  const maxFileSize = getMaxSize({ displayableFile, maxSize, maxSizeOverride });

  if (file.size && file.size > maxFileSize) {
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

export const formatMaxFileSize = maxSize => {
  if (maxSize / (ONE_KB * ONE_KB) >= 1) {
    return `${maxSize / (ONE_KB * ONE_KB)}MB`;
  }

  if (maxSize / ONE_KB >= 1) {
    return `${maxSize / ONE_KB}KB`;
  }

  return `${maxSize}B`;
};

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
    uploadDirectiveProps,
  }) => {
    const {
      maxSize,
      displayableFile,
      allowedFileTypes,
      maxSizeOverride,
    } = uploadDirectiveProps;

    const { formatMessage: f } = useIntl();
    return {
      handleAddFiles: files => {
        const fileArray = [];
        let showError = false;

        files.forEach(file => {
          const isValid = checkFile({
            file,
            currentValue: [...currentValue, ...tempSuccessFiles],
            tempFiles,
            allowedFileTypes,
            displayableFile,
            maxSize,
            maxSizeOverride,
          });
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
                description: f(
                  {
                    id: `errors.${showError}.description`,
                  },
                  {
                    displayableFile,
                    maxSize: formatMaxFileSize(
                      getMaxSize({ displayableFile, maxSize, maxSizeOverride }),
                    ),
                  },
                ),
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
          setTempSuccessFiles(
            tempSuccessFiles.filter(({ Key }) => Key !== key),
          );

          // Wait for a sec before pinging the DB again
          setTimeout(() => {
            ClientEventService.emit(MODIFIED_FILES_EVENT);
          }, 0);
        }),
    };
  },
);

export const propHasChanged = (oldProp, newProp) =>
  !!(
    (!oldProp && newProp) ||
    (oldProp && !newProp) ||
    (oldProp && newProp && oldProp.length !== newProp.length)
  );

export const willReceiveProps = lifecycle({
  UNSAFE_componentWillReceiveProps({ currentValue: nextValue = [] }) {
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
