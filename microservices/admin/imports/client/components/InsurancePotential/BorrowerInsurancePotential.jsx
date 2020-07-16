import React from 'react';

import { SUCCESS } from 'core/api/constants';
import StatusIcon from 'core/components/StatusIcon';

const FormattedItem = ({ item, label }) => {
  if (!item) {
    return null;
  }

  return (
    <span className="flex center-align">
      <StatusIcon className="mr-4" status={SUCCESS} />
      {label}
    </span>
  );
};

const BorrowerInsurancePotential = ({ borrower, potential }) => {
  const {
    hasUploadedLppCertificate,
    doesNotHave3A,
    doesNotHave3BInGenevaOrFribourg,
    hasBank3A,
    isSelfEmployed,
    isDivorced,
    isNearRetirement,
    hasPotential,
  } = potential;

  const { name } = borrower;

  if (!hasPotential) {
    return null;
  }

  return (
    <div className="flex-col">
      <h5 className="mt-0">{name}</h5>
      <FormattedItem
        item={hasUploadedLppCertificate}
        label="Certificat LPP uploadé"
      />
      <FormattedItem item={doesNotHave3A} label="Pas de 3A" />
      <FormattedItem
        item={doesNotHave3BInGenevaOrFribourg}
        label="Pas de 3B (Genève/Fribourg)"
      />
      <FormattedItem item={hasBank3A} label="3A bancaire" />
      <FormattedItem item={isSelfEmployed} label="Indépendant" />
      <FormattedItem item={isDivorced} label="Divorcé" />
      <FormattedItem item={isNearRetirement} label="50 ans ou plus" />
    </div>
  );
};

export default BorrowerInsurancePotential;
