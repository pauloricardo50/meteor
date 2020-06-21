import { Meteor } from 'meteor/meteor';

import React from 'react';

import { getCheckistCompletion } from '../../api/checklists/checklistHelpers';
import { addChecklistItem } from '../../api/checklists/methodDefinitions';
import T, { Percent } from '../Translation';
import ChecklistItem from './ChecklistItem';
import ChecklistItemForm from './ChecklistItemForm';

const isAdmin = Meteor.microservice === 'admin';

const Checklist = ({ checklist }) => {
  const { _id: checklistId, title, description, items } = checklist;
  const { done, total } = getCheckistCompletion(checklist);

  return (
    <div className="ml-8 mr-8">
      <h4>
        {title}{' '}
        <small className="secondary">
          <Percent value={done / total} rounded />
        </small>
      </h4>
      {description && <p className="description">{description}</p>}

      {items.map(item => (
        <ChecklistItem key={item.id} item={item} checklistId={checklistId} />
      ))}
      {isAdmin && (
        <div className="text-center">
          <ChecklistItemForm
            onSubmit={values =>
              addChecklistItem.run({ checklistId, ...values })
            }
            buttonProps={{ primary: true, label: <T id="general.add" /> }}
            title="Ajouter un élément"
          />
        </div>
      )}
    </div>
  );
};

export default Checklist;
