import React from 'react';

import getMenuLinks from '../../utils/getMenuLinks';
import Link from '../Link';

const MenuCategory = ({ category }) => {
  const { primary, fields = [] } = category;

  return (
    <div className="footer-menu-category">
      <b className="footer-menu-category-title">{primary.label}</b>
      {fields?.length &&
        fields.map(({ sub_link, sub_label }) => (
          <Link
            className="footer-menu-item"
            prismicLink={sub_link}
            key={sub_label}
          >
            {sub_label}
          </Link>
        ))}
    </div>
  );
};

const FooterMenu = () => {
  const menuLinks = getMenuLinks('footer-menu');

  return (
    <div className="footer-menu">
      {menuLinks.map(category => (
        <MenuCategory category={category} key={category.primary?.label} />
      ))}
    </div>
  );
};

export default FooterMenu;
