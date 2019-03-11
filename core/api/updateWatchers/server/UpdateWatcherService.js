import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import intersection from 'lodash/intersection';
import difference from 'lodash/difference';
import moment from 'moment';

import formatMessage from '../../../utils/intl';
import { toMoney } from '../../../utils/conversionFunctions';
import { percentFormatters } from '../../../utils/formHelpers';
import { BORROWERS_COLLECTION, PROPERTIES_COLLECTION } from '../../constants';
import SlackService from '../../slack/server/SlackService';
import UserService from '../../users/server/UserService';
import CollectionService from '../../helpers/CollectionService';
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
    return updatedFields
      .map((updatedField) => {
        const newValue = doc[updatedField.fieldName];

        // If a value is changed back to its old value, remove it
        if (newValue === updatedField.previousValue) {
          return null;
        }

        if (newValue !== undefined) {
          return { ...updatedField, currentValue: newValue };
        }

        return updatedField;
      })
      .filter(x => x);
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
    return updatedFields.map(field => this.formatField(field)).join('\n');
  }

  formatField({ fieldName, previousValue, currentValue }) {
    const previousValueIsNonEmpty = previousValue
      || (Array.isArray(previousValue) && previousValue.length > 0);

    if (previousValueIsNonEmpty) {
      return `${formatMessage(`Forms.${fieldName}`)}: ${this.formatValue(
        previousValue,
        fieldName,
      )} -> ${this.formatValue(currentValue, fieldName)}`;
    }

    return `${formatMessage(`Forms.${fieldName}`)}: ${this.formatValue(
      currentValue,
      fieldName,
    )}`;
  }

  formatValue(value, parentKey) {
    if (typeof value === 'boolean') {
      return value ? 'Oui' : 'Non';
    }

    if (typeof value === 'number') {
      return value === 0
        ? '0'
        : value > 1
          ? toMoney(value)
          : `${percentFormatters.format(value)}%`;
    }

    if (!value) {
      return '-';
    }

    if (value instanceof Date) {
      return moment(value).format('D/M/YYYY');
    }

    if (Array.isArray(value)) {
      return value.map(item => this.formatValue(item, parentKey)).join('\n');
    }

    if (typeof value === 'object') {
      return Object.keys(value)
        .map((key) => {
          const val = value[key];
          return `${formatMessage(`Forms.${parentKey}.${key}`)}: ${this.formatValue(val, `${parentKey}.${key}`)}`;
        })
        .join(', ');
    }

    return value;
  }

  manageUpdateWatchers({ secondsFromNow }) {
    this.getOldUpdateWatchers({ secondsFromNow }).forEach(updateWatcher =>
      this.processUpdateWatcher(updateWatcher));
  }
}

export default new UpdateWatcherService();
