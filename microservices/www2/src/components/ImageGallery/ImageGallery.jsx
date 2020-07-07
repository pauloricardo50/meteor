import './ImageGallery.scss';

import React from 'react';
import { RichText } from 'prismic-reactjs';

import { linkResolver } from '../../utils/linkResolver';
import Button from '../Button';

const ImageGallery = ({ primary, fields }) => {
  const { logos, section_id, content, cta_text, cta_link } = primary;
  const galleryClasses = logos ? 'gallery gallery--logos' : 'gallery';
  const hasPrimaryContent = !!content?.[0]?.text;

  return (
    <section id={section_id} className="image-gallery">
      {hasPrimaryContent && (
        <div className="content container">{RichText.render(content)}</div>
      )}
      {cta_text && (
        <Button primary link to={linkResolver(cta_link?._meta)}>
          {cta_text}
        </Button>
      )}

      <div className={galleryClasses} aria-hidden="true">
        {fields.length &&
          fields.map(({ image, link = {} }, idx) => {
            const Component = link?.url ? 'a' : 'div';

            return (
              <Component className="gallery-item" key={idx} href={link?.url}>
                <img src={image.url} alt={image.alt} />
              </Component>
            );
          })}
      </div>
    </section>
  );
};

export default ImageGallery;
