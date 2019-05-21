// @flow
import React from 'react';
import ReactMarkdown from 'react-markdown';

import Recap from 'core/components/Recap';
import UpdateField from 'core/components/UpdateField';
import { LOANS_COLLECTION } from 'imports/core/api/constants';
import ClickToEditField from 'core/components/ClickToEditField';
import { loanUpdate } from 'core/api/loans/index';
import DateModifier from 'core/components/DateModifier';
import StructureForm from './StructureForm';

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
        <ClickToEditField
          value={loan.adminNote}
          onSubmit={value =>
            loanUpdate.run({ loanId: loan._id, object: { adminNote: value } })
          }
          placeholder="# Ajouter une note"
          inputProps={{
            style: { width: '100%' },
            multiline: true,
            placeholder:
              '# Un titre - ## Un sous-titre - * liste - **En gras** - *En italique* -- "CMD + Enter" pour enregistrer',
          }}
        >
          {value => <ReactMarkdown source={value} />}
        </ClickToEditField>
      </div>

      <div className="structure-form">
        <StructureForm {...props} />
        <Recap {...props} arrayName="premium" />
      </div>
    </div>
  );
};

export default PremiumOverviewTab;
