import React from 'react';
import PropTypes from 'prop-types';

import Button from 'core/components/Button';

import Recap from 'core/components/Recap';
import renderObject from 'core/utils/renderObject';
import AdminNote from '../../../../components/AdminNote';
import StepStatus from './StepStatus';
import LoanTasksTable from './LoanTasksTable';
import LoanValidation from './LoanValidation';

const styles = {
  recapDiv: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: 400,
  },
};

export default class OverviewTab extends React.Component {
  constructor(props) {
    super(props);

    this.state = { showObject: false };
  }

  render() {
    const { loan, borrowers } = this.props;
    const { showObject } = this.state;

    return (
      <div className="mask1">
        <AdminNote loanId={loan._id} adminNoteText={loan.adminNote} />

        <StepStatus {...this.props} serverTime={this.state.serverTime} />

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
          <div style={styles.recapDiv}>
            <h2 className="fixed-size">Récapitulatif</h2>
            <Recap {...this.props} arrayName="dashboard" />
          </div>

          <div className="flex-col">
            {borrowers.map((b, i) => (
              <div style={styles.recapDiv} key={b._id}>
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

        <h2 className="fixed-size text-center">Tâches</h2>
        <LoanTasksTable showAssignee loanId={loan._id} />

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
