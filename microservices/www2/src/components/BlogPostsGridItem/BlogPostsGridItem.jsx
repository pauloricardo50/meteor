import './BlogPostsGridItem.scss';

import React from 'react';
import { Link } from 'gatsby';
import { Date, RichText } from 'prismic-reactjs';

import IconButton from 'core/components/IconButton';

import { linkResolver } from '../../utils/linkResolver';

const BlogPostsGridItem = ({ post }) => {
  // TODO: if need to format dates differently by lang
  // let postDate = Date(post.date);
  // postDate = postDate
  //   ? new Intl.DateTimeFormat('en-US', {
  //       month: 'short',
  //       day: '2-digit',
  //       year: 'numeric',
  //     }).format(postDate)
  //   : '';

  const defaultTitle = 'Untitled';

  const postFirstHero = post.body.find(section => section.type === 'hero');
  const postFirstImage = postFirstHero?.primary?.images;

  return (
    <Link to={linkResolver(post._meta)} className="blog-post-item">
      {postFirstImage && (
        <img src={postFirstImage.url} alt={postFirstImage.alt} />
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
