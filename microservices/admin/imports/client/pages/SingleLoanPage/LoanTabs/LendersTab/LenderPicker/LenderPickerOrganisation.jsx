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
  <div>
    <h4>{name}</h4>
    {isActive && <Button onClick={() => removeLender()}>Supprimer</Button>}
    {!isActive && (
      <Button onClick={() => addLender(organisationId)}>Ajouter</Button>
    )}
  </div>
);

export default LenderPickerOrganisation;
