//
import React from 'react';
import { compose, lifecycle } from 'recompose';

import PageHead from 'core/components/PageHead';
import Button from 'core/components/Button';
import T from 'core/components/Translation';
import Loading from 'core/components/Loading';
import NotFound from 'core/components/NotFound/loadable';
import withMatchParam from 'core/containers/withMatchParam';
import { fetchBlogPostBySlug } from 'core/api/blog';
import BlogPostPageContent from './BlogPostPageContent';
import WwwLayout from '../../WwwLayout';
import { VARIANTS } from '../../WwwLayout/WwwTopNav';

const BlogPostPage = ({ loading = true, post }) => {
  if (post && post.error) {
    return <NotFound />;
  }

  return (
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
};

export default compose(
  withMatchParam('slug'),
  lifecycle({
    componentDidMount() {
      const { slug } = this.props;
      fetchBlogPostBySlug(slug)
        .then(post => this.setState({ post }))
        .finally(() => this.setState({ loading: false }));
    },
  }),
)(BlogPostPage);
