import React from 'react';

const SideNav = () => (
  <nav className="side-nav">

    {/* Large screens */}
    <a href="/" className="hidden-xs">
      <img src="img/logo_black.svg" alt="e-Potek" width="160px" style={{ paddingLeft: 20, paddingRight: 20 }} />
    </a>
    <ul className="hidden-xs">
      <li><h5 className="active bold"><span className="fa fa-home active" />  Rue des Alouettes 12</h5></li>
      <li className="secondary">CHF 1'152'000</li>
    </ul>
    {/* TODO: change this class to some form of visible-xs-XXX, didn't work so far */}
    <article className="mask1 finance-widget hidden-xs">
      <h4>A Financer</h4>
    </article>

    {/* Small screens */}
    <ul className="hidden-sm hidden-md hidden-lg">
      <li><a href=""><i className="fa fa-home" />Ma Demande</a></li>
      <li><a href=""><i className="fa fa-dollar" />Mon Financement</a></li>
      <li><a href=""><i className="fa fa-user" />Mon Profil</a></li>
    </ul>

  </nav>
);

export default SideNav;
