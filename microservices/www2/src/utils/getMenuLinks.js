import { useContext } from 'react';
import useAllMenus from '../hooks/useAllMenus';
import LanguageContext from '../contexts/LanguageContext';

const getMenuLinks = menuName => {
  const [language] = useContext(LanguageContext);
  const allMenus = useAllMenus();

  const menu = allMenus.find(({ node }) => {
    return node._meta.uid === menuName && node._meta.lang.includes(language);
  });

  if (!menu) return null;

  return menu.node.menu_links;
};

export default getMenuLinks;
