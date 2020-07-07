import './ImageCarousel.scss';

import React, { useState } from 'react';
import { RichText } from 'prismic-reactjs';

import { linkResolver } from '../../utils/linkResolver';
import Button from '../Button';

const ImageCarousel = ({ primary, fields }) => {
  console.log('fields:', fields);
  const [currIndex, setCurrIndex] = useState(0);
  const { content, image, cta_text, cta_link } = fields[currIndex];

  return (
    <section
      id={primary.section_id}
      className="image-carousel container--desktop"
    >
      <div className="content container--mobile">
        {RichText.render(primary.section_heading)}

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

        {RichText.render(content)}
        {cta_text && (
          <Button primary link to={linkResolver(cta_link._meta)}>
            {cta_text}
          </Button>
        )}
      </div>

      <div className="current-image">
        <img
          className="animated fadeIn"
          src={image?.url}
          alt={image?.alt}
          key={image?.url}
        />
      </div>
    </section>
  );
};

export default ImageCarousel;
