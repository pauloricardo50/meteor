import { Meteor } from 'meteor/meteor';

import React from 'react';

import { addChecklistItem } from '../../api/checklists/methodDefinitions';
import T from '../Translation';
import ChecklistItem from './ChecklistItem';
import ChecklistItemForm from './ChecklistItemForm';

const isAdmin = Meteor.microservice === 'admin';

const Checklist = ({
  checklist: { _id: checklistId, title, description, items },
}) => (
  <div className="ml-8 mr-8">
    <h3>{title}</h3>
    {description && <p className="description">{description}</p>}

    {items.map(item => (
      <ChecklistItem key={item.id} item={item} checklistId={checklistId} />
    ))}
    {isAdmin && (
      <div className="text-center">
        <ChecklistItemForm
          onSubmit={values => addChecklistItem.run({ checklistId, ...values })}
          buttonProps={{ primary: true, label: <T id="general.add" /> }}
          title="Ajouter un élément"
        />
      </div>
    )}
  </div>
);

export default Checklist;
