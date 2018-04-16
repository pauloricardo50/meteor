import React from 'react';
import PropTypes from 'prop-types';

import Button from 'core/components/Button';
import Recap from 'core/components/Recap';
import renderObject from 'core/utils/renderObject';
import ImpersonateLink from 'core/components/Impersonate/ImpersonateLink';
import { T } from 'core/components/Translation';
import AdminNote from '../../../../components/AdminNote';
import StepStatus from './StepStatus';
import LoanTasksTable from '../LoanTasksTable';
import LoanValidation from './LoanValidation';

export default class OverviewTab extends React.Component {
  constructor(props) {
    super(props);

    this.state = { showObject: false };
  }

  render() {
    const { loan, borrowers } = this.props;
    const { adminNote, user, borrowerIds, property, _id } = loan;
    const { showObject, serverTime } = this.state;

    return (
      <div className="mask1 overview-tab">
        <div className="admin-section">
          <AdminNote
            loanId={_id}
            adminNoteText={adminNote}
            className="admin-note"
          />
          <ImpersonateLink user={user} />
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
          <div className="recapDiv">
            <h2 className="fixed-size">
              <T id="OverviewTab.recap" />
            </h2>
            <Recap {...this.props} arrayName="dashboard" />
          </div>

          <div className="flex-col">
            {borrowers.map((b, i) => (
              <div className="recapDiv" key={b._id}>
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
          borrowerIds={borrowerIds}
          propertyId={property._id}
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
