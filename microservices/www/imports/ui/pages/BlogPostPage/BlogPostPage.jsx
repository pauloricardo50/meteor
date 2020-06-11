import React from 'react';
import { compose, lifecycle } from 'recompose';

import { fetchBlogPostBySlug } from 'core/api/blog';
import Button from 'core/components/Button';
import Loading from 'core/components/Loading';
import NotFound from 'core/components/NotFound/loadable';
import PageHead from 'core/components/PageHead';
import T from 'core/components/Translation';
import withMatchParam from 'core/containers/withMatchParam';

import WwwLayout from '../../WwwLayout';
import { VARIANTS } from '../../WwwLayout/WwwTopNav';
import BlogPostPageContent from './BlogPostPageContent';

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
