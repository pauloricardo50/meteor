import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'gatsby';

import { linkResolver } from '../../utils/linkResolver';

const useStyles = makeStyles(theme => ({
  root: {
    [theme.breakpoints.down('md')]: {
      minHeight: 32,
    },
  },
  gutters: {
    paddingLeft: ({ subMenu }) => (subMenu ? '2rem' : undefined),
  },
}));

const MenuItems = ({ menuLinks = [], subMenu, onClick }) => {
  const classes = useStyles({ subMenu });

  return menuLinks?.map((menuLink, idx) => {
    const primaryLink = menuLink.primary?.link || menuLink.sub_link;
    const primaryLabel = menuLink.primary?.label || menuLink.sub_label;

    if (primaryLink?._linkType === 'Link.document') {
      return (
        <MenuItem
          key={idx}
          component={Link}
          classes={classes}
          to={linkResolver(primaryLink._meta)}
          role="button"
          onClick={onClick}
        >
          {primaryLabel}
        </MenuItem>
      );
    }

    if (primaryLink?._linkType === 'Link.web') {
      return (
        <MenuItem
          key={idx}
          classes={classes}
          to={primaryLink.url}
          role="button"
          onClick={onClick}
        >
          {primaryLabel}
        </MenuItem>
      );
    }

    if (menuLink.fields?.[0]?.sub_link) {
      return (
        <React.Fragment key={idx}>
          <MenuItem disabled>{primaryLabel}</MenuItem>

          <MenuItems menuLinks={menuLink.fields} subMenu onClick={onClick} />
        </React.Fragment>
      );
    }

    return null;
  });
};

export default MenuItems;
