import React, { useState } from 'react';
import Checkbox from '../../../core/components/Checkbox';
import EpotekFrontApi from '../../../EpotekFrontApi';

export const getLoanTag = loan => {
  const { name } = loan;

  return `loan/${name.replace('-', '_')}`;
};

const {Front} = window;

const LoanTagger = ({ loan, conversation }) => {
  const { _id: loanId } = loan;
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
          Front.moveToInbox('team');
        });
      }}
      value={isTagged}
      label={
        <small>
          Cette conversation concerne ce dossier
          <br />
          <span className="secondary">Apparaîtra dans Admin</span>
        </small>
      }
    />
  );
};

export default LoanTagger;
