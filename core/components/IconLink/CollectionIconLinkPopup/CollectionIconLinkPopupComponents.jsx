import React from 'react';

import {
  LOANS_COLLECTION,
  USERS_COLLECTION,
  BORROWERS_COLLECTION,
  PROPERTIES_COLLECTION,
  OFFERS_COLLECTION,
  PROMOTIONS_COLLECTION,
  ORGANISATIONS_COLLECTION,
  CONTACTS_COLLECTION,
} from '../../../api/constants';

export default {
  [LOANS_COLLECTION]: ({ _id }) => <div>{_id}</div>,
  [USERS_COLLECTION]: ({ _id }) => <div>{_id}</div>,
  [BORROWERS_COLLECTION]: ({ _id }) => <div>{_id}</div>,
  [PROPERTIES_COLLECTION]: ({ _id }) => <div>{_id}</div>,
  [OFFERS_COLLECTION]: ({ _id }) => <div>{_id}</div>,
  [PROMOTIONS_COLLECTION]: ({ _id }) => <div>{_id}</div>,
  [ORGANISATIONS_COLLECTION]: ({ _id }) => <div>{_id}</div>,
  [CONTACTS_COLLECTION]: ({ _id }) => <div>{_id}</div>,
};
