import PropTypes from 'prop-types';
import React from 'react';

import {
  getAmortization,
  getInterests,
} from '/imports/js/helpers/finance-math';
import { toMoney } from '/imports/js/helpers/conversionFunctions';
import colors from '/imports/js/config/colors';
import { IntlNumber } from '/imports/ui/components/general/Translation';

const styles = {
  topDiv: {
    width: 'calc(100% + 40px)',
    height: 300,
    backgroundColor: colors.primary,
    color: 'white',
    display: 'table',
    marginLeft: -20,
    marginTop: -20,
  },
  tableCell: {
    display: 'table-cell',
    verticalAlign: 'middle',
  },
  largeH1: {
    fontSize: '4em',
    marginTop: 0,
    display: 'inline',
  },
  loanPercent: {
    display: 'inline',
  },
};

const types = {
  primary: 'Principale',
  secondary: 'Secondaire',
  investment: 'Investissement',
};

const getRatio = (props) => {
  const { amortization } = getAmortization(props.loanRequest, props.borrowers);
  const interests = getInterests(props.loanRequest);
  const maintenance = props.loanRequest.property.value * 0.01 / 12;

  const ratio =
    (amortization + interests + maintenance) /
    (props.loanRequest.general.incomeUsed / 12);

  return ratio;
};

const RequestDetails = (props) => {
  const r = props.loanRequest;
  const loan =
    r.property.value - r.general.fortuneUsed - r.general.insuranceFortuneUsed;
  return (
    <article style={styles.article}>
      <div style={styles.topDiv}>
        <span style={styles.tableCell} className="text-center">
          <h2>Demande:</h2>
          <h1 className="bold" style={styles.largeH1}>
            CHF {toMoney(loan)}
          </h1>
          <h3 style={styles.loanPercent}>
            {' '}
            (<IntlNumber value={loan / r.property.value} format="percentage" />)
          </h3>
          <h4>Propriété: CHF {toMoney(r.property.value)}</h4>
        </span>
      </div>
      <div className="col-xs-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3">
        <h3>Détails du Projet</h3>

        <div className="col-xs-12">
          <h4 className="pull-left">Propriété</h4>
          <h4 className="pull-right">CHF {toMoney(r.property.value)}</h4>
          <br />
        </div>
        <div className="col-xs-12">
          <h4 className="pull-left">Prêt voulu</h4>
          <h4 className="pull-right">CHF {toMoney(loan)}</h4>
        </div>
        <div className="col-xs-12">
          <h4 className="pull-left">Fortune</h4>
          <h4 className="pull-right">CHF {toMoney(r.general.fortuneUsed)}</h4>
        </div>
        <div className="col-xs-12">
          <h4 className="pull-left">2e pilier</h4>
          <h4 className="pull-right">
            CHF {toMoney(r.general.insuranceFortuneUsed)}
          </h4>
        </div>
        <div className="col-xs-12">
          <h4 className="pull-left">Revenus annuels</h4>
          <h4 className="pull-right">CHF {toMoney(r.general.incomeUsed)}</h4>
        </div>
        <div className="col-xs-12">
          <h4 className="pull-left">Ratio</h4>
          <h4 className="pull-right">
            <IntlNumber value={getRatio(props)} format="percentage" />
          </h4>
        </div>
        <div className="col-xs-12">
          <h4 className="pull-left">Age</h4>
          <h4 className="pull-right">{r.borrowers[0].age}</h4>
        </div>
        <div className="col-xs-12">
          <h4 className="pull-left">Résidence de type</h4>
          <h4 className="pull-right">{types[r.general.usageType]}</h4>
        </div>
      </div>
    </article>
  );
};

RequestDetails.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
  borrowers: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default RequestDetails;
