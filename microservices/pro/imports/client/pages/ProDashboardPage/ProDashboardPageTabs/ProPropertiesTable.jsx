import React from 'react';
import { compose } from 'recompose';

import { PropertiesTable } from 'core/components/PropertiesTable/PropertiesTable';
import PropertiesTableContainer from 'core/components/PropertiesTable/PropertiesTableContainer';

export default compose(
  PropertiesTableContainer,
  (Component) => (props) => {
    const { title } = props;

    return (
      <>
        <h3 className="text-center">{title}</h3>
        <Component {...props} />
      </>
    );
  },
)(PropertiesTable);
