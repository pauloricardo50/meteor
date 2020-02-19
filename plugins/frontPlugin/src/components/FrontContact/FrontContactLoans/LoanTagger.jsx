import React, { useState } from 'react';
import Checkbox from '../../../core/components/Checkbox';
import EpotekFrontApi from '../../../EpotekFrontApi';

export const getLoanTag = loan => {
  const { name } = loan;

  return `loan/${name.replace('-', '_')}`;
};

const LoanTagger = ({ loan, conversation }) => {
  const { name, _id: loanId } = loan;
  const { tags = [], id: conversationId } = conversation;
  const loanTag = getLoanTag(loan);
  const [isTagged, setIsTagged] = useState(tags.some(tag => tag === loanTag));

  return (
    <Checkbox
      onChange={() => {
        if (isTagged) {
          return EpotekFrontApi.callMethod('frontUntagLoan', {
            loanId,
            conversationId,
          }).then(() => {
            setIsTagged(false);
          });
        }

        return EpotekFrontApi.callMethod('frontTagLoan', {
          loanId,
          conversationId,
        }).then(() => {
          setIsTagged(true);
        });
      }}
      value={isTagged}
      label={`Ajouter le tag "${name}"`}
    />
  );
};

export default LoanTagger;
