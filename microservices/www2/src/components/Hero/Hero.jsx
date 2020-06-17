import React from 'react';
import { RichText } from 'prismic-reactjs';
import CTAButtons from '../CTAButtons';
import './Hero.scss';

const EqualSplit = ({ primary, fields }) => (
  <section className="equal-split no-top-pad container">
    <div
      className="equal-split__image"
      style={{ backgroundImage: `url(${primary.images.url})` }}
    />

    <div className="equal-split__content">
      {primary.content && RichText.asText(primary.content) !== '' ? (
        <>
          {RichText.render(primary.content)}

          <CTAButtons buttons={fields} />
        </>
      ) : null}
    </div>
  </section>
);

const FullWidthImage = ({ primary, fields }) => (
  <div
    className="full-width-image"
    style={{ backgroundImage: `url(${primary.images.url})` }}
    itemProp="image"
    itemScope
    itemType="https://schema.org/ImageObject"
  >
    <meta itemProp="url" content={primary.images.url} />
    <div className="wrapper">
      {primary.content && RichText.asText(primary.content) !== '' ? (
        <>
          <span className="image-label">
            {RichText.asText(primary.content)}
          </span>

          <CTAButtons buttons={fields} />
        </>
      ) : null}
    </div>
  </div>
);

const Hero = ({ primary, fields }) => {
  if (!primary.images?.url) return null;

  switch (primary.image_layout) {
    case 'Equal Split':
      return <EqualSplit primary={primary} fields={fields} />;
    default:
      return <FullWidthImage primary={primary} fields={fields} />;
  }
};

export default Hero;
