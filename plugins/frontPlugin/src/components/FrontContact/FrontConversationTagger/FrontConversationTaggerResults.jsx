import React, { useRef } from 'react';
import CollectionSearch from '../../../core/components/CollectionSearch';
import { getLoanLinkTitle } from '../../../core/components/IconLink/collectionIconLinkHelpers';
import LoanTagger from '../FrontContactLoans/LoanTagger';
import StatusLabel from '../../../core/components/StatusLabel';
import PremiumBadge from '../../../core/components/PremiumBadge/PremiumBadge';
import {
  LOANS_COLLECTION,
  LOAN_CATEGORIES,
} from '../../../core/api/loans/loanConstants';

const makeRenderLoan = ({ conversation, tags, setTags }) => loan => {
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
        tags={tags}
        setTags={setTags}
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
  tags,
  setTags,
}) => (
  <div className="flex-col mt-16 center-align">
    <CollectionSearch
      func={fetchLoans}
      renderItem={makeRenderLoan({ conversation, tags, setTags })}
      type="list"
      className="flex-col"
      style={{ width: '100%' }}
    />
  </div>
);

export default FrontConversationTaggerResults;
