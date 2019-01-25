// @flow
import React from 'react';
import moment from 'moment';

import BlogAuthor from './BlogAuthor';

type BlogPostPageContentProps = {};

const BlogPostPageContent = ({
  post: { title, date, content, author, post_thumbnail },
}: BlogPostPageContentProps) => (
  <section className="blog-post-page-content card1 card-top">
    {post_thumbnail && (
      <img className="thumbnail" src={post_thumbnail.URL} alt="" />
    )}
    <h1 dangerouslySetInnerHTML={{ __html: title }} />
    <h4 className="date secondary">
      {moment(date).format('dddd, D MMMM YYYY')}
    </h4>

    <article dangerouslySetInnerHTML={{ __html: content }} />

    <BlogAuthor author={author} />
  </section>
);

export default BlogPostPageContent;
