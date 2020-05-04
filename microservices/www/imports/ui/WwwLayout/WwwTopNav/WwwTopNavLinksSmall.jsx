import { Meteor } from 'meteor/meteor';

import React from 'react';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import ListItemText from '@material-ui/core/ListItemText';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { compose, withState } from 'recompose';

import IconButton from 'core/components/IconButton';
import Link from 'core/components/Link';
import List from 'core/components/Material/List';
import ListItem from 'core/components/Material/ListItem';
import T from 'core/components/Translation';

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
