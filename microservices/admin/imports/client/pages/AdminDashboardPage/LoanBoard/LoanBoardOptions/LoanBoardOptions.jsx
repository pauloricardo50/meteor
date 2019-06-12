// @flow
import React from 'react';
import { injectIntl } from 'react-intl';

import T from 'core/components/Translation';
import StickyPopover from 'core/components/StickyPopover';
import Button from 'core/components/Button';
import IconButton from 'core/components/IconButton';
import RadioButtons from 'core/components/RadioButtons';
import { STEP_ORDER, LOAN_STATUS_ORDER } from 'core/api/constants';
import { LOAN_CATEGORIES, ROLES } from 'imports/core/api/constants';
import { ACTIONS, GROUP_BY } from '../loanBoardConstants';
import LoanBoardOptionsCheckboxes from './LoanBoardOptionsCheckboxes';
import { LiveQueryMonitor } from '../liveSync';

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

const LoanBoardOptions = ({
  options,
  dispatch,
  admins,
  devAndAdmins,
  intl: { formatMessage: f },
  promotions,
  lenders,
  refetchLoans,
  activateSync,
  setActivateSync,
}: LoanBoardOptionsProps) => {
  const {
    assignedEmployeeId,
    step,
    groupBy,
    status,
    promotionId,
    lenderId,
    category,
  } = options;
  const assignedEmployeeValue = assignedEmployeeId
    ? assignedEmployeeId.$in
    : [null];
  const statusValue = status ? status.$in : [null];
  const categoryValue = category ? category.$in : [null];
  const stepValue = step ? step.$in : [null];
  const promotionIdValue = promotionId ? promotionId.$in : [null];
  const lenderIdValue = lenderId ? lenderId.$in : [null];
  const groupByOptions = [
    { id: GROUP_BY.STATUS, label: 'Par statut' },
    { id: GROUP_BY.PROMOTION, label: 'Par promo' },
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
    ...LOAN_STATUS_ORDER.map(s => ({
      id: s,
      label: <T id={`Forms.status.${s}`} />,
    })),
  ];
  const categoryOptions = [
    { id: null, label: 'Toutes' },
    ...Object.keys(LOAN_CATEGORIES).map(c => ({
      id: c,
      label: <T id={`Forms.category.${c}`} />,
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
    { id: true, label: "N'a pas de promotion" },
    ...promotions.map(({ _id, name }) => ({ id: _id, label: name })),
  ];
  const lenderOptions = [
    { id: null, label: 'Tous' },
    ...lenders.map(({ _id, name }) => ({ id: _id, label: name })),
  ];

  return (
    <div className="loan-board-options">
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
          label="Étape du dossier"
          value={stepValue}
          options={stepOptions}
          onChange={next => makeOnChange('step', dispatch)(stepValue, next)}
        />

        <LoanBoardOptionsCheckboxes
          label="Catégorie"
          value={categoryValue}
          options={categoryOptions}
          onChange={next =>
            makeOnChange('category', dispatch)(categoryValue, next)
          }
        />

        <LoanBoardOptionsCheckboxes
          label="Promotions"
          value={promotionIdValue}
          options={promotionIdOptions}
          onChange={next =>
            makeOnChange('promotionId', dispatch)(promotionIdValue, next)
          }
        />

        <LoanBoardOptionsCheckboxes
          label="Prêteurs"
          value={lenderIdValue}
          options={lenderOptions}
          onChange={next =>
            makeOnChange('lenderId', dispatch)(lenderIdValue, next)
          }
        />

        <div>
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
            placement="bottom"
          >
            <b>Mode d'affichage</b>
          </StickyPopover>
          <div>{groupByOptions.find(({ id }) => id === groupBy).label}</div>
        </div>

        <LiveQueryMonitor
          devAndAdmins={devAndAdmins}
          setActivateSync={setActivateSync}
          activateSync={activateSync}
        />
      </div>

      <div className="right">
        <Button
          raised
          primary
          onClick={() => dispatch({ type: ACTIONS.RESET })}
        >
          Reset
        </Button>
        <IconButton onClick={refetchLoans} type="loop" />
      </div>
    </div>
  );
};

export default injectIntl(LoanBoardOptions);
