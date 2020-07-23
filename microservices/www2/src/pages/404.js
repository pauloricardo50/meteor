/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { faHeartBroken } from '@fortawesome/pro-light-svg-icons/faHeartBroken';
import { Link } from 'gatsby';

import FaIcon from 'core/components/Icon/FaIcon';
import T from 'core/components/Translation/FormattedMessage';
import colors from 'core/config/colors';

const FourOFour = () => (
  <div>
    <div className="not-found">
      <FaIcon icon={faHeartBroken} size="6x" color={colors.duotoneIconColor} />
      <h1>
        <T id="404.title" />
      </h1>
      <h2>
        <T id="404.description" />
      </h2>
      <p>
        <Link to="/">
          <T id="404.backToHome" />
        </Link>
      </p>
    </div>
  </div>
);

export default FourOFour;
