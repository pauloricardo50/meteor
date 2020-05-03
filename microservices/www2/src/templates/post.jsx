import React from 'react';
import { graphql, Link } from 'gatsby';
import { RichText } from 'prismic-reactjs';
import Layout from '../components/Layout';
import PageSections from '../components/PageSections';
import '../styles/post.scss';

export const query = graphql`
  query PRISMIC_POST($uid: String!, $lang: String!) {
    prismic {
      post(uid: $uid, lang: $lang) {
        _meta {
          id
          uid
          tags
          type
          lang
          alternateLanguages {
            id
            uid
            type
            lang
          }
        }
        title
        date
        author {
          ... on PRISMIC_Blog_post_author {
            name
            title
            profile_photo
          }
        }
        body {
          ... on PRISMIC_PostBodyHero {
            type
            primary {
              section_id
              image_layout
              images
            }
          }
          ... on PRISMIC_PostBodyQuote {
            type
            primary {
              quote
              quote_source
            }
          }
          ... on PRISMIC_PostBodyText {
            type
            primary {
              section_id
              justification
              content
            }
          }
        }
      }
    }
  }
`;

const Post = ({ data }) => {
  const { post: blogPost } = data.prismic;

  if (!blogPost) return null;

  return (
    <Layout>
      <div className="container post" data-wio-id={blogPost._meta.id}>
        <div className="post-header">
          <div className="back">
            {/* TODO: add language prefix here, or send through resolver */}
            <Link to="/blog">Revenir à l'index</Link>
          </div>

          {/* Render the edit button */}
          <h1 data-wio-id={blogPost._meta.id}>
            {blogPost.title ? RichText.asText(blogPost.title) : 'Untitled'}
          </h1>

          {blogPost.author && (
            <div>{`${blogPost.author.name}, ${blogPost.author.title} - ${blogPost.date}`}</div>
          )}
        </div>

        {blogPost.body && <PageSections sections={blogPost.body} />}
      </div>
    </Layout>
  );
};

export default Post;
