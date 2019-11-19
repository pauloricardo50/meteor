// @flow
import React from 'react';
import SimpleSchema from 'simpl-schema';

import { AutoFormDialog } from 'core/components/AutoForm2';
import T from 'core/components/Translation';
import notaries from 'core/arrays/notaries';

type NotaryAdderProps = {};

const findNotary = contacts =>
  contacts.some(
    ({ title = '', name = '' }) =>
      name.toLowerCase().includes('notaire') ||
      title.toLowerCase().includes('notaire'),
  );

const ownNotary = ({ alreadyHaveNotary }) => alreadyHaveNotary === 'yes';
const suggestNotary = ({ alreadyHaveNotary }) => alreadyHaveNotary === 'no';

const contactField = { optional: true, type: String, condition: ownNotary };

const getSchema = canton =>
  new SimpleSchema({
    alreadyHaveNotary: {
      type: String,
      allowedValues: ['yes', 'no'],
      uniforms: { checkboxes: true, placeholder: null },
    },
    name: contactField,
    title: contactField,
    email: { ...contactField, regEx: SimpleSchema.RegEx.EmailWithTLD },
    phoneNumber: contactField,
    info: {
      optional: true,
      type: String,
      uniforms: {
        render: () => (
          <p>
            <T
              id="NotaryAdder.suggestNotary"
              values={{
                canton: <T id={`Forms.canton.${canton}`} />,
                name: <b>{notaries[canton].name}</b>,
              }}
            />
          </p>
        ),
        placeholder: null,
      },
      condition: suggestNotary,
    },
  });

const NotaryAdder = ({ contacts, property, addContact }: NotaryAdderProps) => {
  const hasNotary = findNotary(contacts);

  if (!property.canton) {
    return null;
  }

  if (!notaries[property.canton]) {
    return null;
  }

  if (hasNotary) {
    return null;
  }

  return (
    <AutoFormDialog
      schema={getSchema(property.canton)}
      buttonProps={{
        raised: true,
        primary: true,
        label: <T id="NotaryAdder.buttonLabel" />,
        style: { marginTop: 8 },
      }}
      title={<T id="NotaryAdder.buttonLabel" />}
      onSubmit={({ alreadyHaveNotary, ...newContact }) =>
        addContact(
          suggestNotary({ alreadyHaveNotary })
            ? { ...notaries[property.canton], title: 'Notaire' }
            : newContact,
        )
      }
      model={{ title: 'Notaire' }}
    />
  );
};

export default NotaryAdder;
