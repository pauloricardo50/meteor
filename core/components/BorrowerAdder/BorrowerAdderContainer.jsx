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
      .then(() => setOpenModal(false));
  }

  if (insuranceRequestId) {
    return insuranceRequestInsertBorrower
      .run({ insuranceRequestId })
      .then(afterInsert)
      .then(() => setOpenModal(false));
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
      .then(() => setOpenModal(false));
  }

  if (insuranceRequestId) {
    return insuranceRequestLinkBorrower
      .run({ insuranceRequestId, borrowerId })
      .then(afterInsert)
      .then(() => setOpenModal(false));
  }
};

const makeOnClick = ({
  loanId,
  insuranceRequestId,
  setOpenModal,
  setReusableBorrowers,
  insertBorrower,
}) => async () => {
  const reusableBorrowers = await getReusableBorrowers.run({
    loanId,
    insuranceRequestId,
  });

  if (reusableBorrowers?.length) {
    setReusableBorrowers(reusableBorrowers);
    return setOpenModal(true);
  }

  return insertBorrower();
};

export default withProps(
  ({ loanId, insuranceRequestId, afterInsert = () => ({}) }) => {
    const [reusableBorrowers, setReusableBorrowers] = useState();
    const [openModal, setOpenModal] = useState(false);
    const insertBorrower = makeInsertBorrower({
      afterInsert,
      setOpenModal,
      loanId,
      insuranceRequestId,
    });

    return {
      onClick: makeOnClick({
        loanId,
        insuranceRequestId,
        setOpenModal,
        setReusableBorrowers,
        insertBorrower,
      }),
      openModal,
      setOpenModal,
      reusableBorrowers,
      insertBorrower,
      linkBorrower: makeLinkBorrower({
        afterInsert,
        setOpenModal,
        loanId,
        insuranceRequestId,
      }),
      borrowerLabel: loanId ? 'emprunteur' : 'assuré',
    };
  },
);
