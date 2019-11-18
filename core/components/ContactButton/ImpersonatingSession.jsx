// @flow
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { shareImpersonatedSession } from 'core/api/sessions/methodDefinitions';
import Icon from '../Icon/Icon';
import Button from '../Button';
import { styles } from './fabStyles';

type ImpersonatingSessionProps = {
  impersonatedSession: Object,
};

const getIcon = ({ followed, shared, userIsConnected }) => {
  if (userIsConnected && !shared) {
    return <Icon type="info" className="impersonate-icon primary" />;
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

const useStyles = makeStyles(styles);

const ImpersonatingSession = ({
  impersonatedSession,
}: ImpersonatingSessionProps) => {
  const { shared, userIsConnected, followed } = impersonatedSession;

  const classes = useStyles();

  return (
    <div className="impersonate-notification">
      {getIcon({ followed, shared, userIsConnected })}
      {getText({ followed, shared, userIsConnected })}

      <Button
        fab
        className={shared ? classes.error : classes.success}
        onClick={() => shareImpersonatedSession.run({ share: !shared })}
        tooltip={
          shared ? 'Arrêter le partage de session' : 'Partager la session'
        }
        tooltipPlacement="top-end"
        key={shared ? 'stopSharing' : 'startSharing'}
      >
        <Icon type={shared ? 'close' : 'airplay'} />
      </Button>
    </div>
  );
};

export default ImpersonatingSession;
