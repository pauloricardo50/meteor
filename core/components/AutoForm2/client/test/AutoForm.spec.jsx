// @flow
/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import SimpleSchema from 'simpl-schema';
import TextField from 'uniforms-material/TextField';
import Button from '@material-ui/core/Button';

import getMountedComponent from '../../../../utils/testHelpers/getMountedComponent';

import AutoForm from '../../AutoForm';
import CustomSelectField from '../../CustomSelectField';
import DateField from '../../../DateField';
import { CUSTOM_AUTOFIELD_TYPES } from '../../constants';
import { PercentField } from '../../../PercentInput';
import { CustomAutoField } from '../../AutoFormComponents';

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

describe.only('AutoForm', () => {
  SimpleSchema.extendOptions(['condition', 'customAllowedValues']);

  beforeEach(() => {
    getMountedComponent.reset();
    props = { schema: new SimpleSchema({ text: String }) };
  });

  it('renders a form with a field and submit button', () => {
    expect(component()
      .find('form')
      .exists()).to.equal(true);
    expect(component()
      .find(TextField)
      .exists()).to.equal(true);
    expect(component()
      .find(Button)
      .exists()).to.equal(true);
  });

  it('does not render fields with a false condition', () => {
    props = {
      schema: new SimpleSchema({
        text: { type: String, condition: () => false },
      }),
    };
    expect(component()
      .find('form')
      .exists()).to.equal(true);
    expect(component()
      .find(TextField)
      .exists()).to.equal(false);
    expect(component()
      .find(Button)
      .exists()).to.equal(true);
  });

  it('does not render fields based on changes to the model', () => {
    props = {
      schema: new SimpleSchema({
        text: {
          type: String,
          condition: ({ stuff }) => stuff !== 'dude',
        },
        stuff: String,
      }),
      model: {},
    };

    expect(component().find(TextField).length).to.equal(2);

    setInput('stuff', 'dud');

    expect(component().find(TextField).length).to.equal(2);

    setInput('stuff', 'dude');

    expect(component().find(TextField).length).to.equal(1);
  });

  it('skips fields that are omitted', () => {
    props = {
      schema: new SimpleSchema({ text: String, stuff: String }),
      omitFields: ['text'],
    };

    expect(component().find(TextField).length).to.equal(1);
  });

  describe('Custom components', () => {
    it('renders a select field if allowedValues is passed', () => {
      props = {
        schema: new SimpleSchema({
          text: { type: String, allowedValues: ['yo'] },
        }),
      };

      expect(component().find(CustomSelectField).length).to.equal(1);
    });

    it('renders a select field if customAllowedValues is passed', () => {
      props = {
        schema: new SimpleSchema({
          text: { type: String, customAllowedValues: () => ['yo'] },
        }),
      };

      expect(component().find(CustomSelectField).length).to.equal(1);
    });

    it('renders a date field if uniforms type is Date', () => {
      props = {
        schema: new SimpleSchema({
          text: { type: Date, uniforms: { type: CUSTOM_AUTOFIELD_TYPES.DATE } },
        }),
      };

      expect(component().find(DateField).length).to.equal(1);
    });

    it('renders a percent field if uniforms type is percent', () => {
      props = {
        schema: new SimpleSchema({
          text: {
            type: Number,
            uniforms: { type: CUSTOM_AUTOFIELD_TYPES.PERCENT },
          },
        }),
      };

      expect(component().find(PercentField).length).to.equal(1);
    });

    describe('CustomSelectField', () => {
      it('renders allowed values', () => {
        props = {
          schema: new SimpleSchema({
            text: { type: String, allowedValues: ['yo', 'dude'] },
          }),
        };

        expect(component()
          .find(CustomSelectField)
          .childAt(0)
          .prop('allowedValues')).to.deep.equal(['yo', 'dude']);
      });

      it('renders custom allowed values coming from a promise', (done) => {
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
          expect(component()
            .find(CustomSelectField)
            .childAt(0)
            .prop('allowedValues')).to.deep.equal(['yo', 'dude']);
          done();
        }, 0);
      });

      it('renders custom allowed values coming from a function', (done) => {
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
          expect(component()
            .find(CustomSelectField)
            .childAt(0)
            .prop('allowedValues')).to.deep.equal(['yo', 'dude']);
          done();
        }, 0);
      });

      it('fetches allowed values based on the model', (done) => {
        props = {
          schema: new SimpleSchema({
            text: {
              type: String,
              customAllowedValues: ({ text2 }) => [text2],
            },
            text2: String,
          }),
        };
        component();

        setTimeout(() => {
          component().update();
          expect(component()
            .find(CustomSelectField)
            .childAt(0)
            .prop('allowedValues')).to.deep.equal(['']);

          setInput('text2', 'dude');

          setTimeout(() => {
            component().update();
            expect(component()
              .find(CustomSelectField)
              .childAt(0)
              .prop('allowedValues')).to.deep.equal(['dude']);
            done();
          }, 0);
        }, 0);
      });
    });
  });

  describe('labels', () => {
    it('removes the label if null is used', () => {
      props = {
        schema: new SimpleSchema({
          myText: { type: String, uniforms: { label: 'Yo' } },
        }),
        autoFieldProps: { labels: { myText: null } },
      };

      expect(component().find('label').length).to.equal(0);
    });

    it('sets the label', () => {
      props = {
        schema: new SimpleSchema({
          myText: { type: String, uniforms: { label: 'Yo' } },
        }),
        autoFieldProps: { labels: { myText: 'Yo' } },
      };

      expect(component()
        .find('label')
        .text()).to.include('Yo');
    });

    it('overrides the label if provided on the children', () => {
      props = {
        schema: new SimpleSchema({
          myText: { type: String, uniforms: { label: 'Yo' } },
        }),
        autoFieldProps: { labels: { myText: 'Yo' } },
        children: <CustomAutoField name="myText" overrideLabel="Dude" />,
      };

      expect(component()
        .find('label')
        .text()).to.include('Dude');
    });

    it('uses the label on the schema', () => {
      props = {
        schema: new SimpleSchema({
          myText: { type: String, uniforms: { label: 'mah dude' } },
        }),
      };

      expect(component()
        .find('label')
        .text()).to.include('mah dude');
    });

    it('sets a default label with Translation', () => {
      props = {
        schema: new SimpleSchema({ myText: { type: String } }),
      };

      expect(component()
        .find('label')
        .text()).to.include('Forms.myText');
    });

    context('in nested fields', () => {
      it('sets the right placeholder on nested objects', () => {
        props = {
          schema: new SimpleSchema({
            myText: Array,
            'myText.$': Object,
            'myText.$.stuff': String,
          }),
        };

        component()
          .find('button')
          .at(0)
          .simulate('click');

        expect(component()
          .find('label')
          .text()).to.include('Forms.myText.stuff');
      });
    })
  });

  describe('placeholders', () => {
    it('does not set a placeholder if placeholder is false on the autoform', () => {
      props = {
        schema: new SimpleSchema({
          myText: { type: String },
        }),
        placeholder: false,
      };

      expect(component()
        .find(AutoForm)
        .prop('placeholder')).to.equal(false);

      expect(component()
        .find('input')
        .prop('placeholder')).to.equal('');
    });

    it('sets the placeholder', () => {
      props = {
        schema: new SimpleSchema({
          myText: { type: String, uniforms: { placeholder: 'Howdy' } },
        }),
        placeholder: true,
      };

      expect(component()
        .find('input')
        .prop('placeholder')).to.equal('Howdy');
    });

    it('does not set the placeholder if null is used', () => {
      props = {
        schema: new SimpleSchema({
          myText: { type: String, uniforms: { placeholder: null } },
        }),
        placeholder: true,
      };

      expect(component()
        .find('input')
        .prop('placeholder')).to.equal(null);
    });

    it('sets a default placeholder', () => {
      props = {
        schema: new SimpleSchema({
          myText: { type: String },
        }),
        placeholder: true,
      };

      expect(component()
        .find('input')
        .prop('placeholder')).to.equal('Forms.myText.placeholder');
    });

    context('in nested fields', () => {
      it('sets a placeholder for a list item field', () => {
        props = {
          schema: new SimpleSchema({
            myText: [String],
          }),
          placeholder: true,
        };

        component()
          .find('button')
          .at(0)
          .simulate('click');

        expect(component()
          .find('input')
          .prop('placeholder')).to.equal('Forms.myText.placeholder');
      });

      it('does not set a placeholder for a list item field', () => {
        props = {
          schema: new SimpleSchema({
            myText: [String],
          }),
          placeholder: false,
        };

        component()
          .find('button')
          .at(0)
          .simulate('click');

        expect(component()
          .find('input')
          .prop('placeholder')).to.equal('');
      });

      it('sets the right placeholder on nested objects', () => {
        props = {
          schema: new SimpleSchema({
            myText: Array,
            'myText.$': Object,
            'myText.$.stuff': String,
          }),
          placeholder: true,
        };

        component()
          .find('button')
          .at(0)
          .simulate('click');

        expect(component()
          .find('input')
          .prop('placeholder')).to.equal('Forms.myText.stuff.placeholder');
      });

      it('skips placeholders on nested objects', () => {
        props = {
          schema: new SimpleSchema({
            myText: Array,
            'myText.$': Object,
            'myText.$.stuff': String,
          }),
          placeholder: false,
        };

        component()
          .find('button')
          .at(0)
          .simulate('click');

        expect(component()
          .find('input')
          .prop('placeholder')).to.equal('');
      });
    });
  });
});
