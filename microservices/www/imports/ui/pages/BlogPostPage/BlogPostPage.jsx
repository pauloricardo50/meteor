// @flow
import React from 'react';
import { compose, lifecycle } from 'recompose';

import PageHead from 'core/components/PageHead';
import Button from 'core/components/Button';
import T from 'core/components/Translation';
import withMatchParam from 'core/containers/withMatchParam';
import { fetchBlogPost } from 'core/api/blog';
import Loading from 'core/components/Loading';
import BlogPostPageContent from './BlogPostPageContent';
import WwwLayout from '../../WwwLayout';
import { VARIANTS } from '../../WwwLayout/WwwTopNav';

type BlogPostPageProps = {};

const BlogPostPage = ({ loading = true, post }: BlogPostPageProps) => (
  <WwwLayout className="blog-post-page">
    <PageHead titleId="BlogPage.title" descriptionId="BlogPage.description" />
    <WwwLayout.TopNav variant={VARIANTS.GREY} />
    <WwwLayout.Content>
      <Button className="back" raised primary link to="/blog">
        <T id="general.back" />
      </Button>
      {loading ? <Loading /> : <BlogPostPageContent post={post} />}
    </WwwLayout.Content>
    <WwwLayout.Footer />
  </WwwLayout>
);

export default compose(
  withMatchParam('blogPostId'),
  lifecycle({
    componentDidMount() {
      const { blogPostId } = this.props;
      fetchBlogPost(blogPostId)
        .then(post => this.setState({ post }))
        .finally(() => this.setState({ loading: false }));
    },
  }),
)(BlogPostPage);
