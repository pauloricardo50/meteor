import PropTypes from 'prop-types';
import React from 'react';
import cleanMethod from '/imports/api/cleanMethods';
import CountUp from 'react-countup';

import RaisedButton from 'material-ui/RaisedButton';
import { getLenderCount } from '/imports/js/helpers/requestFunctions';

import AuctionForm from './AuctionForm.jsx';
import ConfirmButton from '/imports/ui/components/general/ConfirmButton.jsx';

import { isDemo } from '/imports/js/helpers/browserFunctions';

const styles = {
  text: {
    textAlign: 'justify',
    padding: 20,
  },
  a: {
    marginBottom: 50,
    width: '100%',
    display: 'inline-block',
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

const Start = props => {
  const lenderCount = getLenderCount(props.loanRequest, props.borrowers);
  const r = props.loanRequest;
  return (
    <section className="mask1">
      <h1>Lancez les enchères</h1>
      <h1 className="text-center display2" style={styles.countUp}>
        <CountUp
          className="custom-count"
          start={0}
          end={lenderCount}
          duration={3.5}
          useEasing
          separator=" "
          decimal=","
          prefix=""
          suffix=" Prêteurs"
        />
      </h1>
      <a className="bold secondary active text-center" style={styles.a}>
        <span>Voir la liste</span>
      </a>

      <div className="description">
        <p>
          Durant les enchères, les
          {' '}
          {lenderCount}
          {' '}
          prêteurs vont entrer en compétition sur votre dossier. Ils aurant 2 fois 24 heures pour miser avec un taux d'intérêt sur votre projet.
          {' '}
          Puis, dans 2 jours ouvrables, vous recevrez un tableau avec toutes les offres.
        </p>
      </div>

      <div style={{ marginBottom: 40 }}>
        <AuctionForm {...props} />
      </div>

      <div className="col-xs-12">
        <div className="form-group text-center">
          <ConfirmButton
            label="Commencer les enchères"
            primary
            handleClick={() =>
              cleanMethod('startAuction', { isDemo: isDemo() }, props.loanRequest._id)}
            disabled={!(r.logic.auction.mostImportant && r.general.wantedClosingDate)}
          />
        </div>
        <div className="form-group text-center">
          <RaisedButton label="Pas maintenant" onTouchTap={() => props.history.push('/app')} />
        </div>
      </div>
    </section>
  );
};

Start.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
  borrowers: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Start;
