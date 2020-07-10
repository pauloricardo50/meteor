import { useContext } from 'react';

import LanguageContext from '../contexts/LanguageContext';
import useAllMenus from '../hooks/useAllMenus';

const getMenuLinks = menuName => {
  const [language] = useContext(LanguageContext);
  const allMenus = useAllMenus();

  const menu = allMenus.find(
    ({ node }) =>
      node._meta.uid === menuName && node._meta.lang.includes(language),
  );

  if (!menu) return null;

  return menu.node.nav;
};

export default getMenuLinks;
