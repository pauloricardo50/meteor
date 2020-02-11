import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { ROLES } from 'core/api/constants';
import ProCustomersTable from 'core/components/ProCustomersTable/ProCustomersTable';
import {
  columnOptions,
  makeMapProperty,
} from 'core/components/PropertiesTable/PropertiesTableContainer';
import Table from 'core/components/Table';
import SingleUserPageContainer from './SingleUserPageContainer';
import SingleUserPageHeader from './SingleUserPageHeader';
import LoanSummaryList from '../../components/LoanSummaryList';
import EmailList from '../../components/EmailList';
import PromotionList from './PromotionList';
import UserActivities from './UserActivities';
import SingleUserPageTasks from './SingleUserPageTasks';

const SingleUserPage = ({
  user,
  className,
  currentUser,
  children,
  history,
  activities,
}) => {
  const {
    loans,
    _id: userId,
    assignedEmployee,
    promotions,
    proProperties,
  } = user;
  const isUser = user.roles.includes(ROLES.USER);
  const isPro = user.roles.includes(ROLES.PRO);
  const currentUserIsDev = currentUser.roles.includes(ROLES.DEV);

  return (
    <section
      className={classnames('card1 card-top single-user-page', className)}
    >
      <SingleUserPageHeader
        user={{
          ...user,
          assignedEmployeeId: assignedEmployee && assignedEmployee._id,
        }}
        currentUser={currentUser}
      />
      <UserActivities userId={userId} />
      <SingleUserPageTasks user={user} />
      {(isUser || (loans && loans.length > 0)) && (
        <LoanSummaryList loans={loans} userId={user._id} withAdder />
      )}

      {promotions && promotions.length > 0 && (
        <PromotionList promotions={promotions} />
      )}

      {proProperties && proProperties.length > 0 && (
        <>
          <h3>Biens immobiliers</h3>
          <Table
            rows={proProperties.map(makeMapProperty({ history, currentUser }))}
            columnOptions={columnOptions}
          />
        </>
      )}

      {isPro && (
        <>
          <h3>Dossiers</h3>
          <ProCustomersTable proUser={user} isAdmin />
        </>
      )}

      {/* Make sure this component reloads when the userId changes */}
      {currentUserIsDev && <EmailList userId={userId} key={userId} />}
      {children}
    </section>
  );
};

SingleUserPage.propTypes = {
  className: PropTypes.string,
  user: PropTypes.object.isRequired,
};

SingleUserPage.defaultProps = {
  className: '',
};

export default SingleUserPageContainer(SingleUserPage);
