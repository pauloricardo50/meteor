// @flow
import React from 'react';
import { useHistory } from 'react-router-dom';

import { shareImpersonatedSession } from 'core/api/sessions/methodDefinitions';
import colors from 'core/config/colors';
import IconButton from '../IconButton';
import Icon from '../Icon/Icon';

type ImpersonatingSessionProps = {};

const getIcon = ({ isUserOnSamePage, shared, userIsConnected }) => {
  if (userIsConnected && !shared) {
    return (
      <IconButton
        onClick={() => shareImpersonatedSession.run({ share: !shared })}
        type="airplay"
        iconProps={{ className: 'icon' }}
        style={{ backgroundColor: colors.success, marginLeft: '4px' }}
        tooltip="Partager la session"
      />
    );
  }

  if (userIsConnected && shared && !isUserOnSamePage) {
    return <Icon type="info" className="icon warning" />;
  }

  if (userIsConnected && shared && isUserOnSamePage) {
    return <Icon type="checkCircle" className="icon success" />;
  }
};

const getText = ({ isUserOnSamePage, shared, userIsConnected }) => {
  if (userIsConnected && !shared) {
    return <h4>Le client est connecté</h4>;
  }

  if (userIsConnected && shared && !isUserOnSamePage) {
    return <h4>Client sur une autre page</h4>;
  }

  if (userIsConnected && shared && isUserOnSamePage) {
    return <h4>Client sur la même page</h4>;
  }
};

const ImpersonatingSession = ({
  impersonatedSession,
}: ImpersonatingSessionProps) => {
  const {
    shared,
    impersonatedUserLastPageVisited,
    userIsConnected,
  } = impersonatedSession;

  const history = useHistory();

  const isUserOnSamePage =
    history.location.pathname === impersonatedUserLastPageVisited;

  return (
    <div className="impersonate-notification">
      {getIcon({ isUserOnSamePage, shared, userIsConnected })}
      {getText({ isUserOnSamePage, shared, userIsConnected })}

      {shared && (
        <IconButton
          onClick={() => shareImpersonatedSession.run({ share: !shared })}
          type="close"
          iconProps={{ className: 'icon' }}
          style={{ backgroundColor: colors.error }}
          tooltip="Arrêter le partage de session"
        />
      )}
    </div>
  );
};

export default ImpersonatingSession;
