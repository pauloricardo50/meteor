// @flow
import React from 'react';
import SingleContactPageContainer from './SingleContactPageContainer';
import SingleContactPageHeader from './SingleContactPageHeader';
import SingleContactPageInfos from './SingleContactPageInfos';

type SingleContactPageProps = {
  contact: Object,
};

const SingleContactPage = ({ contact }: SingleContactPageProps) => (
  <div className="card1 card-top">
    <SingleContactPageHeader contact={contact} />
    <SingleContactPageInfos contact={contact} />
  </div>
);

export default SingleContactPageContainer(SingleContactPage);
