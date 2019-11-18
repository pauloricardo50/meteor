// @flow
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { employeesById } from 'core/arrays/epotekEmployees';
import { followImpersonatedSession } from 'core/api/sessions/methodDefinitions';
import colors from 'core/config/colors';
import IconButton from '../IconButton';

type ImpersonatedSessionProps = {};

const getIcon = ({
  followAdmin,
  adminFirstName,
  setFollowAdmin,
  connectionId,
  lastPageVisited,
  history,
}) => {
  if (!followAdmin) {
    return (
      <IconButton
        onClick={() => {
          followImpersonatedSession.run({ connectionId, follow: true });
          history.push(lastPageVisited);
          setFollowAdmin(true);
        }}
        type="right"
        color="secondary"
        tooltip={`Suivre ${adminFirstName}`}
      />
    );
  }
  return (
    <IconButton
      onClick={() => {
        followImpersonatedSession.run({ connectionId, follow: false });
        setFollowAdmin(false);
      }}
      type="close"
      iconStyle={{ color: colors.error }}
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
      history.push(lastPageVisited);
    }
  }, [impersonatedSession, isAdminOnSamePage]);

  return (
    <div className="impersonate-notification">
      <img src={adminImage} />
      <h4>
        {followAdmin
          ? `Vous suivez ${adminName}`
          : `${adminName} est en train de travailler sur votre dossier`}
      </h4>
      {getIcon({
        followAdmin,
        adminFirstName,
        setFollowAdmin,
        connectionId,
        lastPageVisited,
        history,
      })}
    </div>
  );
};

export default ImpersonatedSession;
