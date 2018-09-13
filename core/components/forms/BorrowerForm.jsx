// @flow
import React from 'react';
import AutoForm from 'uniforms-material/AutoForm';
import omit from 'lodash/omit';

import { BorrowerSchemaAdmin } from 'core/api/borrowers/borrowers';
import { borrowerUpdate } from 'core/api';
import AutoField from './AutoField';

type BorrowerFormProps = {};

const personalFields = [
  'firstName',
  'lastName',
  'gender',
  'age',
  'sameAddress',
  'address1',
  'address2',
  'zipCode',
  'city',
  'isSwiss',
  'residencyPermit',
  'birthDate',
  'citizenship',
  'isUSPerson',
  'civilStatus',
  'childrenCount',
  'company',
];
const financeFields = [
  'salary',
  'bonusExists',
  'bonus2015',
  'bonus2016',
  'bonus2017',
  'bonus2018',
  'otherIncome',
  'otherFortune',
  'expenses',
  'bankFortune',
  'realEstate',
  'insurance2',
  'insurance3A',
  'insurance3B',
  'bank3A',
  'thirdPartyFortune',
];
const grapherLinks = ['loans', 'user', 'documents'];

const otherSchema = BorrowerSchemaAdmin.omit(
  ...personalFields,
  ...financeFields,
);

const BorrowerForm = ({ borrower }: BorrowerFormProps) => (
  <div className="borrower-admin-form">
    <div>
      <h3>Informations personelles</h3>
      <AutoForm
        schema={BorrowerSchemaAdmin.pick(...personalFields)}
        model={borrower}
        onSubmit={doc =>
          borrowerUpdate.run({
            borrowerId: borrower._id,
            object: omit(doc, grapherLinks),
          })
        }
        className="form"
        autoField={AutoField}
      />
    </div>
    <div>
      <h3>Informations financières</h3>
      <AutoForm
        schema={BorrowerSchemaAdmin.pick(...financeFields)}
        model={borrower}
        onSubmit={doc =>
          borrowerUpdate.run({
            borrowerId: borrower._id,
            object: omit(doc, grapherLinks),
          })
        }
        className="form"
        autoField={AutoField}
      />
    </div>
    {otherSchema._schemaKeys.length > 0 && (
      <div>
        <h3>Autres</h3>
        <AutoForm
          schema={otherSchema}
          model={borrower}
          onSubmit={doc =>
            borrowerUpdate.run({
              borrowerId: borrower._id,
              object: omit(doc, grapherLinks),
            })
          }
          className="form"
          autoField={AutoField}
        />
      </div>
    )}
  </div>
);

export default BorrowerForm;
