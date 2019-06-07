// @flow
import React from 'react';
import { injectIntl } from 'react-intl';

import T from 'core/components/Translation';
import StickyPopover from 'core/components/StickyPopover';
import Button from 'core/components/Button';
import Icon from 'core/components/Icon';
import RadioButtons from 'core/components/RadioButtons';
import CheckboxList from 'core/components/Checkbox/CheckboxList';
import { STEP_ORDER, LOAN_STATUS_ORDER } from 'core/api/constants';
import { ACTIONS, GROUP_BY } from '../loanBoardConstants';
import LoanBoardOptionsCheckboxes from './LoanBoardOptionsCheckboxes';

type LoanBoardOptionsProps = {};

const makeOnChange = (filterName, dispatch) => (prev, next) => {
  if (!prev.includes(null) && next.includes(null)) {
    dispatch({
      type: ACTIONS.SET_FILTER,
      payload: { name: filterName, value: undefined },
    });
  } else if (prev.includes(null) && next.length > 1) {
    dispatch({
      type: ACTIONS.SET_FILTER,
      payload: { name: filterName, value: { $in: next.filter(x => x) } },
    });
  } else {
    dispatch({
      type: ACTIONS.SET_FILTER,
      payload: { name: filterName, value: { $in: next } },
    });
  }
};

const renderCheckboxValue = (values, options) =>
  values.map((i) => {
    const value = options.find(({ id }) => id === i);

    return <div>{value.label}</div>;
  });

const LoanBoardOptions = ({
  options,
  dispatch,
  admins,
  intl: { formatMessage: f },
  promotions,
  refetchLoans,
}: LoanBoardOptionsProps) => {
  const { assignedEmployeeId, step, groupBy, status, promotionId } = options;
  const statusValue = status ? status.$in : [null];
  const stepValue = step ? step.$in : [null];
  const promotionIdValue = promotionId ? promotionId.$in : [null];
  const groupByOptions = [
    { id: GROUP_BY.STATUS, label: 'Par statut' },
    { id: GROUP_BY.PROMOTION, label: 'Par promo' },
    { id: GROUP_BY.ADMIN, label: 'Par conseiller' },
  ];
  const assignedEmployeeOptions = [
    { id: null, label: 'Personne' },
    ...admins.map(admin => ({
      id: admin._id,
      label: admin.firstName,
    })),
  ];
  const statusOptions = [
    { id: null, label: 'Tous' },
    ...LOAN_STATUS_ORDER.map(s => ({
      id: s,
      label: <T id={`Forms.status.${s}`} />,
    })),
  ];
  const stepOptions = [
    { id: null, label: 'Tous' },
    ...STEP_ORDER.map(s => ({
      id: s,
      label: <T id={`Forms.step.${s}`} />,
    })),
  ];
  const promotionIdOptions = [
    { id: null, label: 'Tous' },
    ...promotions.map(({ _id, name }) => ({ id: _id, label: name })),
  ];

  return (
    <div className="loan-board-options">
      <div className="left">
        <LoanBoardOptionsCheckboxes
          label="Conseiller"
          value={assignedEmployeeId.$in}
          options={assignedEmployeeOptions}
          onChange={(values) => {
            dispatch({
              type: ACTIONS.SET_FILTER,
              payload: { name: 'assignedEmployeeId', value: { $in: values } },
            });
          }}
        />

        <LoanBoardOptionsCheckboxes
          label="Statut"
          value={statusValue}
          options={statusOptions}
          onChange={next => makeOnChange('status', dispatch)(statusValue, next)}
        />

        <LoanBoardOptionsCheckboxes
          label="Étape du dossier"
          value={stepValue}
          options={stepOptions}
          onChange={next => makeOnChange('step', dispatch)(stepValue, next)}
        />

        <LoanBoardOptionsCheckboxes
          label="Promotions"
          value={promotionIdValue}
          options={promotionIdOptions}
          onChange={next =>
            makeOnChange('promotionId', dispatch)(promotionIdValue, next)
          }
        />

        <StickyPopover
          component={(
            <RadioButtons
              options={groupByOptions}
              onChange={(_, newValue) =>
                dispatch({ type: ACTIONS.SET_GROUP_BY, payload: newValue })
              }
              value={groupBy}
              radioGroupStyle={{ flexDirection: 'column' }}
            />
          )}
          placement="top"
        >
          <div className="">
            <b>Mode d'affichage</b>
            <div>{groupByOptions.find(({ id }) => id === groupBy).label}</div>
          </div>
        </StickyPopover>
      </div>

      <div className="right">
        <Button
          raised
          primary
          onClick={() => dispatch({ type: ACTIONS.RESET })}
        >
          Reset
        </Button>
        <Button
          raised
          primary
          onClick={refetchLoans}
          icon={<Icon type="loop" />}
        >
          Syncroniser
        </Button>
      </div>
    </div>
  );
};

export default injectIntl(LoanBoardOptions);
