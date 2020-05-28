import UserService from '../../users/server/UserService';
import MailchimpService from './MailchimpService';

class NewsletterService {
  subscribeByEmail({ email }) {
    return MailchimpService.subscribeMember({ email });
  }

  updateUser({ userId, status }) {
    const {
      email,
      firstName,
      lastName,
      mainOrganisation,
      phoneNumber,
    } = UserService.get(userId, {
      email: 1,
      firstName: 1,
      lastName: 1,
      mainOrganisation: 1,
      phoneNumber: 1,
    });
    return MailchimpService.upsertMember({
      email,
      firstName,
      lastName,
      organisation: mainOrganisation?.name,
      phoneNumber,
      status,
    });
  }

  unsubscribe({ email }) {
    return MailchimpService.unsubscribeMember({ email });
  }

  getStatus({ email }) {
    return MailchimpService.getMember({ email }).then(result => {
      if (result?.status) {
        const { status, merge_fields } = result;
        return {
          status,
          userData: {
            address: merge_fields.ADDRESS,
            firstName: merge_fields.FNAME,
            lastName: merge_fields.LNAME,
            organisation: merge_fields.ORG,
            phoneNumber: merge_fields.PHONE,
          },
        };
      }

      return result;
    });
  }

  removeUser({ email }) {
    return MailchimpService.archiveMember({ email });
  }

  getRecentNewsletters() {
    return MailchimpService.getLastCampaigns().then(result => {
      if (result?.length) {
        return result.map(({ send_time, id, archive_url, settings }) => ({
          id,
          sendDate: send_time,
          title: settings.subject_line,
          url: archive_url,
        }));
      }
    });
  }
}

export default new NewsletterService();
