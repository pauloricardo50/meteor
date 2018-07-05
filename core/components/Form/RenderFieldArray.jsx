import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';

import { T } from 'core/components/Translation';
import Button from 'core/components/Button';
import { phoneFormatters } from './formHelpers';

const renderField = ({ input, label, type, meta: { touched, error } }) => (
  <React.Fragment>
    <input {...input} type={type} placeholder={label} />
    {touched && error && <span>{error}</span>}
  </React.Fragment>
);

const RenderFieldArray = ({ fields, meta: { error }, label }) => (
  <div>
    <div className="render-field-array-header">
      <label className="render-field-array-label">{label}</label>

      <Button
        className="pull-right render-field-array-button"
        primary
        raised
        onClick={() => fields.push()}
      >
        <T id="general.add" />
      </Button>
    </div>

    <ul>
      {fields.map((field, index) => (
        <li className="render-field-array-item" key={index}>
          {field.includes('phone') ? (
            <Field
              name={field}
              type="text"
              component={renderField}
              {...phoneFormatters}
            />
          ) : (
            <Field name={field} type="text" component={renderField} />
          )}

          <Button
            className="pull-right render-field-array-button"
            raised
            onClick={() => fields.remove(index)}
          >
            <T id="general.remove" />
          </Button>
        </li>
      ))}
      {error && <li className="error">{error}</li>}
    </ul>
  </div>
);

export default RenderFieldArray;
