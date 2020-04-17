/* eslint-env mocha */
import React from 'react';
import Button from '@material-ui/core/Button';
import { expect } from 'chai';
import Loadable from 'react-loadable';
import SimpleSchema from 'simpl-schema';
import { TextField } from 'uniforms-material';

import pollUntilReady from '../../../../utils/pollUntilReady';
import getMountedComponent from '../../../../utils/testHelpers/getMountedComponent';
import DateField from '../../../DateField';
import Loading from '../../../Loading';
import PercentInput from '../../../PercentInput';
import AutoForm from '../../AutoForm';
import { CustomAutoField } from '../../AutoFormComponents';
import { CUSTOM_AUTOFIELD_TYPES } from '../../autoFormConstants';
import CustomSelectField from '../../CustomSelectField';

Loadable.preloadAll();

let props;
const component = () => getMountedComponent({ Component: AutoForm, props });

const setInput = (name, value) => {
  component()
    .find(`[name="${name}"]`)
    .find('input')
    .simulate('change', { target: { value } });
};

describe('AutoForm', () => {
  beforeEach(() => {
    getMountedComponent.reset();
    props = { schema: new SimpleSchema({ text: String }) };
  });

  it('renders a form with a field and submit button', () => {
    expect(
      component()
        .find('form')
        .exists(),
    ).to.equal(true);
    expect(
      component()
        .find(TextField)
        .exists(),
    ).to.equal(true);
    expect(
      component()
        .find(Button)
        .exists(),
    ).to.equal(true);
  });

  it('does not render fields with a false condition', () => {
    props = {
      schema: new SimpleSchema({
        text: { type: String, condition: () => false },
      }),
    };
    expect(
      component()
        .find('form')
        .exists(),
    ).to.equal(true);
    expect(
      component()
        .find(TextField)
        .exists(),
    ).to.equal(false);
    expect(
      component()
        .find(Button)
        .exists(),
    ).to.equal(true);
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

  it('filters the model and only submits the form values', () => {
    props = {
      schema: new SimpleSchema({
        stuff: String,
        arr: Array,
        'arr.$': Object,
        'arr.$.text': String,
      }),
      model: { stuff: 'yo', arr: [{ text: 'dude' }], hello: 'dawg' },
      onSubmit: values => {
        expect(values).to.deep.equal({ stuff: 'yo', arr: [{ text: 'dude' }] });
      },
    };

    component()
      .find('form')
      .simulate('submit');
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

      expect(component().find(PercentInput).length).to.equal(1);
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

      expect(
        component()
          .find('label')
          .text(),
      ).to.include('Yo');
    });

    it('overrides the label if provided on the children', () => {
      props = {
        schema: new SimpleSchema({
          myText: { type: String, uniforms: { label: 'Yo' } },
        }),
        autoFieldProps: { labels: { myText: 'Yo' } },
        children: <CustomAutoField name="myText" overrideLabel="Dude" />,
      };

      expect(
        component()
          .find('label')
          .text(),
      ).to.include('Dude');
    });

    it('uses the label on the schema', () => {
      props = {
        schema: new SimpleSchema({
          myText: { type: String, uniforms: { label: 'mah dude' } },
        }),
      };

      expect(
        component()
          .find('label')
          .text(),
      ).to.include('mah dude');
    });

    it('sets a default label with Translation', () => {
      props = {
        schema: new SimpleSchema({ myText: { type: String } }),
      };

      expect(
        component()
          .find('label')
          .text(),
      ).to.include('Forms.myText');
    });

    it('does not set the label if one of them is null', () => {
      props = {
        schema: new SimpleSchema({
          myText: { type: String, uniforms: { label: null } },
        }),
      };

      expect(component().find('label').length).to.equal(0);
    });

    context('in nested fields', () => {
      it('sets the right label on nested objects', () => {
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

        expect(
          component()
            .find('label')
            .text(),
        ).to.include('Forms.myText.stuff');
      });
    });
  });

  describe('placeholders', () => {
    it('does not set a placeholder if placeholder is false on the autoform', () => {
      props = {
        schema: new SimpleSchema({ myText: { type: String } }),
        placeholder: false,
      };

      expect(
        component()
          .find(AutoForm)
          .prop('placeholder'),
      ).to.equal(false);

      expect(
        component()
          .find('input')
          .prop('placeholder'),
      ).to.equal('');
    });

    it('sets the placeholder', () => {
      props = {
        schema: new SimpleSchema({
          myText: { type: String, uniforms: { placeholder: 'Howdy' } },
        }),
        placeholder: true,
      };

      expect(
        component()
          .find('input')
          .prop('placeholder'),
      ).to.equal('p.ex: Howdy');
    });

    it('does not set the placeholder if null is used', () => {
      props = {
        schema: new SimpleSchema({
          myText: { type: String, uniforms: { placeholder: null } },
        }),
        placeholder: true,
      };

      expect(
        component()
          .find('input')
          .prop('placeholder'),
      ).to.equal(null);
    });

    it('sets a default placeholder', () => {
      props = {
        schema: new SimpleSchema({ myText: { type: String } }),
        placeholder: true,
      };

      expect(
        component()
          .find('input')
          .prop('placeholder'),
      ).to.include('Forms.myText.placeholder');
    });

    context('in nested fields', () => {
      it('sets a placeholder for a list item field', () => {
        props = {
          schema: new SimpleSchema({
            myText: { type: String, allowedValues: ['yo', 'dude'] },
          }),
          placeholder: true,
        };

        component()
          .find(CustomSelectField)
          .at(0)
          .simulate('click');

        component().update();

        expect(
          component()
            .find(CustomSelectField)
            .prop('placeholder'),
        ).to.equal('general.pick');
      });

      it('does not set a placeholder for a list item field', () => {
        props = {
          schema: new SimpleSchema({ myText: [String] }),
          placeholder: false,
        };

        component()
          .find('button')
          .at(0)
          .simulate('click');

        expect(
          component()
            .find('input')
            .prop('placeholder'),
        ).to.equal('');
      });

      context('sets the right placeholder on nested objects', () => {
        it('when parent label is not null', () => {
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

          expect(
            component()
              .find('input')
              .prop('placeholder'),
          ).to.include('Forms.myText.stuff.placeholder');
        });

        it('when parent label is null', () => {
          props = {
            schema: new SimpleSchema({
              myText: Array,
              'myText.$': { type: Object, uniforms: { label: null } },
              'myText.$.stuff': {
                type: String,
                uniforms: { placeholder: 'myPlaceholder' },
              },
            }),
            placeholder: true,
          };

          component()
            .find('button')
            .at(0)
            .simulate('click');

          expect(
            component()
              .find('input')
              .prop('placeholder'),
          ).to.include('myPlaceholder');
        });
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

        expect(
          component()
            .find('input')
            .prop('placeholder'),
        ).to.equal('');
      });
    });
  });

  describe('children', () => {
    it('have access to conditional rendering', () => {
      props = {
        schema: new SimpleSchema({
          myText1: { type: String, defaultValue: 'yo' },
          myText2: {
            type: String,
            condition: ({ myText1 }) => myText1 === 'dude',
          },
        }),
        children: (
          <>
            <CustomAutoField name="myText1" />
            <CustomAutoField name="myText2" />
          </>
        ),
      };

      expect(component().find(TextField).length).to.equal(1);

      setInput('myText1', 'dude');

      expect(component().find(TextField).length).to.equal(2);
    });

    it('have access to custom auto values', () => {
      props = {
        schema: new SimpleSchema({
          myText1: { type: String, defaultValue: 'yo' },
          myText2: {
            type: String,
            customAutoValue: ({ myText1 }) => `${myText1} dude`,
          },
        }),
        children: (
          <>
            <CustomAutoField name="myText1" />
            <CustomAutoField name="myText2" />
          </>
        ),
      };

      expect(
        component()
          .find('[name="myText2"]')
          .find('input')
          .prop('value'),
      ).to.equal('yo dude');

      setInput('myText1', 'hello');

      expect(
        component()
          .find('[name="myText2"]')
          .find('input')
          .prop('value'),
      ).to.equal('hello dude');
    });

    it('can render custom components', () => {
      props = {
        schema: new SimpleSchema({
          percent: {
            type: Number,
            uniforms: { type: CUSTOM_AUTOFIELD_TYPES.PERCENT },
          },
          date: { type: Date, uniforms: { type: CUSTOM_AUTOFIELD_TYPES.DATE } },
          select: { type: String, customAllowedValues: () => ['yo'] },
        }),
        children: (
          <>
            <CustomAutoField name="percent" />
            <CustomAutoField name="date" />
            <CustomAutoField name="select" />
          </>
        ),
      };

      expect(component().find(PercentInput).length).to.equal(1);
      expect(component().find(DateField).length).to.equal(1);
      expect(component().find(CustomSelectField).length).to.equal(1);
    });
  });

  it('does not unmount components when updating the model, and loading only displays once', () => {
    // Checking that the loading component only renders once is like
    // checking that the component only mounted once, since loading only
    // renders after mounting
    props = {
      schema: new SimpleSchema({
        text: { type: String, uniforms: { label: 'Text' } },
        select: {
          type: String,
          customAllowedValues: () => ['yo'],
          uniforms: { label: 'Select' },
        },
      }),
      placeholder: false,
    };

    expect(component().find(Loading).length).to.equal(1);

    return pollUntilReady(() => {
      component().update();
      return component().find(Loading).length === 0;
    }).then(() => {
      // Loading only reappears when the component remounts
      expect(component().find(Loading).length).to.equal(0);

      setInput('text', 'some text');

      expect(component().find(Loading).length).to.equal(0);
    });
  });
});
