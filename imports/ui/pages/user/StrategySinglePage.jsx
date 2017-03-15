import React, { PropTypes } from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';

import StrategyCash from '/imports/ui/components/general/StrategyCash.jsx';
import StrategyLoan from '/imports/ui/components/general/StrategyLoan.jsx';
import StrategyAmortization
  from '/imports/ui/components/general/StrategyAmortization.jsx';

import RaisedButton from 'material-ui/RaisedButton';

const styles = {
  backButton: {
    marginBottom: 20,
  },
  bottomButton: {
    marginTop: 20,
  },
};

const StrategySinglePage = props => {
  const id = FlowRouter.getParam('id');
  let Comp = 'div';

  switch (id) {
    case 'cash':
      Comp = StrategyCash;
      break;
    case 'loan':
      Comp = StrategyLoan;
      break;
    case 'amortizing':
      Comp = StrategyAmortization;
      break;
    default:
      break;
  }
  return (
    <div>
      <div>
        <span className="animated fadeInLeft">
          <RaisedButton
            label="retour"
            href="/strategy"
            style={styles.backButton}
          />
        </span>
        <span className="pull-right">
          <RaisedButton
            label="Ok"
            href="/strategy"
            style={styles.backButton}
            primary
          />
        </span>
      </div>
      <section className="mask1 animated fadeIn">
        <Comp loanRequest={props.loanRequest} />
      </section>
      <span className="pull-right">
        <RaisedButton
          label="Ok"
          href="/strategy"
          style={styles.bottomButton}
          primary
        />
      </span>
    </div>
  );
};

StrategySinglePage.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any),
};

export default StrategySinglePage;
