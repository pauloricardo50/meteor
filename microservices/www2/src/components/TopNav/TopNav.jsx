import React from 'react';
import Toolbar from '@material-ui/core/Toolbar/Toolbar';
import TopMenu from '../TopMenu';
import MainMenu from '../MainMenu';
import Button from '../Button';
import TopNavLogo from './TopNavLogo';
import './TopNav.scss';

const TopNav = () => (
  <Toolbar className="top-nav">
    <div className="top-nav-left">
      <MainMenu />
      <TopMenu menuName="top-nav" />
    </div>

    <TopNavLogo />

    <div className="top-nav-right">
      {/* <LoginLink /> */}
      <div className="login-link">Se connecter</div>

      <Button className="cta--button" raised primary link to="/">
        Obtenir un prêt
      </Button>
    </div>
  </Toolbar>
);

export default TopNav;
