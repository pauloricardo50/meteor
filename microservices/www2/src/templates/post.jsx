import '../styles/post.scss';

import React from 'react';
import { Link, graphql } from 'gatsby';
import Helmet from 'react-helmet';

import Icon from 'core/components/Icon';

import Button from '../components/Button';
import CTAsSection from '../components/CTAsSection';
import NotFound from '../components/NotFound';
import PageSections from '../components/PageSections';
import PageShare from '../components/PageShare';
import { RichText } from '../components/prismic';
import RecommendedBlogPosts from '../components/RecommendedBlogPosts';
import { getLanguageData, getShortLang } from '../utils/languages.js';

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
              imagesSharp {
                childImageSharp {
                  fluid {
                    ...GatsbyImageSharpFluid
                  }
                }
              }
              content
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
            ...prismicPostFields
            date
            body {
              ... on PRISMIC_PostBodyHero {
                type
                primary {
                  images
                  imagesSharp {
                    childImageSharp {
                      fluid(maxWidth: 400) {
                        ...GatsbyImageSharpFluid_noBase64
                      }
                    }
                  }
                  content
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
                  cta_icon_1
                  cta_text_1
                  cta_style_1
                  cta_link_1 {
                    ... on PRISMIC__ExternalLink {
                      _linkType
                      url
                    }
                    ... on PRISMIC_Page {
                      ...prismicPageFields
                    }
                  }
                  cta_icon_2
                  cta_text_2
                  cta_style_2
                  cta_link_2 {
                    ... on PRISMIC__ExternalLink {
                      _linkType
                      url
                    }
                    ... on PRISMIC_Page {
                      ...prismicPageFields
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

const Post = ({
  data,
  lang,
  location,
  pageContext: { rootQuery, ...pageContext },
}) => {
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

  return (
    <>
      <Helmet>
        <meta property="og:type" content="article" />
        {blogPost.date && (
          <meta property="article:published_time" content={blogPost.date} />
        )}
        {blogPost.author && (
          <meta property="article:author" content={blogPost.author.name} />
        )}
        {blogPost._meta.tags && (
          <meta property="article:tag" content={blogPost._meta.tags} />
        )}
        {/* TODO: need to get url of first hero image in blogPost.body -- OR --
          add a meta tag in the hero when a specific prop is passed
        <meta property="og:image" content={firstHeroImageUrl} />
        */}
      </Helmet>
      <div
        className="post"
        data-wio-id={blogPost._meta.id}
        itemScope
        itemType="http://schema.org/BlogPosting"
      >
        <div className="back-to-blog">
          <Button
            Component={Link}
            icon={<Icon type="left" />}
            prismicLink={{
              _linkType: 'Link.document',
              _meta: { lang: 'fr-ch', type: 'page', uid: 'blog' },
            }}
          >
            {languageData.blogLinkText}
          </Button>
        </div>
        <div className="post-header">
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

        <PageShare
          title={RichText.asText(blogPost.title)}
          location={location}
        />

        <RecommendedBlogPosts
          currentPost={blogPost}
          recentPosts={recentPosts}
        />

        {articleCTAsSection && <CTAsSection {...articleCTAsSection} />}
      </div>
    </>
  );
};

export default Post;
