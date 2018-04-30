import { compose, withStateHandlers, withProps, lifecycle } from 'recompose';
import { injectIntl } from 'react-intl';
import { allowedFileTypes, maxSize } from 'core/api/files/meteor-slingshot';
import bert from 'core/utils/bert';
import { FILE_STATUS } from '../../../api/constants';

const checkFile = (file) => {
  if (allowedFileTypes.indexOf(file.type) < 0) {
    return 'fileType';
  } else if (file.size > maxSize) {
    return 'fileSize';
  }
  return true;
};

const stateHandlers = withStateHandlers(
  ({ initialTempFiles = [] }) => ({ tempFiles: initialTempFiles }),
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
  currentValue,
  disabled,
  deleteFile,
  addFileToDoc,
  addTempFiles,
  intl: { formatMessage: f },
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
      bert(
        f({ id: `error.${showError}.title` }),
        f({ id: `error.${showError}.description` }),
        'danger',
      );
      return;
    }

    addTempFiles(files);
  },
  handleSave: (file, downloadUrl) =>
    addFileToDoc({
      initialName: file.name,
      size: file.size,
      type: file.type,
      url: encodeURI(downloadUrl), // To avoid spaces and unallowed chars
      key: downloadUrl.split('amazonaws.com/')[1],
    }),
  handleRemove: key => deleteFile(key),
  shouldDisableAdd: () =>
    currentValue.reduce(
      (acc, file) => !(file.status === FILE_STATUS.ERROR),
      true,
    ) && disabled,
}));

const willReceiveProps = lifecycle({
  // Remove temp files from state when they are saved to the DB, and appear in
  // props.
  // FIXME: This prevents someone from uploading a file with the same name twice
  componentWillReceiveProps({ currentValue: nextValue }) {
    const { currentValue, tempFiles, filterTempFiles } = this.props;

    // Lazy check to see if they are of different size
    if (nextValue.length !== currentValue.length) {
      if (tempFiles && tempFiles.length) {
        // Loop over the new props to see if they match any of the temp files
        // Remove the ones that match
        nextValue.forEach(file =>
          tempFiles.forEach(temp =>
            temp.name === file.initialName &&
              filterTempFiles(tempFile => tempFile.name !== file.initialName)));
      }
    }
  },
});

export default compose(injectIntl, stateHandlers, props, willReceiveProps);
