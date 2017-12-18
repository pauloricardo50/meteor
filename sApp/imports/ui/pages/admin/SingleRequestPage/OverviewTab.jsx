import React from 'react';
import PropTypes from 'prop-types';

import Button from 'core/components/Button';

import ProjectPieChart from '/imports/ui/components/charts/ProjectPieChart';
import Recap from 'core/components/Recap';
import renderObject from '/imports/js/helpers/renderObject';

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
    const { loanRequest, borrowers } = this.props;
    const { showObject } = this.state;

    return (
      <div>
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
              this.setState(prev => ({ showObject: !prev.showObject }))}
          />
        </div>
        {showObject && (
          <ul className="request-map">
            {Object.keys(loanRequest).map(key =>
              renderObject(key, loanRequest),
            )}
          </ul>
        )}
      </div>
    );
  }
}

OverviewTab.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
  borrowers: PropTypes.arrayOf(PropTypes.object).isRequired,
};
