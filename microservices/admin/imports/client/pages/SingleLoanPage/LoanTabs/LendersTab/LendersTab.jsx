// @flow
import React from 'react';

import OfferAdder from 'core/components/OfferAdder';
import OfferList from 'core/components/OfferList';
import { LOAN_STATUS_ORDER, LOAN_STATUS } from 'core/api/constants';
import LendersActivation from './LendersActivation';
import LenderList from './LenderList';
import LenderPicker from './LenderPicker';
import LendersTabEmptyState from './LendersTabEmptyState';

type LendersTabProps = {
  loan: Object,
};

const shouldRenderTab = ({ status, lenders = [] }) => {
  const statusIndex = LOAN_STATUS_ORDER.indexOf(status);
  return (
    statusIndex >= LOAN_STATUS_ORDER.indexOf(LOAN_STATUS.ONGOING)
    || lenders.length > 0
  );
};

const LendersTab = (props: LendersTabProps) => {
  const {
    loan: {
      _id: loanId,
      offers,
      structure: { property },
      status,
      lenders,
    },
  } = props;
  return (
    <div className="lenders-tab">
      {shouldRenderTab({ status, lenders }) ? (
        <>
          <LendersActivation loan={props.loan} />
          <LenderPicker {...props} />
          <OfferAdder
            loanId={loanId}
            disabled={!lenders || lenders.length === 0}
          />
          <h1 className="text-center">Prêteurs</h1>
          <LenderList {...props} />
          <h1 className="text-center">Offres</h1>
          <OfferList offers={offers} property={property} />
        </>
      ) : (
        <LendersTabEmptyState />
      )}
    </div>
  );
};

export default LendersTab;
