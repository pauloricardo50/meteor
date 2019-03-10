import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import intersection from 'lodash/intersection';
import difference from 'lodash/difference';

import formatMessage from '../../../utils/intl';
import { BORROWERS_COLLECTION, PROPERTIES_COLLECTION } from '../../constants';
import SlackService from '../../slack/server/SlackService';
import CollectionService from '../../helpers/CollectionService';
import UserService from '../../users/server/UserService';
import UpdateWatchers from './updateWatchers';

class UpdateWatcherService extends CollectionService {
  constructor() {
    super(UpdateWatchers);
  }

  addUpdateWatching({ collection, fields, shouldWatch = () => true }) {
    const that = this;
    const hookHandle = collection.after.update(function (
      userId,
      doc,
      fieldNames,
      modifier,
      options,
    ) {
      console.log('fieldNames:', fieldNames);
      const collectionName = collection._name;
      const changedFields = that.getChangedFields({ fieldNames, fields });

      if (!changedFields || changedFields.length === 0) {
        return;
      }

      if (shouldWatch({ userId, fieldNames })) {
        that.updateWatcher({
          userId,
          collectionName,
          doc,
          changedFields,
          previousDoc: this.previous,
        });
      }
    });

    return hookHandle;
  }

  getChangedFields({ fieldNames, fields }) {
    return intersection(fieldNames, fields);
  }

  updateWatcher({ collectionName, doc, changedFields, previousDoc, userId }) {
    const existingUpdateWatcher = this.findOne({
      collection: collectionName,
      docId: doc._id,
    });

    if (!existingUpdateWatcher) {
      this.insertWatcher({
        userId,
        doc,
        previousDoc,
        collection: collectionName,
        changedFields,
      });
    } else {
      this.update({
        currentWatcher: existingUpdateWatcher,
        doc,
        previousDoc,
        changedFields,
      });
    }
  }

  insertWatcher({ doc, previousDoc, collection, changedFields, userId }) {
    return this.insert({
      userId,
      docId: doc._id,
      collection,
      updatedFields: this.createFieldDiffs({
        previous: previousDoc,
        current: doc,
        fieldNames: changedFields,
      }),
    });
  }

  createFieldDiffs({ previous, current, fieldNames }) {
    return fieldNames
      .map((fieldName) => {
        if (previous[fieldName] === current[fieldName]) {
          return null;
        }

        return {
          fieldName,
          previousValue: previous[fieldName],
          currentValue: current[fieldName],
        };
      })
      .filter(x => x);
  }

  getUpdatedFieldDiffs({ updatedFields, doc }) {
    return updatedFields.map((updatedField) => {
      if (doc[updatedField.fieldName]) {
        return {
          ...updatedField,
          currentValue: doc[updatedField.fieldName],
        };
      }

      return updatedField;
    });
  }

  update({ currentWatcher, doc, previousDoc, changedFields }) {
    const previouslyUpdatedFields = currentWatcher.updatedFields.map(({ fieldName }) => fieldName);
    const newFields = difference(changedFields, previouslyUpdatedFields);

    const updatedDiffs = this.getUpdatedFieldDiffs({
      updatedFields: currentWatcher.updatedFields,
      doc,
    });

    const newDiffs = this.createFieldDiffs({
      current: doc,
      previous: previousDoc,
      fieldNames: newFields,
    });

    return this.baseUpdate(
      { _id: currentWatcher._id },
      { $set: { updatedFields: [...updatedDiffs, ...newDiffs] } },
    );
  }

  getOldUpdateWatchers({ secondsFromNow }) {
    const date = new Date();
    date.setSeconds(date.getSeconds() - secondsFromNow);
    const foundWatchers = this.find({ updatedAt: { $lt: date } }).fetch();

    return foundWatchers;
  }

  processUpdateWatcher({
    _id: updateWatcherId,
    userId,
    docId,
    collection,
    updatedFields,
  }) {
    const user = UserService.fetchOne({
      $filters: { _id: userId },
      assignedEmployee: { email: 1 },
      name: 1,
      roles: 1,
    });

    if (!user) {
      return this.remove(updateWatcherId);
    }

    const title = this.getNotificationTitle({ docId, collection, user });
    SlackService.notifyAssignee({
      currentUser: user,
      title,
      link: `${Meteor.settings.public.subdomains.admin}/${collection}/${docId}`,
      message: this.formatUpdatedFields(updatedFields),
    });

    this.remove(updateWatcherId);
  }

  getNotificationTitle({ docId, collection, user: { name } }) {
    const doc = Mongo.Collection.get(collection).findOne({ _id: docId });

    switch (collection) {
    case BORROWERS_COLLECTION: {
      const { firstName, lastName } = doc;
      return `Modifications pour l'emprunteur "${firstName
          || ''} ${lastName || ''}" par ${name}`;
    }

    case PROPERTIES_COLLECTION: {
      const { address1 } = doc;
      return `Modifications pour le bien immo "${address1}" par ${name}`;
    }

    default:
      return `Modifications dans ${collection} par ${name}`;
    }
  }

  formatUpdatedFields(updatedFields) {
    return updatedFields.map(this.formatField).join('\n');
  }

  formatField({ fieldName, previousValue, currentValue }) {
    if (previousValue) {
      return `${formatMessage(`Forms.${fieldName}`)}: ${previousValue} -> ${currentValue}`;
    }

    return `${formatMessage(`Forms.${fieldName}`)}: ${currentValue}`;
  }

  manageUpdateWatchers({ secondsFromNow }) {
    this.getOldUpdateWatchers({ secondsFromNow }).forEach(updateWatcher =>
      this.processUpdateWatcher(updateWatcher));
  }
}

export default new UpdateWatcherService();
