import React, { PropTypes } from 'react';

import RaisedButton from 'material-ui/RaisedButton';

import ProjectPieChart from '/imports/ui/components/charts/ProjectPieChart.jsx';
import Recap from '/imports/ui/components/general/Recap';
import renderObject from '/imports/js/helpers/renderObject';

const styles = {
  recapDiv: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: '0 20px',
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
        <ProjectPieChart loanRequest={this.props.loanRequest} />

        <div style={styles.recapDiv}>
          <Recap {...this.props} arrayName="dashboard" />
        </div>

        <hr />

        {this.props.borrowers.map((b, i) => (
          <div style={styles.recapDiv} key={b._id}>
            <h2 className="fixed-size">{b.firstName || `Emprunteur ${i + 1}`}</h2>
            <Recap {...this.props} arrayName="borrower" borrower={b} />
          </div>
        ))}

        <hr />

        <RaisedButton
          label={this.state.showObject ? 'Masquer' : 'Afficher détails'}
          onTouchTap={() => this.setState(prev => ({ showObject: !prev.showObject }))}
        />
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
