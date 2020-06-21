import React, { useContext } from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import AppBar from '@material-ui/core/AppBar';
import { makeStyles } from '@material-ui/core/styles';
import TopMenu from '../TopMenu';
import MainMenu from '../MainMenu';
import LoginMenu from '../LoginMenu';
import Button from '../Button';
import TopNavLogo from './TopNavLogo';
import LanguageContext from '../../contexts/LanguageContext';
import { getLanguageData } from '../../utils/languages';
import './TopNav.scss';

const useStyles = makeStyles(theme => ({
  root: {
    flexDirection: 'row',
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
      <div className="top-nav-left">
        <MainMenu />

        {matches && <TopMenu menuName="top-nav" />}
      </div>

      <TopNavLogo />

      <div className="top-nav-right">
        {matches && <LoginMenu />}

        <Button className="cta--button" raised primary link to="/">
          {getLanguageData(language).getALoanText}
        </Button>
      </div>
    </AppBar>
  );
};

export default TopNav;
