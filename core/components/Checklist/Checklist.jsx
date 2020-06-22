import { Meteor } from 'meteor/meteor';

import React from 'react';

import { getChecklistCompletion } from '../../api/checklists/checklistHelpers';
import { addChecklistItem } from '../../api/checklists/methodDefinitions';
import Icon from '../Icon';
import ChecklistItemForm from '../LoanClosingChecklist/ChecklistItemForm';
import T, { Percent } from '../Translation';
import ChecklistItem from './ChecklistItem';

const isAdmin = Meteor.microservice === 'admin';

const Checklist = ({ checklist }) => {
  const { _id: checklistId, title, description, items } = checklist;
  const { done, total } = getChecklistCompletion(checklist);
  const itemIds = items.map(({ id }) => id);

  return (
    <div className="checklist ml-8 mr-8">
      <h4>
        {title}{' '}
        <small className="secondary">
          <Percent value={done / total} rounded />
        </small>
      </h4>
      {description && <p className="description">{description}</p>}

      {items.map(item => (
        <ChecklistItem
          key={item.id}
          item={item}
          checklistId={checklistId}
          itemIds={itemIds}
        />
      ))}

      {isAdmin && (
        <div className="text-center">
          <ChecklistItemForm
            onSubmit={values =>
              addChecklistItem.run({ checklistId, ...values })
            }
            buttonProps={{
              primary: true,
              label: <T id="general.add" />,
              outlined: true,
              size: 'small',
              icon: <Icon type="add" />,
              className: 'mt-8',
            }}
            title="Ajouter un élément"
          />
        </div>
      )}
    </div>
  );
};

export default Checklist;
