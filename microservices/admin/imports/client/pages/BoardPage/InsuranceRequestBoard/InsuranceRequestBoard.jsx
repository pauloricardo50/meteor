import React from 'react';

import Board from '../../../components/Board';
import InsuranceRequestBoardContainer from './InsuranceRequestBoardContainer';
import InsuranceRequestBoardOptions from './InsuranceRequestBoardOptions/InsuranceRequestBoardOptions';
import InsuranceRequestBoardColumnHeader from './InsuranceRequestBoardColumnHeader';
import InsuranceRequestBoardCard from './InsuranceRequestBoardCard/InsuranceRequestBoardCard';
import { ACTIONS } from './insuranceRequestBoardConstants';
import InsuranceRequestModal from './InsuranceRequestModal';

const InsuranceRequestBoard = props => {
  const {
    options,
    dispatch,
    admins,
    devAndAdmins,
    refetchInsuranceRequests,
    data,
    currentUser,
    organisations,
  } = props;

  return (
    <>
      <div className="loan-board">
        <InsuranceRequestBoardOptions
          options={options}
          dispatch={dispatch}
          admins={admins}
          devAndAdmins={devAndAdmins}
          refetchInsuranceRequests={refetchInsuranceRequests}
          organisations={organisations}
        />
        <Board
          data={data}
          columnHeader={InsuranceRequestBoardColumnHeader}
          columnHeaderProps={{ options, dispatch, admins }}
          columnItem={InsuranceRequestBoardCard}
          columnItemProps={{
            setInsuranceRequestId: insuranceRequestId =>
              dispatch({
                type: ACTIONS.SET_INSURANCE_REQUEST_ID,
                payload: insuranceRequestId,
              }),
          }}
        />
        <InsuranceRequestModal
          insuranceRequestId={options.insuranceRequestId}
          closeModal={() =>
            dispatch({ type: ACTIONS.SET_INSURANCE_REQUEST_ID, payload: '' })
          }
          currentUser={currentUser}
        />
      </div>
    </>
  );
};

export default InsuranceRequestBoardContainer(InsuranceRequestBoard);
