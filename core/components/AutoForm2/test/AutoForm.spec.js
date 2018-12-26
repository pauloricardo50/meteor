// @flow
/* eslint-env mocha */
import { expect } from 'chai';
import SimpleSchema from 'simpl-schema';
import TextField from 'uniforms-material/TextField';
import Button from '@material-ui/core/Button';

import getMountedComponent from '../../../utils/testHelpers/getMountedComponent';

import AutoForm from '../AutoForm';

describe('AutoForm', () => {
  let props;
  const component = () =>
    getMountedComponent({
      Component: AutoForm,
      props,
    });

  beforeEach(() => {
    getMountedComponent.reset();
    props = {
      schema: new SimpleSchema({
        text: String,
      }),
    };
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
});
