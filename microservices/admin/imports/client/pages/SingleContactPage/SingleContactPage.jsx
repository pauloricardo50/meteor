import React from 'react';

import Tabs from 'core/components/Tabs';
import T from 'core/components/Translation';

import CollectionTasksDataTable from '../../components/TasksDataTable/CollectionTasksDataTable';
import OffersTable from '../SingleOrganisationPage/OffersTable/OffersTable';
import SingleContactPageContainer from './SingleContactPageContainer';
import SingleContactPageHeader from './SingleContactPageHeader';
import SingleContactPageInfos from './SingleContactPageInfos';

const tabs = props =>
  [
    {
      id: 'offers',
      Component: OffersTable,
      condition: props.offers && !!props.offers.length,
    },
  ].map(({ id, Component, condition, style = {} }) => ({
    id,
    content: <Component {...props} />,
    label: (
      <span style={style}>
        <T id={`SingleContactPage.${id}`} noTooltips />
      </span>
    ),
    condition,
  }));

const SingleContactPage = ({ contact }) => (
  <div className="card1 card-top">
    <SingleContactPageHeader contact={contact} />
    <SingleContactPageInfos contact={contact} />
    <CollectionTasksDataTable
      docId={contact._id}
      collection={contact._collection}
      className="single-loan-page-tasks card1 card-top"
    />
    {contact.offers && !!contact.offers.length && (
      <Tabs tabs={tabs({ offers: contact.offers })} />
    )}
  </div>
);

export default SingleContactPageContainer(SingleContactPage);
