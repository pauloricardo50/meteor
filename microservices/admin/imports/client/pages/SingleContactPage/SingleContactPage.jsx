// @flow
import React from 'react';
import SingleContactPageContainer from './SingleContactPageContainer';
import SingleContactPageHeader from './SingleContactPageHeader';
import SingleContactPageInfos from './SingleContactPageInfos';

type SingleContactPageProps = {
  contact: Object,
};

const SingleContactPage = ({ contact }: SingleContactPageProps) => {
  console.log('contact', contact);
  return (
    <div className="card1 card-top">
      <SingleContactPageHeader contact={contact} />
      <SingleContactPageInfos contact={contact} />
    </div>
  );
};

export default SingleContactPageContainer(SingleContactPage);
