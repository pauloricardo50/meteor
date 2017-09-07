import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { getMonthlyWithOffer } from '/imports/js/helpers/requestFunctions';
import cleanMethod from '/imports/api/cleanMethods';

import OfferToggle from '/imports/ui/components/general/OfferToggle';
import ConditionsButton from '/imports/ui/components/general/ConditionsButton';
import Table from '/imports/ui/components/general/Table';
import { T, IntlNumber } from '/imports/ui/components/general/Translation';
import { insertAdminAction } from '/imports/api/adminActions/methods';
import track from '/imports/js/helpers/analytics';

const getOffers = (props) => {
  let newOffers = props.offers.map((offer) => {
    if (!props.formState.standard) {
      if (offer.counterparts.length <= 0) {
        // if this offer doesn't have a counterparts offer, return a basic object to be filtered out
        return {
          _id: offer._id,
          conditions: offer.conditions,
          counterparts: offer.counterparts,
        };
      }
    }
    const monthly = getMonthlyWithOffer(
      props.loanRequest,
      offer,
      props.formState.standard,
      props.formState.fortuneUsed,
      props.formState.insuranceFortuneUsed,
      props.formState.loanTranches,
    );

    return {
      _id: offer._id,
      maxAmount: props.formState.standard
        ? offer.standardOffer.maxAmount
        : offer.counterpartOffer.maxAmount,
      monthly,
      conditions: offer.conditions,
      counterparts: props.formState.standard ? [] : offer.counterparts,
    };
  });

  // Sort them by monthly cost
  newOffers.sort((a, b) => a.monthly - b.monthly);

  if (!props.formState.standard) {
    // If this is for the counterparts offers, filter out those that don't have a counterpart offer
    newOffers = newOffers.filter(o => o.counterparts.length > 0);
  }

  return newOffers;
};

const handleSave = (props, offerId) => {
  const object = {};

  object['logic.insuranceUsePreset'] = props.formState.insuranceUsePreset;
  object['logic.amortizationStrategyPreset'] =
    props.formState.amortizationStrategyPreset;
  object['logic.loanStrategyPreset'] = props.formState.loanStrategyPreset;
  object['general.loanTranches'] = props.formState.loanTranches;
  object['logic.lender.offerId'] = offerId;

  cleanMethod('updateRequest', object, props.loanRequest._id).then(() => {
    track('chose a lender', { offerId });
    // This will only be called the first time a lender is chosen
    insertAdminAction.call({
      requestId: props.loanRequest._id,
      type: 'lenderChosen',
    });
  });
};

const handleChoose = (id, props) => {
  if (id === undefined) {
    // TODO: How to handle unselecting? Currently, do not allow a user to unselect his lender
    // props.setFormState('chosenLender', '', () => handleSave(props, ''));
  } else {
    props.setFormState('chosenLender', id, () => handleSave(props, id));
  }
};

const columns = [
  {
    label: '',
    align: 'center',
    style: {
      width: 80,
    },
  },
  {
    id: 'LenderTable.amount',
    align: 'right',
    format: val => <IntlNumber value={val} format="money" />,
  },
  {
    id: 'LenderTable.monthly',
    align: 'right',
    format: val =>
      (<h3 className="fixed-size" style={{ margin: 0 }}>
        <IntlNumber value={val} format="money" />{' '}
        <T id="LenderTable.perMonth" />
      </h3>),
  },
  {
    id: 'LenderTable.conditions',
    align: 'center',
    style: { paddingLeft: 0, paddingRight: 0 },
  },
];

export default class LenderTable extends Component {
  render() {
    // const offers = getOffers(this.props);

    return (
      <div>A Table!</div>
      // <article>
      //   <h2 className="text-c">Les meilleurs prêteurs</h2>
      //   <div className="description">
      //     <p>
      //       Voici les offres que vous avez reçues, vous pouvez modifier les
      //       valeurs en haut pour changer les résultats.
      //     </p>
      //   </div>
      //
      //   <OfferToggle
      //     value={!this.props.formState.standard}
      //     handleToggle={(e, c) => this.props.setFormState('standard', !c)}
      //     offers={this.props.offers}
      //   />
      //
      //   <Table
      //     columns={columns}
      //     rows={offers.map((offer, i) => ({
      //       id: offer._id,
      //       columns: [
      //         i + 1,
      //         offer.maxAmount,
      //         offer.monthly,
      //         offer.conditions.length > 0 || offer.counterparts.length > 0
      //           ? <ConditionsButton
      //             conditions={offer.conditions}
      //             counterparts={offer.counterparts}
      //           />
      //           : '-',
      //       ],
      //     }))}
      //     selectable
      //     onRowSelection={rowIndex =>
      //       handleChoose(
      //         rowIndex !== undefined ? offers[rowIndex]._id : undefined,
      //         this.props,
      //       )}
      //     selected={this.props.formState.chosenLender}
      //   />
      // </article>
    );
  }
}

LenderTable.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
  offers: PropTypes.arrayOf(PropTypes.object).isRequired,
  formState: PropTypes.objectOf(PropTypes.any).isRequired,
  setFormState: PropTypes.func.isRequired,
};
