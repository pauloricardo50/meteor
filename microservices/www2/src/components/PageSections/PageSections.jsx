import React from 'react';

import BlogPostsGrid from '../BlogPostsGrid';
import CardsGrid from '../CardsGrid';
import CTAsSection from '../CTAsSection';
import FAQ from '../FAQ';
import GPSStats from '../GPSStats';
import Hero from '../Hero';
import ImageCarousel from '../ImageCarousel';
import ImageCollage from '../ImageCollage';
import ImageGallery from '../ImageGallery';
import MortgageRates from '../MortgageRates';
import NewsletterSignup from '../NewsletterSignup';
import PageHeading from '../PageHeading';
import PageLinks from '../PageLinks';
import PageNavigation from '../PageNavigation';
import PromotionsGrid from '../PromotionsGrid';
import Quote from '../Quote';
import Team from '../Team';
import Testimonials from '../Testimonials';
import Text from '../Text';
import VideoEmbed from '../VideoEmbed';

const components = {
  blog_posts: BlogPostsGrid,
  cards: CardsGrid,
  ctas_section: CTAsSection,
  faq: FAQ,
  gps_stats_map: GPSStats,
  hero: Hero,
  image_carousel: ImageCarousel,
  image_collage: ImageCollage,
  image_gallery: ImageGallery,
  mortgage_rates: MortgageRates,
  newsletter_signup: NewsletterSignup,
  page_heading: PageHeading,
  page_links: PageLinks,
  page_navigation: PageNavigation,
  promotions: PromotionsGrid,
  quote: Quote,
  team: Team,
  testimonial: Testimonials,
  text: Text,
  video_embed: VideoEmbed,
};

const PageSections = ({ sections }) =>
  sections.map(section => {
    const sectionId = section.primary?.section_id;
    const Component = components[section.type];

    return (
      <div key={sectionId} id={sectionId} className="page-section">
        <Component {...section} />
      </div>
    );
  });

export default PageSections;
