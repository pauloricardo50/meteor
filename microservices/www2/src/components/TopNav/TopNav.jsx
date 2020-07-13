import './TopNav.scss';

import React, { useContext } from 'react';
import AppBar from '@material-ui/core/AppBar';
import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import colors from 'core/config/colors';

import LanguageContext from '../../contexts/LanguageContext';
import { getLanguageData } from '../../utils/languages';
import Button from '../Button';
import LoginMenu from '../LoginMenu';
import MainMenu from '../MainMenu';
import TopMenu from '../TopMenu';
import TopNavLogo from './TopNavLogo';

const useStyles = makeStyles(() => ({
  root: {
    flexDirection: 'row',
    boxShadow: 'unset',
    borderBottom: `1px solid ${colors.borderGreyLight}`,
  },
}));

const TopNav = () => {
  const [language] = useContext(LanguageContext);
  const matches = useMediaQuery(theme => theme.breakpoints.up('md'));

  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={1}
      classes={useStyles()}
      className="top-nav"
    >
      <div className="top-nav-content">
        <div className="top-nav-left">
          <MainMenu />

          {matches && <TopMenu menuName="top-nav" />}
        </div>

        <TopNavLogo />

        <div className="top-nav-right">
          {matches && <LoginMenu />}

          <Button raised primary Component="a" href={process.env.EPOTEK_APP}>
            {getLanguageData(language).getALoanText}
          </Button>
        </div>
      </div>
    </AppBar>
  );
};

export default TopNav;
