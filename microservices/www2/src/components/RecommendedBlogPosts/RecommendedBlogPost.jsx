import React from 'react';
import { faArrowRight } from '@fortawesome/pro-light-svg-icons/faArrowRight';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'gatsby';

import { linkResolver } from '../../utils/linkResolver';
import { RichText } from '../prismic';

const RecommendedBlogPost = ({ post }) => {
  const defaultTitle = 'Untitled';
  const postFirstHero = post.body.find(section => section.type === 'hero');
  const postFirstImage = postFirstHero?.primary?.images;

  return (
    <div className="blog-post">
      {postFirstImage && (
        <div
          className="blog-post-image"
          style={{ backgroundImage: `url("${postFirstImage.url}")` }}
        />
      )}

      <div className="blog-post-content text-m">
        <Link to={linkResolver(post._meta)}>
          {RichText.asText(post.title).length !== 0
            ? RichText.asText(post.title)
            : defaultTitle}

          <span className="blog-post-meta">
            <span>{` • `}</span>
            <time>{post.date}</time>
          </span>

          <span className="blog-post-more">
            <FontAwesomeIcon icon={faArrowRight} />
          </span>
        </Link>
      </div>
    </div>
  );
};

export default RecommendedBlogPost;
