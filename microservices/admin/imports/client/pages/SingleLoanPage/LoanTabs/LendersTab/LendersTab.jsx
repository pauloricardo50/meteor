// @flow
import React from 'react';

import OfferAdder from 'core/components/OfferAdder';
import LendersActivation from './LendersActivation';
import LenderList from './LenderList';
import LenderPicker from './LenderPicker';

type LendersTabProps = {
  loan: Object,
};

const LendersTab = (props: LendersTabProps) => {
  const {
    loan: { _id: loanId },
  } = props;
  return (
    <div>
      <LendersActivation loan={props.loan} />
      <LenderPicker {...props} />
      <OfferAdder loanId={loanId} />
      <LenderList {...props} />
    </div>
  );
};

export default LendersTab;
