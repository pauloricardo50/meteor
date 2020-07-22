import './ImageCollage.scss';

import React from 'react';

import CTAButtons from '../CTAButtons';
import { RichText } from '../prismic';

const CollageGrid = ({ images }) =>
  images.map((image, idx) => <img key={idx} src={image.url} alt={image.alt} />);

const ImageCollage = ({ primary, fields }) => {
  const identifiers = ['second', 'third', 'fourth', 'fifth'];
  const images = [{}];
  const arrKeys = Object.keys(primary.images);

  arrKeys.forEach(key => {
    if (identifiers.includes(key)) {
      images.push(primary.images[key]);
    } else images[0][key] = primary.images[key];
  });

  return (
    <section id={primary.section_id} className="image-collage container">
      <div className="content">
        <RichText render={primary.content} />

        <CTAButtons buttons={fields} />
      </div>

      <div className="collage" aria-hidden="true">
        {images.length && <CollageGrid images={images} />}
      </div>
    </section>
  );
};

export default ImageCollage;
