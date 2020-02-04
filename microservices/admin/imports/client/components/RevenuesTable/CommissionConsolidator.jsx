//      
import React from 'react';
import SimpleSchema from 'simpl-schema';
import moment from 'moment';

import { AutoFormDialog } from 'core/components/AutoForm2';
import IconButton from 'core/components/IconButton';
import { Money, Percent } from 'core/components/Translation';
import { consolidateCommission } from 'core/api/revenues/index';
import { percentageField } from 'core/api/helpers/sharedSchemas';
import { CUSTOM_AUTOFIELD_TYPES } from 'core/components/AutoForm2/constants';
import { ORGANISATIONS_COLLECTION } from 'core/api/constants';
import CollectionIconLink from 'core/components/IconLink/CollectionIconLink';

                                       

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
}                              ) => (
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
    model={{ commissionRate, paidAt: moment(paidAt).format('YYYY-MM-DD') }}
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
