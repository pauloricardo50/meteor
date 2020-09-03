import React from 'react';
import PropTypes from 'prop-types';

import Loans from 'core/api/loans';
import { LOANS_COLLECTION, LOAN_STATUS } from 'core/api/loans/loanConstants';
import { loanUpdate } from 'core/api/loans/methodDefinitions';
import AdminNotes from 'core/components/AdminNotes';
import Icon from 'core/components/Icon/Icon';
import { LoanChecklistDialog } from 'core/components/LoanChecklist';
import LoanChecklistEmailSender from 'core/components/LoanChecklist/LoanChecklistEmail/LoanChecklistEmailSender';
import AdminLoanClosingChecklist from 'core/components/LoanClosingChecklist/AdminLoanClosingChecklist';
import MaxPropertyValue from 'core/components/MaxPropertyValue';
import Recap from 'core/components/Recap';
import Toggle from 'core/components/Toggle';
import T from 'core/components/Translation';
import UpdateField from 'core/components/UpdateField';
import Calculator from 'core/utils/Calculator';

import AdminAnalysis from '../../../../components/AdminAnalysis';
import AdminTimeline from '../../../../components/AdminTimeline';
import AssigneesManager from '../../../../components/AssigneesManager';
import InsurancePotential from '../../../../components/InsurancePotential/InsurancePotential';
import BorrowerAge from '../BorrowerAge';
import LoanDisbursementDate from './LoanDisbursementDate';
import LoanStepSetter from './LoanStepSetter';

const allowClosingChecklists = status =>
  [
    LOAN_STATUS.ONGOING,
    LOAN_STATUS.CLOSING,
    LOAN_STATUS.FINALIZED,
    LOAN_STATUS.BILLING,
  ].indexOf(status) >= 0;

const OverviewTab = props => {
  const { loan } = props;
  const { borrowers, _id: loanId, frontTagId, status, userFormsEnabled } = loan;
  const loanHasMinimalInformation = Calculator.loanHasMinimalInformation({
    loan,
  });

  return (
    <div className="overview-tab">
      <InsurancePotential loan={loan} hideWhenCompleted />
      <div className="admin-section card1">
        <div
          className="card-top"
          style={{ flexWrap: 'nowrap', alignItems: 'flex-start' }}
        >
          <div className="flex sa">
            {status === LOAN_STATUS.UNSUCCESSFUL && (
              <UpdateField
                doc={loan}
                collection={Loans}
                fields={['unsuccessfulReason']}
                autosaveDelay={500}
                className="mr-16"
              />
            )}
            <Toggle
              labelTop={<T id="Forms.userFormsEnabled" />}
              labelLeft={<T id="general.no" />}
              labelRight={<T id="general.yes" />}
              toggled={userFormsEnabled}
              onToggle={value =>
                loanUpdate.run({ loanId, object: { userFormsEnabled: value } })
              }
              className="mr-16"
            />
            <UpdateField
              doc={loan}
              fields={['category']}
              collection={Loans}
              className="mr-16"
            />
            <UpdateField
              doc={loan}
              fields={['residenceType']}
              collection={Loans}
              className="mr-16"
            />
            <UpdateField
              doc={loan}
              fields={['purchaseType']}
              collection={Loans}
              className="mr-16"
            />
            <UpdateField
              doc={loan}
              fields={['acquisitionStatus']}
              collection={Loans}
              className="mr-16"
            />
            <LoanStepSetter loan={loan} className="mr-16" />
            <LoanDisbursementDate loan={loan} className="mr-16" />
            <AssigneesManager doc={loan} collection={LOANS_COLLECTION} />
          </div>
          <AdminAnalysis
            loan={loan}
            style={{ flexBasis: '25%', minWidth: '300px' }}
          />
        </div>

        <div className="card-bottom">
          <LoanChecklistDialog loan={loan} />
          <LoanChecklistEmailSender
            loan={loan}
            currentUser={props.currentUser}
          />
          <AdminLoanClosingChecklist
            loan={loan}
            buttonProps={{
              raised: true,
              className: 'ml-32 animated fadeIn',
              disabled: !allowClosingChecklists(status),
              tooltip:
                !allowClosingChecklists(status) &&
                'Passez à "En cours" pour activer les checklists',
              icon: (
                <Icon
                  type={loan.showClosingChecklists ? 'eye' : 'eyeCrossed'}
                />
              ),
            }}
          />
        </div>
      </div>

      <AdminTimeline
        docId={loanId}
        collection={LOANS_COLLECTION}
        frontTagId={frontTagId}
      />

      <AdminNotes doc={loan} />

      <div className="max-property-value-tools">
        <MaxPropertyValue loan={loan} />
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
    </div>
  );
};

OverviewTab.propTypes = {
  borrowers: PropTypes.arrayOf(PropTypes.object).isRequired,
  loan: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default OverviewTab;
