import React, { PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { Link, NavLink } from 'react-router-dom';
import classnames from 'classnames';

import FlatButton from 'material-ui/FlatButton';
import PowerOffIcon from 'material-ui/svg-icons/action/power-settings-new';

const styles = {
  logo: {
    maxHeight: 25,
    paddingLeft: 20,
    paddingRight: 20,
  },
};

const userLinks = [
  {
    link: '/app',
    icon: <span className="icon fa fa-home fa-2x" />,
    label: 'Tableau de Bord',
  },
  {
    link: '/app/me',
    icon: <span className="icon fa fa-id-card fa-2x" />,
    label: 'Mes Informations',
  },
  {
    link: '/app/profile',
    icon: <span className="icon fa fa-user-circle fa-2x" />,
    label: 'Mon Profil',
  },
  {
    link: '/app/contact',
    icon: (
      <span className="icon">
        <img src="/img/yannis.jpg" className="photo" />
      </span>
    ),
    label: 'Votre Conseiller',
  },
];

const adminLinks = [
  {
    link: '/admin',
    icon: <span className="icon fa fa-home fa-2x" />,
    label: 'Home',
  },
  {
    link: '/admin/users',
    icon: <span className="icon fa fa-users fa-2x" />,
    label: 'Utilisateurs',
  },
  {
    link: '/admin/requests',
    icon: <span className="icon fa fa-files-o fa-2x" />,
    label: 'Demandes de prêt',
  },
];

const partnerLinks = [
  {
    link: '/partner',
    icon: <span className="icon fa fa-home fa-2x" />,
    label: 'Home',
  },
];

const SideNav = props => {
  let links = [];

  switch (props.type) {
    case 'user':
      links = userLinks;
      break;
    case 'admin':
      links = adminLinks;
      break;
    case 'partner':
      links = partnerLinks;
      break;
    default:
      break;
  }

  // never hide sidenav for admins
  const classes = classnames({
    'side-nav': true,
    'hidden-xs': props.type !== 'admin',
  });

  return (
    <nav className={classes}>
      <Link to="/home">
        <img
          src="/img/logo_black.svg"
          alt="e-Potek"
          style={styles.logo}
          className="logo"
        />
      </Link>

      <ul className="side-nav-list">
        {links.map(link => (
          <li key={link.link}>
            <NavLink exact to={link.link} activeClassName="active-link">
              {link.icon}
              <h5>{link.label}</h5>
            </NavLink>
          </li>
        ))}
      </ul>

      <div className="logout text-center">
        <FlatButton
          label="Déconnexion"
          onTouchTap={() => Meteor.logout(() => props.history.push('/home'))}
          icon={<PowerOffIcon />}
        />
      </div>

    </nav>
  );
};

SideNav.PropTypes = {
  type: PropTypes.string.isRequired,
};

export default SideNav;
