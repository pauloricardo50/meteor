import React from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/Layout';
import NotFound from '../components/NotFound';
import PageSections from '../components/PageSections';

// TODO: refactor to use fragments
export const query = graphql`
  query PRISMIC_PAGE($uid: String!, $lang: String!) {
    prismic {
      page(uid: $uid, lang: $lang) {
        _meta {
          id
          uid
          type
          tags
          lang
        }
        name
        body {
          ... on PRISMIC_PageBodyBlog_posts {
            type
            fields {
              post_filter
            }
          }
          ... on PRISMIC_PageBodyCards {
            type
            primary {
              section_id
              heading
            }
            fields {
              icon
              title
              content
            }
          }
          ... on PRISMIC_PageBodyCtas_section {
            type
            primary {
              section_id
            }
            fields {
              illustration
              content
              cta_text_1
              cta_link_1 {
                _linkType
                __typename
                ... on PRISMIC__ExternalLink {
                  url
                  _linkType
                }
                ... on PRISMIC_Page {
                  _meta {
                    id
                    uid
                    type
                    lang
                  }
                  name
                }
                ... on PRISMIC_Post {
                  _meta {
                    id
                    uid
                    type
                    lang
                  }
                  title
                }
              }
              cta_text_2
              cta_link_2 {
                _linkType
                __typename
                ... on PRISMIC__ExternalLink {
                  url
                  _linkType
                }
                ... on PRISMIC_Page {
                  _meta {
                    id
                    uid
                    type
                    lang
                  }
                  name
                }
                ... on PRISMIC_Post {
                  _meta {
                    id
                    uid
                    type
                    lang
                  }
                  title
                }
              }
            }
          }
          ... on PRISMIC_PageBodyFaq {
            type
            primary {
              section_heading
            }
            fields {
              question
              answer
            }
          }
          ... on PRISMIC_PageBodyHero {
            type
            primary {
              section_id
              image_layout
              images
              content
            }
            fields {
              cta_text
              cta_link {
                _linkType
                __typename
                ... on PRISMIC__ExternalLink {
                  url
                  _linkType
                }
                ... on PRISMIC_Page {
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
          __typename
          ... on PRISMIC_PageBodyImage_carousel {
            type
            primary {
              section_id
              section_heading
              flipped
            }
            fields {
              content
              image
              caption
            }
          }
          ... on PRISMIC_PageBodyImage_collage {
            type
            primary {
              section_id
              content
              images
            }
            fields {
              cta_text
              cta_link {
                _linkType
                __typename
                ... on PRISMIC__ExternalLink {
                  url
                  _linkType
                }
                ... on PRISMIC_Page {
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
          ... on PRISMIC_PageBodyImage_gallery {
            type
            primary {
              section_id
              content
              logos
            }
            fields {
              image
            }
          }
          ... on PRISMIC_PageBodyNewsletter_signup {
            type
            primary {
              section_id
              section_heading
              content
            }
          }
          ... on PRISMIC_PageBodyTestimonial {
            type
            primary {
              section_id
              testimonials_heading
            }
            fields {
              profile_image
              customer_name
              customer_title
              customer_quote
            }
          }
          ... on PRISMIC_PageBodyPage_heading {
            type
            primary {
              section_id
              page_heading
            }
          }
          ... on PRISMIC_PageBodyPage_links {
            type
            fields {
              label
              link {
                _linkType
                __typename
                ... on PRISMIC_Page {
                  _meta {
                    id
                    uid
                    type
                    lang
                  }
                }
              }
            }
          }
          ... on PRISMIC_PageBodyPage_navigation {
            type
            fields {
              link_text
              section_link
            }
          }
          ... on PRISMIC_PageBodyPromotions {
            type
            fields {
              promotion_filter
            }
          }
          ... on PRISMIC_PageBodyTeam {
            type
            primary {
              section_id
              section_heading
            }
            fields {
              member_name
              position
              phone
              email
              portrait
            }
          }
          ... on PRISMIC_PageBodyText {
            type
            primary {
              section_id
              justification
              content
            }
          }
          ... on PRISMIC_PageBodyMortgage_rates {
            type
          }
          ... on PRISMIC_PageBodyGps_stats_map {
            type
            primary {
              section_id
              content
            }
            fields {
              cta_text
              cta_link {
                _linkType
                __typename
                ... on PRISMIC__ExternalLink {
                  url
                  _linkType
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
        }
      }
    }
  }
`;

const Page = ({ data, lang, pageContext: { rootQuery, ...pageContext } }) => {
  const { page } = data.prismic;

  // handle unknown pages that don't get redirected to 404
  if (!page) return <NotFound pageType="page" pageLang={lang} />;

  return (
    <Layout pageContext={pageContext} pageName={page.name}>
      <div className="container page" data-wio-id={page._meta.id}>
        {page.body && <PageSections sections={page.body} />}
      </div>
    </Layout>
  );
};

export default Page;
