// @flow
import React from 'react';

import Button from '../../../core/components/Button';
import Icon from '../../../core/components/Icon';
import T from '../../../core/components/Translation';

type BorrowersPageNextTabProps = {};

const BorrowersPageNextTab = ({
  tabId,
  makeLink,
}: BorrowersPageNextTabProps) => {
  const isFinance = tabId === 'finance';
  const nextTab = isFinance ? 'personal' : 'finance';
  return (
    <Button
      icon={<Icon type={isFinance ? 'left' : 'right'} />}
      iconAfter={!isFinance}
      raised
      primary
      link
      to={makeLink(nextTab)}
    >
      <T id={`BorrowersPage.${nextTab}`} />
    </Button>
  );
};

export default BorrowersPageNextTab;
