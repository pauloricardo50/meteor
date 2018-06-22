import React from 'react';
import PropTypes from 'prop-types';

import Recap from 'core/components/Recap';
import ImpersonateLink from 'core/components/Impersonate/ImpersonateLink';
import T from 'core/components/Translation';
import { loanHasMinimalInformation } from 'core/utils/loanFunctions';
import DisableUserFormsToggle from '../../../../components/DisableUserFormsToggle';
import AdminNote from '../../../../components/AdminNote';
import StepStatus from './StepStatus';
import LoanValidation from './LoanValidation';
import LoanObject from './LoanObject';

const OverviewTab = (props) => {
  const { loan, borrowers, serverTime } = props;
  const { adminNote, user, _id } = loan;
  const displayRecap = loanHasMinimalInformation({ loan });

  return (
    <div className="overview-tab">
      <div className="admin-section">
        <DisableUserFormsToggle loan={loan} />
        <div className="admin-note-wrapper">
          <AdminNote
            loanId={_id}
            adminNoteText={adminNote}
            className="admin-note"
          />
          <ImpersonateLink user={user} />
        </div>
      </div>
      <StepStatus {...props} serverTime={serverTime} />
      <LoanValidation loan={loan} />
      <hr />
      <div className="overview-recap">
        <div className="recap-div">
          <h2 className="fixed-size">
            <T id="OverviewTab.recap" />
          </h2>
          {displayRecap ?
            <Recap {...props} arrayName="dashboard" />
            :
            <T id="OverviewTab.emptyRecap" />
          }
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

      <LoanObject loan={loan} />
    </div>
  );
};

OverviewTab.propTypes = {
  loan: PropTypes.objectOf(PropTypes.any).isRequired,
  borrowers: PropTypes.arrayOf(PropTypes.object).isRequired,
  dataToPassDown: PropTypes.objectOf(PropTypes.any).isRequired,
  serverTime: PropTypes.object.isRequired,
};

export default OverviewTab;
