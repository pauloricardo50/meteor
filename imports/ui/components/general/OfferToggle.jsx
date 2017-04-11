import React, { PropTypes } from 'react';

import Toggle from 'material-ui/Toggle';

const OfferToggle = props => {
  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        justifyContent: 'center',
        margin: '20px 0',
      }}
    >
      <span className={!props.value && 'active'}>
        Offres standard
      </span>
      <Toggle
        toggled={props.value}
        style={{ margin: '0 16px', width: 'unset' }}
        onToggle={props.handleToggle}
      />
      <span className={props.value && 'active'}>
        Offres avec conditions
      </span>
    </div>
  );
};

OfferToggle.propTypes = {};

export default OfferToggle;
