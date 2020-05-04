import intl from '../../../utils/intl';
import { ACTIVITY_EVENT_METADATA } from '../../activities/activityConstants';
import ActivityService from '../../activities/server/ActivityService';
import FileService from '../../files/server/FileService';
import UserService from '../../users/server/UserService';
import Insurances from '../insurances';

const { formatMessage } = intl;

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

Insurances.after.remove((userId, { _id }) =>
  FileService.deleteAllFilesForDoc(_id),
);
