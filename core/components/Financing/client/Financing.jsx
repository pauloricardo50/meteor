// @flow
import { Meteor } from 'meteor/meteor';

import React from 'react';
import { ScrollSync } from 'react-scroll-sync';

import type { userLoan } from '../../../api';
import { PURCHASE_TYPE } from '../../../api/constants';
import Loading from '../../Loading';
import FinancingFinancing from './FinancingFinancing';
import FinancingHeader from './FinancingHeader';
import FinancingOffers from './FinancingOffers';
import FinancingOwnFunds from './FinancingOwnFunds';
import FinancingProject from './FinancingProject';
import FinancingResult from './FinancingResult';
import FinancingContainer from './FinancingContainer';
import FinancingRefinancing from './FinancingRefinancing';
import FinancingLenders from './FinancingLenders';
import FinancingDetails from './FinancingDetails';

type FinancingProps = {
  loan: userLoan,
};

const Financing = ({ loan }: FinancingProps) => {
  if (!loan.structures.length) {
    return <Loading />;
  }

  return (
    <ScrollSync proportional={false} vertical={false}>
      <div className="financing-structures">
        <FinancingHeader selectedStructure={loan.selectedStructure} />

        <FinancingDetails />

        <FinancingProject />

        {loan.purchaseType === PURCHASE_TYPE.REFINANCING && (
          <FinancingRefinancing />
        )}

        <FinancingFinancing />

        <FinancingOwnFunds />

        {(Meteor.microservice === 'admin' || loan.enableOffers) && (
          <FinancingOffers loan={loan} />
        )}

        <FinancingResult />

        {Meteor.microservice === 'admin' && <FinancingLenders loan={loan} />}
      </div>
    </ScrollSync>
  );
};
export default FinancingContainer(Financing);
