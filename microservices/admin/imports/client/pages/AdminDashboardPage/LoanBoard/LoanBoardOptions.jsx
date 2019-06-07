// @flow
import React from 'react';

import T from 'core/components/Translation';
import Button from 'core/components/Button';
import RadioButtons from 'core/components/RadioButtons';
import CheckboxList from 'core/components/Checkbox/CheckboxList';
import { STEP_ORDER } from 'core/api/constants';
import { injectIntl } from 'react-intl';
import { LOAN_STATUS_ORDER } from 'imports/core/api/constants';
import { ACTIONS, GROUP_BY } from './loanBoardHelpers';

type LoanBoardOptionsProps = {};

const makeOnChange = (filterName, dispatch) => (prev, next) => {
  console.log('prev:', prev);
  console.log('next:', next);
  if (!prev.includes(null) && next.includes(null)) {
    console.log('1');

    dispatch({
      type: ACTIONS.SET_FILTER,
      payload: { name: filterName, value: undefined },
    });
  } else if (prev.includes(null) && next.length > 1) {
    console.log('2');
    dispatch({
      type: ACTIONS.SET_FILTER,
      payload: { name: filterName, value: { $in: next.filter(x => x) } },
    });
  } else {
    console.log('3');
    dispatch({
      type: ACTIONS.SET_FILTER,
      payload: { name: filterName, value: { $in: next } },
    });
  }
};

const LoanBoardOptions = ({
  options,
  dispatch,
  admins,
  intl: { formatMessage: f },
  promotions,
}: LoanBoardOptionsProps) => {
  const { assignedEmployeeId, step, groupBy, status, promotionId } = options;
  const statusValue = status ? status.$in : [null];
  const stepValue = step ? step.$in : [null];
  const promotionIdValue = promotionId ? promotionId.$in : [null];

  return (
    <div className="loan-board-options">
      <CheckboxList
        value={assignedEmployeeId.$in}
        label="Conseiller"
        options={[
          { id: null, label: 'Personne' },
          ...admins.map(admin => ({
            id: admin._id,
            label: admin.firstName,
          })),
        ]}
        onChange={(values) => {
          dispatch({
            type: ACTIONS.SET_FILTER,
            payload: { name: 'assignedEmployeeId', value: { $in: values } },
          });
        }}
        className="checkbox-list"
      />

      <CheckboxList
        value={statusValue}
        label="Statut"
        options={[
          { id: null, label: 'Tous' },
          ...LOAN_STATUS_ORDER.map(s => ({
            id: s,
            label: <T id={`Forms.status.${s}`} />,
          })),
        ]}
        onChange={next => makeOnChange('status', dispatch)(statusValue, next)}
        className="checkbox-list"
      />

      <CheckboxList
        value={stepValue}
        label="Étape du dossier"
        options={[
          { id: null, label: 'Tous' },
          ...STEP_ORDER.map(s => ({
            id: s,
            label: <T id={`Forms.step.${s}`} />,
          })),
        ]}
        onChange={next => makeOnChange('step', dispatch)(stepValue, next)}
        className="checkbox-list"
      />

      <CheckboxList
        value={promotionIdValue}
        label="Promotions"
        options={[
          { id: null, label: 'Tous' },
          ...promotions.map(({ _id, name }) => ({ id: _id, label: name })),
        ]}
        onChange={next =>
          makeOnChange('promotionId', dispatch)(promotionIdValue, next)
        }
        className="checkbox-list"
      />

      <RadioButtons
        label={<b>Mode d'affichage</b>}
        options={[
          { id: GROUP_BY.STATUS, label: 'Par statut' },
          { id: GROUP_BY.PROMOTION, label: 'Par promo' },
          { id: GROUP_BY.ADMIN, label: 'Par conseiller' },
        ]}
        onChange={(_, newValue) =>
          dispatch({ type: ACTIONS.SET_GROUP_BY, payload: newValue })
        }
        hoverHide
        value={groupBy}
        radioGroupStyle={{ flexDirection: 'column' }}
      />

      <Button raised primary onClick={() => dispatch({ type: ACTIONS.RESET })}>
        Reset
      </Button>
    </div>
  );
};

export default injectIntl(LoanBoardOptions);
