// @flow
import React from 'react';
import moment from 'moment';

import BlogAuthor from './BlogAuthor';

type BlogPostPageContentProps = {
  post: Object,
};

const BlogPostPageContent = ({
  post: { title, date, content, author },
}: BlogPostPageContentProps) => (
  <section className="blog-post-page-content card1 card-top">
    <h1 dangerouslySetInnerHTML={{ __html: title }} />
    <h4 className="date secondary">
      {moment(date).format('dddd, D MMMM YYYY')}
    </h4>

    <article dangerouslySetInnerHTML={{ __html: content }} />

    <BlogAuthor author={author} />
  </section>
);

export default BlogPostPageContent;
