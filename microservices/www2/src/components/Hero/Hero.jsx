import './Hero.scss';

import React from 'react';

import CTAButtons from '../CTAButtons';
import Image from '../Image';
import { RichText } from '../prismic';

const EqualSplit = ({ primary, fields }) => (
  <section className="equal-split container">
    <div className="equal-split-image">
      <Image
        className="equal-split-image-gatsby"
        data={primary}
        at={primary.images ? 'images' : 'image'}
        imgStyle={{ objectFit: 'contain' }}
        fadeIn
      />
    </div>

    {primary.content && RichText.asText(primary.content) !== '' ? (
      <div className="equal-split-content">
        <RichText render={primary.content} />

        <CTAButtons buttons={fields} />
      </div>
    ) : null}
  </section>
);

const FullWidthImage = ({ primary, fields }) => (
  <div className="full-width">
    <Image
      className="full-width-image"
      data={primary}
      at={primary.images ? 'images' : 'image'}
    />

    {primary.content && RichText.asText(primary.content) !== '' ? (
      <div className="full-width-content">
        <span className="image-label">{RichText.asText(primary.content)}</span>

        <CTAButtons buttons={fields} />
      </div>
    ) : null}
  </div>
);

const Hero = ({ primary, fields }) => {
  if (!primary.image?.url && !primary.images?.url) {
    return null;
  }

  if (primary.image_layout === 'Equal Split') {
    return <EqualSplit primary={primary} fields={fields} />;
  }

  return <FullWidthImage primary={primary} fields={fields} />;
};

export default Hero;
