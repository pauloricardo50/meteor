// @flow
/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'core/utils/testHelpers/enzyme';

import DashboardInfoTeamCompany from '../DashboardInfoTeamCompany';
import DashboardInfoTeamMember from '../DashboardInfoTeamMember';

describe('DashboardInfoTeamCompany', () => {
  let props;
  const component = () => shallow(<DashboardInfoTeamCompany {...props} />);

  beforeEach(() => {
    props = {};
  });

  it('renders a default team of lydia, yannis and jeanluc', () => {
    const expectedEmails = [
      'lydia@e-potek.ch',
      'yannis@e-potek.ch',
      'jeanluc@e-potek.ch',
    ];
    const emails = component()
      .find(DashboardInfoTeamMember)
      .map(node => node.key());

    expect(emails).to.deep.equal(expectedEmails);
  });

  it('adds yannis and jeanluc if yannis is the assignedemployee', () => {
    props.assignedEmployee = { email: 'yannis@e-potek.ch' };
    const expectedEmails = ['yannis@e-potek.ch', 'jeanluc@e-potek.ch'];
    const emails = component()
      .find(DashboardInfoTeamMember)
      .map(node => node.key());

    expect(emails).to.deep.equal(expectedEmails);
  });
});
