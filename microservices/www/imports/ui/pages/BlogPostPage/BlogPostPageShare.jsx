//
import React from 'react';
import FacebookShareButton from 'react-share/lib/FacebookShareButton';
import LinkedinShareButton from 'react-share/lib/LinkedinShareButton';
import WhatsappShareButton from 'react-share/lib/WhatsappShareButton';
import EmailShareButton from 'react-share/lib/EmailShareButton';
import FacebookIcon from 'react-share/lib/FacebookIcon';
import LinkedinIcon from 'react-share/lib/LinkedinIcon';
import WhatsappIcon from 'react-share/lib/WhatsappIcon';
import EmailIcon from 'react-share/lib/EmailIcon';

const BlogPostPageShare = ({ title }) => {
  const url = window.location.href;
  return (
    <>
      <p className="secondary">Partagez</p>
      <div className="blog-post-page-share">
        <FacebookShareButton url={url} className="share-button">
          <FacebookIcon size={32} round />
        </FacebookShareButton>

        <LinkedinShareButton
          url={url}
          title={title}
          windowWidth={750}
          windowHeight={600}
          className="share-button"
        >
          <LinkedinIcon size={32} round />
        </LinkedinShareButton>

        <WhatsappShareButton
          url={url}
          title={title}
          separator=" - "
          className="share-button"
        >
          <WhatsappIcon size={32} round />
        </WhatsappShareButton>

        <EmailShareButton
          url={url}
          subject={title}
          body={`${title} - e-Potek - ${url}`}
          className="share-button"
        >
          <EmailIcon size={32} round />
        </EmailShareButton>
      </div>
    </>
  );
};

export default BlogPostPageShare;
