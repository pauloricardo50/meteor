// @flow
import React from 'react';

import LenderListItemRules from 'core/components/Financing/client/FinancingLenders/LenderList/LenderListItemRules';

type LenderPickerOrganisationRulesProps = {};

const LenderPickerOrganisationRules = ({
  organisation,
  loan,
}: LenderPickerOrganisationRulesProps) => {
  const { lenderRules } = organisation;
  if (!lenderRules || !lenderRules.length) {
    return null;
  }

  return (
    <div className="lender-picker-structures flex">
      {loan.structures.map(({ id: structureId }, index) => [
        index !== 0 && <span className="lender-picker-structures-separator" />,
        <div key={structureId} className="flex">
          <LenderListItemRules
            organisation={organisation}
            loan={loan}
            structureId={structureId}
          />
        </div>,
      ])}
    </div>
  );
};

export default LenderPickerOrganisationRules;
