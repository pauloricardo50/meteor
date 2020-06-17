import React from 'react';
import { graphql, Link } from 'gatsby';
import { RichText } from 'prismic-reactjs';
import Layout from '../components/Layout';
import NotFound from '../components/NotFound';
import PageSections from '../components/PageSections';
import PageShare from '../components/PageShare';
import CTAsSection from '../components/CTAsSection';
import NewsletterSignup from '../components/NewsletterSignup';
import RecommendedBlogPosts from '../components/RecommendedBlogPosts';
import { getLanguageData, getShortLang } from '../utils/languages.js';
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
          ... on PRISMIC_PostBodyVideo_embed {
            type
            primary {
              video
            }
          }
        }
      }

      allPosts(lang: $lang, first: 3, sortBy: date_DESC) {
        edges {
          node {
            _meta {
              id
              uid
              tags
              type
              lang
            }
            title
            date
            body {
              ... on PRISMIC_PostBodyHero {
                type
                primary {
                  images
                }
              }
            }
          }
        }
      }

      allGlobals(lang: $lang, uid: "article") {
        edges {
          node {
            _meta {
              id
              uid
              type
              lang
            }
            title
            body {
              __typename
              ... on PRISMIC_GlobalBodyCtas_section {
                type
                primary {
                  section_id
                }
                fields {
                  content
                  illustration
                  cta_text_1
                  cta_link_1 {
                    ... on PRISMIC__ExternalLink {
                      _linkType
                      url
                    }
                    ... on PRISMIC_Page {
                      _linkType
                      _meta {
                        id
                        uid
                        type
                        lang
                      }
                      name
                    }
                  }
                  cta_text_2
                  cta_link_2 {
                    ... on PRISMIC__ExternalLink {
                      _linkType
                      url
                    }
                    ... on PRISMIC_Page {
                      _linkType
                      _meta {
                        id
                        uid
                        type
                        lang
                      }
                      name
                    }
                  }
                }
              }
              ... on PRISMIC_GlobalBodyNewsletter_signup {
                type
                primary {
                  section_id
                  section_heading
                  content
                  illustration
                }
              }
            }
          }
        }
      }
    }
  }
`;

const Post = ({ data, lang, pageContext: { rootQuery, ...pageContext } }) => {
  const {
    post: blogPost,
    allPosts: { edges: recentPosts },
    allGlobals: { edges: sharedSections },
  } = data.prismic;

  // handle unknown posts that don't get redirected to a 404
  if (!blogPost) return <NotFound pageType="post" pageLang={lang} />;

  const languageData = getLanguageData(getShortLang(pageContext.lang));

  const articleCTAsSection = sharedSections[0]?.node.body.find(
    section => section.type === 'ctas_section',
  );

  const articleNewsletterSignup = sharedSections[0]?.node.body.find(
    section => section.type === 'newsletter_signup',
  );

  return (
    <Layout pageContext={pageContext} pageName={blogPost.title}>
      <div
        className="post"
        data-wio-id={blogPost._meta.id}
        itemScope
        itemType="http://schema.org/BlogPosting"
      >
        <div className="post-header">
          <div className="back-to-blog">
            <Link to={languageData.blogLink}>{languageData.blogLinkText}</Link>
          </div>

          <h1 className="post-title" itemProp="headline">
            {RichText.asText(blogPost.title)}
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
                  <div
                    className="post-author"
                    itemProp="author"
                    itemScope
                    itemType="https://schema.org/Person"
                  >
                    <span itemProp="name">{blogPost.author.name}</span>
                    {', '}
                    <span itemProp="jobTitle">{blogPost.author.title}</span>
                    <span className="date-spacer">•</span>
                  </div>
                )}

                <time itemProp="datePublished">{blogPost.date}</time>
              </div>
            </div>
          )}
        </div>

        {blogPost.body && (
          <div itemProp="articleBody">
            <PageSections sections={blogPost.body} />
          </div>
        )}

        <PageShare title={RichText.asText(blogPost.title)} />

        {articleNewsletterSignup && (
          <div className="container">
            <NewsletterSignup
              {...articleNewsletterSignup}
              placement="article"
            />
            ,
          </div>
        )}

        <RecommendedBlogPosts
          currentPost={blogPost}
          recentPosts={recentPosts}
        />

        {articleCTAsSection && (
          <div className="container">
            <CTAsSection {...articleCTAsSection} />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Post;
