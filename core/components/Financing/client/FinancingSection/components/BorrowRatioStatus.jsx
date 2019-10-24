// @flow
import React from 'react';
import {
  getBorrowRatio,
  getBorrowRatioStatus,
} from '../../FinancingResult/financingResultHelpers';
import T from '../../../../Translation';
import { FinmaRatio } from '.';

type BorrowRatioStatusProps = {};

const BorrowRatioStatus = (props: BorrowRatioStatusProps) => {
  const borrowRatio = getBorrowRatio(props);
  const {
    status,
    tooltip: { id, values },
  } = getBorrowRatioStatus(props);

  return (
    <FinmaRatio
      value={borrowRatio}
      status={status}
      tooltip={<T id={id} values={values} />}
      {...props}
    />
  );
};

export default BorrowRatioStatus;
