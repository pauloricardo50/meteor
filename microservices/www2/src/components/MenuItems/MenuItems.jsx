import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'gatsby';

import { linkResolver } from '../../utils/linkResolver';

const useStyles = makeStyles({
  gutters: {
    paddingLeft: '2rem',
  },
});

const MenuItems = ({ menuLinks, subMenu }) =>
  menuLinks.map((menuLink, idx) => {
    const classes = useStyles();
    const primaryLink = menuLink.primary?.link || menuLink.sub_link;
    const primaryLabel = menuLink.primary?.label || menuLink.sub_label;

    if (primaryLink?._linkType === 'Link.document') {
      return (
        <MenuItem
          key={idx}
          component={Link}
          classes={subMenu && classes}
          to={linkResolver(primaryLink._meta)}
          role="button"
        >
          {primaryLabel}
        </MenuItem>
      );
    }

    if (primaryLink?._linkType === 'Link.web') {
      return (
        <MenuItem
          key={idx}
          classes={subMenu && classes}
          to={primaryLink.url}
          role="button"
        >
          {primaryLabel}
        </MenuItem>
      );
    }

    if (menuLink.fields?.[0]?.sub_link) {
      return (
        <React.Fragment key={idx}>
          <MenuItem disabled>{primaryLabel}</MenuItem>

          <MenuItems menuLinks={menuLink.fields} subMenu />
        </React.Fragment>
      );
    }

    return null;
  });

export default MenuItems;
