import React from 'react';
import { compose } from 'recompose';

import T from 'core/components/Translation';
import { PropertiesTable } from 'core/components/PropertiesTable/PropertiesTable';
import OrganisationPropertiesTableContainer from 'core/components/PropertiesTable/OrganisationPropertiesTableContainer';

export default compose(
  OrganisationPropertiesTableContainer,
  Component => (props) => {
    if (!props.rows || !props.rows.length) {
      return null;
    }

    const { title } = props;

    return (
      <>
        <h3 className="text-center">{title}</h3>
        <Component {...props} />
      </>
    );
  },
)(PropertiesTable);
