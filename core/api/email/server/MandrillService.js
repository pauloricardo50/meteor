import { HTTP } from 'meteor/http';

import { skipEmails } from './EmailService';

class MandrillService {
  constructor() {
    this.options = {};
    this.categories = {
      messages: ['sendTemplate', 'search'],
      templates: ['render'],
    };
    this.headers = {
      'User-Agent': 'Meteor package wylio:mandrill/1.0.0',
    };
  }

  config(options) {
    this.options.username = options.username;
    this.options.key = options.key;
    this.options.port = options.port || '465';
    this.options.host = 'smtp.mandrillapp.com';
    this.options.baseUrl =
      options.baseUrl || 'https://mandrillapp.com/api/1.0/';
    // Set the environment SMTP server
    if (!skipEmails) {
      process.env.MAIL_URL = `smtp://${this.options.username}:${this.options.key}@${this.options.host}:${this.options.port}`;
    }

    const instance = this;

    // Wrap the full Mandrill API
    Object.keys(this.categories).forEach(function(category) {
      instance[category] = {};
      instance.categories[category].forEach(function(call) {
        // Converting to camelCase is for our convenience
        // Mandrill takes https://mandrillapp.com/api/1.0/messages.sendTemplate.json as well as https://mandrillapp.com/api/1.0/messages.send-template.json
        const camelCaseName = call.replace(/-(.)/g, function(match, p1) {
          return p1.toUpperCase();
        });
        instance[category][camelCaseName] = function(opt = {}, callback) {
          const url = `${instance.options.baseUrl + category}/${call}.json`;

          // perform an async call if a callback is provided, or return the result otherwise
          if (callback) {
            HTTP.post(
              url,
              {
                data: { ...opt, key: opt.key || instance.options.key },
                headers: instance.headers,
              },
              callback,
            );
          } else {
            return HTTP.post(url, {
              data: { ...opt, key: opt.key || instance.options.key },
              headers: instance.headers,
            });
          }
        };
      });
    });
  }
}

export default new MandrillService();
