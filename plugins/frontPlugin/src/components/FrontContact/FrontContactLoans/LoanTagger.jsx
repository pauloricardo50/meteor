import React from 'react';
import Checkbox from '../../../core/components/Checkbox';

const { Front } = window;

const getLoanTag = loan => {
  const { name } = loan;

  return `loan/${name}`;
};

const LoanTagger = ({ loan, conversation }) => {
  console.log('conversation:', conversation);
  const { name } = loan;
  const { tags = [] } = conversation;
  const loanTag = getLoanTag(loan);
  const isTagged = tags.some(tag => tag === loanTag);

  return (
    <Checkbox
      onChange={event => {
        if (isTagged) {
          return Front.detachTag(loanTag);
        }

        return Front.attachTag(loanTag);
      }}
      value={isTagged}
      label={`Ajouter le tag "${name}"`}
    />
  );
};

export default LoanTagger;
