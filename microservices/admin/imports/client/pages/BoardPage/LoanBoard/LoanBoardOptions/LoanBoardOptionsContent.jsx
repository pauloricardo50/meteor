import React from 'react';

import {
  LOAN_CATEGORIES,
  LOAN_STATUS_ORDER,
  PURCHASE_TYPE,
  STEP_ORDER,
} from 'core/api/loans/loanConstants';
import { PROMOTION_STATUS } from 'core/api/promotions/promotionConstants';
import { ROLES } from 'core/api/users/userConstants';
import Button from 'core/components/Button';
import IconButton from 'core/components/IconButton';
import RadioButtons from 'core/components/RadioButtons';
import StickyPopover from 'core/components/StickyPopover';
import T from 'core/components/Translation';

import { LiveQueryMonitor } from '../../liveSync';
import { ACTIONS, GROUP_BY, NO_PROMOTION } from '../loanBoardConstants';
import { additionalLoanBoardFields } from '../loanBoardHelpers';
import LoanBoardOptionsCheckboxes from './LoanBoardOptionsCheckboxes';

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

const LoanBoardOptionsContent = ({
  options,
  dispatch,
  devAndAdmins,
  promotions,
  lenders,
  refetchLoans,
  activateLoanBoardSync,
  setActivateLoanBoardSync,
}) => {
  const {
    assignedEmployeeId,
    step,
    groupBy,
    status,
    promotionId,
    lenderId,
    category,
    promotionStatus,
    additionalFields,
    purchaseType,
  } = options;
  const assignedEmployeeValue = assignedEmployeeId
    ? assignedEmployeeId.$in
    : [null];
  const statusValue = status ? status.$in : [null];
  const promotionStatusValue = promotionStatus ? promotionStatus.$in : [null];
  const categoryValue = category ? category.$in : [null];
  const stepValue = step ? step.$in : [null];
  const promotionIdValue = promotionId ? promotionId.$in : [null];
  const lenderIdValue = lenderId ? lenderId.$in : [null];
  const purchaseTypeValue = purchaseType ? purchaseType.$in : [null];

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
    { id: NO_PROMOTION, label: "N'a pas de promotion" },
    ...promotions.map(({ _id, name }) => ({ id: _id, label: name })),
  ];
  const lenderOptions = [
    { id: null, label: 'Tous' },
    ...lenders.map(({ _id, name }) => ({ id: _id, label: name })),
  ];
  const promotionStatusOptions = [
    { id: null, label: 'Tous' },
    ...Object.values(PROMOTION_STATUS).map(s => ({
      id: s,
      label: <T id={`Forms.status.${s}`} />,
    })),
  ];
  const additionalFieldOptions = additionalLoanBoardFields.map(
    ({ id, label, labelId }) => ({ id, label: label || <T id={labelId} /> }),
  );

  const purchaseTypeOptions = [
    { id: null, label: 'Tous' },
    ...Object.values(PURCHASE_TYPE).map(s => ({
      id: s,
      label: <T id={`Forms.purchaseType.${s}`} />,
    })),
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
          label="Type de prêt"
          value={purchaseTypeValue}
          options={purchaseTypeOptions}
          onChange={next =>
            makeOnChange('purchaseType', dispatch)(purchaseTypeValue, next)
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

        <LoanBoardOptionsCheckboxes
          label="Promotions"
          value={promotionIdValue}
          options={promotionIdOptions}
          onChange={next =>
            makeOnChange('promotionId', dispatch)(promotionIdValue, next)
          }
        />

        <LoanBoardOptionsCheckboxes
          label="Statut de la promotion"
          value={promotionStatusValue}
          options={promotionStatusOptions}
          onChange={next =>
            makeOnChange('promotionStatus', dispatch)(
              promotionStatusValue,
              next,
            )
          }
        />

        <LoanBoardOptionsCheckboxes
          label="Infos supplémentaires"
          value={additionalFields}
          options={additionalFieldOptions}
          onChange={next =>
            dispatch({
              type: ACTIONS.SET_FILTER,
              payload: { name: 'additionalFields', value: next },
            })
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
            <div>Mode d'affichage</div>
          </StickyPopover>
          <div className="secondary">
            {groupByOptions.find(({ id }) => id === groupBy).label}
          </div>
        </div>

        <LiveQueryMonitor
          devAndAdmins={devAndAdmins}
          setActivateLoanBoardSync={setActivateLoanBoardSync}
          activateLoanBoardSync={activateLoanBoardSync}
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
    </>
  );
};

export default LoanBoardOptionsContent;
