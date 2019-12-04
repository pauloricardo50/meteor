// @flow
import React from 'react';

import Table from 'core/components/Table';
import Button from 'core/components/Button';
import Icon from 'core/components/Icon';
import ProOrganisationUserAdder from 'core/components/ProOrganisationUserAdder';
import ProOrganisationUsersTableContainer from './ProOrganisationUsersTableContainer';

type ProOrganisationUsersTableProps = {};

const ProOrganisationUsersTable = ({
  rows,
  columnOptions,
  currentUser,
  name,
  _id: organisationId,
}: ProOrganisationUsersTableProps) => (
  <>
    <ProOrganisationUserAdder
      organisationId={organisationId}
      organisationName={name}
      trigger={handleOpen => (
        <Button
          raised
          primary
          onClick={handleOpen}
          icon={<Icon type="personAdd" />}
        >
          Inviter un collègue
        </Button>
      )}
    />
    <Table rows={rows} columnOptions={columnOptions} />
  </>
);

export default ProOrganisationUsersTableContainer(ProOrganisationUsersTable);
