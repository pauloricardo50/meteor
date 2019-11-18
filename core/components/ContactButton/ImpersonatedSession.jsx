// @flow
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { employeesById } from 'core/arrays/epotekEmployees';
import Button from 'core/components/Button';
import { followImpersonatedSession } from 'core/api/sessions/methodDefinitions';
import colors from 'core/config/colors';
import IconButton from '../IconButton';
import Icon from '../Icon/Icon';

type ImpersonatedSessionProps = {};

const getIcon = ({
  followAdmin,
  adminFirstName,
  setFollowAdmin,
  connectionId,
  lastPageVisited,
  history,
  isAdminOnSamePage,
}) => {
  if (!followAdmin || !isAdminOnSamePage) {
    return (
      <IconButton
        onClick={() => {
          followImpersonatedSession.run({ connectionId });
          history.push(lastPageVisited);
          setFollowAdmin(true);
        }}
        type="right"
        iconProps={{ className: 'icon' }}
        style={{ backgroundColor: colors.warning, marginLeft: '4px' }}
        tooltip={`Suivre ${adminFirstName}`}
      />
    );
  }
  return (
    <IconButton
      onClick={() => setFollowAdmin(false)}
      type="close"
      iconProps={{ className: 'icon' }}
      style={{ backgroundColor: colors.error, marginLeft: '4px' }}
      tooltip={`Arrêter de suivre ${adminFirstName}`}
    />
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

  const history = useHistory();

  const adminImage = employeesById[adminId].src;

  const isAdminOnSamePage = history.location.pathname === lastPageVisited;
  useEffect(() => {
    if (followAdmin && !isAdminOnSamePage) {
      followImpersonatedSession.run({ connectionId });
      history.push(lastPageVisited);
    }
  }, [impersonatedSession]);

  return (
    <div className="impersonate-notification">
      <img src={adminImage} />
      <h4>{`${adminName} est en train de travailler sur votre dossier`}</h4>
      {getIcon({
        followAdmin,
        adminFirstName,
        setFollowAdmin,
        connectionId,
        lastPageVisited,
        history,
        isAdminOnSamePage,
      })}
    </div>
  );
};

export default ImpersonatedSession;
