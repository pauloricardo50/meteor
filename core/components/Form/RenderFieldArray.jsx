import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';

import { T } from 'core/components/Translation';
import Button from 'core/components/Button';
import { phoneFormatters } from './formHelpers';

const renderField = ({ input, label, type, meta: { touched, error } }) => (
  <React.Fragment>
    <Input {...input} type={type} placeholder={label} />
    {touched && error && <span>{error}</span>}
  </React.Fragment>
);

const RenderFieldArray = ({ fields, meta: { error }, label }) => (
  <React.Fragment>
    <div className="render-field-array-header">
      <InputLabel shrink className="render-field-array-label">
        {label}
      </InputLabel>

      <Button
        className="render-field-array-add-item-button"
        primary
        raised
        onClick={() => fields.push()}
      >
        <T id="general.add" />
      </Button>
    </div>

    <ul className="render-field-ul">
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
  </React.Fragment>
);

export default RenderFieldArray;
