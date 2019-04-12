// @flow
import React from 'react';

import Button from '../Button';
import Icon from '../Icon';
import T from '../Translation';
import MaxPropertyValueSharingContainer from './MaxPropertyValueSharingContainer';
import Dialog from '../Material/Dialog';

type MaxPropertyValueSharingProps = {};

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

  let label;
  let secondary;
  let onClick;
  let raised;
  let outlined;

  switch (shareSolvency) {
  case null:
  case undefined: {
    label = <T id="MaxPropertyValueSharing.buttonLabel" />;
    secondary = true;
    raised = true;
    onClick = () => setOpenDialog(true);
    break;
  }
  case true: {
    outlined = true;
    label = (
      <span className="max-property-sharing-label">
          Partage de solvabilité: &nbsp;
        <span className="success">
            Activé&nbsp;
          <Icon type="check" />
        </span>
      </span>
    );
    onClick = handleDisable;
    break;
  }
  case false: {
    outlined = true;
    label = (
      <span className="max-property-sharing-label">
          Partage de solvabilité: &nbsp;
        <span className="error">
            Désactivé&nbsp;
          <Icon type="close" />
        </span>
      </span>
    );
    onClick = () => setOpenDialog(true);
    break;
  }
  default:
    break;
  }

  return (
    <>
      <Button
        raised={raised}
        secondary={secondary}
        onClick={onClick}
        outlined={outlined}
        className="max-property-sharing"
      >
        {label}
      </Button>
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
