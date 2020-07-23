import React from 'react';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AddCircleOutlineIcon from '@material-ui/icons/Add';

import Table from '../../Table';
import T from '../../Translation';
import ProPropertyPageUsersContainer from './ProPropertyPageUsersContainer';
import ProPropertyProUserAdder from './ProPropertyProUserAdder/ProPropertyProUserAdder';

const ProPropertyPageUsers = ({
  property,
  rows,
  columnOptions,
  permissions,
}) => (
  <Accordion>
    <AccordionSummary
      expandIcon={<AddCircleOutlineIcon />}
      IconButtonProps={{ className: 'mr-0' }}
    >
      <div
        className="flex center-align"
        onClick={event => {
          event.stopPropagation();
        }}
      >
        <h2 className="mr-16">
          <T id="ProPropertyPage.usersTable.title" />
        </h2>
        {permissions.canInviteProUsers && (
          <>
            <ProPropertyProUserAdder property={property} />
          </>
        )}
      </div>
    </AccordionSummary>
    <AccordionDetails style={{ flexDirection: 'column' }}>
      <Table
        rows={rows}
        columnOptions={columnOptions}
        style={{ alignSelf: 'stretch' }}
      />
    </AccordionDetails>
  </Accordion>
);

export default ProPropertyPageUsersContainer(ProPropertyPageUsers);
