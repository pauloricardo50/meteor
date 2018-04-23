import React from 'react';
import { withState } from 'recompose';
import { T } from 'core/components/Translation';

// TODO: Actually optimize this for SEO, don't hide it but show it with display none
const HomePageDescriptionSeo = ({ showText, setShowText }) => {
  if (showText) {
    return (
      <p className="description">
        <T id="HomePageDescription.description" />
        <br />
        <T id="HomePageDescription.description2" />
        <br />
        <T id="HomePageDescription.description3" />
        <br />
        <T id="HomePageDescription.description4" />
        <a href="#" onClick={() => setShowText(false)}>
          Masquer
        </a>
      </p>
    );
  }
  return (
    <p className="description">
      <T id="HomePageDescription.description" />
      <a href="#" onClick={() => setShowText(true)}>
        En lire plus
      </a>
    </p>
  );
};

export default withState('showText', 'setShowText', false)(HomePageDescriptionSeo);
