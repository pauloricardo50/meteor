import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { withStyles } from 'material-ui/styles';
import classnames from 'classnames';

import { T } from '/imports/ui/components/general/Translation';
import IconButton from '/imports/ui/components/general/IconButton';

const styles = theme => ({
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
});

const DrawerHeader = ({ showButton, onClick, permanent, classes }) => (
  <div
    className={classnames({
      'top-bar': true,
      [classes.drawerHeader]: permanent,
    })}
  >
    <Link to="/home">
      <img
        src="/img/logo_black.svg"
        alt="e-Potek"
        style={styles.logo}
        className="logo"
      />
    </Link>
    {showButton && (
      <IconButton
        onClick={onClick}
        style={{ top: 8, right: 8, position: 'absolute', zIndex: 100 }}
        type="close"
        tooltip={<T id="general.close" />}
        tooltipPlacement="bottom-start"
      />
    )}
  </div>
);

DrawerHeader.propTypes = {
  showButton: PropTypes.bool,
  onClick: PropTypes.func,
  permanent: PropTypes.bool,
  classes: PropTypes.object,
};

DrawerHeader.defaultProps = {
  showButton: false,
  onClick: undefined,
  permanent: false,
  classes: undefined,
};

export default withStyles(styles)(DrawerHeader);
