import React from 'react';
import { compose } from 'recompose';

import T from 'core/components/Translation';
import { PropertiesTable } from 'core/components/PropertiesTable/PropertiesTable';
import PropertiesTableContainer from 'core/components/PropertiesTable/PropertiesTableContainer';

export default compose(
  PropertiesTableContainer,
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
