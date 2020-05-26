import React from 'react';
import MenuList from '@material-ui/core/MenuList';
import MenuItems from '../MenuItems';
import getMenuLinks from '../../utils/getMenuLinks';

const FooterMenu = () => {
  const menuLinks = getMenuLinks('main');

  return (
    <MenuList>
      <MenuItems menuLinks={menuLinks} />
    </MenuList>
  );
};

export default FooterMenu;
