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
}: SingleFileTabProps) => {
  const userIsAdmin = Roles.userIsInRole(Meteor.user(), ROLES.DEV)
    || Roles.userIsInRole(Meteor.user(), ROLES.ADMIN);
  return (
    <div className="single-file-tab">
      {userIsAdmin && (
        <AdditionalDocAdder collection={collection} docId={doc._id} />
      )}
      <UploaderArray
        doc={doc}
        collection={collection}
        disabled={disabled}
        documentArray={documentArray}
        currentUser={currentUser}
      />
    </div>
  );
};

export default SingleFileTab;
