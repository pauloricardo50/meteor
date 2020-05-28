import { exposeQuery } from '../../queries/queryHelpers';
import { recentNewsletters } from '../queries';
import NewsletterService from './NewsletterService';

exposeQuery({
  query: recentNewsletters,
  overrides: { firewall() {} },
  resolver: NewsletterService.getRecentNewsletters,
});
