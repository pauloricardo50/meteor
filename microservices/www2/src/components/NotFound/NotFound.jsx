import { useEffect } from 'react';
import { navigate } from 'gatsby';
import { getLanguageData } from '../../utils/languages.js';

const NotFound = ({ pageLang, pageType }) => {
  useEffect(() => {
    if (pageType === 'post') {
      navigate(getLanguageData(pageLang).blogLink);
    } else {
      navigate(getLanguageData(pageLang).homeLink);
    }
  }, []);

  return null;
};

export default NotFound;
