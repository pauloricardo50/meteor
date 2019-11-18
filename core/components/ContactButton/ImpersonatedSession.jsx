// @flow
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

import { employeesById } from 'core/arrays/epotekEmployees';
import { followImpersonatedSession } from 'core/api/sessions/methodDefinitions';
import Dialog from '../Material/Dialog';
import Button from '../Button';
import Icon from '../Icon';
import { styles } from './fabStyles';

type ImpersonatedSessionProps = {
  impersonatedSession: Object,
};

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
  if (!followAdmin) {
    return (
      <Button
        fab
        className={classes.success}
        onClick={() => {
          followImpersonatedSession.run({ connectionId, follow: true });
          history.push(lastPageVisited);
          setFollowAdmin(true);
        }}
        tooltip={`Suivre ${adminFirstName}`}
        tooltipPlacement="top-end"
        key="followAdmin"
      >
        <Icon type="howToReg" />
      </Button>
    );
  }

  return (
    <Button
      fab
      className={classes.error}
      onClick={() => {
        followImpersonatedSession.run({ connectionId, follow: false });
        setFollowAdmin(false);
      }}
      tooltip={`Arrêter de suivre ${adminFirstName}`}
      tooltipPlacement="top-end"
      key="unfollowAdmin"
    >
      <Icon type="close" />
    </Button>
  );
};

const ImpersonatedSession = ({
  impersonatedSession,
}: ImpersonatedSessionProps) => {
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
  }, [impersonatedSession, isAdminOnSamePage]);

  return (
    <>
      <Dialog open={showDialog}>
        <div className="impersonate-notification-dialog">
          <img src={adminImage} />
          <h3>{adminName}</h3>
          <p>{adminFirstName} souhaite vous accompagner à travers e-Potek</p>
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
              label={`Suivre ${adminFirstName}`}
              size="large"
              icon={<Icon type="howToReg" />}
            />
            <Button
              onClick={() => {
                setShowDialog(false);
              }}
              label="Plus tard"
              size="small"
            />
          </div>
        </div>
      </Dialog>

      <div className="impersonate-notification">
        <img src={adminImage} />
        <h4>
          {followAdmin
            ? `Vous suivez ${adminFirstName}`
            : `Suivre ${adminFirstName}`}
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

export default ImpersonatedSession;
