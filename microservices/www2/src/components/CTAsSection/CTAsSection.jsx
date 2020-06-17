import React from 'react';
import { RichText } from 'prismic-reactjs';
import CTAButtons from '../CTAButtons';
import './CTAsSection.scss';

const CTAsSection = ({ primary, fields }) => (
  <section id={primary.section_id} className="ctas-section container">
    {fields &&
      fields.map((cta, idx) => {
        // reformat buttons as expected by CTAButtons
        const buttons = [
          {
            cta_text: cta.cta_text_1,
            cta_link: cta.cta_link_1,
          },
          {
            cta_text: cta.cta_text_2,
            cta_link: cta.cta_link_2,
          },
        ];

        return (
          <div key={idx} className="cta-block">
            <img
              className="cta-block__image"
              src={cta.illustration.url}
              alt=""
            />

            <div className="cta-block__content">
              {RichText.render(cta.content)}

              <CTAButtons buttons={buttons} />
            </div>
          </div>
        );
      })}
  </section>
);

export default CTAsSection;
