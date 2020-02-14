import React from 'react';

import FrontCard from '../../FrontCard/FrontCard';
import FrontCardItem from '../../FrontCard/FrontCardItem';
import StatusLabel from '../../../core/components/StatusLabel';
import {
  LOANS_COLLECTION,
  LOAN_CATEGORIES,
} from '../../../core/api/loans/loanConstants';
import PremiumBadge from '../../../core/components/PremiumBadge/PremiumBadge';
import { employeesById } from '../../../core/arrays/epotekEmployees';
import FrontContactTasks from '../FrontContactTasks/FrontContactTasks';
import LoanNotes from './LoanNotes';

const { Front, subdomains } = window;

const LoanCard = ({ loan, expanded, refetch }) => {
  const {
    _id,
    name,
    status,
    category,
    mainAssignee,
    tasks = [],
    adminNotes = [],
  } = loan;
  console.log('adminNotes:', adminNotes);

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
          <div>
            <StatusLabel
              status={status}
              collection={LOANS_COLLECTION}
              className="mr-8"
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
      <LoanNotes notes={adminNotes} />
      <FrontContactTasks tasks={tasks} refetch={refetch} />
    </FrontCard>
  );
};

export default LoanCard;
