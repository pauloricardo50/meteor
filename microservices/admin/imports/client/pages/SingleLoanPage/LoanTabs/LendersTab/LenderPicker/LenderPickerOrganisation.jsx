// @flow
import React from 'react';

import Button from 'core/components/Button';

type LenderPickerOrganisationProps = {};

const LenderPickerOrganisation = ({
  organisation: { name, _id: organisationId },
  addLender,
  removeLender,
  isActive,
}: LenderPickerOrganisationProps) => (
  <div className="flex center organisation">
    <h4>{name}</h4>
    {isActive && (
      <Button raised error onClick={() => removeLender(organisationId)}>
        Supprimer
      </Button>
    )}
    {!isActive && (
      <Button raised primary onClick={() => addLender(organisationId)}>
        Ajouter
      </Button>
    )}
  </div>
);

export default LenderPickerOrganisation;
