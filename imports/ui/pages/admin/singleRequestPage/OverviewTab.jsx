import React from 'react';
import PropTypes from 'prop-types';

import Button from '/imports/ui/components/general/Button.jsx';

import ProjectPieChart from '/imports/ui/components/charts/ProjectPieChart.jsx';
import Recap from '/imports/ui/components/general/Recap';
import renderObject from '/imports/js/helpers/renderObject';

const styles = {
  recapDiv: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    // margin: '0 20px',
  },
};

export default class OverviewTab extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showObject: false,
    };
  }

  render() {
    return (
      <div>
        <div className="container" style={{ width: '100%' }}>
          <div className="row">
            <div style={styles.recapDiv} className="col-md-6">
              <h2 className="fixed-size">Récapitulatif</h2>
              <Recap {...this.props} arrayName="dashboard" />
            </div>

            <div className="col-md-6">
              {this.props.borrowers.map((b, i) => (
                <div style={styles.recapDiv} key={b._id}>
                  <h2 className="fixed-size">{b.firstName || `Emprunteur ${i + 1}`}</h2>
                  <Recap {...this.props} arrayName="borrower" borrower={b} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <hr />

        <div className="text-center">
          <Button raised
            label={this.state.showObject ? 'Masquer' : 'Afficher détails'}
            onTouchTap={() => this.setState(prev => ({ showObject: !prev.showObject }))}
          />
        </div>
        {this.state.showObject &&
          <ul className="request-map">
            {Object.keys(this.props.loanRequest).map(key =>
              renderObject(key, this.props.loanRequest),
            )}
          </ul>}
      </div>
    );
  }
}

OverviewTab.propTypes = {};
