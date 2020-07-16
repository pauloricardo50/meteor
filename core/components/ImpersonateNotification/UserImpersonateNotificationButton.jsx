import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';

import { followImpersonatedSession } from '../../api/sessions/methodDefinitions';
import Button from '../Button';
import Icon from '../Icon';
import T from '../Translation';
import { styles } from './fabStyles';

const useStyles = makeStyles(styles);

const UserImpersonateNotificationButton = ({
  impersonatedSession,
  options: { followAdmin, setFollowAdmin },
}) => {
  const classes = useStyles();
  const history = useHistory();
  const {
    connectionId,
    lastPageVisited,
    impersonatingAdmin: { firstName: adminFirstName } = {},
  } = impersonatedSession;

  return (
    <Button
      fab
      className={followAdmin ? classes.error : classes.success}
      onClick={() => {
        if (followAdmin) {
          followImpersonatedSession.run({ connectionId, follow: false });
          setFollowAdmin(false);
        } else {
          followImpersonatedSession.run({ connectionId, follow: true });
          history.push(lastPageVisited);
          setFollowAdmin(true);
        }
      }}
      tooltip={
        followAdmin ? (
          <T
            id="ImpersonateNotification.stopFollowing"
            values={{ adminFirstName }}
          />
        ) : (
          <T id="ImpersonateNotification.follow" values={{ adminFirstName }} />
        )
      }
      tooltipPlacement="top-end"
      key={followAdmin ? 'unfollowAdmin' : 'followAdmin'}
    >
      <Icon type={followAdmin ? 'close' : 'howToReg'} />
    </Button>
  );
};

export default UserImpersonateNotificationButton;
