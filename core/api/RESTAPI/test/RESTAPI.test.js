/* eslint-env mocha */
import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import fetch from 'node-fetch';
import startAPI from '..';

describe.only('RESTAPI', () => {
  before(function () {
    if (Meteor.settings.public.microservice !== 'pro') {
      // When running these tests in parallel, it breaks tests
      this.parent.pending = true;
      this.skip();
    }
    startAPI();
  });

  it('returns an error if content type is wrong', () =>
    fetch('http://localhost:4106/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'plain/text',
      },
    }).then(res => expect(res.status).to.equal(400)));
});
