import React from 'react';
import { render } from 'react-dom';
import { expect } from 'chai';
import { describe, it } from 'meteor/practicalmeteor:mocha';

import jsdom from 'jsdom';

import renderRoutes from './Router.jsx';
import { start } from './index';

global.document = jsdom('');
global.window = document.defaultView;

describe('App', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    render(renderRoutes(), div);
  });

  it("doesn't throw", () => {
    const div = document.createElement('div');
    expect(() => render(renderRoutes(), div)).to.not.throw();
  });
});

describe('startup', () => {
  it('runs without crashing', () => {
    const div = document.createElement('div');
    start(div);
  });
});
