import React from 'react';
import PropTypes from 'prop-types';
import ListItem from '@material-ui/core/ListItem';
import { withStyles } from '@material-ui/core/styles';
import { NavLink, withRouter } from 'react-router-dom';
import classnames from 'classnames';

import Icon from 'core/components/Icon';
import T from 'core/components/Translation';
import { compose } from 'recompose';
import ADMIN_ROUTES from '../../../../startup/client/adminRoutes';

const styles = () => ({
  root: { justifyContent: 'center' },
});

const shouldRenderInPrimaryColor = ({
  collection,
  collectionName,
  path,
  to,
}) => {
  if (collection && collection === collectionName) {
    return true;
  }
  if (path.slice(1).startsWith(collection) || path.includes(collection)) {
    return true;
  }
  if (
    path === ADMIN_ROUTES.DASHBOARD_PAGE.path
    && to === ADMIN_ROUTES.DASHBOARD_PAGE.path
  ) {
    return true;
  }
};

const MainSideNavListItem = ({
  label,
  icon,
  classes,
  detail,
  onClick,
  collection,
  collectionName,
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
      <div
        className={classnames({
          primary: shouldRenderInPrimaryColor({
            collection,
            collectionName,
            path: history.location.pathname,
            to,
          }),
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

export default compose(
  withStyles(styles),
  withRouter,
)(MainSideNavListItem);
