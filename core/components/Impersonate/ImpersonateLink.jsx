import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core/styles';

import T from '../Translation';
import Icon from '../Icon';
import Button from '../Button';
import { generateImpersonateLink } from '../../api/impersonation/impersonation';
import { isUser } from '../../utils/userFunctions';

const styles = {
  cssRoot: {
    color: 'white',
    backgroundColor: 'red',
    '&:hover': {
      backgroundColor: 'darkRed',
    },
  },
};

const ImpersonateLink = ({ user, className, classes }) => {
  if (!isUser(user)) {
    return null;
  }

  return (
    <a
      target="_blank"
      href={generateImpersonateLink(user)}
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
