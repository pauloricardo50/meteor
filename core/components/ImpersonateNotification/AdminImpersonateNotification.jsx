import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { shareImpersonatedSession } from '../../api/sessions/methodDefinitions';
import Button from '../Button';
import Icon from '../Icon';
import { styles } from './fabStyles';

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
    return (
      <h4>
        Le client est connecté{getIcon({ followed, shared, userIsConnected })}
      </h4>
    );
  }

  if (userIsConnected && shared && !followed) {
    return (
      <h4>
        Le client ne vous suit pas
        {getIcon({ followed, shared, userIsConnected })}
      </h4>
    );
  }

  if (userIsConnected && shared && followed) {
    return (
      <h4>
        Le client vous suit{getIcon({ followed, shared, userIsConnected })}
      </h4>
    );
  }
};

const useStyles = makeStyles(styles);

const AdminImpersonateNotification = ({ impersonatedSession }) => {
  const { shared, userIsConnected, followed } = impersonatedSession;

  const classes = useStyles();

  return (
    <div className="impersonate-notification">
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
      {getText({ followed, shared, userIsConnected })}
    </div>
  );
};

export default AdminImpersonateNotification;
