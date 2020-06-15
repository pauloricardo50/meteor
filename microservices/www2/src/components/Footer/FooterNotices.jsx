import React from 'react';
import { RichText } from 'prismic-reactjs';
import { linkResolver } from '../../utils/linkResolver';
import useContentBlock from '../../hooks/useContentBlock';

const FooterNotices = ({ language }) => {
  const footerNotices = useContentBlock({
    uid: 'footer-notices',
    lang: language,
  });

  return (
    <div className="footer-notices">
      {RichText.render(footerNotices, linkResolver)}
    </div>
  );
};

export default FooterNotices;
