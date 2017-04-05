import React, { PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import Scroll from 'react-scroll';
import CountUp from 'react-countup';

import RaisedButton from 'material-ui/RaisedButton';
import ExpensesChartInterests
  from '/imports/ui/components/charts/ExpensesChartInterests.jsx';
import Start2Recap from './Start2Recap.jsx';

import constants from '/imports/js/config/constants';
import { toMoney } from '/imports/js/helpers/conversionFunctions';
import { saveStartForm } from '/imports/js/helpers/startFunctions';

const handleClick = ({ formState, setFormState, currentUser, history }) => {
  if (currentUser) {
    saveStartForm(formState, history);
    return;
  }
  setFormState('done', true, () => {
    const options = {
      duration: 350,
      delay: 0,
      smooth: true,
      ignoreCancelEvents: true,
    };
    Meteor.defer(() => Scroll.scroller.scrollTo('done', options));
  });
};

const StartResult = props => {
  const loan = props.project - props.fortuneUsed;

  return (
    <article className="mask1 start-result">
      <h1>Résultat: <span className="success">Excellent</span></h1>

      <h1 className="text-center display2" style={{ margin: '40px 0' }}>
        <CountUp
          className="custom-count"
          start={0}
          end={props.lenderCount}
          duration={5}
          useEasing
          separator=" "
          decimal=","
          prefix=""
          suffix=" Prêteurs"
        />
      </h1>

      <div className="description">
        <p>
          Vous êtes éligible pour e-Potek. Continuez en bas pour vous créer un compte et nous mettrons
          {' '}
          {props.lenderCount}
          {' '}
          prêteurs en compétition pour votre dossier.
        </p>
      </div>

      <div className="content">
        <Start2Recap {...props} />
        <div className="chart">
          <h3>
            Votre emprunt: <span className="active">CHF {toMoney(loan)}</span>
          </h3>
          <ExpensesChartInterests
            loan={loan}
            amortizing={loan * constants.amortizing / 12}
            maintenance={props.propAndWork * constants.maintenanceReal / 12}
          />
        </div>
      </div>

      <div className="buttons">
        <RaisedButton
          label="Modifier"
          onTouchTap={() =>
            Scroll.animateScroll.scrollToTop({ smooth: true, duration: 1000 })}
          style={{ marginRight: 8 }}
        />
        <RaisedButton
          label="Continuer"
          onTouchTap={() => handleClick(props)}
          primary
        />
      </div>
    </article>
  );
};

StartResult.defaultProps = {
  propAndWork: 0,
  fortuneUsed: 0,
  project: 0,
  lenderCount: 0,
};

StartResult.propTypes = {
  propAndWork: PropTypes.number,
  project: PropTypes.number,
  fortuneUsed: PropTypes.number,
  lenderCount: PropTypes.number,
};

export default StartResult;
