import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import { _ } from 'lodash';

import RaisedButton from 'material-ui/RaisedButton';

import ProjectPieChart from '/imports/ui/components/charts/ProjectPieChart.jsx';
import AdminNewOffer from '/imports/ui/components/admin/AdminNewOffer.jsx';

import { toMoney } from '/imports/js/helpers/conversionFunctions';
import adminActions from '/imports/js/helpers/adminActions';

const styles = {
  actions: {
    margin: '80px 0',
  },
  returnButton: {
    marginBottom: 20,
  },
};

export default class AdminSingleRequestPage extends Component {
  constructor(props) {
    super(props);
  }

  renderObject(key, obj) {
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
              {Object.keys(value).map(k => this.renderObject(k, value))}
            </ul>
          </div>
        );
      case 'number':
        return (
          <li key={key}>
            <h3>{stringKey}</h3>
            {value > 10000
              ? <p>{`CHF ${toMoney(value)}`}</p>
              : <p>{`${value}`}</p>}
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
  }

  render() {
    return (
      <div>
        <RaisedButton label="Retour" />
        <section className="mask1">
          <h1>
            {this.props.loanRequest.property.address1} - CHF&nbsp;
            {toMoney(this.props.loanRequest.property.value)}
          </h1>

          <div className="text-center" style={styles.actions}>
            {adminActions(this.props.loanRequest).length > 0
              ? adminActions(this.props.loanRequest).map(action => (
                  <div key={action.name} className="form-group">
                    <RaisedButton
                      label={action.name}
                      onClick={action.handleClick}
                      primary
                    />
                  </div>
                ))
              : <h2 className="secondary">Aucune action à prendre</h2>}
          </div>

          <ProjectPieChart loanRequest={this.props.loanRequest} />

          <ul className="request-map">
            {Object.keys(this.props.loanRequest).map(key =>
              this.renderObject(key, this.props.loanRequest))}
          </ul>

        </section>
      </div>
    );
  }
}

AdminSingleRequestPage.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
  user: PropTypes.objectOf(PropTypes.any).isRequired,
};
