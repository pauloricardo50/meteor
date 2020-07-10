import React from 'react';

import getMenuLinks from '../../utils/getMenuLinks';
import { linkResolver } from '../../utils/linkResolver';

const MenuItem = ({ item }) => {
  const { sub_label: label, sub_link: link } = item;
  const linkType = link?._linkType;

  if (linkType === 'Link.document') {
    return (
      <a className="footer-menu-item" href={linkResolver(link._meta)}>
        {label}
      </a>
    );
  }

  if (linkType === 'Link.web') {
    return (
      <a className="footer-menu-item" href={link.url}>
        {label}
      </a>
    );
  }

  return null;
};

const MenuCategory = ({ category }) => {
  const { primary, fields = [] } = category;

  return (
    <div className="footer-menu-category">
      <b className="footer-menu-category-title">{primary.label}</b>
      {fields?.length &&
        fields.map(item => <MenuItem item={item} key={item.sub_label} />)}
    </div>
  );
};

const FooterMenu = () => {
  const menuLinks = getMenuLinks('footer-menu');
  console.log('menuLinks:', menuLinks);

  return (
    <div className="footer-menu">
      {menuLinks.map(category => (
        <MenuCategory category={category} key={category.primary?.label} />
      ))}
    </div>
  );

  // return (
  //   <MenuList>
  //     <MenuItems menuLinks={menuLinks} />
  //   </MenuList>
  // );
};

export default FooterMenu;
