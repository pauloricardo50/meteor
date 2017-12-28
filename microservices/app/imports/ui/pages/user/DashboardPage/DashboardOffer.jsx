import React from 'react';
import PropTypes from 'prop-types';

import { T, IntlNumber } from 'core/components/Translation';
import ConditionsButton from '/imports/ui/components/general/ConditionsButton';
import DashboardItem from './DashboardItem';

const DashboardOffer = (props) => {
  const { offers, loanRequest } = props;
  const offer = offers.find(o => o._id === loanRequest.logic.lender.offerId);
  const displayedOffer =
    loanRequest.logic.lender.type === 'counterparts'
      ? offer.counterpartOffer
      : offer.standardOffer;

  return (
    <DashboardItem title={<T id="DashboardOffer.title" />}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {Object.keys(displayedOffer).map(key => (
          <div
            style={{ display: 'flex', justifyContent: 'space-between' }}
            key={key}
          >
            <span>
              <T id={`offer.${key}`} />
            </span>
            <span>
              <IntlNumber
                value={displayedOffer[key]}
                format={key === 'maxAmount' ? 'money' : 'percentage'}
              />
            </span>
          </div>
        ))}
      </div>
      <div className="text-center" style={{ marginTop: 16 }}>
        <ConditionsButton
          conditions={offer.conditions}
          counterparts={offer.counterparts}
        />
      </div>
    </DashboardItem>
  );
};

DashboardOffer.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
  offers: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default DashboardOffer;
