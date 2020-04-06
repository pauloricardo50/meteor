import React from 'react';

import { INSURANCE_REQUEST_STATUS_ORDER } from 'core/api/insuranceRequests/insuranceRequestConstants';
import { ROLES } from 'core/api/users/userConstants';
import Button from 'core/components/Button';
import IconButton from 'core/components/IconButton';
import RadioButtons from 'core/components/RadioButtons';
import StickyPopover from 'core/components/StickyPopover';
import T from 'core/components/Translation';

import LoanBoardOptionsCheckboxes from '../../LoanBoard/LoanBoardOptions/LoanBoardOptionsCheckboxes';
import { ACTIONS, GROUP_BY } from '../insuranceRequestBoardConstants';

const makeOnChange = (filterName, dispatch) => (prev, next) => {
  if (!prev.includes(null) && next.includes(null)) {
    // If previously a specific id was checked, and now you check "all" (i.e. null)
    // uncheck all checkboxes
    dispatch({
      type: ACTIONS.SET_FILTER,
      payload: { name: filterName, value: undefined },
    });
  } else if (prev.includes(null) && next.length > 1) {
    // If you previously had "all" checked, and check a specific checkbox,
    // uncheck "all" (i.e. null)
    dispatch({
      type: ACTIONS.SET_FILTER,
      payload: { name: filterName, value: { $in: next.filter(x => x) } },
    });
  } else {
    // Simple check
    dispatch({
      type: ACTIONS.SET_FILTER,
      payload: { name: filterName, value: { $in: next } },
    });
  }
};

const insuranceRequestBoardContent = ({
  options,
  dispatch,
  devAndAdmins,
  refetchInsuranceRequests,
  organisations,
}) => {
  const { assignedEmployeeId, groupBy, status, organisationId } = options;
  const assignedEmployeeValue = assignedEmployeeId
    ? assignedEmployeeId.$in
    : [null];
  const statusValue = status ? status.$in : [null];
  const organisationIdValue = organisationId ? organisationId.$in : [null];
  const groupByOptions = [
    { id: GROUP_BY.STATUS, label: 'Par statut' },
    { id: GROUP_BY.ADMIN, label: 'Par conseiller' },
  ];
  const assignedEmployeeOptions = [
    { id: null, label: 'Tous' },
    { id: undefined, label: 'Personne' },
    ...devAndAdmins.map(admin => ({
      id: admin._id,
      label: admin.firstName,
      hide: admin.roles.includes(ROLES.DEV),
    })),
  ];
  const statusOptions = [
    { id: null, label: 'Tous' },
    ...INSURANCE_REQUEST_STATUS_ORDER.map(s => ({
      id: s,
      label: <T id={`Forms.status.${s}`} />,
    })),
  ];

  const organisationOptions = [
    { id: null, label: 'Tous' },
    ...organisations.map(({ _id, name }) => ({ id: _id, label: name })),
  ];

  return (
    <>
      <div className="left">
        <LoanBoardOptionsCheckboxes
          label="Conseiller"
          value={assignedEmployeeValue}
          options={assignedEmployeeOptions}
          onChange={next =>
            makeOnChange('assignedEmployeeId', dispatch)(
              assignedEmployeeValue,
              next,
            )
          }
        />

        <LoanBoardOptionsCheckboxes
          label="Statut"
          value={statusValue}
          options={statusOptions}
          onChange={next => makeOnChange('status', dispatch)(statusValue, next)}
        />

        <LoanBoardOptionsCheckboxes
          label="Assureurs"
          value={organisationIdValue}
          options={organisationOptions}
          onChange={next =>
            makeOnChange('organisationId', dispatch)(organisationIdValue, next)
          }
        />

        <div>
          <StickyPopover
            component={
              <RadioButtons
                options={groupByOptions}
                onChange={newValue =>
                  dispatch({ type: ACTIONS.SET_GROUP_BY, payload: newValue })
                }
                value={groupBy}
                radioGroupStyle={{ flexDirection: 'column' }}
              />
            }
            placement="bottom"
          >
            <b>Mode d'affichage</b>
          </StickyPopover>
          <div>{groupByOptions.find(({ id }) => id === groupBy).label}</div>
        </div>
      </div>

      <div className="right">
        <Button
          raised
          primary
          onClick={() => dispatch({ type: ACTIONS.RESET })}
        >
          Reset
        </Button>
        <IconButton onClick={refetchInsuranceRequests} type="loop" />
      </div>
    </>
  );
};

export default insuranceRequestBoardContent;
