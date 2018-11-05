// @flow
import React from 'react';

import { AutoFormDialog } from 'core/components/AutoForm2';
import { BasePromotionSchema } from 'core/api/promotions/schemas/PromotionSchema';
import PromotionsPageContainer from './PromotionsPageContainer';
import AllPromotionsTable from './AllPromotionsTable';

type PromotionsPageProps = {};

const PromotionsPage = ({ addPromotion }: PromotionsPageProps) => (
  <section className="card1 card-top promotions-page">
    <h1>Promotions</h1>
    <AutoFormDialog
      schema={BasePromotionSchema}
      buttonProps={{ label: 'Ajouter promotion', raised: true, primary: true }}
      onSubmit={addPromotion}
    />
    <AllPromotionsTable />
  </section>
);

export default PromotionsPageContainer(PromotionsPage);
