import React, { PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import Scroll from 'react-scroll';

import RaisedButton from 'material-ui/RaisedButton';
import ExpensesChart from '/imports/ui/components/charts/ExpensesChart.jsx';
import Start2Recap from './Start2Recap.jsx';

import constants from '/imports/js/config/constants';
import { toMoney } from '/imports/js/helpers/conversionFunctions';

const handleClick = ({ setFormState }) => {
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

      <div className="content">
        <Start2Recap {...props} />
        <div className="chart">
          <h3>
            Votre emprunt: <span className="active">CHF {toMoney(loan)}</span>
          </h3>
          <ExpensesChart
            interests={loan * constants.interestsReal / 12}
            amortizing={loan * constants.amortizing / 12}
            maintenance={props.propAndWork * constants.maintenanceReal / 12}
          />
        </div>
      </div>

      <div className="button">
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
};

StartResult.propTypes = {
  propAndWork: PropTypes.number,
  fortuneUsed: PropTypes.number,
};

export default StartResult;
