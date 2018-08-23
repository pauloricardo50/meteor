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
    <Button raised primary link to={makeLink(nextTab)}>
      {isFinance && <Icon type="left" />}
      <T id={`BorrowersPage.${nextTab}`} />
      {!isFinance && <Icon type="right" />}
    </Button>
  );
};

export default BorrowersPageNextTab;
