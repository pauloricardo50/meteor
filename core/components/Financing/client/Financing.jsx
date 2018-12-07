// @flow
import { Meteor } from 'meteor/meteor';

import React from 'react';
import { ScrollSync } from 'react-scroll-sync';

import type { userLoan } from 'core/api';
import Loading from '../../Loading';
import FinancingFinancing from './FinancingFinancing';
import FinancingHeader from './FinancingHeader';
import FinancingOffers from './FinancingOffers';
import FinancingOwnFunds from './FinancingOwnFunds';
import FinancingProject from './FinancingProject';
import FinancingResult from './FinancingResult';
import FinancingContainer from './FinancingContainer';

type FinancingProps = {
  loan: userLoan,
};

const Financing = ({ loan }: FinancingProps) =>
  (loan.structures.length > 0 ? (
    <ScrollSync proportional={false} vertical={false}>
      <div className="financing-structures">
        <FinancingHeader selectedStructure={loan.selectedStructure} />
        <FinancingProject />
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
      </div>
    </ScrollSync>
  ) : (
    <Loading />
  ));

export default FinancingContainer(Financing);
