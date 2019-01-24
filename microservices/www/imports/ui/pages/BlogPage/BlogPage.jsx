// @flow
import React from 'react';
import { lifecycle } from 'recompose';
import moment from 'moment';

import PageHead from 'core/components/PageHead';
import WwwLayout from '../../WwwLayout';
import { VARIANTS } from '../../WwwLayout/WwwTopNav';
import BlogAuthor from './BlogAuthor';

type BlogPageProps = {};

const BlogPage = ({ posts }: BlogPageProps) => {
  if (!posts) {
    return <h1>Loading!</h1>;
  }
  return (
    <WwwLayout className="blog-page">
      <PageHead titleId="BlogPage.title" descriptionId="BlogPage.description" />
      <WwwLayout.TopNav variant={VARIANTS.GREY} />
      <WwwLayout.Content>
        <section className="blog-page-content">
          <h1>{posts[0].title}</h1>
          <h4 className="secondary">
            {moment(posts[0].date).format('dddd, D MMMM YYYY')}
          </h4>
          <div dangerouslySetInnerHTML={{ __html: posts[0].content }} />

          <BlogAuthor author={posts[0].author} />

          {posts.map(post => (
            <div>{post.title}</div>
          ))}
        </section>
      </WwwLayout.Content>
      <WwwLayout.Footer />
    </WwwLayout>
  );
};

export default lifecycle({
  componentDidMount() {
    fetch('https://public-api.wordpress.com/rest/v1.1/sites/blogepotek.wordpress.com/posts')
      .then(result => result.json())
      .then(({ posts }) => this.setState({ posts }));
  },
})(BlogPage);
