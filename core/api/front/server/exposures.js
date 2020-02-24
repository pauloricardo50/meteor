import { Match } from 'meteor/check';

import { frontGetTaggedConversations } from '../queries';
import { exposeQuery } from '../../queries/queryHelpers';
import FrontService from './FrontService';

const taggedConversationsResolver = data => {
  const { _results = [] } = data;

  if (!_results.length) {
    return [];
  }

  return _results.map(result => {
    const {
      id: conversationId,
      subject,
      last_message: { created_at: lastMessageDate },
    } = result;
    const date = new Date(lastMessageDate * 1000);
    const frontLink = `https://app.frontapp.com/open/${conversationId}`;

    let title = subject;

    ['Re: ', 'Fw: ', 'Fwd: '].forEach(keyword => {
      if (title.indexOf(keyword) === 0) {
        title = title.replace(keyword, '');
      }
    });

    return {
      date,
      title,
      type: 'front',
      frontLink,
    };
  });
};

exposeQuery({
  query: frontGetTaggedConversations,
  overrides: {
    validateParams: {
      tagId: Match.Maybe(String),
    },
  },
  resolver: async ({ tagId }) => {
    if (!tagId) {
      return [];
    }
    const taggedConversations = await FrontService.listTagConversations({
      tagId,
    });

    return taggedConversationsResolver(taggedConversations);
  },
});
