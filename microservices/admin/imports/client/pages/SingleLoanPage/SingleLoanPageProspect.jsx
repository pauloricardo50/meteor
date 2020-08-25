import React from 'react';
import { Helmet } from 'react-helmet';

import { LOANS_COLLECTION } from 'core/api/loans/loanConstants';
import { setUserStatus } from 'core/api/users/methodDefinitions';
import { USER_STATUS } from 'core/api/users/userConstants';
import collectionIcons from 'core/arrays/collectionIcons';
import ConfirmMethod from 'core/components/ConfirmMethod';
import Icon from 'core/components/Icon';
import { CollectionIconLink } from 'core/components/IconLink';
import Recap from 'core/components/Recap';
import T from 'core/components/Translation';
import Calculator from 'core/utils/Calculator';

import CollectionTasksDataTable from '../../components/TasksDataTable/CollectionTasksDataTable';
import SingleLoanPageContacts from './SingleLoanPageContacts';
import SingleLoanPageHeader from './SingleLoanPageHeader';

const SingleLoanPageProspect = props => {
  const { loan } = props;
  const { borrowers, properties, userCache } = loan;
  const loanHasMinimalInformation = Calculator.loanHasMinimalInformation({
    loan,
  });
  return (
    <section className="single-loan-page">
      <Helmet>
        <title>{loan.user ? loan.user.name : loan.name}</title>
      </Helmet>
      <SingleLoanPageHeader loan={loan} />
      <div className="single-loan-page-sub-header">
        <CollectionTasksDataTable
          docId={loan._id}
          collection={loan._collection}
          className="single-loan-page-tasks card1 card-top"
          noInitialFilter
        />
        <SingleLoanPageContacts loan={loan} />
      </div>
      <div className="card1 card-top">
        <div className="text-center mb-32 mt-16 animated fadeIn">
          <Icon
            type={collectionIcons[LOANS_COLLECTION]}
            style={{ fontSize: 80 }}
          />

          <h4
            className="secondary"
            style={{ maxWidth: 400, margin: 'auto', marginBottom: 16 }}
          >
            Ce client est en train d'être drippé, passez le en qualifié pour
            accéder au dossier. Il ne sera alors plus drippé!
          </h4>

          <ConfirmMethod
            label="Passer en qualifié"
            buttonProps={{ raised: true, primary: true, size: 'large' }}
            method={() =>
              setUserStatus.run({
                userId: userCache._id,
                status: USER_STATUS.QUALIFIED,
                reason: 'Manual change',
                source: 'admin',
              })
            }
          />
        </div>

        <div className="flex">
          <div className="mr-16">
            <h2>Emprunteurs</h2>
            <div>
              {borrowers.map(borrower => (
                <CollectionIconLink key={borrower._id} relatedDoc={borrower} />
              ))}
              {!borrowers?.length ? 'Aucun' : null}
            </div>
          </div>

          <div>
            <h2>Biens immobiliers</h2>
            <div>
              {properties.map(property => (
                <CollectionIconLink key={property._id} relatedDoc={property} />
              ))}
              {!properties?.length ? 'Aucun' : null}
            </div>
          </div>
        </div>

        <div className="recap-div">
          <h2 className="fixed-size">
            <T id="OverviewTab.recap" />
          </h2>
          {loanHasMinimalInformation ? (
            <Recap {...props} arrayName="dashboard" />
          ) : (
            <T id="OverviewTab.emptyRecap" />
          )}
        </div>
      </div>
    </section>
  );
};

export default SingleLoanPageProspect;
