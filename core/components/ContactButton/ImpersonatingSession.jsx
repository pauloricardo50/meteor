// @flow
import React from 'react';

import { shareImpersonatedSession } from 'core/api/sessions/methodDefinitions';
import colors from 'core/config/colors';
import IconButton from '../IconButton';
import Icon from '../Icon/Icon';

type ImpersonatingSessionProps = {};

const getIcon = ({ followed, shared, userIsConnected }) => {
  if (userIsConnected && !shared) {
    return (
      <IconButton
        onClick={() => shareImpersonatedSession.run({ share: !shared })}
        type="airplay"
        color="secondary"
        style={{ marginLeft: '1px' }}
        tooltip="Partager la session"
      />
    );
  }

  if (userIsConnected && shared && !followed) {
    return <Icon type="info" className="impersonate-icon warning" />;
  }

  if (userIsConnected && shared && followed) {
    return <Icon type="checkCircle" className="impersonate-icon success" />;
  }
};

const getText = ({ followed, shared, userIsConnected }) => {
  if (userIsConnected && !shared) {
    return <h4>Le client est connecté</h4>;
  }

  if (userIsConnected && shared && !followed) {
    return <h4>Le client ne vous suit pas</h4>;
  }

  if (userIsConnected && shared && followed) {
    return <h4>Le client vous suit</h4>;
  }
};

const ImpersonatingSession = ({
  impersonatedSession,
}: ImpersonatingSessionProps) => {
  const {
    shared,
    impersonatedUserLastPageVisited,
    userIsConnected,
    followed,
  } = impersonatedSession;

  return (
    <div className="impersonate-notification">
      {getIcon({ followed, shared, userIsConnected })}
      {getText({ followed, shared, userIsConnected })}

      {shared && (
        <IconButton
          onClick={() => shareImpersonatedSession.run({ share: !shared })}
          type="close"
          iconStyle={{ color: colors.error }}
          tooltip="Arrêter le partage de session"
        />
      )}
    </div>
  );
};

export default ImpersonatingSession;
