import ServerEventService from '../../events/server/ServerEventService';
import InsuranceRequestService from '../../insuranceRequests/server/InsuranceRequestService';
import RevenueService from './RevenueService';
import { consolidateRevenue } from '../methodDefinitions';

ServerEventService.addAfterMethodListener(
  consolidateRevenue,
  ({ context, params: { revenueId } }) => {
    const { insuranceRequest } = RevenueService.get(revenueId, {
      insuranceRequest: { _id: 1 },
    });

    if (insuranceRequest?._id) {
      InsuranceRequestService.calculateNewStatus({
        insuranceRequestId: insuranceRequest._id,
      });
    }
  },
);
