import React, { Component, PropTypes } from 'react';
import cleanMethod from '/imports/api/cleanMethods';


import StrategyCashTable from './StrategyCashTable.jsx';
import MetricsTriple from './MetricsTriple.jsx';


import RaisedButton from 'material-ui/RaisedButton';

const styles = {
  ratioDiv: {
    margin: '40px 0',
  },
  button: {
    marginTop: 50,
    marginBottom: 80,
  },
};

export default class StrategyCash extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    const id = this.props.loanRequest._id;
    const object = { 'logic.hasValidatedCashStrategy': true };

    cleanMethod('update', id, object);
  }


  render() {
    return (
      <section>
        <h2>
          Ma Stratégie de Fonds Propres
          &nbsp;
          {this.props.loanRequest.logic.hasValidatedCashStrategy &&
            <span className="fa fa-check success" />
          }
        </h2>

        <div className="description">
          <p>
            Vérifiez vos fonds propres, et lorsque vous êtes satisfait, validez les. Vous ne pourrez
            plus changer votre choix après l&apos;appel d&apos;offres.
          </p>
        </div>

        <div className="text-center" style={styles.button}>
          <RaisedButton
            label="Valider"
            primary={!this.props.loanRequest.logic.hasValidatedCashStrategy}
            onTouchTap={this.handleClick}
          />
        </div>

        <StrategyCashMetrics loanRequest={this.props.loanRequest} />

        <StrategyCashTable loanRequest={this.props.loanRequest} />

      </section>
    );
  }
}

StrategyCash.propTypes = {
  loanRequest: React.PropTypes.objectOf(React.PropTypes.any),
};
