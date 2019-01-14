// @flow
import React from 'react';

import Tabs from 'core/components/Tabs';
import T from 'core/components/Translation';
import SingleContactPageContainer from './SingleContactPageContainer';
import SingleContactPageHeader from './SingleContactPageHeader';
import SingleContactPageInfos from './SingleContactPageInfos';
import OffersTable from '../SingleOrganisationPage/OffersTable/OffersTable';

type SingleContactPageProps = {
  contact: Object,
};

const tabs = props =>
  [{ id: 'offers', Component: OffersTable }].map(({ id, Component, style = {} }) => ({
    id,
    content: <Component {...props} />,
    label: (
      <span style={style}>
        <T id={`SingleContactPageTabs.${id}`} noTooltips />
      </span>
    ),
  }));

const SingleContactPage = ({ contact }: SingleContactPageProps) => {
  console.log('contact', contact);
  return (
    <div className="card1 card-top">
      <SingleContactPageHeader contact={contact} />
      <SingleContactPageInfos contact={contact} />
      <Tabs
        tabs={tabs({
          offers: contact.offers,
        })}
      />
    </div>
  );
};

export default SingleContactPageContainer(SingleContactPage);
