import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';

import { T } from 'core/components/Translation';

const renderField = ({ input, label, type, meta: { touched, error } }) => (
  <div>
    <input {...input} type={type} placeholder={label} />
    {touched && error && <span>{error}</span>}
  </div>
);

const RenderFieldArray = ({ fields, meta: { error }, label }) => (
  <div>
    <label>{label}</label>
    <button className="pull-right" type="button" onClick={() => fields.push()}>
      <T id="RenderFieldArray.add" />
    </button>

    <ul>
      {fields.map((field, index) => (
        <li key={index}>
          <p>
            <Field name={field} type="text" component={renderField} />
            <button className="pull-right" type="button" onClick={() => fields.remove(index)}>
              <T id="RenderFieldArray.remove" />
            </button>
          </p>
        </li>
      ))}
      {error && <li className="error">{error}</li>}
    </ul>
  </div>
);

export default RenderFieldArray;
