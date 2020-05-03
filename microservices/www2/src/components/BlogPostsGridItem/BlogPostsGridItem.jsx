import React from 'react';
import { Link } from 'gatsby';
import { RichText, Date } from 'prismic-reactjs';
import { linkResolver } from '../../utils/linkResolver';
import './BlogPostsGridItem.scss';

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
    <div className="blog-post-item">
      {postFirstImage && (
        <img src={postFirstImage.url} alt={postFirstImage.alt} />
      )}
      <h2>
        <Link to={linkResolver(post._meta)}>
          {RichText.asText(post.title).length !== 0
            ? RichText.asText(post.title)
            : defaultTitle}
        </Link>
      </h2>
      <p className="blog-post-meta">
        <time>{post.date}</time>
      </p>
    </div>
  );
};

export default BlogPostsGridItem;
