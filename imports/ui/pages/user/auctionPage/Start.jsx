import React, { PropTypes } from 'react';
import cleanMethod from '/imports/api/cleanMethods';
import CountUp from 'react-countup';

import RaisedButton from 'material-ui/RaisedButton';

const styles = {
  text: {
    textAlign: 'justify',
    padding: 20,
  },
  a: {
    marginBottom: 50,
  },
  formDiv: {
    marginBottom: 40,
    width: '100%',
    display: 'inline-block',
  },
  countUp: {
    display: 'inline-block',
    width: '100%',
    margin: '20px 0',
  },
};

const Start = props => (
  <section className="mask1">
    <h1>Lancez les enchères</h1>
    <h1 className="text-center display2" style={styles.countUp}>
      <CountUp
        className="custom-count"
        start={0}
        end={20}
        duration={3.5}
        useEasing
        separator=" "
        decimal=","
        prefix=""
        suffix=" Prêteurs"
      />
    </h1>
    <a className="bold secondary active text-center col-xs-12" style={styles.a}>
      Voir la liste
    </a>

    {/* <div style={styles.formDiv}>
      <Step2PartnersForm loanRequest={this.props.loanRequest} />
    </div> */}

    <div className="col-xs-12">
      <div className="form-group text-center">
        <RaisedButton
          label="Commencer les enchères"
          primary
          onTouchTap={() =>
            cleanMethod('startAuction', {}, props.loanRequest._id)}
        />
      </div>
      <div className="form-group text-center">
        <RaisedButton
          label="Pas maintenant"
          onTouchTap={() => props.history.push('/app')}
        />
      </div>
    </div>
  </section>
);

Start.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default Start;
