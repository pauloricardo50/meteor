/* eslint-env mocha */
import { Meteor } from 'meteor/meteor';
import React from 'react';
import { expect } from 'chai';
import { mount } from 'core/utils/testHelpers/enzyme';
import { MemoryRouter, Route } from 'react-router-dom';

import withMatchParam from '../withMatchParam';

let Component1 = withMatchParam('loanId')(props => <div {...props} />);
const Component2 = withMatchParam(
  'loanId',
  '/loans/:loanId',
)(props => <span {...props} />);
let url = '/loans/test/hello';

if (Meteor.isClient) {
  describe('withMatchParam', () => {
    const component = () =>
      mount(
        <MemoryRouter initialEntries={[url]}>
          <>
            <Route path="/loans/:loanId/:borrowerId">
              <Component1 />
            </Route>
            <Component2 />
          </>
        </MemoryRouter>,
      );

    beforeEach(() => {});

    it('Finds both components used for testing', () => {
      expect(component().find('div').length).to.equal(1);
      expect(component().find('span').length).to.equal(1);
    });

    it('passes the matched param to the nested component', () => {
      expect(
        component()
          .find('div')
          .props(),
      ).to.deep.include({ loanId: 'test' });
    });

    it('works if multiple params are passed in an array', () => {
      Component1 = withMatchParam(['loanId', 'borrowerId'])(props => (
        <div {...props} />
      ));
      expect(
        component()
          .find('div')
          .props(),
      ).to.deep.include({ loanId: 'test', borrowerId: 'hello' });
    });

    it('passes the matched param to the non-nested component', () => {
      expect(
        component()
          .find('span')
          .props(),
      ).to.deep.include({ loanId: 'test' });
    });

    it('does not break if a totally different url is given', () => {
      url = '/profile/userId2';
      expect(
        component()
          .find('span')
          .props(),
      ).to.not.contain.key('loanId');
    });
  });
}
