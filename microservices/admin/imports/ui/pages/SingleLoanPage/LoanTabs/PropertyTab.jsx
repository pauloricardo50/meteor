import React from 'react';
import PropTypes from 'prop-types';

import SinglePropertyPage from '../../SinglePropertyPage/SinglePropertyPage';

const PropertyTab = (props) => {
  const { property } = props;

  return (
    <SinglePropertyPage propertyId={property._id} displayLoans={false} />
  );
};

PropertyTab.propTypes = {
  property: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default PropertyTab;
