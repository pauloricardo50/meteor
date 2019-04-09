// @flow
import React from 'react';
import { withProps } from 'recompose';

import Toggle from 'core/components/Toggle';
import { PROPERTY_CATEGORY } from 'core/api/constants';

type PropertyCardToggleProps = {};

const PropertyCardToggle = ({
  category,
  handleToggle,
  toggled,
}: PropertyCardToggleProps) => {
  if (category !== PROPERTY_CATEGORY.PRO) {
    return null;
  }

  return (
    <Toggle
      onToggle={handleToggle}
      toggled
      labelLeft="Activer partage de solvabilité"
    />
  );
};

// TODO: Plug this with DB
export default withProps({
  handleToggle: () => {},
  toggled: true,
})(PropertyCardToggle);
