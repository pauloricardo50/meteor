import React from 'react';
import PropTypes from 'prop-types';

import Button from 'core/components/Button';

import Recap from 'core/components/Recap';
import renderObject from 'core/utils/renderObject';
import { getLoanValue } from 'core/utils/loanFunctions';
import { IntlNumber } from 'core/components/Translation';
import StepStatus from './StepStatus';
import FileVerificationNotification from './FileVerificationNotification';

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
    const { loan, borrowers, dataToPassDown } = this.props;
    const { showObject } = this.state;

    return (
      <div>
        <h1>
          {loan.name || 'Demande de Prêt'} - Emprunt de{' '}
          <IntlNumber
            value={getLoanValue({
              loan,
              property: loan.propertyLink,
            })}
            format="money"
          />
        </h1>

        <StepStatus {...dataToPassDown} serverTime={this.state.serverTime} />

        <FileVerificationNotification
          loan={loan}
          borrowers={loan.borrowersLink}
        />
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
  dataToPassDown: PropTypes.arrayOf(PropTypes.object).isRequired,
};
