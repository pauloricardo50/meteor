/* eslint-env mocha */
import { Meteor } from 'meteor/meteor';
import React from 'react';
import { render } from 'react-dom';
import { expect } from 'chai';

// import jsdom from 'jsdom';

import AppRouter from '../AppRouter';
// import start from './index';

if (Meteor.isClient) {
  describe('App', () => {
    // beforeEach(() => {
    //   global.document = jsdom('');
    //   global.window = document.defaultView;
    // });
    //
    // afterEach(() => {
    //   global.document = undefined;
    //   global.window = undefined;
    // });

    it('renders without crashing', () => {
      const div = document.createElement('div');
      render(AppRouter(), div);
    });

    it("doesn't throw", () => {
      const div = document.createElement('div');
      expect(() => render(AppRouter(), div)).to.not.throw();
    });
  });

  // FIXME: This test adds warnings, that I haven't been able to fix
  // describe('startup', () => {
  //   it('runs without crashing', () => {
  //     const div = document.createElement('div');
  //     start(div);
  //   });
  // });
}
