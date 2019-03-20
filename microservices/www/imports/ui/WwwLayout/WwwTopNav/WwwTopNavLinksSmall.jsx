import { Meteor } from 'meteor/meteor';

import React from 'react';
import PropTypes from 'prop-types';
import Link from 'core/components/Link';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
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
          <Divider />
          <a
            href={Meteor.settings.public.subdomains.app}
            className="www-top-nav-link"
          >
            <ListItem button>
              <ListItemText primary={<T id="WwwTopNavLinks.appLogin" />} />
            </ListItem>
          </a>
          <a
            href={Meteor.settings.public.subdomains.pro}
            className="www-top-nav-link"
          >
            <ListItem button>
              <ListItemText primary={<T id="WwwTopNavLinks.proLogin" />} />
            </ListItem>
          </a>
        </List>
      </div>
    </Drawer>
  </span>
);

WwwTopNavLinksSmall.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  toggleDrawer: PropTypes.func.isRequired,
};

export default compose(
  withState('open', 'toggleDrawer', false),
  withStyles(styles),
)(WwwTopNavLinksSmall);
