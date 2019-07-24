// @flow
import React from 'react';

import Button from '../Button';
import Toggle from '../Toggle';
import Icon from '../Icon';
import T from '../Translation';
import MaxPropertyValueSharingContainer from './MaxPropertyValueSharingContainer';
import Dialog from '../Material/Dialog';

type MaxPropertyValueSharingProps = {};

const getTrigger = ({
  shareSolvency,
  setOpenDialog,
  handleDisable,
  propertyOrganisation,
}) => {
  switch (shareSolvency) {
  case null:
  case undefined:
    return (
      <Button secondary raised onClick={() => setOpenDialog(true)}>
        {propertyOrganisation ? (
          <T
            id="MaxPropertyValueSharing.buttonLabelOrg"
            values={{ orgName: propertyOrganisation.name }}
          />
        ) : (
          <T id="MaxPropertyValueSharing.buttonLabel" />
        )}
      </Button>
    );

  case true:
  case false:
    return (
      <div className="max-property-sharing-toggle">
        <span>
          {propertyOrganisation ? (
            <T
              id="MaxPropertyValueSharing.buttonLabelOrg"
              values={{ orgName: propertyOrganisation.name }}
            />
          ) : (
            <T id="MaxPropertyValueSharing.toggleLabel" />
          )}
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
  propertyOrganisation,
}: MaxPropertyValueSharingProps) => {
  if (!hasProProperty && !hasPromotion) {
    return null;
  }

  return (
    <>
      {getTrigger({
        shareSolvency,
        setOpenDialog,
        handleDisable,
        propertyOrganisation,
      })}
      <Dialog
        open={openDialog}
        title={<T id="SimpleDashboardPage.shareSolvency.title" />}
        text={(
          <T
            id="SimpleDashboardPage.shareSolvency.disclaimer"
            values={{
              orgName: propertyOrganisation
                ? propertyOrganisation.name
                : 'votre courtier',
            }}
          />
        )}
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
