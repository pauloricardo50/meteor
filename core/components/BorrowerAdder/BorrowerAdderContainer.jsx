import { useState } from 'react';
import { withProps } from 'recompose';

import { getReusableBorrowers } from 'core/api/borrowers/methodDefinitions';

import {
  insuranceRequestInsertBorrower,
  insuranceRequestLinkBorrower,
} from '../../api/insuranceRequests/methodDefinitions';
import {
  loanInsertBorrowers,
  loanLinkBorrower,
} from '../../api/loans/methodDefinitions';

const makeInsertBorrower = ({
  afterInsert,
  setOpenModal,
  loanId,
  insuranceRequestId,
}) => () => {
  if (loanId) {
    return loanInsertBorrowers
      .run({ loanId, amount: 1 })
      .then(afterInsert)
      .finally(() => setOpenModal(false));
  }

  if (insuranceRequestId) {
    return insuranceRequestInsertBorrower
      .run({ insuranceRequestId })
      .then(afterInsert)
      .finally(() => setOpenModal(false));
  }
};

const makeLinkBorrower = ({
  afterInsert,
  setOpenModal,
  loanId,
  insuranceRequestId,
}) => borrowerId => {
  if (loanId) {
    return loanLinkBorrower
      .run({ loanId, borrowerId })
      .then(afterInsert)
      .finally(() => setOpenModal(false));
  }

  if (insuranceRequestId) {
    return insuranceRequestLinkBorrower
      .run({ insuranceRequestId, borrowerId })
      .then(afterInsert)
      .finally(() => setOpenModal(false));
  }
};

const makeOnClick = ({
  loanId,
  insuranceRequestId,
  setOpenModal,
  setReusableBorrowers,
  insertBorrower,
  userId,
}) => () =>
  userId
    ? getReusableBorrowers
        .run({ loanId, insuranceRequestId })
        .then((reusableBorrowers = []) => {
          if (reusableBorrowers?.length) {
            setReusableBorrowers(reusableBorrowers);
            return setOpenModal(true);
          }

          return insertBorrower();
        })
    : insertBorrower();

export default withProps(
  ({ loanId, insuranceRequestId, userId, afterInsert = () => ({}) }) => {
    const [reusableBorrowers, setReusableBorrowers] = useState();
    const [openModal, setOpenModal] = useState(false);
    const insertBorrower = makeInsertBorrower({
      afterInsert,
      setOpenModal,
      loanId,
      insuranceRequestId,
    });
    const linkBorrower = makeLinkBorrower({
      afterInsert,
      setOpenModal,
      loanId,
      insuranceRequestId,
    });

    const onClick = makeOnClick({
      loanId,
      insuranceRequestId,
      setOpenModal,
      setReusableBorrowers,
      insertBorrower,
      userId,
    });

    return {
      onClick,
      openModal,
      setOpenModal,
      reusableBorrowers,
      insertBorrower,
      linkBorrower,
      isBorrower: !!loanId,
    };
  },
);
