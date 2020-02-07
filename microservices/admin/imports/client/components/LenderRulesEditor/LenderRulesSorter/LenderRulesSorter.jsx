import React from 'react';
import SimpleSchema from 'simpl-schema';

import IconButton from 'core/components/IconButton';
import { AutoFormDialog } from 'core/components/AutoForm2';
import LenderRulesSorterContainer from './LenderRulesSorterContainer';
import LenderRulesEditorTitle from '../LenderRulesEditorTitle';

const emptySchema = new SimpleSchema({});

const LenderRulesSorter = ({
  lenderRules = [],
  saveOrder,
  orders,
  increaseOrder,
  decreaseOrder,
}) => {
  const sortedLenderRules = lenderRules.sort(
    ({ _id: idA }, { _id: idB }) => orders[idA] - orders[idB],
  );
  return (
    <AutoFormDialog
      buttonProps={{ label: "Choisir l'ordre", raised: true }}
      onSubmit={saveOrder}
      emptyDialog
      schema={emptySchema}
      title="Choisir l'ordre"
      description="Ces filtres vont s'appliquer dans l'ordre croissant. Par exemple: les filtres No. 2 et No. 3 s'appliquent tous les deux à un dossier, alors les règles du filtre No. 3 écraseront les règles du filtre No. 2."
    >
      {() => (
        <div className="flex-col">
          {sortedLenderRules.map(({ _id, name, filter }, index) => (
            <div className="flex" key={_id}>
              <IconButton
                type="up"
                disabled={index === 0}
                onClick={() => decreaseOrder(_id)}
              />
              <IconButton
                type="down"
                disabled={index === lenderRules.length - 1}
                onClick={() => increaseOrder(_id)}
              />
              <LenderRulesEditorTitle
                filter={filter}
                name={name}
                order={orders[_id]}
              />
            </div>
          ))}
        </div>
      )}
    </AutoFormDialog>
  );
};

export default LenderRulesSorterContainer(LenderRulesSorter);
