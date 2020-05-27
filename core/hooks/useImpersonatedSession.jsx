import { Meteor } from 'meteor/meteor';

import { useEffect, useState } from 'react';

import { setUserConnected } from '../api/sessions/methodDefinitions';
import { userImpersonatedSession } from '../api/sessions/queries';
import { useReactiveMeteorData } from './useMeteorData';

const useImpersonatedSession = () => {
  const { data: impersonatedSession, loading } = useReactiveMeteorData({
    query: userImpersonatedSession,
    params: () => {},
    type: 'single',
  });

  const { connectionId, userIsConnected, shared, followed } =
    impersonatedSession || {};

  const currentSessionId = Meteor.connection._lastSessionId;
  const shouldRenderAdminNotification =
    connectionId === currentSessionId && userIsConnected;
  const shouldRenderUserNotification = shared;

  const [followAdmin, setFollowAdmin] = useState(false);
  const [showUserDialog, setShowUserDialog] = useState(false);
  const shouldRenderNotification =
    !loading &&
    !!impersonatedSession &&
    (shouldRenderAdminNotification || shouldRenderUserNotification);

  useEffect(() => {
    if (
      !!impersonatedSession &&
      !shouldRenderAdminNotification &&
      connectionId !== currentSessionId &&
      !userIsConnected
    ) {
      setUserConnected.run({ connectionId });
    }
  }, [connectionId, currentSessionId, userIsConnected]);

  useEffect(() => {
    setShowUserDialog(shared && !followed);
    setFollowAdmin(shared && followed);
  }, [shared]);

  return [
    impersonatedSession,
    {
      shouldRenderNotification,
      shouldRenderAdminNotification,
      shouldRenderUserNotification,
      followAdmin,
      setFollowAdmin,
      showUserDialog,
      setShowUserDialog,
    },
  ];
};

export default useImpersonatedSession;
