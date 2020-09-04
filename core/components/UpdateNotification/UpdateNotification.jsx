import { Meteor } from 'meteor/meteor';
import { Autoupdate } from 'meteor/autoupdate';
import { useTracker } from 'meteor/react-meteor-data';

/* global Reload */
import React, { useEffect, useState } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import { makeStyles } from '@material-ui/core/styles';
import cx from 'classnames';

import Button from '../Button';
import Icon from '../Icon';
import T from '../Translation';

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

const isDev = Meteor.isDevelopment;

const UpdateNotification = () => {
  const classes = useStyles();
  const [reload, setReload] = useState(null);
  const [reloading, setReloading] = useState(isDev);
  const [remainingSeconds, setRemainingSeconds] = useState(30);

  const updateAvailable = useTracker(() => Autoupdate.newClientAvailable(), []);

  useEffect(() => {
    // We can't remove _onMigrate callbacks,
    // but we can prevent them from blocking a reload.
    let disposed = false;
    let reloadRequested = false;

    Reload._onMigrate(_reload => {
      // If a function is passed to setReload it is treated as an
      // update function, so we have to wrap it to set
      setReload(() => () => {
        setReloading(true);
        reloadRequested = true;
        _reload();
      });

      // The first item in the array is if we are ready for the page to reload
      // Once all onMigrate callbacks say they are ready, it reloads
      return [isDev || disposed || reloadRequested];
    });

    return function () {
      disposed = true;
    };
  }, []);

  useEffect(() => {
    if (updateAvailable) {
      const interval = setInterval(() => {
        setRemainingSeconds(current => {
          const next = Math.max(0, current - 1);

          if (next === 0) {
            reload();
            clearInterval(interval);
          }

          return next;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [updateAvailable, reload]);

  if (!updateAvailable) {
    return null;
  }

  return (
    <Snackbar
      open
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      autoHideDuration={null}
    >
      <SnackbarContent
        className={classes.infoSnackbar}
        message={
          <div className={cx(classes.message, 'update-notification-message')}>
            <Icon
              type="info"
              className={cx(classes.icon, classes.iconVariant)}
            />
            <span>
              <T
                id="UpdateNotification.updateAvailable"
                values={{ seconds: remainingSeconds }}
              />
            </span>
          </div>
        }
        action={
          <Button
            variant="outlined"
            size="small"
            className={classes.button}
            onClick={() => reload()}
          >
            <T
              id={`UpdateNotification.${reloading}` ? 'reloading' : 'reloadNow'}
            />
          </Button>
        }
      />
    </Snackbar>
  );
};

export default UpdateNotification;
