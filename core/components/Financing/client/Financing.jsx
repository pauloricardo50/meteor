import { Meteor } from 'meteor/meteor';

import React from 'react';
import { ScrollSync } from 'react-scroll-sync';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/pro-light-svg-icons/faHome';

import { PURCHASE_TYPE, LOANS_COLLECTION } from '../../../api/constants';
import Loading from '../../Loading';
import UpdateField from '../../UpdateField';
import T from '../../Translation';
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
          collection={LOANS_COLLECTION}
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
