import React from 'react';
import { Link } from 'gatsby';
import useAllMenus from '../../hooks/useAllMenus';
import { linkResolver } from '../../utils/linkResolver';

const getLink = (menuLink) => {
  if (menuLink.link === null) return menuLink.label;

  if (menuLink.link._linkType === 'Link.document') {
    return <Link to={linkResolver(menuLink.link._meta)}>{menuLink.label}</Link>;
  }
  if (menuLink.link._linkType === 'Link.web') {
    return <a href={menuLink.link.url}>{menuLink.label}</a>;
  }

  return menuLink.label;
};

const MainMenu = () => {
  const allMenus = useAllMenus();

  // TODO: get localized lang
  const main = allMenus.find((menu) => {
    return menu.node._meta.uid === 'main' && menu.node._meta.lang === 'fr-ch';
  });

  if (!main) return null;

  return (
    <nav className="menu menu--main">
      <ul>
        {main.node.menu_links.map((menuLink, idx) => (
          <li key={idx}>{getLink(menuLink)}</li>
        ))}
      </ul>
    </nav>
  );
};

export default MainMenu;
