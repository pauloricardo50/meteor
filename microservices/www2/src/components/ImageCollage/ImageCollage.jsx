import React, { useState } from 'react';
import { RichText } from 'prismic-reactjs';
import Button from '../Button';
import './ImageCollage.scss';

const CollageGrid = ({ images }) =>
  images.map((image, idx) => <img key={idx} src={image.url} alt={image.alt} />);

const ImageCollage = ({ primary, fields }) => {
  const identifiers = ['second', 'third', 'fourth', 'fifth'];
  const images = [{}];
  const arrKeys = Object.keys(primary.images);

  arrKeys.forEach((key) => {
    if (identifiers.includes(key)) {
      images.push(primary.images[key]);
    } else images[0][key] = primary.images[key];
  });

  return (
    <section id={primary.section_id} className="image-collage">
      <div className="content">
        {RichText.render(primary.content)}

        {fields.length > 0 &&
          fields.map((field, idx) => (
            <Button
              key={idx}
              className="cta--button"
              raised
              primary={idx === 0}
              link
              to={field.cta_link.url}
            >
              {field.cta_text}
            </Button>
          ))}
      </div>

      <div className="collage" aria-hidden="true">
        {images.length && <CollageGrid images={images} />}
      </div>
    </section>
  );
};

export default ImageCollage;
