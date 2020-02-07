import React from 'react';
import SimpleSchema from 'simpl-schema';
import moment from 'moment';

import { AutoFormDialog } from 'core/components/AutoForm2';
import IconButton from 'core/components/IconButton';
import { Money } from 'core/components/Translation';
import { consolidateRevenue } from 'core/api/revenues/index';
import { decimalNegativeMoneyField } from 'core/api/helpers/sharedSchemas';
import { CUSTOM_AUTOFIELD_TYPES } from 'core/components/AutoForm2/constants';
import { ORGANISATIONS_COLLECTION } from 'core/api/constants';
import CollectionIconLink from 'core/components/IconLink/CollectionIconLink';

const schema = new SimpleSchema({
  amount: {
    ...decimalNegativeMoneyField,
    optional: false,
    uniforms: { label: 'Montant exact' },
  },
  paidAt: {
    type: Date,
    uniforms: { type: CUSTOM_AUTOFIELD_TYPES.DATE },
  },
});

const RevenueConsolidator = ({
  revenue: { amount, _id: revenueId, sourceOrganisation, description, paidAt },
  onSubmitted = () => null,
}) => (
  <AutoFormDialog
    title="Confirmer paiement de"
    description={
      <div>
        <h2 className="text-center">
          <Money value={amount} />
          <small className="secondary">
            {sourceOrganisation && (
              <>
                &nbsp;
                <CollectionIconLink
                  relatedDoc={{
                    ...sourceOrganisation,
                    collection: ORGANISATIONS_COLLECTION,
                  }}
                />
              </>
            )}
          </small>
        </h2>
        {description && <p className="text-center">{description}</p>}
      </div>
    }
    schema={schema}
    model={{ amount, paidAt: moment(paidAt).format('YYYY-MM-DD') }}
    onSubmit={values =>
      consolidateRevenue.run({ revenueId, ...values }).finally(onSubmitted)
    }
    triggerComponent={handleOpen => (
      <IconButton
        onClick={handleOpen}
        size="small"
        type="check"
        tooltip="Confirmer réception du paiememt"
        className="success"
      />
    )}
    layout={[{ className: 'grid-col', fields: ['amount', 'paidAt'] }]}
  />
);

export default RevenueConsolidator;
