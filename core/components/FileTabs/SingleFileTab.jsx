// @flow
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';

import React from 'react';

import UploaderArray from '../UploaderArray';
import AdditionalDocAdder from './AdditionalDocAdder';
import { ROLES } from '../../api/constants';

type SingleFileTabProps = {};

const SingleFileTab = ({
  collection,
  doc,
  disabled,
  documentArray,
  currentUser,
  loan,
}: SingleFileTabProps) => (
  <div className="single-file-tab">
    {Meteor.microservice === 'admin' && (
      <AdditionalDocAdder collection={collection} docId={doc._id} />
    )}
    <UploaderArray
      doc={doc}
      collection={collection}
      disabled={disabled}
      currentUser={currentUser}
      loan={loan}
    />
  </div>
);

export default SingleFileTab;
