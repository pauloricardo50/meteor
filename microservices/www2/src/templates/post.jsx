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

const Post = ({ data, pageContext: { rootQuery, ...pageContext } }) => {
  const { post: blogPost } = data.prismic;

  if (!blogPost) return null;

  // TODO: move these to centralized localization json file
  const blogHome = {
    'fr-ch': {
      shortLang: 'fr',
      linkText: `Revenir à l'index`,
    },
    'en-us': {
      shortLang: 'en',
      linkText: `Return to index`,
    },
  }[pageContext.lang];

  // TODO: add structured data - https://developers.google.com/search/docs/data-types/article
  return (
    <Layout pageContext={pageContext} pageName={blogPost.title}>
      <div className="post" data-wio-id={blogPost._meta.id}>
        <div className="post-header">
          <div className="back-to-blog">
            <Link to={`${blogHome.shortLang}/blog`}>{blogHome.linkText}</Link>
          </div>

          <h1 className="post-title">
            {blogPost.title ? RichText.asText(blogPost.title) : 'Untitled'}
          </h1>

          {blogPost.author && (
            <div className="post-meta">
              {blogPost.author.profile_photo && (
                <div className="profile-photo">
                  <img
                    src={blogPost.author.profile_photo.url}
                    alt={blogPost.author.profile_photo.alt}
                  />
                </div>
              )}

              <div className="post-detail">
                {blogPost.author.name && (
                  <div className="post-author">
                    {`${blogPost.author.name}, ${blogPost.author.title}`}
                    <span className="date-spacer">•</span>
                  </div>
                )}
                {/* TODO: correct usage of time tag */}
                {/* TODO: localize date display */}
                <time>{blogPost.date}</time>
              </div>
            </div>
          )}
        </div>
        {blogPost.body && <PageSections sections={blogPost.body} />}
        {/* TODO: add newletter signup to each article, but which version to use from Prismic? */}
        <div className="section-placeholder">Newsletter sign up section</div>

        <div className="section-placeholder">Related promotions</div>

        <div className="section-placeholder">
          Full width background image w/ CTA buttons
        </div>
      </div>
    </Layout>
  );
};

export default Post;
