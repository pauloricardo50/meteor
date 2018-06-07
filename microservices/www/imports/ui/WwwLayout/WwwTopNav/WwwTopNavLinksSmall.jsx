import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { withState, compose } from 'recompose';

import T from 'core/components/Translation';
import IconButton from 'core/components/IconButton';
import { links } from './WwwTopNavLinksList';

const styles = {
  fullList: {
    width: 'auto',
  },
};

const WwwTopNavLinksSmall = ({ open, toggleDrawer, classes: { fullList } }) => (
  <span className="www-top-nav-links-small">
    <IconButton type="menu" onClick={() => toggleDrawer(true)} />
    <Drawer anchor="top" open={open} onClose={() => toggleDrawer(false)}>
      <div className={fullList}>
        <List
          tabIndex={0}
          role="button"
          onClick={() => toggleDrawer(false)}
          onKeyDown={() => toggleDrawer(false)}
        >
          {links.map(link => (
            <Link
              key={link}
              to={`/${link}`}
              className="www-top-nav-links-small-link"
            >
              <ListItem button>
                <ListItemText primary={<T id={`WwwTopNavLinks.${link}`} />} />
              </ListItem>
            </Link>
          ))}
        </List>
      </div>
    </Drawer>
  </span>
);

WwwTopNavLinksSmall.propTypes = {
  open: PropTypes.bool.isRequired,
  toggleDrawer: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

export default compose(
  withState('open', 'toggleDrawer', false),
  withStyles(styles),
)(WwwTopNavLinksSmall);
