// @flow
import React from 'react';

import Button from '../Button';
import Toggle from '../Toggle';
import Icon from '../Icon';
import T from '../Translation';
import MaxPropertyValueSharingContainer from './MaxPropertyValueSharingContainer';
import Dialog from '../Material/Dialog';

type MaxPropertyValueSharingProps = {};

const getTrigger = ({ shareSolvency, setOpenDialog, handleDisable }) => {
  switch (shareSolvency) {
  case null:
  case undefined:
    return (
      <Button secondary raised onClick={() => setOpenDialog(true)}>
        <T id="MaxPropertyValueSharing.buttonLabel" />
      </Button>
    );

  case true:
  case false:
    return (
      <div className="max-property-sharing-toggle">
        <span>
          <T id="MaxPropertyValueSharing.toggleLabel" />
        </span>
        <Toggle
          toggled={shareSolvency}
          onToggle={shareSolvency ? handleDisable : () => setOpenDialog(true)}
        />
      </div>
    );

  default:
  }
};

const MaxPropertyValueSharing = ({
  hasProProperty,
  hasPromotion,
  shareSolvency,
  openDialog,
  setOpenDialog,
  loading,
  handleSubmit,
  handleDisable,
}: MaxPropertyValueSharingProps) => {
  if (!hasProProperty && !hasPromotion) {
    return null;
  }

  return (
    <>
      {getTrigger({ shareSolvency, setOpenDialog, handleDisable })}
      <Dialog
        open={openDialog}
        title={<T id="SimpleDashboardPage.shareSolvency.title" />}
        text={<T id="SimpleDashboardPage.shareSolvency.disclaimer" />}
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
            loading={loading}
          />,
        ]}
      />
    </>
  );
};

export default MaxPropertyValueSharingContainer(MaxPropertyValueSharing);
