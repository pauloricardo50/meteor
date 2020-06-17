import React from 'react';
import { RichText } from 'prismic-reactjs';
import './ImageGallery.scss';

const ImageGallery = ({ primary, fields }) => {
  const galleryClasses = primary.logos ? 'gallery gallery--logos' : 'gallery';

  return (
    <section id={primary.section_id} className="image-gallery">
      <div className="content container">
        {RichText.render(primary.content)}
      </div>

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
