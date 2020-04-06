import React from 'react';
import PropTypes from 'prop-types';

import Loans from 'core/api/loans';
import { LOANS_COLLECTION } from 'core/api/loans/loanConstants';
import AdminNotes from 'core/components/AdminNotes';
import { LoanChecklistDialog } from 'core/components/LoanChecklist';
import LoanChecklistEmailSender from 'core/components/LoanChecklist/LoanChecklistEmail/LoanChecklistEmailSender';
import MaxPropertyValue from 'core/components/MaxPropertyValue';
import Recap from 'core/components/Recap';
import T from 'core/components/Translation';
import UpdateField from 'core/components/UpdateField';
import Calculator from 'core/utils/Calculator';

import AdminTimeline from '../../../../components/AdminTimeline';
import AssigneesManager from '../../../../components/AssigneesManager';
import DisableUserFormsToggle from '../../../../components/DisableUserFormsToggle';
import LinkToFront from '../../../../components/LinkToFront';
import BorrowerAge from '../BorrowerAge';
import LoanDisbursementDate from './LoanDisbursementDate';
import LoanObject from './LoanObject';
import LoanStepSetter from './LoanStepSetter';
import Solvency from './Solvency';

const OverviewTab = props => {
  const {
    loan,
    currentUser: { roles },
  } = props;
  const { borrowers, _id: loanId, frontTagId } = loan;
  const loanHasMinimalInformation = Calculator.loanHasMinimalInformation({
    loan,
  });

  return (
    <div className="overview-tab">
      <div className="admin-section card1">
        <div className="card-top">
          <DisableUserFormsToggle loan={loan} />
          <UpdateField doc={loan} fields={['category']} collection={Loans} />
          <UpdateField
            doc={loan}
            fields={['residenceType']}
            collection={Loans}
          />
          <UpdateField
            doc={loan}
            fields={['purchaseType']}
            collection={Loans}
            disabled
          />
          <UpdateField
            doc={loan}
            fields={['applicationType']}
            collection={Loans}
          />
          <LoanStepSetter loan={loan} />
          <LoanDisbursementDate loan={loan} />
          <AssigneesManager doc={loan} collection={LOANS_COLLECTION} />
        </div>

        <div className="card-bottom">
          <LoanChecklistDialog loan={loan} />
          <LoanChecklistEmailSender
            loan={loan}
            currentUser={props.currentUser}
          />
          <LinkToFront tagId={frontTagId} />
        </div>
      </div>

      <AdminTimeline
        docId={loanId}
        collection={LOANS_COLLECTION}
        frontTagId={frontTagId}
      />

      <AdminNotes doc={loan} collection={LOANS_COLLECTION} />

      <div className="max-property-value-tools">
        <MaxPropertyValue loan={loan} />
        <Solvency loan={loan} />
      </div>

      <div className="overview-recap">
        <div className="recap-div">
          <h2 className="fixed-size">
            <T id="OverviewTab.recap" />
          </h2>
          {loanHasMinimalInformation ? (
            <Recap {...props} arrayName="dashboard" />
          ) : (
            <T id="OverviewTab.emptyRecap" />
          )}
        </div>

        <div className="borrower-recaps">
          {borrowers.map((b, i) => (
            <div className="recap-div" key={b._id}>
              <h2 className="fixed-size mb-0">
                {b.firstName || `Emprunteur ${i + 1}`}
              </h2>
              <BorrowerAge borrower={b} />
              <Recap {...props} arrayName="borrower" borrower={b} />
            </div>
          ))}
        </div>
      </div>

      {roles.includes('dev') ? <LoanObject loan={loan} /> : null}
    </div>
  );
};

OverviewTab.propTypes = {
  borrowers: PropTypes.arrayOf(PropTypes.object).isRequired,
  loan: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default OverviewTab;
