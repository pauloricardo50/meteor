import React from 'react';

import Button from 'core/components/Button';
import Dialog from 'core/components/Material/Dialog';
import Toggle from 'core/components/Toggle';
import T from 'core/components/Translation';

import ShareCustomersToggleContainer from './ShareCustomersToggleContainer';

const ShareCustomersToggle = ({
  organisation,
  handleToggle,
  openDialog,
  setOpenDialog,
  loading,
  handleSubmit,
}) => {
  const {
    $metadata: { shareCustomers = true } = {},
    name: organisationName,
  } = organisation;

  return (
    <>
      <Toggle
        className="share-customers-toggle"
        toggled={shareCustomers}
        onToggle={handleToggle}
        labelRight="Partager mes dossiers avec mes collègues"
      />
      <Dialog
        open={openDialog}
        title="Partager mes dossiers"
        text={`En activant le partage de dossiers, tous les comptes Pro de l'organisation ${organisationName} pourront voir les dossiers des clients que vous avez référés.`}
        actions={[
          <Button
            label={<T id="ConfirmMethod.buttonCancel" />}
            primary
            onClick={() => setOpenDialog(false)}
            key="cancel"
            disabled={loading}
          />,
          <Button
            label={<T id="ConfirmMethod.buttonConfirm" />}
            primary
            onClick={handleSubmit}
            key="ok"
            disabled={loading}
          />,
        ]}
      />
    </>
  );
};

export default ShareCustomersToggleContainer(ShareCustomersToggle);
