import React from 'react';
import PropTypes from 'prop-types';

import collectionIcons from 'core/arrays/collectionIcons';
import IconLink from 'core/components/IconLink';
import T from 'core/components/Translation';

const LinkToCollection = ({ collection }) => (
  <IconLink
    link={`/${collection}`}
    icon={collectionIcons[collection]}
    text={<T id={`collections.${collection}`} />}
  />
);

LinkToCollection.propTypes = {
  collection: PropTypes.string.isRequired,
};

export default LinkToCollection;
