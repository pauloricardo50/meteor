import PropTypes from 'prop-types';
import React from 'react';

import Toggle from 'material-ui/Toggle';

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
  return (
    <div style={styles.div}>
      <span
        className={!props.value && 'active'}
        onTouchTap={() => props.handleToggle(null, false)}
        style={styles.span}
      >
        Offres standard
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
        Offres avec contrepartie
      </span>
    </div>
  );
};

OfferToggle.propTypes = {
  value: PropTypes.bool.isRequired,
  handleToggle: PropTypes.func.isRequired,
};

export default OfferToggle;
