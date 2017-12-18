import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import AdminNewOffer from '/imports/ui/components/admin/AdminNewOffer';
import ConfirmMethod from './ConfirmMethod';
import { deleteOffer } from 'core/api/offers/methods';
import ConditionsButton from '/imports/ui/components/general/ConditionsButton';
import { toMoney } from 'core/utils/conversionFunctions';
import { IntlNumber } from '/imports/ui/components/general/Translation';

export default class OffersTab extends Component {
  constructor(props) {
    super(props);

    this.state = {
      active: -1,
    };
  }

  handleToggle = (i) => {
    if (this.state.active === i) {
      this.setState({ active: -1 });
    } else {
      this.setState({ active: i });
    }
  };

  render() {
    if (this.props.offers.length <= 0) {
      return (
        <div className="text-center">
          <h1 className="secondary">Pas d'offres pour l'instant</h1>
          <AdminNewOffer {...this.props} />
        </div>
      );
    }

    return (
      <div>
        <div className="text-center">
          <AdminNewOffer {...this.props} style={{ margin: 8 }} />
        </div>
        <ul className="admin-offer-list">
          {this.props.offers.map((o, i) => (
            <li className="mask1" key={o._id}>
              <div className="top" onClick={() => this.handleToggle(i)}>
                <div className="title">
                  <h2 className="fixed-size">
                    <span className="bold">{o.organization}</span>{' '}
                    <small>
                      Ajoutée le {moment(o.createdAt).format('D MMM à H:mm')}
                    </small>
                  </h2>
                  {(o.conditions.length > 0 || o.counterparts.length > 0) && (
                    <ConditionsButton
                      conditions={o.conditions}
                      counterparts={o.counterparts}
                    />
                  )}
                </div>

                <hr />
                <h4 className="fixed-size" style={{ marginTop: 0 }}>
                  Offre Standard
                </h4>
                <span>
                  Montant prêté: CHF {toMoney(o.standardOffer.maxAmount)}
                </span>
                <span>
                  Amortissement demandé:{' '}
                  <IntlNumber
                    value={o.standardOffer.amortization}
                    format="percentage"
                  />
                </span>
                <ul className="overview">
                  {Object.keys(o.standardOffer).map(
                    key =>
                      key.includes('interest') &&
                      !!o.standardOffer[key] && (
                        <li key={key}>
                          <span>{key}</span>
                          <span className="bold">
                            <IntlNumber
                              value={o.standardOffer[key]}
                              format="percentage"
                            />
                          </span>
                        </li>
                      ),
                  )}
                </ul>
                {o.counterparts.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <hr />
                    <h4 className="fixed-size" style={{ marginTop: 0 }}>
                      Offre avec contrepartie
                    </h4>
                    <span>
                      Montant prêté: CHF {toMoney(o.counterpartOffer.maxAmount)}
                    </span>
                    <span>
                      Amortissement demandé:{' '}
                      <IntlNumber
                        value={o.counterpartOffer.amortization}
                        format="percentage"
                      />
                    </span>
                    <ul className="overview">
                      {Object.keys(o.counterpartOffer).map(
                        key =>
                          key.includes('interest') &&
                          !!o.counterpartOffer[key] && (
                            <li key={key}>
                              <span>{key}</span>
                              <span className="bold">
                                <IntlNumber
                                  value={o.counterpartOffer[key]}
                                  format="percentage"
                                />
                              </span>
                            </li>
                          ),
                      )}
                    </ul>
                  </div>
                )}
              </div>
              {this.state.active === i && (
                <div>
                  <ConfirmMethod
                    label="Supprimer"
                    keyword="SUPPRIMER"
                    method={cb => deleteOffer.call({ id: o._id }, cb)}
                  />
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

OffersTab.propTypes = {
  offers: PropTypes.arrayOf(PropTypes.object),
};

OffersTab.defaultProps = {
  offers: [],
};
