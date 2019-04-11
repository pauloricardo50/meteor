// @flow
/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { getMountedComponent } from '../../../../utils/testHelpers';
import employees from '../../../../arrays/epotekEmployees';

import { ContactButton } from '../../ContactButton';

describe('ContactButton', () => {
  let props;
  const component = propz =>
    getMountedComponent({
      Component: ContactButton,
      props: propz,
    });

  beforeEach(() => {
    getMountedComponent.reset();
    props = {
      open: false,
      staff: employees[0],
    };
  });

  it('renders the closed version', () => {
    expect(component(props)
      .find('.contact-button-overlay')
      .hasClass('closed')).to.equal(true);
  });

  it('renders the opened version', () => {
    props.openContact = true;
    expect(component(props)
      .find('.contact-button-overlay')
      .hasClass('closed')).to.equal(false);
  });

  describe('renders staff value', () => {
    it('name', () => {
      expect(component(props)
        .find('.staff-name')
        .text()).to.equal(employees[0].name);
    });

    it('phoneNumber', () => {
      expect(component(props).contains(employees[0].phoneNumber)).to.equal(true);
    });

    it('mail', () => {
      expect(component(props).contains(employees[0].email)).to.equal(true);
    });
  });
});
