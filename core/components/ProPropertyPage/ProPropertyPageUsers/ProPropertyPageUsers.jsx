// @flow
import React from 'react';
import Table from 'core/components/Table';
import ProPropertyPageUsersContainer from './ProPropertyPageUsersContainer';
import ProPropertyProUserAdder from './ProPropertyProUserAdder/ProPropertyProUserAdder';
import { ProPropertyPageContext } from '../ProPropertyPageContext';

type ProPropertyPageUsersProps = {};

const ProPropertyPageUsers = ({
  property,
  rows,
  columnOptions,
}: ProPropertyPageUsersProps) => (
  <ProPropertyPageContext.Consumer>
    {({ test }) => (
      <div className="card1 card-top">
        <h2>Utilisateurs {test}</h2>
        <ProPropertyProUserAdder property={property} />
        <Table rows={rows} columnOptions={columnOptions} />
      </div>
    )}
  </ProPropertyPageContext.Consumer>
);

export default ProPropertyPageUsersContainer(ProPropertyPageUsers);
