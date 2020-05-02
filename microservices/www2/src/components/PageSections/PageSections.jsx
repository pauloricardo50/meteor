import React from 'react';
import Hero from '../Hero';
import Quote from '../Quote';
import Text from '../Text';

const PageSections = ({ sections }) =>
  sections.map((section, idx) => {
    const sectionId = section.primary?.section_id;

    return (
      <div key={idx} id={sectionId} className="page-section">
        {
          {
            hero: <Hero {...section} />,
            quote: <Quote {...section} />,
            text: <Text {...section} />,
          }[section.type]
        }
      </div>
    );
  });

export default PageSections;
