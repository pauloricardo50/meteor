import { Meteor } from 'meteor/meteor';

import SecurityService from '../../security';
import AnalysisReports from '../analysisReports';

Meteor.methods({
  insertAnalysisReport({ name, payload }) {
    SecurityService.checkUserIsAdmin(this.userId);
    return AnalysisReports.insert({
      name,
      userLink: { _id: this.userId },
      payload,
    });
  },
  removeAnalysisReport({ _id }) {
    SecurityService.checkUserIsAdmin(this.userId);
    return AnalysisReports.remove(_id);
  },
  updateAnalysisReport({ _id, name }) {
    SecurityService.checkUserIsAdmin(this.userId);
    return AnalysisReports.update(_id, { $set: { name } });
  },
});
