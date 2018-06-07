import React from 'react';
import PropTypes from 'prop-types';

import { withState } from 'recompose';
import T from 'core/components/Translation';
import Icon from 'core/components/Icon';

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
        <span
          className="home-page-description-seo-click"
          onClick={() => setShowText(false)}
        >
          <T id="HomePageDescriptionSeo.less" />
          <Icon type="up" />
        </span>
      </p>
    );
  }
  return (
    <p className="description">
      <T id="HomePageDescription.description" />
      <span
        className="home-page-description-seo-click"
        onClick={() => setShowText(true)}
      >
        <T id="HomePageDescriptionSeo.more" />
        <Icon type="down" />
      </span>
    </p>
  );
};

HomePageDescriptionSeo.propTypes = {
  showText: PropTypes.bool.isRequired,
  setShowText: PropTypes.func.isRequired,
};

export default withState('showText', 'setShowText', false)(HomePageDescriptionSeo);
