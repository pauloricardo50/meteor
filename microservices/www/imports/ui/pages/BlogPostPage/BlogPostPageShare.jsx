// @flow
import React from 'react';
import {
  FacebookShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  EmailShareButton,
  FacebookIcon,
  LinkedinIcon,
  WhatsappIcon,
  EmailIcon,
} from 'react-share';

type BlogPostPageShareProps = {};

const BlogPostPageShare = ({ title }: BlogPostPageShareProps) => {
  const url = window.location.href;
  return (
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
  );
};

export default BlogPostPageShare;
