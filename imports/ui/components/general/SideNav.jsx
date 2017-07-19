import PropTypes from 'prop-types';
import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Link, NavLink } from 'react-router-dom';
import classnames from 'classnames';

import Button from '/imports/ui/components/general/Button.jsx';
import PowerOffIcon from 'material-ui/svg-icons/action/power-settings-new';

const styles = {
  logo: {
    maxHeight: 25,
    paddingLeft: 20,
    paddingRight: 20,
  },
};

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
  {
    link: '/admin/dev',
    icon: <span className="icon fa fa-code fa-2x" />,
    label: 'Dev',
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
        {links.map(link =>
          <li key={link.link}>
            <NavLink exact to={link.link} activeClassName="active-link">
              {link.icon}
              <h5>
                {link.label}
              </h5>
            </NavLink>
          </li>,
        )}
      </ul>

      <div className="logout text-center">
        <Button
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
