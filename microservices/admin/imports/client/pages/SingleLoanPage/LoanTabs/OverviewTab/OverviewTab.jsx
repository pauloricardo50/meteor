import React from 'react';
import PropTypes from 'prop-types';

import Recap from 'core/components/Recap';
import MaxPropertyValue from 'core/components/MaxPropertyValue';
import T from 'core/components/Translation';
import UpdateField from 'core/components/UpdateField';
import DateModifier from 'core/components/DateModifier';
import Calculator from 'core/utils/Calculator';
import { LOANS_COLLECTION } from 'core/api/constants';
import AdminNote from '../../../../components/AdminNote/AdminNote';
import DisableUserFormsToggle from '../../../../components/DisableUserFormsToggle';
import LoanObject from './LoanObject';
import LoanStatusCheck from './LoanStatusCheck';
import VerificationSetter from './VerificationSetter';
import LoanStepSetter from './LoanStepSetter';
import Solvency from './Solvency';
import LoanTimeline from './LoanTimeline';

const OverviewTab = (props) => {
  const {
    loan,
    currentUser: { roles },
  } = props;
  const { borrowers, _id: loanId } = loan;
  const loanHasMinimalInformation = Calculator.loanHasMinimalInformation({
    loan,
  });

  return (
    <div className="overview-tab">
      <div className="admin-section card1">
        <DisableUserFormsToggle loan={loan} />
        <UpdateField
          doc={loan}
          fields={['category']}
          collection={LOANS_COLLECTION}
        />
        <UpdateField
          doc={loan}
          fields={['residenceType']}
          collection={LOANS_COLLECTION}
        />
        <UpdateField
          doc={loan}
          fields={['purchaseType']}
          collection={LOANS_COLLECTION}
          disabled
        />
        <UpdateField
          doc={loan}
          fields={['applicationType']}
          collection={LOANS_COLLECTION}
        />
        <LoanStepSetter loan={loan} />
        <VerificationSetter loan={loan} />
      </div>
      <div className="admin-note">
        <h2>Notes</h2>
        <AdminNote
          docId={loan._id}
          adminNote={loan.adminNote}
          collection={LOANS_COLLECTION}
        />
      </div>
      <LoanTimeline loanId={loanId} />
      <LoanStatusCheck loan={loan} />
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
              <h2 className="fixed-size">
                {b.firstName || `Emprunteur ${i + 1}`}
              </h2>
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
