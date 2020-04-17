import MenuItem from '@material-ui/core/MenuItem';
/* eslint-env mocha */
import { expect } from 'chai';
import SimpleSchema from 'simpl-schema';

import pollUntilReady from '../../../../utils/pollUntilReady';
import getMountedComponent from '../../../../utils/testHelpers/getMountedComponent';
import TextInput from '../../../TextInput';
import AutoForm from '../../AutoForm';
import CustomSelectField from '../../CustomSelectField';

let props;
const component = () =>
  getMountedComponent({
    Component: AutoForm,
    props,
  });

const setInput = (name, value) => {
  component()
    .find(`[name="${name}"]`)
    .find('input')
    .simulate('change', { target: { value } });
};

describe('CustomSelectField', () => {
  beforeEach(() => {
    getMountedComponent.reset();
    props = {};
  });

  context('with allowed values', () => {
    it('renders allowed values', () => {
      props = {
        schema: new SimpleSchema({
          text: { type: String, allowedValues: ['yo', 'dude'] },
        }),
      };

      expect(
        component()
          .find(CustomSelectField)
          .childAt(0)
          .prop('values'),
      ).to.deep.equal(['yo', 'dude']);
    });

    it('renders the select field', () => {
      const transform = value => `${value}-mec`;
      props = {
        schema: new SimpleSchema({
          text: {
            type: String,
            allowedValues: ['yo', 'hola'],
            uniforms: { transform, placeholder: '' },
          },
        }),
      };

      const SelectField = component()
        .find(CustomSelectField)
        .at(0);

      expect(SelectField).to.not.equal(undefined);
      SelectField.find('[role="button"]').simulate('mousedown', { button: 0 });

      const items = component()
        .find(CustomSelectField)
        .find(MenuItem)
        .find('li');
      expect(items.length).to.equal(2);

      items.forEach(item => {
        expect(item.text()).to.equal(transform(item.prop('data-value')));
      });
    });

    it('renders the select field with placeholder', () => {
      const transform = value => `${value}-mec`;
      props = {
        schema: new SimpleSchema({
          text: {
            type: String,
            allowedValues: ['yo', 'hola'],
            uniforms: { transform, placeholder: 'test' },
          },
        }),
      };

      const SelectField = component()
        .find(CustomSelectField)
        .at(0);

      expect(SelectField).to.not.equal(undefined);
      SelectField.find('[role="button"]').simulate('mousedown', { button: 0 });

      const items = component()
        .find(CustomSelectField)
        .find(MenuItem)
        .find('li');

      const placeholder = items.first();
      const rest = items.slice(1);

      expect(placeholder.text()).to.equal('test');

      rest.forEach(item => {
        expect(item.text()).to.equal(transform(item.prop('data-value')));
      });
    });
  });

  context('with custom allowed values', () => {
    it('renders the select field', () => {
      const transform = value => `${value}-mec`;
      props = {
        schema: new SimpleSchema({
          text: {
            type: String,
            customAllowedValues: ({ value }) => [`${value}1`, `${value}2`],
            uniforms: { transform, placeholder: '', displayEmpty: false },
          },
          value: String,
        }),
      };

      setInput('value', 'yo');

      return pollUntilReady(() => {
        component().update();
        return (
          component()
            .find(CustomSelectField)
            .at(0)
            .find('[role="button"]').length === 1
        );
      }).then(() => {
        const SelectField = component()
          .find(CustomSelectField)
          .at(0)
          .find('[role="button"]');

        expect(SelectField).to.not.equal(undefined);
        SelectField.find('[role="button"]').simulate('mousedown', {
          button: 0,
        });

        const items = component()
          .find(CustomSelectField)
          .find(MenuItem)
          .find('li');

        expect(items.length).to.equal(2);

        items.forEach(item => {
          expect(item.text()).to.equal(transform(item.prop('data-value')));
        });
      });
    });

    it('renders custom allowed values coming from a promise', done => {
      props = {
        schema: new SimpleSchema({
          text: {
            type: String,
            customAllowedValues: () => Promise.resolve(['yo', 'dude']),
          },
        }),
      };
      component();

      setTimeout(() => {
        component().update();
        expect(
          component()
            .find(CustomSelectField)
            .childAt(0)
            .prop('values'),
        ).to.deep.equal(['yo', 'dude']);
        done();
      }, 0);
    });

    it('renders custom allowed values coming from a function', done => {
      props = {
        schema: new SimpleSchema({
          text: {
            type: String,
            customAllowedValues: () => ['yo', 'dude'],
          },
        }),
      };
      component();

      setTimeout(() => {
        component().update();
        expect(
          component()
            .find(CustomSelectField)
            .childAt(0)
            .prop('values'),
        ).to.deep.equal(['yo', 'dude']);
        done();
      }, 0);
    });

    it('fetches allowed values based on the model', done => {
      props = {
        schema: new SimpleSchema({
          text: {
            type: String,
            customAllowedValues: ({ text2 }) => [text2],
            uniforms: { placeholder: '' },
          },
          text2: String,
        }),
      };
      component();

      setTimeout(() => {
        component().update();

        expect(
          component()
            .find(CustomSelectField)
            .childAt(0)
            .prop('values'),
        ).to.deep.equal(['']);

        setInput('text2', 'dude');

        setTimeout(() => {
          component().update();

          expect(
            component()
              .find(CustomSelectField)
              .childAt(0)
              .prop('values'),
          ).to.deep.equal(['dude']);
          done();
        }, 0);
      }, 0);
    });
  });

  context('with recommendedValues', () => {
    it('renders recommended values', () => {
      props = {
        schema: new SimpleSchema({
          text: {
            type: String,
            uniforms: { recommendedValues: ['yo', 'dude'] },
          },
        }),
      };

      expect(
        component()
          .find(CustomSelectField)
          .childAt(0)
          .prop('values'),
      ).to.deep.equal(['yo', 'dude']);
    });

    it('renders recommended values with custom other', () => {
      props = {
        schema: new SimpleSchema({
          text: {
            type: String,
            uniforms: {
              recommendedValues: ['yo', 'dude'],
              withCustomOther: true,
            },
          },
        }),
      };

      expect(
        component()
          .find(CustomSelectField)
          .childAt(0)
          .prop('values'),
      ).to.deep.equal(['yo', 'dude', 'other']);
    });

    it('renders the select field', () => {
      const transform = value => `${value}-mec`;
      props = {
        schema: new SimpleSchema({
          text: {
            type: String,
            uniforms: {
              transform,
              placeholder: '',
              displayEmpty: false,
              recommendedValues: ['yo', 'hola'],
            },
          },
          value: String,
        }),
      };

      setInput('value', 'yo');

      return pollUntilReady(() => {
        component().update();
        return (
          component()
            .find(CustomSelectField)
            .at(0)
            .find('[role="button"]').length === 1
        );
      }).then(() => {
        const SelectField = component()
          .find(CustomSelectField)
          .at(0)
          .find('[role="button"]');

        expect(SelectField).to.not.equal(undefined);
        SelectField.find('[role="button"]').simulate('mousedown', {
          button: 0,
        });

        const items = component()
          .find(CustomSelectField)
          .find(MenuItem)
          .find('li');

        expect(items.length).to.equal(2);

        items.forEach(item => {
          expect(item.text()).to.equal(transform(item.prop('data-value')));
        });
      });
    });

    it('renders the custom field', () => {
      const transform = value => `${value}-mec`;
      props = {
        schema: new SimpleSchema({
          text: {
            type: String,
            uniforms: {
              transform,
              placeholder: '',
              displayEmpty: false,
              recommendedValues: ['yo', 'hola'],
              withCustomOther: true,
            },
          },
          value: String,
        }),
        model: { text: 'test' },
      };

      component().update();

      expect(component().find(TextInput)).to.not.equal(undefined);
    });
  });
});
