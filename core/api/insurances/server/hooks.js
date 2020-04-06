import Intl from 'core/utils/server/intl';
import Insurances from '../insurances';
import UserService from '../../users/server/UserService';
import ActivityService from '../../activities/server/ActivityService';
import { ACTIVITY_EVENT_METADATA } from '../../activities/activityConstants';

const formatMessage = Intl.formatMessage.bind(Intl);

Insurances.before.update(
  (userId, { _id: insuranceId, status: prevStatus }, fieldNames, modifier) => {
    const nextStatus = modifier.$set?.status;

    if (!fieldNames.includes('status') || nextStatus === prevStatus) {
      return;
    }

    const formattedPrevStatus = formatMessage({
      id: `Forms.status.${prevStatus}`,
    });
    const formattedNexStatus = formatMessage({
      id: `Forms.status.${nextStatus}`,
    });
    const { name: adminName } = UserService.get(userId, { name: 1 });

    ActivityService.addEventActivity({
      event: ACTIVITY_EVENT_METADATA.INSURANCE_CHANGE_STATUS,
      details: { prevStatus, nextStatus },
      isServerGenerated: true,
      insuranceLink: { _id: insuranceId },
      title: 'Statut modifié',
      description: `${formattedPrevStatus} -> ${formattedNexStatus}, par ${adminName}`,
      createdBy: userId,
    });
  },
);
