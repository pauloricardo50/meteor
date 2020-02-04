//      
import React from 'react';

import T from 'core/components/Translation';
import Loading from 'core/components/Loading';
import Link from 'core/components/Link';

                        

const BlogList = ({ posts }               ) => {
  if (!posts) {
    return <Loading />;
  }

  return (
    <div className="blog-list">
      {posts.map(({ ID, title, excerpt, post_thumbnail, slug }) => (
        <div key={ID} className="blog-list-post">
          <Link className="card1 card-top" to={`/blog/${slug}`}>
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
            <T id="BlogList.readMore" />
          </Link>
        </div>
      ))}
    </div>
  );
};

export default BlogList;
