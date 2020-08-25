import React from 'react';
import { faHome } from '@fortawesome/pro-light-svg-icons/faHome';

import FaIcon from 'core/components/Icon/FaIcon';
import Link from 'core/components/Link';
import Loading from 'core/components/Loading';

const MiniatureImage = ({ url }) => {
  if (url) {
    return <div className="img" style={{ backgroundImage: `url("${url}")` }} />;
  }

  return <FaIcon icon={faHome} />;
};

const OnboardingMiniature = ({ loading, title, subtitle, imageUrl, link }) => {
  if (loading) {
    return (
      <div className="onboarding-miniature">
        <Loading small />
      </div>
    );
  }

  return (
    <Link to={link} className="onboarding-miniature flex nowrap">
      <MiniatureImage url={imageUrl} />

      <div className="flex-col nowrap sa p-16">
        <h4 className="m-0">{title}</h4>

        <span className="secondary font-size-5">{subtitle}</span>
      </div>
    </Link>
  );
};

export default OnboardingMiniature;
