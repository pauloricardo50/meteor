import { exposeQuery } from '../../queries/queryHelpers';
import { recentNewsletters } from '../queries';
import MailchimpService from './MailchimpService';

exposeQuery({
  query: recentNewsletters,
  overrides: { firewall() {} },
  resolver: MailchimpService.getLastCampaigns,
});
