import React from 'react';
import Toolbar from '@material-ui/core/Toolbar/Toolbar';
import IconButton from 'core/components/IconButton';
import Menu from '../Menu';
import Button from '../Button';
import TopNavLogo from './TopNavLogo';
import './TopNav.scss';

// TODO: check to see if Toolbar component this outputs a nav tag
const TopNav = () => (
  <Toolbar className="top-nav">
    <div className="top-nav-left">
      {/* TODO: use font awesome icon for menu toggle ? */}
      <IconButton size="small" type="menu" tooltip="menu" />
      <Menu menuName="top-nav" />
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
