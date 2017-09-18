import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { T, IntlNumber } from '/imports/ui/components/general/Translation';
import ConditionsButton from '/imports/ui/components/general/ConditionsButton';
import { getMonthlyWithExtractedOffer } from '/imports/js/helpers/requestFunctions';

const values = (loanRequest, offer) => {
  const monthly = getMonthlyWithExtractedOffer(loanRequest, offer);
  return [
    { key: 'maxAmount', format: 'money' },
    {
      id: 'monthly',
      value: (
        <span>
          <IntlNumber value={monthly} format="money" />{' '}
          <span className="secondary">
            {' '}
            <T id="general.perMonth" />
          </span>
        </span>
      ),
    },
    { key: 'amortization', format: 'percentage' },
    { key: 'interestLibor', format: 'percentage' },
    { key: 'interest1', format: 'percentage' },
    { key: 'interest2', format: 'percentage' },
    { key: 'interest5', format: 'percentage' },
    { key: 'interest10', format: 'percentage' },
    {
      component: (
        <ConditionsButton
          conditions={offer.conditions}
          counterparts={offer.counterparts}
        />
      ),
    },
  ];
};

const styles = {
  item: {
    width: '25%',
    minWidth: 120,
    padding: 8,
  },
};

const Offer = ({ loanRequest, offer, chosen, handleSave, disabled }) => (
  <div
    className={classNames({ 'choice flex center': true, chosen, disabled })}
    style={{ flexWrap: 'nowrap', padding: 0 }}
    onClick={() =>
      (disabled ? {} : handleSave(chosen ? '' : offer.id, offer.type))}
  >
    <h3 style={{ margin: 0, padding: 16 }}>{offer.organization}</h3>
    <div className="flex" style={{ flexWrap: 'wrap' }}>
      {values(
        loanRequest,
        offer,
      ).map(({ key, component, format, value, id }, i) => {
        if (component) {
          return (
            <div style={styles.item} key={i}>
              {component}
            </div>
          );
        }

        return (
          <div className="flex-col" key={key || id} style={styles.item}>
            <label
              className="secondary"
              style={{
                margin: 0,
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                fontSize: '80%',
              }}
              htmlFor={key || id}
            >
              <T id={`offer.${key || id}`} />
            </label>
            <h4 className="bold" style={{ margin: 0 }} id={key}>
              {value || <IntlNumber value={offer[key]} format={format} />}
            </h4>
          </div>
        );
      })}
    </div>
  </div>
);

Offer.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
  offer: PropTypes.objectOf(PropTypes.any).isRequired,
  chosen: PropTypes.bool.isRequired,
  handleSave: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

Offer.defaultProps = {
  disabled: false,
};

export default Offer;
