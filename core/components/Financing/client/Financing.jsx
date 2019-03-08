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

type FinancingProps = {
  loan: userLoan,
};

const Financing = ({ loan }: FinancingProps) =>
  (loan.structures.length > 0 ? (
    <ScrollSync proportional={false} vertical={false}>
      <div className="financing-structures">
        <FinancingHeader selectedStructure={loan.selectedStructure} />
        <FinancingProject />
        {loan.purchaseType === PURCHASE_TYPE.REFINANCING && (
          <FinancingRefinancing />
        )}
        <FinancingFinancing />
        <FinancingOwnFunds />
        {Meteor.microservice === 'admin' && (
          <span>
            Offres{' '}
            {loan.enableOffers ? (
              <span className="success">Activées</span>
            ) : (
              <span className="error">Désactivées</span>
            )}
          </span>
        )}
        {(Meteor.microservice === 'admin' || loan.enableOffers) && (
          <FinancingOffers />
        )}
        <FinancingResult />
        {Meteor.microservice === 'admin' && <FinancingLenders />}
      </div>
    </ScrollSync>
  ) : (
    <Loading />
  ));

export default FinancingContainer(Financing);
