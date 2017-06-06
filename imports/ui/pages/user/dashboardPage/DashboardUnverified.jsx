import React from 'react';
import PropTypes from 'prop-types';

import { T } from '/imports/ui/components/general/Translation.jsx';

import colors from '/imports/js/config/colors';

const handleClick = event => {
  event.preventDefault();
};

const DashboardUnverified = props => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
      }}
      className="mask1"
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-around',
          alignItems: 'flex-start',
          flexGrow: 1,
        }}
      >
        <h3 className="fixed-size" style={{ margin: 0 }}><T id="DashboardUnverified.title" /></h3>
        <div style={{ display: 'flex' }}>
          <p style={{ marginRight: 4, marginBottom: 0 }}>
            <T id="DashboardUnverified.description" />
          </p>
          <a onTouchTap={handleClick}><T id="DashboardUnverified.CTA" /></a>
        </div>
      </div>
      <span className="fa fa-info fa-2x" style={{ color: colors.lightBorder, paddingRight: 16 }} />
    </div>
  );
};

DashboardUnverified.propTypes = {};

export default DashboardUnverified;
