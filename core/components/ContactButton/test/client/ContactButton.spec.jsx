// @flow
/* eslint-env mocha */
import { expect } from 'chai';
import { getMountedComponent } from '../../../../utils/testHelpers';
import employees from '../../../../arrays/epotekEmployees';

import { ContactButton } from '../../ContactButton';
import { withContactButtonProvider } from '../../ContactButtonContext';

describe('ContactButton', () => {
  let props;
  const component = () =>
    getMountedComponent({
      Component: withContactButtonProvider(ContactButton),
      props,
    });

  beforeEach(() => {
    getMountedComponent.reset();
    props = {
      open: false,
      staff: employees[0],
    };
  });

  it('renders the closed version', () => {
    expect(component()
      .find('.contact-button-overlay')
      .hasClass('closed')).to.equal(true);
  });

  it('renders the opened version', () => {
    expect(component()
      .find('.contact-button-overlay')
      .hasClass('closed')).to.equal(true);

    component()
      .find('button')
      .simulate('click');

    expect(component()
      .find('.contact-button-overlay')
      .hasClass('closed')).to.equal(false);
  });

  describe('renders staff value', () => {
    it('name', () => {
      expect(component()
        .find('.staff-name')
        .text()).to.equal(employees[0].name);
    });

    it('phoneNumber', () => {
      expect(component().contains(employees[0].phoneNumber)).to.equal(true);
    });

    it('mail', () => {
      expect(component().contains(employees[0].email)).to.equal(true);
    });
  });
});
