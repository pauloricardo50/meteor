import React from 'react';
/* eslint-env mocha */
import { expect } from 'chai';
import SimpleSchema from 'simpl-schema';

import {
  cleanup,
  fireEvent,
  render,
  waitFor,
  within,
} from '../../../../utils/testHelpers/testing-library';
import AutoForm from '../../AutoForm';

let props;

describe('CustomSelectField', () => {
  beforeEach(() => {
    props = {};
    return cleanup();
  });

  afterEach(() => cleanup());

  context('with allowed values', () => {
    it('renders allowed values and the placeholder', () => {
      props = {
        schema: new SimpleSchema({
          text: {
            type: String,
            allowedValues: ['yo', 'dude'],
            uniforms: { label: 'Select', placeholder: 'Placeholder' },
          },
        }),
      };

      const { getByLabelText, getAllByRole } = render(<AutoForm {...props} />);

      fireEvent.mouseDown(getByLabelText('Select', { exact: false }));
      const options = getAllByRole('option');
      expect(options.length).to.equal(3);
      const [placeholder, option1, option2] = options;

      expect(!!within(placeholder).getByText('Placeholder')).to.equal(true);
      expect(!!within(option1).getByText('yo')).to.equal(true);
      expect(!!within(option2).getByText('dude')).to.equal(true);
    });

    it('transforms rendered options', () => {
      const transform = value => `${value}-mec`;
      props = {
        schema: new SimpleSchema({
          text: {
            type: String,
            allowedValues: ['yo', 'hola'],
            uniforms: { transform, placeholder: '', label: 'Select' },
          },
        }),
      };

      const { getByLabelText, getAllByRole } = render(<AutoForm {...props} />);

      fireEvent.mouseDown(getByLabelText('Select', { exact: false }));

      const [option1, option2] = getAllByRole('option');

      expect(!!within(option1).getByText('yo-mec')).to.equal(true);
      expect(!!within(option2).getByText('hola-mec')).to.equal(true);
    });
  });

  context('with custom allowed values', () => {
    it('renders custom allowed values coming from a promise', async () => {
      props = {
        schema: new SimpleSchema({
          text: {
            type: String,
            customAllowedValues: () => Promise.resolve(['yo', 'dude']),
            uniforms: { label: 'Select', placeholder: null },
          },
        }),
      };

      const { getByLabelText, getAllByRole } = render(<AutoForm {...props} />);
      await waitFor(() => getByLabelText('Select', { exact: false }));
      fireEvent.mouseDown(getByLabelText('Select', { exact: false }));

      const [option1, option2] = getAllByRole('option');

      expect(!!within(option1).getByText('yo')).to.equal(true);
      expect(!!within(option2).getByText('dude')).to.equal(true);
    });

    it('renders custom allowed values coming from a function', async () => {
      props = {
        schema: new SimpleSchema({
          text: {
            type: String,
            customAllowedValues: () => ['yo', 'dude'],
            uniforms: { label: 'Select', placeholder: null },
          },
        }),
      };

      const { getByLabelText, getAllByRole } = render(<AutoForm {...props} />);
      await waitFor(() => getByLabelText('Select', { exact: false }));
      fireEvent.mouseDown(getByLabelText('Select', { exact: false }));

      const [option1, option2] = getAllByRole('option');

      expect(!!within(option1).getByText('yo')).to.equal(true);
      expect(!!within(option2).getByText('dude')).to.equal(true);
    });

    it('fetches allowed values based on the model', async () => {
      props = {
        schema: new SimpleSchema({
          text: {
            type: String,
            customAllowedValues: ({ text2 }) => [text2],
            uniforms: { label: 'Select', placeholder: null },
          },
          text2: String,
        }),
        model: { text2: 'hello' },
      };

      const { getByLabelText, getAllByRole } = render(<AutoForm {...props} />);
      await waitFor(() => getByLabelText('Select', { exact: false }));
      fireEvent.mouseDown(getByLabelText('Select', { exact: false }));

      const options = getAllByRole('option');
      expect(options.length).to.equal(1);
      expect(!!within(options[0]).getByText('hello')).to.equal(true);
    });
  });

  context('with recommendedValues', () => {
    it('renders recommended values', () => {
      props = {
        schema: new SimpleSchema({
          text: {
            type: String,
            uniforms: {
              recommendedValues: ['yo', 'dude'],
              label: 'Select',
              placeholder: null,
            },
          },
        }),
      };

      const { getByLabelText, getAllByRole } = render(<AutoForm {...props} />);

      fireEvent.mouseDown(getByLabelText('Select', { exact: false }));

      const options = getAllByRole('option');
      expect(options.length).to.equal(2);
      const [option1, option2] = options;
      expect(!!within(option1).getByText('yo')).to.equal(true);
      expect(!!within(option2).getByText('dude')).to.equal(true);
    });

    it('renders recommended values with custom other', () => {
      props = {
        schema: new SimpleSchema({
          text: {
            type: String,
            uniforms: {
              recommendedValues: ['yo', 'dude'],
              withCustomOther: true,
              label: 'Select',
              placeholder: null,
            },
          },
        }),
      };

      const { getByLabelText, getAllByRole } = render(<AutoForm {...props} />);

      fireEvent.mouseDown(getByLabelText('Select', { exact: false }));

      const options = getAllByRole('option');
      expect(options.length).to.equal(3);
      const [option1, option2, option3] = options;
      expect(!!within(option1).getByText('yo')).to.equal(true);
      expect(!!within(option2).getByText('dude')).to.equal(true);
      expect(!!within(option3).getByText('other')).to.equal(true);
    });

    it('renders the custom field', () => {
      props = {
        schema: new SimpleSchema({
          text: {
            type: String,
            uniforms: {
              placeholder: null,
              recommendedValues: ['yo', 'hola'],
              withCustomOther: true,
              label: 'Select',
            },
          },
          value: String,
        }),
        model: { text: 'test' },
      };

      const { getByLabelText } = render(<AutoForm {...props} />);

      expect(!!getByLabelText('Select')).to.equal(true);
      expect(!!getByLabelText('Préciser')).to.equal(true);
    });
  });
});
