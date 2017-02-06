import React, { Component, PropTypes } from 'react';

import RaisedButton from 'material-ui/RaisedButton';


const styles = {
  topText: {
    display: 'inline-block',
    padding: '40px 20px',
  },
  description: {
    lineHeight: '1.5em',
  },
  callButton: {
    display: 'block',
    width: '100%',
    marginTop: 40,
    marginBottom: 40,
  },
  choiceDiv: {
    display: 'inline-block',
    width: '100%',
    marginBottom: 40,
  },
  choice: {
    position: 'relative',
    padding: 0,
    marginBottom: 32,
  },
  list: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  title: {
    padding: '20px 10px',
    borderBottom: '1px solid #eee',
    backgroundColor: '#4A90E2',
    color: 'white',
  },
  reason: {
    padding: 20,
    borderBottom: '1px solid #eee',
  },
  button: {
    padding: 20,
    borderBottom: 'none',
  },
};

export default class StrategyAmortization extends Component {
  getChoices() {
    return [
      {
        title: 'Amortissement Direct',
        reasons: [
          'Paiements diminuent avec les années',
          'Charge fiscale augmente',
          <span>&nbsp;</span>,
        ],
      }, {
        title: 'Amortissement Indirect',
        reasons: [
          'Paiements ne changent pas avec les années',
          'Charge fiscale minimale',
          'Établissement d\'un 3e pilier',
        ],
      },
    ];
  }


  renderChoice(choice, index) {
    return (
      <article
        // className="col-sm-6 col-md-4 col-md-offset-2 mask2"
        className={
          index === 0 ? 'col-xs-8 col-xs-offset-2 col-sm-5 col-sm-offset-0 col-md-4 col-md-offset-1 mask2 text-center' :
            'col-xs-8 col-xs-offset-2 col-sm-5 col-sm-offset-2 col-md-4 col-md-offset-2 mask2 text-center'
        }
        style={styles.choice}
        key={index}
      >
        <ul style={styles.list}>

          <li style={styles.title}><h4 className="bold">{choice.title}</h4></li>

          {choice.reasons.map((reason, i) =>
            <li key={i} style={styles.reason}>{reason}</li>,
          )}

          <li style={styles.button}><RaisedButton primary label="Choisir" /></li>

        </ul>
      </article>
    );
  }


  render() {
    return (
      <section>
        <h1>Ma Stratégie d&apos;Amortissement</h1>

        <div
          className="col-xs-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3"
          style={styles.topText}
        >
          <h4 style={styles.description}>
            Choisir comment amortir son bien immobilier peut avoir des conséquences très
            importantes pour votre futur. N&apos;hésitez pas à nous appeler pour prendre cette
            décision en toute confiance.
          </h4>
          <span className="text-center" style={styles.callButton}>
            <RaisedButton primary label="Appeler un expert" />
          </span>
        </div>

        <div style={styles.choiceDiv}>
          {this.getChoices().map((choice, index) => (this.renderChoice(choice, index)))}
        </div>

      </section>
    );
  }
}

StrategyAmortization.propTypes = {
};
