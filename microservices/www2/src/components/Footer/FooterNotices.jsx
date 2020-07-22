import React from 'react';

import useMedia from 'core/hooks/useMedia';

import useContentBlock from '../../hooks/useContentBlock';
import { RichText } from '../prismic';

const FooterNotices = ({ language }) => {
  const isMobile = useMedia({ maxWidth: 768 });

  const footerNotices = useContentBlock({
    uid: isMobile ? 'footer-notices-mobile' : 'footer-notices',
    lang: language,
  });

  return (
    <div className="footer-notices text-s">
      <RichText render={footerNotices} />
    </div>
  );
};

export default FooterNotices;
