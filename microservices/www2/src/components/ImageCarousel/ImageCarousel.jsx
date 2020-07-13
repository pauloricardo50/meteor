import './ImageCarousel.scss';

import React, { useState } from 'react';

import { linkResolver } from '../../utils/linkResolver';
import Button from '../Button';
import { RichText } from '../prismic';

const ImageCarousel = ({ primary, fields }) => {
  const [currIndex, setCurrIndex] = useState(0);
  const { content, image, cta_text, cta_link } = fields[currIndex];

  return (
    <section
      id={primary.section_id}
      className="image-carousel container--desktop"
    >
      <div className="content container--mobile">
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
          <Button
            primary
            link
            to={linkResolver(cta_link._meta)}
            style={{ marginLeft: -8 }}
          >
            {cta_text}
          </Button>
        )}
      </div>

      <div
        className="current-image animated fadeIn"
        style={{ backgroundImage: `url("${image?.url}")`, color: 'red' }}
        aria-label={image?.alt}
        key={image?.url}
      />
    </section>
  );
};

export default ImageCarousel;
