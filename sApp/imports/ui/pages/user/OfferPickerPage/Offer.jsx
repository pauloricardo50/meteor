import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { T, IntlNumber } from '/imports/ui/components/general/Translation';

const styles = {
  item: {
    width: '25%',
    minWidth: 140,
    padding: 8,
  },
};

const Offer = ({ offer, chosen, handleSave, disabled, offerValues }) => (
  <div
    className={classNames({ 'choice flex center': true, chosen, disabled })}
    style={{ flexWrap: 'nowrap', padding: 0 }}
    onClick={() =>
      (disabled ? {} : handleSave(chosen ? '' : offer.id, offer.type))}
  >
    <h3 style={{ margin: 0, padding: 16 }}>{offer.organization}</h3>
    <div className="flex" style={{ flexWrap: 'wrap' }}>
      {offerValues.map(({ key, component, format, value, id }, i) => {
        if (component) {
          return (
            <div style={styles.item} key={i}>
              {component}
            </div>
          );
        }

        return (
          <div className="flex-col" key={id || key} style={styles.item}>
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
              htmlFor={id || key}
            >
              <T id={`offer.${id || key}`} />
            </label>
            <h4 className="bold" style={{ margin: 0 }} id={id || key}>
              {/* if it has an id, it has a value */}
              {value || <IntlNumber value={offer[key]} format={format} />}
            </h4>
          </div>
        );
      })}
    </div>
  </div>
);

Offer.propTypes = {
  offerValues: PropTypes.arrayOf(PropTypes.any).isRequired,
  offer: PropTypes.objectOf(PropTypes.any).isRequired,
  chosen: PropTypes.bool.isRequired,
  handleSave: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

Offer.defaultProps = {
  disabled: false,
};

export default Offer;
