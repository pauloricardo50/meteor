import React from 'react';
import BlogPostsGrid from '../BlogPostsGrid';
import FAQ from '../FAQ';
import GPSStats from '../GPSStats';
import Hero from '../Hero';
import ImageCarousel from '../ImageCarousel';
import ImageCollage from '../ImageCollage';
import NewsletterSignup from '../NewsletterSignup';
import PageHeading from '../PageHeading';
import PageNavigation from '../PageNavigation';
import PromotionsGrid from '../PromotionsGrid';
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
            faq: <FAQ {...section} />,
            gps_stats_map: <GPSStats {...section} />,
            hero: <Hero {...section} />,
            image_carousel: <ImageCarousel {...section} />,
            image_collage: <ImageCollage {...section} />,
            newsletter_signup: <NewsletterSignup {...section} />,
            page_heading: <PageHeading {...section} />,
            page_navigation: <PageNavigation {...section} />,
            promotions: <PromotionsGrid {...section} />,
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
