import React from 'react';
import { RichText } from 'prismic-reactjs';
import './ImageGallery.scss';

const ImageGallery = ({ primary, fields }) => {
  return (
    <section id={primary.section_id} className="image-gallery">
      <div className="content">{RichText.render(primary.content)}</div>

      <div className="gallery" aria-hidden="true">
        {fields.length &&
          fields.map(({ image }, idx) => (
            <img key={idx} src={image.url} alt={image.alt} />
          ))}
      </div>
    </section>
  );
};

export default ImageGallery;
