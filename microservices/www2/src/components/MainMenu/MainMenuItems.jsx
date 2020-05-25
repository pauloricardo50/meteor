import React from 'react';
import { Link } from 'gatsby';
import MenuItem from '@material-ui/core/MenuItem';
import { linkResolver } from '../../utils/linkResolver';

const MainMenuItems = ({ menuLinks }) => {
  return menuLinks.map((menuLink, idx) => {
    if (menuLink.link === null) return null;

    if (menuLink.link._linkType === 'Link.document') {
      return (
        <MenuItem
          key={idx}
          component={Link}
          to={linkResolver(menuLink.link._meta)}
        >
          {menuLink.label}
        </MenuItem>
      );
    }

    if (menuLink.link._linkType === 'Link.web') {
      return (
        <MenuItem key={idx} to={menuLink.link.url}>
          {menuLink.label}
        </MenuItem>
      );
    }
  });
};

export default MainMenuItems;
