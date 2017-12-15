import React from 'react';
import PropTypes from 'prop-types';

import { T } from 'core/components/Translation';
import DropdownMenu from '/imports/ui/components/general/DropdownMenu';

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

const DashboardItem = props => (
  <div
    className={`mask1 grid-item ${props.className}`}
    style={{ ...styles.div, ...props.style }}
  >
    {props.title && (
      <h4 className="fixed-size bold" style={{ marginTop: 0 }}>
        {props.title}
      </h4>
    )}

    {props.menuActions.length > 0 && (
      <DropdownMenu
        style={styles.icon}
        iconType="more"
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        targetOrigin={{ horizontal: 'right', vertical: 'top' }}
        options={props.menuActions.map(a => ({
          ...a,
          onClick: a.handleClick,
          link: !!a.link,
          to: a.link,
          label: <T id={`DashboardMenu.${a.id}`} />,
        }))}
      />
    )}

    {props.children}
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
