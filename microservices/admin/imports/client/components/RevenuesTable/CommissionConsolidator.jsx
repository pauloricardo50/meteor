import React from 'react';
import moment from 'moment';
import SimpleSchema from 'simpl-schema';

import { percentageField } from 'core/api/helpers/sharedSchemas';
import { ORGANISATIONS_COLLECTION } from 'core/api/organisations/organisationConstants';
import { consolidateCommission } from 'core/api/revenues/methodDefinitions';
import { AutoFormDialog } from 'core/components/AutoForm2';
import { CUSTOM_AUTOFIELD_TYPES } from 'core/components/AutoForm2/autoFormConstants';
import IconButton from 'core/components/IconButton';
import CollectionIconLink from 'core/components/IconLink/CollectionIconLink';
import { Money, Percent } from 'core/components/Translation';

const schema = new SimpleSchema({
  commissionRate: {
    ...percentageField,
    optional: false,
  },
  paidAt: {
    type: Date,
    uniforms: {
      type: CUSTOM_AUTOFIELD_TYPES.DATE,
      label: 'Paiement effectué le',
    },
  },
});

const CommissionsConsolidator = ({
  amount,
  paidAt,
  commissionRate,
  commissionAmount,
  organisation,
  revenueId,
}) => (
  <AutoFormDialog
    title="Confirmer paiment de la commission"
    description={
      <div>
        <h2 className="text-center">
          <Money value={commissionAmount} />
          <small className="secondary">
            {organisation && (
              <>
                &nbsp;
                <CollectionIconLink
                  relatedDoc={{
                    ...organisation,
                    collection: ORGANISATIONS_COLLECTION,
                  }}
                />
              </>
            )}
          </small>
        </h2>
        <p className="text-center">
          <Percent value={commissionRate} />
          de
          <Money value={amount} />
        </p>
      </div>
    }
    schema={schema}
    model={{
      commissionRate,
      paidAt: paidAt && moment(paidAt).format('YYYY-MM-DD'),
    }}
    onSubmit={values =>
      consolidateCommission.run({
        revenueId,
        organisationId: organisation._id,
        ...values,
      })
    }
    triggerComponent={handleOpen => (
      <IconButton
        onClick={handleOpen}
        size="small"
        type="check"
        tooltip="Confirmer paiememt de la commission"
        className="success"
      />
    )}
    layout={[{ className: 'grid-col', fields: ['commissionRate', 'paidAt'] }]}
  />
);

export default CommissionsConsolidator;
