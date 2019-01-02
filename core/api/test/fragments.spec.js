// @flow
/* eslint-env mocha */
import { expect } from 'chai';

import * as fragments from '../fragments';

const checkFields = (obj) => {
  Object.keys(obj).forEach((field) => {
    expect(typeof field).to.not.equal('function');
    expect(field).to.not.equal(undefined);

    if (typeof field === 'object') {
      checkFields(field);
    }
  });
};

describe.only('fragments', () => {
  it('mortgageNote is defined', () => {
    expect(fragments.loanBorrower().mortgageNotes).to.deep.include({
      value: 1,
    });
  });

  it('works', () => {
    expect(fragments.adminLoan()).to.deep.include({ status: 1 });
  });

  describe('fragments are all well defined and do not crash', () => {
    Object.keys(fragments).forEach((fragmentName) => {
      it(fragmentName, () => {
        const fragmentCreator = fragments[fragmentName];
        const fragment = fragmentCreator();

        checkFields(fragment);
      });
    });
  });
});
