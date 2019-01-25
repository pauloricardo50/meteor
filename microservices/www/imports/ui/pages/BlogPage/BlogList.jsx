// @flow
import React from 'react';
import Loading from 'core/components/Loading/Loading';
import Link from 'core/components/Link';

type BlogListProps = {};

const BlogList = ({ posts }: BlogListProps) => {
  if (!posts) {
    return <Loading />;
  }

  return (
    <div className="blog-list">
      {posts.map(({ ID, title, excerpt, post_thumbnail }) => (
        <div key={ID} className="blog-list-post">
          <Link className="card1 card-top" to={`/blog/${ID}`}>
            {post_thumbnail && (
              <div
                className="thumbnail"
                style={{ backgroundImage: `url("${post_thumbnail.URL}")` }}
              />
            )}
            <h4 dangerouslySetInnerHTML={{ __html: title }} />
            <span
              className="excerpt"
              dangerouslySetInnerHTML={{ __html: excerpt }}
            />
          </Link>
        </div>
      ))}
    </div>
  );
};

export default BlogList;
