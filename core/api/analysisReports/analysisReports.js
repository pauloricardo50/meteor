import SimpleSchema from 'simpl-schema';

import { createdAt, updatedAt } from '../helpers/sharedSchemas';
import { createCollection } from '../helpers/collectionHelpers';
import { ANALYSIS_REPORTS_COLLECTION } from './analysisReportConstants';
import Users from '../users/users';

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
