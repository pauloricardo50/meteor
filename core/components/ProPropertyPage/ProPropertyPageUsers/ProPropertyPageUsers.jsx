import React from 'react';

import withHider from '../../../containers/withHider';
import Table from '../../Table';
import T from '../../Translation';
import ProPropertyPageUsersContainer from './ProPropertyPageUsersContainer';
import ProPropertyProUserAdder from './ProPropertyProUserAdder/ProPropertyProUserAdder';

const HiddenUsers = withHider(hide => ({
  label: hide ? 'Afficher les comptes Pro' : 'Masquer les comptes Pro',
  primary: true,
  style: { display: 'block', margin: '0 auto' },
}))(Table);

const ProPropertyPageUsers = ({
  property,
  rows,
  columnOptions,
  permissions,
}) => (
  <div className="card1 card-top users-table">
    <span className="flex users-table-header">
      <h2>
        <T id="ProPropertyPage.usersTable.title" />
      </h2>
      {permissions.canInviteProUsers && (
        <>
          <ProPropertyProUserAdder property={property} />
        </>
      )}
    </span>
    <HiddenUsers rows={rows} columnOptions={columnOptions} />
  </div>
);

export default ProPropertyPageUsersContainer(ProPropertyPageUsers);
