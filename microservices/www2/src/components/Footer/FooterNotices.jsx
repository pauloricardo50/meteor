import React from 'react';

import useContentBlock from '../../hooks/useContentBlock';
import { linkResolver } from '../../utils/linkResolver';
import { RichText } from '../prismic';

const FooterNotices = ({ language }) => {
  const footerNotices = useContentBlock({
    uid: 'footer-notices',
    lang: language,
  });

  return (
    <div className="footer-notices text-s">
      <RichText render={footerNotices} linkResolver={linkResolver} />
    </div>
  );
};

export default FooterNotices;
