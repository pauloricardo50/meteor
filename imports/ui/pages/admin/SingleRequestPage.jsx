import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';
import { _ } from 'lodash';

import RaisedButton from 'material-ui/RaisedButton';

import ProjectPieChart from '/imports/ui/components/charts/ProjectPieChart.jsx';
import AdminNewOffer from '/imports/ui/components/admin/AdminNewOffer.jsx';
import Recap from '/imports/ui/components/general/Recap';

import { toMoney } from '/imports/js/helpers/conversionFunctions';
import adminActions from '/imports/js/helpers/adminActions';
import { getLoanValue } from '/imports/js/helpers/requestFunctions';

const styles = {
  actions: {
    margin: '80px 0',
  },
  returnButton: {
    marginBottom: 20,
  },
  recapDiv: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: '0 20px',
  },
};

const renderObject = (key, obj) => {
  const value = obj[key];
  const stringKey = _.startCase(key);

  switch (typeof value) {
    case 'object':
      if (Object.keys(value).length === 0) {
        return null;
      } else if (value.getMonth) {
        return (
          <li>
            <h3>{stringKey}</h3>
            <p>{moment(value).format('D MMM hh:mm:ss')}</p>
          </li>
        );
      }

      return (
        <div key={key}>
          <h2>{stringKey}</h2>
          <ul>
            {Object.keys(value).map(k => renderObject(k, value))}
          </ul>
        </div>
      );
    case 'number':
      return (
        <li key={key}>
          <h3>{stringKey}</h3>
          {value > 10000 ? <p>{`CHF ${toMoney(value)}`}</p> : <p>{`${value}`}</p>}
        </li>
      );
    default:
      return (
        <li key={key}>
          <h3>{stringKey}</h3>
          <p>{`${value}`}</p>
        </li>
      );
  }
};

const AdminSingleRequestPage = props => {
  const actions = adminActions(props.loanRequest, props);
  console.log(actions);
  return (
    <div>
      <RaisedButton
        label="Retour"
        style={styles.returnButton}
        onTouchTap={() => props.history.push('/admin/requests')}
      />
      <section className="mask1">
        <h1>
          {props.loanRequest.name || 'Demande de Prêt'} - Emprunt de CHF&nbsp;
          {toMoney(getLoanValue(props.loanRequest))}
        </h1>

        <div className="text-center" style={styles.actions}>
          {actions.length > 0
            ? actions.map((action, i) => (
              <div key={i} className="form-group">
                <RaisedButton label={action.label} onClick={action.handleClick} primary />
              </div>
              ))
            : <h2 className="secondary">Aucune action à prendre</h2>}
        </div>

        <ProjectPieChart loanRequest={props.loanRequest} />

        <div style={styles.recapDiv}>
          <Recap {...props} arrayName="dashboard" />
        </div>

        <hr />

        {props.borrowers.map((b, i) => (
          <div style={styles.recapDiv} key={b._id}>
            <h2 className="fixed-size">{b.firstName || `Emprunteur ${i + 1}`}</h2>
            <Recap {...props} arrayName="borrower" borrower={b} />
          </div>
        ))}

        <hr />

        <ul className="request-map">
          {Object.keys(props.loanRequest).map(key => renderObject(key, props.loanRequest))}
        </ul>

      </section>
    </div>
  );
};

AdminSingleRequestPage.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
  borrowers: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default AdminSingleRequestPage;
