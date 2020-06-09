import React from 'react';
import { Link } from 'gatsby';
import MenuItem from '@material-ui/core/MenuItem';
import { linkResolver } from '../../utils/linkResolver';
import './MenuItems.scss';

const MenuItems = ({ menuLinks, subMenu }) => {
  return menuLinks.map((menuLink, idx) => {
    const primaryLink = menuLink.primary?.link || menuLink.sub_link;
    const primaryLabel = menuLink.primary?.label || menuLink.sub_label;

    if (primaryLink?._linkType === 'Link.document') {
      return (
        <MenuItem
          key={idx}
          component={Link}
          className={subMenu ? 'submenu-link' : null}
          to={linkResolver(primaryLink._meta)}
        >
          {primaryLabel}
        </MenuItem>
      );
    }

    if (primaryLink?._linkType === 'Link.web') {
      return (
        <MenuItem
          key={idx}
          className={subMenu ? 'submenu-link' : null}
          to={primaryLink.url}
        >
          {primaryLabel}
        </MenuItem>
      );
    }

    if (menuLink.fields[0].sub_link) {
      return (
        <React.Fragment key={idx}>
          <MenuItem disabled>{primaryLabel}</MenuItem>

          <MenuItems menuLinks={menuLink.fields} subMenu />
        </React.Fragment>
      );
    }

    return null;
  });
};

export default MenuItems;
