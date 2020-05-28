import { Meteor } from 'meteor/meteor';

import btoa from 'btoa';
import crypto from 'crypto';
import fetch from 'node-fetch';
import queryString from 'query-string';

import { MAILCHIMP_LIST_STATUS } from '../emailConstants';

const API_PATH = 'https://us15.api.mailchimp.com/3.0';
const API_KEY = Meteor.settings.mailchimp?.API_KEY;

// We currently support only one list, this could change in the future
const LIST_IDS = {
  MAIN_NEWSLETTER: '536ce48082',
};

const mailchimpEndpoints = {
  getLastCampaigns: {
    method: 'GET',
    makeEndpoint: () => {
      const query = queryString.stringify({
        count: 3,
        fields:
          'campaigns.id,campaigns.settings.title,campaigns.send_time,archive_url',
        sort_field: 'send_time',
        sort_dir: 'DESC',
      });
      return `/campaigns?${query}`;
    },
  },
  testError: {
    method: 'GET',
    makeEndpoint: () => '/test-error',
  },
  getMember: {
    method: 'GET',
    makeEndpoint: ({ subscriberHash }) => {
      const query = queryString.stringify({
        fields: 'status,merge_fields',
      });
      return `/lists/${LIST_IDS.MAIN_NEWSLETTER}/members/${subscriberHash}?${query}`;
    },
  },
  upsertMember: {
    method: 'PUT',
    makeEndpoint: ({ subscriberHash }) =>
      `/lists/${LIST_IDS.MAIN_NEWSLETTER}/members/${subscriberHash}`,
  },
  archiveMember: {
    method: 'DELETE',
    makeEndpoint: ({ subscriberHash }) =>
      `/lists/${LIST_IDS.MAIN_NEWSLETTER}/members/${subscriberHash}`,
  },
  permanentlyDeleteMember: {
    method: 'POST',
    makeEndpoint: ({ subscriberHash }) =>
      `/lists/${LIST_IDS.MAIN_NEWSLETTER}/members/${subscriberHash}/actions/delete-permanent`,
  },
  listMergeFields: {
    method: 'GET',
    makeEndpoint: () => `/lists/${LIST_IDS.MAIN_NEWSLETTER}/merge-fields`,
  },
};

class MailchimpService {
  callApi({ endpoint, params, body }) {
    const endpointConfig = mailchimpEndpoints[endpoint];

    if (!endpointConfig) {
      throw new Error(`Invalid endpoint config ${endpoint}`);
    }

    if (!API_KEY) {
      return;
    }

    const { method, makeEndpoint } = endpointConfig;
    const path = API_PATH + makeEndpoint(params);
    const encodedAuthorization = btoa(`anystring:${API_KEY}`);

    return fetch(path, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${encodedAuthorization}`,
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    }).then(async result => {
      const response = await result.text();
      const parsed = response && JSON.parse(response);

      if (result.statusText !== 'OK') {
        throw new Error(
          `Mailchimp error [${result.status}]: ${parsed?.detail ||
            result.statusText}`,
        );
      }

      return parsed;
    });
  }

  getSubscriberHash(email) {
    return crypto
      .createHash('md5')
      .update(email.toLowerCase())
      .digest('hex');
  }

  getLastCampaigns() {
    return this.callApi({ endpoint: 'getLastCampaigns' }).then(
      ({ campaigns }) => campaigns,
    );
  }

  testError() {
    return this.callApi({ endpoint: 'testError' });
  }

  getMember({ email }) {
    return this.callApi({
      endpoint: 'getMember',
      params: { subscriberHash: this.getSubscriberHash(email) },
    }).catch(error => {
      // Ignore 404 errors on this one
      if (!error.message.includes('404')) {
        throw error;
      }
    });
  }

  upsertMember({
    email,
    firstName,
    lastName,
    organisation,
    phoneNumber,
    status,
  }) {
    return this.callApi({
      endpoint: 'upsertMember',
      params: { subscriberHash: this.getSubscriberHash(email) },
      body: {
        email_address: email,
        status,
        status_if_new: MAILCHIMP_LIST_STATUS.UNSUBSCRIBED,
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
          PHONE: phoneNumber,
          ORG: organisation,
        },
      },
    });
  }

  subscribeMember({ email }) {
    return this.callApi({
      endpoint: 'upsertMember',
      params: { subscriberHash: this.getSubscriberHash(email) },
      body: { status: MAILCHIMP_LIST_STATUS.SUBSCRIBED },
    });
  }

  unsubscribeMember({ email }) {
    return this.callApi({
      endpoint: 'upsertMember',
      params: { subscriberHash: this.getSubscriberHash(email) },
      body: { status: MAILCHIMP_LIST_STATUS.UNSUBSCRIBED },
    });
  }

  changeMemberEmail({ oldEmail, newEmail }) {
    return this.callApi({
      endpoint: 'upsertMember',
      params: { subscriberHash: this.getSubscriberHash(oldEmail) },
      body: { emailaddress: newEmail },
    });
  }

  listMergeFields() {
    return this.callApi({ endpoint: 'listMergeFields' }).then(
      ({ merge_fields }) => merge_fields,
    );
  }

  archiveMember({ email }) {
    return this.callApi({
      endpoint: 'archiveMember',
      params: { subscriberHash: this.getSubscriberHash(email) },
    });
  }

  // Use archive instead, permanently removed contacts can't be added again afterwards
  permanentlyDeleteMember({ email }) {
    return this.callApi({
      endpoint: 'permanentlyDeleteMember',
      params: { subscriberHash: this.getSubscriberHash(email) },
    });
  }
}

export default new MailchimpService();
