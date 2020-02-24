import React from 'react';

import Tabs from 'core/components/Tabs';
import T from 'core/components/Translation';
import { CONTACTS_COLLECTION } from 'core/api/constants';
import SingleContactPageContainer from './SingleContactPageContainer';
import SingleContactPageHeader from './SingleContactPageHeader';
import SingleContactPageInfos from './SingleContactPageInfos';
import OffersTable from '../SingleOrganisationPage/OffersTable/OffersTable';
import CollectionTasksTable from '../../components/TasksTable/CollectionTasksTable';

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
    <CollectionTasksTable
      doc={contact}
      collection={CONTACTS_COLLECTION}
      withTaskInsert
      withQueryTaskInsert
    />
    {contact.offers && !!contact.offers.length && (
      <Tabs tabs={tabs({ offers: contact.offers })} />
    )}
  </div>
);

export default SingleContactPageContainer(SingleContactPage);
