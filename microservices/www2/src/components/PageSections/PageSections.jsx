import React from 'react';
import BlogPostsGrid from '../BlogPostsGrid';
import Hero from '../Hero';
import ImageCarousel from '../ImageCarousel';
import NewsletterSignup from '../NewsletterSignup';
import PageHeading from '../PageHeading';
import PageNavigation from '../PageNavigation';
import Quote from '../Quote';
import Team from '../Team';
import Testimonials from '../Testimonials';
import Text from '../Text';

const PageSections = ({ sections }) =>
  sections.map((section, idx) => {
    const sectionId = section.primary?.section_id;

    return (
      <div key={idx} id={sectionId} className="page-section">
        {
          {
            blog_posts: <BlogPostsGrid {...section} />,
            hero: <Hero {...section} />,
            image_carousel: <ImageCarousel {...section} />,
            newsletter_signup: <NewsletterSignup {...section} />,
            page_heading: <PageHeading {...section} />,
            page_navigation: <PageNavigation {...section} />,
            quote: <Quote {...section} />,
            team: <Team {...section} />,
            testimonial: <Testimonials {...section} />,
            text: <Text {...section} />,
          }[section.type]
        }
      </div>
    );
  });

export default PageSections;
