import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import React, { useEffect, useState } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import { makeStyles } from '@material-ui/core/styles';
import cx from 'classnames';

import Button from '../Button';
import Icon from '../Icon';

const useStyles = makeStyles(theme => ({
  errorSnackbar: {
    backgroundColor: theme.palette.error.main,
  },
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing(1),
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
  button: {
    color: 'white',
    borderColor: 'white',
  },
}));

export const DisconnectNotification = ({
  status: { connected },
  timeout = 5000,
}) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [timer, setTimer] = useState(null);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    if (connected) {
      if (timer) {
        clearTimeout(timer);
        setTimer(null);
      }
      if (open === true) {
        setOpen(false);
      }
      return;
    }

    if (!connected && !timer) {
      setTimer(
        setTimeout(() => {
          setOpen(true);
        }, timeout),
      );
    }

    return () => timer && clearTimeout(timer);
  }, [connected, open]);

  return (
    <Snackbar
      open={open}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      autoHideDuration={null}
      onClose={handleClose}
    >
      <SnackbarContent
        className={classes.errorSnackbar}
        aria-describedby="disconnected-notification"
        message={
          <div
            className={cx(classes.message, 'disconnect-notification-message')}
          >
            <Icon
              type="info"
              className={cx(classes.icon, classes.iconVariant)}
            />
            <span>Il semble que vous soyiez déconnecté</span>
          </div>
        }
        action={
          <Button
            variant="outlined"
            size="small"
            className={classes.button}
            onClick={() => Meteor.reconnect()}
          >
            Se reconnecter
          </Button>
        }
      />
    </Snackbar>
  );
};

export default withTracker(() => ({ status: Meteor.status() }))(
  DisconnectNotification,
);
