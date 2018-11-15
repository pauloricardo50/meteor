// @flow
import { Meteor } from 'meteor/meteor';

import React from 'react';
import { ScrollSync } from 'react-scroll-sync';

import type { userLoan } from 'core/api';
import { loanUpdate } from 'core/api';
import Toggle from '../../Material/Toggle';
import Loading from '../../Loading';
import T from '../../Translation';
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

const makeToggleOffers = loanId => (event, checked) =>
  loanUpdate.run({ loanId, object: { enableOffers: checked } });

const Financing = ({ loan }: FinancingProps) =>
  (loan.structures.length > 0 ? (
    <ScrollSync proportional={false} vertical={false}>
      <div className="financing-structures">
        <FinancingHeader selectedStructure={loan.selectedStructure} />
        <FinancingProject />
        <FinancingFinancing />
        <FinancingOwnFunds />
        {Meteor.microservice === 'admin' && (
          <Toggle
            labelTop={<T id="Forms.enableOffers" />}
            labelLeft={<T id="general.no" />}
            labelRight={<T id="general.yes" />}
            toggled={loan.enableOffers}
            onToggle={makeToggleOffers(loan._id)}
          />
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
