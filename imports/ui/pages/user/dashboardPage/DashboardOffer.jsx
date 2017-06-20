import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { T, IntlNumber } from '/imports/ui/components/general/Translation.jsx';
import OfferToggle from '/imports/ui/components/general/OfferToggle.jsx';
import ConditionsButton from '/imports/ui/components/general/ConditionsButton.jsx';
import DashboardItem from './DashboardItem.jsx';

export default class DashboardOffer extends Component {
  constructor(props) {
    super(props);
    const offerId = this.props.loanRequest.logic.lender.offerId;
    const offer = this.props.offers.find(o => o._id === offerId);

    this.state = { toggle: false, offer };
  }

  handleToggle = () => this.setState(prev => ({ toggle: !prev.toggle }));

  renderButton = () => {
    const { toggle, offer } = this.state;

    if (!toggle && offer.conditions && offer.conditions.length) {
      // If showing conditions

      return (
        <div className="text-center" style={{ marginTop: 16 }}>
          <ConditionsButton conditions={offer.conditions} counterparts={offer.counterparts} />
        </div>
      );
    } else if (
      toggle &&
      ((offer.conditions && offer.conditions.length) ||
        (offer.counterparts && offer.counterparts.length))
    ) {
      return (
        <div className="text-center" style={{ marginTop: 16 }}>
          <ConditionsButton conditions={offer.conditions} counterparts={offer.counterparts} />
        </div>
      );
    }

    return null;
  };

  render() {
    const { toggle, offer } = this.state;

    const displayedOffer = this.state.toggle ? offer.counterpartOffer : offer.standardOffer;

    return (
      <DashboardItem title={<T id="DashboardOffer.title" />}>
        <OfferToggle
          value={this.state.toggle}
          handleToggle={this.handleToggle}
          offers={this.props.offers}
          short
        />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {Object.keys(displayedOffer).map(key =>
            <div style={{ display: 'flex', justifyContent: 'space-between' }} key={key}>
              <span><T id={`offer.${key}`} /></span>
              <span>
                <IntlNumber
                  value={displayedOffer[key]}
                  format={key === 'maxAmount' ? 'money' : 'percentage'}
                />
              </span>
            </div>,
          )}
        </div>
        {this.renderButton()}
      </DashboardItem>
    );
  }
}

DashboardOffer.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
  offers: PropTypes.arrayOf(PropTypes.object).isRequired,
};
