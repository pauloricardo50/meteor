import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import { ROLES, USERS_COLLECTION } from 'core/api/users/userConstants';
import ProCustomersTable from 'core/components/ProCustomersTable/ProCustomersTable';
import {
  columnOptions,
  makeMapProperty,
} from 'core/components/PropertiesTable/PropertiesTableContainer';
import Table from 'core/components/Table';

import AdminTimeline from '../../components/AdminTimeline/AdminTimeline';
import EmailList from '../../components/EmailList';
import InsuranceRequestsSummaryList from '../../components/InsuranceRequestsSummaryList/InsuranceRequestsSummaryList';
import LoanSummaryList from '../../components/LoanSummaryList';
import CollectionTasksTable from '../../components/TasksTable/CollectionTasksTable';
import PromotionList from './PromotionList';
import SingleUserPageContainer from './SingleUserPageContainer';
import SingleUserPageHeader from './SingleUserPageHeader';

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
    insuranceRequests,
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
      <AdminTimeline
        docId={userId}
        collection={USERS_COLLECTION}
        withActivityAdder={false}
      />
      <CollectionTasksTable
        doc={user}
        collection={USERS_COLLECTION}
        withTaskInsert
        withQueryTaskInsert
      />
      {(isUser || (loans && loans.length > 0)) && (
        <LoanSummaryList loans={loans} userId={user._id} withAdder />
      )}

      {(isUser || insuranceRequests?.length) && (
        <InsuranceRequestsSummaryList
          insuranceRequests={insuranceRequests}
          user={user}
          withKeepAssigneesCheckbox={false}
        />
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
