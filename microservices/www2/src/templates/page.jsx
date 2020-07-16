import React from 'react';
import { graphql } from 'gatsby';

import NotFound from '../components/NotFound';
import PageSections from '../components/PageSections';
import { BlogPostsContext, useBlogPosts } from '../contexts/BlogPostsContext';
import { prismicPageFields, prismicPostFields } from '../utils/fragments';

export const query = graphql`
  query PRISMIC_PAGE($uid: String!, $blogAfter: String) {
    prismic {
      page(uid: $uid, lang: "fr-ch") {
        ...prismicPageFields
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
              cta_icon_1
              cta_text_1
              cta_style_1
              cta_link_1 {
                _linkType
                __typename
                ... on PRISMIC__ExternalLink {
                  url
                  _linkType
                }
                ... on PRISMIC_Page {
                  ...prismicPageFields
                }
                ... on PRISMIC_Post {
                  ...prismicPostFields
                }
              }
              cta_icon_2
              cta_text_2
              cta_style_2
              cta_link_2 {
                _linkType
                __typename
                ... on PRISMIC__ExternalLink {
                  url
                  _linkType
                }
                ... on PRISMIC_Page {
                  ...prismicPageFields
                }
                ... on PRISMIC_Post {
                  ...prismicPostFields
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
              image
              # imageSharp {
              #   childImageSharp {
              #     fluid(maxWidth: 400) {
              #       ...GatsbyImageSharpFluid_noBase64
              #     }
              #   }
              # }
              content
            }
            fields {
              cta_icon
              cta_text
              cta_style
              cta_link {
                _linkType
                __typename
                ... on PRISMIC__ExternalLink {
                  url
                  _linkType
                }
                ... on PRISMIC_Page {
                  ...prismicPageFields
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
              cta_text
              cta_link {
                ... on PRISMIC__ExternalLink {
                  url
                  _linkType
                }
                ... on PRISMIC_Page {
                  ...prismicPageFields
                }
              }
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
              cta_icon
              cta_text
              cta_style
              cta_link {
                _linkType
                __typename
                ... on PRISMIC__ExternalLink {
                  url
                  _linkType
                }
                ... on PRISMIC_Page {
                  ...prismicPageFields
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
              cta_link {
                _linkType
                ... on PRISMIC__ExternalLink {
                  url
                  _linkType
                }
                ... on PRISMIC_Page {
                  ...prismicPageFields
                }
              }
              cta_text
            }
            fields {
              image
              imageSharp {
                childImageSharp {
                  fixed(width: 150) {
                    ...GatsbyImageSharpFixed
                  }
                }
              }
              link {
                _linkType
                ... on PRISMIC__ExternalLink {
                  url
                  _linkType
                }
                ... on PRISMIC_Page {
                  ...prismicPageFields
                }
                ... on PRISMIC_Post {
                  ...prismicPostFields
                }
              }
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
              page_description
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
                  ...prismicPageFields
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
          ... on PRISMIC_PageBodyVideo_embed {
            type
            primary {
              video
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
              cta_icon
              cta_text
              cta_style
              cta_link {
                _linkType
                __typename
                ... on PRISMIC__ExternalLink {
                  url
                  _linkType
                }
                ... on PRISMIC_Page {
                  ...prismicPageFields
                }
              }
            }
          }
          ... on PRISMIC_PageBodyCustom_component {
            type
            primary {
              component_name
            }
          }
        }
      }
      allPosts(sortBy: date_DESC, after: $blogAfter) {
        pageInfo {
          endCursor
          hasNextPage
          hasPreviousPage
          startCursor
        }
        totalCount
        edges {
          node {
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
    }
  }
`;

const Page = ({ data, lang, prismic }) => {
  const { page } = data.prismic;

  // handle unknown pages that don't get redirected to 404
  if (!page) return <NotFound pageType="page" pageLang={lang} />;

  return (
    <BlogPostsContext.Provider
      value={useBlogPosts({ prismic, data: data.prismic.allPosts })}
    >
      <div className="page" data-wio-id={page._meta.id}>
        {page.body && <PageSections sections={page.body} />}
      </div>
    </BlogPostsContext.Provider>
  );
};

export default Page;
