import React from 'react';

import Button from '../Button';
import Icon from '../Icon';
import Dialog from '../Material/Dialog';
import Toggle from '../Toggle';
import T from '../Translation';
import MaxPropertyValueSharingContainer from './MaxPropertyValueSharingContainer';

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
              defaultMessage="Certifier avec {orgName}"
              values={{ orgName: propertyOrganisation.name }}
            />
          ) : (
            <T defaultMessage="Partager avec mon courtier" />
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
                defaultMessage="Certifier avec {orgName}"
                values={{ orgName: propertyOrganisation.name }}
              />
            ) : (
              <T defaultMessage="Partage de solvabilité" />
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
}) => {
  if (!hasProProperty) {
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
        text={
          <T
            id="SimpleDashboardPage.shareSolvency.disclaimer"
            values={{
              orgName: propertyOrganisation
                ? propertyOrganisation.name
                : 'votre courtier',
            }}
          />
        }
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
