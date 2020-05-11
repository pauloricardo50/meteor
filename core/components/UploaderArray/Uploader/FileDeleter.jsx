import React from 'react';

import Button from '../../Button';
import IconButton from '../../IconButton';
import T from '../../Translation';

const FileDeleter = ({
  deleting,
  setDeleting,
  openModal,
  handleRemove,
  Key,
  name,
}) => (
  <IconButton
    disabled={deleting}
    type={deleting ? 'loop-spin' : 'close'}
    tooltip={<T id="general.delete" />}
    onClick={event => {
      event.preventDefault();
      setDeleting(true);
      openModal({
        title: <T id="Files.removeFile" />,
        content: () => <T id="Files.removeFile.confirm" values={{ name }} />,
        actions: ({ closeModal }) => [
          <Button
            key="cancel"
            onClick={() => {
              setDeleting(false);
              closeModal();
            }}
          >
            <T id="general.cancel" />
          </Button>,
          <Button
            key="delete"
            primary
            raised
            onClick={() => {
              handleRemove(Key).catch(error => {
                // Only stop the loader if deleting fails
                // This component will be deleted anyways when the deletion worked
                setDeleting(false);
                closeModal();
                throw error;
              });
              closeModal();
            }}
          >
            <T id="general.delete" />
          </Button>,
        ],
        important: true,
      });
    }}
    size="small"
    name="delete"
  />
);

export default FileDeleter;
