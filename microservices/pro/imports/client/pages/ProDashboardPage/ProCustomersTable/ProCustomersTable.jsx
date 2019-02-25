// @flow
import React from 'react';
import ProCustomersTableContainer from './ProCustomersTableContainer';

type ProCustomersTableProps = {};

const ProCustomersTable = (props: ProCustomersTableProps) => {
  console.log('props', props);
  return <div>Hello World</div>;
};

export default ProCustomersTableContainer(ProCustomersTable);
