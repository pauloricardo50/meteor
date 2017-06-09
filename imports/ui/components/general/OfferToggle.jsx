import PropTypes from 'prop-types';
import React from 'react';

import Toggle from 'material-ui/Toggle';

import { T } from '/imports/ui/components/general/Translation.jsx';

const styles = {
  div: {
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    margin: '20px 0',
  },
  span: {
    cursor: 'pointer',
  },
};

const OfferToggle = props => {
  const standardCount = props.offers.length;
  const counterpartCount = props.offers.filter(o => o.counterparts.length > 0).length;
  return (
    <div style={styles.div}>
      <span
        className={!props.value && 'active'}
        onTouchTap={() => props.handleToggle(null, false)}
        style={styles.span}
      >
        {/* use toString, or else a count of 0 isn't rendered */}
        <T id="OfferToggle.standard" values={{ count: standardCount.toString() }} />
      </span>
      <Toggle
        toggled={props.value}
        style={{ margin: '0 16px', width: 'unset' }}
        onToggle={props.handleToggle}
      />
      <span
        className={props.value && 'active'}
        onTouchTap={() => props.handleToggle(null, true)}
        style={styles.span}
      >
        <T id="OfferToggle.counterpart" values={{ count: counterpartCount.toString() }} />
      </span>
    </div>
  );
};

OfferToggle.propTypes = {
  value: PropTypes.bool.isRequired,
  handleToggle: PropTypes.func.isRequired,
  offers: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default OfferToggle;
