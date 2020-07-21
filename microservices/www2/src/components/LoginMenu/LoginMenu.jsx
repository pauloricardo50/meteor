import './LoginMenu.scss';

import React, { useContext, useState } from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import PersonOutline from '@material-ui/icons/PersonOutline';

import LanguageContext from '../../contexts/LanguageContext';
import { getLanguageData } from '../../utils/languages';
import { trackCTA } from '../../utils/tracking';
import { useLayoutContext } from '../Layout/LayoutContext';

const useStyles = makeStyles(theme => ({
  root: {
    marginRight: 8,
    '& [class*="MuiSvgIcon-root"]': {
      color: theme.palette.primary.main,
    },
  },
}));

const LoginMenu = ({ placement }) => {
  const { tracking_id: pageTrackingId } = useLayoutContext();
  const [anchorEl, setAnchorEl] = useState(null);
  const [language] = useContext(LanguageContext);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div
      className={`login-menu${
        placement === 'mobile-nav' ? ' mobile-nav' : null
      }`}
    >
      <Button
        classes={useStyles()}
        aria-controls="login-menu"
        aria-haspopup="true"
        onClick={handleClick}
        variant="raised"
        color="primary"
        startIcon={<PersonOutline />}
      >
        {getLanguageData(language).loginText}
      </Button>

      <Menu
        id="login-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem
          role="button"
          component="a"
          href={`${process.env.EPOTEK_APP}/login`}
          onClick={() =>
            trackCTA({
              buttonTrackingId: 'Login app',
              toPath: `${process.env.EPOTEK_APP}/login`,
              pageTrackingId,
            })
          }
        >
          Login Clients
        </MenuItem>
        <MenuItem
          role="button"
          component="a"
          href={`${process.env.EPOTEK_PRO}/login`}
          onClick={() =>
            trackCTA({
              buttonTrackingId: 'Login pro',
              toPath: `${process.env.EPOTEK_PRO}/login`,
              pageTrackingId,
            })
          }
        >
          Login Pro
        </MenuItem>
      </Menu>
    </div>
  );
};

export default LoginMenu;
