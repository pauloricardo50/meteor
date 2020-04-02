import { Meteor } from 'meteor/meteor';

import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import PropTypes from 'prop-types';

import { generateImpersonateLink } from '../../api/impersonation/impersonation';
import { impersonateAdmin } from '../../api/impersonation/methodDefinitions';
import { ROLES } from '../../api/users/userConstants';
import { isUser } from '../../utils/userFunctions';
import Button from '../Button';
import Icon from '../Icon';
import T from '../Translation';

const styles = {
  cssRoot: {
    color: 'white',
    backgroundColor: 'red',
    '&:hover': {
      backgroundColor: 'darkRed',
    },
  },
};

const isAdminAndDev = ({ roles }) =>
  roles.includes(ROLES.ADMIN) &&
  Meteor.user() &&
  Meteor.user().roles.includes(ROLES.DEV);

const ImpersonateLink = ({ user, className, classes }) => {
  if (!user) {
    return null;
  }

  if (isAdminAndDev(user)) {
    return (
      <Button
        onClick={() =>
          impersonateAdmin
            .run({ userId: user._id })
            .then(() => Meteor.connection.setUserId(user._id))
        }
        fab
        style={{ backgroundColor: '#0F0', color: 'white' }}
      >
        <Icon type="supervisorAccount" size={32} />
      </Button>
    );
  }

  if (!isUser(user)) {
    return null;
  }

  return (
    <a
      target="_blank"
      href={generateImpersonateLink(user, Meteor.userId())}
      className={className}
    >
      <Tooltip
        placement="bottom"
        title={<T id="Impersonation.impersonateLinkText" />}
      >
        <Button fab color="error" className={classes.cssRoot}>
          <Icon type="supervisorAccount" size={32} />
        </Button>
      </Tooltip>
    </a>
  );
};

ImpersonateLink.propTypes = {
  className: PropTypes.string,
  user: PropTypes.object,
};

ImpersonateLink.defaultProps = {
  user: undefined,
  // This `undefined` default value makes sure the `class` html attribute
  // doesn't get rendered when no className prop is passed, for performance.
  className: undefined,
};

export default withStyles(styles)(ImpersonateLink);
