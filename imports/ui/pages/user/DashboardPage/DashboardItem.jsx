import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreIcon from 'material-ui/svg-icons/navigation/more-horiz';

import { T } from '/imports/ui/components/general/Translation.jsx';

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

const DashboardItem = props => {
  return (
    <div className={`mask1 grid-item ${props.className}`} style={{ ...styles.div, ...props.style }}>

      {props.title && <h4 className="fixed-size bold" style={{ marginTop: 0 }}>{props.title}</h4>}

      {props.menuActions.length > 0 &&
        <IconMenu
          style={styles.icon}
          iconButtonElement={
            <IconButton>
              <MoreIcon color="#ADB5BD" hoverColor="#8B939B" />
            </IconButton>
          }
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          targetOrigin={{ horizontal: 'right', vertical: 'top' }}
        >
          {props.menuActions.map(a =>
            <MenuItem
              key={a.id}
              primaryText={<T id={`DashboardMenu.${a.id}`} />}
              onClick={() => (a.handleClick ? a.handleClick() : {})}
              containerElement={a.link && <Link to={a.link} />}
            />,
          )}
        </IconMenu>}

      {props.children}

    </div>
  );
};

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
