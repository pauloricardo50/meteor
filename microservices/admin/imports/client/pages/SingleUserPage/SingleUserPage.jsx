import { Roles } from 'meteor/alanning:roles';

import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

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
import CollectionTasksDataTable from '../../components/TasksDataTable/CollectionTasksDataTable';
import PromotionList from './PromotionList';
import SingleUserPageContainer from './SingleUserPageContainer';
import SingleUserPageHeader from './SingleUserPageHeader';

const SingleUserPage = ({
  user,
  className,
  currentUser,
  children,
  history,
}) => {
  const {
    loans,
    _id: userId,
    promotions,
    proProperties,
    insuranceRequests,
    name,
  } = user;
  const isUser = Roles.userIsInRole(user, ROLES.USER);
  const isPro = Roles.userIsInRole(user, ROLES.PRO);
  const currentUserIsDev = Roles.userIsInRole(currentUser, ROLES.DEV);

  return (
    <section
      className={classnames('card1 card-top single-user-page', className)}
    >
      <Helmet>
        <title>{name}</title>
      </Helmet>

      <SingleUserPageHeader user={user} currentUser={currentUser} />
      <AdminTimeline
        docId={userId}
        collection={USERS_COLLECTION}
        withActivityAdder={false}
      />

      <CollectionTasksDataTable
        docId={user._id}
        collection={user._collection}
        className="mt-40"
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
        <div className="mt-40">
          <h3 className="mt-0">Dossiers</h3>
          <ProCustomersTable proUser={user} isAdmin />
        </div>
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
