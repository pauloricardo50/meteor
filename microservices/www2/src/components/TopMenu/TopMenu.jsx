import React from 'react';

import getMenuLinks from '../../utils/getMenuLinks';
import Button from '../Button';

const TopNavMenu = () => {
  const menuLinks = getMenuLinks('top-nav');

  return (
    <div className="top-menu">
      {menuLinks.map(({ primary }, index) => {
        const primaryLink = primary?.link;
        const primaryLabel = primary?.label;

        return (
          <Button className="ml-8" prismicLink={primaryLink} key={index}>
            {primaryLabel}
          </Button>
        );
      })}
    </div>
  );
};

export default TopNavMenu;
