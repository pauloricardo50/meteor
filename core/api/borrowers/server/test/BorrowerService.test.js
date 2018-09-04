/* eslint-env mocha */
import { Factory } from 'meteor/dburles:factory';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { expect } from 'chai';
import sinon from 'sinon';

import BorrowerService from '../../BorrowerService';
import Borrowers from '../../borrowers';

describe('BorrowerService', () => {
  let borrower;
  let user;

  beforeEach(() => {
    resetDatabase();
  });
});
