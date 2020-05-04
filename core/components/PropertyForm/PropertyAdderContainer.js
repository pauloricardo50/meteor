import { useState } from 'react';
import { withProps } from 'recompose';

import {
  loanGetReusableProperties,
  loanLinkProperty,
} from '../../api/loans/methodDefinitions';

const makeLinkProperty = ({
  afterInsert,
  setOpenModal,
  loanId,
}) => propertyId =>
  loanLinkProperty
    .run({ loanId, propertyId })
    .then(afterInsert)
    .then(() => setOpenModal(false));

const makeOnClick = ({
  loanId,
  setOpenModal,
  setReusableProperties,
  setOpenPropertyAdder,
  userId,
}) => () =>
  userId
    ? loanGetReusableProperties
        .run({ loanId })
        .then((reusableProperties = []) => {
          if (reusableProperties?.length) {
            setReusableProperties(reusableProperties);
            return setOpenModal(true);
          }

          return setOpenPropertyAdder(true);
        })
    : setOpenPropertyAdder(true);

export default withProps(({ loanId, userId, afterInsert = () => ({}) }) => {
  const [reusableProperties, setReusableProperties] = useState();
  const [openPropertyAdder, setOpenPropertyAdder] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const linkProperty = makeLinkProperty({
    afterInsert,
    setOpenModal,
    loanId,
  });

  const onClick = makeOnClick({
    loanId,
    setOpenModal,
    setReusableProperties,
    setOpenPropertyAdder,
    userId,
  });

  return {
    onClick,
    openModal,
    setOpenModal,
    reusableProperties,
    linkProperty,
    openPropertyAdder,
    setOpenPropertyAdder,
  };
});
