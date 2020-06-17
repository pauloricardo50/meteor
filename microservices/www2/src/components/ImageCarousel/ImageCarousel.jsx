import React, { useState } from 'react';
import { RichText } from 'prismic-reactjs';
import './ImageCarousel.scss';

const ImageCarousel = ({ primary, fields }) => {
  const [currIndex, setCurrIndex] = useState(0);

  // TODO: add timing function, or find component that does this simply
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

        {/* TODO: will this be a time lapse or progress line ? */}
        <hr />

        {RichText.render(fields[currIndex].content)}
      </div>

      <div className="current-image">
        {/* TODO: add fade transtion animation wrapper ? */}
        <img
          src={fields[currIndex].image.url}
          alt={fields[currIndex].image.alt}
        />
      </div>
    </section>
  );
};

export default ImageCarousel;
