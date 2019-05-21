// @flow
import React from 'react';

import Recap from 'core/components/Recap';
import UpdateField from 'core/components/UpdateField';
import { LOANS_COLLECTION } from 'core/api/constants';

import DateModifier from 'core/components/DateModifier';
import StructureForm from './StructureForm';
import AdminNote from '../../../components/AdminNote/AdminNote';

type PremiumOverviewTabProps = {};

const PremiumOverviewTab = (props: PremiumOverviewTabProps) => {
  const { loan } = props;
  return (
    <div className="premium-overview">
      <div className="card1 card-top top">
        <UpdateField
          doc={loan}
          fields={['category']}
          collection={LOANS_COLLECTION}
        />
        <UpdateField
          doc={loan}
          fields={['residenceType']}
          collection={LOANS_COLLECTION}
        />
        {['signingDate', 'closingDate'].map(dateType => (
          <DateModifier
            collection={LOANS_COLLECTION}
            doc={loan}
            field={dateType}
            key={`${loan._id}${dateType}`}
          />
        ))}
      </div>

      <div>
        <AdminNote
          docId={loan._id}
          adminNote={loan.adminNote}
          collection={LOANS_COLLECTION}
        />
      </div>

      <div className="structure-form">
        <StructureForm {...props} />
        <Recap {...props} arrayName="premium" />
      </div>
    </div>
  );
};

export default PremiumOverviewTab;
