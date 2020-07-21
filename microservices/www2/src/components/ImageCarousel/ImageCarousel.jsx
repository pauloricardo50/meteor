import './ImageCarousel.scss';

import React, { useState } from 'react';

import Button from '../Button';
import Image from '../Image';
import { RichText } from '../prismic';

const ImageCarousel = ({ primary, fields }) => {
  const [currIndex, setCurrIndex] = useState(0);
  const { content, image, cta_text, cta_link } = fields[currIndex];

  return (
    <section id={primary.section_id} className="image-carousel container">
      <div className="content container">
        <RichText render={primary.section_heading} />

        <ol className="captions">
          {fields.map((field, idx) => (
            <li
              key={idx}
              onClick={() => setCurrIndex(idx)}
              className={idx === currIndex ? 'active' : null}
            >
              {field.caption}
            </li>
          ))}
        </ol>

        <hr />

        <RichText render={content} />

        {cta_text && (
          <Button primary prismicLink={cta_link} style={{ marginLeft: -8 }}>
            {cta_text}
          </Button>
        )}
      </div>

      <Image
        data={fields[currIndex]}
        at="image"
        className="current-image"
        fadeIn
        imgStyle={{ objectFit: 'contain' }}
      />
    </section>
  );
};

export default ImageCarousel;
