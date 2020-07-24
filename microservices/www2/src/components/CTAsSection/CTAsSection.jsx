import './CTAsSection.scss';

import React from 'react';

import CTAButtons from '../CTAButtons';
import Image from '../Image';
import { RichText } from '../prismic';

const CTAsSection = ({ primary, fields }) => (
  <section id={primary.section_id} className="ctas-section container">
    {fields &&
      fields.map((cta, idx) => {
        // reformat buttons as expected by CTAButtons
        const buttons = [
          {
            cta_icon: cta.cta_icon_1,
            cta_text: cta.cta_text_1,
            cta_link: cta.cta_link_1,
            cta_style: cta.cta_style_1,
            cta_tracking_id: cta.cta_tracking_id_1,
          },
          {
            cta_icon: cta.cta_icon_2,
            cta_text: cta.cta_text_2,
            cta_link: cta.cta_link_2,
            cta_style: cta.cta_style_2,
            cta_tracking_id: cta.cta_tracking_id_2,
          },
        ].filter(({ cta_text }) => !!cta_text);

        return (
          <div key={idx} className="cta-block">
            {cta.image?.url && (
              <Image
                data={cta}
                at="image"
                fadeIn
                className="cta-block__image"
                imgStyle={{ objectFit: 'contain' }}
              />
            )}

            <div className="cta-block__content">
              <RichText render={cta.content} />
              <CTAButtons buttons={buttons} />
            </div>
          </div>
        );
      })}
  </section>
);

export default CTAsSection;
