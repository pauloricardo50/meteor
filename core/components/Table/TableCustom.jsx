// @flow
import React from 'react';
import Table from '@material-ui/core/Table';

import useMedia from '../../hooks/useMedia';

type TableCustomProps = {};

const TableCustom = (props: TableCustomProps) => {
  const isMobile = useMedia({ maxWidth: 768 });

  return <Table padding={isMobile ? 'checkbox' : 'dense'} {...props} />;
};
export default TableCustom;
