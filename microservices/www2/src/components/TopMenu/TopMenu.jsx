import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MenuList from '@material-ui/core/MenuList';
import MenuItems from '../MenuItems';
import getMenuLinks from '../../utils/getMenuLinks';

const useStyles = makeStyles({
  root: {
    display: 'flex',
  },
});

const TopNavMenu = () => {
  const menuLinks = getMenuLinks('top-nav');
  const classes = useStyles();

  return (
    <MenuList classes={classes}>
      <MenuItems menuLinks={menuLinks} />
    </MenuList>
  );
};

export default TopNavMenu;
