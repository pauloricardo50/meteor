//      
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

import { employeesById } from 'core/arrays/epotekEmployees';
import { followImpersonatedSession } from 'core/api/sessions/methodDefinitions';
import Dialog from '../Material/Dialog';
import Button from '../Button';
import Icon from '../Icon';
import { styles } from './fabStyles';
import T from '../Translation';

                                         
                              
  

const useStyles = makeStyles(styles);

const getButton = ({
  followAdmin,
  adminFirstName,
  setFollowAdmin,
  connectionId,
  lastPageVisited,
  history,
}) => {
  const classes = useStyles();
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

const getDialog = ({
  showDialog,
  adminImage,
  adminName,
  adminFirstName,
  history,
  setShowDialog,
  setFollowAdmin,
  connectionId,
  lastPageVisited,
}) => {
  return (
    <Dialog open={showDialog}>
      <div className="impersonate-notification-dialog">
        <img src={adminImage} />
        <h3>{adminName}</h3>
        <p>
          <T
            id="ImpersonateNotification.dialog.description"
            values={{ adminFirstName }}
          />
        </p>
        <div className="actions">
          <Button
            raised
            secondary
            onClick={() => {
              followImpersonatedSession.run({ connectionId, follow: true });
              history.push(lastPageVisited);
              setFollowAdmin(true);
              setShowDialog(false);
            }}
            label={
              <T
                id="ImpersonateNotification.follow"
                values={{ adminFirstName }}
              />
            }
            size="large"
            icon={<Icon type="howToReg" />}
          />
          <Button
            onClick={() => setShowDialog(false)}
            label={<T id="ImpersonateNotification.followLater" />}
            size="small"
          />
        </div>
      </div>
    </Dialog>
  );
};

const UserImpersonateNotification = ({
  impersonatedSession,
}                                  ) => {
  const {
    connectionId,
    lastPageVisited,
    impersonatingAdmin: {
      name: adminName,
      _id: adminId,
      firstName: adminFirstName,
    } = {},
  } = impersonatedSession;

  const [followAdmin, setFollowAdmin] = useState(false);
  const [showDialog, setShowDialog] = useState(true);

  const history = useHistory();
  const adminImage = employeesById[adminId].src;
  const isAdminOnSamePage = history.location.pathname === lastPageVisited;

  useEffect(() => {
    if (followAdmin && !isAdminOnSamePage) {
      history.push(lastPageVisited);
    }
  }, [isAdminOnSamePage]);

  return (
    <>
      {getDialog({
        showDialog,
        adminImage,
        adminName,
        adminFirstName,
        history,
        setShowDialog,
        setFollowAdmin,
        lastPageVisited,
        connectionId,
      })}
      <div className="impersonate-notification">
        <img src={adminImage} />
        <h4>
          {followAdmin ? (
            <T
              id="ImpersonateNotification.following"
              values={{ adminFirstName }}
            />
          ) : (
            <T
              id="ImpersonateNotification.follow"
              values={{ adminFirstName }}
            />
          )}
        </h4>
        {getButton({
          followAdmin,
          adminFirstName,
          setFollowAdmin,
          connectionId,
          lastPageVisited,
          history,
        })}
      </div>
    </>
  );
};

export default UserImpersonateNotification;
