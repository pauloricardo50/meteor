import React from 'react';

import Board from '../../components/Board';
import LoanBoardOptions from './LoanBoardOptions';
import LoanBoardContainer from './LoanBoardContainer';
import LoanBoardColumnHeader from './LoanBoardColumnHeader';
import LoanBoardCard from './LoanBoardCard';
import LoanModal from './LoanModal';
import { ACTIONS } from './loanBoardConstants';

const LoanBoard = ({
  dispatch,
  data,
  admins,
  devAndAdmins,
  promotions,
  lenders,
  refetchLoans,
  currentUser,
  activateLoanBoardSync,
  setActivateLoanBoardSync,
  options,
}) => (
  <>
    <div className="loan-board">
      <LoanBoardOptions
        options={options}
        dispatch={dispatch}
        admins={admins}
        devAndAdmins={devAndAdmins}
        promotions={promotions}
        lenders={lenders}
        refetchLoans={refetchLoans}
        activateLoanBoardSync={activateLoanBoardSync}
        setActivateLoanBoardSync={setActivateLoanBoardSync}
      />
      <Board
        data={data}
        columnHeader={LoanBoardColumnHeader}
        columnHeaderProps={{ options, dispatch, admins, promotions }}
        columnItem={LoanBoardCard}
        columnItemProps={{
          setLoanId: loanId =>
            dispatch({ type: ACTIONS.SET_LOAN_ID, payload: loanId }),
          admins,
          additionalFields: options.additionalFields,
        }}
      />
      <LoanModal
        loanId={options.loanId}
        closeModal={() => dispatch({ type: ACTIONS.SET_LOAN_ID, payload: '' })}
        currentUser={currentUser}
      />
    </div>
  </>
);

export default LoanBoardContainer(LoanBoard);
