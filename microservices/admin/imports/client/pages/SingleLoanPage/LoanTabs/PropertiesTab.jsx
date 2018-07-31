import React from 'react';
import PropTypes from 'prop-types';

import Tabs from 'core/components/Tabs';
import SinglePropertyPage from '../../SinglePropertyPage/SinglePropertyPage';

const PropertiesTab = ({ properties }) => (
  <Tabs
    tabs={properties.map(property => ({
      id: property._id,
      label: property.address1,
      content: (
        <SinglePropertyPage propertyId={property._id} displayLoans={false} />
      ),
    }))}
  />
);

PropertiesTab.propTypes = {
  properties: PropTypes.arrayOf(PropTypes.any).isRequired,
};

export default PropertiesTab;
