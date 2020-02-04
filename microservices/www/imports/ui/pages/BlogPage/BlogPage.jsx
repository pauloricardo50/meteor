//      
import React from 'react';
import { lifecycle } from 'recompose';

import T from 'core/components/Translation';
import PageHead from 'core/components/PageHead';
import { fetchBlogPosts } from 'core/api/blog';
import WwwLayout from '../../WwwLayout';
import { VARIANTS } from '../../WwwLayout/WwwTopNav';
import BlogList from './BlogList';

                        

const BlogPage = ({ posts }               ) => (
  <WwwLayout className="blog-page">
    <PageHead titleId="BlogPage.title" descriptionId="BlogPage.description" />
    <WwwLayout.TopNav variant={VARIANTS.GREY} />
    <WwwLayout.Content>
      <section className="blog-page-content">
        <h1>
          <T id="BlogPage.title" />
        </h1>
        <BlogList posts={posts} />
      </section>
    </WwwLayout.Content>
    <WwwLayout.Footer />
  </WwwLayout>
);

export default lifecycle({
  componentDidMount() {
    fetchBlogPosts().then(({ posts }) => this.setState({ posts }));
  },
})(BlogPage);
