import { Meteor } from 'meteor/meteor';

import React from 'react';
import { faHome } from '@fortawesome/pro-light-svg-icons/faHome';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ScrollSync } from 'react-scroll-sync';

import Loans from '../../../api/loans';
import { PURCHASE_TYPE } from '../../../api/loans/loanConstants';
import Loading from '../../Loading';
import T from '../../Translation';
import UpdateField from '../../UpdateField';
import FinancingContainer from './FinancingContainer';
import FinancingDetails from './FinancingDetails';
import FinancingFinancing from './FinancingFinancing';
import FinancingHeader from './FinancingHeader';
import FinancingLenders from './FinancingLenders';
import FinancingOffers from './FinancingOffers';
import FinancingOwnFunds from './FinancingOwnFunds';
import FinancingProject from './FinancingProject';
import FinancingRefinancing from './FinancingRefinancing';
import FinancingResult from './FinancingResult';

const Financing = ({ loan }) => {
  if (!loan.structures.length) {
    return <Loading />;
  }

  if (!loan.residenceType) {
    return (
      <div className="financing-select-residence-type">
        <FontAwesomeIcon icon={faHome} className="icon" />
        <T id="Financing.residenceTypeSelect.description" />
        <UpdateField
          doc={loan}
          fields={['residenceType']}
          collection={Loans}
          style={{ minWidth: 200 }}
        />
      </div>
    );
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
