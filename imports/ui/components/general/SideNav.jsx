import React from 'react';

const SideNav = () => (
  <nav className="side-nav">
    <a href="/"><img className="hidden-xs" src="img/logo_white.svg" alt="e-Potek" /></a>
    <ul>
      <li><a href="/main"><i className="fa fa-list" />Financements</a></li>
      <li><a href="/profile"><i className="fa fa-user" />Profil</a></li>
    </ul>
  </nav>
);

export default SideNav;
