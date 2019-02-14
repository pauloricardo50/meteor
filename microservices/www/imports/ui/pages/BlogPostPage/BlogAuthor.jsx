// @flow
import React from 'react';

import T from 'core/components/Translation';

type BlogAuthorProps = {};

const BlogAuthor = ({ author: { name, avatar_URL } }: BlogAuthorProps) => (
  <div className="blog-author">
    <img src={avatar_URL} alt={name} />
    <h5>
      <T id="BlogAuthor.by" values={{ name }} />
    </h5>
  </div>
);

export default BlogAuthor;
