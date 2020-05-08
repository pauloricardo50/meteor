import React from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/Layout';
import PageSections from '../components/PageSections';

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
            }
            fields {
              content
              image
              caption
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

const Page = ({ data }) => {
  const { page } = data.prismic;

  if (!page) return null;

  return (
    <Layout>
      <div className="container page" data-wio-id={page._meta.id}>
        {page.body && <PageSections sections={page.body} />}
      </div>
    </Layout>
  );
};

export default Page;
