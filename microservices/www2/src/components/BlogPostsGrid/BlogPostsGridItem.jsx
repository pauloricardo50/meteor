import React from 'react';
import { Link } from 'gatsby';

import IconButton from 'core/components/IconButton';

import { linkResolver } from '../../utils/linkResolver';
import { RichText } from '../prismic';

const BlogPostsGridItem = ({ post }) => {
  const defaultTitle = 'Untitled';

  const postFirstHero = post.body.find(section => section.type === 'hero');
  const postFirstImage = postFirstHero?.primary?.images;

  return (
    <Link to={linkResolver(post._meta)} className="blog-post-item">
      {postFirstImage && (
        <div
          className="blog-post-item-image"
          style={{ backgroundImage: `url("${postFirstImage.url}")` }}
        />
      )}
      <div className="flex center-align nowrap">
        <h2>
          <span>
            {RichText.asText(post.title).length !== 0
              ? RichText.asText(post.title)
              : defaultTitle}
          </span>

          <span className="secondary"> &bull; {post.date}</span>
        </h2>

        <IconButton type="right" />
      </div>
    </Link>
  );
};

export default BlogPostsGridItem;
