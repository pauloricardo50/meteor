import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { NavLink, withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import Icon from 'core/components/Icon';
import ListItem from 'core/components/Material/ListItem';
import T from 'core/components/Translation';

const styles = () => ({
  root: { justifyContent: 'center' },
});

const MainSideNavListItem = ({
  label,
  icon,
  classes,
  detail,
  onClick,
  collection,
  to,
  history,
}) => (
  <ListItem
    button
    classes={classes}
    onClick={onClick}
    onDoubleClick={() => {
      if (!to) {
        history.push(`/${collection}`);
      }
    }}
    component={!detail ? NavLink : undefined}
    to={!detail ? to : undefined}
    className="main-side-nav-list-item"
  >
    <div>
      {typeof icon === 'string' ? <Icon type={icon} size={32} /> : icon}
      <small className="label">
        {label || <T id={`collections.${collection}`} noTooltips />}
      </small>
    </div>
  </ListItem>
);

MainSideNavListItem.propTypes = {
  classes: PropTypes.object.isRequired,
  collection: PropTypes.string,
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

export default compose(withStyles(styles), withRouter)(MainSideNavListItem);
