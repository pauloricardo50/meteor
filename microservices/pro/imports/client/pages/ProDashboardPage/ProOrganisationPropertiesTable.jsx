import React from 'react';
import { compose } from 'recompose';

import { PropertiesTable } from 'core/components/PropertiesTable/PropertiesTable';
import OrganisationPropertiesTableContainer from 'core/components/PropertiesTable/OrganisationPropertiesTableContainer';

export default compose(
  OrganisationPropertiesTableContainer,
  Component => (props) => {
    const { title, rows } = props;

    if (!rows || !rows.length) {
      return null;
    }

    return (
      <>
        <h3 className="text-center">{title}</h3>
        <Component {...props} clickable={false} />
      </>
    );
  },
)(PropertiesTable);
