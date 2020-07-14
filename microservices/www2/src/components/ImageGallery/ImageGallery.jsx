import './ImageGallery.scss';

import React from 'react';

import Button from '../Button';
import Link from '../Link';
import { RichText } from '../prismic';

const ImageGallery = ({ primary, fields }) => {
  const { logos, section_id, content, cta_text, cta_link } = primary;
  const galleryClasses = logos ? 'gallery gallery--logos' : 'gallery';
  const hasPrimaryContent = !!content?.[0]?.text;

  return (
    <section id={section_id} className="image-gallery container">
      {hasPrimaryContent && (
        <div className="content">
          <RichText render={content} />
        </div>
      )}
      {cta_text && (
        <Button primary prismicLink={cta_link} style={{ marginLeft: -8 }}>
          {cta_text}
        </Button>
      )}

      <div className={galleryClasses}>
        {fields.length &&
          fields.map(({ image, link = {} }, idx) => {
            const Component = link ? Link : 'div';

            return (
              <Component className="gallery-item" key={idx} prismicLink={link}>
                <img src={image.url} alt={image.alt} />
              </Component>
            );
          })}
      </div>
    </section>
  );
};

export default ImageGallery;
