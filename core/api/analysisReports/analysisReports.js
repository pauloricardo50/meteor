import SimpleSchema from 'simpl-schema';

import { createCollection } from '../helpers/collectionHelpers';
import { createdAt, updatedAt } from '../helpers/sharedSchemas';
import Users from '../users/users';
import { ANALYSIS_REPORTS_COLLECTION } from './analysisReportConstants';

const AnalysisReports = createCollection(ANALYSIS_REPORTS_COLLECTION);

AnalysisReports.attachSchema(
  new SimpleSchema({
    name: String,
    userLink: Object,
    'userLink._id': { type: String, optional: true },
    payload: { type: Object, blackbox: true },
    createdAt,
    updatedAt,
  }),
);

AnalysisReports.addLinks({
  user: { collection: Users, field: 'userLink', metadata: true },
});

export default AnalysisReports;
