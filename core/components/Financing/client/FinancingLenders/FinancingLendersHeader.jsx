// @flow
import React from 'react';

import { Calculator } from '../../../../utils/Calculator';

type FinancingLendersHeaderProps = {};

const FinancingLendersHeader = ({
  organisations,
  loan,
  structureId,
}: FinancingLendersHeaderProps) => {
  const interestedLenders = organisations
    .filter(({ lenderRules }) => lenderRules && lenderRules.length > 0)
    .filter(({ lenderRules }) => {
      const calc = new Calculator({ loan, structureId, lenderRules });
      return calc.structureIsValid({ loan, structureId });
    });

  return (
    <div className="lenders lenders-header">
      {interestedLenders.length}
      {' '}
prêteurs intéressés
    </div>
  );
};

export default React.memo(FinancingLendersHeader);
