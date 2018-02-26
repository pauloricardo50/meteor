import React from 'react';
import PropTypes from 'prop-types';

import { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import { withStyles } from 'material-ui/styles';

import Icon from 'core/components/Icon';

const styles = () => ({
  root: {
    justifyContent: 'center',
  },
});

const MainSideNavListItem = ({ label, icon, classes }) => (
  <ListItem button classes={classes}>
    <div className="main-side-nav-list-item">
      <Icon type={icon} size={32} />
      <h6 className="label">{label}</h6>
    </div>
  </ListItem>
);

MainSideNavListItem.propTypes = {};

export default withStyles(styles)(MainSideNavListItem);
