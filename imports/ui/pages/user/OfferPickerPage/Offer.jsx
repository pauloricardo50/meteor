import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { T, IntlNumber } from '/imports/ui/components/general/Translation';
import ConditionsButton from '/imports/ui/components/general/ConditionsButton';

const values = offer => [
  { key: 'maxAmount', format: 'money' },
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

const styles = {
  item: {
    width: '25%',
    minWidth: 120,
    padding: 8,
  },
};

const Offer = ({ offer, chosen, handleSave, disabled }) => (
  <div
    className={classNames({ 'choice flex center': true, chosen, disabled })}
    style={{ flexWrap: 'nowrap', padding: 0 }}
    onClick={() =>
      (disabled ? {} : handleSave(chosen ? '' : offer.id, offer.type))}
  >
    <h3 style={{ margin: 0, padding: 16 }}>{offer.organization}</h3>
    <div className="flex" style={{ flexWrap: 'wrap' }}>
      {values(offer).map(({ key, component, format }, i) => {
        if (component) {
          return (
            <div style={styles.item} key={i}>
              {component}
            </div>
          );
        }

        return (
          <div className="flex-col" key={key} style={styles.item}>
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
              htmlFor={key}
            >
              <T id={`offer.${key}`} />
            </label>
            <h4 className="bold" style={{ margin: 0 }} id={key}>
              <IntlNumber value={offer[key]} format={format} />
            </h4>
          </div>
        );
      })}
    </div>
  </div>
);

Offer.propTypes = {
  offer: PropTypes.objectOf(PropTypes.any).isRequired,
  chosen: PropTypes.bool.isRequired,
  handleSave: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

Offer.defaultProps = {
  disabled: false,
};

export default Offer;
