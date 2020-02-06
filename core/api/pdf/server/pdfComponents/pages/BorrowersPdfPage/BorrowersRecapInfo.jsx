//
import React from 'react';
import cx from 'classnames';
import moment from 'moment';

import T from 'core/components/Translation';
import PdfTable from '../../PdfTable';
import { getBorrowersInfos, shouldRenderArray } from './borrowersRecapHelpers';
import { ROW_TYPES } from '../../PdfTable/PdfTable';

const getBorrowersInfosArray = ({ borrowers, calculator }) => {
  const borrowersInfos = getBorrowersInfos(borrowers, calculator);

  return [
    {
      label: <T id="PDF.borrowersInfos.category.general" />,
      data: borrowersInfos.name,
      type: ROW_TYPES.TITLE,
      className: 'borrower-table-title-row',
    },
    {
      label: <T id="PDF.borrowersInfos.address" />,
      data: borrowersInfos.address,
    },
    {
      label: <T id="PDF.borrowersInfos.email" />,
      data: borrowersInfos.email,
      condition: shouldRenderArray(borrowersInfos.email),
    },
    {
      label: <T id="PDF.borrowersInfos.phoneNumber" />,
      data: borrowersInfos.phoneNumber,
      condition: shouldRenderArray(borrowersInfos.phoneNumber),
    },
    {
      label: <T id="PDF.borrowersInfos.citizenship" />,
      data: borrowersInfos.citizenship,
    },
    {
      label: <T id="PDF.borrowersInfos.age" />,
      data: borrowersInfos.birthDate.map((date, index) => {
        if (!date) {
          return '-';
        }

        return (
          <span key={index}>
            {borrowersInfos.age[index]}&nbsp;(
            {moment(date).format('DD.MM.YYYY')})
          </span>
        );
      }),
    },
    {
      label: <T id="PDF.borrowersInfos.children" />,
      data: borrowersInfos.childrenCount.map(children => children || '-'),
      condition: shouldRenderArray(borrowersInfos.childrenCount),
    },
    {
      label: <T id="PDF.borrowersInfos.activityType" />,
      data: borrowersInfos.activityType,
    },
    {
      label: <T id="PDF.borrowersInfos.job" />,
      data: borrowersInfos.job,
      condition: shouldRenderArray(borrowersInfos.job),
    },
    {
      label: <T id="PDF.borrowersInfos.company" />,
      data: borrowersInfos.company.map(company => company || '-'),
      condition: shouldRenderArray(borrowersInfos.company),
    },
    {
      label: <T id="PDF.borrowersInfos.civilStatus" />,
      data: borrowersInfos.civilStatus,
      condition: shouldRenderArray(borrowersInfos.civilStatus),
    },
  ];
};

const BorrowersRecapInfo = ({
  anonymous,
  borrowers,
  calculator,
  twoBorrowers,
}) => (
  <PdfTable
    className={cx('borrowers-recap info', { twoBorrowers })}
    rows={getBorrowersInfosArray({ borrowers, anonymous, calculator })}
    columnOptions={[
      {},
      { style: { textAlign: 'right' } },
      { style: { textAlign: 'right' } },
    ]}
  />
);

export default BorrowersRecapInfo;
