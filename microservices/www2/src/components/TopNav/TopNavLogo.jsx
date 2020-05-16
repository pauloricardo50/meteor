import React, { useContext } from 'react';
import { Link } from 'gatsby';
import LanguageContext from '../../contexts/LanguageContext';
import { getLanguageData } from '../../utils/languages.js';
import epotekLogo from '../../images/epotek_logo.png';

// TODO: replace logo with SVG version ?
const TopNavlogo = () => {
  const [language] = useContext(LanguageContext);
  const { homeLink } = getLanguageData(language);

  return (
    <div className="top-nav-logo">
      <Link to={homeLink} className="link">
        <img src={epotekLogo} alt="e-Potek" className="logo-home" />
      </Link>
    </div>
  );
};

export default TopNavlogo;
