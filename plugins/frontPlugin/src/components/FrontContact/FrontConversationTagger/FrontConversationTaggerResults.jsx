import React, { useRef } from 'react';

import {
  LOANS_COLLECTION,
  LOAN_CATEGORIES,
} from '../../../core/api/loans/loanConstants';
import CollectionSearch from '../../../core/components/CollectionSearch';
import { getLoanLinkTitle } from '../../../core/components/IconLink/collectionIconLinkHelpers';
import PremiumBadge from '../../../core/components/PremiumBadge/PremiumBadge';
import StatusLabel from '../../../core/components/StatusLabel';
import LoanTagger from '../FrontContactLoans/LoanTagger';

const Loan = ({ conversation, tagIds, setTagIds, result: loan, refetch }) => {
  const ref = useRef(null);
  const { name, status, category } = loan;
  const title = getLoanLinkTitle(loan);

  return (
    <div
      className="flex center-align"
      style={{ width: '100%' }}
      onClick={() => ref.current.handleChange()}
    >
      <LoanTagger
        setRef={ref}
        loan={loan}
        conversation={conversation}
        withLabel={false}
        tagIds={tagIds}
        setTagIds={setTagIds}
        refetch={refetch}
      />
      <span style={{ width: '80%' }}>
        <div className="flex sb center-align">
          <span>{name}</span>
          {category === LOAN_CATEGORIES.PREMIUM && <PremiumBadge small />}
          <StatusLabel
            status={status}
            collection={LOANS_COLLECTION}
            className="mb-4"
            small
          />
        </div>
        {title !== name && <span className="secondary">{title}</span>}
      </span>
    </div>
  );
};

const FrontConversationTaggerResults = ({
  fetchLoans,
  conversation,
  tagIds,
  setTagIds,
  refetch,
}) => (
  <div className="flex-col mt-16 center-align">
    <CollectionSearch
      func={fetchLoans}
      renderItem={
        <Loan
          conversation={conversation}
          tagIds={tagIds}
          setTagIds={setTagIds}
          refetch={refetch}
        />
      }
      type="list"
      className="flex-col"
      style={{ width: '100%' }}
    />
  </div>
);

export default FrontConversationTaggerResults;
