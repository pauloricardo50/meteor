import React from 'react';

import { LOAN_CATEGORIES } from '../../../core/api/loans/loanConstants';
import { employeesById } from '../../../core/arrays/epotekEmployees';
import PremiumBadge from '../../../core/components/PremiumBadge/PremiumBadge';
import StatusLabel from '../../../core/components/StatusLabel';
import FrontCard from '../../FrontCard/FrontCard';
import FrontContactTasks from '../FrontContactTasks/FrontContactTasks';
import LoanNotes from './LoanNotes';
import LoanTagger from './LoanTagger';

const { Front, subdomains } = window;

const LoanCard = ({
  loan,
  expanded,
  refetch,
  conversation,
  tagIds,
  setTagIds,
}) => {
  const {
    _id,
    name,
    status,
    category,
    mainAssignee,
    tasks = [],
    adminNotes = [],
    _collection,
  } = loan;

  return (
    <FrontCard
      icon="dollarSign"
      title={
        <span
          className="link"
          onClick={event => {
            event.stopPropagation();
            Front.openUrl(`${subdomains.admin}/loans/${_id}`);
          }}
        >
          {name}
        </span>
      }
      subtitle={
        <div className="flex sb center-align" style={{ flexGrow: 1 }}>
          <div className="flex-col start-align">
            <StatusLabel
              status={status}
              collection={_collection}
              className="mb-4"
              small
            />

            {category === LOAN_CATEGORIES.PREMIUM && <PremiumBadge small />}
          </div>
          {mainAssignee && (
            <img
              src={employeesById[mainAssignee._id].src}
              width={24}
              height={24}
              style={{ borderRadius: '50%' }}
              alt={mainAssignee.name}
            />
          )}
        </div>
      }
      expanded={expanded}
    >
      <LoanTagger
        loan={loan}
        conversation={conversation}
        tagIds={tagIds}
        setTagIds={setTagIds}
        refetch={refetch}
      />
      <LoanNotes notes={adminNotes} />
      <FrontContactTasks tasks={tasks} refetch={refetch} />
    </FrontCard>
  );
};

export default LoanCard;
