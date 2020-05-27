import React from 'react';
import { Link } from 'gatsby';
import { RichText } from 'prismic-reactjs';
import { linkResolver } from '../../utils/linkResolver';
import { faArrowRight } from '@fortawesome/pro-light-svg-icons/faArrowRight';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const RecommendedBlogPost = ({ post }) => {
  const defaultTitle = 'Untitled';
  const postFirstHero = post.body.find(section => section.type === 'hero');
  const postFirstImage = postFirstHero?.primary?.images;

  return (
    <div className="blog-post">
      {postFirstImage && (
        <div className="blog-post__image">
          <img src={postFirstImage.url} alt={postFirstImage.alt} />
        </div>
      )}

      <div className="blog-post__content">
        <Link to={linkResolver(post._meta)}>
          {RichText.asText(post.title).length !== 0
            ? RichText.asText(post.title)
            : defaultTitle}

          <span className="blog-post__meta">
            <span>{` • `}</span>
            <time>{post.date}</time>
          </span>

          <span className="blog-post__more">
            <FontAwesomeIcon icon={faArrowRight} />
          </span>
        </Link>
      </div>
    </div>
  );
};

export default RecommendedBlogPost;
