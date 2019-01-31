// @flow
import React from 'react';

import OfferAdder from 'core/components/OfferAdder';
import OfferList from 'core/components/OfferList';
import LendersActivation from './LendersActivation';
import LenderList from './LenderList';
import LenderPicker from './LenderPicker';

type LendersTabProps = {
  loan: Object,
};

const LendersTab = (props: LendersTabProps) => {
  const {
    loan: {
      _id: loanId,
      offers,
      structure: { property },
    },
  } = props;
  return (
    <div className="lenders-tab">
      <LendersActivation loan={props.loan} />
      <LenderPicker {...props} />
      <OfferAdder loanId={loanId} />
      <h1 className="text-center">Prêteurs</h1>
      <LenderList {...props} />
      <h1 className="text-center">Offres</h1>
      <OfferList offers={offers} property={property} />
    </div>
  );
};

export default LendersTab;
