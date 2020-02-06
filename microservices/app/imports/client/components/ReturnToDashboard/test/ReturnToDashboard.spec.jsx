//
/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'core/utils/testHelpers/enzyme';

import { getPathToDashboard } from '../ReturnToDashboard';

describe('ReturnToDashboard', () => {
  let props;
  const component = () => shallow(<ReturnToDashboard {...props} />);

  beforeEach(() => {
    props = {};
  });

  describe('getPathToDashboard', () => {
    it('keeps the current path if there is no subpath', () => {
      const path = '/loans/hello';
      expect(getPathToDashboard(path)).to.equal(path);
    });

    it('removes anything from the end of the path', () => {
      const path = '/loans/hello';
      const currentPath = `${path}/whatever?asdljh&tewzq`;
      expect(getPathToDashboard(currentPath)).to.equal(path);
    });
  });
});
