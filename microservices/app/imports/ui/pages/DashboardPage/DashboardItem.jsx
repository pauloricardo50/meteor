import React from 'react';
import PropTypes from 'prop-types';

import DashboardMenu from './DashboardMenu';

const styles = {
  div: {
    position: 'relative',
    marginBottom: 15,
  },
  icon: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
};

const DashboardItem = ({
  className, style, title, menuActions, children,
}) => (
  <div
    className={`mask1 grid-item ${className}`}
    style={{ ...styles.div, ...style }}
  >
    {title && (
      <h4 className="fixed-size bold" style={{ marginTop: 0 }}>
        {title}
      </h4>
    )}

    {menuActions.length > 0 && <DashboardMenu menuActions={menuActions} />}

    {children}
  </div>
);

DashboardItem.propTypes = {
  className: PropTypes.string,
  title: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  menuActions: PropTypes.arrayOf(PropTypes.object),
  children: PropTypes.any.isRequired,
  style: PropTypes.objectOf(PropTypes.any),
};

DashboardItem.defaultProps = {
  className: '',
  title: '',
  menuActions: [],
  style: {},
};

export default DashboardItem;
