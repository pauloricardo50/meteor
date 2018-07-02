import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';

import { T } from 'core/components/Translation';
import { phoneFormatters } from './formHelpers';

const renderField = ({ input, label, type, meta: { touched, error } }) => (
  <React.Fragment>
    <input {...input} type={type} placeholder={label} />
    {touched && error && <span>{error}</span>}
  </React.Fragment>
);

const RenderFieldArray = ({ fields, meta: { error }, label }) => (
  <div>
    <label>{label}</label>
    <button className="pull-right" type="button" onClick={() => fields.push()}>
      <T id="general.add" />
    </button>

    <ul>
      {fields.map((field, index) => (
        <li key={index}>
          <p>
            {field.includes('phone') ? (
              <Field name={field} type="text" component={renderField} {...phoneFormatters} />
            ) : (
              <Field name={field} type="text" component={renderField} />
            )}

            <button
              className="pull-right"
              type="button"
              onClick={() => fields.remove(index)}
            >
              <T id="general.remove" />
            </button>
          </p>
        </li>
      ))}
      {error && <li className="error">{error}</li>}
    </ul>
  </div>
);

export default RenderFieldArray;
