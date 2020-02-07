import React from 'react';
import moment from 'moment';
import { Helmet } from 'react-helmet';

import BlogAuthor from './BlogAuthor';
import BlogPostSeo from './BlogPostSeo';
import BlogPostPageShare from './BlogPostPageShare';
import AutoTooltipInjector from './AutoTooltipInjector';

export const htmlDecode = input => {
  const e = document.createElement('div');
  e.innerHTML = input;
  // handle case of empty input
  return e.childNodes.length === 0 ? '' : e.childNodes[0].nodeValue;
};

const BlogPostPageContent = ({ post }) => {
  const { title, date, content, author, excerpt, post_thumbnail, slug } = post;
  const escapedTitle = htmlDecode(title);
  const headerTitle = `${escapedTitle} | e-Potek`;
  return (
    <section className="blog-post-page-content card1 card-top">
      <Helmet>
        <title>{headerTitle}</title>
        <BlogPostSeo post={post} url={`/blog/${slug}`} />
      </Helmet>
      <h1 dangerouslySetInnerHTML={{ __html: title }} />

      <h4 className="date secondary">
        {moment(date).format('dddd, D MMMM YYYY')}
      </h4>

      <article>
        <AutoTooltipInjector html={content} />
      </article>

      <BlogPostPageShare title={escapedTitle} />
    </section>
  );
};

export default BlogPostPageContent;
