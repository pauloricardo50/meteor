import React from 'react';
import PropTypes from 'prop-types';

import ListItem from '@material-ui/core/ListItem';
import { withStyles } from '@material-ui/core/styles';
import { NavLink } from 'react-router-dom';
import classnames from 'classnames';

import Icon from 'core/components/Icon';
import colors from 'core/config/colors';
import T from 'core/components/Translation';

const styles = () => ({
  root: {
    justifyContent: 'center',
  },
});

const MainSideNavListItem = ({
  label,
  icon,
  classes,
  detail,
  onClick,
  collection,
  collectionName,
  to,
}) => (
  <ListItem
    button
    classes={classes}
    onClick={onClick}
    component={!detail ? NavLink : undefined}
    to={!detail ? to : undefined}
  >
    <div
      className={classnames({
        'main-side-nav-list-item': true,
        primary: collection && collection === collectionName,
      })}
    >
      {typeof icon === 'string' ? <Icon type={icon} size={32} /> : icon}
      <h5 className="label">
        {label || <T id={`collections.${collection}`} noTooltips />}
      </h5>
    </div>
  </ListItem>
);

MainSideNavListItem.propTypes = {
  classes: PropTypes.object.isRequired,
  collection: PropTypes.string,
  collectionName: PropTypes.string,
  detail: PropTypes.bool,
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  label: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  to: PropTypes.string,
};

MainSideNavListItem.defaultProps = {
  label: undefined,
  detail: undefined,
  collection: undefined,
  collectionName: undefined,
  to: undefined,
};

export default withStyles(styles)(MainSideNavListItem);
