import React, { useEffect, useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { makeStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import cx from 'classnames';
import Icon from '../Icon';
import Button from '../Button';

const useStyles = makeStyles(theme => ({
  infoSnackbar: {
    backgroundColor: theme.palette.primary.dark,
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

const UpdateNotification = () => {
  const classes = useStyles();
  const [reload, setReload] = useState(null);
  const [reloadRequested, setReloadRequested] = useState(false);

  const updateAvailable = useTracker(() => {
    return Autoupdate.newClientAvailable();
  }, []);

  useEffect(() => {
    // We can't remove _onMigrate callbacks,
    // but we can prevent them from blocking a reload.
    let disposed = false;
    Reload._onMigrate((reload) => {
      setReload(reload);

      return [disposed || reloadRequested];
    });

    return function () {
      disposed = true;
    }
  }, [reloadRequested])

  if (!updateAvailable) {
    return null;
  }

  return (
    <Snackbar
      open={true}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      autoHideDuration={null}
    >
      <SnackbarContent
        className={classes.infoSnackbar}
        message={
          <div
            className={cx(classes.message, 'update-notification-message')}
          >
            <Icon
              type="info"
              className={cx(classes.icon, classes.iconVariant)}
            />
            <span>Update available</span>
          </div>
        }
        action={
          <Button
            variant="outlined"
            size="small"
            className={classes.button}
            onClick={() => { setReloadRequested(true); reload(); }}
          >
            Reload
          </Button>
        }
      />
    </Snackbar>
  )
}

export default UpdateNotification;
