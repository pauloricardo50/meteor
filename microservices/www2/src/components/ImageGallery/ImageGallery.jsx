import './ImageGallery.scss';

import React from 'react';
import { RichText } from 'prismic-reactjs';

const ImageGallery = ({ primary, fields }) => {
  const galleryClasses = primary.logos ? 'gallery gallery--logos' : 'gallery';
  const hasPrimaryContent = !!primary.content?.[0]?.text;

  return (
    <section id={primary.section_id} className="image-gallery">
      {hasPrimaryContent && (
        <div className="content container">
          {RichText.render(primary.content)}
        </div>
      )}

      <div className={galleryClasses} aria-hidden="true">
        {fields.length &&
          fields.map(({ image }, idx) => (
            <img key={idx} src={image.url} alt={image.alt} />
          ))}
      </div>
    </section>
  );
};

export default ImageGallery;
