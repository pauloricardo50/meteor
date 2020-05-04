import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { NavLink, withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import Icon from 'core/components/Icon';
import ListItem from 'core/components/Material/ListItem';
import T from 'core/components/Translation';

const styles = () => ({
  root: { justifyContent: 'center' },
});

const shouldRenderInPrimaryColor = ({
  collection,
  collectionName,
  path,
  to,
  exact,
}) => {
  if (collection && collection === collectionName) {
    return true;
  }
  if (path.slice(1).startsWith(collection) || path.includes(collection)) {
    return true;
  }
  if (exact && path === to) {
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
  exact,
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
          exact,
        }),
      })}
    >
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

export default compose(withStyles(styles), withRouter)(MainSideNavListItem);
