import React, { Component, PropTypes } from 'react';

import RaisedButton from 'material-ui/RaisedButton';


import FinanceStrategyPicker from '/imports/ui/components/general/FinanceStrategyPicker.jsx';


const styles = {
  backButton: {
    marginBottom: 32,
  },
  section: {
    // paddingBottom: 40,
  },
  title: {
    paddingBottom: 40,
  },
  article: {
    marginBottom: 40,
  },
  choice: {
    display: 'inline-block',
    padding: 20,
    minWidth: 200,
  },
  icon: {
    paddingBottom: 20,
    color: '#D8D8D8',
  },
  picker: {
    marginTop: 40,
    display: 'inline-block',
  },
};

export default class StrategyPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <RaisedButton
          style={styles.backButton}
          label="Retour"
          href="/finance"
        />
        <section className="mask1" style={styles.section}>
          <h1 style={styles.title}>Choisir ma Stratégie de Taux</h1>

          <article className="col-xs-6 text-center" style={styles.article}>
            <div className="mask2 hover-rise" style={styles.choice}>
              <span className="fa fa-magic fa-5x" style={styles.icon} />
              <h4>Mode Automatique</h4>
            </div>
          </article>
          <article className="col-xs-6 text-center" style={styles.article}>
            <div className="mask2 hover-rise" style={styles.choice}>
              <span className="fa fa-sliders fa-5x" style={styles.icon} />
              <h4>Mode Manuel</h4>
            </div>
          </article>

          <FinanceStrategyPicker creditRequest={this.props.creditRequest} style={styles.picker} />

        </section>
      </div>
    );
  }
}

StrategyPage.propTypes = {
  creditRequest: React.PropTypes.objectOf(React.PropTypes.any),
};
