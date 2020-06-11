import React from 'react';

import { LOAN_STATUS, LOAN_STATUS_ORDER } from 'core/api/loans/loanConstants';
import OfferAdder from 'core/components/OfferAdder';
import OfferList from 'core/components/OfferList';

import LenderList from './LenderList';
import LenderPicker from './LenderPicker';
import LendersActivation from './LendersActivation';
import LendersTabEmptyState from './LendersTabEmptyState';

const shouldRenderTab = ({ status, lenders = [] }) => {
  const statusIndex = LOAN_STATUS_ORDER.indexOf(status);
  return (
    statusIndex >= LOAN_STATUS_ORDER.indexOf(LOAN_STATUS.ONGOING) ||
    lenders.length > 0
  );
};

const LendersTab = props => {
  const { loan } = props;
  const { _id: loanId, status, lenders } = loan;
  const disableOfferAdder = !lenders || lenders.length === 0;

  return (
    <div className="lenders-tab">
      {shouldRenderTab({ status, lenders }) ? (
        <>
          <LendersActivation loan={loan} />
          <LenderPicker {...props} />
          <OfferAdder
            loanId={loanId}
            buttonProps={{
              disabled: disableOfferAdder,
              tooltip: disableOfferAdder
                ? 'Ajoutez un prêteur pour ajouter des offres'
                : undefined,
            }}
          />
          <h1 className="text-center">Prêteurs</h1>
          <LenderList lenders={lenders} />
          <h1 className="text-center">Offres</h1>
          <OfferList loan={loan} />
        </>
      ) : (
        <LendersTabEmptyState />
      )}
    </div>
  );
};

export default LendersTab;
