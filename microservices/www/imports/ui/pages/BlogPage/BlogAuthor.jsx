// @flow
import React from 'react';

type BlogAuthorProps = {};

const BlogAuthor = ({ author: { name, avatar_URL } }: BlogAuthorProps) => (
  <div className="blog-author">
    <img src={avatar_URL} alt={name} />
    <h4>{name}</h4>
  </div>
);

export default BlogAuthor;
