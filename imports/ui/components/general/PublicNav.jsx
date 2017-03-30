import React, { PropTypes } from 'react';
import { Link } from 'react-router-dom';

import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';

import TopNavDropdown from '/imports/ui/components/general/TopNavDropdown.jsx';
import colors from '/imports/js/config/colors';

const styles = {
  navbar: {
    position: 'relative',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    color: '#000000',
    boxShadow: '0px 2px 40px 0px rgba(0,0,0,0.08)',
  },
  imageDiv: {
    position: 'absolute',
    left: 24,
    padding: 17,
  },
  image: {
    height: 30,
    maxWidth: '50%',
  },
  button: {
    color: '#000000',
  },
};

const PublicNav = props => (
  <div className="public-nav">
    <AppBar
      style={styles.navbar}
      iconElementRight={
        props.currentUser
          ? <TopNavDropdown public {...props} />
          : <FlatButton
              label="Login"
              containerElement={<Link to="/login" />}
              secondary
              labelStyle={{ color: colors.primary }}
            />
      }
      iconStyleLeft={{ display: 'none' }}
    >
      <Link to="/home" style={styles.imageDiv}>
        <img src="/img/logo_black.svg" alt="e-Potek" style={styles.image} />
      </Link>
    </AppBar>
  </div>
);

PublicNav.propTypes = {
  currentUser: PropTypes.objectOf(PropTypes.any),
};

export default PublicNav;
