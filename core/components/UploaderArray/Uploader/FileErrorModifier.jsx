import React from 'react';
import SimpleSchema from 'simpl-schema';

import IconButton from '../../IconButton';
import DialogForm from '../../ModalManager/DialogForm';

const errorSchema = new SimpleSchema({
  error: { type: String, optional: true },
});

const FileErrorModifier = ({
  deleting,
  openModal,
  message,
  handleChangeError,
  Key,
}) => (
  <IconButton
    disabled={deleting}
    type={deleting ? 'loop-spin' : 'edit'}
    tooltip="Modifier le message d'erreur"
    onClick={event => {
      event.preventDefault();
      openModal(
        <DialogForm
          schema={errorSchema}
          model={{ error: message }}
          title="Modifier l'erreur"
          description="Entrez le nouveau message d'erreur."
          className="animated fadeIn"
          important
          onSubmit={({ error }) => handleChangeError(error, Key)}
        />,
      );
    }}
    size="small"
  />
);

export default FileErrorModifier;
