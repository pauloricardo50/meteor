import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import ConditionsButton from 'core/components/ConditionsButton';
import { toMoney } from 'core/utils/conversionFunctions';
import { IntlNumber } from 'core/components/Translation';
import ConfirmMethod from 'core/components/ConfirmMethod';
import { deleteOffer } from 'core/api';

import AdminNewOffer from '../../../components/AdminNewOffer';

export default class OffersTab extends Component {
  constructor(props) {
    super(props);

    this.state = { active: -1 };
  }

  handleToggle = i =>
    this.setState(({ active }) => ({ active: active === i ? -1 : i }));

  render() {
    const { offers } = this.props;
    const { active } = this.state;

    if (offers.length <= 0) {
      return (
        <div className="text-center">
          <h1 className="secondary">Pas d&apos;offres pour l&apos;instant</h1>
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
          {offers.map((
            {
              organization,
              conditions,
              counterparts,
              createdAt,
              _id,
              counterpartOffer,
              standardOffer,
            },
            i,
          ) => (
            <li className="mask1" key={_id}>
              <div
                className="top"
                onClick={() => this.handleToggle(i)}
                onKeyPress={() => this.handleToggle(i)}
              >
                <div className="title">
                  <h2 className="fixed-size">
                    <span className="bold">{organization}</span>{' '}
                    <small>
                        Ajoutée le {moment(createdAt).format('D MMM à H:mm')}
                    </small>
                  </h2>
                  {(conditions.length > 0 || counterparts.length > 0) && (
                    <ConditionsButton
                      conditions={conditions}
                      counterparts={counterparts}
                    />
                  )}
                </div>

                <hr />
                <h4 className="fixed-size" style={{ marginTop: 0 }}>
                    Offre Standard
                </h4>
                <span>
                    Montant prêté: CHF {toMoney(standardOffer.maxAmount)}
                </span>
                <span>
                    Amortissement demandé:{' '}
                  <IntlNumber
                    value={standardOffer.amortization}
                    format="percentage"
                  />
                </span>
                <ul className="overview">
                  {Object.keys(standardOffer).map(key =>
                    key.includes('interest') &&
                        !!standardOffer[key] && (
                      <li key={key}>
                          <span>{key}</span>
                          <span className="bold">
                          <IntlNumber
                              value={standardOffer[key]}
                              format="percentage"
                            />
                        </span>
                        </li>
                    ))}
                </ul>
                {counterparts.length > 0 && (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <hr />
                    <h4 className="fixed-size" style={{ marginTop: 0 }}>
                        Offre avec contrepartie
                    </h4>
                    <span>
                        Montant prêté: CHF {toMoney(counterpartOffer.maxAmount)}
                    </span>
                    <span>
                        Amortissement demandé:{' '}
                      <IntlNumber
                        value={counterpartOffer.amortization}
                        format="percentage"
                      />
                    </span>
                    <ul className="overview">
                      {Object.keys(counterpartOffer).map(key =>
                        key.includes('interest') &&
                            !!counterpartOffer[key] && (
                          <li key={key}>
                              <span>{key}</span>
                              <span className="bold">
                              <IntlNumber
                                  value={counterpartOffer[key]}
                                  format="percentage"
                                />
                            </span>
                            </li>
                        ))}
                    </ul>
                  </div>
                )}
              </div>
              {active === i && (
                <div>
                  <ConfirmMethod
                    label="Supprimer"
                    keyword="SUPPRIMER"
                    method={cb => deleteOffer.run({ id: _id }).then(cb)}
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
