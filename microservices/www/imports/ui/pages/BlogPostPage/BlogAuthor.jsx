//
import React from 'react';

import T from 'core/components/Translation';

const BlogAuthor = ({ author: { name, avatar_URL } }) => (
  <div className="blog-author">
    <img src={avatar_URL} alt={name} />
    <h5>
      <T id="BlogAuthor.by" values={{ name }} />
    </h5>
  </div>
);

export default BlogAuthor;
