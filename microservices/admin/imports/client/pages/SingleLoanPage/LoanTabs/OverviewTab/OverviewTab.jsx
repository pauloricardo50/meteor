import React from 'react';
import PropTypes from 'prop-types';

import Button from 'core/components/Button';
import Recap from 'core/components/Recap';
import Toggle from 'core/components/Material/Toggle';
import renderObject from 'core/utils/renderObject';
import ImpersonateLink from 'core/components/Impersonate/ImpersonateLink';
import T from 'core/components/Translation';
import { loanHasMinimalInformation } from 'core/utils/loanFunctions';
import { loanUpdate } from 'core/api/methods';
import AdminNote from '../../../../components/AdminNote';
import StepStatus from './StepStatus';
import LoanTasksTable from '../LoanTasksTable';
import LoanValidation from './LoanValidation';
import DisableUserFormsToggle from '../../../../../ui/components/DisableUserFormsToggle';

export default class OverviewTab extends React.Component {
  constructor(props) {
    super(props);

    this.state = { showObject: false };
  }

  render() {
    const { loan, borrowers } = this.props;
    const { adminNote, user, borrowerIds, property, _id } = loan;
    const { showObject, serverTime } = this.state;
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

        <StepStatus {...this.props} serverTime={serverTime} />

        <LoanValidation loan={loan} />

        <hr />
        <div
          className="flex"
          style={{
            width: '100%',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
          }}
        >
          <div className="recap-div">
            <h2 className="fixed-size">
              <T id="OverviewTab.recap" />
            </h2>
            {displayRecap ? (
              <Recap {...this.props} arrayName="dashboard" />
            ) : (
              <T id="OverviewTab.emptyRecap" />
            )}
          </div>

          <div className="flex-col">
            {borrowers.map((b, i) => (
              <div className="recap-div" key={b._id}>
                <h2 className="fixed-size">
                  {b.firstName || `Emprunteur ${i + 1}`}
                </h2>
                <Recap {...this.props} arrayName="borrower" borrower={b} />
              </div>
            ))}
          </div>
        </div>

        <hr />
        <br />

        <h2 className="fixed-size text-center">
          <T id="collections.tasks" />
        </h2>
        <LoanTasksTable
          showAssignee
          loanId={_id}
          propertyId={property._id}
          borrowerIds={borrowerIds}
        />

        <br />
        <br />

        <div className="text-center">
          <Button
            raised
            label={showObject ? 'Masquer' : 'Afficher détails'}
            onClick={() =>
              this.setState(prev => ({
                showObject: !prev.showObject,
              }))
            }
          />
        </div>
        {showObject && (
          <ul className="loan-map">
            {Object.keys(loan).map(key => renderObject(key, loan))}
          </ul>
        )}
      </div>
    );
  }
}

OverviewTab.propTypes = {
  loan: PropTypes.objectOf(PropTypes.any).isRequired,
  borrowers: PropTypes.arrayOf(PropTypes.object).isRequired,
  dataToPassDown: PropTypes.objectOf(PropTypes.any).isRequired,
};
