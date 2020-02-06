import React from 'react';
import Table from '@material-ui/core/Table';

import useMedia from '../../hooks/useMedia';

const TableCustom = props => {
  const isMobile = useMedia({ maxWidth: 768 });

  return <Table padding={isMobile ? 'checkbox' : 'dense'} {...props} />;
};
export default TableCustom;
